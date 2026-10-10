<?php
declare(strict_types=1);
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: 0');
?>
<!DOCTYPE html>
<html lang="ru" class="app-booting" data-interface-theme="default">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>FUTURUSS · Proplex KZ — Накладная на фурнитуру</title>

<!-- Установка на главный экран: Android/Chrome (манифест, закодирован base64 — без сырых кавычек в атрибуте) -->
<meta name="theme-color" content="#087f8c">

<!-- Установка на главный экран: iOS/Safari -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Накладная">
<link rel="apple-touch-icon" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAYAAAA9zQYyAAADpUlEQVR4nO3dPVIUUQCF0R5Kqww0IjZ3J67BhNSUxAW4A9ZggktwF27CFIvARMsSA6higJmhf97r133nnAXMvODj0t0zBZtuac6vblofgQEuTjetj7Ct7WHEm6lh5PO/sYiPy8xxz/dmQj5uM4Vd/02EzLbKYdd7cSFzSKWwy7+okBmicNgnJV9MzAxWuJkyPx1CpoQCaz19ocVMKQVamha0mCltYlPjgxYztUxoa1zQYqa2kY0ND1rMzGVEa8OCFjNzG9hc/6DFTCsD2usXtJhprWeDzwctZpaiR4tlP/qGxg4HbZ1Zmmea3B+0mFmqA2265CDK7qCtM0u3p1ELTZSnQVtn1mJHqxaaKA+Dts6szaNmLTRR7oO2zqzVVrsWmiiCJspt0C43WLu7hi00UQRNFEETRdBE2bghJImFJoqgiSJoogiaKIImiqCJImiiCJoogiaKoIkiaKIImigvWh+glW8f33Tv371sfYyq3n6+7n5c/2t9jFlZaKIImiiCJoqgiSJoogiaKIImiqCJImiiCJoogiaKoIkiaKIImiiCJsrRfh+6hg9ffnVfv/9pfYyjZqGJImiiCJoogiaKoIkiaKIImiiCJoqgiSJoogiaKIImiqCJImii+PpoQZdnr7vLs7Zn+P236159+tn2EA1ZaKIImiiCJoqgiSJoogiaKIImiqCJImiiCJoogiaKoIkiaKIImiiCJorvQxfkz+m2Z6GJImiiCJoogiaKoIkiaKIImiiCJoqgiSJoogiaKIImiqCJImiiCJoogiaKoIkiaKIImiiCJoqgiSJoogiaKIImiqCJImiiCJoogiaKoIkiaKIImiiCJoqgiSJoomy686ub1oeAUiw0UQRNFEETRdBEETRRBE0UQRNF0EQRNFEETRRBE0XQRDnpLk43rQ8BRVycbiw0UQRNFEETRdBEuQ3ajSFrd9ewhSaKoIlyH7TLDtZqq10LTZSHQVtp1uZRsxaaKE+DttKsxY5WLTRRdgdtpVm6PY1aaKLsD9pKs1QH2jy80KJmaZ5p0iUHUZ4P2kqzFD1a7LfQoqa1ng32v+QQNa0MaG/YNbSomdvA5obfFIqauYxobdxTDlFT28jGxj+2EzW1TGhr2nNoUVPaxKamf7Aiakop0FLZGP0TT8YoOIplP/q21gxVuJl6AVprDqk0fvUXVdhsq/xbfL5LBGEft5kuR+e/5hX2cZn5vqrtTZy4MzV8OLC8pxIiX5eFPdn6DwWjrpaDIGrXAAAAAElFTkSuQmCC">
<link rel="icon" href="data:image/png;base64,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">


<style>
  :root{
  }
  *{box-sizing:border-box;}
  body{
    margin:0; line-height:1.35;
  }
  .wrap{max-width:900px; margin:0 auto; padding:14px 10px 40px;}
  header{margin-bottom:14px;}
  header h1{ margin:0 0 3px;}
  header p{margin:0;}
  .badge{
    display:inline-block;
    padding:2px 7px; margin-bottom:6px;
  }
  .card{
    padding:12px 14px; margin-bottom:12px;
  }
  .card h2{ margin:0 0 10px; display:flex; align-items:center; gap:6px;}
  .card h2 .num{
    width:18px; height:18px;
    display:inline-flex; align-items:center; justify-content:center; flex:none;
  }
  label{display:block; margin:9px 0 4px;}
  label:first-of-type{margin-top:0;}
  input[type=number], input[type=text], select{
    width:100%; padding:7px 9px;
  }
  input:focus, select:focus{}
  .row2{display:grid; grid-template-columns:1fr 1fr; gap:8px;}
  .row3{display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px;}
  .hint{ margin-top:4px;}
  button{}
  button.calc{
    margin-top:10px; width:100%; padding:10px; cursor:pointer;
    transition:transform .12s ease, box-shadow .12s ease, filter .12s ease;
  }
  button.calc:hover{filter:brightness(1.05); transform:translateY(-1px);}
  button.calc:active{transform:translateY(0);}
  button.ghost{
    margin-top:7px; width:100%; padding:8px; cursor:pointer;
    display:inline-flex; align-items:center; justify-content:center; gap:6px; transition:transform .12s ease, box-shadow .12s ease, background .12s ease, border-color .12s ease;
  }
  button.ghost:hover{ transform:translateY(-1px);}
  button.ghost:active{transform:translateY(0);}
  button.ghost.accent{}
  button.ghost.accent:hover{filter:brightness(1.05);}
  button.small{padding:3px 7px; cursor:pointer;
    transition:transform .1s ease, background .1s ease, color .1s ease, border-color .1s ease;}
  button.small:hover{ transform:translateY(-1px);}
  button.small.danger{}
  button.small.danger:hover{}
  button.small.photo-btn{}
  button.small.photo-btn:hover{}
  .btn-row{display:flex; gap:8px;}
  .btn-row button{flex:1;}
  .msg{ padding:7px 10px; margin-top:10px; display:none;}
  .msg.err{ display:block;}
  .msg.warn{ display:block;}
  .msg.ok{ display:block;}
  .results{display:none;}
  .results.show{display:block;}
  .table-wrap{overflow-x:auto; -webkit-overflow-scrolling:touch;}
  table{width:100%; border-collapse:collapse; margin-top:4px;}
  #tab-nakladnaya table{table-layout:fixed;}
  th, td{padding:3px 3px; text-align:left; vertical-align:middle; overflow-wrap:break-word;}
  th{}
  td.num, th.num{text-align:right;}
  td.article{ word-break:break-all; cursor:pointer;}
  .qty-input{width:90%; padding:2px 1px; text-align:right;}
  #positions-container table th:nth-child(1), #positions-container table td:nth-child(1){width:4%;}
  #positions-container table th:nth-child(2), #positions-container table td:nth-child(2){width:15%;}
  #positions-container table th:nth-child(3), #positions-container table td:nth-child(3){width:39%;}
  #positions-container table th:nth-child(4), #positions-container table td:nth-child(4){width:10%;}
  #positions-container table th:nth-child(5), #positions-container table td:nth-child(5){width:13%;}
  #positions-container table th:nth-child(6), #positions-container table td:nth-child(6){width:13%;}
  #positions-container table th:nth-child(7), #positions-container table td:nth-child(7){width:6%;}
  #combined-card table th:nth-child(1), #combined-card table td:nth-child(1){width:4%;}
  #combined-card table th:nth-child(2), #combined-card table td:nth-child(2){width:17%;}
  #combined-card table th:nth-child(3), #combined-card table td:nth-child(3){width:44%;}
  #combined-card table th:nth-child(4), #combined-card table td:nth-child(4){width:11%;}
  #combined-card table th:nth-child(5), #combined-card table td:nth-child(5){width:12%;}
  #combined-card table th:nth-child(6), #combined-card table td:nth-child(6){width:12%;}
  table td:nth-child(3){white-space:normal;}
  tr.row-item{cursor:pointer;}
  tr.row-item:hover{}
  tr.row-item.hinge-kit{}
  tr.row-item.hinge-kit:hover{}
  tr.row-item.drive-row td.article, tr.row-item.drive-row td:nth-child(3){}
  tr.total td{ padding-top:8px;}
  .layout-grid{display:grid; grid-template-columns:0.85fr 1.3fr; gap:12px; align-items:start;}
  .layout-grid > *{min-width:0;}
  @media (max-width:760px){ .layout-grid{grid-template-columns:1fr;} }
  .price-default{}
  .section-title{ margin:12px 0 3px;}
  .swatch-row{display:flex; gap:5px; margin-top:5px; flex-wrap:wrap;}
  .pill{ padding:2px 7px;}
  .invoice-head{display:flex; justify-content:space-between; align-items:flex-start; gap:10px; margin-bottom:6px; flex-wrap:wrap;}
  .pos-block{margin-top:14px; padding-top:10px;}
  .pos-block:first-child{ margin-top:0; padding-top:0;}
  .pos-title-row{display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:4px;}
  .pos-title-row b{}
  .add-row{display:flex; gap:6px; margin-top:8px; align-items:center; flex-wrap:wrap;}
  select option.placeholder-hint{}
  .add-row select{flex:1; min-width:140px;}
  .add-row input{width:56px;}
  .add-row button{width:auto; padding:6px 12px;}
  #importMasterFile, #importSchemesFile{display:none;}

  /* Tabs */
  .tabs{display:flex; gap:6px; margin-bottom:12px;}
  .tab-btn{
    padding:8px 14px; cursor:pointer; margin-bottom:-1px;
    transition:color .12s ease, border-color .12s ease;
  }
  .tab-btn:hover{}
  .tab-btn.active{}
  .catalog-tab-btn{
    margin-left:auto; display:flex; align-items:center; gap:6px; padding:4px 8px 4px 4px; cursor:pointer; transition:border-color .12s ease, box-shadow .12s ease, transform .12s ease;
  }
  .catalog-tab-btn:hover{ transform:translateY(-1px);}
  .catalog-tab-btn img{width:34px; height:20px; object-fit:cover; flex:none;}
  .catalog-tab-btn span{}
  .tab-panel{display:none;}
  .tab-panel.active{display:block;}
  .profile-bar{display:flex; align-items:center; gap:6px; margin-bottom:10px; flex-wrap:wrap; padding:6px 8px;}
  .profile-bar label{margin:0; white-space:nowrap; flex:none;}
  .profile-bar select{width:auto; min-width:140px; max-width:260px; flex:1 1 auto; padding:5px 8px; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;}
  .profile-bar button.small{width:auto; flex:none;}

  /* Settings */
  .settings-table{width:100%; border-collapse:collapse;}
  .settings-table th, .settings-table td{padding:4px 5px; text-align:left;}
  .settings-table input[type=text], .settings-table input[type=number]{padding:3px 5px;}
  .settings-table td.art{ white-space:nowrap;}

  .subtabs{display:flex; gap:4px; margin-bottom:12px; flex-wrap:wrap;}
  .subtab-btn{
    padding:6px 11px; cursor:pointer;
    transition:background .12s ease, color .12s ease, border-color .12s ease, transform .12s ease;
  }
  .subtab-btn:hover{ transform:translateY(-1px);}
  .subtab-btn.active{}
  .chip-row{display:flex; flex-wrap:wrap; gap:6px; margin-top:4px;}

  /* Фото/видео баннер справа от шапки */
  .hero-row{display:flex; gap:16px; align-items:stretch;}
  .hero-left{flex:1; min-width:0;}
  .hero-ad-banner{
    position:relative; flex:0 0 240px; width:240px; overflow:hidden;
  }
  .hero-ad-banner img, .hero-ad-banner video{width:100%; height:100%; object-fit:cover; display:block;}
  .hero-ad-layer{position:absolute; inset:0; opacity:0; transition:opacity .7s ease;}
  .hero-ad-layer.active{opacity:1; z-index:1;}
  .hero-ad-empty{
    display:flex; align-items:center; justify-content:center; text-align:center; height:100%;
    min-height:150px; padding:14px; line-height:1.4;
  }
  .hero-ad-close{
    position:absolute; top:6px; right:7px; width:20px; height:20px; cursor:pointer; line-height:1; z-index:2;
  }
  .hero-ad-close:hover{}
  .hero-ad-dots{position:absolute; left:0; right:0; bottom:8px; display:flex; gap:4px; justify-content:center; z-index:2;}
  .hero-ad-dots .ad-dot{}
  .hero-ad-dots .ad-dot.active{}
  .ad-media-thumb{width:36px; height:36px; object-fit:cover; flex:none;}
  .ad-photo-gallery{display:flex; gap:5px; flex-wrap:wrap; align-items:center;}
  .ad-photo-thumb-wrap{position:relative; flex:none;}
  .ad-photo-thumb-remove{
    position:absolute; top:-5px; right:-5px; width:15px; height:15px; line-height:1; cursor:pointer; padding:0;
  }

  /* Плавающие рекламные виджеты (2 места в правом нижнем углу) */
  #ad-widgets-container{position:fixed; right:14px; bottom:14px; z-index:60; display:flex; flex-direction:column; gap:10px; align-items:flex-end;}
  .ad-widget{
    position:relative; width:180px;
    padding:10px 12px; text-decoration:none; display:block; cursor:default;
  }
  a.ad-widget{cursor:pointer; transition:transform .12s ease, box-shadow .12s ease;}
  a.ad-widget:hover{transform:translateY(-2px);}
  .ad-widget-close{
    position:absolute; top:4px; right:5px;
    cursor:pointer; padding:3px; line-height:1;
  }
  .ad-widget-close:hover{}
  .ad-widget-icon{ margin-bottom:4px;}
  .ad-widget-text{ line-height:1.35; margin-bottom:6px; padding-right:10px;}
  .ad-widget-dots{display:flex; gap:4px;}
  .ad-dot{width:5px; height:5px; display:block;}
  .ad-dot.active{}
  .ad-edit-row{display:flex; gap:6px; align-items:center; margin-bottom:6px;}
  .ad-edit-row input{flex:1; margin:0;}
  .range-chip{padding:6px 10px; cursor:pointer; transition:background .12s ease, color .12s ease, border-color .12s ease;}
  .range-chip:hover{}
  .range-chip.active{}
  .range-chip .cnt{opacity:.75;}
  .art-autocomplete{position:relative; flex:1; min-width:160px;}
  .art-autocomplete input{width:100%;}
  .art-autocomplete input::placeholder{}
  .art-dd{display:none; position:absolute; top:calc(100% + 2px); left:0; right:0; max-height:220px; overflow-y:auto; z-index:40;}
  .art-dd.show{display:block;}
  .art-dd-item{padding:6px 10px; cursor:pointer;}
  .art-dd-item:last-child{}
  .art-dd-item:hover{}
  .art-dd-empty{padding:8px 10px;}
  .subtab-panel{display:none;}
  .subtab-panel.active{display:block;}

  .group-details{ margin-bottom:6px; overflow:hidden;}
  .group-details summary{
    padding:7px 10px; cursor:pointer; list-style:none; display:flex; justify-content:space-between; align-items:center;
  }
  .group-details summary::-webkit-details-marker{display:none;}
  .group-details summary .cnt{}
  .group-row{
    display:flex; align-items:center; gap:6px; padding:5px 10px;
  }
  .group-row .g-art{ width:78px; flex:none;}
  .group-row .g-name{flex:1;}
  .group-row .g-price{width:60px; text-align:right; flex:none;}
  .group-row button{flex:none;}
  .g-thumb{width:26px; height:26px; object-fit:cover; flex:none; cursor:pointer;}
  .g-thumb-empty{width:26px; height:26px; flex:none;}
  .g-thumb-wrap{position:relative; flex:none; display:inline-block;}
  .g-thumb-count{position:absolute; bottom:-3px; right:-3px; padding:0 3px; line-height:12px; min-width:12px; text-align:center;}
  .group-row input[type=file]{display:none;}

  .edit-cell{
    display:none;
    padding:12px; margin-top:10px;
  }
  .edit-cell.show{display:block;}
  .edit-cell .art-label{}
  .style-row{display:flex; align-items:center; gap:10px; margin:10px 0;}
  .style-row label{margin:0; width:130px; flex:none;}
  input[type=color]{width:44px; height:30px; padding:2px;}
  input[type=range]{width:100%;}

  body.comfortable .card{padding:20px 22px;}
  body.comfortable table th, body.comfortable table td{padding:8px 9px;}
  body.comfortable .wrap{max-width:1040px;}

  @media print{
    header, .card.input-card, .tabs, button, .badge, .add-row, .print-options, #ad-widgets-container, .hero-ad-banner{display:none !important;}
    body{}
    .card{ padding:0; margin-bottom:8px;}
    .wrap{padding:0; max-width:100%;}
    .layout-grid{display:block;}
    #results{display:none;}
    body.print-positions #results{display:block;}
    #combined-card{break-after:page; page-break-after:always;}
    .pos-block{break-after:page; page-break-after:always;}
    .pos-block:last-of-type{break-after:auto; page-break-after:auto;}
  }

  /* Мобильная адаптация — намеренно в самом конце таблицы стилей, чтобы эти правила
     гарантированно побеждали в каскаде более ранние обычные (не-media) правила той же
     специфичности, без необходимости в !important. */
  @media (max-width:760px){
    .hero-row{flex-direction:column;}
    .hero-ad-banner{width:100%; flex:none; max-height:150px;}
  }

  @media (max-width:480px){
    .tabs{flex-wrap:wrap; row-gap:6px;}
    .tab-btn{padding:7px 9px;}
    .catalog-tab-btn{margin-left:0; order:4; flex:none;}
    .table-wrap{position:relative;}
    .table-wrap table, .table-wrap .settings-table{min-width:520px;}
    .table-wrap::after{
      content:""; position:absolute; top:0; right:0; bottom:0; width:18px; pointer-events:none;
    }
    .btn-row{flex-wrap:wrap;}
    .group-row{flex-wrap:wrap;}
    .group-row .g-name{flex-basis:100%; flex-grow:1; order:1;}
    .group-row .g-art{order:0;}
    #ad-widgets-container{right:8px; bottom:6px; gap:4px;}
    .ad-widget{width:150px; padding:5px 7px;}
    .ad-widget-icon{ margin-bottom:1px;}
    .ad-widget-text{ margin-bottom:3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;}
    .ad-widget-dots{gap:3px;}
    .profile-bar select{max-width:180px;}
    .profile-bar{width:100%;}
    .card.input-card{padding-bottom:120px;}
  }
