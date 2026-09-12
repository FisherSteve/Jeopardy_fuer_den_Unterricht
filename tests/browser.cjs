'use strict';
// PLAYWRIGHT_MODULE may point to a bundled installation; otherwise npm install --no-save playwright.
const { chromium, firefox, webkit } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const output = path.join(__dirname, '../tests/screenshots');
fs.mkdirSync(output, {recursive:true});
const url = pathToFileURL(path.join(__dirname, '../spiele/mathematik-klasse-5/index.html')).href;
const file6 = pathToFileURL(path.join(__dirname, '../spiele/faechermix-klasse-6/index.html')).href;
const engines = process.env.BROWSER_ENGINES ? process.env.BROWSER_ENGINES.split(',') : ['chromium','firefox','webkit'];
async function teacher(page){await page.locator('#settings').click();await page.locator('#teacher-tools-enabled').check();await page.locator('#close').click();}
(async () => {
 for (const name of engines) {
  console.log('Testing '+name);
  const browser = await ({chromium,firefox,webkit}[name]).launch({headless:true,timeout:20000,...(name === 'chromium' && process.env.CHROMIUM_EXECUTABLE ? {executablePath:process.env.CHROMIUM_EXECUTABLE} : {})});
  try {
   const context = await browser.newContext({viewport:{width:1920,height:1080}});
   const page = await context.newPage(); const errors = [], requests = [];
   page.on('pageerror',e=>errors.push(e.message)); page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
   page.on('request',r=>{if(/^https?:/.test(r.url()))requests.push(r.url());});
   await page.goto(url); await page.evaluate(()=>localStorage.clear()); await page.reload();
   await teacher(page);
   assert.equal(await page.locator('.tile').count(),25); assert.match(await page.locator('#turn-banner').innerText(),/Team 1/);
   await page.screenshot({path:path.join(output,name+'-board-1920.png'),fullPage:true,animations:'disabled'});
   await page.locator('.tile').first().click(); assert.equal(await page.locator('#answer').isVisible(),false); assert.equal(await page.locator('#notes').isVisible(),false);
   await page.keyboard.press('r'); assert.equal(await page.locator('.tile.used').count(),0);
   await page.keyboard.press('h'); assert.equal(await page.locator('#notes').isVisible(),true);
   await page.keyboard.press('Escape'); assert.equal(await page.locator('.tile.used').count(),0);
   await page.locator('.tile').first().click(); assert.equal(await page.locator('#notes').isVisible(),false);
   await page.keyboard.press('a'); await page.locator('#wrong').dblclick();
   assert.equal(await page.locator('#overlay').isVisible(),false); assert.equal(await page.locator('.tile.used').count(),1);
   assert.match(await page.locator('#turn-banner').innerText(),/Team 2/); assert.deepEqual(await page.locator('.score').allTextContents(),['0 P','0 P']);
   await page.reload(); await teacher(page);await page.locator('.tile:not(:disabled)').first().click(); assert.match(await page.locator('#grade-label').innerText(),/Team 2/);
   await page.keyboard.press('a'); await page.keyboard.press('r');
   assert.equal(await page.locator('.tile.used').count(),2); assert.match(await page.locator('#turn-banner').innerText(),/Team 1/);
   assert.deepEqual(await page.locator('.score').allTextContents(),['0 P','100 P']);
   await page.locator('#undo').click(); assert.deepEqual(await page.locator('.score').allTextContents(),['0 P','0 P']); assert.match(await page.locator('#turn-banner').innerText(),/Team 2/);
   await page.locator('#undo').click(); assert.match(await page.locator('#turn-banner').innerText(),/Team 1/);
   await page.locator('#settings').click(); await page.locator('#names input').first().fill('Rot'); await page.locator('#names input').first().press('Tab');
   await page.locator('#reset-open').click(); await page.locator('#reset-cancel').click(); await page.locator('#close').click();
   await page.locator('.tile').first().click(); await page.keyboard.press('a'); await page.keyboard.press('r');
   await page.locator('#settings').click(); await page.locator('#reset-open').click(); await page.locator('#reset-confirm').click();
   assert.deepEqual(await page.locator('.score').allTextContents(),['0 P','0 P']); assert.match(await page.locator('#turn-banner').innerText(),/Rot/);
   for (const [width,height] of [[1024,768],[768,1024],[390,844],[844,390]]) {
    await page.setViewportSize({width,height});
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No horizontal page overflow');
    assert.ok(await page.locator('.tile').first().evaluate(e=>{const r=e.getBoundingClientRect();return r.width>=52 && r.height>=52;}));
    if(width===1024) assert.ok(await page.locator('#board').evaluate(e=>e.getBoundingClientRect().bottom<=innerHeight),'Tablet landscape board fits');
    await page.screenshot({path:path.join(output,name+'-board-'+width+'.png'),fullPage:true,animations:'disabled'});
    await page.locator('.tile').first().click(); await page.keyboard.press('a');
    await page.screenshot({path:path.join(output,name+'-question-'+width+'.png'),fullPage:true,animations:'disabled'});
    await page.locator('#wrong').click();
    await page.locator('#undo').click();
   }
   await page.setViewportSize({width:1280,height:800});
   await page.locator('.tile').first().click(); await page.locator('#close').focus(); await page.keyboard.press('Shift+Tab');
   assert.ok(await page.evaluate(()=>document.getElementById('dialog').contains(document.activeElement)));
   await page.keyboard.press('Escape');
   // Every wrong answer closes exactly one card: ties and all-zero scores.
   for (let i=0;i<25;i++) { await page.locator('.tile:not(:disabled)').first().click(); await page.keyboard.press('a'); await page.keyboard.press('f'); }
   assert.equal(await page.locator('.tile:disabled').count(),25); assert.match(await page.locator('#winner').innerText(),/Unentschieden/);
   await page.locator('#undo').click(); assert.equal(await page.locator('#winner').isVisible(),false);
   await page.locator('.tile:not(:disabled)').click(); await page.keyboard.press('a'); await page.keyboard.press('r'); assert.match(await page.locator('#winner').innerText(),/gewinnt/);
   // A corrupt saved state must not crash startup.
   await page.evaluate(()=>localStorage.setItem('jeopardy-v2-mathematik-klasse-5','{broken')); await page.reload(); assert.equal(await page.locator('.tile:not(:disabled)').count(),25);
   await page.goto(file6); assert.equal(await page.locator('.tile').count(),25);
   await page.locator('.tile').nth(4).click(); assert.equal(await page.locator('#notes').isVisible(),false); await page.locator('#close').click();
   // Storage failure must leave the game functional.
   const blocked = await context.newPage(); await blocked.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked');}});});
   await blocked.goto(url);await teacher(blocked); await blocked.locator('.tile').first().click(); await blocked.locator('#reveal').click(); await blocked.locator('#correct').click(); assert.equal(await blocked.locator('.tile.used').count(),1); assert.match(await blocked.locator('#status').innerText(),/Speichern nicht verfügbar/);
   // Actual touch events and reduced motion, independent of desktop mouse tests.
   const touchContext = await browser.newContext({viewport:{width:1024,height:768},hasTouch:true,reducedMotion:'reduce'});
   const touchPage = await touchContext.newPage(); await touchPage.goto(url);await teacher(touchPage); await touchPage.locator('.tile').first().tap(); await touchPage.locator('#reveal').tap(); await touchPage.locator('#correct').tap(); assert.equal(await touchPage.locator('.tile.used').count(),1);
   const selfContext=await browser.newContext({viewport:{width:1024,height:768},hasTouch:true});const self=await selfContext.newPage();await self.goto(url);
   await self.locator('#settings').click();for(let i=0;i<4;i++)await self.locator('#add-team').click();assert.equal(await self.locator('#names input').count(),6);assert.equal(await self.locator('#add-team').isDisabled(),true);
   for(let i=0;i<3;i++)await self.locator('#remove-team').click();await self.locator('#close').click();await self.reload();assert.equal(await self.locator('.team').count(),3);
   await self.locator('[data-question="k1-100"]').tap();assert.equal(await self.locator('#submit-response').isDisabled(),true);
   assert.equal(await self.locator('#notes-toggle').isVisible(),false);assert.equal(await self.locator('#reveal').isVisible(),false);await self.keyboard.press('a');await self.keyboard.press('h');assert.equal(await self.locator('#answer').isVisible(),false);assert.equal(await self.locator('#notes').isVisible(),false);
   await self.screenshot({path:path.join(output,name+'-numpad.png'),fullPage:true,animations:'disabled'});
   for(const digit of ['4','8','0'])await self.locator('#numpad').getByRole('button',{name:digit,exact:true}).tap();await self.locator('#submit-response').tap();assert.deepEqual(await self.locator('.score').allTextContents(),['100 P','0 P','0 P']);assert.match(await self.locator('#turn-banner').innerText(),/Team 2/);
   await self.locator('[data-question="k1-400"]').tap();await self.locator('#choices').getByRole('button',{name:'Näher bei 600',exact:true}).tap();assert.equal(await self.locator('#overlay').isVisible(),true);
   await self.screenshot({path:path.join(output,name+'-choice.png'),fullPage:true,animations:'disabled'});
   await self.locator('#submit-response').tap();assert.deepEqual(await self.locator('.score').allTextContents(),['100 P','400 P','0 P']);assert.match(await self.locator('#turn-banner').innerText(),/Team 3/);
   await self.locator('[data-question="k1-200"]').tap();await self.keyboard.type('999');await self.locator('#submit-response').tap();assert.match(await self.locator('#turn-banner').innerText(),/Team 1/);assert.deepEqual(await self.locator('.score').allTextContents(),['100 P','400 P','0 P']);
   await self.locator('#settings').click();assert.equal(await self.locator('#add-team').isDisabled(),true);await self.locator('#reset-open').click();await self.locator('#reset-confirm').click();assert.equal(await self.locator('.team').count(),3);assert.deepEqual(await self.locator('.score').allTextContents(),['0 P','0 P','0 P']);
   await selfContext.close();
   const html=fs.readFileSync(path.join(__dirname,'../spiele/mathematik-klasse-5/index.html'),'utf8');
   for(let n=1;n<=5;n++) {
    const d=JSON.parse(fs.readFileSync(path.join(__dirname,'../content/mathematik-klasse-5.json'),'utf8')); d.categories=d.categories.slice(0,n); d.id='test-'+n;d.categories.forEach(c=>c.questions.forEach(q=>delete q.response));
    const themed=html.replace(/(<script id="game-data" type="application\/json">)[\s\S]*?(<\/script>)/,(_,a,b)=>a+JSON.stringify(d)+b);
    const temp=await context.newPage(); await temp.setContent(themed);
    assert.equal(await temp.locator('.category').count(),n); assert.equal(await temp.locator('.tile').count(),5*n);
    for(let i=0;i<(n===1?5:1);i++){await temp.locator('.tile:not(:disabled)').first().click();await temp.locator('#reveal').click();await temp.locator('#wrong').click();}
    if(n===1)assert.match(await temp.locator('#winner').innerText(),/Unentschieden/);else assert.equal(await temp.locator('#winner').isVisible(),false);await temp.close();
   }
   const creator=await context.newPage();await creator.goto(pathToFileURL(path.join(__dirname,'../Spiel-Erstellen.html')).href);
   await creator.locator('#json').fill('{broken');await creator.locator('#build').click();assert.equal(await creator.locator('#download').isVisible(),false);assert.match(await creator.locator('#result').innerText(),/Noch kein Spiel/);
   await creator.locator('#file').setInputFiles(path.join(__dirname,'../content/mathematik-klasse-5.json'));await creator.waitForFunction(()=>document.getElementById('json').value.includes('schemaVersion'));
   const imported=JSON.parse(await creator.locator('#json').inputValue());imported.id='creator-'+name;imported.categories[0].questions[0].question='Text bleibt Text: </script><img src=x onerror=alert(1)>';
   await creator.locator('#json').fill('```json\n'+JSON.stringify(imported)+'\n```');await creator.locator('#build').click();assert.equal(await creator.locator('#download').isVisible(),true);
   const downloadPromise=creator.waitForEvent('download');await creator.locator('#download').click();const download=await downloadPromise;
   const builtPath=path.join(output,name+'-creator-game.html');await download.saveAs(builtPath);const built=fs.readFileSync(builtPath,'utf8');assert.ok(built.includes('\\u003c/script>'));
   const made=await context.newPage();await made.goto(pathToFileURL(builtPath).href);assert.equal(await made.locator('.tile').count(),25);await made.locator('.tile').first().click();assert.equal(await made.locator('#dialog-title').innerText(),imported.categories[0].questions[0].question);assert.equal(await made.locator('#notes-toggle').isVisible(),false);
   await creator.setViewportSize({width:390,height:844});assert.ok(await creator.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   await creator.screenshot({path:path.join(output,name+'-creator.png'),fullPage:true,animations:'disabled'});
   assert.deepEqual(requests,[]); assert.deepEqual(errors,[]); console.log(name+': all browser checks passed');
  } finally { await browser.close(); }
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
