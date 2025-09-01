import React from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';

const dummyOffers = [
  {
    id: '1',
    productName: 'Fresh Onions',
    imageUrl: 'https://via.placeholder.com/600x400/008000/FFFFFF?text=Fresh+Onions', // Green for fresh produce
    offerPrice: 20,
    regularPrice: 30,
    offerDuration: 'Until Oct 31',
    sellerDetails: 'Farmer Raju, Coimbatore',
    sellerType: 'Farmer',
    location: 'Coimbatore',
    isPeakSeason: true,
    productCategory: 'Vegetables',
    offerExpiryDate: '2023-10-31',
  },
  {
    id: '2',
    productName: 'Organic Milk',
    imageUrl: 'https://via.placeholder.com/600x400/ADD8E6/000000?text=Organic+Milk', // Light blue for dairy
    offerPrice: 55,
    regularPrice: 60,
    offerDuration: 'Next 3 days',
    sellerDetails: 'Daily Mart Retailers, Pollachi',
    sellerType: 'Retailer',
    location: 'Pollachi',
    isPeakSeason: false,
    productCategory: 'Dairy',
    offerExpiryDate: '2023-10-29',
  },
  {
    id: '3',
    productName: 'Apples',
    imageUrl: 'https://via.placeholder.com/600x400/FF0000/FFFFFF?text=Fresh+Apples', // Red for fruits
    offerPrice: 120,
    regularPrice: 150,
    offerDuration: 'While stocks last',
    sellerDetails: 'Fresh Fruits Co., Coimbatore',
    sellerType: 'Retailer',
    location: 'Coimbatore',
    isPeakSeason: true,
    productCategory: 'Fruits',
    offerExpiryDate: '2023-11-15',
  },
  {
    id: '4',
    productName: 'Farm Fresh Eggs',
    imageUrl: 'https://via.placeholder.com/600x400/F0E68C/000000?text=Farm+Eggs', // Yellow for eggs
    offerPrice: 5,
    regularPrice: 7,
    offerDuration: 'Limited Stock',
    sellerDetails: 'Local Poultry Farm, Salem',
    sellerType: 'Farmer',
    location: 'Salem',
    isPeakSeason: false,
    productCategory: 'Poultry',
    offerExpiryDate: '2023-10-28',
  },
];

export default function OfferDetailPage() {
  // const router = useRouter();
  // const { id } = router.query;
  const id = '1'; // Using a dummy ID for now

  const offer = dummyOffers.find((o) => o.id === id);

  if (!offer) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="container mx-auto p-4 flex-grow text-center">
          <h1 className="text-3xl font-bold text-gray-800">Offer Not Found</h1>
          <p className="text-gray-600 mt-2">The offer you are looking for does not exist or has been removed.</p>
          <Link href="/offers">
            <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300">Back to Offers Page</button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const discountPercent = ((1 - offer.offerPrice / offer.regularPrice) * 100).toFixed(0);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="container mx-auto p-4 flex-grow">
        <div className="bg-white shadow-xl rounded-lg p-6 md:p-8 relative max-w-4xl mx-auto border border-gray-200">
          {offer.isPeakSeason && (
            <span className="absolute top-4 right-4 bg-yellow-500 text-gray-800 text-sm font-semibold px-4 py-1.5 rounded-full shadow-md">
              🌾 Peak Season
            </span>
          )}
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 pr-24">{offer.productName}</h1>
          <img src={offer.imageUrl} alt={offer.productName} className="w-full h-64 md:h-80 object-cover rounded-lg mb-6 shadow-md" />
          
          <p className="text-gray-700 text-base md:text-lg mb-6 leading-relaxed">Grab fresh, seasonal {offer.productName.toLowerCase()} at an unbeatable price! This offer is brought to you by {offer.sellerDetails}.</p>

          <div className="flex items-baseline mb-6">
            <span className="text-green-600 font-bold text-3xl md:text-4xl mr-3">₹{offer.offerPrice}</span> 
            <span className="line-through text-gray-500 text-xl md:text-2xl mr-3">₹{offer.regularPrice}</span>
            <span className="text-red-600 font-semibold text-xl md:text-2xl">{discountPercent}% OFF</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 text-gray-800 mb-6">
            <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
              <p className="text-sm font-semibold text-gray-600 mb-1">Seller:</p>
              <p className="text-md font-medium">{offer.sellerDetails} ({offer.sellerType})</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
              <p className="text-sm font-semibold text-gray-600 mb-1">Location:</p>
              <p className="text-md font-medium">{offer.location}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
              <p className="text-sm font-semibold text-gray-600 mb-1">Offer Validity:</p>
              <p className="text-md font-medium">{offer.offerDuration}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
              <p className="text-sm font-semibold text-gray-600 mb-1">Product Category:</p>
              <p className="text-md font-medium">{offer.productCategory}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-100 col-span-full">
              <p className="text-sm font-semibold text-gray-600 mb-1">Expires On:</p>
              <p className="text-md font-medium">{offer.offerExpiryDate}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {offer.sellerType === 'Farmer' && (
              <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">Farmer Deal</span>
            )}
            {offer.sellerType === 'Retailer' && (
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">Retailer Discount</span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105">
              View Seller Store
            </button>
            <Link href="/offers">
              <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105">
                Back to Offers Page
              </button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
