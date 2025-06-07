// pages/prompts.tsx
import React from 'react';

export default function MindfulMomentsPage(): JSX.Element {
  return (
    <div className="flex flex-col h-full">
      <h1 className="text-4xl font-extrabold text-yellow-800 mb-8 text-center md:text-left">Mindful Moment Prompts</h1>
      <div className="flex-grow bg-yellow-50 p-6 rounded-2xl shadow-inner flex flex-col space-y-6">
        <div className="bg-white p-5 rounded-xl shadow-md border border-yellow-200">
          <h2 className="text-2xl font-semibold text-yellow-700 mb-3">Your Personalized Nudges</h2>
          <div className="border border-yellow-300 p-4 rounded-lg bg-yellow-100/50 min-h-[200px] flex items-center justify-center text-gray-600 text-lg italic">
            <p>Personalized mindful moments and self-help suggestions will appear here, gently guiding you.</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-md border border-yellow-200">
          <h2 className="text-2xl font-semibold text-yellow-700 mb-3">Explore All Prompts</h2>
          <div className="border border-yellow-300 p-4 rounded-lg bg-yellow-100/50 min-h-[150px] flex items-center justify-center text-gray-600 italic">
            <p>A library of all available mindful prompts for you to explore.</p>
          </div>
        </div>
      </div>
    </div>
  );
}