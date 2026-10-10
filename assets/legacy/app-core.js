
const __futuruss_raw = {master:{},schemes:{},groups:{},group_order:[]};const PROFILES = {};
PROFILES["futuruss"] = {
  id: "futuruss",
  name: "FUTURUSS",
  builtin: true,
  hasAutoGroove: true,
  hasOffsetSchemes: true,
  catalogFile: "Futuruss_catalog_2025.pdf",
  master: __futuruss_raw.master,
  schemes: __futuruss_raw.schemes,
  groups: __futuruss_raw.groups,
  group_order: __futuruss_raw.group_order,
  rules: {},
  grooveOptions: []
};
let currentProfileId = "futuruss";
let DATA = PROFILES[currentProfileId];

// Локальные пользовательские настройки и черновики хранятся через IndexedDB compatibility layer.
// Каталог, комплектации и цены принадлежат серверу Central и в браузере не являются источником данных.
const LocalStore = {
  set(key, value){
    try { FuturussStore.setItem(key, value); return Promise.resolve({key, value}); }
    catch(e){ return Promise.reject(e); }
  },
  get(key){
    try {
      const v = FuturussStore.getItem(key);
      return Promise.resolve(v === null ? null : {key, value: v});
    } catch(e){ return Promise.reject(e); }
  },
  delete(key){
    try { FuturussStore.removeItem(key); return Promise.resolve({key, deleted:true}); }
    catch(e){ return Promise.reject(e); }
  }
};

// ---- Профили фурнитуры (мультибрендовость) ----
// Каждый профиль — независимый набор: своя база артикулов, свои группы, свои комплектации.
// FUTURUSS — встроенный профиль (hasAutoGroove/hasOffsetSchemes включены только у него, так как
// автоподбор по пазу и схемы со смещённой ручкой построены строго под артикулы FUTURUSS).
let customProfileIds = [];

function emptyProfile(id, name){
  return {
    id, name, builtin: false,
    hasAutoGroove: false, hasOffsetSchemes: false,
    catalogFile: "",
    master: {}, schemes: {}, groups: {}, group_order: [], rules: {}, grooveOptions: []
  };
}

function slugifyProfileId(name){
  const base = "profile_" + name.toLowerCase()
    .replace(/[^a-zа-я0-9]+/gi, "_")
    .replace(/^_+|_+$/g, "") || "brand";
  let id = base, n = 2;
  while (PROFILES[id]) { id = base + "_" + n; n++; }
  return id;
}

async function persistProfileList(){
  try {
    const list = customProfileIds.map(id => ({ id, name: PROFILES[id].name }));
    LocalStore && await LocalStore.set("app-profile-list", JSON.stringify(list), false);
  } catch(e){}
}
async function persistProfileData(id){
  if (id === "futuruss") return; // встроенный профиль хранится через уже существующие futuruss-* ключи
  if (!customProfileIds.includes(id)) customProfileIds.push(id);
  await persistProfileList(); // всегда синхронизируем список — не только при первом добавлении профиля
  try {
    const p = PROFILES[id];
    LocalStore && await LocalStore.set("profile-" + id + "-data", JSON.stringify({
      name: p.name, master: p.master, schemes: p.schemes, groups: p.groups, group_order: p.group_order,
      hasAutoGroove: !!p.hasAutoGroove, catalogFile: p.catalogFile || "",
      rules: p.rules || {}, grooveOptions: p.grooveOptions || []
    }), false);
  } catch(e){}
}

async function createNewProfile(){
  const name = (prompt("Название нового бренда фурнитуры (например, ROTO, MACO, VBH):") || "").trim();
  if (!name) return;
  const id = slugifyProfileId(name);
  PROFILES[id] = emptyProfile(id, name);
  customProfileIds.push(id);
  await persistProfileList();
  await persistProfileData(id);
  await switchProfile(id);
  setMsg(`Бренд «${name}» создан и пуст. Загрузите прайс-лист в «База артикулов» и добавьте комплектации в «Настройки → Комплектации».`, "ok");
}

async function deleteCurrentProfile(){
  if (currentProfileId === "futuruss"){ setMsg("Встроенный профиль FUTURUSS удалить нельзя.", "err"); return; }
  const p = PROFILES[currentProfileId];
  if (!confirm(`Удалить бренд «${p.name}» целиком, вместе с базой артикулов и комплектациями? Действие необратимо.`)) return;
  if (currentProfileId === "vhs"){ try { FuturussStore.setItem("vhs-example-dismissed", "1"); } catch(e){} }
  try { LocalStore && await LocalStore.delete("profile-" + currentProfileId + "-data", false); } catch(e){}
  delete PROFILES[currentProfileId];
  customProfileIds = customProfileIds.filter(id => id !== currentProfileId);
  await persistProfileList();
  await switchProfile("futuruss");
  setMsg(`Бренд «${p.name}» удалён.`, "ok");
}

function renameCurrentProfile(){
  if (currentProfileId === "futuruss"){ setMsg("Встроенный профиль FUTURUSS переименовать нельзя.", "err"); return; }
  const p = PROFILES[currentProfileId];
  const name = (prompt("Новое название бренда:", p.name) || "").trim();
  if (!name) return;
  p.name = name;
  persistProfileList();
  persistProfileData(currentProfileId);
  populateProfileSelect();
  setMsg(`Бренд переименован в «${name}».`, "ok");
}

// Переключает активный профиль: перенаправляет DATA на новый профиль и обновляет весь UI,
// который зависит от набора артикулов/схем (не трогает уже добавленные позиции в накладной).
async function switchProfile(id){
  if (!PROFILES[id]) return;
  currentProfileId = id;
  DATA = PROFILES[id];
  try { LocalStore && await LocalStore.set("app-current-profile", id, false); } catch(e){}
  populateProfileSelect();
  applyProfileVisibility();
  populateSchemeSelect();
  document.getElementById("editor-scheme").innerHTML = "";
  populateEditorSchemes();
  populateEditorRanges();
  renderSchemeEditor();
  renderMasterGroups();
  populateRulesSchemeSelect();
  renderRulesEditor();
  updateCatalogButton();
}

function populateProfileSelect(){
  const sel = document.getElementById("profile-select");
  if (!sel) return;
  sel.innerHTML = "";
  const ids = ["futuruss", ...customProfileIds];
  ids.forEach(id => {
    const opt = document.createElement("option");
    opt.value = id; opt.textContent = PROFILES[id].name;
    if (id === currentProfileId) opt.selected = true;
    sel.appendChild(opt);
  });
}

// Показывает/скрывает поля, которые построены строго под артикулы FUTURUSS (паз, микровентиляция,
// приподниматель, пластины, BPR) — для других брендов эти конкретные артикулы не существуют,
// поэтому автоматика для них отключена (см. пояснение в чате).
const FUTURUSS_GROOVES = ["KBE 09","KBE 13","REHAU","VEKA 13 / VHS","Gealan/Ivaper","Deceuninck/Thyssen"];
function currentGrooveOptions(){
  const p = PROFILES[currentProfileId];
  if (p.hasAutoGroove) return FUTURUSS_GROOVES;
  return (p.grooveOptions || []).filter(x => x && x.trim());
}
function populateGrooveSelect(){
  const sel = document.getElementById("grooveType");
  if (!sel) return;
  const prev = sel.value;
  const opts = currentGrooveOptions();
  sel.innerHTML = `<option value="">— не указан —</option>` + opts.map(g => `<option value="${esc(g)}">${esc(g)}</option>`).join("");
  if (opts.includes(prev)) sel.value = prev;
  const block = document.getElementById("groove-block");
  if (block) block.style.display = opts.length ? "" : "none";
}

function applyProfileVisibility(){
  const el = document.getElementById("futuruss-extra-options");
  if (el) el.style.display = PROFILES[currentProfileId].hasAutoGroove ? "" : "none";
  populateGrooveSelect();
  const delBtn = document.getElementById("profile-delete-btn");
  const renameBtn = document.getElementById("profile-rename-btn");
  if (delBtn) delBtn.style.display = currentProfileId === "futuruss" ? "none" : "";
  if (renameBtn) renameBtn.style.display = currentProfileId === "futuruss" ? "none" : "";
}

function updateCatalogButton(){
  const btn = document.getElementById("catalog-tab-btn-el");
  if (!btn) return;
  const file = PROFILES[currentProfileId].catalogFile;
  btn.style.display = file ? "" : "none";
}
function openCatalog(){
  const file = PROFILES[currentProfileId].catalogFile;
  if (file) window.open(file, "_blank");
}

// Полностью пересобирает выпадающий список схем на вкладке "Накладная" под текущий активный профиль.
function populateSchemeSelect(){
  const sel = document.getElementById("scheme");
  if (!sel) return;
  sel.innerHTML = "";
  Object.keys(DATA.schemes).forEach(key => {
    const opt = document.createElement("option");
    opt.value = key; opt.textContent = SCHEME_TITLES[key] || key;
    sel.appendChild(opt);
  });
  if (PROFILES[currentProfileId].hasOffsetSchemes){
    const opt1 = document.createElement("option");
    opt1.value = "offset_roller"; opt1.textContent = SCHEME_TITLES["offset_roller"];
    sel.appendChild(opt1);
    const opt2 = document.createElement("option");
    opt2.value = "offset_mushroom"; opt2.textContent = SCHEME_TITLES["offset_mushroom"];
    sel.appendChild(opt2);
  }
}



const SCHEME_TITLES = {
  "п-отк UPT ": "Поворотно-откидная — стандарт (роликовая цапфа)",
  "противозломная": "Поворотно-откидная — взломостойкая (грибовидная 8/11 мм)",
  "TILT-FIRST": "Поворотно-откидная — Тилт-Фёрст",
  "offset_roller": "Поворотно-откидная — смещённая ручка (роликовая 11 мм)",
  "offset_mushroom": "Поворотно-откидная — смещённая ручка (грибовидная 8/11 мм)",
  "Пов UPT простая": "Поворотная — простая (ШСФ до 700 мм)",
  "Пов UPT 700 расширенная": "Поворотная — стандарт, роликовая (ШСФ до 1400 мм)",
  "пов противовзл широкая": "Поворотная — взломостойкая, широкая"
};

const DEFAULT_PRICE = 500;

// ---- Логическая подборка по фурнитурному пазу (профильной системе) ----
// По факту у фурнитуры есть всего два реальных «ряда» под паз: 9-я серия — только под KBE 09,
// и 13-я серия — под все остальные профильные системы (KBE 13, REHAU, VEKA 13/VHS, Gealan/Ivaper,
// Deceuninck/Thyssen). Поэтому вся подстановка сводится к выбору ряда «9» или «13».
const SERIES_CODES = {
  "9":  { zvCode: "K9", vtfCode: "9",  hookGroup: "KBE 9 mm" },
  "13": { zvCode: "K",  vtfCode: "13", hookGroup: "KBE 13 mm, VEKA, REHAU" }
};
function grooveSeries(groove){
  return groove === "KBE 09" ? "9" : "13";
}
const HOOK_GROOVE_GROUPS = ["KBE 9 mm", "KBE 13 mm, VEKA, REHAU", "GEALAN / IVAPER", "DECEUNINCK"];

// Периметральный зацеп (Z.*): внутри своего ряда встречаются 2 варианта — «усиленный/-Х мм»
// (в названии всегда указано конкретное числовое значение, напр. «-0,5 мм», «3 мм») и «стандартный»
// (без числового значения). Подбираем артикул той же «роли» в целевом ряду.
function substituteHookArticle(art, groove){
  if (!groove) return art;
  const target = SERIES_CODES[grooveSeries(groove)];
  const currentGroup = DATA.groups[art];
  if (!HOOK_GROOVE_GROUPS.includes(currentGroup)) return art;
  if (currentGroup === target.hookGroup) return art;
  const isSpecificVariant = /\d/.test((DATA.master[art] && DATA.master[art].name) || "");
  const candidates = Object.keys(DATA.groups).filter(a => DATA.groups[a] === target.hookGroup);
  const found = candidates.find(a => /\d/.test((DATA.master[a] && DATA.master[a].name) || "") === isSpecificVariant);
  return (found && DATA.master[found]) ? found : art;
}

// Зацепы взломоустойчивые ZVO.*/ZVP.* — код ряда зашит прямо в артикул (ZVO.<код>/<размер>).
function substituteZvArticle(art, groove){
  if (!groove) return art;
  const target = SERIES_CODES[grooveSeries(groove)];
  const m = art.match(/^(ZVO|ZVP)\.(K9|K|R|V|G|D)(\/[\d.,]+)$/);
  if (!m) return art;
  const candidate = `${m[1]}.${target.zvCode}${m[3]}`;
  return DATA.master[candidate] ? candidate : art;
}

// Вставка Тилт-Фёрст VTF.* — код ряда тоже зашит в артикул.
function substituteVtfArticle(art, groove){
  if (!groove) return art;
  const target = SERIES_CODES[grooveSeries(groove)];
  if (!/^VTF\./.test(art)) return art;
  const candidate = `VTF.${target.vtfCode}`;
  return DATA.master[candidate] ? candidate : art;
}

// Зацеп откидной (шпингалетный) XZSP.<ряд>.<сторона> — ряд паза (9/13) зашит в артикуле,
// сторона (Л/П) сохраняется как есть — за неё дальше отвечает подбор по право/лево.
function substituteXzspArticle(art, groove){
  if (!groove) return art;
  const m = art.match(/^XZSP\.(9|13)\.(L|R)$/);
  if (!m) return art;
  const targetSeries = grooveSeries(groove);
  if (m[1] === targetSeries) return art;
  const candidate = `XZSP.${targetSeries}.${m[2]}`;
  return DATA.master[candidate] ? candidate : art;
}

// Петля створки верхняя SV.* — на каждый ряд паза приходится 2 артикула (09/10 — ряд 9-й серии;
// 13/14 — ряд 13-й серии). Текстового различия между ними нет, поэтому при переходе между рядами
// сохраняем ту же позицию в паре (первый ↔ первый, второй ↔ второй).
const SV_ROSTER = { "9": ["SV.09", "SV.10"], "13": ["SV.13", "SV.14"] };
function substituteSvArticle(art, groove){
  if (!groove) return art;
  const targetSeries = grooveSeries(groove);
  for (const series of Object.keys(SV_ROSTER)){
    const idx = SV_ROSTER[series].indexOf(art);
    if (idx !== -1){
      if (series === targetSeries) return art;
      const candidate = SV_ROSTER[targetSeries][idx];
      return DATA.master[candidate] ? candidate : art;
    }
  }
  return art;
}

// Применяет подбор по пазу ко всему списку деталей комплектации; возвращает изменённый список
// и перечень фактических замен (для сообщения пользователю).
// Микровентиляция XZMV.9/XZMV.13 — прямой обмен по ряду.
function substituteXzmvArticle(art, groove){
  if (!groove) return art;
  const target = SERIES_CODES[grooveSeries(groove)];
  if (!/^XZMV\.(9|13)$/.test(art)) return art;
  const candidate = `XZMV.${target.vtfCode}`;
  return DATA.master[candidate] ? candidate : art;
}

// Зацеп приподнимателя ZM9.Z/ZM13.Z (цинк) и ZM9.P/ZM13.P (композит) — ряд меняем,
// разновидность (цинк/композит) сохраняем.
function substituteZmArticle(art, groove){
  if (!groove) return art;
  const target = SERIES_CODES[grooveSeries(groove)];
  const m = art.match(/^ZM(9|13)\.(Z|P)$/);
  if (!m) return art;
  const candidate = `ZM${target.vtfCode}.${m[2]}`;
  return DATA.master[candidate] ? candidate : art;
}

// Скрытый прижим рамная часть PS.R9/PS.R13 — прямой обмен по ряду (в текущих комплектациях
// не используется, но поддержим на будущее, если появится в отредактированной комплектации).
function substitutePsRArticle(art, groove){
  if (!groove) return art;
  const target = SERIES_CODES[grooveSeries(groove)];
  const m = art.match(/^PS\.R(9|13)$/);
  if (!m) return art;
  const candidate = `PS.R${target.vtfCode}`;
  return DATA.master[candidate] ? candidate : art;
}

// Петля поворотно-фрамужная регулируемая FPR.9/10 (ряд 9) и FPR.13/14 (ряд 13) — та же логика
// сохранения позиции в паре, что и у SV.* (тоже не используется в текущих комплектациях,
// но поддержим на будущее).
const FPR_ROSTER = { "9": ["FPR.9", "FPR.10"], "13": ["FPR.13", "FPR.14"] };
function substituteFprArticle(art, groove){
  if (!groove) return art;
  const targetSeries = grooveSeries(groove);
  for (const series of Object.keys(FPR_ROSTER)){
    const idx = FPR_ROSTER[series].indexOf(art);
    if (idx !== -1){
      if (series === targetSeries) return art;
      const candidate = FPR_ROSTER[targetSeries][idx];
      return DATA.master[candidate] ? candidate : art;
    }
  }
  return art;
}

function applyGrooveSubstitution(items, groove){
  if (!groove) return { items, changed: [] };
  const changed = [];
  const out = items.map(([art, qty]) => {
    let newArt = substituteZvArticle(art, groove);
    if (newArt === art) newArt = substituteVtfArticle(art, groove);
    if (newArt === art) newArt = substituteHookArticle(art, groove);
    if (newArt === art) newArt = substituteXzspArticle(art, groove);
    if (newArt === art) newArt = substituteSvArticle(art, groove);
    if (newArt === art) newArt = substituteXzmvArticle(art, groove);
    if (newArt === art) newArt = substituteZmArticle(art, groove);
    if (newArt === art) newArt = substitutePsRArticle(art, groove);
    if (newArt === art) newArt = substituteFprArticle(art, groove);
    if (newArt !== art) changed.push(art + " → " + newArt);
    return [newArt, qty];
  });
  return { items: out, changed };
}

// ---- Логическая подборка по стороне открывания (право/лево) ----
// Явные пары «правый/левый» — берутся напрямую из базы артикулов FUTURUSS, чтобы не путать
// с кодом паза (у ZVO.R/ZVP.R/VTF.R буква R означает REHAU, а не «правый» — обрабатывается отдельно выше).
const HANDED_PAIRS = [
  ["XZSP.9.R", "XZSP.9.L"],
  ["XZSP.13.R", "XZSP.13.L"],
  ["SF.9.R", "SF.9.L"],
  ["SF.13.R", "SF.13.L"],
  ["N.3DS.R.B", "N.3DS.L.B"],
  ["N.3DS.R.K", "N.3DS.L.K"],
  ["ZMS.R", "ZMS.L"],
  ["XU1.R", "XU1.L"]
];
function handedInfoFor(art){
  for (const [r, l] of HANDED_PAIRS){
    if (art === r) return { right: r, left: l };
    if (art === l) return { right: r, left: l };
  }
  return null;
}

