// 定義快取名稱和需要快取的檔案
const CACHE_NAME = 'sustainable-quiz-pwa-v2'; // 更新版本號以觸發更新
const urlsToCache = [
  '/',
  '/index.html',
  // 注意：您的 CSS 和 JS 是寫在 HTML 裡的，所以不用快取外部檔案
  // 如果您有外部 CSS/JS，也要加進來
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// 1. 安裝 Service Worker
// 當 PWA 被安裝時觸發，開啟快取並將檔案存入
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. 啟用 Service Worker 並清理舊快取
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

// 3. 攔截網路請求
// 當 App 發出任何請求 (如載入頁面、圖片) 時觸發
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果快取中有對應的檔案，就直接從快取回傳
        if (response) {
          return response;
        }
        // 如果快取中沒有，才向網路發出請求
        return fetch(event.request);
      }
    )
  );
});
