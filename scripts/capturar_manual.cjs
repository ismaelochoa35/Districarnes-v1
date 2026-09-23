const fs=require('fs');
const path=require('path');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const out=path.join(root,'output','manual_visual');
const specs=JSON.parse(fs.readFileSync(path.join(out,'capturas.json'),'utf8'));
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
(async()=>{
const candidates=['C:/Program Files/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe','C:/Program Files/Microsoft/Edge/Application/msedge.exe'];
const browser=await chromium.launch({headless:true,executablePath:candidates.find(p=>fs.existsSync(p))});
const page=await browser.newPage({viewport:{width:1320,height:1000},deviceScaleFactor:1.5});
for(const s of specs){
 const rows=s.lines.map((line,i)=>`<div class="row"><span class="num">${s.start+i}</span><code>${esc(line)||' '}</code></div>`).join('');
 await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;background:#fff;padding:16px;font-family:Arial}.frame{border:2px solid #dadde4;border-radius:14px;overflow:hidden;background:#f8f9fb}.top{background:#273342;color:white;padding:18px 24px;font-size:21px;display:flex;justify-content:space-between}.tag{color:#bfcddb;font-size:17px}.code{padding:18px 0}.row{display:flex;align-items:baseline;min-height:30px;line-height:30px;font-size:21px}.num{width:76px;flex:none;text-align:right;padding-right:20px;color:#9a6671;user-select:none}code{font-family:Consolas,monospace;white-space:pre-wrap;overflow-wrap:anywhere;padding-right:16px;color:#1e354b;flex:1;min-width:0}.row:nth-child(even){background:#f0f2f5}</style></head><body><div class="frame"><div class="top"><span>${esc(s.path)}</span><span class="tag">CÓDIGO ORIGINAL</span></div><div class="code">${rows}</div></div></body></html>`);
 await page.locator('.frame').screenshot({path:path.join(out,'capturas',s.key+'.png')});
}
await browser.close();console.log(`${specs.length} capturas guardadas`);
})();
