// pages/index.tsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link'; // For navigation buttons
import { quotes } from '../data/quotes'; // Import your quotes

export default function Home(): JSX.Element {
  const [currentQuote, setCurrentQuote] = useState<string>('');

  useEffect(() => {
    // Select a random quote on component mount
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setCurrentQuote(quotes[randomIndex]);
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] p-4 text-center">
      {/* Background elements for calming Vibe */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 opacity-80 rounded-lg z-0"></div>
      <div className="absolute inset-0 bg-pattern-dots opacity-10 z-0"></div> {/* Optional subtle pattern */}

      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        {/* Daily Aspirational Quote */}
        <div className="max-w-3xl mb-12 bg-white/70 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-blue-200">
          <p className="text-3xl md:text-4xl font-semibold text-gray-800 leading-relaxed italic">
            "{currentQuote}"
          </p>
          <p className="mt-6 text-xl text-gray-600 font-medium">— Your Daily Inspiration</p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-8 mt-8">
          <Link href="/journal" passHref>
            <button className="flex flex-col items-center justify-center p-8 bg-indigo-500 text-white rounded-3xl shadow-xl hover:bg-indigo-600 transition-all duration-300 transform hover:scale-105 group">
              <span className="text-5xl mb-4 transition-transform group-hover:rotate-6">📝</span>
              <span className="text-2xl font-bold">Journal</span>
              <span className="text-sm mt-1 opacity-80">Express & Reflect</span>
            </button>
          </Link>
          <Link href="/garden" passHref>
            <button className="flex flex-col items-center justify-center p-8 bg-green-500 text-white rounded-3xl shadow-xl hover:bg-green-600 transition-all duration-300 transform hover:scale-105 group">
              <span className="text-5xl mb-4 transition-transform group-hover:scale-110">🌳</span>
              <span className="text-2xl font-bold">Emotion Garden</span>
              <span className="text-sm mt-1 opacity-80">Track Your Growth</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}