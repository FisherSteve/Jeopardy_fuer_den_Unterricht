'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const http=require('node:http');
const pw=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=path.resolve(__dirname,'..'),out=path.join(__dirname,'screenshots','music');
fs.mkdirSync(out,{recursive:true});
const html=fs.readFileSync(path.join(root,'spiele/mathematik-klasse-5/index.html'),'utf8');
const mp3=fs.readFileSync(path.join(root,'Jeopardy-theme-song.mp3'));
const serverRequests=[];
const server=http.createServer((req,res)=>{
 serverRequests.push(req.url);
 if(req.url.endsWith('.mp3')){
  if(req.url.includes('missing.mp3')){res.writeHead(404);return res.end();}
  const range=/bytes=(\d+)-(\d*)/.exec(req.headers.range||'');
  res.setHeader('Content-Type','audio/mpeg');res.setHeader('Accept-Ranges','bytes');
  if(range){const start=Number(range[1]),end=Math.min(range[2]?Number(range[2]):mp3.length-1,mp3.length-1);res.writeHead(206,{'Content-Range':'bytes '+start+'-'+end+'/'+mp3.length,'Content-Length':end-start+1});return res.end(mp3.subarray(start,end+1));}
  res.setHeader('Content-Length',mp3.length);return res.end(mp3);
 }
 res.setHeader('Content-Type','text/html; charset=utf-8');res.end(html);
});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;try{for(const name of (process.env.BROWSER_ENGINES||'chromium,firefox,webkit').split(',')){
 const browser=await pw[name].launch({headless:true,...(name==='chromium'&&process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{})});
 try{
  const page=await browser.newPage({hasTouch:true}),errors=[],requests=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('request',r=>requests.push(r.url()));
  serverRequests.length=0;
  await page.goto(base+'/Jeopardy_fuer_den_Unterricht/spiele/mathe/');
  await page.locator('#settings').tap();
  assert.equal(await page.locator('#music-enabled').isChecked(),false);
  assert.equal(await page.locator('#music').getAttribute('src'),null);
  assert.equal(serverRequests.filter(u=>u.endsWith('.mp3')).length,0);
  await page.locator('#music-enabled').click();
  await page.waitForFunction(()=>document.getElementById('music').currentTime>0);
  assert.ok(serverRequests.includes('/Jeopardy_fuer_den_Unterricht/Jeopardy-theme-song.mp3'));
  assert.equal(await page.locator('#music').evaluate(a=>a.src),base+'/Jeopardy_fuer_den_Unterricht/Jeopardy-theme-song.mp3');
  assert.equal(await page.locator('#music').evaluate(a=>a.loop),true);
  await page.locator('#music-enabled').uncheck();
  assert.equal(await page.locator('#music').evaluate(a=>a.paused),true);
  await page.locator('#music-enabled').click();
  await page.waitForFunction(()=>!document.getElementById('music').paused);
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});
  assert.equal(await page.locator('#music').evaluate(a=>a.paused),true);
  assert.equal(await page.locator('#music-enabled').isChecked(),false);
  await page.reload();await page.locator('#settings').click();
  assert.equal(await page.locator('#music').getAttribute('src'),null);
  await page.locator('#music').evaluate(a=>a.dataset.src='../../missing.mp3');await page.locator('#music-enabled').click();
  await page.waitForFunction(()=>document.getElementById('music-status').textContent.includes('nicht verfügbar')).catch(async e=>{console.log(await page.evaluate(()=>({status:document.getElementById('music-status').textContent,source:document.getElementById('music').src,error:document.getElementById('music').error?.message})),requests);throw e;});
  assert.equal(await page.locator('#music-enabled').isChecked(),false);
  await page.locator('#close').click();await page.locator('.tile').first().click();
  await page.keyboard.type('480');await page.locator('#submit-response').click();
  assert.equal(await page.locator('.tile.used').count(),1);
  await page.locator('#feedback-continue').click();
  // Permission rejection must reset the switch without affecting the game.
  await page.reload();await page.locator('#settings').click();
  await page.evaluate(()=>{document.getElementById('music').play=()=>Promise.reject(new DOMException('blocked','NotAllowedError'));});
  await page.locator('#music-enabled').click();
  await page.waitForFunction(()=>document.getElementById('music-status').textContent.includes('blockiert'));
  assert.equal(await page.locator('#music-enabled').isChecked(),false);
  // Creator output uses a sibling MP3, also when downloaded from an online creator.
  const creator=await browser.newPage();await creator.goto(pathToFileURL(path.join(root,'Spiel-Erstellen.html')).href);
  await creator.locator('#json').fill(fs.readFileSync(path.join(root,'content/mathematik-klasse-5.json'),'utf8'));
  await creator.locator('#build').click();const event=creator.waitForEvent('download');await creator.locator('#download').click();
  const target=path.join(out,name+'.html');await(await event).saveAs(target);
  assert.match(fs.readFileSync(target,'utf8'),/data-src="Jeopardy-theme-song.mp3"/);
  fs.writeFileSync(path.join(out,'Jeopardy-theme-song.mp3'),mp3);
  const local=await browser.newPage();local.on('pageerror',e=>errors.push(e.message));
  await local.goto(pathToFileURL(target).href);await local.locator('#settings').click();await local.locator('#music-enabled').click();
  await local.waitForFunction(()=>document.getElementById('music').currentTime>0);
  assert.equal(await local.locator('#music').evaluate(a=>a.src),pathToFileURL(path.join(out,'Jeopardy-theme-song.mp3')).href);
  await local.locator('#music-enabled').uncheck();
  assert.deepEqual(errors,[]);
  console.log(name+': real MP3 playback online and local, lazy loading, stop, missing file, permission failure and creator output passed');
 }finally{await browser.close();}
}}finally{await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
