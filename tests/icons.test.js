const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const icons=['more-horizontal','pencil','trash','eye','eye-off','gear','book-open','folder','printer','table','download','save','search','camera','xmark','users','calculator','logout','login','key','plus','rotate'];
let checks=0;function ok(c,m){if(!c){console.error('FAIL:',m);process.exit(1)}checks++;console.log(`ok ${checks} - ${m}`)}
for(const name of icons)ok(fs.existsSync(path.join(root,'assets','icons',name+'.svg')),`local icon ${name}`);
const css=fs.readFileSync(path.join(root,'assets','css','icons.css'),'utf8');
ok(!/https?:\/\//.test(css),'icon CSS has no remote URLs');
ok(css.includes('../icons/more-horizontal.svg')&&css.includes('../icons/eye.svg'),'icon CSS maps local assets');
const spa=fs.readFileSync(path.join(root,'assets','js','spa.js'),'utf8');
ok(spa.includes('i-more-horizontal')&&spa.includes('i-pencil')&&spa.includes('i-trash'),'SPA access actions use local icons');
const index=fs.readFileSync(path.join(root,'index.php'),'utf8');
ok(index.includes('assets/css/icons.css?v='+fs.readFileSync(path.join(root,'VERSION'),'utf8').trim()),'calculator loads versioned local icon CSS');
console.log(`PASS ${checks} icon checks`);
