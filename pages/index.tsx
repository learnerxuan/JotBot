// pages/index.tsx
import React from 'react';

export default function Home() {
  return (
    <div className="text-center text-gray-500 py-16">
      <h1 className="text-5xl font-extrabold text-purple-800 mb-6 tracking-tight">Welcome to MoodLingo! 🌈</h1>
      <p className="text-xl leading-relaxed mb-8 max-w-2xl mx-auto">
        Your private space to express, understand, and nurture your emotional well-being across cultures.
      </p>
      <h3 className="text-3xl font-semibold mb-4 text-indigo-700">Ready to begin your journey?</h3>
      <p className="text-lg">
        Select a section from the sidebar to explore your emotions, grow your garden, connect with peers, or find mindful moments.
      </p>
    </div>
  );
}