</style>
<style>
  .modal{
    position:fixed; inset:0; display:none;
    align-items:center; justify-content:center; z-index:50; padding:20px;
  }
  .modal.show{display:flex;}
  .modal-box{ padding:16px; max-width:360px; width:100%;
    text-align:center;
  }
  .modal-box img{max-width:100%; max-height:260px; object-fit:contain; cursor:zoom-in; transition:max-height .2s ease, max-width .2s ease;}
  .modal-box img.zoomed{max-height:82vh; max-width:92vw; cursor:zoom-out;}
  .photo-zoom-wrap{position:relative; display:inline-block; max-width:100%;}
  .photo-zoom-icon{position:absolute; right:6px; bottom:6px; width:22px; height:22px; display:flex; align-items:center; justify-content:center; pointer-events:none;}
  .modal-box .art{ margin-top:10px;}
  .modal-box .nm{ margin-top:3px;}
  .modal-box .cap{ margin-top:6px;}
  .modal-box button{margin-top:12px; padding:7px 18px; cursor:pointer;}
  .photo-strip{display:flex; gap:6px; justify-content:center; margin-top:8px; flex-wrap:wrap;}
  .photo-strip-thumb{width:44px; height:44px; object-fit:cover; cursor:pointer; opacity:.65; transition:opacity .12s ease, border-color .12s ease;}
  .photo-strip-thumb:hover{opacity:1;}
  .photo-strip-thumb.active{ opacity:1;}
</style>
<!-- MATRIX_IMPORT_STYLE_BEGIN -->
<style>#subtabbtn-komplekt,#subtabbtn-rules,#subtab-komplekt,#subtab-rules{display:none!important}#subtabbtn-layout,#subtab-layout{display:none!important}.matrix-family-tabs{display:flex;gap:6px;margin-top:10px}.matrix-family{flex:1;padding:8px 10px;}.matrix-family.active{}.aluminum-controls{display:grid;gap:8px;margin-top:10px;padding:10px;}.aluminum-controls[hidden],.aluminum-options[hidden]{display:none!important}.aluminum-options{display:grid;gap:7px}.aluminum-options label{display:flex!important;align-items:center;gap:7px;margin:0!important}.aluminum-options input[type=checkbox]{width:auto!important}</style>
<!-- MATRIX_IMPORT_STYLE_END -->

<meta name="futuruss-version" content="2026.10.10.26">
<link rel="stylesheet" href="assets/css/icons.css?v=2026.10.10.26">
<link rel="stylesheet" href="assets/css/spa.css?v=2026.10.10.26">
</head>
<body class="workdesk-app">
<div id="appPreloader" role="status" aria-live="polite">
  <div class="preloader-card"><div class="preloader-mark">F</div><div class="preloader-spinner"></div><p class="preloader-title">Калькулятор открывается, ожидайте…</p><p class="preloader-text">Загружаем интерфейс и данные Istina / Central.</p></div>
</div>
<div id="legacyCalculatorRoute">
<div class="wrap">
<header class="workdesk-calculator-title"><h1>Накладная</h1></header>
<div class="hero-row">
  <div class="hero-left">
  <header>
    <span class="badge">FUTURUSS · Proplex KZ</span>
    <h1>Накладная на фурнитуру</h1>
    <p>Подбор комплектации по прайс-листу UPT/Proplex KZ, несколько позиций в одной накладной, ручная корректировка, экспорт в Excel.</p>
  </header>

  <div class="tabs">
    <button class="tab-btn active" id="tabbtn-nakladnaya" onclick="switchTab('nakladnaya')">Накладная</button>
    <button class="tab-btn" id="tabbtn-baza" onclick="switchTab('baza')"><span class="ui-icon i-folder" aria-hidden="true"></span>База артикулов</button>
    <button class="tab-btn" id="tabbtn-settings" onclick="switchTab('settings')"><span class="ui-icon i-gear" aria-hidden="true"></span>Настройки</button>
    <button class="catalog-tab-btn" id="catalog-tab-btn-el" onclick="openCatalog()" title="Открыть технический каталог (PDF)">
      <img src="data:image/jpeg;base64,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" alt="Каталог">
      <span>Каталог</span>
    </button>
    <div id="futurussSessionMount"></div>
  </div>

  <div class="profile-bar">
    <label for="profile-select">Фурнитура:</label>
    <select id="profile-select" onchange="switchProfile(this.value)"></select>
    <button class="small" onclick="createNewProfile()" title="Создать новый бренд фурнитуры">+ Новый бренд</button>
    <button class="small" id="profile-rename-btn" onclick="renameCurrentProfile()" title="Переименовать бренд" style="display:none;"><span class="ui-icon i-pencil" aria-hidden="true"></span>Переименовать</button>
    <button class="small danger" id="profile-delete-btn" onclick="deleteCurrentProfile()" title="Удалить бренд" style="display:none;"><span class="ui-icon i-trash" aria-hidden="true"></span>Удалить бренд</button>
  </div>
  </div><!-- /hero-left -->

  <div class="hero-ad-banner" id="hero-ad-banner"></div>
</div><!-- /hero-row -->

  <div class="tab-panel active" id="tab-nakladnaya">
<!-- MATRIX_IMPORT_FAMILY_BEGIN -->
  <div id="matrixFamilyTabs" class="matrix-family-tabs" hidden aria-label="Система фурнитуры">
    <button type="button" id="matrixFamilyPvc" class="matrix-family active" data-matrix-family="pvc">ПВХ</button>
    <button type="button" id="matrixFamilyAluminum" class="matrix-family" data-matrix-family="aluminum">ALU</button>
  </div>
  <!-- MATRIX_IMPORT_FAMILY_END -->
<div class="layout-grid">
  <div class="card input-card">
    <h2><span class="num">1</span>Параметры позиции</h2>

    <!-- MATRIX_IMPORT_PANEL_BEGIN -->
    <div style="border:1px solid #b8d8dc;border-radius:10px;padding:12px;margin:8px 0 14px;background:#f1f8f9">
      <button type="button" class="ghost accent" id="matrixImportButton">Настроить каталог калькулятора</button>
      <p id="matrixImportMessage" class="hint" style="margin:8px 0 0">Редактируйте комплектации и цены в одном месте. После сохранения калькулятор получает их автоматически.</p>
    </div>
    <!-- MATRIX_IMPORT_PANEL_END -->
    <select id="scheme"></select>
    <button type="button" id="addFreeInvoice" class="small free-invoice-button" onclick="openFreeInvoiceEditor()"><span class="ui-icon i-plus" aria-hidden="true"></span>Свободная заявка</button>
