'use strict';
const p=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict'),path=require('node:path');
const {pathToFileURL}=require('node:url'),{settleFeedback}=require('./helpers.cjs');
// Independently reviewed expected answers in category order.
const answers=[5,12,1.5,5,[1],6,9,12,11,11,8,30,30,6,99,70,18,20,30,18,50,50,30,5,[2]];
(async()=>{for(const name of ['chromium','firefox','webkit']){
 const browser=await p[name].launch({headless:true,...(name==='chromium'&&process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{})});
 try{const page=await browser.newPage({viewport:{width:1920,height:1080},hasTouch:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(pathToFileURL(path.resolve(__dirname,'../spiele/mathematik-klasse-8-nrw/index.html')).href);
 assert.equal(await page.locator('.category').count(),5);assert.equal(await page.locator('.tile').count(),25);
 await page.screenshot({path:path.join(__dirname,'screenshots',name+'-klasse8.png')});
 for(let i=0;i<answers.length;i++){
  await page.locator('[data-question="k'+(Math.floor(i/5)+1)+'-'+((i%5+1)*100)+'"]').tap();
  const v=answers[i];if(Array.isArray(v))await page.locator('#choices button').nth(v[0]).tap();else await page.keyboard.type(String(v).replace('.',','));
  await page.locator('#submit-response').tap();assert.equal(await page.locator('#dialog-title').innerText(),'Richtig!');await settleFeedback(page);
 }
 assert.equal(await page.locator('.tile.used').count(),25);assert.deepEqual(await page.locator('.score').allTextContents(),['3900 P','3600 P']);assert.equal(await page.locator('#winner').isVisible(),true);assert.deepEqual(errors,[]);
 console.log(name+': Klasse 8, alle 25 Antworten, fünf Rubriken, Teamfolge und Spielende bestanden');
 }finally{await browser.close();}
}})().catch(e=>{console.error(e);process.exitCode=1;});
