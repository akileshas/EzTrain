
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CardPopupPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  const openModal = (cardIndex: number) => {
    setSelectedCard(cardIndex);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
  };

  const handleOptionClick = (option: string) => {
    // Example navigation: navigate to `/card{selectedCard}/{option}`
    if (selectedCard !== null) {
      router.push(`/train/image`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-8 bg-gray-50 p-4">
      <h1 className="text-3xl font-bold">Choose a Card</h1>
      <div className="flex space-x-8">
        {/* Card 1 */}
        <div
          className="w-64 h-40 bg-white rounded-lg shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-100 transition"
          onClick={() => openModal(1)}
        >
          <span className="text-xl font-semibold">Card 1</span>
        </div>
        {/* Card 2 */}
        <div
          className="w-64 h-40 bg-white rounded-lg shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-100 transition"
          onClick={() => openModal(2)}
        >
          <span className="text-xl font-semibold">Card 2</span>
        </div>
      </div>

      {/* Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Modal Overlay */}
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={closeModal}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white rounded-lg shadow-lg p-8 z-10 w-80">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={closeModal}
              aria-label="Close Modal"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">
              Choose an Option
            </h2>
            <div className="flex justify-around">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                onClick={() => handleOptionClick('option1')}
              >
                Option 1
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                onClick={() => handleOptionClick('option2')}
              >
                Option 2
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