<!-- MATRIX_IMPORT_DETAILS_BEGIN -->
    <div id="matrixImportedDetails" hidden style="margin:10px 0">
      <p id="matrixImportedSummary" class="hint"></p>
      <div id="dornmassWrap"><label for="dornmass">Дорнмасс</label><select id="dornmass"><option value="15" selected>15 мм</option><option value="25">25 мм</option></select></div>
      <div id="matrixDriveChoiceWrap" hidden><label for="matrixDriveChoice">Вариант привода</label><select id="matrixDriveChoice"></select></div>
      <div id="hingeTypeWrap" hidden><label for="hingeType">Петли</label><select id="hingeType"><option value="standard">Стандартные</option><option value="reinforced130">Усиленные верх и низ</option><option value="reinforcedLower">Усиленная нижняя / стандартная верхняя</option></select></div>
      <div id="aluminumControls" class="aluminum-controls" hidden>
        <label for="aluminumProfile">Профиль ALU</label><select id="aluminumProfile"><option value="14">Профиль 14 · AL</option><option value="10">Профиль 10 · AL02</option></select>
      </div>
      <div id="aluminumOptions" class="aluminum-options" hidden>
        <label><input type="checkbox" id="aluLifter">Приподниматель-блокиратор MBU</label>
        <label><input type="checkbox" id="aluPlate">Соединительная пластина PLS</label>
        <label id="aluTravelLimiterWrap"><input type="checkbox" id="aluTravelLimiter">Ограничитель хода цапфы OZ</label>
        <label><input type="checkbox" id="aluSupport">Разгружатель скрытой петли</label>
        <label><input type="checkbox" id="aluLimiter">Ограничитель угла открывания</label>
        <label><input type="checkbox" id="aluFixingPlate">Пластина-фиксатор PLD</label>
        <label><input type="checkbox" id="aluClip">Клипса фиксирующая KF</label>
        <label id="aluDriveEndWrap"><input type="checkbox" id="aluDriveEnd">Декоративное окончание привода OP</label>
        <label id="aluSecurityPlateWrap"><input type="checkbox" id="aluSecurityPlate">Взломостойкая пластина PLV</label>
      </div>
    </div>
    <!-- MATRIX_IMPORT_DETAILS_END -->