const OFFSET_DRIVE_TABLE = {
  roller: [
    [500,700,"POK.500","Привод поворотно-откидной со смещённой ручкой 500-700"],
    [701,800,"XPOK.600-1","Привод поворотно-откидной со смещённой ручкой 600-800-1"],
    [801,1000,"XPOK.800-1","Привод поворотно-откидной со смещённой ручкой 800-1000-1"],
    [1001,1200,"XPOK.1000-1","Привод поворотно-откидной со смещённой ручкой 1001-1200-1"],
    [1201,1400,"XPOK.1200-2","Привод поворотно-откидной со смещённой ручкой 1201-1400-2"],
    [1401,1600,"XPOK.1400-2","Привод поворотно-откидной со смещённой ручкой 1401-1600-2"],
    [1601,1800,"XPOK.1600-2","Привод поворотно-откидной со смещённой ручкой 1601-1800-2"],
    [1801,2000,"XPOK.1800-2","Привод поворотно-откидной со смещённой ручкой 1801-2000-2"],
    [2001,2200,"XPOK.2000-3","Привод поворотно-откидной со смещённой ручкой 2001-2200-3"]
  ],
  mushroom: [
    [500,700,"POK.500","Привод поворотно-откидной со смещённой ручкой 500-700"],
    [701,800,"XPOK.600-1.V","Привод поворотно-откидной со смещённой ручкой и грибовидными цапфами 600-800-1"],
    [801,1000,"XPOK.800-1.V","Привод поворотно-откидной со смещённой ручкой и грибовидными цапфами 800-1000-1"],
    [1001,1200,"XPOK.1000-1.V","Привод поворотно-откидной со смещённой ручкой и грибовидными цапфами 1001-1200-1"],
    [1201,1400,"XPOK.1200-2.V","Привод поворотно-откидной со смещённой ручкой и грибовидными цапфами 1201-1400-2"],
    [1401,1600,"XPOK.1400-2.V","Привод поворотно-откидной со смещённой ручкой и грибовидными цапфами 1401-1600-2"],
    [1601,1800,"XPOK.1600-2.V","Привод поворотно-откидной со смещённой ручкой и грибовидными цапфами 1601-1800-2"],
    [1801,2000,"XPOK.1800-2.V","Привод поворотно-откидной со смещённой ручкой и грибовидными цапфами 1801-2000-2"],
    [2001,2200,"XPOK.2000-3.V","Привод поворотно-откидной со смещённой ручкой и грибовидными цапфами 2001-2200-3"]
  ]
};
const DRIVE_ART_PATTERN = /^(XPO|PO\.740|POK\.790|XPOK)/;

// Изображения деталей приходят только из импортированного Central-каталога. Внешние URL не используются.
const CATEGORY_IMAGES = {};
const FALLBACK_IMG = "data:image/svg+xml;utf8," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f5f2ee"/><circle cx="100" cy="85" r="34" fill="none" stroke="#c8b8a8" stroke-width="6"/><rect x="92" y="115" width="16" height="50" fill="#c8b8a8"/><text x="100" y="185" font-size="13" text-anchor="middle" fill="#8a7d70" font-family="sans-serif">фото недоступно</text></svg>'
);

function categoryFromName(name){
  name = (name || "").toLowerCase();
  if (name.indexOf("накладка") !== -1) return null;
  if (name.indexOf("удлинител") !== -1) return "udl";
  if (name.indexOf("угловая передача") !== -1) return "ugl";
  if (name.indexOf("ножницы") !== -1) return "nozh";
  if (name.indexOf("привод ножниц") !== -1) return "privod_nozh";
  if (name.indexOf("привод поворотно") !== -1) return "privod";
  if (name.indexOf("петл") !== -1 && name.indexOf("рам") !== -1) return "petlya_rama";
  if (name.indexOf("петл") !== -1 && name.indexOf("створк") !== -1) return "petlya_stvorka";
  if (name.indexOf("зацеп откидной") !== -1) return "zацеп_otk";
  return null;
}

const MAX_PHOTOS_PER_ART = 5;
let photoState = { art: null, name: null, context: "invoice", index: 0 };

function getPhotos(art){
  const info = DATA.master[art];
  if (!info) return [];
  if (!info.photos){
    info.photos = info.photo ? [info.photo] : [];
    delete info.photo;
  }
  return info.photos;
}

function showPhoto(art, name, context){
  photoState = { art, name, context: context === "baza" ? "baza" : "invoice", index: 0 };
  renderPhotoModal();
  document.getElementById("photoModal").classList.add("show");
}

function renderPhotoModal(){
  const { art, name, context, index } = photoState;
  const photos = getPhotos(art);
  const hasCustom = photos.length > 0;
  const cat = categoryFromName(name);
  const catImg = cat ? CATEGORY_IMAGES[cat] : null;
  const safeIndex = Math.min(index, Math.max(0, photos.length - 1));
  photoState.index = safeIndex;

  document.getElementById("photo-img").src = hasCustom ? photos[safeIndex] : (catImg ? catImg.url : FALLBACK_IMG);
  document.getElementById("photo-img").classList.remove("zoomed");
  document.getElementById("photo-zoom-icon").innerHTML = '<span class="ui-icon i-zoom-in" aria-hidden="true"></span>';
  document.getElementById("photo-art").textContent = art;
  document.getElementById("photo-name").textContent = name;
  document.getElementById("photo-cap").textContent = hasCustom
    ? `Фото ${safeIndex + 1} из ${photos.length} (загружено вручную)`
    : (catImg ? catImg.label : "Фото для этой позиции не найдено — показан общий вид.");

  const strip = document.getElementById("photo-strip");
  if (photos.length > 1){
    strip.style.display = "flex";
    strip.innerHTML = photos.map((p, i) =>
      `<img src="${esc(p)}" class="photo-strip-thumb${i === safeIndex ? " active" : ""}" onclick="photoState.index=${i}; renderPhotoModal();">`
    ).join("");
  } else {
    strip.style.display = "none";
    strip.innerHTML = "";
  }

  const removeBtn = document.getElementById("photo-remove-btn");
  // Удаление фото разрешено только из вкладки «База артикулов»
  removeBtn.style.display = (context === "baza" && hasCustom && (currentProfileId !== "futuruss" || globalThis.FUTURUSS_AUTH?.role === "central")) ? "inline-block" : "none";
}

function togglePhotoZoom(){
  const img = document.getElementById("photo-img");
  const zoomed = img.classList.toggle("zoomed");
  document.getElementById("photo-zoom-icon").innerHTML = zoomed ? '<span class="ui-icon i-zoom-out" aria-hidden="true"></span>' : '<span class="ui-icon i-zoom-in" aria-hidden="true"></span>';
}
function closePhoto(){
  document.getElementById("photoModal").classList.remove("show");
  document.getElementById("photo-img").classList.remove("zoomed");
  document.getElementById("photo-zoom-icon").innerHTML = '<span class="ui-icon i-zoom-in" aria-hidden="true"></span>';
}

async function attachPhoto(art, files){
  if (!files || !files.length) return;
  const centralCatalog=currentProfileId==='futuruss';
  if (centralCatalog && globalThis.FUTURUSS_AUTH?.role!=='central'){
    setSettingsMsg('master-msg','Общие фото каталога может загружать только пользователь Central.','warn');
    return;
  }
  getPhotos(art);
  const photos=DATA.master[art].photos;
  const remaining=MAX_PHOTOS_PER_ART-photos.length;
  if(!centralCatalog&&remaining<=0){setSettingsMsg('master-msg',`Для ${art} уже загружено максимум ${MAX_PHOTOS_PER_ART} фото — сначала удалите лишние.`,'warn');return;}
  const list=Array.from(files).filter(f=>f.type.startsWith('image/'));
  const toLoad=list.slice(0,centralCatalog?MAX_PHOTOS_PER_ART:remaining);
  if(list.length>toLoad.length)setSettingsMsg('master-msg',`За один раз можно обработать не больше ${toLoad.length} из ${list.length} файлов.`,'warn');
  if(!toLoad.length){setSettingsMsg('master-msg','Выберите файл(ы) изображения.','err');return;}
  const startLength=photos.length;let uploaded=0,updated=0,duplicates=0;
  try{
    for(const file of toLoad){
      const src=await resizeImageFile(file,1200,0.82);
      if(centralCatalog){
        const result=await globalThis.FUTURUSS_SPA.api('catalog_photo_mutate','POST',{article:art,operation:'add',photo:{name:file.name,src}});
        if(result.updated)updated++;else if(result.added)uploaded++;else duplicates++;
      }else{photos.push(src);uploaded++;}
    }
    if(centralCatalog){
      await globalThis.FUTURUSS_SPA.refreshCatalog();
      globalThis.FUTURUSS_SPA.broadcastCatalogUpdate?.();
      renderMasterGroups();
      const saved=getPhotos(art).length;
      setSettingsMsg('master-msg',`Фото для ${art} сохранены на сервере (${saved}/${MAX_PHOTOS_PER_ART}): добавлено ${uploaded}, обновлено ${updated}${duplicates ? "; без изменений " + duplicates : ""}.`,'ok');
      return;
    }
    if(!await persistMaster()){photos.splice(startLength);renderMasterGroups();return;}
    renderMasterGroups();
    setSettingsMsg('master-msg',`Фото для ${art} обновлены (${photos.length}/${MAX_PHOTOS_PER_ART}).`,'ok');
  }catch(err){
    if(centralCatalog){try{await globalThis.FUTURUSS_SPA.refreshCatalog();}catch{}renderMasterGroups();setSettingsMsg('master-msg',uploaded||updated?`На сервере добавлено фото: ${uploaded}, обновлено: ${updated}. Остальные не сохранены: ${err.message}`:'Не удалось загрузить фото на сервер: '+err.message,'err');}
    else{photos.splice(startLength);renderMasterGroups();setSettingsMsg('master-msg','Не удалось обработать или сохранить фото: '+err.message,'err');}
  }
}

async function removeCurrentPhoto(){
  if(photoState.context!=='baza')return;
  const {art}=photoState,photos=getPhotos(art);
  if(!photos.length)return;
  const centralCatalog=currentProfileId==='futuruss';
  if(centralCatalog&&globalThis.FUTURUSS_AUTH?.role!=='central'){
    setSettingsMsg('master-msg','Общие фото каталога может удалять только пользователь Central.','warn');
    return;
  }
  const removed=photos[photoState.index];
  try{
    if(centralCatalog){
      await globalThis.FUTURUSS_SPA.api('catalog_photo_mutate','POST',{article:art,operation:'remove',src:removed});
      await globalThis.FUTURUSS_SPA.refreshCatalog();
      globalThis.FUTURUSS_SPA.broadcastCatalogUpdate?.();
    }else{
      photos.splice(photoState.index,1);
      if(!await persistMaster()){photos.splice(photoState.index,0,removed);return;}
    }
    renderMasterGroups();
    const current=getPhotos(art);
    if(current.length===0)closePhoto();
    else{photoState.index=Math.min(photoState.index,current.length-1);renderPhotoModal();}
    setSettingsMsg('master-msg',`Фото для ${art} удалено с ${centralCatalog?'сервера':'устройства'} (осталось ${current.length}/${MAX_PHOTOS_PER_ART}).`,'ok');
  }catch(error){setSettingsMsg('master-msg','Не удалось удалить фото: '+error.message,'err');}
}

function parseRange(label){
  if (!label) return null;
  const m = label.replace(/\s/g,'').match(/^(\d+)-(\d+)$/);
  if (!m) return null;
  return [parseInt(m[1],10), parseInt(m[2],10)];
}

function findBlock(schemeKey, width, height){
  return matchBlock(schemeKey, width, height).block;
}

// Подбирает блок диапазона. Касание по границе (напр. «530-740» и «740-800» при 740) — не ошибка:
// границу забирает нижний диапазон. Ошибка только при настоящем перекрытии внутренностей.
function matchBlock(schemeKey, width, height){
  const blocks = DATA.schemes[schemeKey] || [];
  let matched = [];
  for (const b of blocks){
    const wr = parseRange(b.w), hr = parseRange(b.h);
    if (!wr || !hr) continue;
    if (width >= wr[0] && width <= wr[1] && height >= hr[0] && height <= hr[1]) matched.push({b, wr, hr});
  }
  if (matched.length > 1){
    const strict = matched.filter(m => (width > m.wr[0] || m.wr[0] === m.wr[1]) && (height > m.hr[0] || m.hr[0] === m.hr[1]));
    if (strict.length === 1) matched = strict;
    else if (strict.length > 1) return { block: null, error: "ambiguous", candidates: strict.map(m => m.b) };
    else matched = [matched[0]];
  }
  return { block: matched.length ? matched[0].b : null, error: matched.length ? null : (blocks.length ? "not_found" : "no_blocks") };
}

// ---- Правила подбора (конструктор) ----
const RULE_PARAMS = {
  height: { label: "ВСФ (высота), мм", numeric: true },
  width:  { label: "ШСФ (ширина), мм", numeric: true },
  weight: { label: "Масса створки, кг", numeric: true },
  side:   { label: "Сторона открывания", numeric: false, values: [["R","Правая"],["L","Левая"]] },
  handle: { label: "Положение ручки", numeric: false, values: [["center","Стандарт (центр)"],["offset","Смещённая"]] },
  groove: { label: "Фурнитурный паз", numeric: false, values: null }
};
function getSchemeRules(schemeKey){
  if (!DATA.rules) DATA.rules = {};
  if (!DATA.rules[schemeKey]) DATA.rules[schemeKey] = { base: [], rules: [] };
  return DATA.rules[schemeKey];
}

// Применяет одно правило к значению параметра. Возвращает {entries:[...], error}.
function applyRule(rule, value){
  const def = RULE_PARAMS[rule.param];
  if (!def) return { entries: [] };
  if (def.numeric){
    if (value === null || value === undefined || value === "" || isNaN(value)) return { entries: [], missingValue: true };
    let m = rule.entries.filter(e => e.from !== "" && e.to !== "" && value >= +e.from && value <= +e.to);
    if (m.length > 1){
      const strict = m.filter(e => value > +e.from || +e.from === +e.to);
      if (strict.length === 1) m = strict; else if (strict.length > 1) return { entries: [], ambiguous: true }; else m = [m[0]];
    }
    return { entries: m };
  }
  const v = String(value || "").trim().toLowerCase();
  if (!v) return { entries: [], missingValue: true };
  return { entries: rule.entries.filter(e => String(e.value || "").trim().toLowerCase() === v) };
}

// Полный подбор: блок диапазона (если есть) + базовый комплект + правила. Возвращает объяснения.
function resolveItems(schemeKey, widthOrParams, heightArg){
  const p = (typeof widthOrParams === "object" && widthOrParams !== null)
    ? widthOrParams
    : { width: widthOrParams, height: heightArg };
  const width = p.width, height = p.height;

  if (schemeKey === "offset_roller" || schemeKey === "offset_mushroom"){
    const variant = schemeKey === "offset_roller" ? "roller" : "mushroom";
    const baseKey = variant === "roller" ? "п-отк UPT " : "противозломная";
    const mb = matchBlock(baseKey, width, height);
    if (!mb.block) return { error: mb.error || "not_found", candidates: mb.candidates };
    const drive = pickOffsetDrive(height, variant);
    let items = mb.block.items.filter(([art]) => !DRIVE_ART_PATTERN.test(art));
    const extra = drive ? [[drive.art, 1]] : [];
    return { items: items.concat(extra), block: mb.block, offsetDrive: drive, sideItems: {R:[], L:[]}, explanations: [], warnings: [] };
  }

  const mb = matchBlock(schemeKey, width, height);
  if (mb.error === "ambiguous") return { error: "ambiguous", candidates: mb.candidates };

  const cfg = (DATA.rules && DATA.rules[schemeKey]) || { base: [], rules: [] };
  const items = [];
  const sideItems = { R: [], L: [] };
  const explanations = [];
  const warnings = [];

  if (mb.block){
    mb.block.items.forEach(([art, qty]) => { items.push([art, qty]); explanations.push({ art, qty, source: `диапазон ШСФ ${mb.block.w} / ВСФ ${mb.block.h}` }); });
  }
  (cfg.base || []).forEach(([art, qty]) => { items.push([art, qty]); explanations.push({ art, qty, source: "базовый комплект" }); });

  (cfg.rules || []).forEach(rule => {
    if (!rule.entries || !rule.entries.length) return; // пустое правило — ничего не подбирает и не предупреждает
    if (rule.param === "side"){
      ["R","L"].forEach(s => {
        const r = applyRule(rule, s);
        r.entries.forEach(e => { sideItems[s].push([e.art, +e.qty || 1]); explanations.push({ art: e.art, qty: +e.qty || 1, source: `правило «${rule.name}» (${s === "R" ? "правая" : "левая"})`, side: s }); });
      });
      return;
    }
    const val = p[rule.param];
    const r = applyRule(rule, val);
    if (r.missingValue){ warnings.push(`правило «${rule.name}»: не указан параметр «${RULE_PARAMS[rule.param].label}»`); return; }
    if (r.ambiguous){ warnings.push(`правило «${rule.name}»: несколько записей подходят под значение ${val} — проверьте границы`); return; }
    if (!r.entries.length){ warnings.push(`правило «${rule.name}»: нет записи для значения «${val}»`); return; }
    r.entries.forEach(e => {
      items.push([e.art, +e.qty || 1]);
      const def = RULE_PARAMS[rule.param];
      const cond = def.numeric ? `${e.from}-${e.to}` : (e.value || "");
      explanations.push({ art: e.art, qty: +e.qty || 1, source: `правило «${rule.name}»: ${cond}` });
    });
  });

  if (!items.length && !sideItems.R.length && !sideItems.L.length){
    return { error: mb.error === "no_blocks" ? "empty" : "not_found", warnings };
  }
  return { items, sideItems, block: mb.block, explanations, warnings };
}

function pickOffsetDrive(height, variant){
  const table = OFFSET_DRIVE_TABLE[variant];
  for (const [lo,hi,art,name] of table){
    if (height >= lo && height <= hi) return {art, name};
  }
  return null;
}

let orderPositions = [];
let posCounter = 0;

