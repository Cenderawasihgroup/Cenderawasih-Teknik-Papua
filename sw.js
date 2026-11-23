/* Service worker Absensi Pekerja: syarat installable + muat cepat.
   Hanya menyimpan file aplikasi sendiri. Firebase, peta, dan GPS tetap langsung ke jaringan,
   jadi data absensi selalu terbaru. Naikkan VERSION setiap kali index.html diperbarui. */
var VERSION='absensi-v1';
var SHELL=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(VERSION).then(function(c){return c.addAll(SHELL)}).then(function(){return self.skipWaiting()}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==VERSION}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}));
});
self.addEventListener('fetch',function(e){
  var r=e.request;
  if(r.method!=='GET')return;
  var u=new URL(r.url);
  if(u.origin!==location.origin)return; /* lintas-domain (Firebase, peta, CDN) tidak disentuh */
  if(r.mode==='navigate'){ /* HTML: utamakan jaringan, cadangan dari cache */
    e.respondWith(fetch(r).then(function(res){var cp=res.clone();caches.open(VERSION).then(function(c){c.put('./index.html',cp)});return res}).catch(function(){return caches.match('./index.html')}));
    return;
  }
  e.respondWith(caches.match(r).then(function(h){return h||fetch(r).then(function(res){var cp=res.clone();caches.open(VERSION).then(function(c){c.put(r,cp)});return res})}));
});
