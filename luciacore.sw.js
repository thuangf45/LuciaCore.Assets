// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// * Author:      Nguyen Minh Thuan (thuangf45)
// * License:     AGPL-3.0-only
// * LinkedIn:    https://www.linkedin.com/in/thuangf45
// * NuGet:       https://www.nuget.org/profiles/thuangf45
// * Portfolio:   https://thuangf45.github.io
// * Github:      https://github.com/thuangf45
// * Blog:        https://dev.to/thuangf45
// * Contact:     kingnemacc@gmail.com
// * Copyright (c) 2026 thuangf45. All rights reserved.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const DYNAMIC_CACHE_NAME = 'lucia-dynamic-fortress-v1';

// 🌟 Mảng lưu trữ động, cung cấp fallback phòng hờ khi chưa nhận được message
let dynamicExtensions = ['.html', '.js', '.css', '.json', '.svg', '.png', '.jpg', '.jpeg'];

// 🌟 Lắng nghe thông điệp từ Main Thread để cập nhật luật Cache
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SYNC_EXTENSIONS') {
        dynamicExtensions = event.data.extensions;
    }
});

function isTargetAsset(url) {
    const isInternal = url.origin === self.location.origin;
    // Sử dụng mảng động thay vì mảng cứng
    const hasTargetExt = dynamicExtensions.some(ext => url.pathname.endsWith(ext));
    const isRoot = url.pathname === '/';
    return isInternal && (hasTargetExt || isRoot);
}

function cleanCacheKey(request) {
    const url = new URL(request.url);
    if (url.pathname.endsWith('content.json')) {
        return new Request(url.origin + url.pathname);
    }
    return request;
}

self.addEventListener('install', (e) => { self.skipWaiting(); });
self.addEventListener('activate', (e) => { e.waitUntil(self.clients.claim()); });

self.addEventListener('fetch', (e) => {
    if (e.request.method !== 'GET') return;

    const requestUrl = new URL(e.request.url);
    if (!isTargetAsset(requestUrl)) return;

    const cleanedRequest = cleanCacheKey(e.request);

    e.respondWith(
        fetch(e.request)
            .then((networkResponse) => {
                if (!networkResponse || networkResponse.status !== 200) return networkResponse;

                const responseToCache = networkResponse.clone();
                e.waitUntil(
                    caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
                        cache.put(cleanedRequest, responseToCache);
                    })
                );
                return networkResponse;
            })
            .catch((err) => {
                // 🌟 SỬA NÚT THẮT CHÍ MẠNG: Khối catch xử lý Realtime-Sync check version của main.js
                if (e.request.headers.get('X-Fetch-Mode') === 'Realtime-Sync') {
                    return caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
                        // 🛠️ ÉP SO KHỚP CHUỖI TĨNH TRẦN TRỤI: Không truyền Request Object ảo, truyền thẳng String URL trọc!
                        const strictStaticKey = requestUrl.origin + '/content.json';
                        
                        return cache.match(strictStaticKey).then((cachedResponse) => {
                            if (cachedResponse) {
                                console.log(`%c[Lucia SW] Bẫy Key tĩnh thành công! Nhả bọc cứu hộ cho content.json`, 'color: #00ff00;');
                                return new Response(cachedResponse.body, {
                                    status: 503,
                                    statusText: 'Server Offline But Blueprint Attached',
                                    headers: { 'Content-Type': 'application/json' }
                                });
                            }
                            return Promise.reject(err);
                        });
                    });
                }

                // Luồng xử lý file tĩnh thông thường cứu mạng giao diện
                return caches.match(cleanedRequest);
            })
    );
});