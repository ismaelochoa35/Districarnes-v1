const fs=require('fs'),path=require('path');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),out=path.join(root,'output/manual_visual/recorrido');fs.mkdirSync(out,{recursive:true});
const categories=[{id:1,nombre:'Res'},{id:2,nombre:'Cerdo'},{id:3,nombre:'Pollo'},{id:4,nombre:'Pescado'},{id:5,nombre:'Vísceras'}];
const products=[{id:1,nombre:'Punta de Anca',tipo_corte:'Filete',categoria_id:1,categoria:'Res',precio:38000,stock:15,unidad_medida:'kg',activo:1},{id:2,nombre:'Lomo Fino',tipo_corte:'Medallón',categoria_id:1,categoria:'Res',precio:45000,stock:8,unidad_medida:'kg',activo:1},{id:3,nombre:'Costilla de Cerdo',tipo_corte:'Costilla',categoria_id:2,categoria:'Cerdo',precio:35000,stock:20,unidad_medida:'kg',activo:1}];
const sale={id:1,fecha:'2026-09-06T10:30:00',total:15200,estado:'completada',cliente:'Cliente de ejemplo',metodo_pago:'efectivo',monto_recibido:20000,cambio:4800,atendido_por:'Administrador de ejemplo',items:1,total_filtrado:15200};
const manifest=[];
(async()=>{
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const page=await browser.newPage({viewport:{width:1440,height:1040},deviceScaleFactor:1.25});
await page.route('**/*',async route=>{
 const u=new URL(route.request().url());const p=u.pathname;
 if(u.hostname!=='manual.local')return route.abort();
 if(p.startsWith('/api')){
  let data={};
  if(p==='/api/categorias')data=categories;
  else if(p==='/api/productos')data=products.filter(x=>(!u.searchParams.get('categoria')||x.categoria_id==u.searchParams.get('categoria'))&&(!u.searchParams.get('buscar')||x.nombre.toLowerCase().includes(u.searchParams.get('buscar').toLowerCase())));
  else if(p==='/api/ventas/resumen-categorias')data=categories.map(c=>({...c,total_vendido:c.id===1?15200:0,unidades_vendidas:c.id===1?.4:0}));
  else if(p==='/api/ventas')data=[sale];
  else if(p==='/api/ventas/1')data={...sale,items:[{producto_id:1,nombre:'Punta de Anca',categoria_id:1,categoria:'Res',unidad_medida:'kg',cantidad:.4,precio_unitario:38000,subtotal:15200}]};
  else if(p==='/api/administradores')data=[{id:1,nombre:'Administrador de ejemplo',email:'ejemplo@districarnes.local',activo:1,fecha_creacion:'2026-09-06T08:00:00'}];
  else if(p==='/api/login')data={token:'sesion-ilustrativa'};
  return route.fulfill({json:data});
 }
 const rel=p==='/'?'index.html':p==='/app'?'app.html':p.slice(1);
 const file=path.resolve(root,'FRONTEND',rel);
 if(!file.startsWith(path.join(root,'FRONTEND'))||!fs.existsSync(file))return route.fulfill({status:404,body:'No encontrado'});
 return route.fulfill({body:fs.readFileSync(file),contentType:({'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png'})[path.extname(file)]||'text/plain'});
});
async function shot(name,title,markers=[]){
 await page.evaluate(()=>document.querySelectorAll('.manual-marker').forEach(e=>e.remove()));
 for(let i=0;i<markers.length;i++){
  const selector=markers[i];await page.locator(selector).first().evaluate((el,n)=>{const b=el.getBoundingClientRect();const t=document.createElement('div');t.className='manual-marker';t.textContent=n;t.style.cssText=`position:fixed;left:${Math.max(0,b.left-10)}px;top:${Math.max(0,b.top-12)}px;z-index:2147483647;background:#ffda6a;color:#231b13;border:2px solid #fff;border-radius:50%;width:27px;height:27px;display:grid;place-items:center;font:bold 16px Arial;box-shadow:0 2px 5px #0005;pointer-events:none`;(el.closest('dialog[open]')||document.body).append(t)},i+1);
 }
 await page.screenshot({path:path.join(out,name+'.png')});manifest.push({name,title,path:'recorrido/'+name+'.png'});
}
await page.goto('http://manual.local/');await shot('01_acceso','Pantalla de acceso',['#email','#password','#password-confirmation','button[type=submit]']);
await page.evaluate(()=>sessionStorage.setItem('districarnes_session','sesion-ilustrativa'));await page.goto('http://manual.local/app');await page.locator('#stat-products').filter({hasText:'3'}).waitFor();
await shot('02_inicio','Inicio y navegación',['.side-nav','#stat-products','#stat-low-stock','#stat-sales','#logout']);
await page.locator('.side-nav [data-section=inventory]').click();await page.locator('#product-rows [data-edit]').first().waitFor();
await shot('03_inventario','Inventario y botones de productos',['#new-product','#search','#category-filter','#low-stock','#product-rows [data-edit]','#product-rows [data-delete]']);
await page.locator('#new-product').click();await shot('04_producto','Formulario para crear y editar',['#product-name','#product-category','#product-price','#product-stock','#product-form button[type=submit]']);await page.locator('#close-dialog').click();
await page.locator('.side-nav [data-section=sales]').click();await page.locator('[data-add-product="1"]').waitFor();await page.locator('[data-add-product="1"]').click();await page.locator('#amount-received').fill('20000');
await shot('05_venta','Nueva venta y carrito',['#sale-search','[data-add-product="1"]','[data-cart-quantity="1"]','[data-cart-unit="1"]','#payment-method','#save-sale']);
await page.locator('.side-nav [data-section=history]').click();await page.locator('[data-receipt="1"]').waitFor();
await shot('06_historial','Consulta de ventas',['#history-date-filter','#history-category-filter','#history-category-total','[data-receipt="1"]','#open-daily-report']);
await page.locator('[data-receipt="1"]').click();await page.locator('#receipt-dialog[open]').waitFor();await shot('07_recibo','Recibo de venta');await page.locator('#close-receipt').click();
await page.locator('#open-daily-report').click();await shot('08_reporte','Reporte diario');await page.locator('#close-daily-report').click();
await page.locator('.side-nav [data-section=administrators]').click();await page.locator('[data-admin-id="1"]').waitFor();await shot('09_cuentas','Administración de cuentas',['#new-administrator','[data-admin-id="1"]']);
await page.locator('#new-administrator').click();await shot('10_cuenta_nueva','Crear una cuenta');
await browser.close();fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2));console.log('10 capturas de la interfaz real con datos ilustrativos. Sin conexión a MySQL.');
})();
