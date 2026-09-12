'use strict';
const p=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const {settleFeedback}=require('./helpers.cjs');
const output=path.join(__dirname,'screenshots');fs.mkdirSync(output,{recursive:true});
const url=pathToFileURL(path.join(__dirname,'../spiele/mathematik-klasse-5/index.html')).href;
(async()=>{
 for(const name of ['chromium','firefox','webkit']){
  const browser=await p[name].launch({headless:true,timeout:20000,...(name==='chromium'&&process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{})});
  try{
   const context=await browser.newContext({viewport:{width:1920,height:1080},hasTouch:true});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(url);await page.locator('#settings').click();await page.locator('#add-team').click();await page.locator('#close').click();
   await page.locator('[data-question="k1-100"]').tap();await page.keyboard.type('408');await page.locator('#submit-response').dblclick();
   assert.equal(await page.locator('#feedback-view').isVisible(),true);assert.equal(await page.locator('#dialog-title').innerText(),'Nicht richtig');
   assert.equal(await page.locator('#feedback-answer').innerText(),'480 ist größer.');assert.match(await page.locator('#feedback-explanation').innerText(),/acht Zehner/);
   assert.match(await page.locator('#feedback-next-team').innerText(),/Team 2 ist jetzt dran/);assert.deepEqual(await page.locator('.score').allTextContents(),['0 P','0 P','0 P']);
   assert.equal(await page.locator('#notes').isVisible(),false);assert.equal(await page.locator('#close').isVisible(),false);
   await page.keyboard.press('r');await page.keyboard.press('h');assert.equal(await page.locator('.tile.used').count(),1);
   await page.screenshot({path:path.join(output,name+'-feedback-wrong.png'),fullPage:true,animations:'disabled'});
   // Feedback survives reload, but cannot score the same question twice.
   await page.reload();assert.equal(await page.locator('#feedback-view').isVisible(),true);assert.equal(await page.locator('.tile.used').count(),1);
   await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.id),'feedback-continue');
   await page.keyboard.press('Escape');assert.equal(await page.locator('#overlay').isVisible(),false);
   await page.locator('[data-question="k1-200"]').tap();await page.keyboard.type('472');await page.locator('#submit-response').tap();
   assert.equal(await page.locator('#dialog-title').innerText(),'Richtig!');assert.match(await page.locator('#feedback-score').innerText(),/\+200 Punkte für Team 2/);
   assert.equal(await page.locator('#feedback-review').isVisible(),false);assert.match(await page.locator('#feedback-next-team').innerText(),/Team 3/);
   assert.deepEqual(await page.locator('.score').allTextContents(),['0 P','200 P','0 P']);
   await page.screenshot({path:path.join(output,name+'-feedback-correct.png'),fullPage:true,animations:'disabled'});
   await page.waitForFunction(()=>!document.getElementById('feedback-continue').disabled);await page.keyboard.press('Enter');
   assert.equal(await page.locator('#overlay').isVisible(),false);
   // Incorrect multiple choice: learning text is visible without teacher tools.
   await page.locator('[data-question="k1-400"]').tap();await page.locator('#choices button').first().tap();await page.locator('#submit-response').tap();
   assert.match(await page.locator('#feedback-answer').innerText(),/600/);assert.match(await page.locator('#feedback-next-team').innerText(),/Team 1/);
   await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   await page.screenshot({path:path.join(output,name+'-feedback-phone.png'),fullPage:true,animations:'disabled'});
   await settleFeedback(page);
   // Manual grading uses the same learning feedback, including explanation.
   await page.locator('[data-question="k3-100"]').click();await page.locator('#reveal').click();await page.locator('#wrong').click();
   assert.match(await page.locator('#feedback-answer').innerText(),/Quadrat/);assert.match(await page.locator('#feedback-explanation').innerText(),/rechte Winkel/);await settleFeedback(page);
   // Reduced motion disables both celebration and handover animation.
   await page.emulateMedia({reducedMotion:'reduce'});await page.locator('[data-question="k3-200"]').click();await page.keyboard.type('8');await page.locator('#submit-response').click();
   assert.equal(await page.locator('.feedback-celebration').evaluate(e=>getComputedStyle(e).animationName),'none');assert.equal(await page.locator('.feedback-next').evaluate(e=>getComputedStyle(e).animationName),'none');
   await settleFeedback(page);assert.deepEqual(errors,[]);
   console.log(name+': Ergebnis-Popup, Lösung/Erklärung, drei Teams, Wiederherstellung, Tastatur und reduzierte Bewegung bestanden');
  }finally{await browser.close();}
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