function applyOptions(items, opts){
  let out = items.slice();

  // Микровентиляция добавляется в накладную ТОЛЬКО если стоит галочка — вне зависимости от того,
  // что было в схеме по умолчанию. Сначала убираем то, что пришло из комплектации, затем,
  // если галочка стоит, добавляем нужную серию (9/13) под выбранный паз.
  out = out.filter(([art]) => !art.startsWith("XZMV"));
  if (opts.microvent){
    out.push([opts.grooveSeries === "9" ? "XZMV.9" : "XZMV.13", 1]);
  }

  // Приподниматель (MBU + зацеп приподнимателя ZM.*) — та же логика: только по галочке.
  out = out.filter(([art]) => art !== "MBU" && !art.startsWith("ZM"));
  if (opts.lifter){
    out.push(["MBU", 1]);
    out.push([opts.grooveSeries === "9" ? "ZM9.Z" : "ZM13.Z", 1]);
  }

  // Пластины PLS — только по галочке (в схемах по умолчанию их нет).
  if (opts.plsQty > 0) out.push(["PLS", opts.plsQty]);

  // Кнопка-блокиратор поворота ручки BPR — тоже только по галочке, 1 шт. на створку
  // (уже пересчитывается на все створки позиции ниже, здесь — количество "на одну створку").
  out = out.filter(([art]) => art !== "BPR");
  if (opts.bpr) out.push(["BPR", 1]);

  return out;
}

function setMsg(text, cls){
  const el = document.getElementById("msg");
  el.className = "msg " + cls;
  el.textContent = text;
  globalThis.FuturussI18n?.scan?.(el);
}

function addPosition(){
  const schemeKey = document.getElementById("scheme").value;
  const width = parseFloat(document.getElementById("width").value);
  const height = parseFloat(document.getElementById("height").value);
  const qtyRight = parseInt(document.getElementById("qtyRight").value) || 0;
  const qtyLeft = parseInt(document.getElementById("qtyLeft").value) || 0;
  const sashQty = qtyRight + qtyLeft;
  const isFutu = PROFILES[currentProfileId].hasAutoGroove;
  const groove = document.getElementById("grooveType").value || "";
  const weightRaw = document.getElementById("sashWeight").value;
  const weight = weightRaw === "" ? null : parseFloat(weightRaw);
  const handle = document.getElementById("handlePos").value || "center";
  const label = document.getElementById("poslabel").value || ("Позиция " + (orderPositions.length+1));
  const microvent = isFutu && document.getElementById("microvent").checked;
  const lifter = isFutu && document.getElementById("lifter").checked;
  const plsEnabled = isFutu && document.getElementById("plsEnabled").checked;
  const plsQty = plsEnabled ? 1 : 0; // 1 пластина на створку — итоговое кол-во пересчитается ниже на sashQty
  const bpr = isFutu && document.getElementById("bprEnabled").checked;

  if (!width || !height){ setMsg("Укажите ширину и высоту створки.", "err"); return; }
  if (sashQty <= 0){ setMsg("Укажите количество правых и/или левых открываний.", "err"); return; }

  const resolved = resolveItems(schemeKey, { width, height, weight, handle, groove });
  if (resolved.error === "ambiguous"){
    const list = (resolved.candidates || []).map(b => `ШСФ ${b.w} / ВСФ ${b.h}`).join("; ");
    setMsg(`Для этих размеров подходят сразу несколько диапазонов (${list}) — расчёт остановлен, чтобы не выбрать комплект наугад. Исправьте границы в «Настройки → Комплектации».`, "err");
    return;
  }
  if (resolved.error){
    setMsg(resolved.error === "empty"
      ? "У этой схемы пока нет ни диапазонов, ни базового комплекта, ни правил — настройте в «Настройки → Комплектации / Конструктор»."
      : "Для указанных размеров и схемы диапазон в прайс-листе не найден. Проверьте размеры или схему.", "err");
    return;
  }

  // 1) сначала подбираем детали под указанный фурнитурный паз (автоподбор — только FUTURUSS)
  const grooveResult = isFutu ? applyGrooveSubstitution(resolved.items, groove) : { items: resolved.items, changed: [] };
  // 2) затем применяем опции (микровентиляция/приподниматель/PLS)
  const optsGrooveSeries = groove ? grooveSeries(groove) : "9"; // без явного выбора паза используем 9-ю серию — как в базовом прайс-листе
  const finalItems = applyOptions(grooveResult.items, {microvent, lifter, plsQty, bpr, grooveSeries: optsGrooveSeries});

  // 3) собираем строки, для деталей с зависимостью от стороны — раскладываем на правые/левые
  const rows = [];
  finalItems.forEach(([art, perSashQty]) => {
    const handed = handedInfoFor(art);
    const pushRow = (rowArt, rowQty) => {
      if (rowQty <= 0) return;
      const info = DATA.master[rowArt];
      const offsetInfo = (resolved.offsetDrive && resolved.offsetDrive.art === rowArt) ? resolved.offsetDrive : null;
      rows.push({
        art: rowArt,
        name: info ? info.name : (offsetInfo ? offsetInfo.name : rowArt),
        qty: perSashQty * rowQty,
        price: info ? info.price : DEFAULT_PRICE,
        isDefaultPrice: !info
      });
    };
    if (handed && qtyRight > 0 && qtyLeft > 0){
      pushRow(handed.right, qtyRight);
      pushRow(handed.left, qtyLeft);
    } else if (handed && qtyLeft > 0 && qtyRight === 0){
      pushRow(handed.left, sashQty);
    } else if (handed && qtyRight > 0 && qtyLeft === 0){
      pushRow(handed.right, sashQty);
    } else {
      pushRow(art, sashQty);
    }
  });
  // 4) детали из правил по стороне открывания — строго на своё количество створок
  const sideItems = resolved.sideItems || { R: [], L: [] };
  const pushSide = (rowArt, perSashQty, rowQty) => {
    if (rowQty <= 0) return;
    const info = DATA.master[rowArt];
    rows.push({ art: rowArt, name: info ? info.name : rowArt, qty: perSashQty * rowQty, price: info ? info.price : DEFAULT_PRICE, isDefaultPrice: !info });
  };
  sideItems.R.forEach(([a, q]) => pushSide(a, q, qtyRight));
  sideItems.L.forEach(([a, q]) => pushSide(a, q, qtyLeft));

  posCounter++;
  orderPositions.push({
    id: posCounter, label,
    scheme: SCHEME_TITLES[schemeKey] || schemeKey,
    width, height, sashQty, qtyRight, qtyLeft, groove, rows,
    blockRange: resolved.block ? `ШСФ ${resolved.block.w}, ВСФ ${resolved.block.h}` : ""
  });

  const hasDefault = rows.some(r => r.isDefaultPrice);
  let extraNote = "";
  if (groove && grooveResult.changed.length) extraNote += ` Подобрано под паз «${groove}»: ${grooveResult.changed.length} поз.`;
  if (resolved.warnings && resolved.warnings.length) extraNote += " Внимание: " + resolved.warnings.join("; ") + ".";
  const hasWarn = hasDefault || (resolved.warnings && resolved.warnings.length);
  setMsg(`Позиция «${label}» добавлена (${rows.length} строк).` + (hasDefault ? " Есть позиции с ценой по умолчанию 500 ₸." : "") + extraNote, hasWarn ? "warn" : "ok");
  document.getElementById("poslabel").value = "";
  renderOrder();
}

function removePosition(id){
  orderPositions = orderPositions.filter(p => p.id !== id);
  renderOrder();
}
function applyPlateDependencies(pos,nextRows,editedArticle){
  if(pos.plateCalculation?.rule!=='verified-joints-v2'||!globalThis.MatrixCore)return;
  const M=globalThis.MatrixCore,base=M.plateTotal(nextRows,0,pos.plateCalculation.connections),old=pos.rows.filter(r=>r.art==='PLS').reduce((n,r)=>n+r.qty,0);
  if(editedArticle==='PLS'){pos.plateManualAdjustment=nextRows.filter(r=>r.art==='PLS').reduce((n,r)=>n+r.qty,0)-base;return;}
  const wanted=M.plateTotal(nextRows,Number(pos.plateManualAdjustment)||0,pos.plateCalculation.connections);
  if(wanted===old)return;
  const tr=v=>globalThis.FuturussI18n?.translate(v)||v;
  if(!confirm(tr('Пересчитать соединительные пластины PLS?')+' '+old+' → '+wanted+'. '+tr('ОК — пересчитать; Отмена — сохранить текущее количество пластин.'))){pos.plateManualAdjustment=old-base;return;}
  const source=nextRows.find(r=>r.art==='PLS')||pos.rows.find(r=>r.art==='PLS');
  if(!source&&wanted>0){setMsg(tr('Добавьте PLS вручную: строка пластин отсутствует.'),'warn');return;}
  for(let i=nextRows.length-1;i>=0;i--)if(nextRows[i].art==='PLS')nextRows.splice(i,1);
  if(wanted>0)nextRows.push({...source,qty:wanted});
  pos.plateCalculation.quantity=wanted;
}
function applyNodeDependencies(pos,nextRows,editedArticle){
  const oldQty=pos.rows.filter(r=>r.art===editedArticle).reduce((n,r)=>n+r.qty,0),newQty=nextRows.filter(r=>r.art===editedArticle).reduce((n,r)=>n+r.qty,0);
  if(oldQty===newQty)return;
  const ratio=r=>Array.isArray(r.dependencies)?r.dependencies.filter(d=>d.parent===editedArticle).reduce((n,d)=>n+d.ratio,0):(r.dependency?.parent===editedArticle?r.dependency.ratio:0);
  const affected=nextRows.filter(r=>ratio(r)>0);
  if(!affected.length)return;
  const tr=v=>globalThis.FuturussI18n?.translate(v)||v;
  if(affected.filter(r=>/\.[RL]$/.test(r.art)).length>1){setMsg(tr('В просчёте разные стороны открывания. Проверьте количество ответных планок вручную.'),'warn');return;}
  if(!confirm(tr('Пересчитать связанные ответные планки?')+'\n'+affected.map(r=>r.art+': '+r.qty+' → '+Math.max(0,r.qty+(newQty-oldQty)*ratio(r))).join('\n')))return;
  for(const r of affected)r.qty=Math.max(0,r.qty+(newQty-oldQty)*ratio(r));
  for(let i=nextRows.length-1;i>=0;i--)if(affected.includes(nextRows[i])&&nextRows[i].qty===0)nextRows.splice(i,1);
}
function removeRow(posId, rowIdx){
  const pos = orderPositions.find(p => p.id === posId);
  if (!pos) return;
  const edited=pos.rows[rowIdx].art,next=pos.rows.filter((_,i)=>i!==rowIdx).map(r=>({...r}));
  applyNodeDependencies(pos,next,edited);applyPlateDependencies(pos,next,edited);pos.rows=next;
  renderOrder();
}
function updateRowQty(posId, rowIdx, newVal){
  const pos = orderPositions.find(p => p.id === posId);
  if (!pos) return;
  const q = parseFloat(newVal);
  const next=pos.rows.map(r=>({...r}));next[rowIdx].qty=isNaN(q)?0:Math.max(0,q);
  applyNodeDependencies(pos,next,pos.rows[rowIdx].art);applyPlateDependencies(pos,next,pos.rows[rowIdx].art);pos.rows=next;
  renderOrder();
}
function clearOrder(){ orderPositions = []; renderOrder(); setMsg("Накладная очищена.", "ok"); }

function addFreePosition(){
  const label=document.getElementById('poslabel').value.trim();
  const pos={id:++posCounter,freeInvoice:true,label:label||'Свободная заявка',scheme:'Дополнительные товары',rows:[],width:'',height:'',sashQty:'',qtyRight:0,qtyLeft:0,blockRange:''};
  orderPositions.push(pos);document.getElementById('poslabel').value='';renderOrder();
  document.getElementById('add-art-search-'+pos.id)?.focus();
}
function freePriceOwner(){
  const auth=globalThis.FUTURUSS_SPA?.state?.auth||globalThis.FUTURUSS_AUTH||{};
  return JSON.stringify([auth.role||'public',auth.nodeId??null]);
}
function updateFreeRowPrice(posId,index,value){
  const pos=orderPositions.find(p=>p.id===posId),row=pos?.rows[index];
  const canPrice=globalThis.FUTURUSS_SPA?.state?.catalog?.canViewPrices??globalThis.FUTURUSS_CAN_VIEW_PRICES??false;
  if(!pos?.freeInvoice||!row||!canPrice||!DATA.master[row.art])return;
  const price=Number(String(value).replace(',','.'));
  if(!String(value).trim()||!Number.isFinite(price)||price<0){renderOrder();return;}
  row.price=price;row.manualPrice=true;row.manualPriceOwner=freePriceOwner();row.isDefaultPrice=false;renderOrder();
}
function invoiceCombinedRows(positions){
  const combined={};
  for(const pos of positions)for(const row of pos.rows){
    const key=JSON.stringify([row.art,row.price]);
    combined[key]??={art:row.art,name:row.name,qty:0,price:row.price,isDefaultPrice:row.isDefaultPrice};
    combined[key].qty+=row.qty;
  }
  return combined;
}

function updatePositionComment(id,value){
  const pos=orderPositions.find(p=>p.id===id);if(!pos)return;
  pos.comment=String(value);renderOrder();
}

function positionEngineeringNote(row){
  const M=globalThis.MatrixCore;if(!M)return '';
  const stayDrive=/^(?:X?PNB|PNF)\./.test(row.art||'');
  if(!M.camSpec(row.art)?.extension&&!stayDrive)return '';
  const zones=[...new Set((row.placements||[{zone:M.extensionZone(row)}]).map(p=>p.zone))];
  const labels={rear:'со стороны петель',bottom:'снизу',lower:'снизу',front:'спереди, смещение ручки',unknown:'место не задано'};
  const tr=v=>globalThis.FuturussI18n?.translate(v)||v;
  return ' <small class="engineering-note">('+zones.map(z=>esc(tr(labels[z]||labels.unknown))).join(', ')+')</small>';
}
function positionPressureNote(pos){
  const M=globalThis.MatrixCore;if(!M)return '';
  const summary=M.pressureSummary(pos.rows,pos.family),tr=v=>globalThis.FuturussI18n?.translate(v)||v;
  const label=summary.complete?'Точки прижима по цапфам':'Подтверждённые точки прижима';
  const title=summary.complete?'Всего по позиции. Петли и пассивные прижимы не включены.':'Подсчёт неполный. Проверьте детали без подтверждённого числа цапф.';
  return '<span class="pill pressure-summary" title="'+esc(tr(title)+(summary.unknown.length?' '+summary.unknown.join(', '):''))+'">'+esc(tr(label))+': '+summary.points+(summary.complete?'':' · '+esc(tr('требует проверки')))+'</span>';
}

