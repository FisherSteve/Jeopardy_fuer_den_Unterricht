'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{pathToFileURL}=require('node:url');
const pw=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=path.resolve(__dirname,'..'),data=require('../content/'+(process.env.QUIZDUELL_CONTENT||'quizduell-olymp-mathe-8-13')+'.json');
const url=file=>pathToFileURL(path.join(root,file)).href;
fs.mkdirSync(path.join(root,'tests/screenshots'),{recursive:true});fs.mkdirSync(path.join(root,'test-results'),{recursive:true});
async function mainRound(page,correct=true){
 for(let round=0;round<6;round++){
  assert.equal(await page.locator('.cat').count(),3);
  const category=await page.locator('.cat').first().getAttribute('data-cat');await page.locator('.cat').first().click();
  for(let qi=0;qi<3;qi++){
   const q=data.categories[+category].questions[qi],options=await page.locator('.answer .txt').allTextContents();
   const answer=correct?q.answer:q.response.options.find(v=>v!==q.answer),index=options.indexOf(answer);
   assert.equal(await page.locator('.learning-feedback').count(),0);
   if(round===0&&qi===0){await page.locator('#touchOlymp').click();await page.locator('[data-secret="'+index+'"]').click();assert.equal(await page.locator('#secretDialog').isVisible(),false);}
   else await page.keyboard.press(String(index+1));
   assert.equal(await page.locator('.answer.selected').count(),0,'Olymp choice is not marked');
   await page.locator('.answer').nth(index).click();
   assert.deepEqual(await page.locator('.answer .txt').allTextContents(),options,'Selecting keeps order stable');
   await page.locator('#lockTeam').click();
   assert.match(await page.locator('.learning-feedback').innerText(),new RegExp(correct?'Richtig!':'Nicht richtig'));
   assert.ok((await page.locator('.learning-feedback').innerText()).includes(q.explanation));
   assert.deepEqual(await page.locator('.score').allTextContents(),[String(correct?round*3+qi+1:0),String(correct?round*3+qi+1:0)]);
   await page.keyboard.press('Enter');assert.equal(await page.locator('.learning-feedback').count(),1,'Immediate second Enter cannot skip feedback');
   await page.clock.runFor(500);await page.locator('#nextQ').click();
  }
  await page.locator('#continueRound').click();
 }
}
(async()=>{for(const name of (process.env.BROWSER_ENGINES||'chromium,firefox,webkit').split(',')){
 const browser=await pw[name].launch({headless:true,...(name==='chromium'&&process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{})});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[],requests=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/^https?:/.test(r.url()))requests.push(r.url());});
  await page.clock.install();await page.clock.pauseAt(new Date(Date.now()+1000));await page.goto(url('spiele/'+data.id+'/index.html'));
  assert.equal(await page.locator('#finalSeconds').inputValue(),'5');
  for(const value of ['4','601','5.5']){await page.locator('#finalSeconds').fill(value);await page.locator('#startBtn').click();assert.equal(await page.locator('#startBtn').count(),1,'Invalid time cannot start a game');}
  await page.locator('#finalSeconds').fill('9');await page.locator('#startBtn').click();await mainRound(page);
  assert.deepEqual(await page.locator('.final-qcount').allTextContents(),['18Fragen','18Fragen']);
  assert.equal(await page.locator('#finalSeconds').inputValue(),'9');
  await page.locator('#finalSeconds').fill('7');await page.locator('#startFinal').click();
  const seen=new Set();
  for(let i=0;i<36;i++){
   await page.locator('#goFinal').click();assert.equal(await page.locator('#timerNum').innerText(),'7');
   const question=await page.locator('.final-question').innerText();
   const math=await page.locator('math').count()?await page.locator('math').getAttribute('aria-label'):null;
   assert.ok(!seen.has(question+math),'No repeated final questions');seen.add(question+math);
   assert.equal(await page.locator('#judgeRight').count(),0);
   if(i===0){
    await page.clock.runFor(2000);
    await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});
    await page.clock.runFor(20000);assert.equal(await page.locator('#judgeRight').count(),0,'Background tab pauses timer');
    await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:false});document.dispatchEvent(new Event('visibilitychange'));});
    await page.clock.runFor(4999);assert.equal(await page.locator('#judgeRight').count(),0);await page.clock.runFor(101);
   }
   else await page.locator('#stopFinal').click();
   assert.equal(await page.locator('#judgeRight').count(),1);await page.clock.runFor(500);await page.locator('#judgeRight').click();
  }
  assert.equal(await page.locator('#revealTie').count(),1);assert.equal(await page.locator('#teamTie').count(),0);
  await page.locator('#revealTie').click();await page.locator('#drawTie').click();assert.match(await page.locator('.winner-big').innerText(),/Unentschieden/);
  await page.locator('#againBtn').click();await mainRound(page,false);await page.locator('#startFinal').click();
  assert.equal(await page.locator('#revealTie').count(),1,'0:0 skips both empty final turns');
  await page.locator('#revealTie').click();await page.locator('#teamTie').click();assert.match(await page.locator('.winner-big').innerText(),/Sieg/);
  await page.locator('#setupBtn').click();assert.equal(await page.locator('#finalSeconds').inputValue(),'7');
  // Both offline creator downloads use the same templates and validators.
  for(const game of [require('../content/mathematik-klasse-5.json'),data]){
   await page.goto(url('Spiel-Erstellen.html'));await page.locator('#json').fill(JSON.stringify(game));await page.locator('#build').click();
   assert.equal(await page.locator('#result.error').count(),0);
   const [download]=await Promise.all([page.waitForEvent('download'),page.locator('#download').click()]);
   const target=path.join(root,'test-results',name+'-'+game.id+'.html');await download.saveAs(target);await page.goto(pathToFileURL(target).href);
   assert.equal(await page.locator('#fatal').isVisible(),false);
   assert.ok(await page.locator(game.gameType==='quizduell'?'#startBtn':'.tile').count()>0);
  }
  // Visual review of a real long question, its options and its feedback.
  const longest=data.categories.flatMap((c,ci)=>c.questions.map((q,qi)=>({ci,qi,q}))).sort((a,b)=>(b.q.question.length+Math.max(...b.q.response.options.map(v=>v.length)))-(a.q.question.length+Math.max(...a.q.response.options.map(v=>v.length))))[0];
  let offered=false;
  for(let attempt=0;attempt<40&&!offered;attempt++){
   await page.goto(url('spiele/'+data.id+'/index.html'));await page.locator('#startBtn').click();offered=await page.locator('[data-cat="'+longest.ci+'"]').count()>0;
  }
  assert.ok(offered);await page.locator('[data-cat="'+longest.ci+'"]').click();
  for(let i=0;i<longest.qi;i++){await page.keyboard.press('1');await page.locator('.answer').first().click();await page.locator('#lockTeam').click();await page.clock.runFor(500);await page.locator('#nextQ').click();}
  for(const width of [1440,390]){await page.setViewportSize({width,height:1000});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:path.join(root,'tests/screenshots',name+'-'+data.id+'-question-'+width+'.png'),fullPage:true});}
  await page.keyboard.press('1');await page.locator('.answer').first().click();await page.locator('#lockTeam').click();await page.clock.runFor(2000);
  await page.screenshot({path:path.join(root,'tests/screenshots',name+'-'+data.id+'-feedback.png'),fullPage:true});
  // Focus, touch sizes, matrices and integrals at narrow/large widths.
  const fixture=JSON.parse(JSON.stringify(data));
  fixture.finalQuestions=fixture.finalQuestions.slice(0,37);
  fixture.categories.forEach(c=>{c.title='Mathematik · Darstellungstest';Object.assign(c.questions[0],{question:'Was ist die Determinante dieser Matrix?',questionMath:{type:'matrix',rows:[['1','2'],['3','4']]},answer:'−2',explanation:'1 · 4 − 2 · 3 = −2.',response:{type:'choice',options:['2','−2','10','−10'],correct:[1]}});Object.assign(c.questions[1],{question:'Berechne das bestimmte Integral.',questionMath:{type:'integral',lower:'0',upper:'2',integrand:'x²',variable:'x'},answer:'8/3',explanation:'Eine Stammfunktion ist x³/3. An den Grenzen ausgewertet ergibt das 8/3.',response:{type:'choice',options:['4/3','2','8/3','4'],correct:[2]}});});
  const source=fs.readFileSync(path.join(root,'spiele',data.id,'index.html'),'utf8').replace(/(<script id="game-data" type="application\/json">)[\s\S]*?(<\/script>)/,(_,a,b)=>a+JSON.stringify(fixture).replace(/</g,'\\u003c')+b);
  const file=path.join(root,'test-results',name+'-math.html');fs.writeFileSync(file,source);await page.goto(pathToFileURL(file).href);
  await page.locator('#startBtn').click();await page.locator('.cat').first().click();
  assert.equal(await page.locator('math mtr').count(),2);
  for(const width of [1440,390]){await page.setViewportSize({width,height:1000});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:path.join(root,'tests/screenshots',name+'-quizduell-matrix-'+width+'.png'),fullPage:true});}
  await page.keyboard.press('1');await page.locator('.answer').first().click();await page.locator('#lockTeam').click();await page.clock.runFor(500);await page.locator('#nextQ').click();
  assert.equal(await page.locator('math msubsup').count(),1);
  await page.clock.runFor(2000);
  await page.screenshot({path:path.join(root,'tests/screenshots',name+'-quizduell-integral.png'),fullPage:true});
  assert.ok(await page.locator('#touchOlymp').evaluate(e=>e.getBoundingClientRect().height>=52));
  assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);
  console.log(name+' '+data.id+': 18+36 Fragen, 0:0, Stichfrage, Timer, Touch, beide Downloads und Mathematik bestanden');
 }finally{await browser.close();}
}})().catch(e=>{console.error(e);process.exitCode=1;});
