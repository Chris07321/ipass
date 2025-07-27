// --- 設定 ---
// !!! 非常重要 !!!
// 請將 'sustainable-quiz-pwa' 換成你自己的 GitHub 儲存庫(Repository)名稱。
const REPO_NAME = 'sustainable-quiz-pwa';
const CACHE_NAME = `sustainable-quiz-pwa-v3`; // 將版本升級到 v3

// 組合出需要快取的完整檔案路徑
const BASE_URL = `/${REPO_NAME}/`;
const urlsToCache = [
  BASE_URL,
  `${BASE_URL}index.html`,
  `${BASE_URL}icons/icon-192x192.png`,
  `${BASE_URL}icons/icon-512x512.png`
];

// --- Service Worker 核心邏輯 ---

// 1. 安裝 Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Opened cache and caching files');
      return cache.addAll(urlsToCache);
    })
  );
});

// 2. 啟用 Service Worker 並清除舊快取
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // 如果快取名稱不是目前的版本，就刪除它
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// 3. 攔截網路請求
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // 如果快取中有，就直接回傳
      if (response) {
        return response;
      }
      // 如果快取中沒有，就從網路請求
      return fetch(event.request);
    })
  );
});