<div class="row2">
      <div>
        <label for="width">ШСФ, мм</label>
        <input type="number" id="width" placeholder="900" min="1">
      </div>
      <div>
        <label for="height">ВСФ, мм</label>
        <input type="number" id="height" placeholder="1500" min="1">
      </div>
    </div>

    <div class="row2">
      <div>
        <label for="qtyRight">Правых открываний</label>
        <input type="number" id="qtyRight" value="0" min="0">
      </div>
      <div>
        <label for="qtyLeft">Левых открываний</label>
        <input type="number" id="qtyLeft" value="1" min="0">
      </div>
    </div>

    <label for="poslabel">Название позиции</label>
    <input type="text" id="poslabel" placeholder="Название расчёта">

    <input type="hidden" id="handlePos" value="center">

    <div id="groove-block">
      <label for="grooveType">Фурнитурный паз (профильная система)</label>
      <select id="grooveType"></select>
    </div>

    <div id="futuruss-extra-options">
      <label style="display:flex; align-items:center; gap:7px; margin-top:10px; cursor:pointer;">
        <input type="checkbox" id="offsetHandle" style="width:auto;">
        Положение ручки смещённое
      </label>

      <div class="row2">
        <label style="display:flex; align-items:center; gap:7px; cursor:pointer; margin-top:14px;">
          <input type="checkbox" id="microvent" style="width:auto;">
          Микровентиляция
        </label>
        <label style="display:flex; align-items:center; gap:7px; cursor:pointer; margin-top:14px;">
          <input type="checkbox" id="lifter" style="width:auto;">
          Приподниматель
        </label>
      </div>

      <label style="display:flex; align-items:center; gap:7px; margin-top:10px; cursor:pointer;">
        <input type="checkbox" id="plsEnabled" style="width:auto;">
        Пластины PLS
      </label>

      <label style="display:flex; align-items:center; gap:7px; margin-top:10px; cursor:pointer;">
        <input type="checkbox" id="bprEnabled" style="width:auto;">
        Кнопка-блокиратор поворота ручки (BPR)
      </label>

      <label style="display:flex; align-items:center; gap:7px; margin-top:10px; cursor:pointer;">
        <input type="checkbox" id="handleEnabled" style="width:auto;">
        Ручка
      </label>
      <div id="handleArticleWrap" hidden>
        <label for="handleArticle">Вариант ручки</label>
        <select id="handleArticle"></select>
      </div>
      <input type="hidden" id="handleColor" value="white">
      <div id="handleColorWrap" class="handle-color-wrap" hidden>
        <span>Цвет ручки</span>
        <div class="handle-colors" role="group" aria-label="Цвет ручки">
          <button type="button" id="handleColorWhite" class="handle-color white" title="Белый" aria-label="Белая ручка"></button>
          <button type="button" id="handleColorBlack" class="handle-color black" title="Чёрный" aria-label="Чёрная ручка"></button>
          <button type="button" id="handleColorBrown" class="handle-color brown" title="Коричневый" aria-label="Коричневая ручка"></button>
          <button type="button" id="handleColorAnthracite" class="handle-color anthracite" title="Антрацит" aria-label="Ручка антрацит"></button>
        </div>
      </div>
      <label for="coverColor">Цвет накладок</label>
      <select id="coverColor"><option value="white">Белый</option><option value="brown">Коричневый</option><option value="anthracite">Тёмно-серый (антрацит)</option><option value="black">Чёрный</option></select>
      <div class="hint" style="margin-top:2px;">Количество рассчитается автоматически по числу створок в позиции.</div>
    </div>

    <button class="calc" onclick="addPosition()"><span class="ui-icon i-plus" aria-hidden="true"></span>Добавить позицию</button>
    <button class="ghost calculator-clear" type="button" onclick="clearOrder()" title="Очистить накладную" aria-label="Очистить накладную"><span class="ui-icon i-trash" aria-hidden="true"></span></button>
    <div id="msg" class="msg"></div>
  </div>

  <div class="invoice-column">
  <div class="card" id="combined-card" style="display:none;">
    <div class="invoice-print-only invoice-print-heading combined-print-heading"><span>Общая накладная (сводно по артикулам)</span><strong>FUTURUSS</strong></div>
    <h2><span class="num"><span class="ui-icon i-check-circle" aria-hidden="true"></span></span>Общая накладная (сводно по артикулам)</h2>
    <div class="invoice-head">
      <div><b>Позиций:</b> <span id="inv-count"></span></div>
      <div><b>Дата:</b> <span id="inv-date"></span></div>
    </div>

    <div class="table-wrap">
      <table>
        <thead><tr><th style="width:24px;">№</th><th>Артикул</th><th>Наименование</th><th class="num">Кол-во</th><th class="num">Цена</th><th class="num">Сумма</th><th class="num invoice-pack-cell">Шт./кор.</th></tr></thead>
        <tbody id="combined-tbody"></tbody>
      </table>
    </div>

    <table><tfoot>
      <tr class="total"><td style="text-align:left;">Итого по накладной</td><td class="num" id="inv-grand-total"></td></tr>
    </tfoot></table>

    <div id="combined-position-notes"></div>
    <label class="print-options" style="display:flex; align-items:center; gap:7px; margin-top:10px; cursor:pointer; font-size:11.5px; color:var(--muted);">
      <input type="checkbox" id="printPositionsChk" style="width:auto;" onchange="document.body.classList.toggle('print-positions', this.checked)">
      Печатать также позиции накладной (по одной странице на позицию)
    </label>
    <div class="btn-row" style="margin-top:8px;">
      <button class="ghost" onclick="window.print()"><span class="ui-icon i-printer" aria-hidden="true"></span>Печать / PDF</button>
      <button class="ghost accent" onclick="exportToExcel()"><span class="ui-icon i-table" aria-hidden="true"></span>Экспорт в Excel</button>
    </div>
  </div>

  <div id="results" class="results">
    <div class="card" id="invoice-card">
      <h2><span class="num">2</span>Позиции накладной</h2>
      <div id="positions-container"></div>
    </div>
  </div>

  </div><!-- /invoice-column -->
  </div><!-- /layout-grid -->

  </div><!-- /tab-nakladnaya -->

  <div class="tab-panel" id="tab-baza">
    <div class="card">
      <h2><span class="num"><span class="ui-icon i-folder" aria-hidden="true"></span></span>База артикулов FUTURUSS</h2>
      <p class="hint" style="margin-bottom:8px;">Элементы сгруппированы по категориям — раскройте нужную группу. Кнопка редактирования у позиции открывает отдельную ячейку названия/цены. Кнопка камеры прикрепляет или заменяет фото элемента; миниатюра слева от названия появляется, если фото уже загружено (клик по миниатюре — просмотр).</p>
      <div class="btn-row">
        <button class="ghost accent" onclick="exportMaster()"><span class="ui-icon i-table" aria-hidden="true"></span>Экспорт базы в Excel</button>
        <button class="ghost" onclick="document.getElementById('importMasterFile').click()"><span class="ui-icon i-download" aria-hidden="true"></span>Импорт базы из Excel</button>
      </div>
      <input type="file" id="importMasterFile" accept=".xlsx" onchange="importMaster(this.files[0])">
      <button class="ghost" onclick="resetMaster()"><span class="ui-icon i-rotate" aria-hidden="true"></span>Сбросить к исходному прайс-листу</button>

      <div class="edit-cell" id="edit-cell">
        <div class="art-label" id="edit-cell-art"></div>
        <label for="edit-cell-name">Наименование</label>
        <input type="text" id="edit-cell-name">
        <label for="edit-cell-price">Цена</label>
        <input type="number" step="0.01" id="edit-cell-price">
        <div class="btn-row" style="margin-top:10px;">
          <button class="ghost accent" onclick="saveEditCell()"><span class="ui-icon i-save" aria-hidden="true"></span>Сохранить</button>
          <button class="ghost" onclick="closeEditCell()">Отмена</button>
        </div>
      </div>

      <input type="text" id="master-search" class="icon-search-input" placeholder="Поиск по артикулу или названию..." oninput="renderMasterGroups()" style="margin-top:10px;">
      <div id="master-groups" style="margin-top:10px;"></div>
      <div id="master-msg" class="msg"></div>
    </div>
  </div><!-- /tab-baza -->

  <div class="tab-panel" id="tab-settings">

    <div class="subtabs">
      <button class="subtab-btn active" id="subtabbtn-komplekt" onclick="switchSubtab('komplekt')">Комплектации</button>
      <button class="subtab-btn" id="subtabbtn-rules" onclick="switchSubtab('rules')">Конструктор правил</button>
      <button class="subtab-btn" id="subtabbtn-layout" onclick="switchSubtab('layout')">Схема раскладки</button>
      <button class="subtab-btn" id="subtabbtn-style" onclick="switchSubtab('style')">Внешний вид</button>
      <button class="subtab-btn" id="subtabbtn-ads" onclick="switchSubtab('ads')">Реклама</button>
    </div>

    <div class="subtab-panel active" id="subtab-komplekt">
    <div class="card">
      <h2><span class="num">B</span>Подбор комплектаций (данные по схемам и размерам)</h2>
      <p class="hint" style="margin-bottom:8px;">Полная структура «какая схема + какой диапазон размеров → какие артикулы и в каком количестве» — та же, что использует расчёт накладной. Выгрузите для проверки/корректировки и загрузите обратно.</p>
      <div class="btn-row">
        <button class="ghost accent" onclick="exportSchemes()"><span class="ui-icon i-table" aria-hidden="true"></span>Экспорт комплектаций в Excel</button>
        <button class="ghost" onclick="document.getElementById('importSchemesFile').click()"><span class="ui-icon i-download" aria-hidden="true"></span>Импорт комплектаций из Excel</button>
      </div>
      <input type="file" id="importSchemesFile" accept=".xlsx" onchange="importSchemes(this.files[0])">
      <button class="ghost" onclick="resetSchemes()"><span class="ui-icon i-rotate" aria-hidden="true"></span>Сбросить к исходным комплектациям</button>

      <div class="section-title" style="margin-top:14px;">Редактор комплектации</div>
      <p class="hint" style="margin-bottom:8px;">Выберите схему, затем нажмите на нужный диапазон размеров — ниже появится таблица состава, где можно изменить количество, заменить (с поиском по артикулу/названию) или удалить позицию, добавить новую, поправить сами границы диапазона или создать новый диапазон (с нуля или как копию текущего).</p>

      <label for="editor-scheme">Схема</label>
      <select id="editor-scheme" onchange="populateEditorRanges(); renderSchemeEditor();"></select>

      <div class="row3" style="margin-top:8px;">
        <input type="text" id="new-scheme-name" placeholder="Название новой схемы, напр. Поворотно-откидная">
        <div></div>
        <button class="ghost" onclick="createNewScheme()">+ Новая схема</button>
      </div>

      <label style="margin-top:10px;">Диапазон (ШСФ / ВСФ)</label>
      <div id="editor-range-chips" class="chip-row"></div>

      <div id="editor-range-edit" style="display:none;">
        <div class="row3">
          <div>
            <label for="editor-w-input">ШСФ, мм (диапазон)</label>
            <input type="text" id="editor-w-input" placeholder="400-600">
          </div>
          <div>
            <label for="editor-h-input">ВСФ, мм (диапазон)</label>
            <input type="text" id="editor-h-input" placeholder="400-530">
          </div>
          <div style="display:flex; align-items:flex-end; gap:6px;">
            <button class="ghost accent" style="margin-top:9px; width:auto; flex:1; padding-left:6px; padding-right:6px;" onclick="saveRangeEdit()"><span class="ui-icon i-save" aria-hidden="true"></span>Границы</button>
            <button class="ghost" style="margin-top:9px; width:auto; flex:1; padding-left:6px; padding-right:6px;" onclick="duplicateBlock()" title="Создать копию этого диапазона со всеми позициями"><span class="ui-icon i-copy" aria-hidden="true"></span>Копия</button>
          </div>
        </div>
      </div>

      <div class="table-wrap" style="margin-top:10px;">
        <table class="settings-table" id="editor-table" style="display:none;">
          <thead><tr><th style="width:190px;">Артикул</th><th>Наименование</th><th style="width:70px;">Кол-во</th><th style="width:36px;"></th></tr></thead>
          <tbody id="editor-tbody"></tbody>
        </table>
      </div>

      <div class="add-row" id="editor-add-row" style="display:none; align-items:flex-start;">
        <div class="art-autocomplete">
          <input type="text" id="editor-add-art-search" class="icon-search-input" placeholder="Артикул или название..." autocomplete="off" oninput="onEditorAddArtInput(this.value)" onfocus="onEditorAddArtInput(this.value)">
          <div class="art-dd" id="editor-add-art-dd"></div>
        </div>
        <input type="number" id="editor-add-qty" value="1" min="1" style="width:60px;">
        <button class="ghost accent" style="margin-top:0; width:auto;" onclick="addItemToBlock()">+ Добавить позицию</button>
      </div>

      <div class="btn-row" id="editor-block-actions" style="display:none; margin-top:10px;">
        <button class="small danger" style="width:auto; padding:7px 14px; font-size:12px;" onclick="deleteBlock()"><span class="ui-icon i-trash" aria-hidden="true"></span>Удалить весь диапазон</button>
      </div>

      <div class="section-title" style="margin-top:16px;">Новый диапазон для выбранной схемы</div>
      <div class="row3">
        <input type="text" id="new-w-input" placeholder="ШСФ, напр. 400-600">
        <input type="text" id="new-h-input" placeholder="ВСФ, напр. 400-530">
        <button class="ghost" onclick="addNewBlock()">+ Добавить диапазон</button>
      </div>

      <div id="schemes-msg" class="msg"></div>
    </div>
    </div>

    <div class="subtab-panel" id="subtab-rules">
    <div class="card">
      <h2><span class="num"><span class="ui-icon i-puzzle" aria-hidden="true"></span></span>Конструктор правил подбора</h2>
      <p class="hint" style="margin-bottom:8px;">Дополнение к диапазонам ШСФ/ВСФ. Здесь для схемы задаётся <b>базовый комплект</b> (детали, которые входят всегда) и <b>правила</b> — какая деталь подбирается по высоте, ширине, массе створки, стороне открывания, положению ручки или пазу. При расчёте позиции всё складывается: диапазон (если есть) + базовый комплект + правила. Пороги и артикулы берите из каталога — здесь ничего не подставляется само.</p>

      <label for="rules-scheme">Схема</label>
      <select id="rules-scheme" onchange="renderRulesEditor()"></select>

      <div class="section-title" style="margin-top:12px;">Варианты паза для этого бренда</div>
      <p class="hint" style="margin-bottom:6px;">Через запятую. Попадают в выбор паза на вкладке «Накладная» и в правила по пазу. Для FUTURUSS список фиксированный (автоподбор по пазу).</p>
      <div class="row3">
        <input type="text" id="rules-groove-options" placeholder="напр. паз 15 мм, паз 7,5 мм" style="grid-column:span 2;">
        <button class="ghost" onclick="saveGrooveOptions()"><span class="ui-icon i-save" aria-hidden="true"></span>Сохранить пазы</button>
      </div>

      <div class="section-title" style="margin-top:14px;">Базовый комплект (входит всегда)</div>
      <div id="rules-base-list"></div>
      <div class="add-row" style="align-items:flex-start;">
        <div class="art-autocomplete">
          <input type="text" id="rules-base-art-search" class="icon-search-input" placeholder="Артикул или название..." autocomplete="off" oninput="onRulesBaseArtInput(this.value)" onfocus="onRulesBaseArtInput(this.value)">
          <div class="art-dd" id="rules-base-art-dd"></div>
        </div>
        <input type="number" id="rules-base-qty" value="1" min="1" style="width:60px;">
        <button class="ghost accent" style="margin-top:0; width:auto;" onclick="addBaseItem()">+ В базовый комплект</button>
      </div>

      <div class="section-title" style="margin-top:14px;">Правила подбора</div>
      <div id="rules-list"></div>
      <div class="row3" style="margin-top:6px;">
        <input type="text" id="new-rule-name" placeholder="Название правила, напр. Привод по высоте">
        <select id="new-rule-param">
          <option value="height">по высоте (ВСФ)</option>
          <option value="width">по ширине (ШСФ)</option>
          <option value="weight">по массе створки</option>
          <option value="side">по стороне открывания</option>
          <option value="handle">по положению ручки</option>
          <option value="groove">по пазу</option>
        </select>
        <button class="ghost" onclick="addRule()">+ Новое правило</button>
      </div>

      <div class="section-title" style="margin-top:16px;">Проверить на размерах</div>
      <p class="hint" style="margin-bottom:6px;">Введите параметры — увидите итоговый состав, сумму и откуда взялась каждая деталь.</p>
      <div class="row3">
        <input type="number" id="chk-width" placeholder="ШСФ, мм">
        <input type="number" id="chk-height" placeholder="ВСФ, мм">
        <input type="number" id="chk-weight" placeholder="Масса, кг (необяз.)">
      </div>
      <div class="row3" style="margin-top:6px;">
        <select id="chk-side"><option value="R">Правая</option><option value="L">Левая</option></select>
        <select id="chk-handle"><option value="center">Ручка: центр</option><option value="offset">Ручка: смещённая</option></select>
        <select id="chk-groove"></select>
      </div>
      <button class="ghost accent" onclick="runRulesCheck()"><span class="ui-icon i-check-circle" aria-hidden="true"></span>Проверить состав</button>
      <div class="table-wrap" style="margin-top:8px;">
        <table class="settings-table" id="chk-table" style="display:none;">
          <thead><tr><th style="width:110px;">Артикул</th><th>Наименование</th><th style="width:60px;">Кол-во</th><th style="width:70px;">Цена</th><th>Откуда</th></tr></thead>
          <tbody id="chk-tbody"></tbody>
        </table>
      </div>
      <div id="chk-msg" class="msg"></div>
      <div id="rules-msg" class="msg"></div>
    </div>
    </div>

    <div class="subtab-panel" id="subtab-layout">
    <div class="card">
      <h2><span class="num"><span class="ui-icon i-ruler" aria-hidden="true"></span></span>Схема раскладки на створке</h2>
      <p class="hint" style="margin-bottom:8px;">Ниже — <b>условная</b> схема, построенная по общеотраслевым ориентирам, а не по паспорту FUTURUSS (точных монтажных допусков производителя у меня нет). Она показывается в каждой позиции накладной для наглядности состава, но <b>не предназначена для монтажа</b> — только для проверки на глаз. Поправьте цифры ниже под реальные допуски — изменения сразу применятся ко всем схемам.</p>
      <div class="row2">
        <div>
          <label for="layout-hinge-offset">Отступ петель от угла, мм</label>
          <input type="number" id="layout-hinge-offset" value="150" min="0">
        </div>
        <div>
          <label for="layout-handle-height">Высота ручки от низа, % высоты</label>
          <input type="number" id="layout-handle-height" value="45" min="0" max="100">
        </div>
      </div>
      <div class="row2">
        <div>
          <label for="layout-hook-offset">Отступ крайних зацепов от угла, мм</label>
          <input type="number" id="layout-hook-offset" value="100" min="0">
        </div>
        <div>
          <label for="layout-xzsp-offset">Отступ зацепа откидного от верхнего угла, мм</label>
          <input type="number" id="layout-xzsp-offset" value="220" min="0">
        </div>
      </div>
      <div class="btn-row" style="margin-top:8px;">
        <button class="ghost accent" onclick="saveLayoutRules()"><span class="ui-icon i-save" aria-hidden="true"></span>Сохранить</button>
        <button class="ghost" onclick="resetLayoutRules()"><span class="ui-icon i-rotate" aria-hidden="true"></span>Сбросить к значениям по умолчанию</button>
      </div>
      <div id="layout-msg" class="msg"></div>
    </div>
    </div>

    <div class="subtab-panel" id="subtab-style">
    <div class="card">
      <h2><span class="num">C</span>Внешний вид приложения</h2>
      <div class="style-row">
        <label for="style-accent">Акцентный цвет</label>
        <input type="color" id="style-accent" value="#7452bd" oninput="applyStyle()">
      </div>
      <div class="style-row">
        <label for="style-font">Размер шрифта</label>
        <input type="range" id="style-font" min="12" max="17" value="14" oninput="applyStyle()">
      </div>
      <div class="style-row">
        <label for="style-density">Плотность</label>
        <select id="style-density" onchange="applyStyle()">
          <option value="compact">Компактная</option>
          <option value="comfortable">Просторная</option>
        </select>
      </div>
      <div class="btn-row">
        <button class="ghost accent" onclick="saveStyle()"><span class="ui-icon i-save" aria-hidden="true"></span>Сохранить как основной вид</button>
        <button class="ghost" onclick="resetStyle()"><span class="ui-icon i-rotate" aria-hidden="true"></span>Сбросить оформление</button>
      </div>
      <div id="style-msg" class="msg"></div>
    </div>
    </div>

    <div class="subtab-panel" id="subtab-ads">
    <div class="card">
      <h2><span class="num"><span class="ui-icon i-megaphone" aria-hidden="true"></span></span>Рекламные виджеты</h2>
      <p class="hint" style="margin-bottom:8px;">Один список акций питает сразу два места: два плавающих виджета в правом нижнем углу (текст + иконка) и фото/видео-баннер справа от шапки (перебирает все фото из всех акций плавным переходом, каждые 7 секунд). На каждую акцию можно прикрепить до 10 фото — все они по очереди попадут в баннер. Отредактируйте список ниже — применяется сразу, без перезагрузки страницы. Для видео нужна прямая ссылка на файл (.mp4) — вставки с YouTube/Vimeo пока не поддерживаются.</p>
      <div id="ads-list"></div>
      <button class="ghost" onclick="addAdCampaignRow()">+ Добавить акцию</button>
      <div class="btn-row" style="margin-top:8px;">
        <button class="ghost accent" onclick="saveAdCampaignsFromForm()"><span class="ui-icon i-save" aria-hidden="true"></span>Сохранить</button>
        <button class="ghost" onclick="restoreAdWidgets()"><span class="ui-icon i-rotate" aria-hidden="true"></span>Показать виджеты снова</button>
      </div>
      <div id="ads-msg" class="msg"></div>
    </div>
    </div>

  </div><!-- /tab-settings -->

</div><!-- /wrap -->
</div><!-- /legacyCalculatorRoute -->
<div id="spaApp" v-cloak></div>

<div id="ad-widgets-container"></div>

