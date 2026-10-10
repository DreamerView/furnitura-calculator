/* Move existing controls without replacing their handlers or form values. */
(()=>{
 'use strict';
 function layout(dialog){
  if(dialog.dataset.modalLayout||dialog.matches('#globalUploadPreloader,.preview-image-viewer'))return;
  dialog.dataset.modalLayout='true';dialog.classList.add('modal-frame');
  let head=dialog.querySelector(':scope>.dialoghead,:scope>.settings-dialog-head,:scope>.destructive-confirm-head');
  const body=document.createElement('div');body.className='modal-scroll-body';
  const foot=document.createElement('div');foot.className='modal-fixed-foot';
  if(!head){head=document.createElement('div');head.className='modal-fixed-head';const title=dialog.querySelector(':scope>h2,:scope>h3');if(title)head.append(title);const close=dialog.querySelector(':scope>.estimate-dialog-close');if(close)head.append(close);}
  head.classList.add('modal-fixed-head');
  for(const node of [...dialog.children]){
   if(node===head)continue;
   if(node.matches('.editTools,.editbottom,.destructive-confirm-foot,.estimate-dialog-status')||node.querySelector('[data-close],[data-download]'))foot.append(node);
   else body.append(node);
  }
  dialog.append(head,body,foot);foot.hidden=!foot.children.length;
  for(const button of head.querySelectorAll('.icon,.estimate-dialog-close')){
   const icon=document.createElement('span');icon.className='ui-icon i-xmark';icon.setAttribute('aria-hidden','true');
   button.replaceChildren(icon);if(!button.hasAttribute('aria-label'))button.setAttribute('aria-label','Закрыть');
  }
 }
 function update(){document.querySelectorAll('dialog').forEach(layout);const open=!!document.querySelector('dialog[open],.spa-modal-backdrop');if(document.documentElement.classList.contains('modal-surface-open')!==open)document.documentElement.classList.toggle('modal-surface-open',open);}
 new MutationObserver(update).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['open']});update();
})();
