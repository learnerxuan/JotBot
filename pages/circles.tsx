// pages/circles.tsx
import React from 'react';

export default function PeerSupportPage(): JSX.Element {
  return (
    <div className="flex flex-col h-full">
      <h1 className="text-4xl font-extrabold text-blue-800 mb-8 text-center md:text-left">Anonymous Peer Support Circles</h1>
      <div className="flex-grow bg-blue-50 p-6 rounded-2xl shadow-inner flex flex-col space-y-6">
        <div className="bg-white p-5 rounded-xl shadow-md border border-blue-200">
          <h2 className="text-2xl font-semibold text-blue-700 mb-3">Discover & Join Circles</h2>
          <div className="border border-blue-300 p-4 rounded-lg bg-blue-100/50 min-h-[150px] flex items-center justify-center text-gray-600 text-lg italic">
            <p>List of anonymous support circles to connect with others.</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-md border border-blue-200">
          <h2 className="text-2xl font-semibold text-blue-700 mb-3">Active Chat (if joined)</h2>
          <div className="border border-blue-300 p-4 rounded-lg bg-blue-100/50 min-h-[250px] flex flex-col justify-end text-gray-600 italic">
            <p className="text-center">Chat messages will appear here in real-time.</p>
            <div className="mt-4 flex space-x-2">
              <input
                type="text"
                placeholder="Type your anonymous message..."
                className="flex-grow p-3 border border-blue-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
              <button className="bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-colors">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}