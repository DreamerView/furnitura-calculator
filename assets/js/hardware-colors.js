/* Shared presentation only: colour follows the actual article, never the requested replacement. */
(function(root){
 'use strict';
 const colors=['white','brown','anthracite','black'];
 function articleColor(art,record={}){
  record=record||{};
  const name=String(record.name||'');
  const handle=!!record.handleBase||!!record.handleColor||/^ручки$/i.test(record.group||'')||/^ручк[аи]/i.test(name)||/^RP(?:[.\d]|$)/i.test(art);
  const cover=/^N\./i.test(art)||/^накладк[аи]/i.test(name)||/декоративн.*наклад/i.test(record.group||'');
  if(!handle&&!cover)return '';
  const explicit=handle?record.handleColor:record.coverColor;
  if(colors.includes(explicit))return explicit;
  if(/\.BLACK$/i.test(art))return 'black';
  if(/\.A$/i.test(art))return 'anthracite';
  if(/\.K$/i.test(art))return 'brown';
  if(/\.B$/i.test(art))return 'white';
  if(/антрацит|anthracite|antrasit/i.test(name))return 'anthracite';
  if(/ч[её]рн|black|siyah/i.test(name))return 'black';
  if(/коричнев|brown|kahverengi/i.test(name))return 'brown';
  if(/бел[а-я]*|white|beyaz/i.test(name))return 'white';
  return '';
 }
 // Document cells stay neutral; only option controls are painted.
 function cellClass(){return ''; }
 function paint(element,color){if(!element)return;for(const key of colors)element.classList.remove('hardware-color--'+key);element.classList.toggle('hardware-color',colors.includes(color));if(colors.includes(color))element.classList.add('hardware-color--'+color);}
 root.FuturussHardwareColors={articleColor,cellClass,paint};
 if(typeof module==='object'&&module.exports)module.exports=root.FuturussHardwareColors;
})(globalThis);
