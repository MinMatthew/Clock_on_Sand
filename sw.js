const CACHE_NAME = 'clock-on-sand-v1';
const urlsToCache = [
  '/Clock_on_Sand/',
  '/Clock_on_Sand/index.html',
  '/Clock_on_Sand/icon.png',
  '/Clock_on_Sand/manifest.json',
  '/Clock_on_Sand/videos/IMG_4231.mp4',
  '/Clock_on_Sand/videos/0.mp4',
  '/Clock_on_Sand/videos/1.mp4',
  '/Clock_on_Sand/videos/2.mp4',
  '/Clock_on_Sand/videos/3.mp4',
  '/Clock_on_Sand/videos/4.mp4',
  '/Clock_on_Sand/videos/5.mp4',
  '/Clock_on_Sand/videos/6.mp4',
  '/Clock_on_Sand/videos/7.mp4',
  '/Clock_on_Sand/videos/8.mp4',
  '/Clock_on_Sand/videos/9.mp4'
];

// 서비스 워커 설치 및 캐시
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
  );
});

// 네트워크 요청 가로채기
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 캐시에서 찾았으면 반환
        if (response) {
          return response;
        }
        
        // 캐시에 없으면 네트워크에서 가져오기
        return fetch(event.request)
          .then(response => {
            // 유효한 응답이 아니면 그냥 반환
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // 응답을 복제하여 캐시에 저장
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          });
      })
  );
});

// 이전 캐시 정리
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
