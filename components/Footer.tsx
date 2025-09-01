import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white p-8 mt-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-full md:col-span-1">
          <h3 className="text-xl font-bold mb-4">Nambakadai</h3>
          <p className="text-gray-400">Your local marketplace for fresh produce and services.</p>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
          <ul>
            <li className="mb-2">
              <Link href="/demand">
                <span className="text-gray-400 hover:text-white cursor-pointer">Demand Board</span>
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/offers">
                <span className="text-gray-400 hover:text-white cursor-pointer">Today's Offers</span>
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/create-store">
                <span className="text-gray-400 hover:text-white cursor-pointer">Become a Seller</span>
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/community">
                <span className="text-gray-400 hover:text-white cursor-pointer">Community</span>
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-3">About Us</h4>
          <ul>
            <li className="mb-2">
              <Link href="/about">
                <span className="text-gray-400 hover:text-white cursor-pointer">Our Story</span>
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/privacy">
                <span className="text-gray-400 hover:text-white cursor-pointer">Privacy Policy</span>
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/terms">
                <span className="text-gray-400 hover:text-white cursor-pointer">Terms of Service</span>
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/faq">
                <span className="text-gray-400 hover:text-white cursor-pointer">FAQ</span>
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-3">Contact Us</h4>
          <p className="text-gray-400 mb-2">Email: support@nambakadai.com</p>
          <p className="text-gray-400 mb-2">Phone: +91 12345 67890</p>
          <div className="flex space-x-4 mt-4">
            {/* Social Media Icons */}
            <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-twitter"></i></a>
            <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-500">
        <p>&copy; {currentYear} Nambakadai. All rights reserved.</p>
      </div>
    </footer>
  );
}
