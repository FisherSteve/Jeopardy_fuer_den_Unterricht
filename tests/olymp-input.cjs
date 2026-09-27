'use strict';
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
const {pathToFileURL}=require('node:url');
const pw=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=path.resolve(__dirname,'..');
const url=pathToFileURL(path.join(root,'spiele/quizduell-mathematik-ende-klasse-8-nrw/index.html')).href;
const style=el=>{const s=getComputedStyle(el);return {background:s.background,border:s.border,transform:s.transform,filter:s.filter,outline:s.outlineStyle,tap:s.webkitTapHighlightColor};};
(async()=>{for(const name of (process.env.BROWSER_ENGINES||'chromium,firefox,webkit').split(',')){
 const browser=await pw[name].launch({headless:true,...(name==='chromium'&&process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{})});
 try{
  const context=await browser.newContext({viewport:{width:1024,height:768},hasTouch:true,reducedMotion:'no-preference'});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.clock.install();await page.clock.pauseAt(new Date(Date.now()+1000));
  async function question(){await page.goto(url);await page.locator('#startBtn').click();await page.locator('.cat').first().click();}
  let expectedSequence;
  for(let choice=0;choice<4;choice++){
   await question();
   const originalOptions=await page.locator('.answer .txt').allTextContents();
   const teamMarkup=await page.locator('.answers').innerHTML();
   await page.locator('#touchOlymp').tap();
   assert.equal(await page.locator('#secretTitle').evaluate(e=>e===document.activeElement),true);
   const button=page.locator('[data-secret="'+choice+'"]');
   const before=await button.evaluate(style);
   await button.hover();assert.deepEqual(await button.evaluate(style),before,'Hover does not reveal a candidate');
   await page.mouse.down();assert.deepEqual(await button.evaluate(style),before,'Pressed input has no visual reaction');
   // Fix only the animation RNG: identical randomness must give identical order for every answer.
   await page.evaluate(()=>{Math.random=()=>0.25;});
   await page.mouse.up();
   assert.equal(await page.locator('#secretDialog').isVisible(),true);
   await page.keyboard.press('4');await page.keyboard.press('Enter');await page.keyboard.press('Escape');
   assert.equal(await page.locator('#secretDialog').isVisible(),true,'Submitted dialog stays open for animation');
   assert.equal(await page.locator('#secretClose').isDisabled(),true);
   assert.equal(await page.locator('#secretTitle').evaluate(e=>e===document.activeElement),true,'No focus on submitted letter');
   const sequence=[];
   for(let step=0;step<4;step++){
    assert.equal(await page.locator('.answer:disabled').count(),4,'Input stays locked during concealment');
    assert.equal(await page.locator('.answer.selected, .answer.correct, .answer.wrong, [aria-pressed="true"]').count(),0);
    assert.equal(await page.locator('.learning-feedback').count(),0,'No solution or feedback during animation');
    assert.equal(await page.locator('#secretDialog [data-secret]:disabled').count(),4);
    assert.equal(await page.locator('.answers').innerHTML(),teamMarkup,'Team answer buttons remain entirely unchanged');
    assert.equal(await page.locator('#secretDialog [data-secret].conceal-glow').count(),1);
    sequence.push(await page.locator('#secretDialog [data-secret].conceal-glow').getAttribute('data-secret'));
    if(choice===0&&step===0){fs.mkdirSync(path.join(root,'tests/screenshots'),{recursive:true});await page.screenshot({path:path.join(root,'tests/screenshots',name+'-olymp-conceal.png'),fullPage:true});}
    await page.clock.runFor(400);
   }
   assert.deepEqual([...sequence].sort(),['0','1','2','3'],'Every letter lights once');
   if(expectedSequence)assert.deepEqual(sequence,expectedSequence,'Animation is independent of the submitted answer');
   expectedSequence=sequence;
   assert.equal(await page.locator('#secretDialog').isVisible(),false);
   assert.equal(await page.locator('[data-secret]:disabled').count(),0);
   assert.equal(await page.locator('.conceal-glow').count(),0);
   assert.equal(await page.locator('.answer:enabled').count(),4);
   assert.equal(await page.locator('#screen').evaluate(e=>e===document.activeElement),true);
   assert.deepEqual(await page.locator('.answer .txt').allTextContents(),originalOptions);
   assert.equal(await page.locator('#lockTeam').isDisabled(),true);
   await page.locator('.answer').first().tap();await page.locator('#lockTeam').tap();
   assert.ok((await page.locator('.reveal-card.righty .reveal-answer').innerText()).startsWith('ABCD'[choice]+' · '+originalOptions[choice]),'Stored Olymp answer survives animation unchanged');
  }
  // Touch submission and reduced motion: no selected flash and no waiting animation.
  await page.emulateMedia({reducedMotion:'reduce'});await question();await page.locator('#touchOlymp').tap();
  await page.locator('[data-secret="2"]').tap();
  assert.equal(await page.locator('.conceal-glow, .answer.selected').count(),0);
  assert.equal(await page.locator('.answer:enabled').count(),4);
  // Keyboard users retain a visible focus ring, can cancel, and submit without the dialog.
  await question();await page.locator('#touchOlymp').click();await page.keyboard.press('Tab');
  assert.equal(await page.locator('[data-secret="0"]').evaluate(e=>e===document.activeElement),true);
  assert.equal(await page.locator('[data-secret="0"]').evaluate(e=>getComputedStyle(e).outlineStyle),'solid');
  await page.keyboard.press('Escape');assert.equal(await page.locator('#secretDialog').isVisible(),false);
  assert.equal(await page.locator('#touchOlymp').evaluate(e=>e===document.activeElement),true);
  await page.emulateMedia({reducedMotion:'no-preference'});await page.keyboard.press('2');
  assert.equal(await page.locator('.conceal-glow').count(),0,'Keyboard outside dialog never animates team buttons');
  assert.equal(await page.locator('.answer:enabled').count(),4);
  // Touch also starts the animation; reloading cancels any pending sequence.
  await question();await page.locator('#touchOlymp').tap();await page.locator('[data-secret="1"]').tap();
  assert.equal(await page.locator('#secretDialog .conceal-glow').count(),1);
  assert.equal(await page.locator('.answer.conceal-glow').count(),0);
  await page.reload();await page.clock.runFor(2000);
  assert.equal(await page.locator('#startBtn').count(),1);assert.equal(await page.locator('.conceal-glow').count(),0);
  assert.deepEqual(errors,[]);
  console.log(name+': Olymp touch/pressed styles, independent A–D sequence, input lock, preserved answer, keyboard focus, reduced motion and reload passed');
  await context.close();
 }finally{await browser.close();}
}})().catch(e=>{console.error(e);process.exitCode=1;});
