// Service worker D'CELL PRINT: cache halaman & ikon agar bisa dibuka tanpa internet.
// Naikkan angka VERSI setiap kali index.html diganti supaya pembaruan terpasang.
const VERSI='dcell-v28',FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./maskable-512.png','./apple-touch-icon.png','./bg.jpg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSI).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==VERSI&&n!=='dcell-share').map(n=>caches.delete(n)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const r=e.request;
 if(r.method==='POST'&&new URL(r.url).pathname.endsWith('/share-target')){e.respondWith((async()=>{try{const fd=await r.formData(),f=fd.get('image');if(f&&f.size){const c=await caches.open('dcell-share');await c.put('./shared-image',new Response(f,{headers:{'Content-Type':f.type||'image/png'}}))}}catch(x){}return Response.redirect(new URL('./?shared=1',self.registration.scope).href,303)})());return}
if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
 e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(VERSI).then(c=>c.put(r,cp));return res}).catch(()=>caches.match(r).then(m=>m||caches.match('./index.html'))));
});
