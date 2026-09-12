'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const E = require('../framework/engine');
const data = require('../content/mathematik-klasse-5.json');
const clone = x => JSON.parse(JSON.stringify(x));
const q = E.questions(data);
test('Beide Aufgabensätze erfüllen den Datenvertrag', () => { E.validate(data); E.validate(require('../content/faechermix-klasse-6.json')); });
test('Team 1 startet; richtige Antwort beendet die Karte; keine Doppelwertung', () => {
  const s=E.fresh(data);assert.equal(E.turn(s),0);assert.equal(E.rate(data,s,q[0].id,1,true),false);
  assert.ok(E.rate(data,s,q[0].id,0,true));assert.deepEqual(E.scores(data,s),[100,0]);assert.equal(E.turn(s),1);assert.equal(E.rate(data,s,q[0].id,1,true),false);
});
test('Falsch schließt sofort: keine Minuspunkte und keine Übernahme', () => {
  const s=E.fresh(data);assert.ok(E.rate(data,s,q[0].id,0,false));assert.equal(s.history.length,1);
  assert.deepEqual(E.scores(data,s),[0,0]);assert.equal(E.turn(s),1);assert.equal(E.rate(data,s,q[0].id,1,true),false);
  assert.ok(E.rate(data,s,q[1].id,1,true));assert.deepEqual(E.scores(data,s),[0,200]);assert.deepEqual(E.restore(data,clone(s)),s);
});
test('Vorhandene Punkte bleiben bei einer falschen Antwort erhalten', () => {
  const s=E.fresh(data);E.rate(data,s,q[0].id,0,true);E.rate(data,s,q[1].id,1,true);E.rate(data,s,q[2].id,0,false);assert.deepEqual(E.scores(data,s),[100,200]);assert.equal(E.turn(s),1);
});
test('Zwei bis sechs Teams wechseln zyklisch unabhängig vom Ergebnis', () => {
  for(let n=2;n<=6;n++){const d=clone(data);d.teams=Array.from({length:n},(_,i)=>'Team '+(i+1));E.validate(d);const s=E.fresh(d);
    q.forEach((item,i)=>{assert.equal(E.turn(s),i%n);assert.ok(E.rate(d,s,item.id,i%n,i%2===0));});assert.deepEqual(E.restore(d,clone(s)),s);}
});
test('Rückgängig rekonstruiert Punkte und Startteam; Reset erhält Namen', () => {
  const s=E.fresh(data,['Rot','Blau']);E.rate(data,s,q[0].id,0,true);E.rate(data,s,q[1].id,1,false);s.history.pop();
  assert.deepEqual(E.scores(data,s),[100,0]);assert.equal(E.turn(s),1);const reset=E.fresh(data,s.names);
  assert.deepEqual(reset.names,['Rot','Blau']);assert.equal(E.turn(reset),0);assert.deepEqual(E.scores(data,reset),[0,0]);
});
test('Ein bis fünf Themen mit jeweils fünf Fragen sind gültig', () => {
  for(let n=1;n<=5;n++){const d=clone(data);d.categories=d.categories.slice(0,n);E.validate(d);const s=E.fresh(d);
    E.questions(d).forEach(item=>E.rate(d,s,item.id,E.turn(s),false));assert.equal(s.history.length,n*5);assert.deepEqual(E.scores(d,s),[0,0]);assert.deepEqual(E.restore(d,clone(s)),s);}
});
test('Ungültige, doppelte und unvollständige Inhalte werden abgelehnt', () => {
  for(const change of [d=>d.categories=[],d=>d.categories.push(clone(d.categories[0])),d=>d.categories[0].questions.pop(),d=>d.categories[0].questions[0].answer='',d=>d.categories[0].questions[1].id=d.categories[0].questions[0].id,d=>d.categories[0].questions[0].points=-100,d=>d.rules.subtractOnWrong=true,d=>d.rules.takeover=true,d=>d.categories[0].questions[0].table={headers:['x'],rows:[['a','b']]}]){const d=clone(data);change(d);assert.throws(()=>E.validate(d));}
});
test('Manipulierte und veraltete Speicherstände werden verworfen', () => {
  const s=E.fresh(data);E.rate(data,s,q[0].id,0,true);
  for(const change of [s=>s.history.push(clone(s.history[0])),s=>s.history[0].team=5,s=>s.history[0].correct='yes',s=>s.history[0].id='unknown',s=>s.names=['x'],s=>s.version=1,s=>s.history=null]){const bad=clone(s);change(bad);assert.throws(()=>E.restore(data,bad));}
});
test('Reservierte Objekt-Schlüssel als Aufgaben-ID werden abgelehnt',()=>{const d=clone(data);d.categories[0].questions[0].id='constructor';assert.throws(()=>E.validate(d));});
test('Zahleneingaben: Dezimalkomma, Punkt, führende Nullen und negative Antworten',()=>{
  const item={response:{type:'number',accepted:['2.60']}};
  for(const v of ['2,6','02.600','+2.6',' 2,60 '])assert.equal(E.evaluateAnswer(item,v),true);
  assert.equal(E.evaluateAnswer(item,'26'),false);
  for(const v of ['',',','1,2.3','1e3','Infinity','2 €'])assert.equal(E.evaluateAnswer(item,v),null);
  assert.equal(E.evaluateAnswer({response:{type:'number',accepted:['-0.5']}},'-,50'),true);
  assert.equal(E.canonicalNumber('-0.00'),'0');
});
test('Auswahl prüft die exakte Antwortmenge unabhängig von der Reihenfolge',()=>{
  const item={response:{type:'choice',options:['A','B','C'],correct:[0,2]}};
  assert.equal(E.evaluateAnswer(item,[2,0]),true);assert.equal(E.evaluateAnswer(item,[0]),false);assert.equal(E.evaluateAnswer(item,[0,1,2]),false);
  for(const a of [[],[0,0],[4],['0']])assert.equal(E.evaluateAnswer(item,a),null);
});
test('Fehlerhafte Eingabeformate scheitern beim Build',()=>{
  for(const response of [{type:'other'},{type:'number',accepted:['1/2']},{type:'choice',options:['A','A'],correct:[0]},{type:'choice',options:['A','B'],correct:[2]}]){const d=clone(data);d.categories[0].questions[0].response=response;assert.throws(()=>E.validate(d));}
});
