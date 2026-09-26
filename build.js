'use strict';
const fs = require('node:fs');
const path = require('node:path');
const E = require('./framework/engine');
const Q = require('./framework/quizduell-engine');
const root = __dirname;
const read = name => fs.readFileSync(path.join(root, 'framework', name), 'utf8');
const jsonText = data => JSON.stringify(data, null, 2).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
function templateFor(type, music) {
  const prefix = type === 'quizduell' ? 'quizduell-' : '';
  const parts = { STYLE:read(prefix+'style.css'), ENGINE:read('choice-order.js')+'\n'+(prefix?read('math.js')+'\n':'')+read(prefix+'engine.js'), APP:read(prefix+'app.js'), MUSIC:music };
  return read(prefix+'template.html').replace(/\/\*__(STYLE|ENGINE|APP|MUSIC)__\*\//g, (_, key) => parts[key]);
}
const input = process.argv[2];
const inputs = input ? [path.resolve(input)] : fs.readdirSync(path.join(root, 'content')).filter(n => n.endsWith('.json')).map(n => path.join(root, 'content', n));
if (process.argv[3] && inputs.length !== 1) throw new Error('Ein Ausgabeziel erfordert genau einen Aufgabensatz.');
for (const file of inputs) {
  const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
  const data = (raw && raw.gameType === 'quizduell' ? Q : E).validate(raw);
  const html = templateFor(data.gameType, process.argv[3] ? 'Jeopardy-theme-song.mp3' : '../../Jeopardy-theme-song.mp3').replace('/*__DATA__*/', () => jsonText(data));
  const out = process.argv[3] ? path.resolve(process.argv[3]) : path.join(root, 'spiele', data.id, 'index.html');
  fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, html, 'utf8');
  console.log('Erstellt: ' + out);
}
if (!input) {
  const templates={jeopardy:templateFor('jeopardy','Jeopardy-theme-song.mp3'),quizduell:templateFor('quizduell','')};
  const parts={GAME_TEMPLATE:jsonText(templates),ENGINE:read('engine.js')+'\n'+read('math.js')+'\n'+read('quizduell-engine.js')};
  const creator=read('creator.html').replace(/\/\*__(GAME_TEMPLATE|ENGINE)__\*\//g,(_,key)=>parts[key]);
  fs.writeFileSync(path.join(root,'Spiel-Erstellen.html'),creator,'utf8');
  console.log('Erstellt: Spiel-Erstellen.html');
}
// Include every published game, including standalone games without a JSON source.
const escapeHTML = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const gameRoot = path.join(root, 'spiele');
const games = fs.readdirSync(gameRoot, {withFileTypes:true})
  .filter(entry => entry.isDirectory() && fs.existsSync(path.join(gameRoot, entry.name, 'index.html')))
  .map(entry => {
    const html = fs.readFileSync(path.join(gameRoot, entry.name, 'index.html'), 'utf8');
    const match = html.match(/<script\s+id="game-data"\s+type="application\/json">([\s\S]*?)<\/script>/);
    let title = entry.name.replace(/-/g, ' '), detail = 'Lernspiel öffnen';
    if (match) {
      const data = JSON.parse(match[1]);
      title = data.title || title;
      if (Array.isArray(data.categories)) detail = data.categories.length + ' Themen · ' + data.categories.reduce((sum, c) => sum + (c.questions || []).length, 0) + ' Fragen';
      if (data.gameType === 'quizduell') detail = 'Quizduell Olymp · 6 Runden × 3 Fragen + Finale';
    }
    return {slug:entry.name, title, detail};
  }).sort((a,b) => a.title.localeCompare(b.title, 'de'));
const links = games.map(game => '<li><a class="game" href="./spiele/' + encodeURIComponent(game.slug) + '/index.html"><span>' + escapeHTML(game.title) + '</span><small>' + escapeHTML(game.detail) + '</small></a></li>').join('\n');
const home = fs.readFileSync(path.join(root, 'framework/home.html'), 'utf8').replace('<!--__GAMES__-->', () => links);
fs.writeFileSync(path.join(root, 'index.html'), home, 'utf8');
console.log('Erstellt: index.html (' + games.length + ' Spiele)');
