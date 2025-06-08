// pages/garden.tsx
import React from 'react';

export default function EmotionGardenPage() {
  return (
    <div className="flex flex-col h-full">
      <h1 className="text-4xl font-extrabold text-green-800 mb-8 text-center md:text-left">Dynamic Emotion Garden</h1>
      <div className="flex-grow bg-green-50 p-6 rounded-2xl shadow-inner flex flex-col space-y-6">
        <div className="bg-white p-5 rounded-xl shadow-md border border-green-200">
          <h2 className="text-2xl font-semibold text-green-700 mb-3">Your Emotional Landscape</h2>
          <div className="border border-green-300 p-4 rounded-lg bg-green-100/50 min-h-[300px] flex items-center justify-center text-gray-600 text-xl italic">
            <p>Beautiful visualization of your emotional well-being over time will grow here!</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-md border border-green-200">
          <h2 className="text-2xl font-semibold text-green-700 mb-3">Trends & Insights</h2>
          <div className="border border-green-300 p-4 rounded-lg bg-green-100/50 min-h-[100px] flex items-center justify-center text-gray-600 italic">
            <p>Detailed trends and insights from your emotional journey will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}