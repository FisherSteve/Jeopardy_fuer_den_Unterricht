'use strict';
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const playwright=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=path.resolve(__dirname,'..'),prefix='/Jeopardy_fuer_den_Unterricht/';
fs.mkdirSync(path.join(root,'tests/screenshots'),{recursive:true});
const games=fs.readdirSync(path.join(root,'spiele'),{withFileTypes:true}).filter(e=>e.isDirectory()&&fs.existsSync(path.join(root,'spiele',e.name,'index.html')));
assert.ok(games.length>0);
assert.equal(fs.readdirSync(path.join(root,'spiele')).filter(n=>n.endsWith('.html')).length,0,'Keine flachen Spiel-Dateien');
const server=http.createServer((req,res)=>{
  try {
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if(!pathname.startsWith(prefix)){res.writeHead(404);return res.end();}
    let file=path.resolve(root,pathname.slice(prefix.length));
    const relative=path.relative(root,file);
    if(relative.startsWith('..')||path.isAbsolute(relative)){res.writeHead(403);return res.end();}
    if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');
    res.setHeader('Content-Type',file.endsWith('.html')?'text/html; charset=utf-8':'text/plain; charset=utf-8');res.end(fs.readFileSync(file));
  }catch(_){res.writeHead(404);res.end();}
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base='http://127.0.0.1:'+server.address().port+prefix;
 try{
  for(const name of ['chromium','firefox','webkit']){
   const browser=await playwright[name].launch({headless:true,timeout:20000,...(name==='chromium'&&process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{})});
   try{
    const page=await browser.newPage({viewport:{width:1024,height:768}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
    assert.equal((await page.goto(base)).status(),200);
    const links=await page.locator('#games a').evaluateAll(nodes=>nodes.map(n=>n.href));assert.equal(links.length,games.length);
    for(const game of games){assert.ok(links.includes(base+'spiele/'+game.name+'/index.html'));}
    const localLinks=await page.locator('a').evaluateAll(nodes=>nodes.map(n=>n.href).filter(url=>url.startsWith(location.origin)));
    for(const url of localLinks)assert.equal((await page.request.get(url)).status(),200,url);
    for(const url of links){
      await page.goto(base);await page.locator('#games a').filter({hasText:await page.locator('#games a').evaluateAll((nodes,url)=>nodes.find(n=>n.href===url).textContent,url)}).click();
      assert.equal(page.url(),url);assert.equal(await page.locator('#fatal').isVisible(),false);assert.ok(await page.locator('.tile').count()>0);
      await page.locator('.tile').first().click();assert.equal(await page.locator('#overlay').isVisible(),true);await page.locator('#close').click();
      assert.equal((await page.goto(url.replace(/index\.html$/,''))).status(),200,'Verzeichnis-URL funktioniert');
    }
    await page.goto(base);await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await page.screenshot({path:path.join(root,'tests/screenshots',name+'-pages-home.png'),fullPage:true});
    assert.deepEqual(errors,[]);console.log(name+': Startseite, '+games.length+' Spiele, Verzeichnis-URLs und relative Links unter Repository-Unterpfad bestanden');
   }finally{await browser.close();}
  }
 }finally{await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e);process.exitCode=1;server.close();});
