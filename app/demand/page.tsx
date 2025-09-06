import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';

const dummyDemands = [
  {
    id: '1',
    productName: 'Tomatoes',
    quantityFrequency: '50kg weekly',
    deliveryTime: 'Every Monday morning',
    location: 'Coimbatore',
    contactMethod: 'WhatsApp',
    description: 'Looking for fresh, organic tomatoes for restaurant use.',
    tags: ['bulk', 'organic', 'vegetables'],
    urgent: true,
    datePosted: '2023-10-26',
    imageUrl: 'https://via.placeholder.com/400x250/FF6347/FFFFFF?text=Fresh+Tomatoes', // Placeholder image
  },
  {
    id: '2',
    productName: 'Handmade Clay Pots',
    quantityFrequency: 'One-time',
    deliveryTime: 'Within 1 week',
    location: 'Annur',
    contactMethod: 'Call',
    description: 'Need 10 handmade clay pots for gardening. Must be durable and eco-friendly.',
    tags: ['custom', 'craft', 'home-goods'],
    urgent: false,
    datePosted: '2023-10-25',
    imageUrl: 'https://via.placeholder.com/400x250/A0522D/FFFFFF?text=Clay+Pots', // Placeholder image
  },
  {
    id: '3',
    productName: 'Tractor Service',
    quantityFrequency: 'One-time',
    deliveryTime: 'Today',
    location: 'Pollachi',
    contactMethod: 'In-app chat',
    description: 'Need tractor for plowing a 2-acre field urgently. Operator included.',
    tags: ['urgent', 'service', 'farm-equipment'],
    urgent: true,
    datePosted: '2023-10-26',
    imageUrl: 'https://via.placeholder.com/400x250/808080/FFFFFF?text=Tractor+Service', // Placeholder image
  },
  {
    id: '4',
    productName: 'Fresh Cow Milk',
    quantityFrequency: 'Daily',
    deliveryTime: 'Every morning by 7 AM',
    location: 'Coimbatore',
    contactMethod: 'WhatsApp',
    description: 'Looking for 5 liters of fresh, unadulterated cow milk daily.',
    tags: ['dairy', 'fresh', 'daily'],
    urgent: false,
    datePosted: '2023-10-24',
    imageUrl: 'https://via.placeholder.com/400x250/ADD8E6/000000?text=Cow+Milk', // Placeholder image
  },
];

export default function DemandPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="container mx-auto p-4 flex-grow">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Demand Board</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">Browse requests from individuals and businesses for bulk orders, recurring needs, custom products, and urgent services.</p>
          <Link href="/demand/new">
            <button className="mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
              Post Your Demand
            </button>
          </Link>
        </div>

        {/* Filter Section */}
        <div className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Filter Demands</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="filterProductType" className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
              <input type="text" id="filterProductType" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 py-2 px-3" placeholder="e.g., Vegetables" />
            </div>
            <div>
              <label htmlFor="filterLocation" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input type="text" id="filterLocation" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 py-2 px-3" placeholder="e.g., Coimbatore" />
            </div>
            <div>
              <label htmlFor="filterUrgency" className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
              <select id="filterUrgency" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 py-2 px-3">
                <option value="">All</option>
                <option value="urgent">Urgent</option>
                <option value="not-urgent">Not Urgent</option>
              </select>
            </div>
            <div>
              <label htmlFor="filterDatePosted" className="block text-sm font-medium text-gray-700 mb-1">Date Posted</label>
              <input type="date" id="filterDatePosted" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 py-2 px-3" />
            </div>
          </div>
          <button className="mt-6 w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-md shadow transition duration-300 ease-in-out">Apply Filters</button>
        </div>

        {/* Demand Listings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dummyDemands.map((demand) => (
            <div key={demand.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 relative border border-gray-100 flex flex-col">
              {demand.urgent && (
                <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md animate-pulse">
                  ⚠ Urgent
                </span>
              )}
              <img src={demand.imageUrl} alt={demand.productName} className="w-full h-48 object-cover rounded-md mb-4 flex-shrink-0" />
              <h3 className="text-xl font-bold text-gray-800 mb-2 flex-grow-0">{demand.productName}</h3>
              <p className="text-gray-600 text-sm mb-3 flex-grow">{demand.description}</p>
              <div className="text-sm text-gray-700 space-y-1 mb-4 flex-grow-0">
                <p><strong>Quantity:</strong> {demand.quantityFrequency}</p>
                <p><strong>Delivery:</strong> {demand.deliveryTime}</p>
                <p><strong>Location:</strong> {demand.location}</p>
                <p><strong>Contact:</strong> {demand.contactMethod}</p>
                <p><strong>Posted:</strong> {demand.datePosted}</p>
              </div>
              <div className="flex flex-wrap gap-2 mb-4 flex-grow-0">
                {demand.tags.map((tag) => (
                  <span key={tag} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <Link href={`/demand/${demand.id}`}>
                <button className="mt-auto w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out">
                  View Details
                </button>
              </Link>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
