import React from 'react';
import Link from 'next/link';

const DemandListPage = () => {
  // TODO: Fetch and display all demand posts
  return (
    <main className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Demand Board</h1>
        <div className="space-x-2">
          <Link href="/demand/new" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Post New Demand</Link>
          <Link href="/offers" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">View Offers</Link>
        </div>
      </div>
      {/* Demand list will go here */}
      <div className="bg-white rounded shadow p-4">
        <p>All posted demands will be listed here.</p>
      </div>
    </main>
  );
};

export default DemandListPage;
