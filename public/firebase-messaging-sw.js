// Firebase Cloud Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/12.2.1/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/12.2.1/firebase-messaging-compat.js')

// Initialize Firebase in the service worker
const firebaseConfig = {
  apiKey: "AIzaSyAejkpNpy77SGjmu7wDUs7HvLQhONwp-Ps",
  authDomain: "nambakadai-c7af0.firebaseapp.com",
  projectId: "nambakadai-c7af0",
  storageBucket: "nambakadai-c7af0.firebasestorage.app",
  messagingSenderId: "110100206957",
  appId: "1:110100206957:web:04b79d245be0681d18f664"
}

firebase.initializeApp(firebaseConfig)

const messaging = firebase.messaging()

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload)

  const notificationTitle = payload.notification?.title || 'New Message'
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new message',
    icon: payload.notification?.icon || '/favicon.ico',
    badge: payload.notification?.badge || '/favicon.ico',
    data: payload.data,
    tag: 'nambakadai-message', // Group similar notifications
    requireInteraction: true, // Keep notification visible until user interacts
    actions: [
      {
        action: 'view',
        title: 'View Message'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  }

  return self.registration.showNotification(notificationTitle, notificationOptions)
})

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification click received:', event)

  event.notification.close()

  if (event.action === 'view') {
    // Open the messages page
    const urlToOpen = new URL('/', self.location.origin).href

    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((windowClients) => {
          // Check if there is already a window/tab open with the target URL
          for (let client of windowClients) {
            if (client.url === urlToOpen && 'focus' in client) {
              return client.focus()
            }
          }
          // If not, open a new window/tab with the target URL
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen)
          }
        })
    )
  }
})

// Handle service worker installation
self.addEventListener('install', (event) => {
  console.log('Service worker installing')
  self.skipWaiting()
})

// Handle service worker activation
self.addEventListener('activate', (event) => {
  console.log('Service worker activating')
  event.waitUntil(clients.claim())
})

// Handle push events (fallback for when service worker is not properly registered)
self.addEventListener('push', (event) => {
  console.log('Push received:', event)

  if (event.data) {
    const data = event.data.json()
    console.log('Push data:', data)

    const options = {
      body: data.notification?.body || 'You have a new message',
      icon: data.notification?.icon || '/favicon.ico',
      badge: data.notification?.badge || '/favicon.ico',
      data: data.data,
      tag: 'nambakadai-push',
      requireInteraction: true,
      actions: [
        {
          action: 'view',
          title: 'View'
        }
      ]
    }

    event.waitUntil(
      self.registration.showNotification(
        data.notification?.title || 'New Message',
        options
      )
    )
  }
})