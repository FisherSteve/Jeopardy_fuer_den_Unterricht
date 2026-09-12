'use strict';
const fs = require('node:fs');
const path = require('node:path');
const E = require('./framework/engine');
const root = __dirname;
const input = process.argv[2];
const inputs = input ? [path.resolve(input)] : fs.readdirSync(path.join(root, 'content')).filter(n => n.endsWith('.json')).map(n => path.join(root, 'content', n));
if (process.argv[3] && inputs.length !== 1) throw new Error('Ein Ausgabeziel erfordert genau einen Aufgabensatz.');
for (const file of inputs) {
  const data = E.validate(JSON.parse(fs.readFileSync(file, 'utf8')));
  const parts = {
    STYLE: fs.readFileSync(path.join(root, 'framework/style.css'), 'utf8'),
    DATA: JSON.stringify(data, null, 2).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029'),
    ENGINE: fs.readFileSync(path.join(root, 'framework/engine.js'), 'utf8'),
    APP: fs.readFileSync(path.join(root, 'framework/app.js'), 'utf8')
  };
  const html = fs.readFileSync(path.join(root, 'framework/template.html'), 'utf8').replace(/\/\*__(STYLE|DATA|ENGINE|APP)__\*\//g, (_, key) => parts[key]);
  const out = process.argv[3] ? path.resolve(process.argv[3]) : path.join(root, 'spiele', data.id + '.html');
  fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, html, 'utf8');
  console.log('Erstellt: ' + out);
}
if (!input) {
  const parts={STYLE:fs.readFileSync(path.join(root,'framework/style.css'),'utf8'),ENGINE:fs.readFileSync(path.join(root,'framework/engine.js'),'utf8'),APP:fs.readFileSync(path.join(root,'framework/app.js'),'utf8')};
  const gameTemplate=fs.readFileSync(path.join(root,'framework/template.html'),'utf8').replace(/\/\*__(STYLE|ENGINE|APP)__\*\//g,(_,key)=>parts[key]);
  const embedded=JSON.stringify(gameTemplate).replace(/</g,'\\u003c');
  const creator=fs.readFileSync(path.join(root,'framework/creator.html'),'utf8').replace(/\/\*__(GAME_TEMPLATE|ENGINE)__\*\//g,(_,key)=>key==='ENGINE'?parts.ENGINE:embedded);
  fs.writeFileSync(path.join(root,'Spiel-Erstellen.html'),creator,'utf8');
  console.log('Erstellt: Spiel-Erstellen.html');
}