<div class="modal" id="photoModal" onclick="if(event.target===this) closePhoto()">
  <div class="modal-box">
    <div class="photo-zoom-wrap">
      <img id="photo-img" src="" onclick="togglePhotoZoom()">
      <span class="photo-zoom-icon" id="photo-zoom-icon"><span class="ui-icon i-zoom-in" aria-hidden="true"></span></span>
    </div>
    <div class="photo-strip" id="photo-strip" style="display:none;"></div>
    <div class="art" id="photo-art"></div>
    <div class="nm" id="photo-name"></div>
    <div class="cap" id="photo-cap"></div>
    <div class="btn-row" style="margin-top:12px;">
      <button class="small danger" id="photo-remove-btn" style="display:none; padding:7px 14px; font-size:12px;" onclick="removeCurrentPhoto()"><span class="ui-icon i-trash" aria-hidden="true"></span>Удалить фото</button>
      <button style="margin-top:0;" onclick="closePhoto()">Закрыть</button>
    </div>
  </div>
</div>


<!-- MATRIX_IMPORT_SCRIPTS_BEGIN -->



<!-- MATRIX_IMPORT_SCRIPTS_END -->
<!-- INVOICE_DESIGN_BEGIN -->
<style>:root{}
body{}.wrap{max-width:1600px!important;padding:0 18px 28px!important;margin:auto}.hero-row{display:block;margin:0!important}.hero-left{display:flex;align-items:center;gap:28px;padding:12px 0}.hero-left header{margin:0;padding:0;flex:none}.hero-left header h1,.hero-left header p,.hero-ad-banner{display:none!important}.badge{padding:9px 13px!important;}.tabs{flex:1;display:flex;align-items:center;gap:22px;margin:0!important;}.tab-btn{padding:13px 5px!important;}.tab-btn.active{}.catalog-tab-btn{margin-left:auto!important;padding:8px 14px!important;}.catalog-tab-btn img{display:none}.catalog-tab-btn span{}.catalog-tab-btn span:before{content:'▣ ';}.design-summary{display:flex;align-items:center;gap:10px;padding:12px 0;flex-wrap:wrap}.design-summary input{max-width:240px;padding:9px 12px!important;}.design-summary input::placeholder{opacity:1}.design-chip{padding:8px 13px;}.layout-grid{display:grid!important;grid-template-columns:290px minmax(420px,1fr) 280px!important;gap:12px!important;align-items:start}.input-card{padding:0!important;position:static!important;max-height:none!important;overflow:visible!important}.design-section,.design-upload,#combined-card,.design-preview{padding:14px;margin-bottom:9px}.design-section h3,.design-preview h2{margin:0 0 10px;}.design-section label{margin:10px 0 5px;}.design-section input,.design-section select{height:33px;padding:6px 9px;}.design-section .row2{gap:12px;margin:0}.design-section #futuruss-extra-options .row2{display:block}.design-section #futuruss-extra-options label{margin:7px 0!important;}.design-section input[type=checkbox]{height:15px;width:15px!important;}.design-section .hint{line-height:1.5}.design-upload{padding:10px}.design-upload #matrixImportButton{margin:0;width:100%;padding:10px 4px}.design-upload #matrixImportMessage{line-height:1.4;margin-top:8px!important}.design-upload>div{padding:0!important;margin:0!important}.design-actions button{width:100%;margin:4px 0!important;padding:10px;}.design-actions .calc{}.card{}#combined-card{display:block!important;padding:16px 13px;min-height:630px;margin:0}#combined-card h2{margin:0 5px 16px}#combined-card h2 .num{display:none}#combined-card .invoice-head{margin-bottom:10px;}#combined-card table{table-layout:auto}#combined-card th{padding:12px 8px}#combined-card td{padding:14px 8px;line-height:1.45}#combined-card td.article{white-space:nowrap;word-break:normal}#combined-card .row-item{cursor:pointer}#combined-card .row-item:hover,#combined-card .design-selected{}#combined-card .table-wrap th:first-child,#combined-card .table-wrap td:first-child{display:none}#combined-card .total td{padding-top:16px}#combined-card #inv-grand-total{white-space:nowrap}#combined-card .btn-row{display:flex;gap:12px}#combined-card .btn-row button{flex:1;padding:12px 6px;}#combined-card .btn-row button.accent{}.design-preview{min-height:630px;margin:0;position:sticky;top:12px}.design-photo{height:220px;display:grid;place-items:center;overflow:hidden;text-align:center;padding:10px}.design-photo img{width:100%;height:100%;object-fit:contain;min-height:0}.design-photo-main{grid-area:1/1;width:100%!important;height:100%!important}.design-photo-thumbs{grid-area:1/1;align-self:end;display:flex;gap:5px;max-width:100%;padding:5px;z-index:2;}.design-photo-thumb{width:40px;height:32px;padding:2px;}.design-photo-thumb.active{}.design-photo-thumb img{width:100%!important;height:100%!important;object-fit:cover}.design-part-name{line-height:1.5;margin:10px 0}.design-window{width:100%;height:275px;display:block}.design-caption{line-height:1.5}.design-empty{text-align:center;padding:90px 30px!important}.results{margin-top:18px}.results h2{}#invoice-card{width:70%;margin-left:auto;margin-right:auto}.profile-bar{margin:12px 0!important}.design-details summary{cursor:pointer;margin-top:8px}.design-details p{line-height:1.5}
.header-actions{margin-left:auto;display:flex;align-items:center;gap:8px}.header-icon-button,.header-catalog{height:38px!important;display:inline-flex!important;align-items:center;justify-content:center;gap:7px;margin:0!important;padding:8px 11px!important}.header-icon-button{width:38px!important;min-width:38px!important}.header-icon-button svg,.header-catalog svg{width:19px;height:19px;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}.header-icon-button:hover,.header-catalog:hover{}.header-icon-button.active{}.header-catalog span{}.header-catalog span:before{content:none!important}.sr-only{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:nowrap!important;}
#subtabbtn-baza,#subtabbtn-ads,#subtab-ads,#ad-widgets-container{display:none!important}
.matrix-generic-profile #subtabbtn-komplekt,.matrix-generic-profile #subtabbtn-rules{display:inline-flex!important}.matrix-generic-profile #subtab-komplekt.active,.matrix-generic-profile #subtab-rules.active{display:block!important}
.config-title-with-system{display:flex!important;align-items:center;gap:10px;margin-bottom:10px!important}.config-system-switcher{display:inline-flex!important;align-items:center;gap:4px;margin:0 0 0 auto!important;padding:2px;}.config-system-switcher[hidden]{display:none!important}.config-system-switcher .matrix-family{flex:none!important;min-width:43px;padding:4px 8px!important;line-height:1.2;}.config-system-switcher .matrix-family.active{}.matrix-family-separator{}
.handle-color-wrap{margin:8px 0 10px}.handle-color-wrap>span{display:block;margin-bottom:7px}.handle-colors{display:flex;gap:10px;align-items:center}.handle-color{width:26px!important;height:26px!important;min-width:26px;padding:0!important;}.handle-color.white{background:#fff!important}.handle-color.black{background:#171717!important}.handle-color.brown{background:#6f4937!important}.handle-color.anthracite{background:#50545a!important}.handle-color:hover{transform:scale(1.08)}
.invoice-advertising{width:100%;height:370px;margin:8px 0 14px;overflow:hidden;}.invoice-advertising img{display:block;width:100%;height:100%;object-fit:cover}.invoice-advertising[hidden]{display:none!important}
.estimate-save-panel{margin-top:16px;}.estimate-toggle{width:100%;display:grid;grid-template-columns:auto auto 1fr auto;align-items:center;gap:12px;padding:13px 4px 10px!important;text-align:left;}.estimate-toggle:before{content:'';width:8px;height:8px;}.estimate-toggle-hint{justify-self:end;}.estimate-chevron{width:9px;height:9px;transform:rotate(45deg);transition:transform .25s ease;margin:-4px 4px 0 2px}.estimate-save-panel.open .estimate-chevron{transform:rotate(225deg);margin-top:5px}.estimate-body{display:grid;grid-template-rows:0fr;opacity:0;transition:grid-template-rows .3s ease,opacity .22s ease}.estimate-save-panel.open .estimate-body{grid-template-rows:1fr;opacity:1}.estimate-body-inner{overflow:hidden}.estimate-save-panel.open .estimate-body-inner{padding:3px 2px 2px}.estimate-save-row{display:grid;gap:9px;margin:9px 0}.estimate-name-row{grid-template-columns:minmax(180px,1fr) auto auto}.estimate-list-row{grid-template-columns:minmax(210px,1fr) auto auto auto}.estimate-file-row{grid-template-columns:repeat(3,minmax(150px,1fr));padding-top:9px;}.estimate-save-row input,.estimate-save-row select{min-width:0;height:38px!important;padding:8px 11px!important;transition:border-color .18s,box-shadow .18s}.estimate-save-row input:focus,.estimate-save-row select:focus{}.estimate-save-row button{min-height:38px;padding:8px 13px!important;white-space:nowrap;transition:transform .12s,border-color .18s,background .18s}.estimate-save-row button:hover{}.estimate-save-row button:active{transform:translateY(1px)}.estimate-save-row .estimate-primary{}.estimate-save-row .estimate-primary-soft{}.estimate-save-row .estimate-danger{}.estimate-autosave{margin:8px 2px 2px;padding-left:17px;position:relative}.estimate-autosave:before{content:'✓';position:absolute;left:0;}.settings-article-base{margin-top:0}.settings-article-base>.card{margin-bottom:0}
@media(max-width:1150px){.layout-grid{grid-template-columns:260px minmax(360px,1fr)!important}.design-preview{grid-column:2;min-height:0;position:static}.design-photo{height:170px}.design-window{height:230px}.hero-left{gap:18px}.tabs{gap:14px}}
@media(max-width:720px){.wrap{padding:0 10px 20px!important}.hero-left{flex-wrap:wrap;gap:8px}.tabs{flex-basis:100%;gap:12px}.layout-grid{grid-template-columns:minmax(0,1fr)!important}.design-preview{grid-column:auto}#combined-card{min-height:300px}.design-summary input{max-width:100%}.design-summary{gap:6px}.design-chip{padding:7px}.design-preview{display:grid;grid-template-columns:1fr 1fr;gap:10px}.design-preview h2{grid-column:1/-1}.design-window{grid-column:2;grid-row:2/5}#invoice-card{width:100%}.estimate-name-row,.estimate-list-row,.estimate-file-row{grid-template-columns:1fr}.estimate-save-row button{white-space:normal}}
@media print{.hero-row,.design-summary,.input-card,.design-preview,.design-actions,.invoice-advertising{display:none!important}.layout-grid{display:block!important}#combined-card{min-height:0;}#invoice-card{width:100%}#combined-card .btn-row,#combined-card .print-options{display:none!important}#combined-card td{padding:5px 8px;}.wrap{padding:0!important}}
.estimate-position-name{margin-top:12px;padding-top:10px;}.estimate-position-name label{display:block!important;margin:0 0 5px!important;}.estimate-position-name input{width:100%;box-sizing:border-box;padding:8px 10px!important}.estimate-position-name input:focus{}
#tab-nakladnaya tr.row-item.hinge-kit{}#tab-nakladnaya tr.row-item.hinge-kit:hover{}#tab-nakladnaya tr.row-item.drive-row td.article,#tab-nakladnaya tr.row-item.drive-row td:nth-child(3){}#tab-nakladnaya tr.row-item.drive-row{}#tab-nakladnaya tr.row-item.drive-row:hover{}
.wrap{max-width:1460px!important;margin-left:auto!important;margin-right:auto!important}
.layout-grid{grid-template-columns:280px minmax(520px,720px) 280px!important;justify-content:center;align-items:start}
#combined-card{width:100%;justify-self:stretch;box-sizing:border-box}
#invoice-card{width:min(100%,1100px);margin-left:auto;margin-right:auto;box-sizing:border-box}
#combined-card th{padding:6px 8px!important;}
#combined-card td{padding:5px 8px!important;line-height:1.1!important;}
#combined-card .invoice-head{}
#combined-card .total td{padding-top:9px!important;}
#combined-card #inv-grand-total{}
.design-preview{width:100%;box-sizing:border-box;justify-self:stretch}
.system-profile-slot{min-height:64px;margin-top:8px}
.system-profile-slot>#groove-block,.system-profile-slot>#aluminumControls{height:64px;min-height:64px;box-sizing:border-box;margin:0!important;padding:0!important;display:flex;flex-direction:column;justify-content:flex-start}
.system-profile-slot>#groove-block[hidden],.system-profile-slot>#aluminumControls[hidden]{display:none!important}
.system-profile-slot label{height:18px;margin:0 0 5px!important;line-height:18px}
.system-profile-slot select{height:34px!important;min-height:34px!important;width:100%}
.settings-dialog{width:min(920px,calc(100vw - 32px));max-height:min(820px,88vh);padding:0;overflow:hidden}
.settings-dialog::backdrop{backdrop-filter:blur(2px)}
.settings-dialog-head{height:52px;display:flex;align-items:center;justify-content:space-between;padding:0 16px;}
.settings-dialog-head h2{margin:0;}
.settings-dialog-close{width:34px;height:34px;padding:0!important;line-height:1!important}
.settings-dialog-body{max-height:calc(min(820px,88vh) - 53px);padding:12px;overflow:auto}
.settings-dialog-content{display:block!important;padding:0!important;margin:0!important}
.settings-dialog-content>.profile-bar{display:flex!important;padding:9px 10px!important;margin:0 0 9px!important;}
.settings-dialog-content .design-upload{margin:0 0 9px;padding:9px}
.settings-dialog-content .design-upload h2{margin:0 0 7px}
.settings-dialog-content .subtabs{margin:0 0 9px!important;gap:5px!important}
.settings-dialog-content .subtab-btn{padding:7px 10px!important;}
.settings-dialog-content .card{padding:11px!important;margin:0!important}
.settings-dialog-content h2{margin:0 0 9px}
.article-group{margin:6px 0;overflow:hidden;}
.article-group>summary{padding:9px 11px!important;}
.article-subgroup{margin:0;}
.article-subgroup>summary{padding:8px 13px 8px 27px;cursor:pointer;}
.article-subgroup>summary::marker{}
.article-subgroup .group-row{padding-left:27px}
.article-empty{text-align:center;padding:18px}
#positions-container{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;align-items:start}
#positions-container .pos-block{min-width:0;margin:0;padding:11px;overflow:hidden}
#positions-container .pos-title-row{gap:8px}
#positions-container .pos-title-row>b{}
#positions-container table{table-layout:fixed}
#positions-container th,#positions-container td{padding:4px 3px!important;line-height:1.2}
#positions-container th:nth-child(1),#positions-container td:nth-child(1){width:19px!important}
#positions-container th:nth-child(2),#positions-container td:nth-child(2){width:76px!important}
#positions-container th:nth-child(4),#positions-container td:nth-child(4){width:52px!important}
#positions-container th:nth-child(5),#positions-container td:nth-child(5),#positions-container th:nth-child(6),#positions-container td:nth-child(6){width:50px!important}
#positions-container th:last-child,#positions-container td:last-child{width:27px!important}
#positions-container .article{white-space:normal!important;overflow-wrap:anywhere}
#positions-container .qty-input{min-width:0!important;width:100%!important;height:27px!important;padding:3px!important}
#positions-container .swatch-row{gap:4px;margin:6px 0}
#positions-container .pill{padding:3px 5px}
#positions-container .add-row{grid-template-columns:minmax(0,1fr) 48px auto;gap:5px}
#positions-container .add-row input,#positions-container .add-row button{min-width:0}
@media(max-width:1280px){.layout-grid{grid-template-columns:260px minmax(480px,690px)!important}.design-preview{grid-column:2;position:static;min-height:0}#invoice-card{width:100%}}
@media(max-width:900px){#positions-container{grid-template-columns:1fr}}
@media(max-width:720px){#combined-card,#invoice-card{width:100%}.settings-dialog{width:calc(100vw - 16px);max-height:92vh}.settings-dialog-body{max-height:calc(92vh - 53px)}}

/* Компактная рабочая раскладка: свободные поля по бокам, без изменения расчётов. */
.wrap{max-width:1360px!important;padding-left:12px!important;padding-right:12px!important}
.hero-left{padding:8px 0!important;gap:18px!important}
.layout-grid{grid-template-columns:270px minmax(500px,760px) 240px!important;justify-content:center!important;gap:10px!important}
.design-section,.design-upload,#combined-card,.design-preview{padding:10px!important;margin-bottom:7px!important;}
.design-section h3,.design-preview h2{margin-bottom:7px!important}
.design-section label{margin:6px 0 3px!important;}
.design-section input,.design-section select{height:29px!important;padding:4px 7px!important;}
.design-section .row2{gap:7px!important}
#combined-card{min-height:0!important;padding:11px 10px!important}
#combined-card h2{margin:0 3px 9px!important}
#combined-card th{padding:6px 5px!important}
#combined-card td{padding:6px 5px!important;line-height:1.2!important}
#combined-card .total td{padding-top:9px!important}
#combined-card #inv-grand-total{}
#combined-card .btn-row{gap:7px!important}
#combined-card .btn-row button{padding:8px 5px!important}
.design-preview{min-height:0!important;position:sticky!important;top:8px!important}
.design-photo{height:150px!important}
.design-window{height:210px!important}
.results{margin-top:10px!important}
#positions-container{gap:8px!important}
#positions-container .pos-block{padding:8px!important;}
#positions-container th,#positions-container td{padding:3px 2px!important;line-height:1.15!important}
#positions-container .qty-input{height:24px!important}
.estimate-save-panel{margin-top:10px!important}
.estimate-toggle{padding:9px 3px 7px!important;}
.estimate-save-row{gap:6px!important;margin:6px 0!important}
.estimate-save-row input,.estimate-save-row select,.estimate-save-row button{height:32px!important;min-height:32px!important;padding:5px 8px!important;}
@media(max-width:1240px){.wrap{max-width:1120px!important}.layout-grid{grid-template-columns:250px minmax(480px,1fr)!important}.design-preview{grid-column:2;position:static!important}.design-photo{height:130px!important}}
@media(max-width:780px){.wrap{padding-left:7px!important;padding-right:7px!important}.layout-grid{grid-template-columns:1fr!important}.design-preview{grid-column:auto}.hero-left{flex-wrap:wrap}.tabs{order:3;flex-basis:100%}#positions-container{grid-template-columns:1fr!important}.estimate-name-row,.estimate-list-row,.estimate-file-row{grid-template-columns:1fr!important}}

/* Финальная плотность списка и карточек расчётов. */
@media(min-width:781px){
 .wrap{max-width:1220px!important}
 .layout-grid{grid-template-columns:248px minmax(480px,700px) 228px!important;gap:8px!important}
}
.design-section,.design-upload,#combined-card,.design-preview{padding:8px!important;margin-bottom:6px!important}
.design-section h3,.design-preview h2{margin-bottom:6px!important}
.design-section label{margin:4px 0 2px!important;}
.design-section input,.design-section select{height:27px!important;padding:3px 6px!important;}
.design-section .row2{gap:6px!important}
.design-section .hint,.design-upload #matrixImportMessage{line-height:1.25!important}
#combined-card{padding:9px 8px!important}
#combined-card h2{margin-bottom:7px!important}
#combined-card th{padding:4px 4px!important}
#combined-card td{padding:4px 4px!important;line-height:1.12!important}
#combined-card .total td{padding-top:7px!important}
#combined-card #inv-grand-total{}
#combined-card .btn-row{gap:5px!important}
#combined-card .btn-row button{padding:7px 4px!important}
.design-preview{padding:8px!important}
.design-photo{height:120px!important}
.design-window{height:185px!important}
#positions-container{gap:6px!important}
#positions-container .pos-block{padding:7px!important;}
#positions-container .pos-title-row{gap:5px!important}
#positions-container .pos-title-row>b{}
#positions-container table{}
#positions-container th,#positions-container td{padding:2px!important;line-height:1.08!important}
#positions-container .qty-input{height:22px!important;}
#positions-container .pill{padding:2px 4px!important}
#positions-container .add-row input,#positions-container .add-row button{}
.estimate-save-panel{margin-top:7px!important}
.estimate-toggle{padding:7px 2px 5px!important;}
.estimate-save-row{gap:5px!important;margin:5px 0!important}
.estimate-save-row input,.estimate-save-row select,.estimate-save-row button{height:29px!important;min-height:29px!important;padding:4px 7px!important;}
.pos-block td.article{}
.pos-block tr.drive-row td.article,.pos-block tr.drive-row td:nth-child(3),.pos-block tr.scissors-row td.article,.pos-block tr.scissors-row td:nth-child(3){}
.pos-block .art-autocomplete{min-width:0!important;z-index:30}
.pos-block .art-autocomplete input{display:block!important;pointer-events:auto!important;opacity:1!important;cursor:text!important}
.pos-block .art-dd{z-index:100!important;max-height:260px!important}
.pos-block .art-dd-item{padding:6px 8px!important}
.pos-block .art-dd-item:hover{}
#futuruss-extra-options>label,#futuruss-extra-options .row2 label{margin-top:2px!important;margin-bottom:2px!important;line-height:1.05!important}
#futuruss-extra-options .row2{gap:4px!important;margin:0!important}
#futuruss-extra-options input[type=checkbox]{margin:0!important}
.layout-grid>.design-preview{align-self:stretch!important;height:auto!important}
#futuruss-extra-options{display:flex!important;flex-direction:column!important;gap:2mm!important}
#futuruss-extra-options>label,#futuruss-extra-options .row2 label{margin:0!important}
#futuruss-extra-options .row2{display:flex!important;gap:2mm!important}

/* Бирюзово-синий акцент для согласованного спокойного стиля. */
:root{}
.estimate-save-row .estimate-primary{}
.estimate-save-row .estimate-primary-soft{}
.design-actions .calc,.design-upload #matrixImportButton,#exportInvoice1C,.btn-row button.accent{}
#combined-card #inv-grand-total{}
.tab-btn.active{}
.design-section input:focus,.design-section select:focus{}

/* Рациональная рабочая иерархия: центр — таблица, края — управление и просмотр. */
.hero-left{min-height:48px!important}
.hero-left .tabs{min-width:0!important}
.layout-grid{grid-template-columns:240px minmax(560px,700px) 220px!important;justify-content:center!important}
.design-section{}
.design-section h3{}
#combined-card{}
#combined-card .table-wrap{overflow-x:auto!important}
#combined-card table{min-width:0!important}
#combined-card td:nth-child(3){}
#combined-card tr.drive-row td:nth-child(3),#combined-card tr.scissors-row td:nth-child(3){}
.design-preview{}
#positions-container .pos-block{}
#positions-container .pos-title-row>b{}
#positions-container .pos-block td:nth-child(3){}
@media(max-width:1240px) and (min-width:781px){.layout-grid{grid-template-columns:230px minmax(500px,1fr)!important}.design-preview{grid-column:2!important}}

/* Финальная геометрия рабочей области: широкая конфигурация, плотная сводка, превью на всю высоту. */
@media(min-width:1241px){
 .wrap{max-width:1320px!important}
 .layout-grid{grid-template-columns:300px minmax(560px,700px) 260px!important;gap:10px!important;align-items:stretch!important;justify-content:center!important}
 .input-card{height:100%!important}
 .design-preview{height:100%!important;min-height:0!important;display:grid!important;grid-template-rows:auto minmax(150px,1fr) minmax(220px,1fr)!important;position:static!important;align-content:stretch!important}
 .design-preview .design-photo{height:auto!important;min-height:150px!important;margin:0!important}
 .design-preview .design-part-name{margin:7px 0!important;line-height:1.3!important}
 .design-preview>div:last-child{min-height:220px!important;display:grid!important;place-items:center!important;overflow:hidden!important}
 #combined-card{height:100%!important;min-height:0!important}
 #combined-card table{table-layout:fixed!important}
 #combined-card table th:nth-child(1),#combined-card table td:nth-child(1){width:24px!important}
 #combined-card table th:nth-child(2),#combined-card table td:nth-child(2){width:92px!important}
 #combined-card table th:nth-child(3),#combined-card table td:nth-child(3){width:auto!important}
 #combined-card table th:nth-child(4),#combined-card table td:nth-child(4){width:55px!important}
 #combined-card table th:nth-child(5),#combined-card table td:nth-child(5){width:55px!important}
 #combined-card table th:nth-child(6),#combined-card table td:nth-child(6){width:64px!important}
 #combined-card th{padding:4px 3px!important;}
 #combined-card td{padding:4px 3px!important;line-height:1.1!important}
}

/* Компактная панель конфигурации по образцу: короткие поля и опции-переключатели. */
.input-card{padding:12px!important;}
.input-card>h2{margin:0 0 8px!important}
.input-card>h2 .num{display:none!important}
.input-card>label,.input-card>#groove-block>label{margin:6px 0 3px!important;}
.input-card input[type=number],.input-card input[type=text],.input-card select{height:28px!important;padding:4px 7px!important;}
.input-card .row2{gap:5px!important}
.input-card #futuruss-extra-options{gap:5px!important;margin-top:2px!important}
.input-card #futuruss-extra-options label:has(input[type=checkbox]){display:inline-flex!important;align-items:center!important;width:max-content;max-width:100%;margin:0!important;padding:3px 6px!important;line-height:1.15!important}
.input-card #futuruss-extra-options label:has(input[type=checkbox]):has(input:checked){}
.input-card #futuruss-extra-options input[type=checkbox]{width:13px!important;height:13px!important;margin:0 4px 0 0!important;}
.input-card #futuruss-extra-options label:has(input:checked) input[type=checkbox]{}
.input-card #futuruss-extra-options .row2{display:flex!important;flex-wrap:wrap!important;gap:4px!important;margin:0!important}
.input-card #futuruss-extra-options #coverColor{margin-top:1px!important}
.input-card button.calc,.input-card button.ghost{height:31px!important;margin-top:7px!important;padding:5px 7px!important;}
.matrix-family-tabs{gap:4px!important;margin:7px 0 2px!important}
.matrix-family{padding:5px 10px!important;}
</style>

<!-- INVOICE_DESIGN_END -->
<!-- INTERFACE_THEMES_BEGIN -->
<style>@media screen{
html[data-interface-theme]{}
html[data-interface-theme=easy]{}
html[data-interface-theme=strict]{}
html[data-interface-theme] body{}
html[data-interface-theme] .design-section,html[data-interface-theme] .card,html[data-interface-theme] .input-card,html[data-interface-theme] .design-preview{}
html[data-interface-theme] .design-section input:not([type=checkbox]):not([type=hidden]),html[data-interface-theme] .design-section select{height:var(--ui-field)!important;}
html[data-interface-theme] #combined-card td{padding:var(--ui-pad) 8px!important;line-height:1.35!important}
html[data-interface-theme] #combined-card th{padding:var(--ui-pad) 8px!important;}
html[data-interface-theme] button{}
html[data-interface-theme] .design-actions .calc,html[data-interface-theme] .badge,html[data-interface-theme] #combined-card button.accent{}
html[data-interface-theme] .layout-grid{grid-template-columns:300px minmax(480px,1fr) 260px!important}
html[data-interface-theme] .wrap{max-width:1640px!important}
html[data-interface-theme=easy] .design-section h3{}
html[data-interface-theme=easy] .design-actions button,html[data-interface-theme=easy] #combined-card .btn-row button{min-height:42px!important;}
html[data-interface-theme=strict] .hero-left{padding:8px 12px!important;margin-bottom:8px}
html[data-interface-theme=strict] .hero-left .tab-btn{}
html[data-interface-theme=strict] .hero-left .catalog-tab-btn,html[data-interface-theme=strict] .hero-left .header-icon-button{}
html[data-interface-theme=strict] #combined-card th{}
html[data-interface-theme=strict] #combined-card tbody tr:nth-child(even){}
.input-card #futuruss-extra-options .useful-options-grid{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:6px;margin:4px 0 10px}
.input-card #futuruss-extra-options label.useful-option{display:flex!important;width:auto!important;max-width:none!important;min-width:0;box-sizing:border-box;min-height:34px;padding:7px!important;margin:0!important;line-height:1.3!important;cursor:pointer;gap:5px!important}
.input-card #futuruss-extra-options label.option-wide{grid-column:1/-1}
.input-card #futuruss-extra-options label.useful-option input{flex:none;margin:0!important;}
.input-card #futuruss-extra-options label.useful-option:has(input:checked){}
.input-card #futuruss-extra-options label.useful-option:focus-within{}
html[data-interface-theme=easy] .input-card #futuruss-extra-options label.useful-option{min-height:44px;}
.interface-design-open{margin:0 0 14px;padding:10px 16px;cursor:pointer}
.interface-design-dialog{box-sizing:border-box;width:490px;max-width:94vw;max-height:92vh;overflow:auto;padding:26px;}
.interface-design-dialog::backdrop{backdrop-filter:blur(3px)}
.interface-design-dialog h2{margin:0 0 6px}.interface-design-dialog p{line-height:1.5;margin:0 0 16px}.theme-choices{display:grid;gap:10px}.theme-choice{display:flex;align-items:center;gap:16px;width:100%;padding:16px 12px!important;text-align:left;cursor:pointer}.theme-choice[aria-pressed=true]{}.theme-choice strong{display:block;margin-bottom:5px}.theme-choice small{display:block;line-height:1.45;}.theme-mini{position:relative;display:block;width:82px;height:56px;flex:none;}.theme-mini i{position:absolute;left:5px;top:6px;bottom:6px;width:20px;}.theme-mini b{position:absolute;left:30px;right:5px;top:6px;height:7px;}.theme-mini em{position:absolute;left:30px;right:5px;top:24px;height:5px;}.theme-mini em:last-child{top:38px}.mini-easy{}.mini-easy b{}.mini-strict i,.mini-strict b{}.interface-design-dialog footer{display:flex;justify-content:flex-end;margin-top:18px}.interface-design-dialog footer button{padding:10px 20px;cursor:pointer}#themeSaveNotice:empty{display:none}
@media(max-width:1150px){html[data-interface-theme] .layout-grid{grid-template-columns:280px minmax(0,1fr)!important}html[data-interface-theme] .design-preview{grid-column:1/-1;position:static}}
@media(max-width:720px){html[data-interface-theme] .layout-grid{grid-template-columns:minmax(0,1fr)!important}html[data-interface-theme] .wrap{padding:0 8px 20px!important}.theme-choice{gap:10px}.interface-design-dialog{padding:18px}}
}
@media print{.interface-design-open,#interfaceDesignDialog{display:none!important}}
/* Distinct document actions across all interface themes. */
@media screen{
html[data-interface-theme] #combined-card .btn-row{gap:10px!important;margin-top:12px!important}
html[data-interface-theme] #combined-card .btn-row button,
html[data-interface-theme] #combined-card #exportInvoice1C,
html[data-interface-theme] #erpTransferButton{min-height:38px!important;padding:9px 14px!important;line-height:1.3!important;cursor:pointer}
html[data-interface-theme] #combined-card .btn-row button[onclick*="print"]{}
html[data-interface-theme] #combined-card .btn-row button[onclick*="exportToExcel"]{}
html[data-interface-theme] #combined-card #exportInvoice1C{margin:10px 0 0!important}
html[data-interface-theme] #erpTransferPanel{padding:12px!important;margin:14px 0!important;}
html[data-interface-theme] #erpTransferButton{}
html[data-interface-theme] #combined-card .btn-row button:hover,html[data-interface-theme] #exportInvoice1C:hover,html[data-interface-theme] #erpTransferButton:hover{filter:brightness(.95)}
html[data-interface-theme] #combined-card .btn-row button:focus-visible,html[data-interface-theme] #exportInvoice1C:focus-visible,html[data-interface-theme] #erpTransferButton:focus-visible{}
html[data-interface-theme=easy] #combined-card .btn-row button,html[data-interface-theme=easy] #exportInvoice1C,html[data-interface-theme=easy] #erpTransferButton{min-height:44px!important;}
}
/* One compact action strip; transfer status remains readable below it. */
@media screen{
html[data-interface-theme] #combined-card .document-action-toolbar{display:flex!important;flex-wrap:nowrap!important;align-items:center;gap:6px!important;padding:7px!important;margin:10px 0 0!important;overflow-x:auto}
html[data-interface-theme] #combined-card .document-action-toolbar button,
html[data-interface-theme] #combined-card .document-action-toolbar #exportInvoice1C,
html[data-interface-theme] #combined-card .document-action-toolbar #erpTransferButton{flex:1 0 auto!important;width:auto!important;min-width:65px!important;min-height:30px!important;height:30px!important;margin:0!important;padding:5px 10px!important;line-height:18px!important;white-space:nowrap!important;display:inline-flex!important;align-items:center;justify-content:center}
html[data-interface-theme] #combined-card #erpTransferPanel{padding:0 3px!important;margin:5px 0 10px!important;line-height:1.4!important;}
html[data-interface-theme] #erpTransferPanel [role=status]{margin-top:0!important}
html[data-interface-theme=easy] #combined-card .document-action-toolbar button{min-height:34px!important;height:34px!important;}
html[data-interface-theme=strict] #combined-card .document-action-toolbar{}
}
@media print{.document-action-toolbar,#erpTransferPanel{display:none!important}}
/* Compact calculator, separate saved-estimate dialog, centred previews. */
@media screen{
html[data-interface-theme] .wrap{max-width:1380px!important;padding:0 12px 18px!important}
html[data-interface-theme] .layout-grid{grid-template-columns:270px minmax(480px,1fr) 280px!important;gap:8px!important;align-items:start!important}
html[data-interface-theme] .input-card{height:auto!important;padding:8px!important}
html[data-interface-theme] .design-section{padding:9px!important;margin-bottom:6px!important}
html[data-interface-theme] .design-section h3{margin-bottom:6px!important}
html[data-interface-theme] .estimate-position-name{margin-top:6px!important;padding-top:0!important;}
html[data-interface-theme] .estimate-position-name .estimate-name-label-hidden{display:none!important}
html[data-interface-theme] .estimate-position-name input{margin:0!important}
html[data-interface-theme] .design-section .hint{margin:4px 0 0!important;line-height:1.25!important}
html[data-interface-theme] .design-actions button{margin:4px 0!important}
html[data-interface-theme] .design-actions #msg{margin-top:5px!important;padding:6px 8px!important;}
html[data-interface-theme] #combined-card{height:auto!important;min-height:0!important;padding:10px!important}
html[data-interface-theme] #combined-card td{padding:4px 6px!important;line-height:1.3!important}
html[data-interface-theme] #combined-card th{padding:5px 6px!important;}
html[data-interface-theme] .design-preview{display:flex!important;flex-direction:column!important;gap:6px!important;grid-column:auto!important;height:auto!important;min-height:0!important;padding:10px!important;position:static!important}
html[data-interface-theme] .design-preview h2{margin:0 0 4px!important}
html[data-interface-theme] .design-preview .design-photo{display:grid!important;place-items:center!important;height:260px!important;min-height:0!important;width:100%!important;padding:6px!important;box-sizing:border-box;margin:0!important;overflow:hidden!important}
html[data-interface-theme] .design-photo .design-photo-main{object-fit:contain!important;object-position:center!important;width:100%!important;height:100%!important;max-width:100%;max-height:100%;min-height:0!important}
html[data-interface-theme] .design-preview .design-part-name{margin:3px 0 6px!important;line-height:1.4!important}
html[data-interface-theme] .design-preview>div:last-child{display:grid!important;place-items:center!important;min-height:0!important;width:100%;margin-top:auto;padding-top:8px;overflow:hidden}
html[data-interface-theme] .design-preview .design-window{display:block!important;width:100%!important;height:290px!important;margin:0 auto!important}
html[data-interface-theme] #combined-card .document-action-toolbar .estimate-dialog-open{}
.estimate-save-dialog{box-sizing:border-box;width:580px;max-width:94vw;max-height:90vh;overflow:auto;padding:20px;}
.estimate-save-dialog::backdrop{backdrop-filter:blur(2px)}
.estimate-save-dialog h2{margin:0 0 14px}.estimate-save-dialog #estimateToggle{display:none!important}.estimate-save-dialog .estimate-save-panel{margin:0!important;padding:0!important}.estimate-save-dialog .estimate-body{display:block!important;grid-template-rows:1fr!important;max-height:none!important;height:auto!important;opacity:1!important;overflow:visible!important}.estimate-save-dialog .estimate-body-inner{overflow:visible!important;padding:0!important}.estimate-save-dialog .estimate-save-row{display:flex!important;flex-wrap:wrap;gap:6px!important;margin:8px 0!important}.estimate-save-dialog .estimate-save-row input,.estimate-save-dialog .estimate-save-row select{flex:1 1 100%;min-width:0;width:100%;box-sizing:border-box}.estimate-save-dialog .estimate-save-row button{flex:1 1 auto;height:auto!important;min-height:32px!important;white-space:normal;padding:6px 9px!important}.estimate-save-dialog .estimate-file-row{padding-top:8px;}.estimate-dialog-close{display:block;margin:14px 0 0 auto;padding:8px 18px;cursor:pointer}.estimate-dialog-status{line-height:1.4;}.estimate-dialog-status:empty{display:none}
html[data-interface-theme=easy] #combined-card td{padding:6px!important}
@media(max-width:1120px){html[data-interface-theme] .layout-grid{grid-template-columns:250px minmax(0,1fr)!important}html[data-interface-theme] .design-preview{grid-column:2!important}}
@media(max-width:720px){html[data-interface-theme] .layout-grid{grid-template-columns:minmax(0,1fr)!important}html[data-interface-theme] .design-preview{grid-column:1!important;max-width:360px;width:100%;justify-self:center}html[data-interface-theme] .wrap{padding:0 8px 12px!important}}
}
@media print{#estimateSaveDialog{display:none!important}}
@media screen{
html[data-interface-theme] .input-card #futuruss-extra-options[hidden],
html[data-interface-theme] .input-card #aluminumOptions[hidden],
html[data-interface-theme] .input-card #futuruss-extra-options label[hidden],
html[data-interface-theme] .input-card #aluminumOptions label[hidden]{display:none!important}
html[data-interface-theme] .input-card #aluminumOptions:not([hidden]){display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:6px!important;margin:4px 0 10px!important}
html[data-interface-theme] .input-card #aluminumOptions label.alu-option-tile{display:flex!important;align-items:center;gap:6px!important;box-sizing:border-box;min-width:0;min-height:34px;padding:7px!important;margin:0!important;line-height:1.3!important;cursor:pointer}
html[data-interface-theme] .input-card #aluminumOptions label.option-wide{grid-column:1/-1}
html[data-interface-theme] .input-card #aluminumOptions label.alu-option-tile[hidden]{display:none!important}
html[data-interface-theme] .input-card #aluminumOptions input[type=checkbox]{width:13px!important;height:13px!important;flex:none;margin:0!important;}
html[data-interface-theme] .input-card #aluminumOptions label:has(input:checked){}
html[data-interface-theme] .input-card #aluminumOptions label:focus-within{}
html[data-interface-theme=easy] .input-card #aluminumOptions label.alu-option-tile{min-height:44px;}
}
@media screen{
html[data-interface-theme] .glass-preview-panel{width:100%;box-sizing:border-box;margin:4px 0;padding:10px 0;}
html[data-interface-theme] .glass-preview-panel h3{margin:0 0 8px;}
html[data-interface-theme] .glass-preview-photo{height:260px;display:grid;place-items:center;padding:6px;box-sizing:border-box;overflow:hidden;text-align:center}
html[data-interface-theme] .glass-preview-photo img{width:100%;height:100%;min-height:0;object-fit:contain;object-position:center}
html[data-interface-theme] .glass-preview-photo [hidden]{display:none!important}
html[data-interface-theme] .glass-preview-name{width:100%;box-sizing:border-box;margin:7px 0;height:30px;padding:5px 7px}
html[data-interface-theme] .glass-preview-actions{display:flex;gap:6px}
html[data-interface-theme] .glass-preview-actions button{flex:1;padding:6px 8px;cursor:pointer}
html[data-interface-theme] .glass-preview-actions button:disabled{opacity:.5;cursor:default}
html[data-interface-theme] .glass-preview-status{line-height:1.4;margin:6px 0 0;overflow-wrap:anywhere}
}
/* Restore existing sequential numbering before the article column. */
html[data-interface-theme] #combined-card .table-wrap th:first-child,
html[data-interface-theme] #combined-card .table-wrap tr.row-item td:first-child{display:table-cell!important;width:30px!important;text-align:center!important;}
@media screen{html[data-interface-theme] #combined-card .invoice-head{display:flex;flex-wrap:wrap;gap:6px 18px;align-items:center}html[data-interface-theme] #combined-card .invoice-head b{}}
@media screen{
#subtabbtn-style,#subtab-style,#subtabbtn-articlebase{display:none!important}
.settings-quick-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:12px}
html[data-interface-theme] .settings-quick-actions .interface-design-open{display:inline-flex;align-items:center;margin:0!important;padding:8px 12px!important;min-height:34px;}
html[data-interface-theme] .settings-quick-actions #matrixImportButton{width:auto!important;margin:0!important;padding:7px 10px!important;min-height:32px;}
.settings-dialog .profile-bar{padding:7px 9px!important;margin:0 0 8px!important}.settings-dialog .profile-bar button{padding:4px 8px!important;min-height:26px!important;}.settings-dialog .design-upload{margin:0 0 8px!important;padding:4px 8px!important;}
#articleBaseDetails{margin-top:8px}#articleBaseDetails>summary{cursor:pointer;padding:10px 12px;}#articleBaseDetails #subtab-articlebase{display:block!important;padding:8px!important}#articleBaseDetails:not([open]) #subtab-articlebase{display:none!important}
@media(min-width:1121px){
html[data-interface-theme] #designPreview{height:var(--calculator-height,700px)!important;box-sizing:border-box;display:grid!important;grid-template-columns:minmax(0,1fr)!important;grid-template-rows:auto minmax(0,1fr) auto minmax(0,1fr) minmax(0,1.1fr)!important;gap:5px!important;overflow:hidden}
html[data-interface-theme] #designPreview>.design-photo{height:100%!important;min-height:0!important;grid-area:auto!important}
html[data-interface-theme] #designPreview>.design-part-name{margin:0!important;max-height:42px;overflow:auto}
html[data-interface-theme] #designPreview #constructorAdPreview{display:grid;grid-template-rows:auto minmax(0,1fr);gap:4px;min-height:0;height:100%;margin:0;padding:6px 0;overflow:hidden}
html[data-interface-theme] #constructorAdPreview h3{margin:0}
html[data-interface-theme] #constructorAdPreview .glass-preview-photo{height:100%!important;min-height:0;padding:4px;}
html[data-interface-theme] #designPreview>div:last-child{height:100%!important;min-height:0!important;padding-top:4px!important;margin:0!important}
html[data-interface-theme] #designPreview .design-window{height:100%!important;max-height:100%;min-height:0!important;width:100%!important}
}
}
/* Readable estimate cards and unclipped article suggestions. */
@media screen{
html[data-interface-theme] #invoice-card{width:min(100%,1320px)!important;margin-top:18px!important;padding:14px!important}
html[data-interface-theme] #positions-container{gap:18px!important;align-items:start!important}
html[data-interface-theme] #positions-container .pos-block{position:relative;overflow:visible!important;margin:0!important;padding:12px!important;}
html[data-interface-theme] #positions-container .pos-block:focus-within{z-index:5}
html[data-interface-theme] #positions-container .pos-title-row{margin-bottom:9px!important;gap:10px!important}
html[data-interface-theme] #positions-container .pos-title-row>b{}
html[data-interface-theme] #positions-container .pos-title-row+div{line-height:1.45!important;margin-bottom:7px!important}
html[data-interface-theme] #positions-container .swatch-row{display:flex;flex-wrap:wrap;gap:5px!important;margin:0 0 12px!important}
html[data-interface-theme] #positions-container .swatch-row .pill{line-height:1.4!important;padding:3px 6px!important;}
html[data-interface-theme] #positions-container table{}
html[data-interface-theme] #positions-container td,html[data-interface-theme] #positions-container td.article{padding:6px 4px!important;line-height:1.35!important}
html[data-interface-theme] #positions-container th{padding:7px 4px!important;line-height:1.35!important;}
html[data-interface-theme] #positions-container .qty-input{height:28px!important;min-height:28px!important;box-sizing:border-box}
html[data-interface-theme] #positions-container .total td{padding-top:10px!important;padding-bottom:9px!important}
html[data-interface-theme] #positions-container .add-row{margin-top:10px!important;gap:6px!important;overflow:visible!important}
html[data-interface-theme] #positions-container .add-row input,html[data-interface-theme] #positions-container .add-row button{min-height:30px!important;padding:5px 7px!important;box-sizing:border-box}
html[data-interface-theme] #positions-container .art-autocomplete{position:relative!important;min-width:0!important;overflow:visible!important;flex:1}
html[data-interface-theme] #positions-container .art-dd.show{display:block!important;position:absolute!important;top:calc(100% + 5px)!important;left:0;right:0;z-index:100!important;max-height:240px!important;overflow:auto!important;}
html[data-interface-theme] #positions-container .art-dd-item,html[data-interface-theme] #positions-container .art-dd-empty{line-height:1.45!important;padding:9px 10px!important;white-space:normal!important;overflow-wrap:anywhere;}
html[data-interface-theme] #positions-container .art-dd-item:hover{}
html[data-interface-theme] #tab-nakladnaya tr.row-item.hinge-kit,html[data-interface-theme] #tab-nakladnaya tr.row-item.hinge-kit:hover{}
html[data-interface-theme] #tab-nakladnaya tr.row-item.hinge-kit td{}
html[data-interface-theme] #positions-container tr.drive-row td.article,html[data-interface-theme] #positions-container tr.drive-row td:nth-child(3){}
@media(max-width:1050px){html[data-interface-theme] #positions-container{grid-template-columns:minmax(0,1fr)!important}}
}
/* Denser estimate rows without reducing text size. */
@media screen{
html[data-interface-theme] #positions-container td,
html[data-interface-theme] #positions-container td.article{padding:3px 4px!important;line-height:1.2!important}
html[data-interface-theme] #positions-container .qty-input{height:24px!important;min-height:24px!important;padding:2px 5px!important}
html[data-interface-theme] #positions-container tbody td>button.small{min-height:22px!important;height:22px!important;padding:1px 5px!important;line-height:18px!important}
}
/* Compact line height specifically within individual estimate positions. */
@media screen{
html[data-interface-theme] #positions-container .pos-block tbody tr.row-item{height:22px!important}
html[data-interface-theme] #positions-container .pos-block tbody tr.row-item>td,
html[data-interface-theme] #positions-container .pos-block tbody tr.row-item>td.article{padding:1px 4px!important;line-height:1.15!important;vertical-align:middle!important}
html[data-interface-theme] #positions-container .pos-block tbody .qty-input{height:20px!important;min-height:20px!important;margin:0!important;padding:0 4px!important;line-height:18px!important}
html[data-interface-theme] #positions-container .pos-block tbody td>button.small{height:20px!important;min-height:20px!important;margin:0!important;padding:0 4px!important;line-height:18px!important}
}
</style>


<!-- INTERFACE_THEMES_END -->



<link rel="stylesheet" href="assets/css/themes.css?v=2026.10.10.26">
<script src="assets/vendor/vue.global.prod.js?v=2026.10.10.26"></script>
<script src="assets/vendor/vue-router-lite.js?v=2026.10.10.26"></script>
<script src="assets/js/idb-store.js?v=2026.10.10.26"></script>
<script src="assets/js/preview-gallery.js?v=2026.10.10.26"></script>
<script src="assets/js/media-ui.js?v=2026.10.10.26"></script>
<script src="assets/js/destructive-confirm.js?v=2026.10.10.26"></script>
<script src="assets/js/bootstrap.js?v=2026.10.10.26"></script>
<link rel="stylesheet" href="assets/css/compact-tables.css?v=2026.10.10.26">
<script src="assets/js/modal-pointer-guard.js?v=2026.10.10.26"></script>

<script src="assets/js/modal-layout.js?v=2026.10.10.26"></script>
<link rel="stylesheet" href="assets/css/modal-layout.css?v=2026.10.10.26">
<link rel="stylesheet" href="assets/css/calculator-options.css?v=2026.10.10.26">
<link rel="stylesheet" href="assets/css/cam-selector.css?v=2026.10.10.26">
<link rel="stylesheet" href="assets/css/calculator-header.css?v=2026.10.10.26">
<link rel="stylesheet" href="assets/css/invoice-tables.css?v=2026.10.10.26">
<link rel="stylesheet" href="assets/css/calculator-actions.css?v=2026.10.10.26">
<link rel="stylesheet" href="assets/css/hardware-colors.css?v=2026.10.10.26">
<link rel="stylesheet" href="assets/css/chain-options.css?v=2026.10.10.26">
<link rel="stylesheet" href="assets/css/price-categories.css?v=2026.10.10.26">
<script src="assets/js/invoice-strike-editor.js?v=2026.10.10.26"></script>
<link rel="stylesheet" href="assets/css/invoice-print.css?v=2026.10.10.26">
<script src="assets/js/free-invoice-modal.js?v=2026.10.10.26"></script>
<link rel="stylesheet" href="assets/css/free-invoice-modal.css?v=2026.10.10.26">
</body>
</html>

