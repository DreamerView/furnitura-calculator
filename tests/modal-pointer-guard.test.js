const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const root=path.resolve(__dirname,'..'),listeners={};
vm.runInNewContext(fs.readFileSync(path.join(root,'assets/js/modal-pointer-guard.js'),'utf8'),{document:{addEventListener(name,callback){listeners[name]=callback;}}});
function modal(tag='DIV',id=''){const m={tagName:tag,id,closed:0,getBoundingClientRect:()=>({left:100,right:500,top:100,bottom:500}),close(){this.closed++;},closest(){return this;}};return m;}
function child(m){return{closest:()=>m};}
function event(target,x=30,y=30){return{target,clientX:x,clientY:y,pointerId:1,isPrimary:true,button:0,stopped:false,stopImmediatePropagation(){this.stopped=true;}};}
function gesture(down,up,click=up){listeners.pointerdown(down);listeners.pointerup(up);listeners.click(click);return click;}
let count=0;function ok(c,label){assert(c,label);console.log('ok '+ ++count+' - '+label);}
const backdrop=modal(),input=child(backdrop);
ok(gesture(event(input,150,150),event(backdrop)).stopped,'Selecting text from input to backdrop preserves Vue modal');
ok(gesture(event(backdrop),event(input,150,150),event(backdrop,150,150)).stopped,'Gesture from backdrop into content does not dismiss');
ok(!gesture(event(backdrop),event(backdrop)).stopped,'A complete outside click reaches Vue close handler');
ok(!gesture(event(input,150,150),event(input,180,150)).stopped,'Normal input selection and input handlers remain active');
const native=modal('DIALOG'),field=child(native);
gesture(event(field,150,150),event(native));ok(native.closed===0,'Native dialog stays open when text drag ends outside');
gesture(event(native,150,150),event(native,150,150));ok(native.closed===0,'Native dialog padding is inside the dialog');
gesture(event(native),event(native));ok(native.closed===1,'Native dialog closes on a genuine backdrop click');
const locked=modal('DIALOG','globalUploadPreloader');gesture(event(locked),event(locked));ok(locked.closed===0,'Upload preloader remains locked');
listeners.pointerdown(event(backdrop));listeners.pointercancel();const click=event(backdrop);listeners.click(click);ok(click.stopped,'Cancelled pointer gesture cannot dismiss a modal');
listeners.pointerdown(event(input));listeners.pointerup(event(backdrop));const button=event(child(backdrop));listeners.click(button);ok(!button.stopped,'Close and action buttons still receive their own clicks');
const second=modal();ok(gesture(event(backdrop),event(second)).stopped,'Pointer gesture cannot carry dismissal to another modal');
console.log('PASS '+count+' modal pointer checks');
