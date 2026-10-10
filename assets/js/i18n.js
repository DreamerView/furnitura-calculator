(function(){
'use strict';
const dict={
"Подходят несколько вариантов":["Multiple options match","Birden fazla seçenek uygun"],
"Привод по высоте":["Drive selected by height", "Yüksekliğe göre ispanyolet"],
"Варианты привода:":["Drive options:", "İspanyolet seçenekleri:"],
"Подтверждены привод по высоте, угловые передачи и состав базовых узлов. Полный комплект требует подбора удлинителей, ответных деталей и проверки монтажа по профилю. Диапазоны совместной работы приводов взяты из таблицы на стр. 231.":["Drive height, corner transmissions and basic parts are verified. A full kit requires extensions, keeps and profile installation review. Paired drive ranges follow the table on page 231.", "İspanyolet yüksekliği, köşe iletimleri ve temel parçalar doğrulandı. Tam takım için uzatmalar, karşılıklar ve profil montajı kontrol edilmelidir. Eşli ispanyolet aralıkları sayfa 231 tablosuna göredir."],
"Скрытые петли выбираются по стороне и профилю; альтернативы не суммируются.":["Hidden hinges are selected by handing and profile; alternatives are not added together.", "Gizli menteşeler yöne ve profile göre seçilir; alternatifler birlikte eklenmez."],
"Проверить монтаж привода под штульпом и обработку профиля.":["Check drive installation beneath the false mullion and profile machining.", "İspanyoletin yalancı orta kayıt altındaki montajını ve profil işlemesini kontrol edin."],
"Подобрать удлинители сверху и снизу по монтажным размерам и схеме рубки.":["Select top and bottom extensions using mounting dimensions and cutting instructions.", "Üst ve alt uzatmaları montaj ölçülerine ve kesim şemasına göre seçin."],
"Подобрать ответные детали по цапфам активной створки; количество не определяется длиной привода PS.":["Select keeps for the active sash cams; quantity is not determined by PS drive length.", "Karşılıkları aktif kanat pimlerine göre seçin; adet PS ispanyolet uzunluğuna göre belirlenmez."],
"Выбрать петли, сторону открывания и допустимую нагрузку.":["Select hinges, handing and permitted load.", "Menteşeleri, açılma yönünü ve izin verilen yükü seçin."],
"Зацеп ZMS.L/R выбирается по направлению активной створки; при монтаже в паз нужна пластина PLM.":["Select ZMS.L/R by active sash handing; groove installation requires a PLM plate.", "ZMS.L/R aktif kanat yönüne göre seçilir; kanala montaj için PLM plakası gerekir."],

"Состав по высоте привода. Ширина и удлинители требуют проверки.":["Composition by drive height. Width and extensions need review.", "İspanyolet yüksekliğine göre içerik. Genişlik ve uzatmalar kontrol edilmelidir."],
"Высота ВСФ, мм":["Sash rebate height, mm", "Kanat kanal yüksekliği, mm"],
"Открыть состав":["Open composition", "İçeriği aç"],
"Штульп: совместимость приводов":["French casement: drive compatibility", "Çift kanat: ispanyolet uyumluluğu"],
"Пассивная створка":["Passive sash", "Pasif kanat"],
"Активная створка":["Active sash", "Aktif kanat"],
"Таблица совместимости пары створок. Привод активной створки не добавляется к пассивной.":["Sash pair compatibility. The active sash drive is not added to the passive sash.", "Kanat çifti uyumluluğu. Aktif kanat ispanyoleti pasif kanada eklenmez."],
"PS.800: собственный диапазон 690–890 мм; совместная работа по таблице — 690–800 мм.":["PS.800: individual range 690–890 mm; paired operation per table: 690–800 mm.", "PS.800: kendi aralığı 690–890 mm; tabloya göre eşli çalışma: 690–800 mm."],
"Зацеп ZMS.L/R выбирается по стороне активной створки. При установке в паз требуется PLM.":["Select ZMS.L/R by the active sash handing. Groove installation requires PLM.", "ZMS.L/R aktif kanadın yönüne göre seçilir. Kanala montaj için PLM gerekir."],
"На привод":["On the drive", "İspanyolet üzerinde"],
"В фурнитурный паз":["In the hardware groove", "Donanım kanalında"],
"Скрытые прижимы — выбрать по профилю":["Hidden clamps — select by profile", "Gizli baskılar — profile göre seçin"],

"Общий состав":["Common composition","Ortak içerik"],
"Переменные детали":["Variable parts","Değişken parçalar"],
"Арочная":["Arched","Kemerli"],
"Трапециевидная":["Trapezoidal","Trapez"],
"Другие комплектации":["Other assemblies","Diğer donanımlar"],
"Дерево комплектаций":["Assembly tree","Donanım ağacı"],
"Поиск комплектации":["Search assemblies","Donanım ara"],
"Требует проверки":["Needs review","Kontrol gerekli"],
"Алюминий":["Aluminium","Alüminyum"],
"Для дорнмасса 7,5 мм выберите улучшенную сборку.":["For 7.5 mm backset, select enhanced assembly.","7,5 mm eksen mesafesi için geliştirilmiş donanımı seçin."],
"Блокиратор Tilt First (BTF / XBTF)":["Tilt First blocker (BTF / XBTF)","Tilt First kilidi (BTF / XBTF)"],
"Блокиратор Tilt First недоступен в ассортименте.":["Tilt First blocker is unavailable in the assortment.","Tilt First kilidi ürün yelpazesinde mevcut değil."],
"Нижний шпингалет без дополнительного привода-ножниц: ширина менее 600 мм.":["Lower bolt without an additional stay drive: width below 600 mm.","Ek makas tahriki olmadan alt sürgü: genişlik 600 mm altında."],
"Улучшенная поворотная":["Enhanced turn", "Geliştirilmiş açılım"],
"сверху":["at the top", "üstte"],
"Поворотная сборка":["Turn assembly", "Açılır kanat donanımı"],
"Обычная":["Normal", "Normal"],
"Улучшенная — ПО-привод без ножниц":["Enhanced — tilt/turn drive without scissors", "Geliştirilmiş — makassız açılım mekanizması"],
"Для этой ширины улучшенная поворотная сборка не настроена.":["Enhanced turn assembly is not configured for this width.", "Bu genişlik için geliştirilmiş açılır donanım yapılandırılmadı."],
"Предварительный подбор горизонталей улучшенной поворотной сборки: длины и соединения проверьте по монтажной схеме.":["Enhanced turn: check horizontal lengths and connections against the installation diagram.", "Geliştirilmiş açılım: yatay uzunlukları ve bağlantıları montaj şemasına göre kontrol edin."],

"Усиленные верх и низ":["Reinforced upper and lower hinges", "Güçlendirilmiş üst ve alt menteşeler"],
"Усиленные верх и низ — кронштейн PK":["Reinforced upper/lower — PK bracket", "Güçlendirilmiş üst/alt — PK konsol"],
"Усиленная нижняя / стандартная верхняя":["Reinforced lower / standard upper hinge", "Güçlendirilmiş alt / standart üst menteşe"],
"В одной серии планок для одного профиля: 35 — сильнее прижим, 40 — средний, 45 — слабее. Проверяйте уплотнение и совместимость.":["Within one strike series for the same profile: 35 gives more pressure, 40 medium, 45 less. Check the gasket and compatibility.", "Aynı profil ve karşılık serisinde: 35 daha güçlü, 40 orta, 45 daha hafif baskı sağlar. Conta ve uyumluluğu kontrol edin."],

"Поворотно-фрамужная FPR":["Turn/fanlight FPR hinge", "Açılır/vasistas FPR menteşe"],
"Обычно используется дорнмасс 15 мм. Подтвердите выбранный размер:":["The usual backset is 15 mm. Confirm the selected size:", "Genellikle 15 mm kullanılır. Seçilen ölçüyü onaylayın:"],
"Дополнительные прижимы со стороны петель":["Additional hinge-side clamps", "Menteşe tarafındaki ek baskılar"],
"Без дополнительных прижимов":["No additional clamps", "Ek baskı yok"],
"Накладной PN":["Surface-mounted PN", "Yüzeye monte PN"],
"Скрытый PS для обычных петель":["Concealed PS for standard hinges", "Standart menteşeler için gizli PS"],
"PS1 для скрытых петель":["PS1 for concealed hinges", "Gizli menteşeler için PS1"],
"Количество прижимов на створку":["Clamps per sash", "Kanat başına baskı sayısı"],
"Дверной привод с ригелем":["Door drive with deadbolt", "Sürgülü kapı mekanizması"],
"Специальное исполнение":["Special configuration", "Özel yapılandırma"],
"Обычное":["Normal", "Normal"],
"Скрытый электропривод":["Concealed electric drive", "Gizli elektrikli tahrik"],
"Для пользователей МГН":["Accessible operation", "Erişilebilir kullanım"],
"Полный состав специального исполнения требует проверки в конструкторе.":["The complete special configuration requires verification in the configurator.", "Özel yapılandırmanın tam içeriği yapılandırıcıda doğrulanmalıdır."],
"Дополнительные прижимы доступны только для поворотных створок и дверей.":["Additional clamps are available only for turn-only sashes and doors.", "Ek baskılar yalnızca yana açılan kanatlar ve kapılar için kullanılabilir."],
"Укажите количество прижимов от 1 до 20 на створку.":["Enter 1 to 20 clamps per sash.", "Kanat başına 1 ile 20 arasında baskı girin."],
"Выбранный прижим несовместим с петлями или профилем.":["The selected clamp is incompatible with the hinges or profile.", "Seçilen baskı menteşelerle veya profille uyumlu değil."],
"Прижим недоступен в ассортименте: ":["Clamp unavailable in the assortment: ", "Baskı ürün yelpazesinde yok: "],
"Для выбранной системы специальное исполнение не подтверждено.":["The special configuration is not confirmed for this system.", "Bu sistem için özel yapılandırma doğrulanmadı."],

"Ассортимент":["Assortment", "Ürün yelpazesi"],
"Показать ещё":["Show more", "Daha fazla göster"],
"7,5 мм":["7.5 mm", "7,5 mm"],
"Стандартная сборка":["Standard assembly","Standart montaj"],
"Базовая взломостойкость":["Basic burglary resistance","Temel hırsızlık direnci"],
"Повышенная взломостойкость":["Enhanced burglary resistance","Artırılmış hırsızlık direnci"],
"Вариант сборки":["Assembly variant","Montaj seçeneği"],
"Добавьте хотя бы один товар.":["Add at least one item.","En az bir ürün ekleyin."],
"Товар больше недоступен. Выберите другую позицию.":["This item is no longer available. Choose another item.","Bu ürün artık mevcut değil. Başka bir ürün seçin."],
"Укажите количество больше нуля.":["Enter a quantity greater than zero.","Sıfırdan büyük bir miktar girin."],
"Укажите неотрицательную цену.":["Enter a non-negative price.","Negatif olmayan bir fiyat girin."],
"Ничего не найдено":["No results","Sonuç bulunamadı"],
"Цены скрыты":["Prices hidden","Fiyatlar gizli"],
"Серебристое":["Silver","Gümüş"],
"Шт./кор.":["Pcs/box","Adet/kutu"],
"Точки прижима на один комплект":["Locking points per set","Set başına kilitleme noktaları"],
"Подтверждённые точки прижима на один комплект":["Confirmed locking points per set","Set başına doğrulanmış kilitleme noktaları"],
"На один комплект. Петли и пассивные прижимы не включены.":["Per set. Hinges and passive clamps are excluded.","Set başına. Menteşeler ve pasif baskılar dahil değildir."],
"Позиционная накладная":["Position invoice","Pozisyon dökümü"],
"Комментарий к позиции":["Position comment","Pozisyon açıklaması"],
"Свободная заявка":["Free-form order","Serbest sipariş"],
"Дополнительные товары":["Additional items","Ek ürünler"],
"со стороны петель":["hinge side", "menteşe tarafında"],
"снизу":["bottom", "altta"],
"спереди, смещение ручки":["front, offset handle", "önde, ofset kol"],
"место не задано":["location not assigned", "konum belirtilmedi"],
"Точки прижима по цапфам":["Cam locking points", "Pim kilitleme noktaları"],
"Подтверждённые точки прижима":["Confirmed locking points", "Doğrulanmış kilitleme noktaları"],
"Всего по позиции. Петли и пассивные прижимы не включены.":["Total for this position. Hinges and passive clamps are excluded.", "Bu pozisyonun toplamı. Menteşeler ve pasif baskılar dahil değildir."],
"Подсчёт неполный. Проверьте детали без подтверждённого числа цапф.":["Incomplete count. Check parts without confirmed cam counts.", "Sayım eksik. Pim sayısı doğrulanmamış parçaları kontrol edin."],
"требует проверки":["needs review", "kontrol gerekli"],
"Ответные части требуют проверки по схеме: ":["Check mating parts against the assembly drawing: ", "Karşılıkları montaj şemasına göre kontrol edin: "],
"Сохранены дополнительные ответные планки из комплектации: ":["Additional recipe strikes preserved: ", "Setteki ek karşılıklar korundu: "],
"Для полного подбора ответных планок выберите профильную систему.":["Select a profile system to complete strike selection.", "Karşılık seçimini tamamlamak için profil sistemini seçin."],
"Не все точки прижима подтверждены каталогом: ":["Not all locking points are confirmed by the catalogue: ", "Tüm kilitleme noktaları katalogda doğrulanmamış: "],
"Нижняя цепочка для цапфы 8 мм или грибовидной требует сверки соединений и каталожных обозначений.":["Check joints and catalogue references for the bottom chain with 8 mm or mushroom cams.","8 mm veya mantar pimli alt zincirin bağlantılarını ve katalog kodlarını kontrol edin."],
"Выберите нижний узел":["Select the lower assembly", "Alt grubu seçin"],
"Угловая передача — горизонтальный откидной зацеп":["Corner drive — horizontal tilt strike", "Köşe hareketi — yatay vasistas karşılığı"],
"Задняя цепочка":["Hinge-side chain", "Menteşe tarafı zinciri"],
"Сохранить состав комплектации":["Keep the configured bill of materials", "Mevcut set içeriğini koru"],
"Привод-ножницы 200 + удлинители":["Stay drive 200 + extensions", "Makas hareketi 200 + uzatmalar"],
"Привод-ножницы 400/600/800 + удлинители":["Stay drive 400/600/800 + extensions", "Makas hareketi 400/600/800 + uzatmalar"],
"Цапфы со стороны петель":["Hinge-side locking cams", "Menteşe tarafı kilitleme pimleri"],
"Как в основной системе":["Same as the main system", "Ana sistemle aynı"],
"Грибовидные + взломостойкие планки":["Mushroom cams + security strikes", "Mantar pimler + güvenlik karşılıkları"],
"Автоподбор заменяет задний и нижний узлы только в новом расчёте. Ручные удлинители без привязки к стороне требуют проверки.":["Automatic selection replaces rear and bottom assemblies only in a new calculation. Check manual extensions without an assigned side.", "Otomatik seçim yalnızca yeni hesapta arka ve alt grupları değiştirir. Tarafı belirtilmemiş manuel uzatmaları kontrol edin."],
"Подобранная цепочка":["Selected chain", "Seçilen zincir"],
"Схема соединений проверена для этих размеров":["Joints verified for these dimensions", "Bağlantılar bu ölçüler için doğrulandı"],
"Со стороны петель":["Hinge side", "Menteşe tarafı"],
"Нижняя горизонталь":["Bottom horizontal", "Alt yatay"],
"Координаты планок от верха рамы, мм":["Strike coordinates from frame top, mm", "Karşılıkların kasa üstünden konumu, mm"],
"Ориентир ⅔ высоты, мм":["Two-thirds height reference, mm", "Yüksekliğin üçte ikisi referansı, mm"],
"Автоподбор задней цепочки для этой комплектации не подтверждён.":["Automatic hinge-side selection is not confirmed for this assembly.", "Bu set için otomatik menteşe tarafı seçimi doğrulanmadı."],
"Для высоты нет подтверждённого диапазона задней цепочки.":["No verified hinge-side chain range for this height.", "Bu yükseklik için doğrulanmış menteşe tarafı zincir aralığı yok."],
"Сверьте цепочку 200 по монтажной схеме: в таблице каталога есть расхождения артикулов.":["Check chain 200 against the mounting diagram: catalogue article numbers conflict.", "200 zincirini montaj şemasından kontrol edin: katalogdaki ürün kodları çelişiyor."],
"Смешанная задняя цепочка: проверьте соединение с ножницами и профильные взломостойкие планки.":["Mixed hinge-side chain: verify the stay connection and profile-specific security strikes.", "Karma menteşe tarafı zinciri: makas bağlantısını ve profile uygun güvenlik karşılıklarını kontrol edin."],
"Для нижней горизонтали менее 700 мм удлинитель автоматически не добавлен; проверьте точки прижима.":["No automatic extension below 700 mm on the bottom horizontal; check locking points.", "700 mm altındaki alt yataya otomatik uzatma eklenmedi; baskı noktalarını kontrol edin."],
"Для ширины нет подтверждённого диапазона нижней цепочки.":["No verified bottom chain range for this width.", "Bu genişlik için doğrulanmış alt zincir aralığı yok."],
"Соединение нижнего шпингалета с выбранной цапфой требует проверки.":["The lower shootbolt connection with the selected cam needs verification.", "Alt sürgünün seçilen pimle bağlantısı kontrol edilmelidir."],
"Деталь цепочки недоступна: ":["Chain part unavailable: ", "Zincir parçası mevcut değil: "],
"Нижняя точка прижима выше ориентира ⅔ высоты. Проверьте дополнительный прижим.":["The lowest locking point is above the two-thirds height reference. Check additional locking.", "En alt baskı noktası üçte iki yükseklik referansının üstünde. Ek baskıyı kontrol edin."],
"Координаты ответных планок даны по раме из монтажной таблицы; положение цапфы по фальцу проверьте отдельно.":["Strike coordinates use the frame reference in the mounting table; verify cam positions along the rebate separately.", "Karşılık konumları montaj tablosundaki kasa referansına göredir; pimlerin kanat falcı konumunu ayrıca kontrol edin."],
"Положение нижней цапфы и ориентир ⅔ высоты требуют проверки по монтажной схеме.":["Verify the lowest cam position and two-thirds height reference against the mounting diagram.", "Alt pim konumunu ve üçte iki yükseklik referansını montaj şemasından kontrol edin."],
"Подтвердите проверку схемы соединений или выберите другую цепочку.":["Confirm joint verification or select another chain.", "Bağlantı kontrolünü onaylayın veya başka zincir seçin."],
"В составе есть удлинители без привязки к стороне. Уточните состав в конструкторе перед автоподбором.":["The bill of materials contains extensions without an assigned side. Assign them in the configurator before automatic selection.", "Set içinde tarafı belirtilmemiş uzatmalar var. Otomatik seçimden önce yapılandırıcıda kontrol edin."],
"В исходной комплектации не хватало ответных планок заднего узла; новый узел рассчитан отдельно.":["The original assembly lacked hinge-side strikes; the new assembly was calculated separately.", "Önceki sette menteşe tarafı karşılıkları eksikti; yeni grup ayrı hesaplandı."],
"Пересчитать связанные ответные планки?":["Recalculate linked strike plates?", "Bağlı karşılıklar yeniden hesaplansın mı?"],
"Привод по ширине":["Drive selected by width","Genişliğe göre mekanizma"],
"Детали схемы":["Scheme components","Şema parçaları"],
"Для выбранной петлевой группы Tilt First полный состав ещё не подтверждён. Выберите стандартные петли или настройте отдельную комплектацию в конструкторе.":["The full Tilt First bill of materials for the selected hinge group is not confirmed yet. Select standard hinges or configure a separate assembly in the constructor.", "Seçilen Tilt First menteşe grubu için tam parça listesi henüz doğrulanmadı. Standart menteşeleri seçin veya yapılandırıcıda ayrı bir set hazırlayın."],
"Для этой комплектации выберите профиль из каталога и стандартные петли.":["Select a catalogue profile and standard hinges for this assembly.", "Bu set için katalogdan bir profil ve standart menteşeler seçin."],
"Для этой комплектации доступны KBE 13 и REHAU 13 со стандартными петлями.":["This assembly supports KBE 13 and REHAU 13 with standard hinges.", "Bu set KBE 13 ve REHAU 13 profillerini standart menteşelerle destekler."],
"Дополнительные детали":["Additional parts", "Ek parçalar"],
"PLS: количество задаётся по соединениям и типу рубки.":["PLS: quantity depends on connections and cutting type.", "PLS: miktar bağlantılara ve kesim türüne bağlıdır."],
"Обвязка по размеру":["Size-specific hardware", "Ölçüye göre donanım"],
"размерных составов":["size-specific assemblies", "ölçüye özel set"],
"Для этой комплектации из Excel подтверждены REHAU 13 и стандартные петли.":["This Excel assembly supports REHAU 13 with standard hinges.", "Bu Excel seti REHAU 13 ve standart menteşeler için doğrulanmıştır."],
": неверные размерные составы":[": invalid size-specific assemblies", ": geçersiz ölçüye özel setler"],
": пересекаются размерные составы":[": overlapping size-specific assemblies", ": çakışan ölçüye özel setler"],
"В одном счёте нельзя смешивать рубли и тенге.":["A single invoice cannot mix roubles and tenge.", "Aynı faturada ruble ve tenge birlikte kullanılamaz."],
"Состав неполный":["Incomplete assembly", "Eksik set"],
"Состав неполный. Предварительный подбор; добавление в накладную запрещено.":["Incomplete assembly. Preliminary selection; adding to the invoice is blocked.", "Eksik set. Ön seçim; faturaya ekleme engellendi."],
"Показаны основные узлы одной створки из шаблона. Сторона, цвет и остальные опции ещё не применены.":["Main components for one sash from the template. Handing, colour and other options have not been applied.", "Şablondaki tek kanadın ana parçaları. Yön, renk ve diğer seçenekler henüz uygulanmadı."],
"Полный состав и узлы для проверки доступны в конструкторе.":["The full assembly and verification checklist are available in the configurator.", "Tam set ve kontrol listesi yapılandırıcıda mevcuttur."],

"Каталог схем":["Scheme catalogue", "Şema kataloğu"],
"Требует проверки узлов":["Assembly verification required", "Bağlantı kontrolü gerekli"],
"Узлы для проверки":["Assemblies to verify", "Kontrol edilecek bağlantılar"],
"Комплектации каталога":["Catalogue assemblies", "Katalog donanım setleri"],
"Поиск схемы или артикула":["Find a scheme or article", "Şema veya ürün kodu ara"],
"Все цапфы":["All cams", "Tüm pimler"],
"Перечни содержат альтернативы. Они не являются готовыми накладными.":["Lists contain alternatives. They are not complete bills of materials.", "Listeler alternatifler içerir; tamamlanmış malzeme listeleri değildir."],
"Требует настройки":["Configuration required", "Yapılandırma gerekli"],
"Есть расчётный вариант":["A calculated variant is available", "Hesaplanan bir seçenek mevcut"],
"Схема в каталоге":["Catalogue diagram", "Katalog şeması"],
"Реализован один вариант схемы. Другие варианты требуют отдельной настройки.":["One scheme variant is implemented. Other variants need separate configuration.", "Şemanın bir seçeneği uygulanmıştır. Diğer seçenekler ayrıca yapılandırılmalıdır."],
"Схема каталога ещё не настроена для автоматического расчёта.":["This catalogue scheme is not configured for automatic calculation yet.", "Bu katalog şeması henüz otomatik hesap için yapılandırılmadı."],
"Доступные артикулы схемы — альтернативы":["Available scheme articles — alternatives", "Mevcut şema ürünleri — alternatifler"],
"Для фрамужной комплектации доступна только заданная петлевая группа.":["This fanlight assembly supports only its specified hinge set.", "Bu vasistas donanımında yalnızca belirtilen menteşe grubu kullanılabilir."],
"Подкладка скрытой петли не подтверждена для выбранного профиля.":["Concealed hinge packing is unverified for this profile.","Gizli menteşe altlığı bu profil için doğrulanmadı."],

"Нет комплектации":["No configuration","Set yok"],

"Роликовая цапфа 11 мм": ["11 mm roller cam", "11 mm makaralı pim"], "Роликовая цапфа 8 мм": ["8 mm roller cam", "8 mm makaralı pim"], "Грибовидная цапфа": ["Mushroom cam", "Mantar pim"], "Тип цапфы": ["Cam type", "Pim türü"], " — Для этого открывания нет комплектации": [" — No kit for this opening", " — Bu açılım için set yok"], "Поворотная": ["Turn", "Tek açılım"], "Фрамужная": ["Fanlight", "Vasistas"], "Поворотно-откидная": ["Tilt and turn", "Çift açılım"], "Штульповая — шпингалеты": ["Stulp — shootbolts", "Çift kanat — sürgüler"], "Штульповая — привод": ["Stulp — drive", "Çift kanat — ispanyolet"], "Дверная система": ["Door system", "Kapı sistemi"], "Раздвижная / портальная": ["Sliding / portal", "Sürme / portal"], "Откидно-поворотная": ["Tilt first", "Önce vasistas"], "Петлевая группа поворотной створки": ["Turn sash hinge group", "Tek açılım kanat menteşe grubu"], "Стандартная — кронштейн PK": ["Standard — PK bracket", "Standart — PK braket"], "Усиленная 130 кг — кронштейн PK": ["Reinforced 130 kg — PK bracket", "Güçlendirilmiş 130 kg — PK braket"], "Фальцевая SF — кронштейн PK": ["Rebated SF — PK bracket", "Falçalı SF — PK braket"], "Скрытая — верхняя SPK, нижняя SNP": ["Concealed — upper SPK, lower SNP", "Gizli — üst SPK, alt SNP"], "Фальцевая петля доступна только для поворотной створки.": ["Rebated hinge is available for turn-only sashes.", "Falçalı menteşe yalnızca tek açılım kanatlar içindir."], "Для выбранного паза петлевая группа не настроена.": ["No hinge group is configured for this groove.", "Bu kanal için menteşe grubu ayarlanmamış."], "Прижимы поворотной створки требуют проверки для скрытых петель.": ["Turn sash clamps need verification for concealed hinges.", "Tek açılım baskıları gizli menteşeler için kontrol edilmelidir."], "Поворотные скрытые петли: SPK + SNP. Проверьте нагрузку и прижимы по монтажной схеме.": ["Concealed turn hinges: SPK + SNP. Check load and clamps against the assembly drawing.", "Gizli tek açılım menteşeleri: SPK + SNP. Yük ve baskıları montaj şemasına göre kontrol edin."],

"Нижний откидной узел":["Lower tilt assembly", "Alt vasistas grubu"],"По комплектации":["As configured", "Sete göre"],"Шпингалет — вертикальная ответная планка":["Shootbolt — vertical strike", "Sürgü — dikey karşılık"],"Взломостойкий зацеп — нижняя горизонталь":["Security strike — bottom horizontal", "Güvenlik karşılığı — alt yatay"],"Для этой комплектации смена нижнего узла не подтверждена.":["Changing the lower assembly is not verified for this configuration.", "Bu set için alt grubun değiştirilmesi doğrulanmadı."],"Состав нижнего узла требует проверки в конструкторе.":["Check the lower assembly in the configurator.", "Alt grubu yapılandırıcıda kontrol edin."],"Выберите профиль ответных планок.":["Select a strike plate profile.", "Karşılık profilini seçin."],"PLS: схема соединений не проверена. Сохранено количество из комплектации; проверьте его вручную.":["PLS: joints are unverified. The configured quantity was kept; check it manually.", "PLS: bağlantılar doğrulanmadı. Setteki adet korundu; elle kontrol edin."],"Соединения PLS":["PLS joints", "PLS bağlantıları"],"Укажите соединяемые детали по монтажной схеме. drive и scissors обозначают выбранные привод и ножницы. Подтверждайте только проверенные соединения.":["Specify joined parts from the assembly drawing. drive and scissors refer to the selected drive and stay. Confirm only verified joints.", "Montaj şemasındaki bağlı parçaları belirtin. drive ve scissors seçilen ispanyolet ve makası belirtir. Yalnızca doğrulanan bağlantıları onaylayın."],"Добавить соединение":["Add joint", "Bağlantı ekle"],"Первая деталь":["First part", "Birinci parça"],"Вторая деталь":["Second part", "İkinci parça"],"Одна плоскость — PLS":["Single-plane cut — PLS", "Tek düzlem kesim — PLS"],"Два уровня — без PLS":["Two-level cut — without PLS", "İki seviyeli kesim — PLS olmadan"],"Соединение проверено":["Joint verified", "Bağlantı doğrulandı"],"Пересчитать ответные детали нижнего узла?":["Recalculate lower assembly strikes?", "Alt grup karşılıkları yeniden hesaplansın mı?"],"В расчёте разные стороны открывания. Проверьте количество ответных планок вручную.":["This calculation combines opening sides. Check the strike quantities manually.", "Hesap farklı açılma yönleri içeriyor. Karşılık adetlerini elle kontrol edin."],"Заменить ответную планку":["Replace strike plate", "Karşılığı değiştir"],"Изменится только эта строка текущего расчёта. Количество сохранится.":["Only this row in the current calculation changes. Quantity is preserved.", "Yalnızca mevcut hesaptaki bu satır değişir. Adet korunur."],"Рекомендованные варианты":["Recommended alternatives", "Önerilen alternatifler"],"Выберите артикул":["Select an article", "Ürün kodu seçin"],"Другой артикул из доступного каталога":["Another article from the available catalogue", "Mevcut katalogdan başka ürün kodu"],"Артикул недоступен или цена не задана.":["The article is unavailable or has no price.", "Ürün mevcut değil veya fiyatı girilmedi."],"Совместимость этого артикула не подтверждена. Применить ручную замену?":["Compatibility is unverified. Apply this manual replacement?", "Uyumluluk doğrulanmadı. Elle değişiklik uygulansın mı?"],

"Пересчитать соединительные пластины PLS?":["Recalculate PLS connecting plates?","PLS bağlantı plakaları yeniden hesaplansın mı?"],"ОК — пересчитать; Отмена — сохранить текущее количество пластин.":["OK recalculates; Cancel keeps the current plate quantity.","Tamam yeniden hesaplar; İptal mevcut plaka adedini korur."],"Добавьте PLS вручную: строка пластин отсутствует.":["Add PLS manually: the plate row is missing.","PLS elle ekleyin: plaka satırı eksik."],
"Для этих размеров нет диапазона.":["No range exists for these dimensions.","Bu ölçüler için aralık yok."],"Допустимая ширина: ":["Allowed width: ","İzin verilen genişlik: "],"Допустимая высота: ":["Allowed height: ","İzin verilen yükseklik: "],"ножницы 400–1400 мм; до 600 мм — универсальные NO.600.":["scissors 400–1400 mm; below 600 mm — universal NO.600.","makaslar 400–1400 mm; 600 mm altında — evrensel NO.600."],
"Таблица 10.4 подбора ответных планок — изображение пользователя; обозначения приведены к артикулам существующей базы.":["Strike selection table 10.4 supplied by the user; codes normalized to the existing catalogue.","Kullanıcı tarafından sağlanan 10.4 karşılık seçim tablosu; kodlar mevcut kataloğa uyarlanmıştır."],
"Ответные планки":["Strike plates", "Karşılıklar"],"Профиль ответных планок":["Strike plate profile", "Karşılık profili"],"Окончание артикула":["Article suffix", "Ürün kodu son eki"],"Пустое поле — автоматический подбор. Для ручной замены укажите артикул из базы; совместимость проверьте отдельно.":["Leave blank for automatic selection. Enter a catalogue article for manual replacement; verify compatibility separately.", "Otomatik seçim için boş bırakın. Elle değiştirmek için katalog kodu girin; uyumluluğu ayrıca kontrol edin."],"Периметральная планка":["Perimeter strike", "Çevre karşılığı"],"Взломостойкая периметральная планка":["Security perimeter strike", "Güvenlik çevre karşılığı"],"Взломостойкий откидной зацеп":["Security tilt strike", "Güvenlik vasistas karşılığı"],"Зацеп Tilt First":["Tilt First strike", "Tilt First karşılığı"],"Зацеп микровентиляции":["Microventilation strike", "Mikro havalandırma karşılığı"],"Зацеп пошагового проветривания":["Step ventilation strike", "Kademeli havalandırma karşılığı"],"Зацеп приподнимателя — капрон":["Nylon lifter strike", "Naylon kaldırıcı karşılığı"],"Зацеп приподнимателя — цинк":["Zinc lifter strike", "Çinko kaldırıcı karşılığı"],"Ответная планка шпингалета":["Shootbolt strike", "Sürgü karşılığı"],"Зацеп скрытого прижима":["Concealed clamp strike", "Gizli baskı karşılığı"],"Неизвестная профильная система ответных планок.":["Unknown strike plate profile.", "Bilinmeyen karşılık profili."],"Профиль ответных планок не соответствует выбранному пазу.":["Strike profile does not match the selected groove.", "Karşılık profili seçili kanalla eşleşmiyor."],"Ответная планка отсутствует или недоступна: ":["Strike plate is missing or unavailable: ", "Karşılık eksik veya kullanılamıyor: "],"Ручная замена ответной планки: ":["Manual strike plate replacement: ", "Elle karşılık değişimi: "],"Окончание артикула недоступно для профиля; предложен вариант: ":["Article suffix is unavailable for this profile; suggested alternative: ", "Kod son eki bu profil için mevcut değil; önerilen alternatif: "],"Для профиля предусмотрен адаптер APD. Количество адаптеров проверьте по монтажной схеме.":["This profile uses the APD adapter. Check the adapter quantity against the installation drawing.", "Bu profil APD adaptörünü kullanır. Adaptör adedini montaj çiziminden kontrol edin."],

'Покрытие механизмов':['Hardware finish','Mekanizma kaplaması'],
'Стандартное':['Standard','Standart'],
'Чёрные варианты по каталогу':['Catalogue black variants','Katalogdaki siyah seçenekler'],
'Чёрные исполнения заменяют только подтверждённые артикулы. Цвет накладок и ручки выбирается отдельно.':['Only catalogue-confirmed articles are replaced. Select cover and handle colours separately.','Yalnızca katalogda doğrulanan kodlar değiştirilir. Kapak ve kol rengini ayrıca seçin.'],
'Для выбранного состава чёрные исполнения не подтверждены каталогом.':['Black variants are not confirmed for this selection.','Bu seçim için siyah seçenekler doğrulanmamıştır.'],
'Стандартное исполнение без подтверждённой чёрной замены: ':['Standard articles without a confirmed black replacement: ','Doğrulanmış siyah karşılığı olmayan standart ürünler: '],
'Оптовые заявки':['Wholesale requests','Toptan talepler'],

"Скрытые петли":["Concealed hinges","Gizli menteşeler"],
"Профиль скрытой системы":["Concealed hinge profile","Gizli menteşe profili"],
"Совместимый откидной зацеп":["Compatible tilt strike","Uyumlu vasistas karşılığı"],
"Выберите откидной зацеп":["Select a tilt strike","Vasistas karşılığı seçin"],
"Высота ручки":["Handle height","Kol yüksekliği"],
"Высота ручки, мм":["Handle height, mm","Kol yüksekliği, mm"],
"Высота ручки: ":["Handle height: ","Kol yüksekliği: "],
"По каталогу":["From catalog","Katalogdan"],
"От нижнего фальца до оси ручки":["From lower sash rebate to handle axis","Alt kanat falzından kol eksenine"],
"Для этой высоты ручки нужна проверенная схема соединений и подрезки.":["This handle height requires a verified connection and cutting diagram.","Bu kol yüksekliği için doğrulanmış bağlantı ve kesim şeması gereklidir."],
"Нижняя угловая передача":["Lower corner drive","Alt köşe iletimi"],
"Верхняя угловая передача":["Upper corner drive","Üst köşe iletimi"],
"Прямое соединение по каталогу. Удлинитель со стороны ручки не требуется. Остальную обвязку проверить по размеру.":["Direct catalog connection. No handle-side extension required. Check the remaining hardware for the dimensions.","Kataloğa göre doğrudan bağlantı. Kol tarafında uzatma gerekmez. Diğer donanımı ölçülere göre kontrol edin."],
"Эти опции доступны только для поворотно-откидного открывания.":["These options require tilt-and-turn opening.","Bu seçenekler çift açılım gerektirir."],
"Пассивная штульповая створка со шпингалетами не имеет ручки.":["The passive floating-mullion sash with flush bolts has no handle.","Sürgülü pasif çift kanatta kol bulunmaz."],
"Для выбранной системы и размеров скрытая петлевая группа не настроена.":["Concealed hinges are not configured for this system and size.","Bu sistem ve ölçü için gizli menteşeler tanımlanmamıştır."],
"Выберите совместимый откидной зацеп для профиля и паза.":["Select a tilt strike compatible with the profile and groove.","Profil ve kanalla uyumlu vasistas karşılığını seçin."],
"Проверьте точки запирания, нагрузку и профильные ответные планки по каталогу.":["Check locking points, load and profile strikes against the catalog.","Kilitleme noktalarını, yükü ve profil karşılıklarını katalogdan kontrol edin."],
"Привод и удлинители ножниц требуют проверки по монтажной схеме.":["The stay drive and extensions require verification against the mounting diagram.","Makas tahriki ve uzatmaları montaj şemasına göre kontrol edilmelidir."],
"Удлинитель в ячейке конфликтует с прямым соединением привода.":["The cell extension conflicts with the direct drive connection.","Hücredeki uzatma doğrudan tahrik bağlantısıyla çakışıyor."],
"Поворотное открывание · цапфа ":["Turn opening · cam ","Tek açılım · pim "],
"Штульповое открывание · пассивная створка · цапфа ":["Floating-mullion opening · passive sash · cam ","Çift kanat açılımı · pasif kanat · pim "],
"Начальная комплектация. Профильные ответные планки, точки запирания и нагрузку проверить по каталогу. Активную штульповую створку считать отдельно.":["Initial kit. Check profile strikes, locking points and load against the catalog. Calculate the active sash separately.","Başlangıç seti. Profil karşılıklarını, kilitleme noktalarını ve yükü katalogdan kontrol edin. Aktif kanadı ayrı hesaplayın."],

'Некорректный рекламный файл.':['Invalid advertising file.','Geçersiz reklam dosyası.'],'Рекламный файл не найден.':['Advertising file not found.','Reklam dosyası bulunamadı.'],'Реклама: PNG, JPG, WEBP, MP4 или WEBM.':['Advertising: PNG, JPG, WEBP, MP4 or WEBM.','Reklam: PNG, JPG, WEBP, MP4 veya WEBM.'],'Рекламный файл превышает допустимый размер.':['Advertising file exceeds the size limit.','Reklam dosyası boyut sınırını aşıyor.'],'Некорректное рекламное изображение.':['Invalid advertising image.','Geçersiz reklam görseli.'],'Некорректное рекламное видео.':['Invalid advertising video.','Geçersiz reklam videosu.'],'Не удалось создать папку рекламы.':['Could not create the advertising folder.','Reklam klasörü oluşturulamadı.'],'Не удалось сохранить рекламный файл.':['Could not save the advertising file.','Reklam dosyası kaydedilemedi.'],

'Фото и видео':['Photos and videos','Fotoğraflar ve videolar'],'Фото — 10 секунд. Видео — до завершения, без звука.':['Photos: 10 seconds. Videos: until the end, muted.','Fotoğraflar: 10 saniye. Videolar: sona kadar, sessiz.'],
'Добавить фото и видео':['Add photos and videos','Fotoğraf ve video ekle'],'Удалить рекламный файл':['Delete advertising file','Reklam dosyasını sil'],
'Фото и видео появятся в общей накладной, когда список деталей пуст.':['Photos and videos appear in the invoice when the parts list is empty.','Parça listesi boşken fotoğraflar ve videolar faturada gösterilir.'],
'Рекламные файлы сохранены.':['Advertising files saved.','Reklam dosyaları kaydedildi.'],'Рекламный файл удалён.':['Advertising file deleted.','Reklam dosyası silindi.'],
'PNG, JPG, WEBP · до 4 МБ. MP4, WEBM · до 20 МБ. До 20 файлов.':['PNG, JPG, WEBP: up to 4 MB. MP4, WEBM: up to 20 MB. Up to 20 files.','PNG, JPG, WEBP: en fazla 4 MB. MP4, WEBM: en fazla 20 MB. En fazla 20 dosya.'],
'Реклама: не более 20 файлов.':['Advertising: up to 20 files.','Reklam: en fazla 20 dosya.'],'Размер видео не должен превышать 20 МБ.':['Video must not exceed 20 MB.','Video 20 MB boyutunu aşmamalıdır.'],'Не удалось прочитать видео.':['Could not read the video.','Video okunamadı.'],'Не удалось прочитать файл.':['Could not read the file.','Dosya okunamadı.'],'Выберите PNG, JPG, WEBP, MP4 или WEBM.':['Select PNG, JPG, WEBP, MP4 or WEBM.','PNG, JPG, WEBP, MP4 veya WEBM seçin.'],

'Накладная':['Invoice','Fatura'],'База артикулов':['Catalog database','Ürün veritabanı'],'Настройки':['Settings','Ayarlar'],'Каталог':['Catalog','Katalog'],'Управление':['Management','Yönetim'],'Войти':['Sign in','Giriş'],'Выйти':['Sign out','Çıkış'],
'Пользователи':['Users','Kullanıcılar'],'Следующее':['Next','Sonraki'],'Скоро':['Soon','Yakında'],'Калькулятор':['Calculator','Hesaplayıcı'],'Создать дилера':['Create dealer','Bayi oluştur'],'Создать пользователя':['Create user','Kullanıcı oluştur'],
'Создать Dealer':['Create Dealer','Bayi oluştur'],'Создать Subdealer':['Create Subdealer','Alt bayi oluştur'],'Создать Client':['Create Client','Müşteri oluştur'],'Редактировать Dealer':['Edit Dealer','Bayiyi düzenle'],'Редактировать Subdealer':['Edit Subdealer','Alt bayiyi düzenle'],'Редактировать Client':['Edit Client','Müşteriyi düzenle'],
'Редактировать':['Edit','Düzenle'],'Удалить':['Delete','Sil'],'Отмена':['Cancel','İptal'],'Создать':['Create','Oluştur'],'Сохранить':['Save','Kaydet'],'Удаление':['Deleting','Siliniyor'],'Удалить пользователя?':['Delete user?','Kullanıcı silinsin mi?'],
'Название':['Name','Ad'],'Логин':['Login','Kullanıcı adı'],'Пароль':['Password','Şifre'],'Активен':['Active','Aktif'],'Отключён':['Disabled','Devre dışı'],'доступ':['access','erişim'],'цены':['prices','fiyatlar'],'Цены:':['Prices:','Fiyatlar:'],'да':['yes','evet'],'нет':['no','hayır'],
'Разрешить цены':['Allow prices','Fiyatlara izin ver'],'Контактное лицо':['Contact person','İrtibat kişisi'],'Телефон':['Phone','Telefon'],'Публичная информация':['Public information','Genel bilgiler'],'Секретный ключ Client':['Client secret key','Müşteri gizli anahtarı'],'Ключ показывается только сейчас.':['The key is shown only now.','Anahtar yalnızca şimdi gösterilir.'],'Новый ключ':['New key','Yeni anahtar'],
'Вход в FUTURUSS':['Sign in to FUTURUSS','FUTURUSS girişi'],'Вход':['Sign in','Giriş'],'Логин и пароль':['Login and password','Kullanıcı adı ve şifre'],'Активация по ключу':['Activate with key','Anahtarla etkinleştir'],'Секретный ключ':['Secret key','Gizli anahtar'],'Активировать Client':['Activate Client','Müşteriyi etkinleştir'],'Регистрация Client':['Client registration','Müşteri kaydı'],'Показать пароль':['Show password','Şifreyi göster'],'Скрыть пароль':['Hide password','Şifreyi gizle'],
'Создание администратора':['Create administrator','Yönetici oluştur'],'Первый запуск. Создайте администратора Istina / Central.':['First launch. Create the Istina / Central administrator.','İlk açılış. Istina / Central yöneticisini oluşturun.'],'Создать администратора':['Create administrator','Yönetici oluştur'],
'Логин доступен':['Login is available','Kullanıcı adı uygun'],'Логин уже занят':['Login is already taken','Kullanıcı adı kullanımda'],'Проверяем логин…':['Checking login…','Kullanıcı adı kontrol ediliyor…'],
'Дизайн':['Design','Tasarım'],'Стиль интерфейса':['Interface style','Arayüz stili'],'Default':['Default','Varsayılan'],'Soft':['Soft','Soft'],'Easy':['Easy','Kolay'],'Glossy':['Glossy','Parlak'],'Material':['Material','Material'],'Применить':['Apply','Uygula'],
'Русский':['Русский','Rusça'],'Язык':['Language','Dil'],
'Данные ещё не загружены':['Data has not been uploaded yet','Veriler henüz yüklenmedi'],'Дождитесь импорта базы Istina / Central. Калькулятор станет доступен автоматически после загрузки данных.':['Wait for the Istina / Central database import. The calculator will become available automatically after the data is uploaded.','Istina / Central veritabanının içe aktarılmasını bekleyin. Veriler yüklendikten sonra hesaplayıcı otomatik olarak kullanılabilir olacaktır.'],
'Цены скрыты. Для просмотра цен требуется разрешение вашей ветки.':['Prices are hidden. Permission from your branch is required to view prices.','Fiyatlar gizlidir. Fiyatları görmek için bağlı olduğunuz şubeden izin gerekir.'],
'Параметры позиции':['Position parameters','Pozisyon parametreleri'],'Фурнитурный паз (профильная система)':['Hardware groove (profile system)','Donanım kanalı (profil sistemi)'],'Дорнмасс':['Backset','Dorun ölçüsü'],'Вариант привода':['Drive option','Tahrik seçeneği'],'Петли':['Hinges','Menteşeler'],'Размеры и количество':['Dimensions and quantity','Ölçüler ve adet'],'Правых открываний':['Right openings','Sağ açılımlar'],'Левых открываний':['Left openings','Sol açılımlar'],'Название позиции':['Position name','Pozisyon adı'],'Опции':['Options','Seçenekler'],'Ручка':['Handle','Kol'],'Микровентиляция':['Microventilation','Mikro havalandırma'],'Приподниматель':['Sash lifter','Kanat kaldırıcı'],'Цвет накладок':['Cover color','Kapak rengi'],'Белый':['White','Beyaz'],'Коричневый':['Brown','Kahverengi'],'Чёрный':['Black','Siyah'],'Добавить позицию':['Add position','Pozisyon ekle'],'Добавить позицию в накладную':['Add position to invoice','Pozisyonu faturaya ekle'],'Очистить накладную':['Clear invoice','Faturayı temizle'],
'Общая накладная (сводно по артикулам)':['Combined invoice (grouped by article)','Genel fatura (ürün koduna göre)'],'Позиций:':['Positions:','Pozisyonlar:'],'Дата:':['Date:','Tarih:'],'Артикул':['Article','Ürün kodu'],'Наименование':['Name','Açıklama'],'Кол-во':['Qty','Adet'],'Цена':['Price','Fiyat'],'Сумма':['Amount','Tutar'],'Итого по накладной':['Invoice total','Fatura toplamı'],'Печать / PDF':['Print / PDF','Yazdır / PDF'],'Экспорт в Excel':['Export to Excel','Excel’e aktar'],'Сохранить':['Save','Kaydet'],'Позиции накладной':['Invoice positions','Fatura pozisyonları'],'Превью':['Preview','Önizleme'],'Реклама':['Advertising','Reklam'],
'Импорт базы':['Import database','Veritabanını içe aktar'],'Экспорт базы в Excel':['Export database to Excel','Veritabanını Excel’e aktar'],'Импорт базы из Excel':['Import database from Excel','Veritabanını Excel’den içe aktar'],'Поиск по артикулу или названию...':['Search by article or name...','Ürün kodu veya ada göre ara...'],
'Калькулятор открывается, ожидайте…':['Calculator is opening, please wait…','Hesaplayıcı açılıyor, lütfen bekleyin…'],'Загружаем интерфейс и данные Istina / Central.':['Loading the interface and Istina / Central data.','Arayüz ve Istina / Central verileri yükleniyor.']
};
Object.assign(dict,{
'Поднять рекламу':['Move advertisement up','Reklamı yukarı taşı'],
'Опустить рекламу':['Move advertisement down','Reklamı aşağı taşı'],
'Порядок рекламы сохранён.':['Advertisement order saved.','Reklam sırası kaydedildi.'],
'Список рекламы изменился. Обновите страницу.':['The advertisement list has changed. Refresh the page.','Reklam listesi değişti. Sayfayı yenileyin.'],

'Цены изменились. Обновите страницу и повторите изменения.':['Prices have changed. Refresh the page and repeat your changes.','Fiyatlar değişti. Sayfayı yenileyin ve değişikliklerinizi tekrarlayın.'],
'Некорректная ценовая политика.':['Invalid pricing policy.','Geçersiz fiyat politikası.'],
'Введите корректную цену от 0 до 1000000000.':['Enter a valid price from 0 to 1000000000.','0 ile 1000000000 arasında geçerli bir fiyat girin.'],

"Цены и ассортимент":["Prices and assortment","Fiyatlar ve ürünler"],
"Выберите товары для продажи и задайте свои цены. Пустая цена наследуется от поставщика. Исключённые поставщиком товары недоступны всей вашей ветке.":["Choose products to sell and set your prices. An empty price inherits the supplier price. Products excluded by the supplier are unavailable throughout your branch.","Satılacak ürünleri seçin ve fiyatlarınızı belirleyin. Boş fiyat tedarikçiden devralınır. Tedarikçinin çıkardığı ürünler şubenizde kullanılamaz."],
"Поставщик":["Supplier","Tedarikçi"],
"В продаже":["For sale","Satışta"],
"Артикул / наименование":["Article / name","Ürün kodu / adı"],
"Цена поставщика":["Supplier price","Tedarikçi fiyatı"],
"Моя цена":["My price","Fiyatım"],
"Цена продажи":["Selling price","Satış fiyatı"],
"Наследовать":["Inherit","Devral"],
"Нет у поставщика":["Supplier unavailable","Tedarikçide yok"],
"Поиск по артикулу или названию":["Search by article or name","Ürün kodu veya ad ile ara"],
"Сохранить изменения":["Save changes","Değişiklikleri kaydet"],
"Сохранение…":["Saving…","Kaydediliyor…"],
"Цены и ассортимент сохранены":["Prices and assortment saved","Fiyatlar ve ürünler kaydedildi"],
"Загружаем цены…":["Loading prices…","Fiyatlar yükleniyor…"],
"Каталог ещё не загружен «Истиной».":["Istina has not uploaded the catalog yet.","Istina henüz kataloğu yüklemedi."],
"Ничего не найдено":["No matches","Sonuç yok"],
"Назад":["Previous","Önceki"],
"Далее":["Next","Sonraki"],
"Проверьте цены: допустимо от 0 до 1000000000.":["Check prices: enter 0 to 1000000000.","Fiyatları kontrol edin: 0 ile 1000000000 arasında girin."],
"Товаров":["Products","Ürünler"],
"В продаже":["For sale","Satışta"],
"Изменено":["Changed","Değiştirildi"],
"Товары недоступны у поставщика: ":["Products unavailable from supplier: ","Tedarikçide bulunmayan ürünler: "],
"В накладной есть недоступные товары. Удалите отмеченные строки или измените ассортимент.":["The invoice contains unavailable products. Remove the marked rows or change your assortment.","Faturada mevcut olmayan ürünler var. İşaretli satırları kaldırın veya ürün seçimini değiştirin."],
"Калькулятор":["Calculator","Hesaplayıcı"],
"Управление":["Management","Yönetim"],

'Цены и ассортимент':['Prices and assortment','Fiyatlar ve ürünler'],

'ПВХ':['PVC','PVC'],'15 мм':['15 mm','15 mm'],'25 мм':['25 mm','25 mm'],'35 мм':['35 mm','35 mm'],
'Для этой дверной комплектации выберите стандартные петли и дорнмасс 25 или 35 мм.':['For this door kit choose standard hinges and a 25 or 35 mm backset.','Bu kapı seti için standart menteşeler ve 25 veya 35 mm eksen mesafesi seçin.'],
'Для дверной системы гарнитур и цилиндр подбираются отдельно.':['The door handle set and cylinder are selected separately.','Kapı kol takımı ve silindir ayrıca seçilir.'],'Копия':['Copy','Kopya'],'Левая':['Left','Sol'],'Правая':['Right','Sağ'],'Схема':['Scheme','Şema'],'Закрыть':['Close','Kapat'],'Компактная':['Compact','Kompakt'],'Просторная':['Spacious','Geniş'],'Плотность':['Density','Yoğunluk'],'Фурнитура:':['Hardware:','Donanım:'],'Цвет ручки':['Handle color','Kol rengi'],'Внешний вид':['Appearance','Görünüm'],'Профиль ALU':['ALU profile','ALU profili'],'Стандартные':['Standard','Standart'],'Комплектации':['Configurations','Konfigürasyonlar'],'Ручка: центр':['Handle: center','Kol: merkez'],'Удалить фото':['Delete photo','Fotoğrafı sil'],'+ Новая схема':['+ New scheme','+ Yeni şema'],'+ Новый бренд':['+ New brand','+ Yeni marka'],'Вариант ручки':['Handle option','Kol seçeneği'],'Переименовать':['Rename','Yeniden adlandır'],'Размер шрифта':['Font size','Yazı boyutu'],'Удалить бренд':['Delete brand','Markayı sil'],'Акцентный цвет':['Accent color','Vurgu rengi'],'Сохранить пазы':['Save grooves','Kanalları kaydet'],'+ Новое правило':['+ New rule','+ Yeni kural'],'Правила подбора':['Selection rules','Seçim kuralları'],'Профиль 14 · AL':['Profile 14 · AL','Profil 14 · AL'],'Схема раскладки':['Layout scheme','Yerleşim şeması'],'по высоте (ВСФ)':['by height','yüksekliğe göre'],'по ширине (ШСФ)':['by width','genişliğe göre'],'+ Добавить акцию':['+ Add promotion','+ Kampanya ekle'],'Название позиции':['Position name','Pozisyon adı'],'Проверить состав':['Check composition','İçeriği kontrol et'],'Ручка: смещённая':['Handle: offset','Kol: kaydırılmış'],'Усиленные 130 кг':['Reinforced 130 kg','Güçlendirilmiş 130 kg'],'базовый комплект':['base kit','temel set'],'по массе створки':['by sash weight','kanat ağırlığına göre'],'Рекламные виджеты':['Advertising widgets','Reklam bileşenleri'],'+ Добавить позицию':['+ Add item','+ Ürün ekle'],'ВСФ, мм (диапазон)':['Height, mm (range)','Yükseklik, mm (aralık)'],'ШСФ, мм (диапазон)':['Width, mm (range)','Genişlik, mm (aralık)'],'Конструктор правил':['Rule builder','Kural oluşturucu'],'по положению ручки':['by handle position','kol konumuna göre'],'+ Добавить диапазон':['+ Add range','+ Aralık ekle'],'Сбросить оформление':['Reset appearance','Görünümü sıfırla'],'+ В базовый комплект':['+ To base kit','+ Temel sete'],'Диапазон (ШСФ / ВСФ)':['Range (width / height)','Aralık (genişlik / yükseklik)'],'Проверить на размерах':['Check dimensions','Ölçülerde kontrol et'],'Редактор комплектации':['Configuration editor','Konfigürasyon düzenleyici'],'Удалить весь диапазон':['Delete entire range','Tüm aralığı sil'],'по стороне открывания':['by opening side','açılma yönüne göre'],'Внешний вид приложения':['Application appearance','Uygulama görünümü'],'Показать виджеты снова':['Show widgets again','Bileşenleri yeniden göster'],'Отступ петель от угла, мм':['Hinge offset from corner, mm','Menteşe köşe mesafesi, mm'],'Варианты паза для этого бренда':['Groove options for this brand','Bu marka için kanal seçenekleri'],'Высота ручки от низа, % высоты':['Handle height from bottom, %','Kol yüksekliği, alttan %'],'Базовый комплект (входит всегда)':['Base kit (always included)','Temel set (her zaman dahil)'],'Сбросить к исходному прайс-листу':['Reset to original price list','Orijinal fiyat listesine sıfırla'],'Сбросить к значениям по умолчанию':['Reset to defaults','Varsayılanlara sıfırla'],'Сбросить к исходным комплектациям':['Reset to original configurations','Orijinal konfigürasyonlara sıfırla'],'Новый диапазон для выбранной схемы':['New range for selected scheme','Seçili şema için yeni aralık'],'Загрузить комплектации из конструктора':['Load configurations from builder','Oluşturucudan konfigürasyonları yükle'],'Печатать также позиции накладной (по одной странице на позицию)':['Also print invoice positions (one page per position)','Fatura pozisyonlarını da yazdır (pozisyon başına bir sayfa)'],'Количество рассчитается автоматически по числу створок в позиции.':['Quantity is calculated automatically from the number of sashes.','Adet, pozisyondaki kanat sayısına göre otomatik hesaplanır.'],'Загрузите JSON из конструктора. Комплектации, база артикулов и цены обновятся вместе.':['Upload JSON from the builder. Configurations, catalog and prices will update together.','Oluşturucudan JSON yükleyin. Konfigürasyonlar, ürün veritabanı ve fiyatlar birlikte güncellenir.'],'Подбор комплектации по прайс-листу UPT/Proplex KZ, несколько позиций в одной накладной, ручная корректировка, экспорт в Excel.':['Hardware selection from the UPT/Proplex KZ price list, multiple positions per invoice, manual correction and Excel export.','UPT/Proplex KZ fiyat listesine göre donanım seçimi, tek faturada birden fazla pozisyon, manuel düzeltme ve Excel aktarımı.'],'Пользователей пока нет':['No users yet','Henüz kullanıcı yok'],'Создайте первый узел вашей ветки.':['Create the first node in your branch.','Şubenizdeki ilk düğümü oluşturun.'],'Ожидает активации':['Waiting for activation','Aktivasyon bekliyor'],'Зарегистрирован':['Registered','Kayıtlı'],'Вы':['You','Siz'],'Закрыть':['Close','Kapat'],'Это действие нельзя отменить.':['This action cannot be undone.','Bu işlem geri alınamaz.'],'Стиль интерфейса сохранён':['Interface style saved','Arayüz stili kaydedildi'],'Выбранный стиль применяется ко всему FUTURUSS.':['The selected style applies to all FUTURUSS users.','Seçilen stil tüm FUTURUSS kullanıcılarına uygulanır.'],'Секретный ключ не открывает систему сам по себе. Создайте логин и пароль Client.':['The secret key does not open the system by itself. Create a Client login and password.','Gizli anahtar tek başına sistemi açmaz. Müşteri kullanıcı adı ve şifresi oluşturun.'],'Секретный ключ — приглашение. Для доступа создайте логин и пароль Client.':['The secret key is an invitation. Create a Client login and password to gain access.','Gizli anahtar bir davettir. Erişim için Müşteri kullanıcı adı ve şifresi oluşturun.']
});

/* 2026.09.23.11 — exhaustive UI dictionary and runtime messages. */
Object.assign(dict,{
'Ниже —':['Below —','Aşağıda —'],
'Откуда':['Source','Kaynak'],
'ВСФ, мм':['Sash height, mm','Kanat yüksekliği, mm'],
'Границы':['Limits','Sınırlar'],
'ШСФ, мм':['Sash width, mm','Kanat genişliği, mm'],
'по пазу':['by groove','kanala göre'],
'правила':['rules','kurallar'],
'условная':['schematic','şematik'],
'Пластины PLS':['PLS plates','PLS plakaları'],
'Профиль 10 · AL02':['Profile 10 · AL02','Profil 10 · AL02'],
'Клипса фиксирующая KF':['KF retaining clip','KF sabitleme klipsi'],
'Пластина-фиксатор PLD':['PLD fixing plate','PLD sabitleme plakası'],
'Накладная на фурнитуру':['Hardware invoice','Donanım faturası'],
'Тёмно-серый (антрацит)':['Dark gray (anthracite)','Koyu gri (antrasit)'],
'База артикулов FUTURUSS':['FUTURUSS article database','FUTURUSS ürün kodu veritabanı'],
'Положение ручки смещённое':['Offset handle position','Kaydırılmış kol konumu'],
'Взломостойкая пластина PLV':['PLV security plate','PLV güvenlik plakası'],
'Конструктор правил подбора':['Selection rule builder','Seçim kuralı oluşturucu'],
'Ограничитель хода цапфы OZ':['OZ cam travel limiter','OZ pim hareket sınırlayıcı'],
'Разгружатель скрытой петли':['Concealed hinge support','Gizli menteşe desteği'],
'Сохранить как основной вид':['Save as default view','Varsayılan görünüm olarak kaydet'],
'Схема раскладки на створке':['Sash layout diagram','Kanat yerleşim şeması'],
'Соединительная пластина PLS':['PLS connector plate','PLS bağlantı plakası'],
'Импорт комплектаций из Excel':['Import configurations from Excel','Konfigürasyonları Excel’den içe aktar'],
'Ограничитель угла открывания':['Opening angle limiter','Açılma açısı sınırlayıcı'],
'Экспорт комплектаций в Excel':['Export configurations to Excel','Konfigürasyonları Excel’e aktar'],
'не предназначена для монтажа':['not intended for installation','montaj için tasarlanmamıştır'],
'Приподниматель-блокиратор MBU':['MBU sash lifter / blocker','MBU kanat kaldırıcı / blokaj'],
'(детали, которые входят всегда) и':['(parts that are always included) and','(her zaman dahil olan parçalar) ve'],
'Декоративное окончание привода OP':['OP decorative drive end','OP dekoratif tahrik ucu'],
'Отступ крайних зацепов от угла, мм':['End striker offset from corner, mm','Uç karşılık köşeden mesafe, mm'],
'Кнопка-блокиратор поворота ручки (BPR)':['Handle turn blocker (BPR)','Kol dönüş blokajı (BPR)'],
'Отступ зацепа откидного от верхнего угла, мм':['Tilt striker offset from top corner, mm','Vasistas karşılığı üst köşeden mesafe, mm'],
'FUTURUSS · Proplex KZ — Накладная на фурнитуру':['FUTURUSS · Proplex KZ — Hardware invoice','FUTURUSS · Proplex KZ — Donanım faturası'],
'Подбор комплектаций (данные по схемам и размерам)':['Configuration selection (scheme and size data)','Konfigürasyon seçimi (şema ve ölçü verileri)'],
'Дополнение к диапазонам ШСФ/ВСФ. Здесь для схемы задаётся':['Additional conditions for width/height ranges. Here the scheme defines','Genişlik/yükseklik aralıklarına ek koşullar. Burada şema için tanımlanır'],
'Введите параметры — увидите итоговый состав, сумму и откуда взялась каждая деталь.':['Enter the parameters to see the final composition, total and source of each part.','Parametreleri girin; nihai bileşimi, toplamı ve her parçanın kaynağını görün.'],
'— только для проверки на глаз. Поправьте цифры ниже под реальные допуски — изменения сразу применятся ко всем схемам.':['— for visual checking only. Adjust the values below to actual tolerances; changes apply to all schemes immediately.','— yalnızca görsel kontrol içindir. Aşağıdaki değerleri gerçek toleranslara göre düzenleyin; değişiklikler tüm şemalara hemen uygulanır.'],
'Через запятую. Попадают в выбор паза на вкладке «Накладная» и в правила по пазу. Для FUTURUSS список фиксированный (автоподбор по пазу).':['Comma-separated. Used in the groove selector on the Invoice tab and in groove rules. For FUTURUSS the list is fixed (automatic groove selection).','Virgülle ayırın. Fatura sekmesindeki kanal seçiminde ve kanal kurallarında kullanılır. FUTURUSS için liste sabittir (otomatik kanal seçimi).'],
'Полная структура «какая схема + какой диапазон размеров → какие артикулы и в каком количестве» — та же, что использует расчёт накладной. Выгрузите для проверки/корректировки и загрузите обратно.':['The full “scheme + size range → articles and quantities” structure is the same one used by invoice calculation. Export it for review/editing and import it back.','Tam “şema + ölçü aralığı → ürün kodları ve adetler” yapısı fatura hesaplamasında kullanılan yapıyla aynıdır. Kontrol/düzenleme için dışa aktarın ve yeniden içe alın.'],
'схема, построенная по общеотраслевым ориентирам, а не по паспорту FUTURUSS (точных монтажных допусков производителя у меня нет). Она показывается в каждой позиции накладной для наглядности состава, но':['a diagram based on general industry guidance, not the FUTURUSS specification (exact manufacturer installation tolerances are not available). It is shown in each invoice position for clarity, but','FUTURUSS teknik föyüne değil genel sektör referanslarına dayanan bir şemadır (üreticinin kesin montaj toleransları mevcut değildir). İçeriği göstermek için her fatura pozisyonunda yer alır, ancak'],
'— какая деталь подбирается по высоте, ширине, массе створки, стороне открывания, положению ручки или пазу. При расчёте позиции всё складывается: диапазон (если есть) + базовый комплект + правила. Пороги и артикулы берите из каталога — здесь ничего не подставляется само.':['— which part is selected by height, width, sash weight, opening side, handle position or groove. Calculation combines the range (if any), base kit and rules. Take thresholds and article codes from the catalog; nothing is substituted automatically here.','— hangi parçanın yükseklik, genişlik, kanat ağırlığı, açılma yönü, kol konumu veya kanala göre seçileceğini belirler. Hesaplama; aralık (varsa), temel set ve kuralları birleştirir. Eşikleri ve ürün kodlarını katalogdan alın; burada otomatik değer atanmaz.'],
'Элементы сгруппированы по категориям — раскройте нужную группу. Кнопка редактирования у позиции открывает отдельную ячейку названия/цены. Кнопка камеры прикрепляет или заменяет фото элемента; миниатюра слева от названия появляется, если фото уже загружено (клик по миниатюре — просмотр).':['Items are grouped by category. Expand the required group. The edit button opens the item name/price editor. The camera button attaches or replaces a photo; a thumbnail appears to the left of the name when a photo exists (click the thumbnail to view).','Öğeler kategoriye göre gruplandırılır. Gerekli grubu açın. Düzenle düğmesi ad/fiyat düzenleyicisini açar. Kamera düğmesi fotoğraf ekler veya değiştirir; fotoğraf varsa adın solunda küçük resim görünür (görüntülemek için tıklayın).'],
'Выберите схему, затем нажмите на нужный диапазон размеров — ниже появится таблица состава, где можно изменить количество, заменить (с поиском по артикулу/названию) или удалить позицию, добавить новую, поправить сами границы диапазона или создать новый диапазон (с нуля или как копию текущего).':['Select a scheme, then choose a size range. The composition table below lets you change quantities, replace (with article/name search) or delete items, add new items, edit range limits or create a new range from scratch or as a copy.','Bir şema seçin, ardından ölçü aralığını seçin. Aşağıdaki içerik tablosunda adetleri değiştirebilir, ürün kodu/ad aramasıyla öğe değiştirebilir veya silebilir, yeni öğe ekleyebilir, aralık sınırlarını düzenleyebilir ya da sıfırdan/kopya olarak yeni aralık oluşturabilirsiniz.'],
'Один список акций питает сразу два места: два плавающих виджета в правом нижнем углу (текст + иконка) и фото/видео-баннер справа от шапки (перебирает все фото из всех акций плавным переходом, каждые 7 секунд). На каждую акцию можно прикрепить до 10 фото — все они по очереди попадут в баннер. Отредактируйте список ниже — применяется сразу, без перезагрузки страницы. Для видео нужна прямая ссылка на файл (.mp4) — вставки с YouTube/Vimeo пока не поддерживаются.':['One promotion list feeds two areas: two floating widgets in the lower-right corner (text + icon) and the photo/video banner to the right of the header (cycles through all promotion images every 7 seconds). Up to 10 photos can be attached to each promotion. Edit the list below; changes apply immediately without reloading. Video requires a direct .mp4 file link; YouTube/Vimeo embeds are not supported yet.','Tek bir kampanya listesi iki alanı besler: sağ alttaki iki yüzen bileşen (metin + simge) ve başlığın sağındaki fotoğraf/video bannerı (tüm kampanya görsellerini 7 saniyede bir yumuşak geçişle döndürür). Her kampanyaya 10 adede kadar fotoğraf eklenebilir. Aşağıdaki listeyi düzenleyin; değişiklikler sayfa yenilenmeden hemen uygulanır. Video için doğrudan .mp4 dosya bağlantısı gerekir; YouTube/Vimeo gömmeleri henüz desteklenmez.'],
'Антрацит':['Anthracite','Antrasit'],
'Белая ручка':['White handle','Beyaz kol'],
'Чёрная ручка':['Black handle','Siyah kol'],
'Ручка антрацит':['Anthracite handle','Antrasit kol'],
'Коричневая ручка':['Brown handle','Kahverengi kol'],
'Название расчёта':['Calculation name','Hesap adı'],
'Система фурнитуры':['Hardware system','Donanım sistemi'],
'ВСФ, напр. 400-530':['Height, e.g. 400–530','Yükseklik, örn. 400–530'],
'ШСФ, напр. 400-600':['Width, e.g. 400–600','Genişlik, örn. 400–600'],
'Масса, кг (необяз.)':['Weight, kg (optional)','Ağırlık, kg (isteğe bağlı)'],
'Переименовать бренд':['Rename brand','Markayı yeniden adlandır'],
'Артикул или название...':['Article or name...','Ürün kodu veya ad...'],
'напр. паз 15 мм, паз 7,5 мм':['e.g. 15 mm groove, 7.5 mm groove','örn. 15 mm kanal, 7,5 mm kanal'],
'Создать новый бренд фурнитуры':['Create new hardware brand','Yeni donanım markası oluştur'],
'Открыть технический каталог (PDF)':['Open technical catalog (PDF)','Teknik kataloğu aç (PDF)'],
'Название правила, напр. Привод по высоте':['Rule name, e.g. Drive by height','Kural adı, örn. Yüksekliğe göre tahrik'],
'Название новой схемы, напр. Поворотно-откидная':['New scheme name, e.g. Tilt-and-turn','Yeni şema adı, örn. Çift açılım'],
'Создать копию этого диапазона со всеми позициями':['Copy this range with all items','Bu aralığı tüm öğeleriyle kopyala'],
'Ещё':['More','Daha fazla'],
'· ключ …':['· key …','· anahtar …'],
'Будет удалён':['Will be deleted','Silinecek'],
'и вся его дочерняя ветка (':['and its entire child branch (','ve tüm alt dalı ('],
'· данные Client скрыты для Central':['· Client data hidden from Central','· Müşteri verileri Central’dan gizlidir'],
'Передайте ключ Client. Для доступа он обязан активировать ключ и создать уникальные логин и пароль.':['Give the key to the Client. To gain access, they must activate it and create a unique login and password.','Anahtarı Müşteriye iletin. Erişim için anahtarı etkinleştirip benzersiz kullanıcı adı ve şifre oluşturmalıdır.'],
'Подождите…':['Please wait…','Lütfen bekleyin…'],
'Создание…':['Creating…','Oluşturuluyor…'],
'Сохранение…':['Saving…','Kaydediliyor…'],
'Удаление…':['Deleting…','Siliniyor…'],
'Импорт…':['Importing…','İçe aktarılıyor…'],
'Некорректный ответ сервера':['Invalid server response','Geçersiz sunucu yanıtı'],
'Ошибка API':['API error','API hatası'],
'Внутренняя ошибка сервера':['Internal server error','Sunucu iç hatası'],
'Импортируем базу в Istina / Central…':['Importing database into Istina / Central…','Veritabanı Istina / Central’a aktarılıyor…'],
'База обновлена:':['Database updated:','Veritabanı güncellendi:'],
'артикулов':['articles','ürün kodu'],
'комплектаций':['configurations','konfigürasyon'],
'Ошибка импорта:':['Import error:','İçe aktarma hatası:'],
'Dealer создан':['Dealer created','Bayi oluşturuldu'],
'Subdealer создан':['Subdealer created','Alt bayi oluşturuldu'],
'Изменения сохранены':['Changes saved','Değişiklikler kaydedildi'],
'Пользователь удалён':['User deleted','Kullanıcı silindi'],
'Удалено узлов:':['Nodes deleted:','Silinen düğümler:'],
'Central создаёт только корневых дилеров.':['Central creates root Dealers only.','Central yalnızca kök Bayileri oluşturur.'],
'Измените нужные поля и сохраните пользователя.':['Edit the required fields and save the user.','Gerekli alanları düzenleyip kullanıcıyı kaydedin.'],
'Новый пользователь будет создан непосредственно в вашей ветке.':['The new user will be created directly in your branch.','Yeni kullanıcı doğrudan şubenizde oluşturulur.'],
'Вы можете создавать только Subdealer и Client непосредственно внутри своей ветки.':['You can create only Subdealers and Clients directly inside your branch.','Yalnızca kendi şubenizde doğrudan Alt bayi ve Müşteri oluşturabilirsiniz.'],
'Central создаёт Dealer. Subdealer и Client создаются соответствующим Dealer/Subdealer.':['Central creates Dealers. Subdealers and Clients are created by their Dealer/Subdealer.','Central Bayi oluşturur. Alt bayi ve Müşteri, ilgili Bayi/Alt bayi tarafından oluşturulur.'],
'Ключ показывается только сейчас. Client должен активировать его и создать собственные логин и пароль.':['The key is shown only now. The Client must activate it and create their own login and password.','Anahtar yalnızca şimdi gösterilir. Müşteri anahtarı etkinleştirip kendi kullanıcı adı ve şifresini oluşturmalıdır.'],
'Email':['Email','E-posta'],
'данные Client скрыты для Central':['Client data hidden from Central','Müşteri verileri Central’dan gizlidir'],
'ключ …':['key …','anahtar …'],
'доступ':['access','erişim'],
'цены':['prices','fiyatlar'],
'Цены:':['Prices:','Fiyatlar:'],
'Зарегистрирован':['Registered','Kayıtlı'],
'Ожидает активации':['Waiting for activation','Aktivasyon bekliyor'],
'Вы':['You','Siz'],
'Пользователей пока нет':['No users yet','Henüz kullanıcı yok'],
'Создайте первый узел вашей ветки.':['Create the first node in your branch.','Şubenizdeki ilk düğümü oluşturun.'],
'Это действие нельзя отменить.':['This action cannot be undone.','Bu işlem geri alınamaz.'],
'(оставьте пустым, чтобы не менять)':['(leave blank to keep unchanged)','(değiştirmemek için boş bırakın)'],
'Выбранный стиль применяется ко всему FUTURUSS.':['The selected style applies to all of FUTURUSS.','Seçilen stil tüm FUTURUSS’a uygulanır.'],
'В 1С':['To 1C','1C’ye'],
'В ERP':['To ERP','ERP’ye'],
'Готово':['Done','Tamam'],
'Конструкций:':['Constructions:','Konstrüksiyonlar:'],
'Смещённая ручка':['Offset handle','Kaydırılmış kol'],
'Сохранение расчёта':['Save calculation','Hesabı kaydet'],
'Действия с накладной':['Invoice actions','Fatura işlemleri'],
'Дизайн интерфейса':['Interface design','Arayüz tasarımı'],
'Блокиратор поворота · BPR':['Turn blocker · BPR','Dönüş blokajı · BPR'],
'Введите название расчёта':['Enter calculation name','Hesap adını girin'],
'Экспорт накладной в Excel':['Export invoice to Excel','Faturayı Excel’e aktar'],
'Выгрузить накладную для 1С':['Export invoice for 1C','Faturayı 1C için dışa aktar'],
'Артикул или название детали':['Article or part name','Ürün kodu veya parça adı'],
'Передать состав накладной в ERP':['Send invoice composition to ERP','Fatura içeriğini ERP’ye aktar'],
'Найти деталь по артикулу или названию':['Find a part by article or name','Parçayı ürün kodu veya ada göre bul'],
'Печать накладной или сохранение в PDF':['Print invoice or save as PDF','Faturayı yazdır veya PDF olarak kaydet'],
'Сохранить, открыть или выгрузить расчёт':['Save, open or export calculation','Hesabı kaydet, aç veya dışa aktar'],
'Не удалось загрузить рекламное изображение.':['Failed to load advertising image.','Reklam görseli yüklenemedi.'],
'Конфигурация':['Configuration','Konfigürasyon'],
'Черновик':['Draft','Taslak'],
'Черновик очищен':['Draft cleared','Taslak temizlendi'],
'нажмите, чтобы скрыть':['click to hide','gizlemek için tıklayın'],
'нажмите, чтобы открыть':['click to open','açmak için tıklayın'],
'Расчёт сохранён в файл.':['Calculation saved to file.','Hesap dosyaya kaydedildi.'],
'Условная схема раскладки':['Schematic layout','Şematik yerleşim'],
'Фото детали не добавлено':['Part photo not added','Parça fotoğrafı eklenmedi'],
'Выберите артикул в накладной':['Select an article in the invoice','Faturada bir ürün kodu seçin'],
'Комплектации из конструктора':['Configurations from builder','Oluşturucudan konfigürasyonlar'],
'Черновик сохранён автоматически':['Draft saved automatically','Taslak otomatik kaydedildi'],
'Черновик восстановлен автоматически.':['Draft restored automatically.','Taslak otomatik geri yüklendi.'],
'Не удалось сохранить черновик в браузере':['Failed to save draft in browser','Taslak tarayıcıya kaydedilemedi'],
'Таблица товаров для счёта 1С выгружена.':['Product table for the 1C invoice was exported.','1C faturası için ürün tablosu dışa aktarıldı.'],
'Файл обмена для загрузчика 1С выгружен.':['Exchange file for the 1C importer was exported.','1C içe aktarıcısı için değişim dosyası dışa aktarıldı.'],
'Выберите схему.':['Select a scheme.','Bir şema seçin.'],
'Артикул заменён.':['Article replaced.','Ürün kodu değiştirildi.'],
'Диапазон удалён.':['Range deleted.','Aralık silindi.'],
'Накладная очищена.':['Invoice cleared.','Fatura temizlendi.'],
'Укажите ШСФ и ВСФ.':['Enter width and height.','Genişlik ve yüksekliği girin.'],
'Количество обновлено.':['Quantity updated.','Adet güncellendi.'],
'Не удалось сохранить.':['Failed to save.','Kaydedilemedi.'],
'Ошибка чтения файла:':['File read error:','Dosya okuma hatası:'],
'Новое название бренда:':['New brand name:','Yeni marka adı:'],
'Укажите количество правых и/или левых открываний.':['Enter the number of right and/or left openings.','Sağ ve/veya sol açılım adedini girin.'],
'SheetJS загрузился, но Excel API недоступен.':['SheetJS loaded, but the Excel API is unavailable.','SheetJS yüklendi ancak Excel API kullanılamıyor.'],
'Не удалось загрузить Excel-модуль SheetJS. Проверьте подключение к интернету и повторите действие.':['Could not load the SheetJS Excel module. Check your internet connection and try again.','SheetJS Excel modülü yüklenemedi. İnternet bağlantınızı kontrol edip tekrar deneyin.'],
'Ничего не найдено':['Nothing found','Sonuç bulunamadı'],
'Фото не загружено':['Photo not uploaded','Fotoğraf yüklenmedi'],
'Просмотреть фото':['View photo','Fotoğrafı görüntüle'],
'Прикрепить фото':['Attach photo','Fotoğraf ekle'],
'Лимит':['Limit','Limit'],
'фото достигнут':['photo limit reached','fotoğraf sınırına ulaşıldı'],
'Ссылка на видео .mp4 (необязательно)':['Video .mp4 link (optional)','Video .mp4 bağlantısı (isteğe bağlı)'],
'Текст акции':['Promotion text','Kampanya metni'],
'Ссылка (необязательно)':['Link (optional)','Bağlantı (isteğe bağlı)'],
'от':['from','başlangıç'],
'до':['to','bitiş'],
'Данные ещё не загружены. Дождитесь импорта Istina / Central.':['Data has not been uploaded yet. Wait for the Istina / Central import.','Veriler henüz yüklenmedi. Istina / Central içe aktarımını bekleyin.'],
'Укажите ширину и высоту створки.':['Enter sash width and height.','Kanat genişliği ve yüksekliğini girin.'],
'Выберите привод для этих размеров':['Select a drive for these dimensions','Bu ölçüler için tahrik seçin'],
'Привод не выбран':['Drive not selected','Tahrik seçilmedi'],
'По правилам комплектации':['According to configuration rules','Konfigürasyon kurallarına göre'],
'Из конструктора':['From builder','Oluşturucudan'],
'Дополнительные опции':['Additional options','Ek seçenekler'],
'Позиции бренда':['Brand items','Marka öğeleri'],
'Добавлено программой':['Added by the application','Uygulama tarafından eklendi'],
'Не удалось загрузить файл:':['Failed to load file:','Dosya yüklenemedi:'],
'В этой базе нет комплектаций':['No configurations in this database','Bu veritabanında konfigürasyon yok'],
'Укажите целое неотрицательное количество правых и левых створок. Нужна хотя бы одна створка.':['Enter non-negative whole numbers of right and left sashes. At least one sash is required.','Sağ ve sol kanat adetlerini negatif olmayan tam sayı olarak girin. En az bir kanat gerekir.'],
'Для этой высоты подходит несколько приводов. Выберите нужный в поле «Вариант привода» под количеством правых и левых створок.':['Several drives match this height. Select the required one in “Drive option” below the right/left sash counts.','Bu yükseklik için birden fazla tahrik uygundur. Sağ/sol kanat adetlerinin altındaki “Tahrik seçeneği” alanından gerekli olanı seçin.'],
'Выберите дорнмасс.':['Select backset.','Dorun ölçüsünü seçin.'],
'Не выбраны ножницы.':['Scissors are not selected.','Makas seçilmedi.'],
'В файле нет артикула':['The file does not contain article','Dosyada ürün kodu yok'],
'Неверная комплектация':['Invalid configuration','Geçersiz konfigürasyon'],
'Выберите цвет накладок.':['Select cover color.','Kapak rengini seçin.'],
'Выберите вариант петель.':['Select hinge option.','Menteşe seçeneğini seçin.'],
'Неизвестный формат файла':['Unknown file format','Bilinmeyen dosya biçimi'],
'В базе нет усиленной петли':['The database has no reinforced hinge','Veritabanında güçlendirilmiş menteşe yok'],
'Неверная карточка артикула':['Invalid article record','Geçersiz ürün kartı'],
'В составе есть незаполненная деталь.':['The composition contains an incomplete part.','İçerikte eksik doldurulmuş bir parça var.'],
'Не выбран поворотно-откидной привод.':['Tilt-and-turn drive is not selected.','Çift açılım tahriki seçilmedi.'],
'Выберите профиль ALU 14 или ALU 10.':['Select ALU profile 14 or ALU 10.','ALU 14 veya ALU 10 profilini seçin.'],
'В комплектации не указан профиль / паз.':['Profile / groove is not specified in the configuration.','Konfigürasyonda profil / kanal belirtilmemiş.'],
'Комплектация не найдена в загруженном файле.':['Configuration not found in the uploaded file.','Konfigürasyon yüklenen dosyada bulunamadı.'],
'Рекламное изображение имеет неверный формат.':['Advertising image has an invalid format.','Reklam görselinin biçimi geçersiz.'],
'Состав ячейки ещё не отмечен как проверенный.':['The cell composition has not been marked as verified yet.','Hücre içeriği henüz doğrulanmış olarak işaretlenmedi.'],
'Количество створок должно быть целым и больше нуля.':['Sash quantity must be a whole number greater than zero.','Kanat adedi sıfırdan büyük bir tam sayı olmalıdır.'],
'Файл не является библиотекой табличных комплектаций.':['The file is not a tabular configuration library.','Dosya tablo tabanlı bir konfigürasyon kütüphanesi değildir.'],
'Ширина и высота должны быть целыми положительными числами.':['Width and height must be positive whole numbers.','Genişlik ve yükseklik pozitif tam sayılar olmalıdır.']
});

Object.assign(dict,{
'Требуется авторизация.':['Authentication required.','Oturum açmanız gerekiyor.'],
'Недостаточно прав.':['Insufficient permissions.','Yetersiz yetki.'],
'Сначала создайте администратора Istina / Central.':['Create the Istina / Central administrator first.','Önce Istina / Central yöneticisini oluşturun.'],
'Неизвестный стиль интерфейса.':['Unknown interface style.','Bilinmeyen arayüz stili.'],
'Ожидается JSON конструктора с articles и kits.':['A builder JSON with articles and kits is expected.','articles ve kits içeren oluşturucu JSON dosyası bekleniyor.'],
'Ожидается актуальный контракт futuruss-matrix v2: schemaVersion, format, articles и kits.':['Expected futuruss-matrix v2 contract: schemaVersion, format, articles, and kits.','futuruss-matrix v2 sözleşmesi bekleniyor: schemaVersion, format, articles ve kits.'],
'Некорректная карточка артикула: ':['Invalid article record: ','Geçersiz ürün kartı: '],
'Некорректная комплектация: контракт требует уникальные id, variant, name, rows, columns, common и cells.':['Invalid configuration: the contract requires unique id, variant, name, rows, columns, common, and cells.','Geçersiz konfigürasyon: sözleşme benzersiz id, variant, name, rows, columns, common ve cells alanlarını gerektirir.'],
'Рекламные изображения должны быть data URI PNG, JPEG или WebP.':['Advertising images must be PNG, JPEG, or WebP data URIs.','Reklam görselleri PNG, JPEG veya WebP data URI olmalıdır.'],
'Не удалось сохранить серверные данные.':['Failed to save server data.','Sunucu verileri kaydedilemedi.'],
'Не удалось завершить сохранение серверных данных.':['Failed to finish saving server data.','Sunucu verilerinin kaydı tamamlanamadı.'],
'Администратор Central уже создан.':['The Central administrator already exists.','Central yöneticisi zaten oluşturulmuş.'],
'Логин должен содержать минимум 3 символа.':['Login must contain at least 3 characters.','Kullanıcı adı en az 3 karakter olmalıdır.'],
'Такой логин уже используется.':['This login is already in use.','Bu kullanıcı adı zaten kullanılıyor.'],
'Пароль должен содержать минимум 8 символов.':['Password must contain at least 8 characters.','Şifre en az 8 karakter olmalıdır.'],
'Доступ деактивирован.':['Access is disabled.','Erişim devre dışı.'],
'Регистрация Client не завершена.':['Client registration is not complete.','Müşteri kaydı tamamlanmadı.'],
'Неверный логин или пароль.':['Incorrect login or password.','Kullanıcı adı veya şifre yanlış.'],
'Введите секретный ключ.':['Enter the secret key.','Gizli anahtarı girin.'],
'Client деактивирован или заблокирован вышестоящим уровнем.':['Client is disabled or blocked by a parent level.','Müşteri devre dışı veya üst seviye tarafından engellenmiş.'],
'Секретный ключ не найден.':['Secret key not found.','Gizli anahtar bulunamadı.'],
'Логин минимум 3 символа.':['Login must be at least 3 characters.','Kullanıcı adı en az 3 karakter olmalıdır.'],
'Пароль минимум 8 символов.':['Password must be at least 8 characters.','Şifre en az 8 karakter olmalıdır.'],
'Client не найден.':['Client not found.','Müşteri bulunamadı.'],
'Этот Client уже зарегистрирован. Войдите по логину и паролю.':['This Client is already registered. Sign in with login and password.','Bu Müşteri zaten kayıtlı. Kullanıcı adı ve şifreyle giriş yapın.'],
'Неизвестный тип пользователя.':['Unknown user type.','Bilinmeyen kullanıcı türü.'],
'Укажите название.':['Enter a name.','Bir ad girin.'],
'Central может создавать только Dealer.':['Central can create Dealers only.','Central yalnızca Bayi oluşturabilir.'],
'Дилерский узел не найден.':['Dealer node not found.','Bayi düğümü bulunamadı.'],
'Создавать пользователей могут только Central и Dealer/Subdealer.':['Only Central and Dealer/Subdealer can create users.','Yalnızca Central ve Bayi/Alt bayi kullanıcı oluşturabilir.'],
'Для Dealer/Subdealer нужны логин от 3 символов и пароль от 8 символов.':['Dealer/Subdealer requires a login of at least 3 characters and a password of at least 8 characters.','Bayi/Alt bayi için en az 3 karakterlik kullanıcı adı ve en az 8 karakterlik şifre gerekir.'],
'Пользователь не найден.':['User not found.','Kullanıcı bulunamadı.'],
'Можно изменять только непосредственных пользователей своей ветки.':['You can edit only direct users in your branch.','Yalnızca şubenizdeki doğrudan kullanıcıları düzenleyebilirsiniz.'],
'Можно удалять только непосредственных пользователей своей ветки.':['You can delete only direct users in your branch.','Yalnızca şubenizdeki doğrudan kullanıcıları silebilirsiniz.'],
'Ключ может перевыпустить только непосредственный Dealer/Subdealer этого Client.':['Only this Client’s direct Dealer/Subdealer can reissue the key.','Anahtarı yalnızca bu Müşterinin doğrudan Bayisi/Alt bayisi yeniden oluşturabilir.']
});

Object.assign(dict,{
'Название нового бренда фурнитуры (например, ROTO, MACO, VBH):':['New hardware brand name (for example, ROTO, MACO, VBH):','Yeni donanım markası adı (örneğin ROTO, MACO, VBH):'],
'Встроенный профиль FUTURUSS удалить нельзя.':['The built-in FUTURUSS profile cannot be deleted.','Yerleşik FUTURUSS profili silinemez.'],
'Встроенный профиль FUTURUSS переименовать нельзя.':['The built-in FUTURUSS profile cannot be renamed.','Yerleşik FUTURUSS profili yeniden adlandırılamaz.'],
'Новое название бренда:':['New brand name:','Yeni marka adı:'],
'не указан':['not specified','belirtilmedi'],
'Укажите количество правых и/или левых открываний.':['Enter the number of right and/or left openings.','Sağ ve/veya sol açılım adedini girin.'],
'Для этих размеров подходят сразу несколько диапазонов':['Several ranges match these dimensions','Bu ölçülere birden fazla aralık uyuyor'],
'расчёт остановлен, чтобы не выбрать комплект наугад.':['calculation stopped to avoid selecting a kit arbitrarily.','rastgele bir set seçilmemesi için hesaplama durduruldu.'],
'Исправьте границы в «Настройки → Комплектации».':['Fix the ranges in “Settings → Configurations”.','“Ayarlar → Konfigürasyonlar” bölümündeki aralıkları düzeltin.'],
'Позиция':['Position','Pozisyon'],
'строк':['rows','satır'],
'Есть позиции с ценой по умолчанию 500 ₸.':['Some items use the default price of 500 ₸.','Bazı kalemlerde varsayılan 500 ₸ fiyatı kullanılıyor.'],
'Здесь можно вручную добавить в эту позицию ещё одну деталь из базы артикулов — начните вводить артикул или название...':['You can manually add another part from the article database to this position — start typing an article or name...','Bu pozisyona ürün veritabanından manuel olarak başka bir parça ekleyebilirsiniz — ürün kodu veya adı yazmaya başlayın...'],
'Выберите деталь из списка (начните вводить артикул или название и кликните по нужному варианту).':['Select a part from the list (start typing an article or name and click the required option).','Listeden bir parça seçin (ürün kodu veya adı yazmaya başlayıp gerekli seçeneğe tıklayın).'],
'Ничего не найдено по запросу':['Nothing found for','Şu sorgu için sonuç bulunamadı'],
'Проверьте написание или попробуйте часть артикула.':['Check the spelling or try part of the article number.','Yazımı kontrol edin veya ürün kodunun bir bölümünü deneyin.'],
'Артикул обновлён.':['Article updated.','Ürün kodu güncellendi.'],
'Не удалось сохранить базу артикулов:':['Failed to save the article database:','Ürün veritabanı kaydedilemedi:'],
'Импортировано артикулов:':['Articles imported:','İçe aktarılan ürün kodları:'],
'База артикулов сброшена к исходному прайс-листу.':['Article database reset to the original price list.','Ürün veritabanı orijinal fiyat listesine sıfırlandı.'],
'У этого бренда нет «исходного» прайс-листа для отката — полностью очистить базу артикулов?':['This brand has no original price list to restore — clear the article database completely?','Bu markanın geri yüklenecek orijinal fiyat listesi yok — ürün veritabanı tamamen temizlensin mi?'],
'База артикулов очищена. Загрузите прайс-лист заново.':['Article database cleared. Upload the price list again.','Ürün veritabanı temizlendi. Fiyat listesini yeniden yükleyin.'],
'Введите название новой схемы.':['Enter a name for the new scheme.','Yeni şema için bir ad girin.'],
'Схема с таким названием уже существует — выберите её в списке.':['A scheme with this name already exists — select it from the list.','Bu ada sahip bir şema zaten var — listeden seçin.'],
'Для этой схемы пока нет ни одного диапазона — создайте его ниже.':['This scheme has no ranges yet — create one below.','Bu şemada henüz aralık yok — aşağıdan bir tane oluşturun.'],
'В этом диапазоне пока нет позиций — добавьте первую ниже.':['This range has no items yet — add the first one below.','Bu aralıkta henüz öğe yok — aşağıdan ilkini ekleyin.'],
'Позиция удалена из комплектации.':['Item removed from the configuration.','Öğe konfigürasyondan kaldırıldı.'],
'Сначала выберите схему и диапазон.':['Select a scheme and range first.','Önce bir şema ve aralık seçin.'],
'Выберите артикул из списка (начните вводить и кликните по нужному варианту).':['Select an article from the list (start typing and click the required option).','Listeden bir ürün kodu seçin (yazmaya başlayıp gerekli seçeneğe tıklayın).'],
'Укажите оба диапазона (ШСФ и ВСФ).':['Enter both ranges (width and height).','Her iki aralığı da girin (genişlik ve yükseklik).'],
'Границы сохранены, но есть на что обратить внимание:':['Ranges saved, but there are issues to review:','Aralıklar kaydedildi, ancak dikkat edilmesi gereken noktalar var:'],
'Границы диапазона сохранены.':['Range boundaries saved.','Aralık sınırları kaydedildi.'],
'Укажите оба диапазона для нового блока.':['Enter both ranges for the new block.','Yeni blok için her iki aralığı da girin.'],
'Обратите внимание:':['Please note:','Dikkat:'],
'Сначала выберите диапазон для копирования.':['Select a range to copy first.','Önce kopyalanacak aralığı seçin.'],
'Сохранить границы':['Save boundaries','Sınırları kaydet'],
'Импортировано схем:':['Schemes imported:','İçe aktarılan şemalar:'],
'Комплектации сброшены к исходным данным прайс-листа.':['Configurations reset to the original price-list data.','Konfigürasyonlar orijinal fiyat listesi verilerine sıfırlandı.'],
'У этого бренда нет «исходных» комплектаций для отката — удалить все схемы полностью?':['This brand has no original configurations to restore — delete all schemes completely?','Bu markanın geri yüklenecek orijinal konfigürasyonları yok — tüm şemalar tamamen silinsin mi?'],
'Все комплектации удалены.':['All configurations deleted.','Tüm konfigürasyonlar silindi.'],
'Правила расстановки сохранены — применены ко всем схемам.':['Layout rules saved — applied to all schemes.','Yerleşim kuralları kaydedildi — tüm şemalara uygulandı.'],
'Правила расстановки сброшены по умолчанию.':['Layout rules reset to defaults.','Yerleşim kuralları varsayılanlara sıfırlandı.'],
'Виджеты снова видны на странице.':['Widgets are visible on the page again.','Bileşenler sayfada yeniden görünür.'],
'Здесь появится фото или видео акции — добавьте в «Настройки → Реклама»':['A promotion photo or video will appear here — add it in “Settings → Advertising”','Kampanya fotoğrafı veya videosu burada görünecek — “Ayarlar → Reklam” bölümünden ekleyin'],
'Акций пока нет — добавьте хотя бы одну ниже.':['No promotions yet — add at least one below.','Henüz kampanya yok — aşağıdan en az bir tane ekleyin.'],
'Фото':['Photo','Fotoğraf'],
'из':['of','/'],
'Убрать это фото':['Remove this photo','Bu fotoğrafı kaldır'],
'Удалить акцию':['Delete promotion','Kampanyayı sil'],
'Иконка':['Icon','Simge'],
'Для этой акции уже загружено максимум':['The maximum number of photos is already uploaded for this promotion:','Bu kampanya için azami fotoğraf sayısına ulaşıldı:'],
'Фото добавлено':['Photo added','Fotoğraf eklendi'],
'нажмите «Сохранить», чтобы применить в баннере.':['click “Save” to apply it to the banner.','bannerda uygulamak için “Kaydet”e tıklayın.'],
'Акции сохранены и сразу применены в виджетах и баннере.':['Promotions saved and applied to widgets and the banner.','Kampanyalar kaydedildi ve bileşenler ile bannera uygulandı.'],
'Расчёт по данным выбранного бренда через новый движок MatrixCore.':['Calculated from the selected brand data using MatrixCore.','Seçilen marka verileri MatrixCore ile hesaplanır.'],
'левая':['left','sol'],'правая':['right','sağ'],'профиль не указан':['profile not specified','profil belirtilmedi'],
'Правое и левое открывание подбираются по парным артикулам из файла. Дополнительные позиции — по флажкам ниже.':['Right and left openings are selected using paired articles from the file. Additional items are controlled by the options below.','Sağ ve sol açılımlar dosyadaki eş ürün kodlarına göre seçilir. Ek kalemler aşağıdaki seçeneklerle kontrol edilir.'],
'дорнмасс':['backset','dorun ölçüsü'],'мм':['mm','mm'],'ВСФ':['Height','Yükseklik'],'ШСФ':['Width','Genişlik'],
'Загрузите файл конструктора и выберите загруженную комплектацию.':['Upload the builder file and select an imported configuration.','Oluşturucu dosyasını yükleyip içe aktarılan bir konfigürasyon seçin.'],
'Позиция добавлена новым расчётным движком MatrixCore.':['Position added using the MatrixCore calculation engine.','Pozisyon MatrixCore hesaplama motoruyla eklendi.'],
'В файле указан профиль «':['The file specifies profile “','Dosyada belirtilen profil “'],
'», а в форме «':['”, while the form has “','”, formda ise “'],
'». Выберите соответствующую комплектацию или профиль; зацепы не подменяются автоматически.':['”. Select the matching configuration or profile; strikers are not replaced automatically.','”. Uygun konfigürasyonu veya profili seçin; karşılık parçaları otomatik değiştirilmez.'],
'Позиция добавлена из загруженной комплектации.':['Position added from the imported configuration.','Pozisyon içe aktarılan konfigürasyondan eklendi.'],
'Подключено из Central:':['Loaded from Central:','Central’dan yüklendi:'],
'Загружено':['Loaded','Yüklendi'],'комплектаций':['configurations','konfigürasyon'],'артикулов':['articles','ürün kodu'],
'Файл запомнен в этом браузере.':['The file is saved in this browser.','Dosya bu tarayıcıda kaydedildi.'],
'Браузер не сохранил файл; после перезапуска загрузите его снова.':['The browser did not save the file; upload it again after restarting.','Tarayıcı dosyayı kaydetmedi; yeniden başlattıktan sonra tekrar yükleyin.'],
'Не удалось прочитать комплектацию выбранного бренда.':['Could not read the selected brand configuration.','Seçilen marka konfigürasyonu okunamadı.'],
'Для этих размеров в комплектации нет подходящего диапазона.':['No matching range exists in the configuration for these dimensions.','Bu ölçüler için konfigürasyonda uygun aralık yok.'],
'Для этих размеров подходят несколько диапазонов. Исправьте пересекающиеся границы в настройках комплектации.':['Several ranges match these dimensions. Fix overlapping boundaries in configuration settings.','Bu ölçülere birden fazla aralık uyuyor. Konfigürasyon ayarlarındaki çakışan sınırları düzeltin.'],
'В комплектации нет диапазонов, общего состава или правил.':['The configuration has no ranges, base composition, or rules.','Konfigürasyonda aralık, temel içerik veya kural yok.'],
'Счёт на оплату в 1С':['Invoice for payment in 1C','1C ödeme faturası'],
'Скачать Excel для 1С':['Download Excel for 1C','1C için Excel indir'],
'Скачать файл обмена':['Download exchange file','Değişim dosyasını indir'],
'Файл обмена JSON предназначен для загрузчика FUTURUSS в 1С. Его подключает специалист 1С. Excel доступен для табличной загрузки.':['The JSON exchange file is intended for the FUTURUSS importer in 1C. A 1C specialist connects it. Excel is available for table import.','JSON değişim dosyası 1C’deki FUTURUSS içe aktarıcısı içindir. 1C uzmanı tarafından bağlanır. Tablo aktarımı için Excel kullanılabilir.'],
'Рекламное фото появится после загрузки комплектации с изображением из конструктора.':['The advertising photo will appear after a configuration with an image is loaded from the builder.','Oluşturucudan görsel içeren bir konfigürasyon yüklendiğinde reklam fotoğrafı görünecek.'],
'Реклама из конструктора':['Advertising from builder','Oluşturucudan reklam'],
'Товарных позиций:':['Product items:','Ürün kalemleri:'],
'Из конструктора':['From builder','Oluşturucudan'],
'Рекламное изображение':['Advertising image','Reklam görseli'],'Сервер не подтвердил сохранение.':['The server did not confirm the save.','Sunucu kaydetmeyi doğrulamadı.'],
'Название расчёта':['Calculation name','Hesap adı'],
'Без названия':['Untitled','Adsız'],
'Без подгруппы':['No subgroup','Alt grup yok'],
'Здесь появится выбранная деталь':['The selected part will appear here','Seçilen parça burada görünecek'],
'Выгрузка для 1С':['Export for 1C','1C için dışa aktar'],
'Без НДС; налог не начислять, исходные цены и суммы сохранять':['Without VAT; do not add tax, preserve original prices and totals','KDV hariç; vergi eklemeyin, orijinal fiyat ve toplamları koruyun'],
'Валюта':['Currency','Para birimi'],'Дата выгрузки':['Export date','Dışa aktarma tarihi'],'Документ':['Document','Belge'],'Параметр':['Parameter','Parametre'],'Значение':['Value','Değer'],'Количество':['Quantity','Adet'],'НДС':['VAT','KDV'],
'В расчёте нет товаров с положительным количеством.':['The calculation has no products with a positive quantity.','Hesapta pozitif adetli ürün yok.'],
'Есть строка без артикула. Заполните её перед выгрузкой.':['A row has no article number. Fill it in before export.','Bir satırda ürün kodu yok. Dışa aktarmadan önce doldurun.'],
'Итог расчёта слишком велик для выгрузки.':['The calculation total is too large to export.','Hesap toplamı dışa aktarma için çok büyük.'],
'Проверьте количество и цену артикула':['Check the quantity and price of article','Ürün kodunun adetini ve fiyatını kontrol edin'],
'Сначала добавьте хотя бы одну позицию в накладную.':['Add at least one position to the invoice first.','Önce faturaya en az bir pozisyon ekleyin.'],
'Сначала откройте или создайте расчёт.':['Open or create a calculation first.','Önce bir hesap açın veya oluşturun.'],
'Выберите сохранённый расчёт.':['Select a saved calculation.','Kaydedilmiş bir hesap seçin.'],
'Введите новое название расчёта.':['Enter a new calculation name.','Yeni hesap adını girin.'],
'Не удалось сохранить расчёт:':['Failed to save calculation:','Hesap kaydedilemedi:'],
'Не удалось открыть файл:':['Failed to open file:','Dosya açılamadı:'],
'Не удалось создать копию:':['Failed to create a copy:','Kopya oluşturulamadı:'],
'Создана копия':['Copy created','Kopya oluşturuldu'],
'Сохранённые цены восстановлены.':['Saved prices restored.','Kaydedilmiş fiyatlar geri yüklendi.'],
'Цены зафиксированы.':['Prices locked.','Fiyatlar sabitlendi.'],
'удалён.':['deleted.','silindi.'],
'открыт.':['opened.','açıldı.'],
'сохранён.':['saved.','kaydedildi.'],
'(загружено вручную)':['(uploaded manually)','(manuel yüklendi)']
});

Object.assign(dict,{
'1С':['1C','1C'],
': не соответствует виду цапфы.':[': does not match the cam type.',': kilitleme pimi tipine uymuyor.'],
'Сначала создайте схему в «Комплектации».':['Create a scheme in “Configurations” first.','Önce “Konfigürasyonlar” bölümünde bir şema oluşturun.'],
'В файле используйте лист «Товары»: артикул → поиск номенклатуры; количество → количество; цена → цена. Название и сумма доступны для проверки. Не загружайте лист «Расчёт» в товары.':['In the file, use the “Products” sheet: article → product lookup; quantity → quantity; price → price. Name and amount are available for verification. Do not import the “Calculation” sheet as products.','Dosyada “Ürünler” sayfasını kullanın: ürün kodu → ürün eşleştirme; adet → adet; fiyat → fiyat. Ad ve tutar kontrol için gösterilir. “Hesap” sayfasını ürün olarak içe aktarmayın.'],
'Выгрузите таблицу товаров, затем загрузите её в созданный счёт 1С. Покупателя, организацию и договор задайте в 1С. Режим — без НДС; налог к суммам не добавляйте. Сопоставляйте товары по артикулу.':['Export the product table, then import it into the created 1C invoice. Set the customer, organization, and contract in 1C. Use the no-VAT mode; do not add tax to amounts. Match products by article number.','Ürün tablosunu dışa aktarın, ardından oluşturulan 1C faturasına yükleyin. Müşteri, kuruluş ve sözleşmeyi 1C içinde seçin. KDV’siz modu kullanın; tutarlara vergi eklemeyin. Ürünleri ürün koduna göre eşleştirin.'],
'Первую загрузку нужно проверить в вашей 1С. Этот файл передаёт товары и цены; он сам не создаёт документ в базе.':['Verify the first import in your 1C. This file transfers products and prices; it does not create a document in the database by itself.','İlk içe aktarmayı kendi 1C sisteminizde kontrol edin. Bu dosya ürünleri ve fiyatları aktarır; veritabanında belgeyi kendisi oluşturmaz.'],
'Пересчитать по новым ценам':['Recalculate with new prices','Yeni fiyatlarla yeniden hesapla'],
'Сохранить как копию':['Save as copy','Kopya olarak kaydet'],
'Сохранённые расчёты':['Saved calculations','Kaydedilmiş hesaplar'],
'Выберите модель и цвет ручки из базы артикулов.':['Select the handle model and color from the article database.','Ürün kodu veritabanından kol modelini ve rengini seçin.'],
'Выберите файл(ы) изображения.':['Select image file(s).','Görsel dosyalarını seçin.'],
'Для выбранного дорнмасса нет подходящего привода в базе номенклатуры.':['No matching drive is available in the product database for the selected backset.','Seçilen backset için ürün veritabanında uygun tahrik bulunmuyor.'],
'Оформление сохранено как основное.':['Appearance saved as the default.','Görünüm varsayılan olarak kaydedildi.'],
'Петлевая группа скопирована как начальная заготовка. Угловые передачи, низ и ответные планки заполните под выбранную обвязку.':['The hinge group was copied as an initial template. Configure corner transmissions, the bottom section, and striker plates for the selected hardware set.','Menteşe grubu başlangıç şablonu olarak kopyalandı. Köşe aktarmalarını, alt bölümü ve karşılık plakalarını seçilen donanım setine göre doldurun.'],
'Привода поворотно-откидные для штульпового привода':['Tilt-and-turn drives for the stulp drive','Çift kanat tahriki için vasistaslı tahrikler'],
'Ручка оконная АЛТАЙ':['ALTAI window handle','ALTAI pencere kolu'],
'Ручка оконная МАКБЕТ':['MACBET window handle','MACBET pencere kolu'],
'Ручка оконная ЭЛЬБРУС':['ELBRUS window handle','ELBRUS pencere kolu'],
'У этого бренда пока нет комплектаций. Загрузите или создайте состав бренда в настройках.':['This brand has no configurations yet. Import or create the brand composition in Settings.','Bu marka için henüz konfigürasyon yok. Ayarlar bölümünde marka içeriğini içe aktarın veya oluşturun.'],
'Это файл прежнего конструктора. Откройте его в табличной программе и сохраните через «Сохранить в файл», затем загрузите полученный JSON сюда.':['This is a file from the legacy builder. Open it in a spreadsheet application, save it using “Save to file”, then upload the resulting JSON here.','Bu, eski oluşturucuya ait bir dosyadır. Bir tablo uygulamasında açın, “Dosyaya kaydet” ile kaydedin ve oluşan JSON dosyasını buraya yükleyin.'],
'добавить позицию':['add position','pozisyon ekle'],
'это не файл расчёта FUTURUSS':['this is not a FUTURUSS calculation file','bu bir FUTURUSS hesap dosyası değil'],
'не найден в базе':['not found in the database','veritabanında bulunamadı'],
'фото недоступно':['photo unavailable','fotoğraf kullanılamıyor']
});

// Complete runtime vocabulary fallback for dynamic legacy messages.
// Long phrases are translated from `dict` first; remaining standalone Russian words
// are translated by exact word boundaries here so language switching never leaves UI fragments in Russian.
const wordLexicon={
'в':['in','içinde'],'и':['and','ve'],'с':['with','ile'],'со':['with','ile'],'для':['for','için'],'по':['by','göre'],'из':['from','-den'],'до':['to','-e kadar'],'от':['from','-den'],'на':['on','üzerinde'],'к':['to','-e'],'у':['at','-de'],'при':['when','iken'],'через':['via','üzerinden'],'под':['for','için'],'без':['without','olmadan'],'между':['between','arasında'],'справа':['on the right','sağda'],
'не':['not','değil'],'нет':['no','yok'],'ни':['neither','hiç'],'или':['or','veya'],'если':['if','eğer'],'всё':['everything','her şey'],'всегда':['always','her zaman'],'уже':['already','zaten'],'пока':['yet','henüz'],'теперь':['now','şimdi'],'иначе':['otherwise','aksi halde'],'сразу':['at once','hemen'],'только':['only','yalnızca'],'также':['also','ayrıca'],'сначала':['first','önce'],'затем':['then','sonra'],'ниже':['below','aşağıda'],'выше':['above','yukarıda'],'вместе':['together','birlikte'],'целиком':['entirely','tamamen'],'вручную':['manually','manuel'],'снова':['again','yeniden'],'сюда':['here','buraya'],'назад':['back','geri'],
'фото':['photo','fotoğraf'],'фотографии':['photos','fotoğraflar'],'артикул':['article','ürün kodu'],'артикулов':['articles','ürün kodları'],'артикула':['article','ürün kodu'],'позиция':['position','pozisyon'],'позиции':['position','pozisyon'],'позиций':['positions','pozisyonlar'],'строк':['rows','satır'],'строка':['row','satır'],'строки':['rows','satırlar'],'товары':['products','ürünler'],'товаров':['products','ürünlerin'],'товар':['product','ürün'],'база':['database','veritabanı'],'базе':['database','veritabanında'],'базу':['database','veritabanını'],'базой':['database','veritabanıyla'],'каталог':['catalog','katalog'],'каталога':['catalog','kataloğun'],'прайс':['price list','fiyat listesi'],'ценами':['prices','fiyatlarla'],'цена':['price','fiyat'],'цены':['prices','fiyatlar'],'ценой':['price','fiyatla'],'сумма':['amount','tutar'],'суммам':['amounts','tutarlara'],'количество':['quantity','adet'],'количеством':['quantity','adet'],
'файл':['file','dosya'],'файла':['file','dosyanın'],'файле':['file','dosyada'],'файлов':['files','dosyalar'],'изображения':['images','görseller'],'изображение':['image','görsel'],'иконка':['icon','simge'],'лист':['sheet','sayfa'],'листе':['sheet','sayfada'],'таблицу':['table','tabloyu'],'таблиц':['tables','tablolar'],'табличной':['spreadsheet','tablo'],'программе':['application','uygulamada'],'данные':['data','veriler'],'данным':['data','verilere'],'документ':['document','belge'],'договор':['contract','sözleşme'],'покупателя':['customer','müşteri'],'организацию':['organization','kuruluş'],'налог':['tax','vergi'],'ндс':['VAT','KDV'],
'бренд':['brand','marka'],'бренда':['brand','markanın'],'бренды':['brands','markalar'],'схема':['scheme','şema'],'схему':['scheme','şemayı'],'схемы':['schemes','şemalar'],'комплектация':['configuration','konfigürasyon'],'комплектации':['configuration','konfigürasyon'],'комплектаций':['configurations','konfigürasyonlar'],'конструктор':['builder','oluşturucu'],'конструктора':['builder','oluşturucunun'],'конструкторе':['builder','oluşturucuda'],'правило':['rule','kural'],'правила':['rules','kurallar'],'правил':['rules','kurallar'],'условие':['condition','koşul'],'условия':['conditions','koşullar'],'условиями':['conditions','koşullarla'],'диапазон':['range','aralık'],'диапазона':['range','aralığın'],'диапазонов':['ranges','aralıklar'],'диапазоны':['ranges','aralıklar'],'диапазонами':['ranges','aralıklarla'],'границы':['boundaries','sınırlar'],'размер':['size','ölçü'],'размеров':['sizes','ölçüler'],'размеру':['size','ölçüye'],'размерных':['dimension','ölçü'],'ширина':['width','genişlik'],'ширине':['width','genişliğe'],'высота':['height','yükseklik'],'высоте':['height','yüksekliğe'],'масса':['weight','ağırlık'],'кг':['kg','kg'],'мм':['mm','mm'],
'паз':['groove','kanal'],'паза':['groove','kanalın'],'пазов':['grooves','kanallar'],'дорнмассом':['backset','backset'],'дорнмасса':['backset','backset'],'ручка':['handle','kol'],'ручки':['handle','kol'],'ручкой':['handle','kolla'],'накладка':['cover','kapak'],'накладки':['cover','kapak'],'накладок':['covers','kapaklar'],'цвет':['color','renk'],'цвета':['color','rengin'],'цветовой':['color','renkli'],'цапфа':['cam','kilitleme pimi'],'цапфы':['cam','kilitleme pimi'],'цапфами':['cams','kilitleme pimleri'],'цапфой':['cam','kilitleme pimi'],'грибовидная':['mushroom cam','mantar pim'],'грибовидной':['mushroom cam','mantar pim'],'грибовидными':['mushroom cams','mantar pimlerle'],'привод':['drive','tahrik'],'привода':['drive','tahrik'],'приводов':['drives','tahrikler'],'ножницы':['scissors','makas'],'ножниц':['scissors','makas'],'петли':['hinges','menteşeler'],'петлевая':['hinge','menteşe'],'группа':['group','grup'],'угловая':['corner','köşe'],'передача':['transmission','aktarma'],'передачи':['transmissions','aktarmalar'],'зацеп':['striker','karşılık'],'зацепы':['strikers','karşılıklar'],'удлинител':['extension','uzatma'],'удлинители':['extensions','uzatmalar'],'створка':['sash','kanat'],'створки':['sash','kanadın'],'створок':['sashes','kanatlar'],'рам':['frames','çerçeveler'],
'поворотная':['turn','açılır'],'поворотные':['turn','açılır'],'поворотно':['tilt-turn','vasistaslı'],'откидная':['tilt','vasistas'],'откидной':['tilt','vasistas'],'откидные':['tilt-turn','vasistaslı'],'смещённая':['offset','kaydırılmış'],'смещённой':['offset','kaydırılmış'],'роликовая':['roller','rulolu'],'взломостойкая':['security','güvenlikli'],'противозломная':['security','güvenlikli'],'противовзломные':['security','güvenlikli'],'широкая':['wide','geniş'],'простая':['simple','basit'],'стандарт':['standard','standart'],'центр':['center','merkez'],'фёрст':['first','first'],'тилт':['tilt','tilt'],'штульповой':['stulp','çift kanat'],'профиль':['profile','profil'],'профилю':['profile','profile'],'профильные':['profile','profil'],'пвх':['PVC','PVC'],'алу':['ALU','ALU'],
'выберите':['select','seçin'],'выбранного':['selected','seçilen'],'выбранная':['selected','seçilen'],'выбранную':['selected','seçilen'],'выбранной':['selected','seçilen'],'выбранный':['selected','seçilen'],'укажите':['specify','belirtin'],'введите':['enter','girin'],'добавьте':['add','ekleyin'],'добавить':['add','ekle'],'добавлено':['added','eklendi'],'добавлена':['added','eklendi'],'добавляются':['are added','eklenir'],'удалить':['delete','sil'],'удалите':['delete','silin'],'удалён':['deleted','silindi'],'удалено':['deleted','silindi'],'обновлён':['updated','güncellendi'],'обновлены':['updated','güncellendi'],'создан':['created','oluşturuldu'],'создана':['created','oluşturuldu'],'создано':['created','oluşturuldu'],'переименован':['renamed','yeniden adlandırıldı'],'сохранить':['save','kaydet'],'сохраните':['save','kaydedin'],'сохранено':['saved','kaydedildi'],'открыть':['open','aç'],'откройте':['open','açın'],'открыт':['opened','açıldı'],'загрузите':['upload','yükleyin'],'загрузить':['upload','yükle'],'загружено':['uploaded','yüklendi'],'выгрузите':['export','dışa aktarın'],'пересчитать':['recalculate','yeniden hesapla'],'проверить':['check','kontrol et'],'проверьте':['check','kontrol edin'],'редактируются':['are edited','düzenlenir'],'настройте':['configure','yapılandırın'],'задайте':['set','belirleyin'],'заполните':['fill','doldurun'],'сопоставляйте':['match','eşleştirin'],'обработать':['process','işlemek'],'показан':['shown','gösterildi'],
'неверный':['invalid','geçersiz'],'неверная':['invalid','geçersiz'],'неверное':['invalid','geçersiz'],'неверные':['invalid','geçersiz'],'неизвестный':['unknown','bilinmeyen'],'некорректная':['invalid','geçersiz'],'корректные':['valid','geçerli'],'неоднозначность':['ambiguity','belirsizlik'],'ошибка':['error','hata'],'внимание':['warning','dikkat'],'предупреждения':['warnings','uyarılar'],'недоступны':['unavailable','kullanılamıyor'],'недоступно':['unavailable','kullanılamıyor'],'отсутствует':['missing','eksik'],'отсутствуют':['missing','eksik'],'найден':['found','bulundu'],'найдено':['found','bulundu'],'найдены':['found','bulundu'],'подходящего':['matching','uygun'],'подходят':['match','uyuyor'],'несколько':['several','birkaç'],'перекрывается':['overlaps','çakışıyor'],'пересекается':['overlaps','çakışıyor'],'совпадает':['matches','eşleşiyor'],'изменены':['changed','değiştirildi'],'изменения':['changes','değişiklikler'],'доступны':['available','kullanılabilir'],'доступен':['available','kullanılabilir'],'действие':['action','işlem'],'необратимо':['irreversible','geri alınamaz'],'резервная':['fallback','yedek'],'совместимой':['compatible','uyumlu'],'совместимости':['compatibility','uyumluluk'],'подтверждение':['confirmation','onay'],'неизменены':['unchanged','değişmedi'],
'название':['name','ad'],'модель':['model','model'],'положение':['position','konum'],'сторона':['side','yön'],'стороны':['side','yön'],'открывания':['opening','açılma'],'открывание':['opening','açılma'],'правое':['right','sağ'],'левое':['left','sol'],'правых':['right','sağ'],'левых':['left','sol'],'правая':['right','sağ'],'левая':['left','sol'],'вариант':['option','seçenek'],'варианты':['options','seçenekler'],'параметр':['parameter','parametre'],'значение':['value','değer'],'значения':['value','değer'],'список':['list','liste'],'списка':['list','listenin'],'состав':['composition','içerik'],'составе':['composition','içerikte'],'элементы':['items','öğeler'],'детали':['part','parça'],'деталей':['parts','parçalar'],'деталь':['part','parça'],'ячейке':['cell','hücrede'],'ячеек':['cells','hücreler'],'блоков':['blocks','bloklar'],'блок':['block','blok'],'опции':['options','seçenekler'],'дополнительные':['additional','ek'],'базовый':['base','temel'],'базового':['base','temel'],'комплект':['kit','set'],'комплекта':['kit','setin'],'общий':['general','genel'],'основное':['default','ana'],'основной':['default','ana'],'исходные':['source','kaynak'],'актуальный':['current','güncel'],'новый':['new','yeni'],'новые':['new','yeni'],'прежнего':['legacy','eski'],'начальная':['initial','başlangıç'],'заготовка':['template','taslak'],'условная':['schematic','şematik'],'пуст':['empty','boş'],'пустая':['empty','boş'],'пусто':['empty','boş'],'фиксированный':['fixed','sabit'],'автоподбор':['auto-selection','otomatik seçim'],'программой':['by software','yazılım tarafından'],'расчёт':['calculation','hesap'],'расчёте':['calculation','hesapta'],'расчёт':['calculation','hesap'],'расчёта':['calculation','hesabın'],'сохранённые':['saved','kaydedilmiş'],'копию':['copy','kopya'],'дубликат':['duplicate','kopya'],'лимит':['limit','sınır'],'максимум':['maximum','maksimum'],'лишние':['extra','fazla'],'вне':['outside','dışında'],'каталожного':['catalog','katalog'],'первую':['first','ilk'],'вашей':['your','sizin'],'этот':['this','bu'],'этого':['this','bu'],'этой':['this','bu'],'этих':['these','bu'],'вашего':['your','sizin'],'примера':['example','örnek'],'остальные':['other','diğer'],'полученный':['generated','oluşturulan'],'печатные':['printed','basılı'],'страницы':['pages','sayfalar'],'раздел':['section','bölüm'],'режим':['mode','mod'],'созданный':['created','oluşturulan'],'сам':['itself','kendisi'],'создаёт':['creates','oluşturur'],'нужно':['need','gerekir'],'доступ':['access','erişim'],'авторизац':['authorization','yetkilendirme'],'ветки':['branch','dal'],'русский':['Russian','Rusça'],'белая':['white','beyaz'],'коричневая':['brown','kahverengi'],'чёрная':['black','siyah'],'антрацит':['anthracite','antrasit'],'прочее':['Other','Diğer'],'сводная':['Summary','Özet'],'ручки':['handles','kollar'],'оконная':['window','pencere'],'пластиковая':['plastic','plastik'],'штифтом':['spindle','milli'],'усиленные':['reinforced','güçlendirilmiş'],'больше':['greater','daha büyük'],'осталось':['remaining','kaldı'],'вид':['view','görünüm'],'фурнитурный':['hardware','donanım'],'табличной':['spreadsheet','tablo'],'полученный':['generated','oluşturulan'],'одну':['one','bir'],'створку':['sash','kanat'],'справа':['right','sağda'],'прав':['right','sağ'],'петл':['hinge','menteşe'],'створк':['sash','kanat'],'удлинител':['extension','uzatma'],'противовзл':['security','güvenlik'],'п':['tilt-turn','vasistaslı'],'отк':['tilt-turn','vasistaslı'],'ацеп':['striker','karşılık'],'шсф':['sash width','kanat genişliği'],'всф':['sash height','kanat yüksekliği'],'поз':['items','kalem'],'импорт':['import','içe aktarma'],'движок':['engine','motor'],'подобрано':['matched','eşleştirildi'],'варианта':['option','seçenek'],'задана':['set','belirlendi'],'задано':['set','belirlendi'],'заданы':['set','belirlendi'],'использована':['used','kullanıldı'],'соответствует':['matches','uyuyor'],'серия':['series','seri'],'парной':['matching','eşleşen'],'его':['it','onu'],'которые':['which','olan'],'нужны':['needed','gerekli'],'оставьте':['leave','bırakın'],'пустым':['empty','boş'],'язык':['language','dil'],'поиск':['search','arama'],'проверки':['checking','kontrol'],'загружайте':['upload','yükleyin'],'передаёт':['passes','aktarır'],'добавляйте':['add','ekleyin'],'артикулу':['article','ürün koduna'],'загрузку':['load','yüklemeyi'],'добавлен':['added','eklendi'],'таблиц':['tables','tablolar'],'условие':['condition','koşul'],'будет':['will be','olacak'],'неоднозначности':['ambiguity','belirsizlik'],'все':['all','tüm'],'файл(ы)':['file(s)','dosya(lar)'],'продублирован':['duplicated','çoğaltıldı'],'нажмите':['click','tıklayın'],'оригиналом':['original','orijinal'],'указанных':['specified','belirtilen'],'размеры':['dimensions','ölçüler'],'схемой':['scheme','şemayla'],'таблицу':['table','tabloyu'],'импортировано':['imported','içe aktarıldı'],'дополнительных':['additional','ek'],'сверена':['verified','doğrulandı'],'каталогом':['catalog','katalogla'],'приводы':['drives','tahrikler'],'не удалось':['failed to','başarısız oldu'],'удалось':['succeeded','başarılı oldu'],'взят':['taken','alındı'],'меняются':['change','değişir'],'оформление':['appearance','görünüm'],'сброшено':['reset','sıfırlandı'],'скопирована':['copied','kopyalandı'],'угловые':['corner','köşe'],'низ':['bottom','alt'],'ответные':['striker','karşılık'],'планки':['plates','plakalar'],'обвязку':['hardware set','donanım setini'],'расширенная':['extended','genişletilmiş'],'пользовательская':['custom','özel'],'вариантов':['options','seçenekler'],'настройках':['settings','ayarlarda'],'комплектациями':['configurations','konfigürasyonlarla'],'всеми':['all','tüm'],'условиями':['conditions','koşullarla'],'фото':['photo','fotoğraf'],'обновлены':['updated','güncellendi'],'показан':['shown','gösterildi'],'по умолчанию':['by default','varsayılan olarak'],'умолчанию':['default','varsayılan'],'расчёты':['calculations','hesaplar'],'пов':['turn','açılır'],'фёст':['first','first'],'дорнмасса':['backset','backset'],'дорнмассом':['backset','backset'],'доступен':['available','kullanılabilir'],'доступны':['available','kullanılabilir'],'недоступно':['unavailable','kullanılamıyor'],'недоступны':['unavailable','kullanılamıyor'],'строка':['row','satır'],'строки':['rows','satırlar'],'петлевая':['hinge','menteşe'],'поворотный':['turn','açılır'],'пропуск':['gap','boşluk'],'не найден':['not found','bulunamadı'],'не найдено':['not found','bulunamadı'],'не найден в базе':['not found in database','veritabanında bulunamadı'],'недоступно':['unavailable','kullanılamıyor'],'виду':['type','tipe'],'создайте':['create','oluşturun'],'используйте':['use','kullanın'],'номенклатуры':['product database','ürün veritabanı'],'её':['it','onu'],'счёт':['invoice','fatura'],'он':['it','o'],'новым':['new','yeni'],'ценам':['prices','fiyatlara'],'как':['as','olarak'],'базы':['database','veritabanından'],'ы':['s','lar'],'записей':['entries','kayıt'],'записи':['entry','kayıt'],'штульпового':['stulp','çift kanat'],'позицию':['position','pozisyon'],'диапазоном':['range','aralıkla'],'это':['this','bu'],'создайте':['create','oluşturun'],'сохранённые':['saved','kaydedilmiş'],'оригиналом':['original','orijinal']
};
Object.assign(wordLexicon,{
'замените':['replace','değiştirin'],'пример':['example','örnek'],'акцию':['promotion','kampanyayı'],'перед':['before','önce'],'реальную':['actual','gerçek'],'чтобы':['to','için'],'акций':['promotions','kampanyalar'],'акция':['promotion','kampanya'],'заказа':['order','sipariş'],'зеркально':['mirror','ayna'],'копия':['copy','kopya'],'новой':['new','yeni'],'прочитать':['read','okumak'],'реальные':['actual','gerçek'],'сохранённый':['saved','kaydedilmiş'],'автоматически':['automatically','otomatik olarak'],'акции':['promotion','kampanya'],'анимации':['animation','animasyon'],'артикулам':['articles','ürün kodlarına'],'баннер':['banner','banner'],'берутся':['are taken','alınır'],'бесплатная':['free','ücretsiz'],'браузера':['browser','tarayıcı'],'бухгалтерия':['accounting','muhasebe'],'было':['was','idi'],'велики':['large','büyük'],'видео':['video','video'],'виджеты':['widgets','bileşenler'],'видим':['visible','görünür'],'видимость':['visibility','görünürlük'],'видно':['visible','görünür'],'возвращает':['returns','döndürür'],'восстановления':['restoration','geri yükleme'],'всего':['total','toplam'],'всех':['all','tüm'],'второе':['second','ikinci'],'вы':['you','siz'],'выгрузкой':['export','dışa aktarma'],'да':['yes','evet'],'дальше':['next','sonra'],'двух':['two','iki'],'действительную':['actual','gerçek'],'доставка':['delivery','teslimat'],'достигнут':['reached','ulaşıldı'],'дубли':['duplicates','kopyalar'],'дублировать':['duplicate','çoğalt'],'ещё':['more','daha'],'же':['same','aynı'],'закрытия':['closing','kapatma'],'заполняем':['fill','dolduruyoruz'],'используется':['used','kullanılır'],'итого':['total','toplam'],'казахстана':['Kazakhstan','Kazakistan'],'какой':['which','hangi'],'ключ':['key','anahtar'],'компании':['company','şirket'],'консультации':['consultation','danışmanlık'],'корректно':['correctly','doğru'],'кроссфейд':['crossfade','çapraz geçiş'],'кругу':['loop','döngü'],'л':['L','L'],'лету':['on the fly','anlık'],'линии':['line','çizgi'],'локальное':['local','yerel'],'массив':['array','dizi'],'менеджером':['manager','yönetici'],'места':['space','alan'],'место':['space','alan'],'монтажа':['installation','montaj'],'монтажом':['installation','montaj'],'названием':['name','ad'],'накладная':['invoice','fatura'],'наоборот':['vice versa','tersine'],'настоящие':['actual','gerçek'],'настройки':['settings','ayarlar'],'незачем':['unnecessary','gereksiz'],'новая':['new','yeni'],'новинка':['new item','yeni ürün'],'нуля':['zero','sıfır'],'оба':['both','ikisi'],'общая':['general','genel'],'общеотраслевым':['industry-wide','sektörel'],'объём':['volume','hacim'],'одиночным':['single','tek'],'одна':['one','bir'],'одно':['one','bir'],'оплату':['payment','ödeme'],'ориентирам':['references','referanslara'],'отработал':['completed','tamamlandı'],'отступы':['spacing','boşluklar'],'первый':['first','ilk'],'переводя':['translating','çevirerek'],'переключаем':['switch','değiştiriyoruz'],'перерасчёт':['recalculation','yeniden hesaplama'],'переход':['transition','geçiş'],'перехода':['transition','geçiş'],'периметральный':['perimeter','çevresel'],'петель':['hinges','menteşeler'],'петля':['hinge','menteşe'],'плавающих':['floating','değişken'],'плавного':['smooth','yumuşak'],'плавный':['smooth','yumuşak'],'показана':['shown','gösterilir'],'показываем':['show','gösteriyoruz'],'показывают':['show','gösterir'],'покупателю':['customer','müşteriye'],'полем':['field','alan'],'после':['after','sonra'],'предложения':['offers','teklifler'],'примеры':['examples','örnekler'],'пунктирные':['dashed','kesikli'],'раздувать':['inflate','şişirmek'],'размерные':['dimension','ölçü'],'расстановка':['layout','yerleşim'],'реальный':['actual','gerçek'],'редактор':['editor','düzenleyici'],'редакция':['version','sürüm'],'резкой':['cutting','kesim'],'рендер':['render','render'],'ротация':['rotation','döngü'],'свод':['summary','özet'],'свяжитесь':['contact','iletişime geçin'],'сейчас':['now','şimdi'],'сжимает':['compresses','sıkıştırır'],'скидка':['discount','indirim'],'скрытый':['hidden','gizli'],'слева':['left','solda'],'слишком':['too','fazla'],'слоёв':['layers','katmanlar'],'слой':['layer','katman'],'слоя':['layer','katman'],'смены':['change','değişim'],'содержимым':['content','içerik'],'создавать':['create','oluşturmak'],'создаём':['create','oluşturuyoruz'],'сопоставление':['matching','eşleştirme'],'сохранением':['saving','kaydetme'],'сохраняется':['is saved','kaydedilir'],'старые':['old','eski'],'ств':['sashes','kanatlar'],'стилей':['styles','stiller'],'суммы':['amounts','tutarlar'],'существует':['exists','mevcut'],'существующей':['existing','mevcut'],'схем':['schemes','şemalar'],'таким':['this way','bu şekilde'],'там':['there','orada'],'текст':['text','metin'],'то':['that','bu'],'требует':['requires','gerektirir'],'уменьшает':['reduces','azaltır'],'условные':['schematic','şematik'],'формат':['format','format'],'форсируем':['force','zorlarız'],'хранилище':['storage','depolama'],'цену':['price','fiyatı'],'шапки':['header','üst bölüm'],'загрузки':['loading','yükleme'],'новых':['new','yeni'],'сохранён':['saved','kaydedildi'],'создать':['create','oluştur'],'использовать':['use','kullan'],'номенклатура':['product catalog','ürün kataloğu'],'счёта':['invoice','fatura'],'копии':['copy','kopya'],'оригинал':['original','orijinal'],'диапазоном':['range','aralıkla'],'запись':['entry','kayıt'],'записей':['entries','kayıtlar']
});

Object.assign(wordLexicon,{'общие':['shared','ortak'],'общем':['shared','ortak'],'пользователь':['user','kullanıcı'],'загружать':['upload','yüklemek'],'загружено':['uploaded','yüklendi'],'удалять':['remove','silmek'],'сохранены':['saved','kaydedildi'],'сохранено':['saved','kaydedildi'],'сервера':['server','sunucudan'],'сервере':['server','sunucuda'],'повторов':['duplicates','tekrarlar'],'пропущено':['skipped','atlandı'],'отправлено':['sent','gönderildi'],'остальные':['remaining','diğer'],'может':['can','yapabilir'],'удалось':['managed to','başarıldı'],'проверить':['verify','doğrulamak'],'содержимое':['content','içerik'],'превышает':['exceeds','aşıyor'],'допустимый':['allowed','izin verilen'],'предел':['limit','sınır'],'некорректные':['invalid','geçersiz'],'неизвестное':['unknown','bilinmeyen'],'указано':['specified','belirtildi'],'удаления':['deletion','silme'],'артикула':['article','ürün kodu'],'файла':['file','dosya'],'длиной':['length','uzunlukta'],'символов':['characters','karakter'],'лимит':['limit','sınır'],'повтор':['duplicate','tekrar'],'устройства':['device','cihaz']});

// Server photo hash updates, standalone HTML configurator and Vue advertising panel — 2026.09.28.4.
Object.assign(dict,{
'Фото не найдено.':['Photo not found.','Fotoğraf bulunamadı.'],
'Не удалось создать серверную папку фото.':['Could not create the server photo folder.','Sunucu fotoğraf klasörü oluşturulamadı.'],
'Не удалось записать фото на сервер.':['Could not write the photo to the server.','Fotoğraf sunucuya yazılamadı.'],
'Общие фото каталога может загружать только пользователь Central.':['Only Central users can upload shared catalog photos.','Yalnızca Central kullanıcıları ortak katalog fotoğraflarını yükleyebilir.'],
'Общие фото каталога может удалять только пользователь Central.':['Only Central users can remove shared catalog photos.','Yalnızca Central kullanıcıları ortak katalog fotoğraflarını silebilir.'],
'Загружать фото в общий каталог может только Central':['Only Central can upload photos to the shared catalog','Ortak kataloğa yalnızca Central fotoğraf yükleyebilir'],
'Фото для ${art} сохранены на сервере (${saved}/${MAX_PHOTOS_PER_ART})':['Photos for ${art} saved on the server (${saved}/${MAX_PHOTOS_PER_ART})','${art} için fotoğraflar sunucuya kaydedildi (${saved}/${MAX_PHOTOS_PER_ART})'],
'За один раз можно обработать не больше ${toLoad.length} из ${list.length} файлов.':['At most ${toLoad.length} of ${list.length} files can be processed at once.','Bir seferde ${list.length} dosyadan en fazla ${toLoad.length} tanesi işlenebilir.'],
'Фото для ${art} сохранены на сервере (${saved}/${MAX_PHOTOS_PER_ART}): добавлено ${uploaded}, обновлено ${updated}${duplicates ? "; без изменений " + duplicates : ""}.':['Photos for ${art} saved on the server (${saved}/${MAX_PHOTOS_PER_ART}): ${uploaded} added, ${updated} updated${duplicates ? "; unchanged " + duplicates : ""}.','${art} fotoğrafları sunucuya kaydedildi (${saved}/${MAX_PHOTOS_PER_ART}): ${uploaded} eklendi, ${updated} güncellendi${duplicates ? "; değişmedi " + duplicates : ""}.'],
'На сервере добавлено фото: ${uploaded}, обновлено: ${updated}. Остальные не сохранены: ${err.message}':['Added ${uploaded} photos and updated ${updated} on the server. The remaining files were not saved: ${err.message}','Sunucuda ${uploaded} fotoğraf eklendi ve ${updated} fotoğraf güncellendi. Kalan dosyalar kaydedilmedi: ${err.message}'],
"Фото для ${art} удалено с ${centralCatalog?'сервера':'устройства'} (осталось ${current.length}/${MAX_PHOTOS_PER_ART}).":["Photo for ${art} removed from ${centralCatalog?'server':'device'} (${current.length}/${MAX_PHOTOS_PER_ART} left).","${art} fotoğrafı ${centralCatalog?'sunucudan':'cihazdan'} silindi (${current.length}/${MAX_PHOTOS_PER_ART} kaldı)."],
'На сервер отправлено фото: ${uploaded}. Остальные не сохранены: ${err.message}':['Photos uploaded to the server: ${uploaded}. The remaining photos were not saved: ${err.message}','Sunucuya yüklenen fotoğraflar: ${uploaded}. Kalan fotoğraflar kaydedilmedi: ${err.message}'],
'Не удалось загрузить фото на сервер: ':['Could not upload photos to the server: ','Fotoğraflar sunucuya yüklenemedi: '],
'Не удалось удалить фото: ':['Could not remove the photo: ','Fotoğraf kaldırılamadı: '],
'Артикул не найден в общем каталоге.':['Article was not found in the shared catalog.','Ürün kodu ortak katalogda bulunamadı.'],
'В общем каталоге нет базы артикулов.':['The shared catalog has no article list.','Ortak katalogda ürün kodu listesi yok.'],
'Для одного артикула можно сохранить не больше пяти фото.':['You can save up to five photos per article.','Her ürün kodu için en fazla beş fotoğraf kaydedebilirsiniz.'],
'Не указано фото для удаления.':['No photo was specified for removal.','Silinecek fotoğraf belirtilmedi.'],
'Фото уже отсутствует в общем каталоге.':['The photo is already missing from the shared catalog.','Fotoğraf ortak katalogda zaten bulunmuyor.'],
'Неизвестное действие с фото товара.':['Unknown product photo action.','Bilinmeyen ürün fotoğrafı işlemi.'],
'Некорректные данные фото.':['Invalid photo data.','Geçersiz fotoğraf verisi.'],
'Укажите имя файла фото длиной до 240 символов.':['Enter a photo filename up to 240 characters long.','240 karaktere kadar bir fotoğraf dosya adı girin.'],
'Фото должно быть JPEG, PNG или WebP.':['The photo must be JPEG, PNG, or WebP.','Fotoğraf JPEG, PNG veya WebP olmalıdır.'],
'Фото пустое или превышает лимит 6 МБ после обработки.':['The photo is empty or exceeds the 6 MB limit after processing.','Fotoğraf boş veya işlem sonrası 6 MB sınırını aşıyor.'],
'Сервер не смог проверить содержимое фото.':['The server could not verify the photo contents.','Sunucu fotoğraf içeriğini doğrulayamadı.'],
'Размер изображения превышает допустимый предел.':['The image exceeds the allowed dimensions.','Görsel izin verilen boyutları aşıyor.'],
'Настройка калькулятора':['Calculator settings','Hesaplayıcı ayarları'],
'Вернуться в управление':['Back to Management','Yönetime dön'],
'HTML-конфигуратор загружает каталог и сохраняет изменения через API.':['The HTML configurator loads the catalog and saves changes through the API.','HTML yapılandırıcı kataloğu yükler ve değişiklikleri API üzerinden kaydeder.'],
'Настройка':['Settings','Ayarlar'],
'Настроить каталог калькулятора':['Configure calculator catalog','Hesaplayıcı kataloğunu ayarla'],
'Откройте настройку калькулятора в меню управления, чтобы заполнить комплектации и базу артикулов.':['Open Calculator settings from Management to add configurations and articles.','Konfigürasyonları ve ürün kodlarını eklemek için Yönetim menüsünden Hesaplayıcı ayarlarını açın.'],
'<strong>Данные ещё не загружены</strong>Откройте настройку калькулятора в меню управления, чтобы заполнить комплектации и базу артикулов.':['<strong>Data has not been uploaded yet</strong>Open Calculator settings from Management to add configurations and articles.','<strong>Veriler henüz yüklenmedi</strong>Konfigürasyonları ve ürün kodlarını eklemek için Yönetim menüsünden Hesaplayıcı ayarlarını açın.'],
'Каталог калькулятора':['Calculator catalog','Hesaplayıcı kataloğu'],
'КАТАЛОГ КАЛЬКУЛЯТОРА':['CALCULATOR CATALOG','HESAPLAYICI KATALOĞU'],
'Комплектации и артикулы':['Configurations and articles','Konfigürasyonlar ve ürün kodları'],
'Редактируйте таблицы подбора и базу деталей. Изменения сохраняются на сервер и сразу используются калькулятором.':['Edit sizing tables and the parts catalog. Changes are saved on the server and used by the calculator right away.','Ölçü tablolarını ve parça kataloğunu düzenleyin. Değişiklikler sunucuya kaydedilir ve hesaplayıcıda hemen kullanılır.'],
'Комплектации и база артикулов сохраняются на сервере и сразу используются в расчётах.':['Configurations and articles are saved on the server and used in calculations right away.','Konfigürasyonlar ve ürün kodları sunucuya kaydedilir ve hesaplamalarda hemen kullanılır.'],
'Алюминий ALU':['Aluminum ALU','Alüminyum ALU'],
'Загружаем каталог…':['Loading catalog…','Katalog yükleniyor…'],'Загружаем…':['Loading…','Yükleniyor…'],
'Загружаем комплектации и базу артикулов…':['Loading configurations and article catalog…','Konfigürasyonlar ve ürün kodları kataloğu yükleniyor…'],
'Копировать':['Duplicate','Kopyala'],
'Сохраняем в системе…':['Saving to the system…','Sisteme kaydediliyor…'],'Есть несохранённые изменения':['Unsaved changes','Kaydedilmemiş değişiklikler'],
'Система ещё запускается. Обновите страницу.':['The system is still starting. Refresh the page.','Sistem hâlâ başlatılıyor. Sayfayı yenileyin.'],
'Повторить':['Retry','Tekrar dene'],
'Сервер не вернул каталог для настройки.':['The server did not return a catalog to configure.','Sunucu düzenlenecek bir katalog döndürmedi.'],
'Сохраняем исходный каталог…':['Saving the initial catalog…','Başlangıç kataloğu kaydediliyor…'],'Сохранено на сервере':['Saved on the server','Sunucuya kaydedildi'],
'Изменения ожидают сохранения…':['Changes waiting to be saved…','Değişiklikler kaydedilmeyi bekliyor…'],
'Не выбрана':['Not selected','Seçilmedi'],'Нажмите, чтобы настроить состав':['Select to edit the parts list','Parça listesini düzenlemek için seçin'],
'В каталоге пока нет шаблона комплектации.':['There is no configuration template in the catalog yet.','Katalogda henüz bir konfigürasyon şablonu yok.'],
'В каталоге должна остаться хотя бы одна комплектация.':['The catalog must contain at least one configuration.','Katalogda en az bir konfigürasyon bulunmalıdır.'],
'Количество каждой детали должно быть целым числом больше нуля.':['Each part quantity must be a positive whole number.','Her parça miktarı pozitif bir tam sayı olmalıdır.'],
'В составе есть артикул, которого нет в базе.':['The parts list contains an article missing from the catalog.','Parça listesinde katalogda bulunmayan bir ürün kodu var.'],
'Нужен минимум один диапазон.':['At least one range is required.','En az bir aralık gereklidir.'],
'Добавьте сначала все указанные артикулы приводов в базу.':['Add all listed drive articles to the catalog first.','Listelenen tüm tahrik ürün kodlarını önce kataloğa ekleyin.'],
'Пользовательские позиции':['Custom items','Özel ürünler'],
'Заполните артикул, наименование и корректную цену.':['Enter an article, name, and valid price.','Ürün kodu, ad ve geçerli bir fiyat girin.'],
'Такой артикул уже есть в базе.':['This article is already in the catalog.','Bu ürün kodu katalogda zaten var.'],
'Проверьте каталожный диапазон размеров.':['Check the catalog size range.','Katalog ölçü aralığını kontrol edin.'],
'Этот артикул используется в комплектациях. Сначала удалите его из составов.':['This article is used in configurations. Remove it from the parts lists first.','Bu ürün kodu konfigürasyonlarda kullanılıyor. Önce parça listelerinden kaldırın.'],
'Размер рекламного изображения не должен превышать 4 МБ.':['The advertising image must be 4 MB or smaller.','Reklam görseli 4 MB veya daha küçük olmalıdır.'],
'Рекламное изображение':['Advertising image','Reklam görseli'],'Настройка рекламы калькулятора.':['Calculator advertising settings.','Hesaplayıcı reklam ayarları.'],'Загружаем рекламу…':['Loading advertising image…','Reklam görseli yükleniyor…'],'Каталог недоступен.':['The catalog is unavailable.','Katalog kullanılamıyor.'],'Рекламное изображение не загружено':['No advertising image uploaded','Reklam görseli yüklenmedi'],'Фото появится в счёте, когда список деталей пуст.':['The photo appears on the invoice when the parts list is empty.','Parça listesi boş olduğunda fotoğraf faturada görünür.'],'Заменить рекламное изображение':['Replace advertising image','Reklam görselini değiştir'],'Открыть конструктор':['Open configurator','Yapılandırıcıyı aç'],'Рекламное фото сохранено.':['Advertising image saved.','Reklam görseli kaydedildi.'],'Рекламное фото удалено.':['Advertising image removed.','Reklam görseli kaldırıldı.'],'Не удалось прочитать изображение.':['Could not read the image.','Görsel okunamadı.'],'Файл не является корректным изображением.':['The file is not a valid image.','Dosya geçerli bir görsel değil.'],'Выберите изображение PNG, JPG или WEBP.':['Choose a PNG, JPG, or WEBP image.','PNG, JPG veya WEBP görseli seçin.'],'PNG, JPG или WEBP · до 4 МБ':['PNG, JPG or WEBP · up to 4 MB','PNG, JPG veya WEBP · 4 MB’a kadar'],'Добавить рекламное изображение':['Add advertising image','Reklam görseli ekle'],'Удалить рекламу':['Remove advertising image','Reklam görselini kaldır'],
'Изменено':['Edited','Düzenlendi'],'Свойства':['Properties','Özellikler'],'Свойства комплектации':['Configuration properties','Konfigürasyon özellikleri'],
'Эти детали добавляются к каждой ячейке таблицы':['These parts are added to every cell in the table.','Bu parçalar tablodaki her hücreye eklenir.'],
'Найти артикул или наименование':['Find an article or name','Ürün kodu veya ad ara'],'Выберите деталь':['Select a part','Parça seçin'],'Роль в составе':['Part role','Parça rolü'],
'Состав проверен':['Parts list checked','Parça listesi kontrol edildi'],'Сбросить к автоматически рассчитанному составу':['Reset to the automatically calculated parts list','Otomatik hesaplanan parça listesine sıfırla'],
'Эти параметры определяют доступный вариант в калькуляторе.':['These settings determine the option available in the calculator.','Bu ayarlar hesaplayıcıda kullanılabilen seçeneği belirler.'],
'Семейство':['Family','Aile'],'Профиль / паз':['Profile / groove','Profil / kanal'],'Сторона открывания':['Opening side','Açılma yönü'],
'Серия опций':['Option series','Seçenek serisi'],'Тип открывания':['Opening type','Açılma türü'],'Поворотно-откидное':['Tilt-and-turn','Çift açılım'],
'Примечание':['Notes','Notlar'],'Для каждого размера калькулятор подберёт подходящую ячейку.':['The calculator will choose the matching cell for each size.','Hesaplayıcı her ölçü için uygun hücreyi seçer.'],
'Ширина (ШСФ)':['Width (sash rebate width)','Genişlik (kanat genişliği)'],'Высота (ВСФ)':['Height (sash rebate height)','Yükseklik (kanat yüksekliği)'],
'Артикулы приводов через запятую':['Drive article codes, separated by commas','Virgülle ayrılmış tahrik ürün kodları'],'Сохранить диапазоны':['Save ranges','Aralıkları kaydet'],
'изменения сразу обновят расчёт':['changes update calculations immediately','değişiklikler hesaplamaları hemen günceller'],
'Показаны первые 250 совпадений. Уточните поиск для остальных.':['Showing the first 250 matches. Refine your search to see others.','İlk 250 eşleşme gösteriliyor. Diğerleri için aramanızı daraltın.'],
'Новый артикул':['New article','Yeni ürün kodu'],'Карточка артикула':['Article details','Ürün kodu ayrıntıları'],
'Редактирование серверной базы калькулятора':['Edit the calculator’s server catalog','Hesaplayıcının sunucu kataloğunu düzenleyin'],
'Цена за штуку, ₸':['Price per item, ₸','Birim fiyat, ₸'],'Подгруппы':['Subgroups','Alt gruplar'],
'Совместимость по типу цапфы':['Compatibility by cam type','Kam türüne göre uyumluluk'],
'Если ничего не выбрано, деталь доступна для всех вариантов.':['If none are selected, the part is available for all options.','Hiçbiri seçilmezse parça tüm seçeneklerde kullanılabilir.'],
'Ограничения по размерам (если есть)':['Size limits (if any)','Ölçü sınırları (varsa)'],
'Ширина от':['Width from','Genişlik başlangıcı'],'Ширина до':['Width to','Genişlik bitişi'],'Высота от':['Height from','Yükseklik başlangıcı'],'Высота до':['Height to','Yükseklik bitişi'],
': некорректная строка состава.':[': invalid parts-list entry.',': geçersiz parça listesi satırı.'],
': некорректный диапазон размеров.':[': invalid size range.',': geçersiz ölçü aralığı.'],
': некорректный состав ячейки.':[': invalid cell parts list.',': geçersiz hücre parça listesi.'],
'Некорректная комплектация: нужны уникальные id, variant, name, rows, columns, common и cells.':['Invalid configuration: unique ids, variant, name, rows, columns, common, and cells are required.','Geçersiz konfigürasyon: benzersiz id, variant, name, rows, columns, common ve cells gereklidir.'],
'Не удалось загрузить исходный каталог.':['Could not load the initial catalog.','Başlangıç kataloğu yüklenemedi.'],
'Нажмите на ячейку, чтобы настроить состав деталей':['Select a cell to edit its parts list','Parça listesini düzenlemek için bir hücre seçin'],
'В каталоге {{articleCount}} артикулов и {{kitCount}} комплектаций':['{{articleCount}} articles and {{kitCount}} configurations in the catalog','Katalogda {{articleCount}} ürün kodu ve {{kitCount}} konfigürasyon'],
'Цены, составы и таблицы доступны калькулятору после сохранения.':['Prices, parts lists, and tables are available to the calculator after saving.','Fiyatlar, parça listeleri ve tablolar kaydedildikten sonra hesaplayıcıda kullanılabilir.'],
'Диапазонов высоты':['Height ranges','Yükseklik aralıkları'],'диапазонов высоты':['height ranges','yükseklik aralıkları'],'диапазонов ширины':['width ranges','genişlik aralıkları'],
'Поворотное':['Turn opening','Tek açılım'],'Штульповое':['Stulp opening','Çift kanat açılımı'],'Источник':['Source','Kaynak'],
'Откройте настройку калькулятора и добавьте комплектацию.':['Open Calculator settings to add a configuration.','Bir konfigürasyon eklemek için Hesaplayıcı ayarlarını açın.'],
'. Откройте настройку калькулятора и добавьте комплектацию.':['. Open Calculator settings to add a configuration.','. Bir konfigürasyon eklemek için Hesaplayıcı ayarlarını açın.'],
'Редактируйте комплектации и цены в одном месте. После сохранения калькулятор получает их автоматически.':['Edit configurations and prices in one place. The calculator receives them automatically after saving.','Konfigürasyonları ve fiyatları tek bir yerden düzenleyin. Kaydettikten sonra hesaplayıcı bunları otomatik olarak alır.'],
});

const langs=['ru','en','tr'];
let lang=langs.includes(globalThis.FUTURUSS_LANGUAGE)?globalThis.FUTURUSS_LANGUAGE:'ru';
const localeState=globalThis.Vue?.reactive?globalThis.Vue.reactive({language:lang}):{language:lang};
let observer=null;
let applying=false;
const attrNames=['placeholder','title','aria-label','alt','content'];
const reverse={ru:new Map(),en:new Map(),tr:new Map()};
const textSource=new WeakMap();
const textRendered=new WeakMap();
const attrSource=new WeakMap();
const attrRendered=new WeakMap();
function rebuildReverse(){
  for(const m of Object.values(reverse))m.clear();
  for(const [ru,row] of Object.entries(dict)){
    reverse.ru.set(ru,ru);
    if(Array.isArray(row)){
      if(typeof row[0]==='string'&&row[0])reverse.en.set(row[0],ru);
      if(typeof row[1]==='string'&&row[1])reverse.tr.set(row[1],ru);
    }
  }
}
rebuildReverse();
function canonical(text){
  if(typeof text!=='string')return text;
  return reverse.ru.get(text)||reverse.en.get(text)||reverse.tr.get(text)||text;
}
function tr(text,target=lang){
  if(typeof text!=='string')return text;
  const key=canonical(text);
  if(target==='ru')return key;
  const row=dict[key];
  if(!Array.isArray(row)||row.length<2)return text;
  const value=target==='en'?row[0]:row[1];
  return typeof value==='string'&&value.length?value:text;
}
let cachedLoosePairs=null;
function loosePairs(){
  if(cachedLoosePairs)return cachedLoosePairs;
  cachedLoosePairs=Object.entries(dict).filter(([k,row])=>k.length>=4&&Array.isArray(row)).sort((a,b)=>b[0].length-a[0].length);
  return cachedLoosePairs;
}
function translateLoose(text,target=lang){
  if(typeof text!=='string')return text;
  const exact=tr(text,target);
  if(exact!==text||dict[canonical(text)])return exact;
  let out=text;
  for(const [ru,row] of loosePairs()){
    const rep=target==='ru'?ru:(target==='en'?row[0]:row[1]);
    if(typeof rep!=='string'||!rep||ru===rep)continue;
    if(!out.includes(ru))continue;
    if(/^[A-Za-zА-Яа-яЁё0-9]+$/.test(ru)){
      const escaped=ru.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
      const rx=new RegExp('(^|[^A-Za-zА-Яа-яЁё0-9])('+escaped+')(?=$|[^A-Za-zА-Яа-яЁё0-9])','g');
      out=out.replace(rx,(m,prefix)=>prefix+rep);
    }else{
      out=out.split(ru).join(rep);
    }
  }
  if(target!=='ru'&&/[А-Яа-яЁё]/.test(out)){
    out=out.replace(/[А-Яа-яЁё]+/g,word=>{
      const row=wordLexicon[word.toLowerCase()];
      if(!row)return word;
      const rep=target==='en'?row[0]:row[1];
      if(!rep)return word;
      return /^[А-ЯЁ]/.test(word)?rep.charAt(0).toUpperCase()+rep.slice(1):rep;
    });
  }
  return out;
}
function isIgnored(node){
  const el=node?.nodeType===Node.ELEMENT_NODE?node:node?.parentElement;
  if(!el)return false;
  return !!el.closest?.('[data-i18n-ignore],script,style,noscript,template');
}
function splitWhitespace(raw){
  const m=String(raw??'').match(/^(\s*)(.*?)(\s*)$/s);
  return m?{lead:m[1],body:m[2],tail:m[3]}:{lead:'',body:String(raw??''),tail:''};
}
function translateText(node){
  if(node?.nodeType!==Node.TEXT_NODE||isIgnored(node))return;
  const raw=node.nodeValue??'';
  const last=textRendered.get(node);
  if(!textSource.has(node)||raw!==last){
    const parts=splitWhitespace(raw);
    textSource.set(node,{lead:parts.lead,body:canonical(parts.body),tail:parts.tail});
  }
  const source=textSource.get(node);
  if(!source?.body)return;
  const target=source.lead+translateLoose(source.body,lang)+source.tail;
  textRendered.set(node,target);
  if(target!==raw)node.nodeValue=target;
}
function getAttrMap(store,el){
  let map=store.get(el);
  if(!map){map=Object.create(null);store.set(el,map);}
  return map;
}
function translateAttrs(el){
  if(!(el instanceof Element)||isIgnored(el))return;
  const sources=getAttrMap(attrSource,el);
  const rendered=getAttrMap(attrRendered,el);
  for(const a of attrNames){
    if(!el.hasAttribute(a))continue;
    const raw=el.getAttribute(a)??'';
    if(!(a in sources)||raw!==rendered[a])sources[a]=canonical(raw);
    const target=translateLoose(sources[a],lang);
    rendered[a]=target;
    if(target!==raw)el.setAttribute(a,target);
  }
}
function scan(root=document){
  if(applying||isIgnored(root))return;
  applying=true;
  try{
    if(root?.nodeType===Node.TEXT_NODE){translateText(root);return;}
    if(root instanceof Element)translateAttrs(root);
    if(!(root instanceof Element)&&root!==document)return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT,{acceptNode:n=>isIgnored(n)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});
    let n;
    while((n=walker.nextNode())){
      if(n.nodeType===Node.TEXT_NODE)translateText(n);else translateAttrs(n);
    }
  }finally{applying=false;}
}
function rescanBurst(){
  scan(document);
  queueMicrotask(()=>scan(document));
  requestAnimationFrame(()=>{scan(document);requestAnimationFrame(()=>scan(document));});
  setTimeout(()=>scan(document),40);
  setTimeout(()=>scan(document),140);
}
async function setLanguage(next){
  if(!langs.includes(next))next='ru';
  lang=next;
  localeState.language=lang;
  globalThis.FUTURUSS_LANGUAGE=lang;
  document.documentElement.lang=lang;
  // Update the visible UI immediately. Persistence must never block reactivity.
  rescanBurst();
  window.dispatchEvent(new CustomEvent('futuruss:language',{detail:{lang}}));
  try{Promise.resolve(globalThis.FuturussStore?.setItem?.('futuruss.language',lang)).catch(()=>{});}catch{}
  return lang;
}
function start(){
  rescanBurst();
  observer?.disconnect();
  observer=new MutationObserver(ms=>{
    if(applying)return;
    for(const m of ms){
      if(m.type==='characterData')translateText(m.target);
      else if(m.type==='attributes')translateAttrs(m.target);
      else for(const n of m.addedNodes)scan(n);
    }
  });
  observer.observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:attrNames});
}
function resetSources(root=document){
  // WeakMaps intentionally keep node-local originals. Replacing a DOM node naturally creates a new source entry.
  scan(root);
}
globalThis.FuturussI18n={
  get language(){return lang;},
  state:localeState,
  languages:langs,
  dictionary:dict,
  t:tr,
  translate:translateLoose,
  canonical,
  setLanguage,
  start,
  scan,
  resetSources,
  rebuildReverse
};
})();