function renderOrder(){
  const policy=globalThis.FUTURUSS_SPA?.state?.catalog?.data?.pricingApplied;
  const canPrice=globalThis.FUTURUSS_SPA?.state?.catalog?.canViewPrices!==false;
  let unavailable=false;
  if(policy)for(const pos of orderPositions)for(const row of pos.rows||[]){
    const record=DATA.master[row.art];row.pricingUnavailable=!record;
    if(!record)unavailable=true;
    if(!(pos.freeInvoice&&row.manualPrice&&row.manualPriceOwner===freePriceOwner()&&record&&canPrice))row.price=record&&canPrice?Number(record.price)||0:0;
    if(!record||!canPrice||row.manualPriceOwner!==freePriceOwner()){delete row.manualPrice;delete row.manualPriceOwner;}row.isDefaultPrice=false;
  }
  document.body.classList.toggle('pricing-invoice-invalid',unavailable);
  let warning=document.getElementById('pricingInvoiceWarning');
  if(unavailable){if(!warning){warning=document.createElement('div');warning.id='pricingInvoiceWarning';warning.setAttribute('role','alert');document.getElementById('positions-container').before(warning);}warning.textContent=globalThis.FuturussPricingText?.('invoice')||'В накладной есть недоступные товары. Удалите отмеченные строки или измените ассортимент.';}
  else warning?.remove();

  const container = document.getElementById("positions-container");
  const results = document.getElementById("results");
  const combinedCard = document.getElementById("combined-card");
  container.innerHTML = "";

  if (orderPositions.length === 0){
    results.classList.remove("show");
    combinedCard.style.display = "none";
    return;
  }

  let grandTotal = 0;
  const combined = invoiceCombinedRows(orderPositions);

  orderPositions.forEach((pos, positionIndex) => {
    let posSubtotal = 0;
    const posDiv = document.createElement("div");
    posDiv.className = "pos-block"+(pos.freeInvoice?" free-invoice":"");
    const displayOrder = groupRowsForDisplay(pos.rows.map((r, i) => i), i => pos.rows[i].art);
    let rowsHtml = displayOrder.map((idx, displayIdx) => {
      const r = pos.rows[idx];
      const sum = r.qty * r.price;
      posSubtotal += sum;

      return `
      <tr data-position-id="${pos.id}" data-row-index="${idx}" class="row-item${r.pricingUnavailable?' pricing-unavailable':''}${isHingeKitArt(r.art) ? ' hinge-kit' : ''}${isDriveArt(r.art) ? ' drive-row' : ''}" ondblclick="showPhoto(${inlineJsArg(r.art)}, ${inlineJsArg(r.name)}, 'invoice')">
        <td>${displayIdx+1}</td>
        <td class="article ${globalThis.FuturussHardwareColors?.cellClass(r.art,DATA.master[r.art]||r)||''}">${esc(r.art)}</td>
        <td class="${globalThis.FuturussHardwareColors?.cellClass(r.art,DATA.master[r.art]||r)||''}">${esc(r.name)}${pos.freeInvoice?'':positionEngineeringNote(r)}</td>
        <td class="num"><input class="qty-input" type="number" value="${r.qty}" min="0" onclick="event.stopPropagation()" onchange="updateRowQty(${pos.id},${idx},this.value)"><span class="invoice-print-only">${esc(r.qty)}</span></td>
        <td class="num${r.isDefaultPrice?' price-default':''}">${pos.freeInvoice&&canPrice?`<input class="qty-input free-price-input" type="number" min="0" step="0.01" aria-label="Цена" value="${r.price.toFixed(2)}" onclick="event.stopPropagation()" onchange="updateFreeRowPrice(${pos.id},${idx},this.value)"><span class="invoice-print-only">${r.price.toFixed(2)}</span>`:r.price.toFixed(2)+(r.isDefaultPrice?'*':'')}</td>
        <td class="num">${sum.toFixed(2)}</td>
        <td>${globalThis.MatrixCore?.strikeRole(r.art)||r.strikeRole?` <button class="small strike-replace" type="button" title="Заменить ответную планку" aria-label="Заменить ответную планку" onclick="event.stopPropagation(); openStrikeReplacement(${pos.id},${idx})"><span class="ui-icon i-pencil" aria-hidden="true"></span></button>`:''}<button class="small danger" onclick="event.stopPropagation(); removeRow(${pos.id},${idx})"><span class="ui-icon i-xmark" aria-hidden="true"></span></button></td>
      </tr>`;
    }).join("");
    grandTotal += posSubtotal;

    posDiv.innerHTML = `
      <div class="invoice-print-only invoice-print-heading"><strong>FUTURUSS</strong><span>${esc(globalThis.FuturussI18n?.translate('Позиционная накладная')||'Позиционная накладная')} № ${positionIndex+1} · ${new Date().toLocaleDateString('ru-RU')}</span></div>
      <div class="pos-title-row">
        <b>${esc(pos.label)}${pos.freeInvoice?' <small class="free-invoice-subtitle">('+esc(globalThis.FuturussI18n?.translate('Дополнительные товары')||'Дополнительные товары')+')</small>':''}</b>
        <button class="small danger" onclick="removePosition(${pos.id})"><span class="ui-icon i-trash" aria-hidden="true"></span>Удалить позицию</button>
      </div>
      ${pos.freeInvoice?'':`<div style="font-size:11px; color:var(--muted);">${esc(pos.scheme)}</div>`}
      ${pos.plateCalculation?.rule==='unverified'?'<p class="hint">'+esc(globalThis.FuturussI18n?.translate('PLS: схема соединений не проверена. Сохранено количество из комплектации; проверьте его вручную.')||'PLS: схема соединений не проверена. Сохранено количество из комплектации; проверьте его вручную.')+'</p>':''}
      ${pos.freeInvoice?'':`<div class="swatch-row">
        ${pos.lowerNode&&pos.lowerNode!=='catalog'?'<span class="pill">'+esc(globalThis.FuturussI18n?.translate(pos.lowerNode==='bolt'?'Шпингалет — вертикальная ответная планка':'Взломостойкий зацеп — нижняя горизонталь')||pos.lowerNode)+'</span>':''}
        <span class="pill">ШСФ ${pos.width}×ВСФ ${pos.height} мм</span>
        <span class="pill">${pos.sashQty} ств. (П: ${pos.qtyRight} / Л: ${pos.qtyLeft})</span>
        <span class="pill">${esc(pos.blockRange)}</span>
        ${pos.groove ? `<span class="pill">Паз: ${esc(pos.groove)}</span>` : ""}
        ${positionPressureNote(pos)}
      </div>`}
      <div class="table-wrap">
        <table>
          <thead><tr><th style="width:20px;">№</th><th>Артикул</th><th>Наименование</th><th class="num">Кол-во</th><th class="num">Цена</th><th class="num">Сумма</th><th></th></tr></thead>
          <tbody>${rowsHtml}</tbody>
          <tfoot><tr class="total"><td colspan="5">Итого по позиции</td><td class="num">${posSubtotal.toFixed(2)}</td><td></td></tr></tfoot>
        </table>
      </div>
      <div class="add-row" style="align-items:flex-start;">
        <div class="art-autocomplete">
          <input type="text" id="add-art-search-${pos.id}" placeholder="Здесь можно вручную добавить в эту позицию ещё одну деталь из базы артикулов — начните вводить артикул или название..." autocomplete="off" oninput="onPosAddArtInput(${pos.id}, this.value)" onfocus="onPosAddArtInput(${pos.id}, this.value)">
          <div class="art-dd" id="add-art-dd-${pos.id}"></div>
        </div>
        <input type="number" id="add-qty-${pos.id}" value="1" min="1">
        <button class="small" onclick="addManualRow(${pos.id})">+ Добавить деталь</button>
      </div>
      <details class="position-comment-editor" ${pos.comment?'open':''}><summary>Комментарий к позиции</summary><textarea aria-label="Комментарий к позиции" rows="2" onchange="updatePositionComment(${pos.id},this.value)">${esc(pos.comment||'')}</textarea></details>
      ${pos.comment?`<div class="invoice-print-only invoice-print-comment"><b>Комментарий к позиции</b><p>${esc(pos.comment)}</p></div>`:''}
      ${renderLayoutSection(pos)}`;
    container.appendChild(posDiv);
  });

  const combinedTbody = document.getElementById("combined-tbody");
  combinedTbody.innerHTML = "";
  const combinedOrder = groupRowsForDisplay(Object.keys(combined).sort(), key => combined[key].art);
  combinedOrder.forEach((key, i) => {
    const c = combined[key],art=c.art;
    const sum = c.qty * c.price;
    const tr = document.createElement("tr");
    tr.className = "row-item" + (isHingeKitArt(art) ? " hinge-kit" : "") + (isDriveArt(art) ? " drive-row" : "");
    tr.dataset.article = art;
    tr.ondblclick = () => showPhoto(art, c.name, "invoice");
    tr.innerHTML = `<td>${i+1}</td><td class="article ${globalThis.FuturussHardwareColors?.cellClass(art,DATA.master[art]||c)||''}">${esc(art)}</td><td class="${globalThis.FuturussHardwareColors?.cellClass(art,DATA.master[art]||c)||''}">${esc(c.name)}</td>
      <td class="num">${c.qty}</td>
      <td class="num${c.isDefaultPrice?' price-default':''}">${c.price.toFixed(2)}${c.isDefaultPrice?'*':''}</td>
      <td class="num">${sum.toFixed(2)}</td>`;
    combinedTbody.appendChild(tr);
  });

  document.getElementById("inv-count").textContent = orderPositions.length;
  document.getElementById("inv-date").textContent = new Date().toLocaleDateString("ru-RU");
  document.getElementById("inv-grand-total").textContent = grandTotal.toFixed(2);
  combinedCard.style.display = "";
  results.classList.add("show");
}

// ---- Excel export/import ----
const SHEETJS_CDN = "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js";
let sheetJsLoadPromise = null;
function ensureSheetJS(){
  if (globalThis.XLSX) return Promise.resolve(globalThis.XLSX);
  if (sheetJsLoadPromise) return sheetJsLoadPromise;
  sheetJsLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SHEETJS_CDN;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.referrerPolicy = "no-referrer";
    script.dataset.futurussLazy = "sheetjs";
    script.onload = () => {
      if (globalThis.XLSX) resolve(globalThis.XLSX);
      else {
        sheetJsLoadPromise = null;
        script.remove();
        reject(new Error("SheetJS загрузился, но Excel API недоступен."));
      }
    };
    script.onerror = () => {
      sheetJsLoadPromise = null;
      script.remove();
      reject(new Error("Не удалось загрузить Excel-модуль SheetJS. Проверьте подключение к интернету и повторите действие."));
    };
    document.head.appendChild(script);
  });
  return sheetJsLoadPromise;
}
function warmSheetJSAfterWindowLoad(){
  const warm = () => {
    ensureSheetJS().catch(error => console.warn("SheetJS background preload failed:", error));
  };
  if (document.readyState === "complete") setTimeout(warm, 0);
  else window.addEventListener("load", warm, {once:true});
}
warmSheetJSAfterWindowLoad();
async function exportToExcel(){
  renderOrder();if(document.body.classList.contains('pricing-invoice-invalid')){setMsg(globalThis.FuturussPricingText?.('invoice'),'err');return;}

  try { await ensureSheetJS(); } catch (error) { setMsg(error.message, "err"); return; }
  const flatRows = [];
  orderPositions.forEach(pos => {
    pos.rows.forEach(r => {
      flatRows.push({
        "Позиция": excelSafe(pos.label), "Схема": excelSafe(pos.scheme), "ШСФ": pos.width, "ВСФ": pos.height, "Створок": pos.sashQty,
        "Правых": pos.qtyRight, "Левых": pos.qtyLeft, "Паз": pos.groove || "",
        "Артикул": excelSafe(r.art), "Наименование": excelSafe(r.name), "Кол-во": r.qty, "Цена": r.price, "Сумма": +(r.qty*r.price).toFixed(2),
        "Цена по умолчанию": r.isDefaultPrice ? "да" : "", "Комментарий к позиции": excelSafe(pos.comment||'')
      });
    });
  });
  const wb = XLSX.utils.book_new();
  const ws1 = XLSX.utils.json_to_sheet(flatRows);
  XLSX.utils.book_append_sheet(wb, ws1, "Накладная");

  const combined = invoiceCombinedRows(orderPositions);
  const combinedRows = Object.keys(combined).sort().map(key => ({
    "Артикул": excelSafe(combined[key].art), "Наименование": excelSafe(combined[key].name), "Кол-во": combined[key].qty,
    "Цена": combined[key].price, "Сумма": +(combined[key].qty*combined[key].price).toFixed(2)
  }));
  const ws2 = XLSX.utils.json_to_sheet(combinedRows);
  XLSX.utils.book_append_sheet(wb, ws2, "Сводная");

  XLSX.writeFile(wb, "nakladnaya_" + new Date().toISOString().slice(0,10) + ".xlsx");
}

// ================= НАСТРОЙКИ =================

const ORIGINAL_MASTER = JSON.parse(JSON.stringify(DATA.master));
const ORIGINAL_SCHEMES = JSON.parse(JSON.stringify(DATA.schemes));

function switchTab(name){
  ["nakladnaya","baza","settings"].forEach(n => {
    document.getElementById("tab-" + n).classList.toggle("active", n === name);
    document.getElementById("tabbtn-" + n).classList.toggle("active", n === name);
  });
  if (name === "baza"){ renderMasterGroups(); }
  if (name === "settings"){
    const schemeSel = document.getElementById("editor-scheme");
    if (!schemeSel.options.length){
      populateEditorSchemes();
      populateEditorRanges();
      renderSchemeEditor();
    }
  }
}

function switchSubtab(name){
  ["komplekt","rules","layout","style","ads"].forEach(n => {
    document.getElementById("subtab-" + n).classList.toggle("active", n === name);
    document.getElementById("subtabbtn-" + n).classList.toggle("active", n === name);
  });
}

function masterOptionsHtml(selectedArt){
  return Object.keys(DATA.master).sort().map(art =>
    `<option value="${esc(art)}"${art === selectedArt ? " selected" : ""}>${esc(art)} — ${esc(DATA.master[art].name)}</option>`
  ).join("");
}

let posAddArtSelected = {};

function onPosAddArtInput(posId, value){
  posAddArtSelected[posId] = null;
  const dd = document.getElementById("add-art-dd-" + posId);
  const matches = articleSearchOptions(value);
  if (!value.trim()){ dd.classList.remove("show"); return; }
  renderArtDropdown(dd, matches, (art) => {
    posAddArtSelected[posId] = art;
    document.getElementById("add-art-search-" + posId).value = `${art} — ${DATA.master[art].name}`;
    dd.classList.remove("show");
  });
}

function addManualRow(posId){
  const pos = orderPositions.find(p => p.id === posId);
  if (!pos) return;
  const art = posAddArtSelected[posId];
  if (!art){ setMsg("Выберите деталь из списка (начните вводить артикул или название и кликните по нужному варианту).", "err"); return; }
  const qty = Number(document.getElementById("add-qty-" + posId).value);
  if(!Number.isFinite(qty)||qty<=0)return;
  const info = DATA.master[art];
  if(!info){setMsg(globalThis.FuturussPricingText?.('unavailable')+art,'err');return;}
  pos.rows.push({art, name: info.name, qty, price: info.price, isDefaultPrice: false});
  posAddArtSelected[posId] = null;
  renderOrder();
}

// ---- База артикулов: группы, экспорт/импорт/сброс, отдельная ячейка редактирования ----
function renderMasterGroups(){
  const container = document.getElementById("master-groups");
  container.innerHTML = "";
  const searchEl = document.getElementById("master-search");
  const query = searchEl ? searchEl.value.trim().toLowerCase() : "";
  const order = DATA.group_order && DATA.group_order.length ? DATA.group_order : ["Все элементы"];
  const byGroup = {};
  Object.keys(DATA.master).forEach(art => {
    const info = DATA.master[art];
    if (query && !art.toLowerCase().includes(query) && !info.name.toLowerCase().includes(query)) return;
    const g = (DATA.groups && DATA.groups[art]) || "Прочее";
    byGroup[g] = byGroup[g] || [];
    byGroup[g].push(art);
  });
  let totalMatches = 0;
  order.concat(Object.keys(byGroup).filter(g => order.indexOf(g) === -1)).forEach(group => {
    const arts = byGroup[group];
    if (!arts || !arts.length) return;
    totalMatches += arts.length;
    const det = document.createElement("details");
    det.className = "group-details";
    if (query) det.open = true; // при активном поиске сразу раскрываем группы с совпадениями
    const rowsHtml = arts.sort().map(art => {
      const info = DATA.master[art];
      const photos = getPhotos(art);
      const thumb = photos.length
        ? `<span class="g-thumb-wrap"><img class="g-thumb" src="${esc(photos[0])}" onclick="showPhoto(${inlineJsArg(art)}, ${inlineJsArg(info.name)}, 'baza')" title="Просмотреть фото (${photos.length}/${MAX_PHOTOS_PER_ART})">${photos.length > 1 ? `<span class="g-thumb-count">${photos.length}</span>` : ""}</span>`
        : `<span class="g-thumb-empty" title="Фото не загружено"></span>`;
      const atLimit = photos.length >= MAX_PHOTOS_PER_ART;
      const photoBtn = atLimit
        ? `<button class="small photo-btn" disabled title="Лимит ${MAX_PHOTOS_PER_ART} фото достигнут"><span class="ui-icon i-camera" aria-hidden="true"></span></button>`
        : `<button class="small photo-btn" title="Прикрепить фото (${photos.length}/${MAX_PHOTOS_PER_ART})" onclick="document.getElementById(${inlineJsArg('photoUpload-'+art)}).click()"><span class="ui-icon i-camera" aria-hidden="true"></span></button>`;
      return `<div class="group-row">
        ${thumb}
        <span class="g-art">${esc(art)}</span>
        <span class="g-name">${esc(info.name)}</span>
        <span class="g-price">${info.price.toFixed(2)}</span>
        ${photoBtn}
        <input type="file" accept="image/*" multiple id="${esc('photoUpload-'+art)}" onchange="attachPhoto(${inlineJsArg(art)}, this.files); this.value='';">
        <button class="small" onclick="openEditCell(${inlineJsArg(art)})"><span class="ui-icon i-pencil" aria-hidden="true"></span></button>
      </div>`;
    }).join("");
    det.innerHTML = `<summary>${esc(group)} <span class="cnt">${arts.length} поз.</span></summary>${rowsHtml}`;
    container.appendChild(det);
  });
  if (query && !totalMatches){
    container.innerHTML = `<div style="text-align:center; color:var(--muted); font-size:12px; padding:16px;">Ничего не найдено по запросу «${esc(query)}». Проверьте написание или попробуйте часть артикула.</div>`;
  }
}
function openEditCell(art){
  const info = DATA.master[art];
  document.getElementById("edit-cell-art").textContent = art;
  document.getElementById("edit-cell-name").value = info.name;
  document.getElementById("edit-cell-price").value = info.price;
  const cell = document.getElementById("edit-cell");
  cell.dataset.art = art;
  cell.classList.add("show");
  cell.scrollIntoView({behavior:"smooth", block:"center"});
}
function closeEditCell(){
  document.getElementById("edit-cell").classList.remove("show");
}
function saveEditCell(){
  const cell = document.getElementById("edit-cell");
  const art = cell.dataset.art;
  if (!art) return;
  const name = document.getElementById("edit-cell-name").value;
  const price = parseFloat(document.getElementById("edit-cell-price").value);
  DATA.master[art].name = name;
  DATA.master[art].price = isNaN(price) ? 0 : price;
  persistMaster();
  renderMasterGroups();
  renderOrder();
  setSettingsMsg("master-msg", `Артикул ${art} обновлён.`, "ok");
  closeEditCell();
}
async function persistMaster(){
  try {
    if (currentProfileId === "futuruss") {
      const localMaster=Object.fromEntries(Object.entries(DATA.master).map(([art,record])=>{const copy={...record};delete copy.photos;delete copy.photo;return [art,copy];}));
      await LocalStore.set("futuruss-master-overrides", JSON.stringify(localMaster), false);
    }
    else {
      const p = PROFILES[currentProfileId];
      await LocalStore.set("profile-" + currentProfileId + "-data", JSON.stringify({name:p.name, master:p.master, schemes:p.schemes, groups:p.groups, group_order:p.group_order, hasAutoGroove:!!p.hasAutoGroove, catalogFile:p.catalogFile||"", rules:p.rules||{}, grooveOptions:p.grooveOptions||[]}), false);
    }
    return true;
  } catch(e){
    setSettingsMsg("master-msg", "Не удалось сохранить базу артикулов: " + e.message, "err");
    return false;
  }
}
async function exportMaster(){
  try { await ensureSheetJS(); } catch (error) { setSettingsMsg("master-msg", error.message, "err"); return; }
  const rows = Object.keys(DATA.master).sort().map(art => ({"Артикул":excelSafe(art), "Наименование":excelSafe(DATA.master[art].name), "Цена":DATA.master[art].price}));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), "База артикулов");
  XLSX.writeFile(wb, `${PROFILES[currentProfileId].name}_baza_artikulov.xlsx`);
}
async function importMaster(file){
  if (!file) return;
  try { await ensureSheetJS(); } catch (error) { setSettingsMsg("master-msg", error.message, "err"); return; }
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const wb = XLSX.read(new Uint8Array(e.target.result), {type:"array"});
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      rows.forEach(r => {
        const art = r["Артикул"];
        if (!art) return;
        const existingPhoto = DATA.master[art] && DATA.master[art].photo;
        DATA.master[art] = {name: r["Наименование"] || art, price: Number(r["Цена"]) || 0};
        if (existingPhoto) DATA.master[art].photo = existingPhoto;
      });
      persistMaster();
      renderMasterGroups();
      renderOrder();
      setSettingsMsg("master-msg", `Импортировано артикулов: ${rows.length}.`, "ok");
    } catch(err){ setSettingsMsg("master-msg", "Ошибка чтения файла: " + err.message, "err"); }
  };
  reader.readAsArrayBuffer(file);
}
function resetMaster(){
  if (currentProfileId === "futuruss"){
    DATA.master = JSON.parse(JSON.stringify(ORIGINAL_MASTER));
    try { LocalStore && LocalStore.delete("futuruss-master-overrides", false); } catch(e){}
    setSettingsMsg("master-msg", "База артикулов сброшена к исходному прайс-листу.", "ok");
  } else {
    if (!confirm("У этого бренда нет «исходного» прайс-листа для отката — полностью очистить базу артикулов?")) return;
    DATA.master = {}; DATA.groups = {}; DATA.group_order = [];
    persistMaster();
    setSettingsMsg("master-msg", "База артикулов очищена. Загрузите прайс-лист заново.", "ok");
  }
  renderMasterGroups();
  renderOrder();
}

