'use strict';
const p=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url'),path=require('node:path');
const {settleFeedback}=require('./helpers.cjs');
(async()=>{for(const name of ['chromium','firefox','webkit']){
 const browser=await p[name].launch({headless:true,...(name==='chromium'&&process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{})});
 try{const page=await browser.newPage({viewport:{width:1280,height:900}});
 await page.goto(pathToFileURL(path.resolve(__dirname,'../spiele/mathematik-klasse-5/index.html')).href);
 await page.locator('#settings').click();assert.equal(await page.locator('#subtract-on-wrong').isChecked(),false);assert.equal(await page.locator('#allow-negative-scores').isDisabled(),true);
 await page.locator('#subtract-on-wrong').check();assert.equal(await page.locator('#allow-negative-scores').isChecked(),false);await page.locator('#close').click();
 async function answer(id,value){await page.locator('[data-question="'+id+'"]').click();await page.keyboard.type(value);await page.locator('#submit-response').click();}
 await answer('k1-100','480');await settleFeedback(page);await answer('k1-200','0');await settleFeedback(page);await answer('k1-300','0');
 assert.equal(await page.locator('#feedback-score').innerText(),'−100 Punkte für Team 1');assert.deepEqual(await page.locator('.score').allTextContents(),['0 P','0 P']);
 await page.reload();assert.equal(await page.locator('#feedback-score').innerText(),'−100 Punkte für Team 1');await settleFeedback(page);
 await page.locator('#settings').click();assert.equal(await page.locator('#subtract-on-wrong').isDisabled(),true);await page.locator('#reset-open').click();await page.locator('#reset-confirm').click();
 await page.locator('#settings').click();assert.equal(await page.locator('#subtract-on-wrong').isChecked(),true);await page.locator('#allow-negative-scores').check();await page.locator('#close').click();await page.reload();
 await answer('k1-100','0');assert.equal(await page.locator('#feedback-score').innerText(),'−100 Punkte für Team 1');assert.deepEqual(await page.locator('.score').allTextContents(),['-100 P','0 P']);await settleFeedback(page);
 await page.locator('#undo').click();assert.deepEqual(await page.locator('.score').allTextContents(),['0 P','0 P']);
 await page.locator('#settings').click();await page.locator('#subtract-on-wrong').uncheck();assert.equal(await page.locator('#allow-negative-scores').isDisabled(),true);await page.screenshot({path:path.join(__dirname,'screenshots',name+'-scoring-menu.png'),fullPage:true});await page.locator('#close').click();
 await answer('k1-100','0');assert.equal(await page.locator('#feedback-score').innerText(),'0 Punkte für Team 1');assert.doesNotMatch(await page.locator('#feedback-view').innerText(),/Minuspunkte|Kein Punktabzug/);
 console.log(name+': Standard, Untergrenze, negative Werte, Reset, Undo und Wiederherstellung bestanden');
 }finally{await browser.close();}
}})().catch(e=>{console.error(e);process.exitCode=1;});
