/* Close a backdrop only after a full pointer gesture outside its content.
   Native click retargeting after selecting text must never dismiss a modal. */
(function(){
 'use strict';
 const selector='dialog,.spa-modal-backdrop,.modal';
 let gesture=null;
 const surfaceOf=target=>target?.closest?.(selector)||null;
 function outside(surface,event){
  if(event.target!==surface)return false;
  if(surface.tagName!=='DIALOG')return true;
  const r=surface.getBoundingClientRect();
  return event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom;
 }
 document.addEventListener('pointerdown',event=>{
  const surface=surfaceOf(event.target);
  gesture=surface&&event.isPrimary!==false&&event.button===0?{surface,id:event.pointerId,down:outside(surface,event),up:false}:null;
 },true);
 document.addEventListener('pointerup',event=>{
  if(gesture&&gesture.id===event.pointerId)gesture.up=surfaceOf(event.target)===gesture.surface&&outside(gesture.surface,event);
 },true);
 document.addEventListener('pointercancel',()=>{gesture=null;},true);
 document.addEventListener('click',event=>{
  const surface=surfaceOf(event.target);
  if(!surface||event.target!==surface){gesture=null;return;}
  const approved=gesture?.surface===surface&&gesture.down&&gesture.up&&outside(surface,event);
  gesture=null;
  if(!approved){event.stopImmediatePropagation();return;}
  if(surface.tagName==='DIALOG'){
   // The upload overlay stays locked until its operation finishes.
   if(surface.id==='globalUploadPreloader')return;
   surface.close();event.stopImmediatePropagation();
  }
 },true);
})();
