
'use client';

import React from 'react';

export default function NavBar() {
  return (
    <header className="flex items-center justify-between py-4 px-6 border-b border-gray-100">
      {/* Hamburger Menu (Left) */}
      <button className="p-2 focus:outline-none" aria-label="Menu">
        <svg
          className="h-6 w-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Right Navigation */}
      <nav>
        <ul className="flex items-center space-x-6">
          <li>
            <a href="#" className="hover:text-blue-600 transition">
              About
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-600 transition">
              FAQ
            </a>
          </li>
          <li>
            <a
              href="#"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Get Started
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
