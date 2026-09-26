'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Q=require('../framework/quizduell-engine'),J=require('../framework/engine'),M=require('../framework/math'),C=require('../framework/choice-order');
const data=require('../content/quizduell-olymp-mathe-8-13.json');
const clone=x=>JSON.parse(JSON.stringify(x));
test('Quizduell: vollständiger Vorrat, strenge Formate und eindeutige Lösungen',()=>{
 assert.equal(Q.validate(data),data);
 for(const change of [d=>d.categories=d.categories.slice(0,7),d=>d.finalQuestions=d.finalQuestions.slice(0,36),d=>d.categories[0].questions.pop(),d=>d.categories[0].questions[0].response.correct=[4],d=>d.categories[0].questions[0].answer='Widerspruch',d=>d.finalQuestions[0].id=d.categories[0].questions[0].id,d=>d.categories[0].questions[0].response.options[0]=null,d=>d.categories[0].questions[0].image='https://example.org/a.png',d=>d.rules={takeover:true},d=>d.gameType='unknown',d=>d.finalQuestions[0].explanation='']){const d=clone(data);change(d);assert.throws(()=>Q.validate(d));}
 assert.throws(()=>J.validate(data));const legacy=clone(require('../content/mathematik-klasse-5.json'));J.validate(legacy);legacy.gameType='invalid';assert.throws(()=>J.validate(legacy));
});
test('Neue NRW-Sätze: vollständige Inhalte und ausgeglichene Antwortpositionen',()=>{
 for(const name of ['quizduell-mathematik-ende-klasse-8-nrw','quizduell-englisch-ende-klasse-5-nrw']){
  const d=require('../content/'+name+'.json');Q.validate(d);assert.equal(d.categories.length,8);assert.equal(d.finalQuestions.length,37);
  const counts=[0,0,0,0];d.categories.flatMap(c=>c.questions).forEach(q=>counts[q.response.correct[0]]++);assert.deepEqual(counts,[6,6,6,6]);
  const all=[...d.categories.flatMap(c=>c.questions),...d.finalQuestions];assert.equal(new Set(all.map(q=>q.question)).size,all.length);
 }
});
test('Quizduell: Wertung, uneinholbarer Vorsprung, Gleichstand und null Punkte',()=>{
 assert.equal(Q.score(2,2),1);assert.equal(Q.score(2,1),0);assert.equal(Q.score(0,null),0);
 assert.equal(Q.finalOutcome(3,4,8),'second');assert.equal(Q.finalOutcome(3,0,2),'first');assert.equal(Q.finalOutcome(3,2,1),null);assert.equal(Q.finalOutcome(3,3,0),'tie');assert.equal(Q.finalOutcome(0,0,0),'tie');
});
test('Beide Spieltypen: zufällig gemischte, ausgewogene Positionen und korrekte Rückzuordnung',()=>{
 const qs=data.categories.flatMap(c=>c.questions),original=JSON.stringify(qs);
 let seed=4;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const order=C.prepare(qs,random),again=C.prepare(qs,random),counts=[0,0,0,0];
 for(const q of qs){const indices=order.get(q.id);assert.deepEqual(indices.slice().sort(),[0,1,2,3]);counts[indices.indexOf(q.response.correct[0])]++;assert.equal(q.response.options[indices[indices.indexOf(q.response.correct[0])]],q.answer);}
 assert.deepEqual(counts,[9,9,9,9]);assert.notDeepEqual([...order.values()],[...again.values()]);assert.equal(JSON.stringify(qs),original);
 const multiple={id:'multi',response:{type:'choice',options:['a','b','c'],correct:[0,2]}};
 const display=C.prepare([multiple],random).get('multi');assert.equal(J.evaluateAnswer(multiple,display.filter(i=>i!==1)),true);
});
test('Mathematik: echte Zeilen und Integralgrenzen, Text bleibt inert',()=>{
 assert.match(M.markup({type:'matrix',rows:[['1','2'],['3','4']]}),/<mtr>.*<mtr>/);
 assert.match(M.markup({type:'integral',lower:'0',upper:'2',integrand:'x²',variable:'x'}),/<msubsup>/);
 assert.ok(!M.markup({type:'matrix',rows:[['<img src=x onerror=alert(1)>']]}).includes('<img'));
 for(const m of [{type:'matrix',rows:[['1'],['2','3']]},{type:'integral',integrand:'x',variable:'x',lower:'0'},{type:'html',html:'<b>x</b>'}])assert.throws(()=>M.validate(m));
});