// ---- Комплектации: экспорт/импорт/сброс/редактирование ----
function createNewScheme(){
  const nameInput = document.getElementById("new-scheme-name");
  const name = (nameInput.value || "").trim();
  if (!name){ setSettingsMsg("schemes-msg", "Введите название новой схемы.", "err"); return; }
  if (DATA.schemes[name]){ setSettingsMsg("schemes-msg", "Схема с таким названием уже существует — выберите её в списке.", "err"); return; }
  DATA.schemes[name] = [];
  persistSchemes();
  nameInput.value = "";
  populateEditorSchemes();
  document.getElementById("editor-scheme").value = name;
  populateEditorRanges();
  renderSchemeEditor();
  populateSchemeSelect(); populateRulesSchemeSelect(); renderRulesEditor();
  setSettingsMsg("schemes-msg", `Схема «${name}» создана — теперь добавьте диапазон(ы) размеров ниже.`, "ok");
}

function populateEditorSchemes(){
  const sel = document.getElementById("editor-scheme");
  const prevValue = sel.value;
  sel.innerHTML = "";
  const added = {};
  Object.keys(SCHEME_TITLES).forEach(key => {
    if (DATA.schemes[key]){
      const opt = document.createElement("option");
      opt.value = key; opt.textContent = SCHEME_TITLES[key];
      sel.appendChild(opt);
      added[key] = true;
    }
  });
  Object.keys(DATA.schemes).forEach(key => {
    if (!added[key]){
      const opt = document.createElement("option");
      opt.value = key; opt.textContent = key;
      sel.appendChild(opt);
    }
  });
  if (prevValue && DATA.schemes[prevValue]) sel.value = prevValue;
}

let editorSelectedRangeIdx = null;

function populateEditorRanges(){
  editorSelectedRangeIdx = null;
  renderRangeChips();
}
function renderRangeChips(){
  const scheme = document.getElementById("editor-scheme").value;
  const chipsEl = document.getElementById("editor-range-chips");
  const blocks = DATA.schemes[scheme] || [];
  if (!blocks.length){
    chipsEl.innerHTML = `<span class="hint">Для этой схемы пока нет ни одного диапазона — создайте его ниже.</span>`;
    return;
  }
  chipsEl.innerHTML = blocks.map((b, i) =>
    `<button type="button" class="range-chip${i === editorSelectedRangeIdx ? " active" : ""}" onclick="selectRangeChip(${i})">ШСФ ${b.w} / ВСФ ${b.h} <span class="cnt">· ${b.items.length} поз.</span></button>`
  ).join("");
}
function selectRangeChip(idx){
  editorSelectedRangeIdx = idx;
  renderRangeChips();
  renderSchemeEditor();
}

function currentEditorBlock(){
  const scheme = document.getElementById("editor-scheme").value;
  if (!scheme || editorSelectedRangeIdx === null) return null;
  const blocks = DATA.schemes[scheme];
  if (!blocks || !blocks[editorSelectedRangeIdx]) return null;
  return { scheme, idx: editorSelectedRangeIdx, block: blocks[editorSelectedRangeIdx] };
}

function renderSchemeEditor(){
  const ctx = currentEditorBlock();
  const table = document.getElementById("editor-table");
  const addRow = document.getElementById("editor-add-row");
  const blockActions = document.getElementById("editor-block-actions");
  const rangeEdit = document.getElementById("editor-range-edit");
  if (!ctx){
    table.style.display = "none";
    addRow.style.display = "none";
    blockActions.style.display = "none";
    rangeEdit.style.display = "none";
    return;
  }
  const { block } = ctx;
  document.getElementById("editor-w-input").value = block.w;
  document.getElementById("editor-h-input").value = block.h;
  rangeEdit.style.display = "block";

  const tbody = document.getElementById("editor-tbody");
  if (!block.items.length){
    tbody.innerHTML = `<tr><td colspan="4" style="color:var(--muted); text-align:center; padding:10px;">В этом диапазоне пока нет позиций — добавьте первую ниже.</td></tr>`;
  } else {
    tbody.innerHTML = block.items.map(([art, qty], i) => {
      const info = DATA.master[art];
      const nameCell = info ? esc(info.name) : `<span style="color:var(--err);">артикул не найден в базе</span>`;
      const rowLabel = esc(art);
      return `<tr>
        <td>
          <div class="art-autocomplete">
            <input type="text" id="editor-row-input-${i}" value="${rowLabel}" autocomplete="off" oninput="onEditorRowArtInput(${i}, this.value)" onfocus="onEditorRowArtInput(${i}, this.value)">
            <div class="art-dd" id="editor-row-dd-${i}"></div>
          </div>
        </td>
        <td>${nameCell}</td>
        <td><input type="number" min="0" step="1" value="${qty}" style="width:100%;" onchange="changeItemQty(${i}, this.value)"></td>
        <td><button class="small danger" onclick="removeItem(${i})"><span class="ui-icon i-trash" aria-hidden="true"></span></button></td>
      </tr>`;
    }).join("");
  }
  table.style.display = "";

  document.getElementById("editor-add-art-search").value = "";
  editorAddArtSelected = null;
  addRow.style.display = "flex";
  blockActions.style.display = "flex";
}

function persistSchemes(){
  if (currentProfileId === "futuruss"){
    try { LocalStore && LocalStore.set("futuruss-schemes-overrides", JSON.stringify(DATA.schemes), false); } catch(e){}
  } else {
    persistProfileData(currentProfileId);
  }
}
function persistRules(){
  if (currentProfileId === "futuruss"){
    try { LocalStore && LocalStore.set("futuruss-rules-overrides", JSON.stringify({ rules: DATA.rules || {}, grooveOptions: DATA.grooveOptions || [] }), false); } catch(e){}
  } else {
    persistProfileData(currentProfileId);
  }
}

function changeItemQty(i, value){
  const ctx = currentEditorBlock();
  if (!ctx) return;
  const qty = parseFloat(value);
  ctx.block.items[i][1] = isNaN(qty) ? 0 : qty;
  persistSchemes();
  setSettingsMsg("schemes-msg", "Количество обновлено.", "ok");
}

function changeItemArt(i, value){
  const ctx = currentEditorBlock();
  if (!ctx) return;
  ctx.block.items[i][0] = value;
  persistSchemes();
  renderSchemeEditor();
  setSettingsMsg("schemes-msg", "Артикул заменён.", "ok");
}

function removeItem(i){
  const ctx = currentEditorBlock();
  if (!ctx) return;
  ctx.block.items.splice(i, 1);
  persistSchemes();
  renderRangeChips();
  renderSchemeEditor();
  setSettingsMsg("schemes-msg", "Позиция удалена из комплектации.", "ok");
}

// ---- Поиск артикула (автодополнение) для "добавить позицию" и для замены артикула в строке ----
let editorAddArtSelected = null;

function articleSearchOptions(query, limit){
  const q = (query || "").trim().toLowerCase();
  if (!q) return [];
  const arts = Object.keys(DATA.master).filter(a =>
    a.toLowerCase().includes(q) || String(DATA.master[a]?.name || "").toLowerCase().includes(q)
  );
  return arts.sort().slice(0, limit || 30);
}
function renderArtDropdown(dd, matches, onPick){
  if (!matches.length){
    dd.innerHTML = `<div class="art-dd-empty">Ничего не найдено</div>`;
  } else {
    dd.innerHTML = matches.map(a => `<div class="art-dd-item" data-art="${esc(a)}">${esc(a)} — ${esc(DATA.master[a].name)}</div>`).join("");
    Array.from(dd.children).forEach(el => { el.onclick = () => onPick(el.dataset.art); });
  }
  dd.classList.add("show");
}
function onEditorAddArtInput(value){
  editorAddArtSelected = null;
  const dd = document.getElementById("editor-add-art-dd");
  const matches = articleSearchOptions(value);
  if (!value.trim()){ dd.classList.remove("show"); return; }
  renderArtDropdown(dd, matches, (art) => {
    editorAddArtSelected = art;
    document.getElementById("editor-add-art-search").value = `${art} — ${DATA.master[art].name}`;
    dd.classList.remove("show");
  });
}
function onEditorRowArtInput(i, value){
  const dd = document.getElementById("editor-row-dd-" + i);
  const matches = articleSearchOptions(value);
  if (!value.trim()){ dd.classList.remove("show"); return; }
  renderArtDropdown(dd, matches, (art) => {
    changeItemArt(i, art);
    dd.classList.remove("show");
  });
}
document.addEventListener("click", (e) => {
  document.querySelectorAll(".art-dd.show").forEach(dd => {
    if (!dd.parentElement.contains(e.target)) dd.classList.remove("show");
  });
});

function addItemToBlock(){
  const ctx = currentEditorBlock();
  if (!ctx){ setSettingsMsg("schemes-msg", "Сначала выберите схему и диапазон.", "err"); return; }
  const art = editorAddArtSelected;
  const qty = parseFloat(document.getElementById("editor-add-qty").value) || 1;
  if (!art){ setSettingsMsg("schemes-msg", "Выберите артикул из списка (начните вводить и кликните по нужному варианту).", "err"); return; }
  ctx.block.items.push([art, qty]);
  persistSchemes();
  renderRangeChips();
  renderSchemeEditor();
  setSettingsMsg("schemes-msg", `Добавлено: ${art} × ${qty}.`, "ok");
}

// ---- Проверка диапазонов на пересечения и пропуски по размерам ----
function checkRangeIssues(scheme, excludeIdx){
  const blocks = (DATA.schemes[scheme] || []).map((b, i) => ({ i, w: parseRange(b.w), h: parseRange(b.h), b }))
    .filter(x => x.i !== excludeIdx && x.w && x.h);
  const target = excludeIdx !== undefined && DATA.schemes[scheme][excludeIdx]
    ? { w: parseRange(DATA.schemes[scheme][excludeIdx].w), h: parseRange(DATA.schemes[scheme][excludeIdx].h) }
    : null;
  const warnings = [];

  if (target && target.w && target.h){
    blocks.forEach(other => {
      const overlapW = target.w[0] <= other.w[1] && target.w[1] >= other.w[0];
      const overlapH = target.h[0] <= other.h[1] && target.h[1] >= other.h[0];
      if (overlapW && overlapH){
        warnings.push(`пересекается с диапазоном ШСФ ${other.b.w} / ВСФ ${other.b.h}`);
      }
    });
  }

  // Пропуски: группируем диапазоны с одинаковой ВСФ и ищем дыры по ШСФ (и наоборот)
  const allBlocks = (DATA.schemes[scheme] || []).map(b => ({ w: parseRange(b.w), h: parseRange(b.h), b })).filter(x => x.w && x.h);
  const byH = {};
  allBlocks.forEach(x => { byH[x.b.h] = byH[x.b.h] || []; byH[x.b.h].push(x); });
  Object.values(byH).forEach(group => {
    if (group.length < 2) return;
    group.sort((a, b) => a.w[0] - b.w[0]);
    for (let k = 0; k < group.length - 1; k++){
      const gapStart = group[k].w[1] + 1, gapEnd = group[k+1].w[0] - 1;
      if (gapEnd >= gapStart){
        warnings.push(`пропуск по ШСФ ${gapStart}-${gapEnd} между ${group[k].b.w} и ${group[k+1].b.w} (при ВСФ ${group[k].b.h})`);
      }
    }
  });
  const byW = {};
  allBlocks.forEach(x => { byW[x.b.w] = byW[x.b.w] || []; byW[x.b.w].push(x); });
  Object.values(byW).forEach(group => {
    if (group.length < 2) return;
    group.sort((a, b) => a.h[0] - b.h[0]);
    for (let k = 0; k < group.length - 1; k++){
      const gapStart = group[k].h[1] + 1, gapEnd = group[k+1].h[0] - 1;
      if (gapEnd >= gapStart){
        warnings.push(`пропуск по ВСФ ${gapStart}-${gapEnd} между ${group[k].b.h} и ${group[k+1].b.h} (при ШСФ ${group[k].b.w})`);
      }
    }
  });
  return [...new Set(warnings)];
}

function saveRangeEdit(){
  const ctx = currentEditorBlock();
  if (!ctx){ setSettingsMsg("schemes-msg", "Сначала выберите схему и диапазон.", "err"); return; }
  const w = document.getElementById("editor-w-input").value.trim();
  const h = document.getElementById("editor-h-input").value.trim();
  if (!w || !h){ setSettingsMsg("schemes-msg", "Укажите оба диапазона (ШСФ и ВСФ).", "err"); return; }
  ctx.block.w = w;
  ctx.block.h = h;
  persistSchemes();
  renderRangeChips();
  const issues = checkRangeIssues(ctx.scheme, ctx.idx);
  if (issues.length){
    setSettingsMsg("schemes-msg", `Границы сохранены, но есть на что обратить внимание: ${issues.join("; ")}.`, "warn");
  } else {
    setSettingsMsg("schemes-msg", "Границы диапазона сохранены.", "ok");
  }
}

function deleteBlock(){
  const ctx = currentEditorBlock();
  if (!ctx) return;
  if (!confirm(`Удалить диапазон ШСФ ${ctx.block.w} / ВСФ ${ctx.block.h} целиком (${ctx.block.items.length} позиций)? Действие необратимо.`)) return;
  DATA.schemes[ctx.scheme].splice(ctx.idx, 1);
  persistSchemes();
  editorSelectedRangeIdx = null;
  renderRangeChips();
  renderSchemeEditor();
  setSettingsMsg("schemes-msg", "Диапазон удалён.", "ok");
}

function addNewBlock(){
  const scheme = document.getElementById("editor-scheme").value;
  if (!scheme){ setSettingsMsg("schemes-msg", "Сначала выберите схему.", "err"); return; }
  const w = document.getElementById("new-w-input").value.trim();
  const h = document.getElementById("new-h-input").value.trim();
  if (!w || !h){ setSettingsMsg("schemes-msg", "Укажите оба диапазона для нового блока.", "err"); return; }
  DATA.schemes[scheme] = DATA.schemes[scheme] || [];
  DATA.schemes[scheme].push({ w, h, items: [] });
  const newIdx = DATA.schemes[scheme].length - 1;
  persistSchemes();
  editorSelectedRangeIdx = newIdx;
  renderRangeChips();
  renderSchemeEditor();
  document.getElementById("new-w-input").value = "";
  document.getElementById("new-h-input").value = "";
  const issues = checkRangeIssues(scheme, newIdx);
  const base = `Новый диапазон ШСФ ${w} / ВСФ ${h} создан. Добавьте позиции ниже.`;
  setSettingsMsg("schemes-msg", issues.length ? `${base} Обратите внимание: ${issues.join("; ")}.` : base, issues.length ? "warn" : "ok");
}

function duplicateBlock(){
  const ctx = currentEditorBlock();
  if (!ctx){ setSettingsMsg("schemes-msg", "Сначала выберите диапазон для копирования.", "err"); return; }
  const clone = { w: ctx.block.w, h: ctx.block.h, items: ctx.block.items.map(([a, q]) => [a, q]) };
  DATA.schemes[ctx.scheme].splice(ctx.idx + 1, 0, clone);
  persistSchemes();
  editorSelectedRangeIdx = ctx.idx + 1;
  renderRangeChips();
  renderSchemeEditor();
  setSettingsMsg("schemes-msg", `Диапазон продублирован (${clone.items.length} поз.) — задайте новые границы ШСФ/ВСФ и нажмите «Сохранить границы», иначе он совпадает с оригиналом.`, "warn");
}
async function exportSchemes(){
  try { await ensureSheetJS(); } catch (error) { setSettingsMsg("schemes-msg", error.message, "err"); return; }
  const rows = [];
  Object.keys(DATA.schemes).forEach(schemeKey => {
    DATA.schemes[schemeKey].forEach(block => {
      block.items.forEach(([art, qty]) => {
        rows.push({"Схема": excelSafe(schemeKey), "ШСФ": block.w, "ВСФ": block.h, "Артикул": excelSafe(art), "Кол-во": qty});
      });
    });
  });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), "Комплектации");
  XLSX.writeFile(wb, `${PROFILES[currentProfileId].name}_komplektatsii.xlsx`);
}
async function importSchemes(file){
  if (!file) return;
  try { await ensureSheetJS(); } catch (error) { setSettingsMsg("schemes-msg", error.message, "err"); return; }
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const wb = XLSX.read(new Uint8Array(e.target.result), {type:"array"});
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      const rebuilt = {};
      rows.forEach(r => {
        const scheme = r["Схема"], w = String(r["ШСФ"]), h = String(r["ВСФ"]);
        if (!scheme || !w || !h) return;
        rebuilt[scheme] = rebuilt[scheme] || {};
        const key = w + "||" + h;
        rebuilt[scheme][key] = rebuilt[scheme][key] || {w, h, items: []};
        rebuilt[scheme][key].items.push([r["Артикул"], Number(r["Кол-во"]) || 1]);
      });
      const newSchemes = {};
      Object.keys(rebuilt).forEach(scheme => {
        newSchemes[scheme] = Object.values(rebuilt[scheme]);
      });
      DATA.schemes = newSchemes;
      persistSchemes();
      populateEditorSchemes();
      populateEditorRanges();
      renderSchemeEditor();
      populateSchemeSelect();
      setSettingsMsg("schemes-msg", `Импортировано схем: ${Object.keys(newSchemes).length}.`, "ok");
    } catch(err){ setSettingsMsg("schemes-msg", "Ошибка чтения файла: " + err.message, "err"); }
  };
  reader.readAsArrayBuffer(file);
}
function resetSchemes(){
  if (currentProfileId === "futuruss"){
    DATA.schemes = JSON.parse(JSON.stringify(ORIGINAL_SCHEMES));
    try { LocalStore && LocalStore.delete("futuruss-schemes-overrides", false); } catch(e){}
    setSettingsMsg("schemes-msg", "Комплектации сброшены к исходным данным прайс-листа.", "ok");
  } else {
    if (!confirm("У этого бренда нет «исходных» комплектаций для отката — удалить все схемы полностью?")) return;
    DATA.schemes = {};
    persistSchemes();
    setSettingsMsg("schemes-msg", "Все комплектации удалены.", "ok");
  }
  populateEditorSchemes();
  populateEditorRanges();
  renderSchemeEditor();
  populateSchemeSelect();
}

function setSettingsMsg(id, text, cls){
  const el = document.getElementById(id);
  el.className = "msg " + cls;
  el.textContent = text;
}

