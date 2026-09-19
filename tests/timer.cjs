'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{pathToFileURL}=require('node:url');
const pw=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{for(const name of ['chromium','firefox','webkit']){
 const browser=await pw[name].launch({headless:true,...(name==='chromium'&&process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{})});
 try{
 const page=await browser.newPage({viewport:{width:1024,height:768},hasTouch:true}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.clock.install();await page.goto(pathToFileURL(path.resolve(__dirname,'../spiele/mathematik-klasse-5/index.html')).href);
 await page.locator('.tile').first().tap();assert.equal(await page.locator('#question-timer').isVisible(),false);await page.locator('#close').click();
 await page.locator('#settings').tap();assert.equal(await page.locator('#timer-enabled').isChecked(),false);
 await page.locator('#timer-enabled').check();await page.locator('#timer-auto-wrong').uncheck();await page.locator('#teacher-tools-enabled').check();
 for(const [p,v] of [[100,30],[200,45],[300,60],[400,90],[500,120]])assert.equal(await page.locator('#timer-'+p).inputValue(),String(v));
 await page.locator('#close').click();
 for(const [p,v] of [[100,30],[200,45],[300,60],[400,90],[500,120]]){
 await page.locator('[data-question="k1-'+p+'"]').click();assert.match(await page.locator('#timer-value').innerText(),new RegExp('^'+v+' s'));await page.locator('#close').click();
 }
 await page.locator('[data-question="k1-100"]').click();await page.clock.runFor(2100);assert.match(await page.locator('#timer-value').innerText(),/^28 s/);
 await page.keyboard.press('h');const paused=await page.locator('#timer-value').innerText();assert.match(paused,/pausiert/);await page.clock.runFor(10000);assert.equal(await page.locator('#timer-value').innerText(),paused);
 await page.keyboard.press('h');await page.clock.runFor(1100);assert.match(await page.locator('#timer-value').innerText(),/^27 s/);
 await page.keyboard.press('a');const stopped=await page.locator('#timer-value').innerText();assert.match(stopped,/gestoppt/);await page.clock.runFor(60000);assert.equal(await page.locator('#timer-value').innerText(),stopped);
 await page.keyboard.press('a');await page.keyboard.press('h');await page.keyboard.press('h');await page.clock.runFor(2000);assert.equal(await page.locator('#timer-value').innerText(),stopped);await page.locator('#close').click();
 await page.locator('#settings').click();await page.locator('#timer-100').fill('5');await page.locator('#timer-100').press('Tab');
 for(const value of ['0','601','5.5','']){await page.locator('#timer-200').fill(value);await page.locator('#timer-200').press('Tab');assert.equal(await page.locator('#timer-200').inputValue(),'45');}
 await page.locator('#close').click();await page.reload();await page.locator('#settings').click();assert.equal(await page.locator('#timer-enabled').isChecked(),true);assert.equal(await page.locator('#timer-100').inputValue(),'5');await page.locator('#close').click();
 await page.locator('[data-question="k1-100"]').click();await page.clock.runFor(5100);assert.equal(await page.locator('#timer-value').innerText(),'Zeit abgelaufen');assert.equal(await page.locator('.tile.used').count(),0);
 await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 fs.mkdirSync(path.join(__dirname,'screenshots'),{recursive:true});await page.screenshot({path:path.join(__dirname,'screenshots',name+'-timer-expired.png')});
 await page.keyboard.type('480');await page.locator('#submit-response').click();assert.equal(await page.locator('.tile.used').count(),1);await page.clock.runFor(500);await page.locator('#feedback-continue').click();
 await page.locator('#settings').click();await page.locator('#reset-open').click();await page.locator('#reset-confirm').click();await page.locator('#settings').click();assert.equal(await page.locator('#timer-100').inputValue(),'5');
 await page.screenshot({path:path.join(__dirname,'screenshots',name+'-timer-menu.png')});
 await page.locator('#timer-enabled').uncheck();await page.locator('#close').click();await page.locator('.tile').first().click();assert.equal(await page.locator('#question-timer').isVisible(),false);assert.deepEqual(errors,[]);
 const auto=await browser.newPage();await auto.clock.install();await auto.goto(pathToFileURL(path.resolve(__dirname,'../spiele/mathematik-klasse-5/index.html')).href);
 await auto.locator('#settings').click();assert.equal(await auto.locator('#timer-auto-wrong').isChecked(),true);assert.equal(await auto.locator('#timer-auto-wrong').isDisabled(),true);
 await auto.locator('#timer-enabled').check();for(const p of [100,200,300,400,500]){await auto.locator('#timer-'+p).fill('5');await auto.locator('#timer-'+p).press('Tab');}await auto.locator('#close').click();
 const manual=await auto.evaluate(()=>JSON.parse(document.getElementById('game-data').textContent).categories.flatMap(c=>c.questions).find(q=>!q.response||q.response.type==='manual').id);
 let count=0;for(const id of ['k1-100','k1-400',manual]){
 await auto.locator('[data-question="'+id+'"]').click();await auto.clock.runFor(5100);count++;
 assert.equal(await auto.locator('.tile.used').count(),count);assert.equal(await auto.locator('#dialog-title').innerText(),'Nicht richtig');assert.equal(await auto.locator('#feedback-review').isVisible(),true);assert.ok((await auto.locator('#feedback-explanation').innerText()).length>0);
 assert.deepEqual(await auto.locator('.score').allTextContents(),['0 P','0 P']);await auto.clock.runFor(20000);assert.equal(await auto.locator('.tile.used').count(),count);
 await auto.locator('#feedback-continue').click();assert.match(await auto.locator('#turn-banner').innerText(),new RegExp('Team '+(count%2+1)));
 }
 await auto.locator('#undo').click();assert.equal(await auto.locator('.tile.used').count(),2);
 await auto.reload();await auto.locator('#settings').click();assert.equal(await auto.locator('#timer-auto-wrong').isChecked(),true);await auto.locator('#timer-auto-wrong').uncheck();await auto.locator('#close').click();await auto.reload();await auto.locator('#settings').click();assert.equal(await auto.locator('#timer-auto-wrong').isChecked(),false);
 await auto.locator('#reset-open').click();await auto.locator('#reset-confirm').click();await auto.locator('#settings').click();assert.equal(await auto.locator('#timer-auto-wrong').isChecked(),false);
 await auto.close();
 console.log(name+': timer defaults, all values, hints pause/resume, reveal stop, expiry without grading, validation, persistence, reset and mobile passed');
 }finally{await browser.close();}
}})().catch(e=>{console.error(e);process.exitCode=1;});
