import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Cloud Messaging
export const messaging = typeof window !== 'undefined' ? getMessaging(app) : null

// Check if we're in development mode
export const isDevelopment = process.env.NODE_ENV === 'development'

// Check if we're running on HTTPS (required for FCM)
export const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:'

// Check if service workers are supported
export const isServiceWorkerSupported = typeof window !== 'undefined' && 'serviceWorker' in navigator

// Check if notifications are supported
export const isNotificationSupported = typeof window !== 'undefined' && 'Notification' in window

// Request permission and get token
export const requestPermissionAndGetToken = async (): Promise<string | null> => {
  try {
    if (!messaging) return null

    // Check if service worker is supported
    if ('serviceWorker' in navigator) {
      // Register service worker if not already registered
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
        scope: '/firebase-cloud-messaging-push-scope'
      })

      console.log('Service Worker registered:', registration)

      // Wait for the service worker to be ready
      await navigator.serviceWorker.ready
      console.log('Service Worker ready')
    }

    const permission = await Notification.requestPermission()
    console.log('Notification permission:', permission)

    if (permission === 'granted') {
      if (!messaging) {
        console.error('Firebase messaging not initialized')
        return null
      }

      const token = await getToken(messaging as any, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: await navigator.serviceWorker.ready
      })

      console.log('FCM token obtained:', token ? 'Yes' : 'No')
      return token
    }

    console.log('Notification permission denied')
    return null
  } catch (error) {
    console.error('Error getting FCM token:', error)

    // If service worker registration fails, try without it
    try {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
        })
        return token
      }
    } catch (fallbackError) {
      console.error('Fallback FCM token retrieval also failed:', fallbackError)

      // Final fallback - try without service worker
      try {
        if (messaging) {
          const token = await getToken(messaging as any, {
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
          })
          return token
        }
      } catch (finalFallbackError) {
        console.error('Final fallback also failed:', finalFallbackError)
      }
    }

    return null
  }
}

// Listen for messages
export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) return resolve(null)
    onMessage(messaging, (payload) => {
      resolve(payload)
    })
  })

export default app