// ---- Внешний вид ----
function applyStyle(){
  const accent = document.getElementById("style-accent").value;
  const font = document.getElementById("style-font").value;
  const density = document.getElementById("style-density").value;
  document.documentElement.style.setProperty("--accent", accent);
  document.documentElement.style.setProperty("--accent-dark", shadeColor(accent, -18));
  document.body.style.fontSize = font + "px";
  document.body.classList.toggle("comfortable", density === "comfortable");
}
function shadeColor(hex, percent){
  const num = parseInt(hex.replace("#",""), 16);
  let r = (num >> 16) + Math.round(255*percent/100);
  let g = ((num >> 8) & 0x00FF) + Math.round(255*percent/100);
  let b = (num & 0x0000FF) + Math.round(255*percent/100);
  r = Math.max(0, Math.min(255, r)); g = Math.max(0, Math.min(255, g)); b = Math.max(0, Math.min(255, b));
  return "#" + (0x1000000 + r*0x10000 + g*0x100 + b).toString(16).slice(1);
}
// ---- Схема раскладки на створке (условная, по общеотраслевым ориентирам) ----
const LAYOUT_RULES_DEFAULT = { hingeOffset: 150, handleHeightPct: 45, hookOffset: 100, xzspOffset: 220 };
let LAYOUT_RULES = Object.assign({}, LAYOUT_RULES_DEFAULT);

function readLayoutRulesFromForm(){
  return {
    hingeOffset: parseFloat(document.getElementById("layout-hinge-offset").value) || LAYOUT_RULES_DEFAULT.hingeOffset,
    handleHeightPct: parseFloat(document.getElementById("layout-handle-height").value) || LAYOUT_RULES_DEFAULT.handleHeightPct,
    hookOffset: parseFloat(document.getElementById("layout-hook-offset").value) || LAYOUT_RULES_DEFAULT.hookOffset,
    xzspOffset: parseFloat(document.getElementById("layout-xzsp-offset").value) || LAYOUT_RULES_DEFAULT.xzspOffset
  };
}
function saveLayoutRules(){
  LAYOUT_RULES = readLayoutRulesFromForm();
  try {
    LocalStore && LocalStore.set("futuruss-layout-rules", JSON.stringify(LAYOUT_RULES), false);
    setSettingsMsg("layout-msg", "Правила расстановки сохранены — применены ко всем схемам.", "ok");
  } catch(e){ setSettingsMsg("layout-msg", "Не удалось сохранить.", "err"); }
  renderOrder();
}
function resetLayoutRules(){
  LAYOUT_RULES = Object.assign({}, LAYOUT_RULES_DEFAULT);
  document.getElementById("layout-hinge-offset").value = LAYOUT_RULES_DEFAULT.hingeOffset;
  document.getElementById("layout-handle-height").value = LAYOUT_RULES_DEFAULT.handleHeightPct;
  document.getElementById("layout-hook-offset").value = LAYOUT_RULES_DEFAULT.hookOffset;
  document.getElementById("layout-xzsp-offset").value = LAYOUT_RULES_DEFAULT.xzspOffset;
  try { LocalStore && LocalStore.delete("futuruss-layout-rules", false); } catch(e){}
  setSettingsMsg("layout-msg", "Правила расстановки сброшены по умолчанию.", "ok");
  renderOrder();
}

const HOOK_GROOVE_GROUPS_ALL = ["KBE 9 mm", "KBE 13 mm, VEKA, REHAU", "GEALAN / IVAPER", "DECEUNINCK"];
function isPerimeterHookArt(art){ return HOOK_GROOVE_GROUPS_ALL.includes(DATA.groups[art]) || /^ZV[OP]\./.test(art); }
function isHingeArt(art){ return /^SV\.|^SN\./.test(art); }
function isXzspArt(art){ return /^XZSP\./.test(art); }

// Петли и их накладки идут в комплекте (в отличие от остальных деталей, которые каждый раз разные
// по размеру/количеству) — подсвечиваем их в таблице позиции общим фоном, чтобы было видно, что это набор.
const HINGE_KIT_GROUPS = new Set(["петлевая группа", "поворотные петли"]);

// Приводы поворотно-откидные и ножницы — ключевые механизмы, выделяем жирным шрифтом в таблице.
const DRIVE_GROUPS_DISPLAY = new Set([
  "привода поворотно-откидные", "привод ножниц", "привод поворотный", "штульповой привод",
  "Привода поворотно-откидные для штульпового привода",
  "привода поворотно-откидные с грибовидной цапфой", "привод ножниц противовзломные",
  "ножницы пов-отк", "ножницы тилт-фёст", "ножницы поворотно-откидные противовзломные"
]);
function isDriveArt(art){ const name=DATA.master[art]?.name||'';return !/^удлинитель/i.test(name)&&(DRIVE_GROUPS_DISPLAY.has(DATA.groups[art]) || /^(?:привод|ножницы|штульповый привод)/i.test(name)); }
// PN.R/PN.S (средний прижим накладной) и их накладки формально в группе "поворотные петли",
// но это не петли — подсвечивать как петли их не нужно.
const HINGE_KIT_EXCLUDE = new Set(["PN.R", "PN.S", "N.PN.R.B", "N.PN.S.B", "N.PN.R.K", "N.PN.S.K"]);
function isHingeKitArt(art){ return !HINGE_KIT_EXCLUDE.has(art) && (HINGE_KIT_GROUPS.has(DATA.groups[art]) || /^(?:N\.(?:RV|RN|SV|SN|3DS)|RV(?:\.|$)|RN(?:\.|$)|SV\.|SN(?:\.|$)|3DS\.|SF\.|SPK-|SPN-)/.test(art)); }

// PN.R/PN.S (средний прижим накладной) и их накладки — тоже идут комплектом, но это не петли:
// подсвечиваться как петли не должны, а их блок в списке должен идти после блока петель, не перед ним.
const PN_KIT_ARTS = new Set(["PN.R", "PN.S", "N.PN.R.B", "N.PN.S.B", "N.PN.R.K", "N.PN.S.K"]);
function isPnKitArt(art){ return PN_KIT_ARTS.has(art); }

// Группирует элементы так, чтобы все подходящие под predicate шли подряд одним блоком (без других
// наименований между ними) — блок встаёт на место первого встретившегося элемента, остальной порядок
// не меняется.
function groupByPredicate(items, pred){
  const group = items.filter(pred);
  if (!group.length) return items.slice();
  const result = [];
  let inserted = false;
  items.forEach(x => {
    if (pred(x)){
      if (!inserted){ result.push(...group); inserted = true; }
    } else {
      result.push(x);
    }
  });
  return result;
}
function groupHingeKit(items, getArt){ return groupByPredicate(items, x => isHingeKitArt(getArt(x))); }

// Гарантирует, что блок secondPred не окажется раньше блока firstPred — если естественная позиция
// second-блока пришлась выше/раньше, переносит его целиком сразу после first-блока.
function ensureBlockAfter(items, getArt, firstPred, secondPred){
  const firstIdxs = items.filter(x => firstPred(getArt(x)));
  const secondIdxs = items.filter(x => secondPred(getArt(x)));
  if (!firstIdxs.length || !secondIdxs.length) return items;
  const firstBlockEnd = items.indexOf(firstIdxs[firstIdxs.length - 1]);
  const secondBlockStart = items.indexOf(secondIdxs[0]);
  if (secondBlockStart > firstBlockEnd) return items; // уже в правильном порядке
  const withoutSecond = items.filter(x => !secondPred(getArt(x)));
  const insertAt = withoutSecond.indexOf(firstIdxs[firstIdxs.length - 1]) + 1;
  withoutSecond.splice(insertAt, 0, ...secondIdxs);
  return withoutSecond;
}

// Полный порядок отображения строк позиции: сначала группируем петли/накладки, затем PN-комплект
// (гарантированно не выше блока петель).
function groupRowsForDisplay(items, getArt){
  let order = groupByPredicate(items, x => isHingeKitArt(getArt(x)));
  order = groupByPredicate(order, x => isPnKitArt(getArt(x)));
  order = ensureBlockAfter(order, getArt, a => isHingeKitArt(a), a => isPnKitArt(a));
  return order;
}

// Среднее количество деталей данного типа на одну створку позиции (по факту уже посчитанных строк).
function perSashCount(pos, predicate){
  if (!pos.sashQty) return 0;
  const total = pos.rows.filter(r => predicate(r.art)).reduce((s, r) => s + r.qty, 0);
  return total / pos.sashQty;
}

// Рисует условную схему одной створки (SVG). side: "R" (ручка справа, петли слева) или "L" (наоборот).
// mirrored — локальная кнопка «зеркально» на случай, если для вашей номенклатуры сторона считается иначе.
// Небольшие узнаваемые пиктограммы фурнитуры — собственная векторная отрисовка (не фото).
function hingeIconSVG(x, y){
  return `<g>
    <rect x="${x-5}" y="${y-9}" width="10" height="18" rx="3" fill="var(--accent)" stroke="#7a2f1c" stroke-width="0.6"></rect>
    <circle cx="${x}" cy="${y-5}" r="1.2" fill="#3a1a10"></circle>
    <circle cx="${x}" cy="${y+5}" r="1.2" fill="#3a1a10"></circle>
  </g>`;
}
function hookIconSVG(x, y){
  return `<g>
    <path d="M ${x+3} ${y-3.5} q -4.5 0 -4.5 3.5 q 0 3.5 4.5 3.5" fill="none" stroke="#2b6cb0" stroke-width="1.8" stroke-linecap="round"></path>
    <circle cx="${x+3}" cy="${y-3.5}" r="1.2" fill="#2b6cb0"></circle>
  </g>`;
}
function xzspIconSVG(x, y){
  return `<g transform="rotate(45 ${x} ${y})">
    <rect x="${x-4.5}" y="${y-4.5}" width="9" height="9" rx="1.5" fill="#8a4fae" stroke="#5c2f7a" stroke-width="0.6"></rect>
  </g><circle cx="${x}" cy="${y}" r="1.2" fill="#fff"></circle>`;
}
function handleIconSVG(x, y, side){
  const dir = side === "R" ? -1 : 1; // рычаг ручки направлен внутрь створки (к центру)
  const barX = dir > 0 ? x : x - 16;
  return `<g>
    <circle cx="${x}" cy="${y}" r="3" fill="#1d6b38"></circle>
    <rect x="${barX}" y="${y-2.6}" width="16" height="5.2" rx="2.4" fill="#2f8f4e"></rect>
  </g>`;
}

// Размерная линия: засечки на концах + пунктирная линия + подпись значения в мм.
function dimLineV(x, yFrom, yTo, label, textSide){
  const tx = textSide === "left" ? x - 4 : x + 4;
  const anchor = textSide === "left" ? "end" : "start";
  const midY = (yFrom + yTo) / 2;
  return `<g stroke="#9a9186" stroke-width="0.6">
    <line x1="${x}" y1="${yFrom}" x2="${x}" y2="${yTo}" stroke-dasharray="2,2"></line>
    <line x1="${x-2.5}" y1="${yFrom}" x2="${x+2.5}" y2="${yFrom}"></line>
    <line x1="${x-2.5}" y1="${yTo}" x2="${x+2.5}" y2="${yTo}"></line>
  </g>
  <text x="${tx}" y="${midY+2.5}" font-size="7" fill="#5c554d" text-anchor="${anchor}">${label}</text>`;
}
function dimLineH(y, xFrom, xTo, label, textPos){
  const ty = textPos === "above" ? y - 3 : y + 8;
  const midX = (xFrom + xTo) / 2;
  return `<g stroke="#9a9186" stroke-width="0.6">
    <line x1="${xFrom}" y1="${y}" x2="${xTo}" y2="${y}" stroke-dasharray="2,2"></line>
    <line x1="${xFrom}" y1="${y-2.5}" x2="${xFrom}" y2="${y+2.5}"></line>
    <line x1="${xTo}" y1="${y-2.5}" x2="${xTo}" y2="${y+2.5}"></line>
  </g>
  <text x="${midX}" y="${ty}" font-size="7" fill="#5c554d" text-anchor="middle">${label}</text>`;
}

function renderLayoutDiagramSVG(pos, side, mirrored){
  const rules = LAYOUT_RULES;
  const effSide = mirrored ? (side === "R" ? "L" : "R") : side;
  const boxW = 220, boxH = 246, pad = 36;
  const availW = boxW - pad * 2, availH = boxH - pad * 2;
  const ratio = Math.max(0.25, Math.min(4, pos.width / pos.height));
  let rectW, rectH;
  if (ratio >= availW / availH){ rectW = availW; rectH = availW / ratio; }
  else { rectH = availH; rectW = availH * ratio; }
  const x0 = (boxW - rectW) / 2, y0 = (boxH - rectH) / 2;
  const x1 = x0 + rectW, y1 = y0 + rectH;
  const scale = rectW / pos.width;
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  const hingeOffPx = clamp(rules.hingeOffset * scale, 6, rectH / 2 - 4);
  const hookOffPx = clamp(rules.hookOffset * scale, 4, Math.min(rectW, rectH) / 2 - 3);
  const xzspOffPx = clamp(rules.xzspOffset * scale, 6, rectH - 6);
  const handleY = y1 - (rules.handleHeightPct / 100) * rectH;

  const hingeX = effSide === "R" ? x0 : x1;   // петли слева при "справа ручка"
  const handleX = effSide === "R" ? x1 : x0;  // ручка на противоположной стороне от петель
  const lockEdgeX = handleX;
  const hingeIsLeft = hingeX === x0;
  const handleIsRight = handleX === x1;

  const hingeCount = Math.max(2, Math.round(perSashCount(pos, isHingeArt)) || 2);
  const hingeMarks = [];
  for (let i = 0; i < hingeCount; i++){
    const t = hingeCount === 1 ? 0.5 : i / (hingeCount - 1);
    const y = y0 + hingeOffPx + t * (rectH - 2 * hingeOffPx);
    hingeMarks.push(hingeIconSVG(hingeX, y));
  }
  // Размер: отступ верхней петли от угла
  const hingeDim = dimLineV(hingeX + (hingeIsLeft ? -10 : 10), y0, y0 + hingeOffPx, `${rules.hingeOffset} мм`, hingeIsLeft ? "left" : "right");

  // Периметральные зацепы — распределяем пропорционально по трём непетлевым сторонам (верх/низ/сторона ручки)
  const hookTotal = Math.max(0, Math.round(perSashCount(pos, isPerimeterHookArt)));
  const edgeLenH = rectW, edgeLenV = rectH;
  const totalLen = edgeLenH * 2 + edgeLenV;
  const nTop = totalLen ? Math.round(hookTotal * edgeLenH / totalLen) : 0;
  const nBottom = nTop;
  const nLock = Math.max(0, hookTotal - nTop - nBottom);
  const hookMarks = [];
  const spacedPoints = (n, from, to) => {
    if (n <= 0) return [];
    if (n === 1) return [(from + to) / 2];
    const pts = [];
    for (let i = 0; i < n; i++) pts.push(from + (i / (n - 1)) * (to - from));
    return pts;
  };
  spacedPoints(nTop, x0 + hookOffPx, x1 - hookOffPx).forEach(x => hookMarks.push(hookIconSVG(x, y0)));
  spacedPoints(nBottom, x0 + hookOffPx, x1 - hookOffPx).forEach(x => hookMarks.push(hookIconSVG(x, y1)));
  spacedPoints(nLock, y0 + hookOffPx, y1 - hookOffPx).forEach(y => hookMarks.push(hookIconSVG(lockEdgeX, y)));
  // Размер: отступ крайнего зацепа от угла (по верхней стороне)
  const hookDim = nTop > 0 ? dimLineH(y0 - 10, x0, x0 + hookOffPx, `${rules.hookOffset} мм`, "above") : "";

  // Зацеп откидной (шпингалетный) — у верхнего угла на стороне ручки, если он есть в этой позиции для этой стороны
  const hasXzsp = pos.rows.some(r => isXzspArt(r.art) && r.art.endsWith("." + side));
  const xzspMark = hasXzsp ? xzspIconSVG(lockEdgeX, y0 + xzspOffPx) : "";
  const xzspDim = hasXzsp ? dimLineV(lockEdgeX + (handleIsRight ? 10 : -10), y0, y0 + xzspOffPx, `${rules.xzspOffset} мм`, handleIsRight ? "right" : "left") : "";

  const handleMark = handleIconSVG(handleX, handleY, effSide);
  const handleMm = Math.round((rules.handleHeightPct / 100) * pos.height);
  const handleDim = dimLineV(handleX + (handleIsRight ? 10 : -10), y1, handleY, `${handleMm} мм (${rules.handleHeightPct}%)`, handleIsRight ? "right" : "left");

  const svg = `<svg viewBox="0 0 ${boxW} ${boxH}" width="100%" style="max-width:220px; display:block; margin:0 auto;">
    <rect x="${x0}" y="${y0}" width="${rectW}" height="${rectH}" fill="none" stroke="#8a8078" stroke-width="2" rx="2"></rect>
    <rect x="${x0+4}" y="${y0+4}" width="${Math.max(0,rectW-8)}" height="${Math.max(0,rectH-8)}" fill="none" stroke="#c7bfb5" stroke-width="1" stroke-dasharray="3,3"></rect>
    ${hookMarks.join("")}
    ${hingeMarks.join("")}
    ${xzspMark}
    ${handleMark}
    ${hingeDim}
    ${hookDim}
    ${xzspDim}
    ${handleDim}
  </svg>`;
  return svg;
}

