'use client';

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome to Nambakadai
            </h1>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-900 mb-2">
                Farm to Table Marketplace
              </h2>
              <p className="text-blue-700">
                Connect directly with local farmers and vendors
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900">Home</h3>
                <p className="text-green-700 text-sm">Loading...</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-900">Products</h3>
                <p className="text-purple-700 text-sm">Search</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-900">Stores</h3>
                <p className="text-orange-700 text-sm">Filter</p>
              </div>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Demo Features</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Loading:</strong> Loading...</p>
                <p><strong>Search:</strong> Search</p>
                <p><strong>Filter:</strong> Filter</p>
                <p><strong>Success:</strong> Success</p>
                <p><strong>Error:</strong> Error</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}