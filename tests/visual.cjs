'use strict';
const p=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
(async()=>{
 for(const name of ['chromium','firefox','webkit']){
  const browser=await p[name].launch({headless:true,timeout:20000,...(name==='chromium'&&process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{})});
  try{
   const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true});const page=await context.newPage();
   await page.goto(pathToFileURL(path.join(__dirname,'../spiele/mathematik-klasse-5.html')).href);
   await page.locator('.tile').first().tap();assert.equal(await page.locator('#notes-toggle').isVisible(),false);assert.equal(await page.locator('#reveal').isVisible(),false);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   await page.screenshot({path:path.join(__dirname,'screenshots',name+'-numpad-phone.png'),fullPage:true,animations:'disabled'});
   const data=JSON.parse(fs.readFileSync(path.join(__dirname,'../content/mathematik-klasse-5.json'),'utf8'));data.categories=data.categories.slice(0,1);data.categories[0].questions.forEach(q=>delete q.response);
   const html=fs.readFileSync(path.join(__dirname,'../spiele/mathematik-klasse-5.html'),'utf8').replace(/(<script id="game-data" type="application\/json">)[\s\S]*?(<\/script>)/,(_,a,b)=>a+JSON.stringify(data)+b);
   const game=await context.newPage();await game.setContent(html);
   for(let i=0;i<5;i++){await game.locator('.tile:not(:disabled)').first().click();await game.locator('#reveal').click();await game.locator('#wrong').click();}
   assert.equal(await game.evaluate(()=>document.activeElement.id),'winner');
   assert.ok(await game.locator('#winner').evaluate(e=>{const r=e.getBoundingClientRect();return r.top<innerHeight&&r.bottom>0;}));
   await game.screenshot({path:path.join(__dirname,'screenshots',name+'-finish-phone.png'),fullPage:true,animations:'disabled'});
   console.log(name+' '+browser.version()+': final mobile layout and game-end focus passed');
  }finally{await browser.close();}
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