function renderRealPhotosGallery(pos){
  const uniqueArts = [...new Set(pos.rows.map(r => r.art))];
  const withPhotos = uniqueArts.filter(art => getPhotos(art).length > 0);
  if (!withPhotos.length) return "";
  const cards = withPhotos.map(art => {
    const photos = getPhotos(art);
    const info = DATA.master[art];
    const safeName = (info ? info.name : art).replace(/'/g,"\\'");
    return `<div style="text-align:center; width:56px;">
      <img src="${photos[0]}" class="g-thumb" style="width:44px; height:44px; cursor:pointer;" onclick="showPhoto('${art.replace(/'/g,"\\'")}', '${safeName}', 'invoice')" title="${art}">
      <div style="font-size:8.5px; color:var(--muted); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${art}</div>
    </div>`;
  }).join("");
  return `<div style="margin-top:8px;">
    <div style="font-size:10px; color:var(--muted); text-align:center; margin-bottom:4px;"><span class="ui-icon i-camera" aria-hidden="true"></span> Реальные фото деталей этой позиции (из «Базы артикулов»)</div>
    <div style="display:flex; gap:8px; justify-content:center; flex-wrap:wrap;">${cards}</div>
  </div>`;
}

function renderLayoutSection(pos){
  const sides = [];
  if (pos.qtyRight > 0) sides.push("R");
  if (pos.qtyLeft > 0) sides.push("L");
  if (!sides.length) return "";
  pos._mirror = pos._mirror || {};
  const diagrams = sides.map(side => {
    const mirrored = !!pos._mirror[side];
    const label = side === "R" ? "Правая (ручка справа)" : "Левая (ручка слева)";
    return `<div style="text-align:center;">
      ${renderLayoutDiagramSVG(pos, side, mirrored)}
      <div style="font-size:10px; color:var(--muted); margin-top:2px;">${label}</div>
      <button class="small" style="margin-top:3px;" onclick="toggleDiagramMirror(${pos.id}, '${side}')"><span class="ui-icon i-rotate" aria-hidden="true"></span>Зеркально</button>
    </div>`;
  }).join("");
  return `<details style="margin-top:10px;">
    <summary style="cursor:pointer; font-size:11.5px; color:var(--muted); font-weight:600;"><span class="ui-icon i-ruler" aria-hidden="true"></span> Условная схема раскладки (не для монтажа)</summary>
    <div style="display:flex; gap:16px; justify-content:center; flex-wrap:wrap; margin-top:8px;">${diagrams}</div>
    <div style="font-size:10px; color:var(--muted); text-align:center; margin-top:4px;">
      <span class="legend-dot legend-blue"></span>зацеп периметральный · <span class="legend-dot legend-orange"></span>петля · <span class="legend-dot legend-purple"></span>зацеп откидной · <span class="legend-dot legend-green"></span>ручка — расстановка условная, по общеотраслевым ориентирам, требует проверки перед монтажом.
      Пунктирные размерные линии показывают отступы в мм — значения берутся из «Настройки → Схема раскладки» и меняются там для всех схем сразу.
      Если сторона петель/ручки показана наоборот — нажмите «Зеркально».
    </div>
    ${renderRealPhotosGallery(pos)}
  </details>`;
}
function toggleDiagramMirror(posId, side){
  const pos = orderPositions.find(p => p.id === posId);
  if (!pos) return;
  pos._mirror = pos._mirror || {};
  pos._mirror[side] = !pos._mirror[side];
  renderOrder();
}

// ---- Рекламные виджеты (2 плавающих места, ротация по кругу) ----
// Ниже — условные примеры акций, чтобы виджеты сразу было видно; замените на реальные
// в «Настройки → Реклама» — это не настоящие предложения компании.
const DEFAULT_AD_CAMPAIGNS = [
  { icon: "", text: "Пример: скидка на объём заказа — замените на реальную акцию", link: "", images: [], video: "" },
  { icon: "🆕", text: "Пример: новинка в базе артикулов — замените на реальную", link: "", images: [], video: "" },
  { icon: "", text: "Пример: бесплатная доставка от суммы заказа — замените на реальную", link: "", images: [], video: "" },
  { icon: "", text: "Пример: свяжитесь с менеджером для консультации — замените на реальный текст", link: "", images: [], video: "" }
];
const MAX_AD_PHOTOS_PER_CAMPAIGN = 10;
// Возвращает массив фото акции, на лету переводя старые данные с одиночным полем image в новый формат.
function getAdImages(c){
  if (!c.images){
    c.images = c.image ? [c.image] : [];
    delete c.image;
  }
  return c.images;
}
let AD_CAMPAIGNS = DEFAULT_AD_CAMPAIGNS.map(c => Object.assign({}, c));
let adSlotIndex = [0, 1];
let adDismissed = { a: false, b: false };
let adRotationTimer = null;

async function loadAdCampaigns(){
  try {
    const r = await LocalStore.get("app-ad-campaigns");
    if (r && r.value){
      const arr = JSON.parse(r.value);
      if (Array.isArray(arr) && arr.length) AD_CAMPAIGNS = arr;
    }
  } catch(e){}
}
async function saveAdCampaigns(){
  try { await LocalStore.set("app-ad-campaigns", JSON.stringify(AD_CAMPAIGNS)); } catch(e){}
}

let heroAdIndex = 0;
let heroAdDismissed = false;

function heroMediaPool(){
  const pool = [];
  AD_CAMPAIGNS.forEach(c => {
    getAdImages(c).forEach(src => pool.push({ src, type: "image", text: c.text, link: c.link }));
    if (c.video) pool.push({ src: c.video, type: "video", text: c.text, link: c.link });
  });
  return pool;
}

function initAdWidgets(){
  try { adDismissed.a = FuturussStore.getItem("ad-widget-a-dismissed") === "1"; } catch(e){}
  try { adDismissed.b = FuturussStore.getItem("ad-widget-b-dismissed") === "1"; } catch(e){}
  try { heroAdDismissed = FuturussStore.getItem("hero-ad-dismissed") === "1"; } catch(e){}
  renderAdWidgets();
  renderHeroBanner();
  if (adRotationTimer) clearInterval(adRotationTimer);
  adRotationTimer = setInterval(() => {
    const widgets = document.getElementById("ad-widgets-container");
    const hero = document.getElementById("hero-ad-banner");
    const visible = node => node && !node.hidden && getComputedStyle(node).display !== "none";
    if (!visible(widgets) && !visible(hero)) return;
    if (AD_CAMPAIGNS.length){
      adSlotIndex[0] = (adSlotIndex[0] + 1) % AD_CAMPAIGNS.length;
      adSlotIndex[1] = (adSlotIndex[1] + 1) % AD_CAMPAIGNS.length;
      renderAdWidgets();
    }
    const pool = heroMediaPool();
    if (pool.length){
      heroAdIndex = (heroAdIndex + 1) % pool.length;
      renderHeroBanner();
    }
  }, 7000);
}

function dismissAdWidget(slot){
  adDismissed[slot] = true;
  try { FuturussStore.setItem("ad-widget-" + slot + "-dismissed", "1"); } catch(e){}
  renderAdWidgets();
}
function dismissHeroBanner(){
  heroAdDismissed = true;
  try { FuturussStore.setItem("hero-ad-dismissed", "1"); } catch(e){}
  renderHeroBanner();
}
function restoreAdWidgets(){
  adDismissed.a = false; adDismissed.b = false; heroAdDismissed = false;
  try {
    FuturussStore.removeItem("ad-widget-a-dismissed");
    FuturussStore.removeItem("ad-widget-b-dismissed");
    FuturussStore.removeItem("hero-ad-dismissed");
  } catch(e){}
  renderAdWidgets();
  renderHeroBanner();
  setSettingsMsg("ads-msg", "Виджеты снова видны на странице.", "ok");
}

function renderAdWidgets(){
  const container = document.getElementById("ad-widgets-container");
  if (!container) return;
  if (!AD_CAMPAIGNS.length){ container.innerHTML = ""; return; }
  const n = AD_CAMPAIGNS.length;
  const slots = [
    { key: "a", idx: adSlotIndex[0] % n, dismissed: adDismissed.a },
    { key: "b", idx: adSlotIndex[1] % n, dismissed: adDismissed.b }
  ];
  // Если акция всего одна — второе место не показываем (дублировать одно и то же незачем).
  const visible = (n > 1 ? slots : slots.slice(0,1)).filter(s => !s.dismissed);
  container.innerHTML = visible.map(s => {
    const c = AD_CAMPAIGNS[s.idx];
    const dots = AD_CAMPAIGNS.map((_, i) => `<span class="ad-dot${i===s.idx?' active':''}"></span>`).join("");
    const inner = `
      <button class="ad-widget-close" onclick="event.preventDefault(); dismissAdWidget('${s.key}')" title="Закрыть" aria-label="Закрыть"><span class="ui-icon i-xmark" aria-hidden="true"></span></button>
      <div class="ad-widget-icon">${c.icon ? esc(c.icon) : '<span class="ui-icon i-megaphone" aria-hidden="true"></span>'}</div>
      <div class="ad-widget-text">${esc(c.text || "")}</div>
      <div class="ad-widget-dots">${dots}</div>
    `;
    const link=safeLink(c.link);
    return link
      ? `<a class="ad-widget" href="${esc(link)}" target="_blank" rel="noopener">${inner}</a>`
      : `<div class="ad-widget">${inner}</div>`;
  }).join("");
}

// ---- Hero-баннер (фото/видео) справа от шапки ----
let heroLayerActive = 0; // какой из двух слоёв сейчас видим — для плавного перехода без резкой смены

function renderHeroBanner(){
  const box = document.getElementById("hero-ad-banner");
  if (!box) return;
  if (heroAdDismissed){ box.innerHTML = ""; box.style.display = "none"; return; }
  box.style.display = "";

  const pool = heroMediaPool();
  if (!pool.length){
    box.innerHTML = `<div class="hero-ad-empty">Здесь появится фото или видео акции — добавьте в «Настройки → Реклама»</div>`;
    return;
  }

  const idx = heroAdIndex % pool.length;
  const item = pool[idx];
  const mediaHtml = item.type === "video"
    ? `<video src="${esc(item.src)}" autoplay muted loop playsinline></video>`
    : `<img src="${esc(item.src)}" alt="${esc(item.text||"")}">`;
  const safeHeroLink=safeLink(item.link);
  const wrapped = safeHeroLink
    ? `<a href="${esc(safeHeroLink)}" target="_blank" rel="noopener" style="display:block; height:100%;">${mediaHtml}</a>`
    : mediaHtml;
  const dots = pool.length > 1
    ? pool.map((_, i) => `<span class="ad-dot${i===idx?' active':''}"></span>`).join("")
    : "";

  // Первый рендер (или после закрытия/восстановления) — создаём оба слоя с нуля, без анимации.
  if (!box.querySelector(".hero-ad-layer")){
    box.innerHTML = `
      <div class="hero-ad-layer active" id="hero-ad-layer-0">${wrapped}</div>
      <div class="hero-ad-layer" id="hero-ad-layer-1"></div>
      <button class="hero-ad-close icon-only" onclick="event.preventDefault(); dismissHeroBanner()" title="Закрыть" aria-label="Закрыть"><span class="ui-icon i-xmark" aria-hidden="true"></span></button>
      <div class="hero-ad-dots" id="hero-ad-dots">${dots}</div>
    `;
    heroLayerActive = 0;
    return;
  }

  // Дальше — плавный кроссфейд: заполняем скрытый слой новым содержимым и переключаем видимость.
  const nextIdx = heroLayerActive === 0 ? 1 : 0;
  const nextLayer = document.getElementById("hero-ad-layer-" + nextIdx);
  const curLayer = document.getElementById("hero-ad-layer-" + heroLayerActive);
  if (!nextLayer || !curLayer) return;
  nextLayer.innerHTML = wrapped;
  void nextLayer.offsetWidth; // форсируем перерасчёт стилей, чтобы CSS-переход отработал корректно
  nextLayer.classList.add("active");
  curLayer.classList.remove("active");
  heroLayerActive = nextIdx;

  const dotsBox = document.getElementById("hero-ad-dots");
  if (dotsBox) dotsBox.innerHTML = dots;
}

// ---- Редактор списка акций (Настройки → Реклама) ----
function renderAdsEditor(){
  const list = document.getElementById("ads-list");
  if (!list) return;
  if (!AD_CAMPAIGNS.length){
    list.innerHTML = `<div class="hint" style="margin-bottom:8px;">Акций пока нет — добавьте хотя бы одну ниже.</div>`;
    return;
  }
  list.innerHTML = AD_CAMPAIGNS.map((c, i) => {
    const images = getAdImages(c);
    const gallery = images.map((src, p) => `
      <span class="ad-photo-thumb-wrap">
        <img src="${esc(src)}" class="ad-media-thumb" title="Фото ${p+1} из ${images.length}">
        <button class="ad-photo-thumb-remove icon-only" onclick="removeAdImage(${i},${p})" title="Убрать это фото"><span class="ui-icon i-xmark" aria-hidden="true"></span></button>
      </span>`).join("");
    const atLimit = images.length >= MAX_AD_PHOTOS_PER_CAMPAIGN;
    const addBtn = atLimit
      ? `<button class="small photo-btn" disabled title="Лимит ${MAX_AD_PHOTOS_PER_CAMPAIGN} фото на акцию достигнут"><span class="ui-icon i-camera" aria-hidden="true"></span> ${images.length}/${MAX_AD_PHOTOS_PER_CAMPAIGN}</button>`
      : `<button class="small photo-btn" onclick="document.getElementById('ad-img-${i}').click()"><span class="ui-icon i-camera" aria-hidden="true"></span> Добавить фото (${images.length}/${MAX_AD_PHOTOS_PER_CAMPAIGN})</button>`;
    return `
    <div class="ad-edit-row" style="flex-wrap:wrap; border-bottom:1px dashed var(--border); padding-bottom:8px;">
      <input type="text" value="${esc(c.icon||"")}" maxlength="4" placeholder="Иконка" style="width:44px; text-align:center; flex:none;" onchange="updateAdField(${i},'icon',this.value)">
      <input type="text" value="${esc(c.text||"")}" placeholder="Текст акции" onchange="updateAdField(${i},'text',this.value)">
      <input type="text" value="${esc(c.link||"")}" placeholder="Ссылка (необязательно)" style="width:150px; flex:none;" onchange="updateAdField(${i},'link',this.value)">
      <button class="small danger" onclick="removeAdCampaign(${i})" title="Удалить акцию"><span class="ui-icon i-trash" aria-hidden="true"></span></button>
      <div style="flex-basis:100%; display:flex; align-items:center; gap:6px; margin-top:4px; flex-wrap:wrap;">
        <div class="ad-photo-gallery">${gallery}</div>
        ${addBtn}
        <input type="file" accept="image/*" multiple id="ad-img-${i}" style="display:none;" onchange="attachAdImage(${i}, this.files); this.value='';">
        <input type="text" value="${(c.video||"").replace(/"/g,'&quot;')}" placeholder="Ссылка на видео .mp4 (необязательно)" style="flex:1; min-width:160px;" onchange="updateAdField(${i},'video',this.value)">
      </div>
    </div>`;
  }).join("");
}
function updateAdField(i, field, value){
  if (!AD_CAMPAIGNS[i]) return;
  AD_CAMPAIGNS[i][field] = value;
}
function addAdCampaignRow(){
  AD_CAMPAIGNS.push({ icon: "", text: "Новая акция", link: "", images: [], video: "" });
  renderAdsEditor();
}
function removeAdCampaign(i){
  AD_CAMPAIGNS.splice(i, 1);
  renderAdsEditor();
}

// Уменьшает и сжимает фото перед сохранением, чтобы не раздувать локальное хранилище браузера.
function resizeImageFile(file, maxWidth, quality){
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => reject(new Error("Не удалось прочитать изображение"));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error("Не удалось прочитать файл"));
    reader.readAsDataURL(file);
  });
}
async function attachAdImage(i, files){
  if (!files || !files.length || !AD_CAMPAIGNS[i]) return;
  const images = getAdImages(AD_CAMPAIGNS[i]);
  const remaining = MAX_AD_PHOTOS_PER_CAMPAIGN - images.length;
  if (remaining <= 0){
    setSettingsMsg("ads-msg", `Для этой акции уже загружено максимум ${MAX_AD_PHOTOS_PER_CAMPAIGN} фото.`, "warn");
    return;
  }
  const list = Array.from(files).filter(f => f.type.startsWith("image/"));
  const toLoad = list.slice(0, remaining);
  if (!toLoad.length){ setSettingsMsg("ads-msg", "Выберите файл(ы) изображения.", "err"); return; }
  if (list.length > remaining){
    setSettingsMsg("ads-msg", `Добавлено ${remaining} из ${list.length} файлов — лимит ${MAX_AD_PHOTOS_PER_CAMPAIGN} фото на акцию.`, "warn");
  }
  try {
    for (const file of toLoad){
      images.push(await resizeImageFile(file, 480, 0.82));
    }
    renderAdsEditor();
    setSettingsMsg("ads-msg", `Фото добавлено (${images.length}/${MAX_AD_PHOTOS_PER_CAMPAIGN}) — нажмите «Сохранить», чтобы применить в баннере.`, "ok");
  } catch(err){ setSettingsMsg("ads-msg", "Не удалось обработать изображение.", "err"); }
}
function removeAdImage(i, photoIdx){
  if (!AD_CAMPAIGNS[i]) return;
  getAdImages(AD_CAMPAIGNS[i]).splice(photoIdx, 1);
  renderAdsEditor();
}

async function saveAdCampaignsFromForm(){
  await saveAdCampaigns();
  renderAdWidgets();
  renderHeroBanner();
  setSettingsMsg("ads-msg", "Акции сохранены и сразу применены в виджетах и баннере.", "ok");
}

// ---- Конструктор правил подбора (Настройки → Конструктор правил) ----
let rulesBaseArtSelected = null;
let rulesEntryArtSelected = {}; // ключ "ruleIdx" -> выбранный артикул для новой записи

