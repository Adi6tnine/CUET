/**
 * AVION SERVICE WORKER
 * Production-ready service worker for offline functionality and caching
 */

const CACHE_NAME = 'avion-v2.0.0';
const STATIC_CACHE = 'avion-static-v2.0.0';
const DYNAMIC_CACHE = 'avion-dynamic-v2.0.0';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  // Add other critical static files
];

// API endpoints to cache
const CACHEABLE_APIS = [
  '/api/questions',
  '/api/progress',
  '/api/analytics'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('[SW] Static files cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static files:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - handle requests with caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!request.url.startsWith('http')) {
    return;
  }

  // Handle different types of requests
  if (isStaticFile(request)) {
    event.respondWith(handleStaticFile(request));
  } else if (isApiRequest(request)) {
    event.respondWith(handleApiRequest(request));
  } else if (isNavigationRequest(request)) {
    event.respondWith(handleNavigationRequest(request));
  } else {
    event.respondWith(handleDynamicRequest(request));
  }
});

/**
 * Check if request is for a static file
 */
function isStaticFile(request) {
  const url = new URL(request.url);
  return url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/);
}

/**
 * Check if request is for an API endpoint
 */
function isApiRequest(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/') || 
         CACHEABLE_APIS.some(api => url.pathname.startsWith(api));
}

/**
 * Check if request is a navigation request
 */
function isNavigationRequest(request) {
  return request.mode === 'navigate' || 
         (request.method === 'GET' && request.headers.get('accept').includes('text/html'));
}

/**
 * Handle static file requests - Cache First strategy
 */
async function handleStaticFile(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('[SW] Static file request failed:', error);
    return new Response('Offline - Static file not available', { status: 503 });
  }
}

/**
 * Handle API requests - Network First with fallback strategy
 */
async function handleApiRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    // If network fails, try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] API request failed:', error);
    
    // Try to serve from cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for API requests
    return new Response(JSON.stringify({
      error: 'Offline',
      message: 'This feature requires an internet connection',
      offline: true
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Handle navigation requests - Network First with offline fallback
 */
async function handleNavigationRequest(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      return networkResponse;
    }
    
    // Serve cached index.html for SPA routing
    const cachedResponse = await caches.match('/index.html');
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Navigation request failed:', error);
    
    // Serve cached index.html for offline navigation
    const cachedResponse = await caches.match('/index.html');
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>AVION - Offline</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex; 
              justify-content: center; 
              align-items: center; 
              height: 100vh; 
              margin: 0; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-align: center;
            }
            .container { max-width: 400px; padding: 2rem; }
            h1 { margin-bottom: 1rem; }
            p { margin-bottom: 1.5rem; opacity: 0.9; }
            button { 
              background: rgba(255,255,255,0.2); 
              border: 1px solid rgba(255,255,255,0.3);
              color: white; 
              padding: 0.75rem 1.5rem; 
              border-radius: 0.5rem; 
              cursor: pointer;
              font-size: 1rem;
            }
            button:hover { background: rgba(255,255,255,0.3); }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🚀 AVION</h1>
            <p>You're currently offline. Please check your internet connection and try again.</p>
            <button onclick="window.location.reload()">Retry</button>
          </div>
        </body>
      </html>
    `, {
      status: 503,
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

/**
 * Handle other dynamic requests - Network First strategy
 */
async function handleDynamicRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Dynamic request failed:', error);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return new Response('Offline - Content not available', { status: 503 });
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'sync-progress') {
    event.waitUntil(syncProgress());
  } else if (event.tag === 'sync-quiz-results') {
    event.waitUntil(syncQuizResults());
  }
});

/**
 * Sync progress data when back online
 */
async function syncProgress() {
  try {
    console.log('[SW] Syncing progress data...');
    
    // Get offline progress data from IndexedDB or localStorage
    const offlineData = await getOfflineProgressData();
    
    if (offlineData && offlineData.length > 0) {
      // Send to server
      const response = await fetch('/api/sync/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offlineData)
      });
      
      if (response.ok) {
        console.log('[SW] Progress data synced successfully');
        await clearOfflineProgressData();
      }
    }
  } catch (error) {
    console.error('[SW] Failed to sync progress data:', error);
  }
}

/**
 * Sync quiz results when back online
 */
async function syncQuizResults() {
  try {
    console.log('[SW] Syncing quiz results...');
    
    const offlineResults = await getOfflineQuizResults();
    
    if (offlineResults && offlineResults.length > 0) {
      const response = await fetch('/api/sync/quiz-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offlineResults)
      });
      
      if (response.ok) {
        console.log('[SW] Quiz results synced successfully');
        await clearOfflineQuizResults();
      }
    }
  } catch (error) {
    console.error('[SW] Failed to sync quiz results:', error);
  }
}

/**
 * Get offline progress data (placeholder - implement based on your storage strategy)
 */
async function getOfflineProgressData() {
  // Implement based on your offline storage strategy
  return [];
}

/**
 * Get offline quiz results (placeholder - implement based on your storage strategy)
 */
async function getOfflineQuizResults() {
  // Implement based on your offline storage strategy
  return [];
}

/**
 * Clear offline progress data after successful sync
 */
async function clearOfflineProgressData() {
  // Implement based on your offline storage strategy
}

/**
 * Clear offline quiz results after successful sync
 */
async function clearOfflineQuizResults() {
  // Implement based on your offline storage strategy
}

// Push notifications (for future use)
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open AVION',
        icon: '/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-192x192.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('AVION', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('[SW] Service worker loaded successfully');