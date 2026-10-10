/* Visual assembly groups. Original invoice indices stay stable for editing. */
(function(root){
'use strict';
const normalize=z=>({front:'front',handle:'front',rear:'rear',hinge:'rear',upper:'upper',top:'upper',lower:'bottom',bottom:'bottom'})[z]||null;
const ranks={front:0,rear:1,upper:2,bottom:3};
function side(row,rows=[],seen=new Set()){
 const a=String(row.art||'').replace(/\.BLACK$/i,''),name=String(row.name||'').toLowerCase();
 // Corner transmissions and tilt catches belong with the handle-side assembly.
 if(/^(?:X?U(?:[1-9](?:\.|$)|$)|X?USP|ZUSP|Z[UV]O|XZSP|ZSP)/i.test(a)||/угловая передача|зацеп откидной|шпингалет откидной/.test(name))return 'front';
 const explicit=normalize(row.installationZone||row.chainZone)||normalize(row.placements?.[0]?.zone);
 if(explicit)return explicit;
 const inferred=root.MatrixCore?.extensionZone?.({...row,art:a});if(normalize(inferred))return normalize(inferred);
 if(/^(?:X?PNB|PNF)\./i.test(a))return 'rear';
 if(/^(?:X?NO|NF|PNO)\./i.test(a)||/ножницы/.test(name))return 'upper';
 if(/^(?:N\.(?:RV|RN|SV|SN|PN|3DS)|RV(?:\.|$)|RN(?:\.|$)|SV\.|SN(?:\.|$)|3DS\.|SF\.|SPK-|SPN-|FPR\.|PN\.|PS\.)/i.test(a)||/петл|прижим.*скрыт|накладной прижим/.test(name))return 'rear';
 if(!seen.has(a)){seen.add(a);for(const d of row.dependencies||[]){const parent=rows.find(r=>r.art===d.parent);if(parent&&!seen.has(parent.art))return side(parent,rows,seen);}}
 return 'front';
}
function parts(row){
 const ps=row.placements;if(!Array.isArray(ps)||ps.length<2)return null;
 const byZone=new Map();for(const p of ps){const z=normalize(p.zone),q=Number(p.qty);if(!z||!Number.isFinite(q)||q<0)return null;byZone.set(z,(byZone.get(z)||0)+q);}
 if(byZone.size<2||Math.abs([...byZone.values()].reduce((a,b)=>a+b,0)-Number(row.qty))>0.000001)return null;
 return [...byZone].filter(([,qty])=>qty>0).map(([zone,qty])=>({zone,qty}));
}
function entries(rows){
 const result=[];rows.forEach((row,index)=>{const split=parts(row);if(split)for(const p of split)result.push({index,zone:p.zone,editZone:p.zone,row:{...row,qty:p.qty,chainZone:p.zone,placements:[p]}});else result.push({index,zone:side(row,rows),editZone:null,row});});
 return result.sort((a,b)=>ranks[a.zone]-ranks[b.zone]||a.index-b.index);
}
function changeZone(row,zone,qty){
 const split=parts(row);if(!split||!split.some(p=>p.zone===zone))return null;
 const placements=split.map(p=>p.zone===zone?{...p,qty}:p).filter(p=>p.qty>0);
 return {...row,qty:placements.reduce((n,p)=>n+p.qty,0),placements,chainZone:placements[0]?.zone||zone};
}
root.FuturussInvoiceSides={side,parts,entries,changeZone};
})(globalThis);