function esc(v){ return String(v === undefined || v === null ? "" : v).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
function inlineJsArg(v){ return esc(JSON.stringify(String(v === undefined || v === null ? "" : v)).replace(/[<\u2028\u2029]/g, c => c === "<" ? "\\u003c" : c === "\u2028" ? "\\u2028" : "\\u2029")); }
function excelSafe(v){ const s=String(v === undefined || v === null ? "" : v); return /^[=+\-@]/.test(s) ? "'" + s : s; }
function safeLink(v){ try { const url=new URL(String(v||""), location.href); return /^https?:$/.test(url.protocol) ? url.href : ""; } catch(e){ return ""; } }

function populateRulesSchemeSelect(){
  const sel = document.getElementById("rules-scheme");
  if (!sel) return;
  const prev = sel.value;
  sel.innerHTML = "";
  Object.keys(DATA.schemes).forEach(key => {
    const o = document.createElement("option"); o.value = key; o.textContent = SCHEME_TITLES[key] || key; sel.appendChild(o);
  });
  if (prev && DATA.schemes[prev]) sel.value = prev;
  const gi = document.getElementById("rules-groove-options");
  if (gi){ gi.value = (DATA.grooveOptions || []).join(", "); gi.disabled = !!PROFILES[currentProfileId].hasAutoGroove; }
  const cg = document.getElementById("chk-groove");
  if (cg){
    const opts = currentGrooveOptions();
    cg.innerHTML = `<option value="">Паз: не указан</option>` + opts.map(g => `<option value="${esc(g)}">${g}</option>`).join("");
  }
}
function currentRulesScheme(){
  const sel = document.getElementById("rules-scheme");
  return sel && sel.value && DATA.schemes[sel.value] ? sel.value : null;
}
function saveGrooveOptions(){
  if (PROFILES[currentProfileId].hasAutoGroove){ setSettingsMsg("rules-msg", "У FUTURUSS список пазов фиксированный (автоподбор).", "warn"); return; }
  const raw = document.getElementById("rules-groove-options").value;
  DATA.grooveOptions = raw.split(",").map(x => x.trim()).filter(Boolean);
  persistRules();
  populateGrooveSelect();
  populateRulesSchemeSelect();
  setSettingsMsg("rules-msg", `Сохранено вариантов паза: ${DATA.grooveOptions.length}.`, "ok");
}

function renderRulesEditor(){
  const scheme = currentRulesScheme();
  const baseList = document.getElementById("rules-base-list");
  const rulesList = document.getElementById("rules-list");
  if (!baseList || !rulesList) return;
  if (!scheme){ baseList.innerHTML = `<div class="hint">Сначала создайте схему в «Комплектации».</div>`; rulesList.innerHTML = ""; return; }
  const cfg = getSchemeRules(scheme);

  baseList.innerHTML = cfg.base.length
    ? cfg.base.map(([art, qty], i) => {
        const info = DATA.master[art];
        return `<div class="group-row"><span class="g-art">${esc(art)}</span><span class="g-name">${info ? esc(info.name) : '<span style="color:var(--err)">не найден в базе</span>'}</span>
          <input type="number" min="0" value="${qty}" style="width:60px;" onchange="cfgBaseQty(${i}, this.value)">
          <button class="small danger" onclick="cfgBaseRemove(${i})"><span class="ui-icon i-trash" aria-hidden="true"></span></button></div>`;
      }).join("")
    : `<div class="hint" style="margin-bottom:6px;">Пусто — детали, которые нужны всегда, добавьте ниже (или оставьте пустым, если всё задано диапазонами).</div>`;

  rulesList.innerHTML = cfg.rules.length
    ? cfg.rules.map((rule, ri) => renderRuleCard(rule, ri)).join("")
    : `<div class="hint" style="margin-bottom:6px;">Правил пока нет.</div>`;
}

function renderRuleCard(rule, ri){
  const def = RULE_PARAMS[rule.param] || RULE_PARAMS.height;
  const entries = rule.entries.map((e, ei) => {
    const info = DATA.master[e.art];
    const cond = def.numeric
      ? `<input type="number" value="${esc(e.from)}" placeholder="от" style="width:70px;" onchange="cfgEntryField(${ri},${ei},'from',this.value)"> — <input type="number" value="${esc(e.to)}" placeholder="до" style="width:70px;" onchange="cfgEntryField(${ri},${ei},'to',this.value)">`
      : (def.values
          ? `<select style="width:auto;" onchange="cfgEntryField(${ri},${ei},'value',this.value)">${def.values.map(([v,l]) => `<option value="${v}"${e.value===v?" selected":""}>${l}</option>`).join("")}</select>`
          : `<select style="width:auto;" onchange="cfgEntryField(${ri},${ei},'value',this.value)"><option value="">—</option>${currentGrooveOptions().map(g => `<option value="${esc(g)}"${e.value===g?" selected":""}>${esc(g)}</option>`).join("")}</select>`);
    return `<div class="group-row" style="flex-wrap:wrap;">
      <span style="display:flex; align-items:center; gap:4px; flex:none;">${cond}</span>
      <span class="g-art">${esc(e.art)}</span>
      <span class="g-name">${info ? esc(info.name) : '<span style="color:var(--err)">не найден в базе</span>'}</span>
      <input type="number" min="0" value="${esc(e.qty)}" style="width:60px;" onchange="cfgEntryField(${ri},${ei},'qty',this.value)">
      <button class="small danger" onclick="cfgEntryRemove(${ri},${ei})"><span class="ui-icon i-trash" aria-hidden="true"></span></button>
    </div>`;
  }).join("");

  const newCond = def.numeric
    ? `<input type="number" id="rule-${ri}-from" placeholder="от" style="width:70px;"> — <input type="number" id="rule-${ri}-to" placeholder="до" style="width:70px;">`
    : (def.values
        ? `<select id="rule-${ri}-value" style="width:auto;">${def.values.map(([v,l]) => `<option value="${v}">${l}</option>`).join("")}</select>`
        : `<select id="rule-${ri}-value" style="width:auto;"><option value="">— паз —</option>${currentGrooveOptions().map(g => `<option value="${esc(g)}">${esc(g)}</option>`).join("")}</select>`);

  return `<div class="card" style="padding:10px 12px; margin:8px 0; border:1px dashed var(--border);">
    <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
      <input type="text" value="${esc(rule.name)}" placeholder="Название правила" style="flex:1; min-width:160px;" onchange="cfgRuleName(${ri}, this.value)">
      <span class="pill">${def.label}</span>
      <button class="small danger" onclick="cfgRuleRemove(${ri})"><span class="ui-icon i-trash" aria-hidden="true"></span>Удалить правило</button>
    </div>
    <div style="margin-top:6px;">${entries || `<div class="hint">Записей нет — добавьте условие ниже.</div>`}</div>
    <div class="add-row" style="align-items:flex-start; flex-wrap:wrap;">
      <span style="display:flex; align-items:center; gap:4px; flex:none;">${newCond}</span>
      <div class="art-autocomplete" style="min-width:180px;">
        <input type="text" id="rule-${ri}-art-search" placeholder="Артикул или название..." class="icon-search-input" autocomplete="off" oninput="onRuleArtInput(${ri}, this.value)" onfocus="onRuleArtInput(${ri}, this.value)">
        <div class="art-dd" id="rule-${ri}-art-dd"></div>
      </div>
      <input type="number" id="rule-${ri}-qty" value="1" min="1" style="width:60px;">
      <button class="small" onclick="cfgEntryAdd(${ri})">+ Добавить условие</button>
    </div>
  </div>`;
}

function onRulesBaseArtInput(value){
  rulesBaseArtSelected = null;
  const dd = document.getElementById("rules-base-art-dd");
  if (!value.trim()){ dd.classList.remove("show"); return; }
  renderArtDropdown(dd, articleSearchOptions(value), (art) => {
    rulesBaseArtSelected = art;
    document.getElementById("rules-base-art-search").value = `${art} — ${DATA.master[art].name}`;
    dd.classList.remove("show");
  });
}
function onRuleArtInput(ri, value){
  rulesEntryArtSelected[ri] = null;
  const dd = document.getElementById("rule-" + ri + "-art-dd");
  if (!value.trim()){ dd.classList.remove("show"); return; }
  renderArtDropdown(dd, articleSearchOptions(value), (art) => {
    rulesEntryArtSelected[ri] = art;
    document.getElementById("rule-" + ri + "-art-search").value = `${art} — ${DATA.master[art].name}`;
    dd.classList.remove("show");
  });
}

function addBaseItem(){
  const scheme = currentRulesScheme(); if (!scheme) return;
  if (!rulesBaseArtSelected){ setSettingsMsg("rules-msg", "Выберите артикул из списка.", "err"); return; }
  const qty = parseFloat(document.getElementById("rules-base-qty").value) || 1;
  getSchemeRules(scheme).base.push([rulesBaseArtSelected, qty]);
  rulesBaseArtSelected = null; document.getElementById("rules-base-art-search").value = "";
  persistRules(); renderRulesEditor();
  setSettingsMsg("rules-msg", "Добавлено в базовый комплект.", "ok");
}
function cfgBaseQty(i, v){ const s = currentRulesScheme(); if (!s) return; getSchemeRules(s).base[i][1] = parseFloat(v) || 0; persistRules(); }
function cfgBaseRemove(i){ const s = currentRulesScheme(); if (!s) return; getSchemeRules(s).base.splice(i,1); persistRules(); renderRulesEditor(); }

function addRule(){
  const scheme = currentRulesScheme(); if (!scheme){ setSettingsMsg("rules-msg", "Сначала выберите схему.", "err"); return; }
  const name = (document.getElementById("new-rule-name").value || "").trim();
  const param = document.getElementById("new-rule-param").value;
  if (!name){ setSettingsMsg("rules-msg", "Введите название правила.", "err"); return; }
  if (param === "groove" && !currentGrooveOptions().length){ setSettingsMsg("rules-msg", "Сначала задайте варианты паза для этого бренда (выше).", "err"); return; }
  getSchemeRules(scheme).rules.push({ id: Date.now(), name, param, entries: [] });
  document.getElementById("new-rule-name").value = "";
  persistRules(); renderRulesEditor();
  setSettingsMsg("rules-msg", `Правило «${name}» создано — добавьте условия.`, "ok");
}
function cfgRuleName(ri, v){ const s = currentRulesScheme(); if (!s) return; getSchemeRules(s).rules[ri].name = v; persistRules(); }
function cfgRuleRemove(ri){
  const s = currentRulesScheme(); if (!s) return;
  const r = getSchemeRules(s).rules[ri];
  if (!confirm(`Удалить правило «${r.name}» со всеми условиями?`)) return;
  getSchemeRules(s).rules.splice(ri,1); persistRules(); renderRulesEditor();
}
function cfgEntryAdd(ri){
  const s = currentRulesScheme(); if (!s) return;
  const rule = getSchemeRules(s).rules[ri];
  const def = RULE_PARAMS[rule.param];
  const art = rulesEntryArtSelected[ri];
  if (!art){ setSettingsMsg("rules-msg", "Выберите артикул из списка.", "err"); return; }
  const qty = parseFloat(document.getElementById("rule-" + ri + "-qty").value) || 1;
  const entry = { art, qty };
  if (def.numeric){
    const from = document.getElementById("rule-" + ri + "-from").value, to = document.getElementById("rule-" + ri + "-to").value;
    if (from === "" || to === "" || +from > +to){ setSettingsMsg("rules-msg", "Укажите корректные границы «от — до».", "err"); return; }
    entry.from = +from; entry.to = +to;
    const clash = rule.entries.find(e => Math.min(+e.to, entry.to) - Math.max(+e.from, entry.from) > 0);
    if (clash) setSettingsMsg("rules-msg", `Внимание: условие ${entry.from}-${entry.to} перекрывается с ${clash.from}-${clash.to} — при расчёте будет ошибка неоднозначности.`, "warn");
  } else {
    entry.value = document.getElementById("rule-" + ri + "-value").value;
    if (!entry.value){ setSettingsMsg("rules-msg", "Выберите значение условия.", "err"); return; }
  }
  rule.entries.push(entry);
  rulesEntryArtSelected[ri] = null;
  persistRules(); renderRulesEditor();
}
function cfgEntryField(ri, ei, field, v){
  const s = currentRulesScheme(); if (!s) return;
  const e = getSchemeRules(s).rules[ri].entries[ei];
  e[field] = (field === "value") ? v : (v === "" ? "" : parseFloat(v));
  persistRules();
}
function cfgEntryRemove(ri, ei){ const s = currentRulesScheme(); if (!s) return; getSchemeRules(s).rules[ri].entries.splice(ei,1); persistRules(); renderRulesEditor(); }

function runRulesCheck(){
  const scheme = currentRulesScheme(); if (!scheme){ setSettingsMsg("chk-msg", "Выберите схему.", "err"); return; }
  const width = parseFloat(document.getElementById("chk-width").value), height = parseFloat(document.getElementById("chk-height").value);
  if (!width || !height){ setSettingsMsg("chk-msg", "Укажите ШСФ и ВСФ.", "err"); return; }
  const wraw = document.getElementById("chk-weight").value;
  const params = { width, height, weight: wraw === "" ? null : parseFloat(wraw), handle: document.getElementById("chk-handle").value, groove: document.getElementById("chk-groove").value };
  const side = document.getElementById("chk-side").value;
  const res = resolveItems(scheme, params);
  const table = document.getElementById("chk-table"), tbody = document.getElementById("chk-tbody");
  if (res.error){
    table.style.display = "none";
    const msg = res.error === "ambiguous"
      ? `Неоднозначность: подходят сразу несколько диапазонов — ${(res.candidates||[]).map(b => `ШСФ ${b.w} / ВСФ ${b.h}`).join("; ")}.`
      : (res.error === "empty" ? "Схема пустая: нет ни диапазонов, ни базового комплекта, ни правил." : "Диапазон для этих размеров не найден.");
    setSettingsMsg("chk-msg", msg + ((res.warnings||[]).length ? " " + res.warnings.join("; ") : ""), "err");
    return;
  }
  const rows = [];
  let sum = 0;
  res.explanations.forEach(x => {
    if (x.side && x.side !== side) return;
    const info = DATA.master[x.art];
    const price = info ? info.price : DEFAULT_PRICE;
    sum += price * x.qty;
    rows.push(`<tr><td class="art">${esc(x.art)}</td><td>${info ? esc(info.name) : '<span style="color:var(--err)">не найден</span>'}</td><td>${x.qty}</td><td>${price.toFixed(2)}</td><td style="font-size:10.5px; color:var(--muted);">${esc(x.source)}</td></tr>`);
  });
  tbody.innerHTML = rows.join("");
  table.style.display = "";
  const w = (res.warnings||[]);
  setSettingsMsg("chk-msg", `Позиций: ${rows.length}, сумма на одну створку: ${sum.toFixed(2)}.` + (w.length ? " Предупреждения: " + w.join("; ") : ""), w.length ? "warn" : "ok");
}

function saveStyle(){
  const style = {
    accent: document.getElementById("style-accent").value,
    font: document.getElementById("style-font").value,
    density: document.getElementById("style-density").value
  };
  try {
    LocalStore && LocalStore.set("futuruss-style", JSON.stringify(style), false);
    setSettingsMsg("style-msg", "Оформление сохранено как основное.", "ok");
  } catch(e){ setSettingsMsg("style-msg", "Не удалось сохранить.", "err"); }
}
function resetStyle(){
  document.getElementById("style-accent").value = "#7452bd";
  document.getElementById("style-font").value = 14;
  document.getElementById("style-density").value = "compact";
  applyStyle();
  try { LocalStore && LocalStore.delete("futuruss-style", false); } catch(e){}
  setSettingsMsg("style-msg", "Оформление сброшено по умолчанию.", "ok");
}

// ---- Загрузка сохранённых данных и полная инициализация интерфейса при открытии ----
(async function initApp(){
  try {
    // 1. Восстанавливаем пользовательские бренды (профили), если они уже создавались раньше
    const listRes = await LocalStore.get("app-profile-list").catch(()=>null);
    if (listRes && listRes.value) {
      try {
        const list = JSON.parse(listRes.value);
        for (const item of list){
          const dataRes = await LocalStore.get("profile-" + item.id + "-data").catch(()=>null);
          if (dataRes && dataRes.value){
            try {
              const pd = JSON.parse(dataRes.value);
              PROFILES[item.id] = {
                id: item.id, name: pd.name || item.name, builtin: false,
                hasAutoGroove: !!pd.hasAutoGroove, hasOffsetSchemes: false,
                catalogFile: pd.catalogFile || "",
                master: pd.master || {}, schemes: pd.schemes || {},
                groups: pd.groups || {}, group_order: pd.group_order || [],
                rules: pd.rules || {}, grooveOptions: pd.grooveOptions || []
              };
              if (!customProfileIds.includes(item.id)) customProfileIds.push(item.id);
            } catch(e){}
          }
        }
      } catch(e){}
    }

    // 2. Правки пользователя поверх встроенного прайс-листа FUTURUSS
    const m = await LocalStore.get("futuruss-master-overrides").catch(()=>null);
    if (m && m.value) { try { PROFILES.futuruss.master = JSON.parse(m.value); } catch(e){} }
    const s = await LocalStore.get("futuruss-schemes-overrides").catch(()=>null);
    if (s && s.value) { try { PROFILES.futuruss.schemes = JSON.parse(s.value); } catch(e){} }
    const rr = await LocalStore.get("futuruss-rules-overrides").catch(()=>null);
    if (rr && rr.value) { try { const o = JSON.parse(rr.value); PROFILES.futuruss.rules = o.rules || {}; PROFILES.futuruss.grooveOptions = o.grooveOptions || []; } catch(e){} }

    // 3. Какой бренд был активен в прошлый раз
    const cp = await LocalStore.get("app-current-profile").catch(()=>null);
    if (cp && cp.value && PROFILES[cp.value]) currentProfileId = cp.value;
    DATA = PROFILES[currentProfileId];

    // 4. Схема раскладки и внешний вид — общие настройки, не завязаны на конкретный бренд
    const lr = await LocalStore.get("futuruss-layout-rules").catch(()=>null);
    if (lr && lr.value) {
      try {
        LAYOUT_RULES = Object.assign({}, LAYOUT_RULES_DEFAULT, JSON.parse(lr.value));
        document.getElementById("layout-hinge-offset").value = LAYOUT_RULES.hingeOffset;
        document.getElementById("layout-handle-height").value = LAYOUT_RULES.handleHeightPct;
        document.getElementById("layout-hook-offset").value = LAYOUT_RULES.hookOffset;
        document.getElementById("layout-xzsp-offset").value = LAYOUT_RULES.xzspOffset;
      } catch(e){}
    }
    const st = await LocalStore.get("futuruss-style").catch(()=>null);
    if (st && st.value) {
      try {
        const style = JSON.parse(st.value);
        document.getElementById("style-accent").value = style.accent;
        document.getElementById("style-font").value = style.font;
        document.getElementById("style-density").value = style.density;
        applyStyle();
      } catch(e){}
    }
    await loadAdCampaigns();
  } catch(e){ /* хранилище недоступно (например, приватный режим браузера) — работаем с данными по умолчанию */ }

  // 5. Заполняем интерфейс под активный бренд — выполняется всегда, даже если сохранённых
  // данных не было (иначе форма накладной осталась бы пустой при первом запуске).
  populateProfileSelect();
  applyProfileVisibility();
  populateSchemeSelect();
  updateCatalogButton();
  populateEditorSchemes();
  populateEditorRanges();
  renderSchemeEditor();
  renderMasterGroups();
  populateRulesSchemeSelect();
  renderRulesEditor();
  renderAdsEditor();
  initAdWidgets();
})();


// SPA bridge: keep one calculator DOM alive while session/price permissions change without reload.
globalThis.FuturussLegacyApp = {
  syncOrderPrices(canViewPrices){
    try{
      const visible=!!canViewPrices;
      for(const pos of orderPositions||[])for(const row of pos.rows||[]){
        const master=DATA?.master?.[row.art];
        const keep=pos.freeInvoice&&row.manualPrice&&row.manualPriceOwner===freePriceOwner()&&visible&&master;
        if(!keep){row.price=visible&&master&&Number.isFinite(Number(master.price))?Number(master.price):0;delete row.manualPrice;delete row.manualPriceOwner;}
        row.isDefaultPrice=false;
      }
      if(typeof renderOrder==='function')renderOrder();
    }catch(error){console.warn('FUTURUSS price sync failed',error);}
  },
  clearOrder(){try{orderPositions=[];posCounter=0;if(typeof renderOrder==='function')renderOrder();}catch(error){console.warn(error);}},
  render(){try{if(typeof renderMasterGroups==='function')renderMasterGroups();if(typeof renderOrder==='function')renderOrder();}catch(error){console.warn(error);}}
};
