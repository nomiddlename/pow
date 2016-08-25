var cacheName = 'pow-v14';
var filesToCache = [
  "/bower_components/bootstrap/dist/css/bootstrap.min.css",
  "/bower_components/bootstrap/dist/css/bootstrap-theme.min.css",
  "/bower_components/jquery/dist/jquery.min.js",
  "/bower_components/bootstrap/dist/js/bootstrap.min.js",
  "/bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2",
  "/bower_components/handlebars/handlebars.min.js",
  "/js/index.js",
  "/data/speakers.json",
  "/speakers.html",
  "/programme.html",
  "/venue.html",
  "/index.html"
];

self.addEventListener('install', function(e) {
  console.log('Holy Service Worker install, Batman.');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('Initialising bat-cache ', cacheName);
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('Bring the bat-service-worker online, Boy Wonder');
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(
          k => k !== cacheName
        ).map(
          k => caches.delete(k)
        )
      );
    })
  );
});

self.addEventListener('fetch', function(e) {
  console.log('Bat-request is ', e.request);
  e.respondWith(
    caches.open(cacheName).then(cache => {
      return cache.match(e.request).then(response => {
        if (response) {
          console.log('Serving request from bat-cache');
        }
        return response || fetch(e.request);
      });
    })
  );
});
