
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function ContentWithVideo() {
  const router = useRouter();
	const handleClick = ()=>{
			
      router.push(`/train`);
	};
  return (
    <section className="mx-[20%] my-[10%] py-10 flex flex-col md:flex-row items-start justify-between">
      {/* Left Content */}
      <div className="max-w-md">
        <h1 className="text-4xl font-bold mb-4">Your Title Here</h1>
        <p className="text-gray-600 mb-6">
          Here is some descriptive text about your project or product. 
          Keep it concise, engaging, and informative for the reader.
        </p>
        <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition" onClick={handleClick}>
          Get Started
        </button>
      </div>

      {/* Right Video */}
      <div className="w-full md:w-1/2 mt-8 md:mt-0 md:ml-8">
        <iframe
          width="100%"
          height="315"
          src="https://www.youtube.com/embed/VIDEO_ID"
          title="Video Example"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </section>
  );
}
