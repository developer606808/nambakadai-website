import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function NewDemandPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="container mx-auto p-4 flex-grow">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8 text-center">Post Your Demand</h1>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">Fill out the form below to post a demand for products or services. Whether it&apos;s a bulk order, a recurring need, or a custom request, let the community know what you&apos;re looking for!</p>

        <form className="bg-white shadow-xl rounded-lg px-8 pt-6 pb-8 mb-4 max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productName">
                Product/Service Name <span className="text-red-500">*</span>
              </label>
              <input className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200" id="productName" type="text" placeholder="e.g., Fresh Tomatoes, Tractor Service" required />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantityFrequency">
                Quantity or Frequency <span className="text-red-500">*</span>
              </label>
              <input className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200" id="quantityFrequency" type="text" placeholder="e.g., 50kg weekly, One-time, 10 pieces" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deliveryTime">
                Preferred Delivery/Purchase Time
              </label>
              <input className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200" id="deliveryTime" type="text" placeholder="e.g., Tomorrow morning, Within 2 days" />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
                Location (City/Village) <span className="text-red-500">*</span>
              </label>
              <input className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200" id="location" type="text" placeholder="e.g., Coimbatore, Annur" required />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contactMethod">
              Preferred Contact Method <span className="text-red-500">*</span>
            </label>
            <select className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200" id="contactMethod" required>
              <option value="">Select a method</option>
              <option value="Call">Call</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="In-app chat">In-app chat</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200" id="description" rows={5} placeholder="e.g., Looking for fresh cow milk every 2 days, organic preferred." required></textarea>
            <p className="text-gray-500 text-xs mt-1">Provide as much detail as possible for better matches.</p>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tags">
              Tags (comma-separated)
            </label>
            <input className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200" id="tags" type="text" placeholder="e.g., bulk, urgent, organic, vegetables" />
            <p className="text-gray-500 text-xs mt-1">Add relevant tags to help sellers find your demand.</p>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="imageUpload">
              Upload Image/Sample (Optional)
            </label>
            <input className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer transition duration-200" id="imageUpload" type="file" accept="image/*" />
            <p className="text-gray-500 text-xs mt-1">An image can help clarify your request.</p>
          </div>

          <div className="mb-8 flex items-center">
            <input className="mr-3 leading-tight h-5 w-5 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer" id="urgentToggle" type="checkbox" />
            <label className="text-md font-medium text-gray-800" htmlFor="urgentToggle">
              Mark as Urgent <span className="text-red-500 font-normal">(This will highlight your demand)</span>
            </label>
          </div>

          <div className="flex items-center justify-center">
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:scale-105" type="submit">
              Post Demand
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}
