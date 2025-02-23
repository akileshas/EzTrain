
'use client';

import React from 'react';

export default function HowToUseSection() {
  return (
    <section className="mx-[20%] py-10">
      <h2 className="text-5xl font-bold text-center mb-20">How do I use it?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 1. Gather */}
        <div className="flex flex-col items-center text-center">
          <div className="w-32 h-32 bg-gray-200 flex items-center justify-center mb-4">
           
						<img src="1.svg" alt="1" />
          </div>
          <h3 className="text-3xl font-bold mb-2">1 Gather</h3>
          <p className="text-gray-600 h-24 w-60 mb-2 mt-4">
            Gather and group your examples into classes, or categories, that you want the computer to learn.
          </p>
          <p className="text-blue-600 mt-5 font-semibold">Video: Gather samples</p>
        </div>

        {/* 2. Train */}
        <div className="flex flex-col items-center text-center">
          <div className="w-32 h-32 bg-gray-200 flex items-center justify-center mb-4">
            
						<img src="2.svg" alt="2" />

          </div>
          <h3 className="text-3xl font-bold mb-2">2 Train</h3>
          <p className="text-gray-600 h-24 w-60 mb-2 mt-4">
            Train your model, then instantly test it out to see whether it can correctly classify new examples.
          </p>
          <p className="text-blue-600 mt-5 font-semibold">Video: Train your model</p>
        </div>

        {/* 3. Export */}
        <div className="flex flex-col items-center text-center">
          <div className="w-32 h-32 bg-gray-200 flex items-center justify-center mb-4">
            
						<img src="3.svg" alt="3" />

          </div>
          <h3 className="text-3xl font-bold mb-2">3 Export</h3>
          <p className="text-gray-600 h-24 w-60 mb-2 mt-4">
            Export your model for your projects: sites, apps, and more. You can download your model or host it online.
          </p>
          <p className="text-blue-600 mt-5 font-semibold">Video: Export your model</p>
        </div>
      </div>
    </section>
  );
}
