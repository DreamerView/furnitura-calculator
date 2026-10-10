/* UI confirmation gate. Existing delete handlers run only after approval. */
(()=>{
 'use strict';
 const messages={
  ru:['Подтвердите удаление','Вы действительно хотите удалить выбранные данные?','Это действие нельзя отменить.','Отмена','Удалить','Закрыть','Подтвердите сброс','Вы действительно хотите сбросить выбранные данные?','Сбросить'],
  en:['Confirm deletion','Are you sure you want to delete the selected data?','This action cannot be undone.','Cancel','Delete','Close','Confirm reset','Are you sure you want to reset the selected data?','Reset'],
  tr:['Silmeyi onaylayın','Seçilen verileri silmek istediğinizden emin misiniz?','Bu işlem geri alınamaz.','İptal','Sil','Kapat','Sıfırlamayı onaylayın','Seçilen verileri sıfırlamak istediğinizden emin misiniz?','Sıfırla']
 };
 let replay=null,dialog=null,update=null;
 function language(){let source=globalThis.FuturussI18n;try{source=source||window.opener?.FuturussI18n;}catch{}return source?.state?.language||source?.language||globalThis.FUTURUSS_LANGUAGE||globalThis.FuturussStore?.getItem('futuruss.language')||'ru';}
 function destructive(button){
  // User management already has a translated, contextual confirmation dialog.
  if(button.closest('.destructive-confirm,.delete-modal')||button.matches('.more-item.danger'))return false;
  const handler=button.getAttribute('onclick')||'';
  return /(?:remove|delete|clear|reset|cfg\w*Remove)\w*\s*\(/i.test(handler)||Array.from(button.attributes).some(a=>/^data-(?:remove|delete)(?:-|$)/.test(a.name))||/^(?:deleteEstimate|profile-delete-btn|photo-remove-btn|deleteKit|resetCell)$/.test(button.id)||button.classList.contains('danger')||button.classList.contains('ad-photo-thumb-remove')||!!button.querySelector('.i-trash');
 }
 function show(button){
  if(dialog?.open)return;
  const reset=/reset/i.test((button.getAttribute('onclick')||'')+button.id);
  const d=document.createElement('dialog');d.className='destructive-confirm';d.id='destructiveConfirm';d.setAttribute('data-i18n-ignore','');d.setAttribute('aria-labelledby','destructive-confirm-title');d.setAttribute('aria-describedby','destructive-confirm-message');
  const head=document.createElement('div');head.className='destructive-confirm-head';const badge=document.createElement('span');badge.className='destructive-confirm-symbol ui-icon '+(reset?'i-rotate':'i-trash');badge.setAttribute('aria-hidden','true');const close=document.createElement('button');close.type='button';close.className='destructive-confirm-close';close.innerHTML='<span class="ui-icon i-xmark" aria-hidden="true"></span>';const badgeWrap=document.createElement("span");badgeWrap.className="destructive-confirm-badge";badgeWrap.append(badge);head.append(badgeWrap,close);
  const title=document.createElement('h2');title.id='destructive-confirm-title';head.insertBefore(title,close);const question=document.createElement('p');question.id='destructive-confirm-message';const detail=document.createElement('p');detail.className='destructive-confirm-detail';
  const row=button.closest('tr');const article=row?.querySelector('.article');const position=button.closest('.pos-block')?.querySelector('.pos-title-row>b');const label=article?.textContent||position?.textContent||(button.id==='deleteKit'?document.getElementById('propName')?.value:button.id==='deleteEstimate'?document.getElementById('estimateName')?.value:'');
  const context=document.createElement('div');context.className='destructive-confirm-context';context.textContent=(label||'').trim();context.hidden=!context.textContent;
  const foot=document.createElement('div');foot.className='destructive-confirm-foot';const cancel=document.createElement('button');cancel.type='button';cancel.className='destructive-confirm-cancel';cancel.autofocus=true;const approve=document.createElement('button');approve.type='button';approve.className='destructive-confirm-approve';foot.append(cancel,approve);d.append(head,question,context,detail,foot);
  update=()=>{const t=messages[language()]||messages.ru;title.textContent=t[reset?6:0];question.textContent=t[reset?7:1];detail.textContent=t[2];cancel.textContent=t[3];approve.textContent=t[reset?8:4];close.setAttribute('aria-label',t[5]);};update();
  let approved=false;close.onclick=cancel.onclick=()=>d.close();d.addEventListener('click',event=>{if(event.target===d){const r=d.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)d.close();}});
  approve.onclick=()=>{if(approved||!button.isConnected)return;approved=true;approve.disabled=true;d.close();
   // The custom modal replaces only the synchronous native delete confirmation
   // for this approved click. Other confirmations keep their original behavior.
   const nativeConfirm=window.confirm;window.confirm=message=>/(удал|очист|сброс|delete|remove|reset|sil|sıfırla)/i.test(String(message))?true:nativeConfirm.call(window,message);
   replay=button;try{button.click();}finally{replay=null;window.confirm=nativeConfirm;}
  };
  d.addEventListener('close',()=>{d.remove();if(dialog===d){dialog=null;update=null;}if(!approved&&button.isConnected)button.focus({preventScroll:true});});document.body.append(d);dialog=d;d.showModal();cancel.focus();
 }
 document.addEventListener('click',event=>{const button=event.target.closest('button,input[type=button]');if(!button||button===replay||button.disabled||!destructive(button))return;event.preventDefault();event.stopImmediatePropagation();show(button);},true);
 window.addEventListener('futuruss:language',()=>update?.());
 globalThis.FuturussStore?.ready?.then(()=>update?.());
 const fieldWords={ru:['Количество можно изменить в выделенных полях.','Количество','Количество новой детали'],en:['Edit quantities in the outlined fields.','Quantity','New part quantity'],tr:['Miktarları çerçeveli alanlarda değiştirebilirsiniz.','Miktar','Yeni parça miktarı']};
 function fields(){const t=fieldWords[language()]||fieldWords.ru;document.querySelectorAll('#positions-container .pos-block').forEach(block=>{let hint=block.querySelector('.invoice-edit-hint');if(block.classList.contains('free-invoice')){hint?.remove();}else if(!hint){hint=document.createElement('p');hint.className='invoice-edit-hint';hint.setAttribute('data-i18n-ignore','');hint.innerHTML='<span class="ui-icon i-pencil" aria-hidden="true"></span><span></span>';block.querySelector('.table-wrap')?.after(hint);}const text=hint?.lastElementChild;if(text&&text.textContent!==t[0])text.textContent=t[0];block.querySelectorAll('.qty-input:not(.free-price-input)').forEach(input=>{const article=input.closest('tr')?.querySelector('.article')?.textContent||'';input.setAttribute('aria-label',t[1]+' · '+article);input.title=t[1];});const quantity=block.querySelector('.add-row input[type=number]');if(quantity)quantity.setAttribute('aria-label',t[2]);});}
 new MutationObserver(fields).observe(document.body,{childList:true,subtree:true});window.addEventListener('futuruss:language',fields);fields();
})();
