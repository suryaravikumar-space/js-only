/**
 * WEB APIS: 16 - Notification API
 *
 * ONE CONCEPT: Show system notifications outside the browser
 */


// =============================================================================
// NOTIFICATION API
// =============================================================================

console.log('=== Notification API ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  KEY POINTS                                                         │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  • Requires USER PERMISSION                                         │
 *   │  • Works even when tab is not focused                               │
 *   │  • With Service Worker: works when browser is closed!               │
 *   │  • Different from in-page toasts/alerts                             │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

const notificationCode = `
// ═══════════════════════════════════════════════════════════════════════
// REQUEST PERMISSION
// ═══════════════════════════════════════════════════════════════════════

async function requestNotificationPermission() {
  // Check if supported
  if (!('Notification' in window)) {
    console.log('Notifications not supported');
    return false;
  }

  // Already granted
  if (Notification.permission === 'granted') {
    return true;
  }

  // Already denied
  if (Notification.permission === 'denied') {
    console.log('Notifications blocked by user');
    return false;
  }

  // Ask permission
  const permission = await Notification.requestPermission();
  return permission === 'granted';
}


// ═══════════════════════════════════════════════════════════════════════
// SHOW NOTIFICATION
// ═══════════════════════════════════════════════════════════════════════

function showNotification(title, options = {}) {
  if (Notification.permission !== 'granted') {
    return null;
  }

  const notification = new Notification(title, {
    body: options.body || '',           // Message text
    icon: options.icon || '/icon.png',  // Icon image
    badge: options.badge || '/badge.png', // Small icon
    tag: options.tag || 'default',      // Group similar notifications
    requireInteraction: false,          // Auto-close
    silent: false,                      // Play sound
    data: options.data || {}            // Custom data
  });

  notification.onclick = () => {
    window.focus();
    notification.close();
    if (options.onClick) options.onClick();
  };

  notification.onerror = (error) => {
    console.error('Notification error:', error);
  };

  return notification;
}


// ═══════════════════════════════════════════════════════════════════════
// REAL-WORLD: Chat Notification
// ═══════════════════════════════════════════════════════════════════════

async function notifyNewMessage(message) {
  // Don't notify if tab is focused
  if (document.hasFocus()) {
    return;
  }

  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) return;

  showNotification(\`New message from \${message.sender}\`, {
    body: message.text,
    icon: message.senderAvatar,
    tag: 'chat-' + message.conversationId,  // Group by conversation
    data: { conversationId: message.conversationId },
    onClick: () => {
      navigateToConversation(message.conversationId);
    }
  });
}


// ═══════════════════════════════════════════════════════════════════════
// WITH SERVICE WORKER (Works when browser is closed!)
// ═══════════════════════════════════════════════════════════════════════

// In your main script:
async function subscribeToPush() {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
  });

  // Send subscription to your server
  await fetch('/api/push-subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription)
  });
}

// In service worker (sw.js):
self.addEventListener('push', (event) => {
  const data = event.data.json();

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      data: { url: data.url }
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
`;

console.log(notificationCode);


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "The Notification API shows system-level notifications outside the browser.
 * It requires user permission, so I call requestPermission first. Notifications
 * work even when the tab isn't focused. For notifications when the browser is
 * closed, I combine it with Service Workers and Push API - the server sends
 * a push message, the service worker receives it and shows the notification.
 * Common use cases are chat messages, order updates, and breaking news alerts."
 */


// RUN: node docs/27-web-apis/16-notification-api.js
