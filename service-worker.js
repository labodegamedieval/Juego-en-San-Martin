self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("aventura-gonzalo-v1").then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "/styles/style.css",
        "/scripts/script.js",
        "/sounds/musica-medieval.mp3",
        "/images/portada.jpg",
        "/images/icon-192.png",
        "/images/icon-512.png"
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
