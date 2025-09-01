import FirebaseTest from '@/components/firebase-test'

export default function FirebaseTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Firebase Test Page</h1>
          <p className="text-center text-gray-600 mb-8">
            Use this page to test Firebase Cloud Messaging setup and troubleshoot any issues.
          </p>

          <FirebaseTest />

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h2 className="font-semibold mb-2">📋 Testing Checklist:</h2>
            <ul className="text-sm space-y-1">
              <li>• ✅ Firebase configuration loaded</li>
              <li>• ✅ Service worker registered</li>
              <li>• ✅ Notification permission granted</li>
              <li>• ✅ FCM token obtained</li>
              <li>• ✅ Token stored in database</li>
              <li>• ✅ Test notification sent</li>
            </ul>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <h2 className="font-semibold mb-2">🔧 Troubleshooting:</h2>
            <ul className="text-sm space-y-1">
              <li>• Make sure you're using HTTPS in production</li>
              <li>• Check browser console for detailed error messages</li>
              <li>• Verify Firebase configuration in .env file</li>
              <li>• Ensure service worker is accessible at /firebase-messaging-sw.js</li>
              <li>• Check that MongoDB is running for message storage</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}