'use strict';
const p=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict'),path=require('node:path');
const {pathToFileURL}=require('node:url'),{settleFeedback}=require('./helpers.cjs');
// Independently reviewed expected answers in category order.
const answers=[[1],[0],[2],[1],[0],[2],[1],[0],[2],[1],12,7,8,15,36,[1],[0],[2],[0],[1],[2],[1],1989,[0],9];
(async()=>{for(const name of ['chromium','firefox','webkit']){
 const browser=await p[name].launch({headless:true,...(name==='chromium'&&process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{})});
 try{const page=await browser.newPage({viewport:{width:1920,height:1080},hasTouch:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(pathToFileURL(path.resolve(__dirname,'../spiele/klasse-10-start-meme-wissen/index.html')).href);
 assert.equal(await page.locator('.category').count(),5);assert.equal(await page.locator('.tile').count(),25);
 await page.screenshot({path:path.join(__dirname,'screenshots',name+'-klasse10-start.png')});
 for(let i=0;i<answers.length;i++){
  await page.locator('[data-question="k'+(Math.floor(i/5)+1)+'-'+((i%5+1)*100)+'"]').tap();
  if(i===19||i===23){await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(__dirname,'screenshots',name+'-klasse10-long-'+i+'.png'),fullPage:true,animations:'disabled'});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.setViewportSize({width:1920,height:1080});}
  const v=answers[i];if(Array.isArray(v))await page.locator('#choices button').nth(v[0]).tap();else await page.keyboard.type(String(v).replace('.',','));
  await page.locator('#submit-response').tap();assert.equal(await page.locator('#dialog-title').innerText(),'Richtig!');await settleFeedback(page);
 }
 assert.equal(await page.locator('.tile.used').count(),25);assert.deepEqual(await page.locator('.score').allTextContents(),['3900 P','3600 P']);assert.equal(await page.locator('#winner').isVisible(),true);await page.locator('#settings').click();await page.locator('#reset-open').click();await page.locator('#reset-confirm').click();await page.setViewportSize({width:390,height:844});await page.locator('[data-question="k2-500"]').click();await page.locator('#choices button').first().click();await page.locator('#submit-response').click();assert.equal(await page.locator('#dialog-title').innerText(),'Nicht richtig');assert.match(await page.locator('#feedback-answer').innerText(),/Teilnehmenden/);assert.match(await page.locator('#feedback-explanation').innerText(),/freiwillig/);await page.screenshot({path:path.join(__dirname,'screenshots',name+'-klasse10-feedback.png'),fullPage:true,animations:'disabled'});await settleFeedback(page);assert.deepEqual(await page.locator('.score').allTextContents(),['0 P','0 P']);assert.match(await page.locator('#turn-banner').innerText(),/Team 2/);assert.deepEqual(errors,[]);
 console.log(name+': Klasse 10 Start, alle 25 Antworten, fünf Rubriken, Teamfolge und Spielende bestanden');
 }finally{await browser.close();}
}})().catch(e=>{console.error(e);process.exitCode=1;});
