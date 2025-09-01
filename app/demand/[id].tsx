import React from 'react';
import { useRouter } from 'next/router';
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
    imageUrl: 'https://via.placeholder.com/600x400/FF6347/FFFFFF?text=Fresh+Tomatoes', // Placeholder image
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
    imageUrl: 'https://via.placeholder.com/600x400/A0522D/FFFFFF?text=Clay+Pots', // Placeholder image
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
    imageUrl: 'https://via.placeholder.com/600x400/808080/FFFFFF?text=Tractor+Service', // Placeholder image
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
    imageUrl: 'https://via.placeholder.com/600x400/ADD8E6/000000?text=Cow+Milk', // Placeholder image
  },
];

export default function DemandDetailPage() {
  // const router = useRouter();
  // const { id } = router.query;
  const id = '1'; // Using a dummy ID for now

  const demand = dummyDemands.find((d) => d.id === id);

  if (!demand) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="container mx-auto p-4 flex-grow text-center">
          <h1 className="text-3xl font-bold text-gray-800">Demand Not Found</h1>
          <p className="text-gray-600 mt-2">The demand you are looking for does not exist or has been removed.</p>
          <Link href="/demand">
            <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300">Back to Demand Board</button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="container mx-auto p-4 flex-grow">
        <div className="bg-white shadow-xl rounded-lg p-6 md:p-8 relative max-w-4xl mx-auto border border-gray-200">
          {demand.urgent && (
            <span className="absolute top-4 right-4 bg-red-600 text-white text-sm font-semibold px-4 py-1.5 rounded-full shadow-md animate-pulse">
              ⚠ Urgent Request
            </span>
          )}
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 pr-24">{demand.productName}</h1>
          <img src={demand.imageUrl} alt={demand.productName} className="w-full h-64 md:h-80 object-cover rounded-lg mb-6 shadow-md" />
          
          <p className="text-gray-700 text-base md:text-lg mb-6 leading-relaxed">{demand.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 text-gray-800 mb-6">
            <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
              <p className="text-sm font-semibold text-gray-600 mb-1">Quantity/Frequency:</p>
              <p className="text-md font-medium">{demand.quantityFrequency}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
              <p className="text-sm font-semibold text-gray-600 mb-1">Preferred Delivery Time:</p>
              <p className="text-md font-medium">{demand.deliveryTime}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
              <p className="text-sm font-semibold text-gray-600 mb-1">Location:</p>
              <p className="text-md font-medium">{demand.location}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
              <p className="text-sm font-semibold text-gray-600 mb-1">Contact Method:</p>
              <p className="text-md font-medium">{demand.contactMethod}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-100 col-span-full">
              <p className="text-sm font-semibold text-gray-600 mb-1">Date Posted:</p>
              <p className="text-md font-medium">{demand.datePosted}</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-600 mb-2">Tags:</p>
            <div className="flex flex-wrap gap-2">
              {demand.tags.map((tag) => (
                <span key={tag} className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105">
              Contact Seller (via {demand.contactMethod})
            </button>
            <Link href="/demand">
              <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105">
                Back to Demand Board
              </button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
