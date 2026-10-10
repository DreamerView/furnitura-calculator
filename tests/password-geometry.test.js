const fs=require('fs');
const path=require('path');
const root=path.join(__dirname,'..');
const css=fs.readFileSync(path.join(root,'assets/css/spa.css'),'utf8')+fs.readFileSync(path.join(root,'assets/css/themes.css'),'utf8');
const spa=fs.readFileSync(path.join(root,'assets/js/spa.js'),'utf8');
let passed=0;
function ok(v,m){if(!v){console.error('FAIL:',m);process.exitCode=1;}else{passed++;console.log('OK:',m);}}
ok(css.includes('.spa-password-wrap input,html:root body .spa-password input{display:block;width:100%;padding-right:52px!important}'), 'password controls fill their wrapper and reserve 52px for the eye button');
ok(css.includes('.spa-password-wrap{position:relative;width:100%}'), 'password wrapper fills available width');
ok(css.includes('.spa-password-wrap input{display:block;width:100%;padding-right:45px}'), 'password input reserves local eye button space without shrinking');
ok(spa.includes('id="spaAuthLogin"')&&spa.includes('class="spa-password-wrap"'), 'embedded login contains paired login/password controls');
ok((spa.match(/class="spa-password-wrap"/g)||[]).length>=3, 'all password contexts use the shared wrapper');
if(!process.exitCode)console.log(`PASS ${passed}/5`);
