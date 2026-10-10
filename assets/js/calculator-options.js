/* Move the original option controls; their IDs, values and handlers stay intact. */
(()=>{
 'use strict';
 const pvc=document.getElementById('futuruss-extra-options'),alu=document.getElementById('aluminumOptions');
 const section=pvc?.closest('.design-section');if(!section||!alu)return;
 const dialog=document.createElement('dialog');dialog.id='calculatorOptionsDialog';dialog.className='calculator-options-dialog spa-modal auth-modal';dialog.setAttribute('aria-labelledby','calculatorOptionsTitle');
 const head=document.createElement('div');head.className='dialoghead spa-modal-head';const title=document.createElement('h2');title.id='calculatorOptionsTitle';
 const close=document.createElement('button');close.type='button';close.className='spa-icon-btn';close.innerHTML='<span class="ui-icon i-xmark" aria-hidden="true"></span>';close.onclick=()=>dialog.close();const heading=document.createElement('div');heading.append(title);head.append(heading,close);
 // Group the existing decoration label and control without replacing their handlers.
 const cover=pvc.querySelector('#coverColor'),coverLabel=pvc.querySelector('label[for="coverColor"]');
 if(cover&&coverLabel){const field=document.createElement('div');field.className='calculator-decoration-field';coverLabel.before(field);field.append(coverLabel,cover);}
 const content=document.createElement('section');content.className='design-section calculator-options-content spa-modal-body';content.append(alu,pvc);
 const done=document.createElement('button');done.type='button';done.className='spa-btn primary workdesk-confirm';done.innerHTML='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 4 4 10-10"/></svg>';done.onclick=()=>dialog.close();head.append(done);dialog.append(head,content);document.body.append(dialog);
 const button=document.createElement('button');button.type='button';button.id='configureCalculatorOptions';button.className='calculator-options-open';button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-controls',dialog.id);button.innerHTML='<span class="ui-icon i-gear" aria-hidden="true"></span><span></span>';
 section.querySelector('h3')?.after(button);
 button.onclick=()=>{dialog.showModal();const first=[...content.querySelectorAll('input,select,button')].find(n=>!n.disabled&&n.getClientRects().length);first?.focus();};
 const labels={ru:['Опции','Настроить','Готово','Закрыть'],en:['Options','Configure','Done','Close'],tr:['Seçenekler','Ayarla','Tamam','Kapat']};
 function paint(){const lang=globalThis.FuturussI18n?.state?.language||globalThis.FuturussI18n?.language||'ru',words=labels[lang]||labels.ru;title.textContent=words[0];button.lastElementChild.textContent=words[1];done.setAttribute('aria-label',words[2]);done.title=words[2];close.setAttribute('aria-label',words[3]);content.dataset.optionFamily=section.dataset.optionFamily||'pvc';}
 // Only new labels bypass the translator; existing controls retain their translations.
 for(const node of [head,button])node.setAttribute('data-i18n-ignore','');
 new MutationObserver(paint).observe(section,{attributes:true,attributeFilter:['data-option-family']});window.addEventListener('futuruss:language',paint);dialog.addEventListener('close',()=>{if(!document.querySelector('dialog[open]'))button.focus({preventScroll:true});});paint();
})();
