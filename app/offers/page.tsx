import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';

const dummyOffers = [
  {
    id: '1',
    productName: 'Fresh Onions',
    imageUrl: 'https://via.placeholder.com/400x250/008000/FFFFFF?text=Fresh+Onions', // Green for fresh produce
    offerPrice: 20,
    regularPrice: 30,
    offerDuration: 'Until Oct 31',
    sellerDetails: 'Farmer Raju',
    sellerType: 'Farmer',
    location: 'Coimbatore',
    isPeakSeason: true,
    productCategory: 'Vegetables',
    offerExpiryDate: '2023-10-31',
  },
  {
    id: '2',
    productName: 'Organic Milk',
    imageUrl: 'https://via.placeholder.com/400x250/ADD8E6/000000?text=Organic+Milk', // Light blue for dairy
    offerPrice: 55,
    regularPrice: 60,
    offerDuration: 'Next 3 days',
    sellerDetails: 'Daily Mart Retailers',
    sellerType: 'Retailer',
    location: 'Pollachi',
    isPeakSeason: false,
    productCategory: 'Dairy',
    offerExpiryDate: '2023-10-29',
  },
  {
    id: '3',
    productName: 'Apples',
    imageUrl: 'https://via.placeholder.com/400x250/FF0000/FFFFFF?text=Fresh+Apples', // Red for fruits
    offerPrice: 120,
    regularPrice: 150,
    offerDuration: 'While stocks last',
    sellerDetails: 'Fresh Fruits Co.',
    sellerType: 'Retailer',
    location: 'Coimbatore',
    isPeakSeason: true,
    productCategory: 'Fruits',
    offerExpiryDate: '2023-11-15',
  },
  {
    id: '4',
    productName: 'Farm Fresh Eggs',
    imageUrl: 'https://via.placeholder.com/400x250/F0E68C/000000?text=Farm+Eggs', // Yellow for eggs
    offerPrice: 5,
    regularPrice: 7,
    offerDuration: 'Limited Stock',
    sellerDetails: 'Local Poultry Farm',
    sellerType: 'Farmer',
    location: 'Salem',
    isPeakSeason: false,
    productCategory: 'Poultry',
    offerExpiryDate: '2023-10-28',
  },
];

export default function OffersPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="container mx-auto p-4 flex-grow">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Today's Offers & Seasonal Picks</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">Discover amazing deals on fresh produce and products directly from farmers and retailers. Don't miss out on seasonal specials!</p>
        </div>

        {/* Filter Section */}
        <div className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Filter Offers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="filterCategory" className="block text-sm font-medium text-gray-700 mb-1">Product Category</label>
              <input type="text" id="filterCategory" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 py-2 px-3" placeholder="e.g., Vegetables, Fruits" />
            </div>
            <div>
              <label htmlFor="filterPriceRange" className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
              <input type="text" id="filterPriceRange" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 py-2 px-3" placeholder="e.g., 50-100" />
            </div>
            <div>
              <label htmlFor="filterExpiry" className="block text-sm font-medium text-gray-700 mb-1">Offer Expiry Date</label>
              <input type="date" id="filterExpiry" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 py-2 px-3" />
            </div>
            <div>
              <label htmlFor="filterSellerType" className="block text-sm font-medium text-gray-700 mb-1">Seller Type</label>
              <select id="filterSellerType" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 py-2 px-3">
                <option value="">All</option>
                <option value="Farmer">Farmer</option>
                <option value="Retailer">Retailer</option>
              </select>
            </div>
          </div>
          <button className="mt-6 w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-md shadow transition duration-300 ease-in-out">Apply Filters</button>
        </div>

        {/* Offer Listings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dummyOffers.map((offer) => (
            <div key={offer.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 relative border border-gray-100 flex flex-col">
              {offer.isPeakSeason && (
                <span className="absolute top-3 left-3 bg-yellow-500 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                  🌾 Peak Season
                </span>
              )}
              <img src={offer.imageUrl} alt={offer.productName} className="w-full h-48 object-cover rounded-md mb-4 flex-shrink-0" />
              <h3 className="text-xl font-bold text-gray-800 mb-2 flex-grow-0">{offer.productName}</h3>
              <p className="text-gray-600 text-sm mb-3 flex-grow">Grab fresh, seasonal {offer.productName.toLowerCase()} at an unbeatable price!</p>
              <div className="text-lg mb-3 flex-grow-0">
                <span className="text-green-600 font-bold mr-2">₹{offer.offerPrice}</span> 
                <span className="line-through text-gray-500 text-base">₹{offer.regularPrice}</span>
                <span className="ml-3 text-red-500 font-semibold">{( (1 - offer.offerPrice / offer.regularPrice) * 100).toFixed(0)}% OFF</span>
              </div>
              <div className="text-sm text-gray-700 space-y-1 mb-4 flex-grow-0">
                <p><strong>Seller:</strong> {offer.sellerDetails} ({offer.sellerType})</p>
                <p><strong>Location:</strong> {offer.location}</p>
                <p><strong>Validity:</strong> {offer.offerDuration}</p>
              </div>
              <div className="flex flex-wrap gap-2 mb-4 flex-grow-0">
                {offer.sellerType === 'Farmer' && (
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Farmer Deal</span>
                )}
                {offer.sellerType === 'Retailer' && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Retailer Discount</span>
                )}
              </div>
              <Link href={`/offers/${offer.id}`}> 
                <button className="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out">
                  View Offer
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
