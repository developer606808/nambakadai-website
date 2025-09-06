import Link from 'next/link';
import React from 'react';

export default function Header() {
  return (
    <header className="bg-green-700 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <h1 className="text-2xl font-bold cursor-pointer">Nambakadai</h1>
        </Link>
        <nav className="hidden md:flex space-x-4">
          <Link href="/demand">
            <span className="hover:text-green-200 cursor-pointer">Demand Board</span>
          </Link>
          <Link href="/offers">
            <span className="hover:text-green-200 cursor-pointer">Today's Offers</span>
          </Link>
          <Link href="/about">
            <span className="hover:text-green-200 cursor-pointer">About Us</span>
          </Link>
          <Link href="/contact">
            <span className="hover:text-green-200 cursor-pointer">Contact</span>
          </Link>
        </nav>
        <div className="md:hidden">
          {/* Mobile menu icon will go here */}
          <button className="text-white focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
