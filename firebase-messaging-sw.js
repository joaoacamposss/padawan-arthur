// ══════════════════════════════════════════════════════════════════
// PADAWAN ARTHUR — Firebase Cloud Messaging Service Worker
// Responsável por receber push notifications em background
//
// ⚠️  IMPORTANTE: Este arquivo precisa ficar na RAIZ do GitHub Pages
//     Caminho no repositório: firebase-messaging-sw.js (raiz)
//     URL pública: https://joaoacamposss.github.io/padawan-arthur/firebase-messaging-sw.js
// ══════════════════════════════════════════════════════════════════

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// ── Firebase config (igual ao app) ───────────────────────────────
firebase.initializeApp({
  apiKey:            "AIzaSyBEvy695Be5k9ntWWNvqg_Zy5hVN8ZfuDo",
  authDomain:        "padawan-arthur.firebaseapp.com",
  projectId:         "padawan-arthur",
  storageBucket:     "padawan-arthur.firebasestorage.app",
  messagingSenderId: "38758983138",
  appId:             "1:38758983138:web:ca0bf0a011971cbf62c5bb",
});

const messaging = firebase.messaging();

// ── Notificação em background ─────────────────────────────────────
messaging.onBackgroundMessage(payload => {
  const title = payload.notification?.title || '⚔️ Padawan Arthur';
  const body  = payload.notification?.body  || 'Novidade nas crônicas galácticas';
  const icon  = 'https://joaoacamposss.github.io/padawan-arthur/icon-192.png';

  return self.registration.showNotification(title, {
    body,
    icon,
    badge: icon,
    tag:   'padawan-arthur-notif',
    data:  payload.data || {},
    actions: [
      { action: 'abrir', title: '⚔️ Abrir App' },
      { action: 'ignorar', title: '✕ Ignorar' },
    ],
    requireInteraction: false,
    silent: false,
  });
});

// ── Clicar na notificação ─────────────────────────────────────────
self.addEventListener('notificationclick', event => {
  event.notification.close();
  if (event.action === 'ignorar') return;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // Se o app já está aberto, focar
      for (const client of clientList) {
        if (client.url.includes('padawan-arthur') && 'focus' in client) {
          return client.focus();
        }
      }
      // Senão, abrir
      if (clients.openWindow) {
        return clients.openWindow('https://joaoacamposss.github.io/padawan-arthur/');
      }
    })
  );
});
