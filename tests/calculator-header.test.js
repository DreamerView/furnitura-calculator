const fs=require('fs');
const spa=fs.readFileSync(__dirname+'/../assets/js/spa.js','utf8');
const ui=fs.readFileSync(__dirname+'/../assets/legacy/ui-enhancements.js','utf8');
let n=0;function ok(v,m){n++;if(!v){console.error('FAIL',m);process.exitCode=1}else console.log('OK',m)}
ok(spa.includes('>Управление</router-link>'),'calculator uses one Management action');
ok(spa.includes("window.open(url,'FUTURUSS_CONFIGURATOR')")&&spa.includes('openConfiguratorPage'),'calculator settings opens the reusable standalone configurator tab');
ok(!spa.includes('>Пользователи</router-link><button class="session-pill"'),'calculator session control no longer exposes Users button');
ok(!spa.includes('session-info" v-text="label"'),'role badge removed from calculator header');
ok(spa.includes("v-if=\"auth.role==='central'||auth.role==='dealer'\""),'Management visible only for Central/Dealer tree roles');
ok(spa.includes("router.replace('/calculator')"),'modal login stays on calculator');
ok(ui.includes("headerActions.append(settingsButton,catalogButton);if(sessionMount)headerActions.append(sessionMount)"),'session controls are moved next to Catalog');
ok(spa.includes('>Выйти</button>'),'authenticated header has Logout');
ok(spa.includes('>Войти</button>'),'public header has Login');
console.log(`${n}/9 checks`);
