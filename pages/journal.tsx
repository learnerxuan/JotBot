// pages/journal.tsx
import React, { useState } from 'react';
import { useFirebase } from '@/context/FirebaseContext';
import JournalModal from '@/components/JournalModal';

export default function JournalPage(): JSX.Element {
  const { userId, isAuthReady } = useFirebase();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [journalEntries, setJournalEntries] = useState<{ id: string; date: string; title: string }[]>([
    // Placeholder data for the list
    { id: '1', date: 'June 7, 2025', title: 'A productive day filled with learning' },
    { id: '2', date: 'June 6, 2025', title: 'Reflecting on yesterday\'s challenges' },
    { id: '3', date: 'June 5, 2025', title: 'First steps into MoodLingo development' },
  ]);

  const handleSaveJournal = (title: string, content: string) => {
    // In a real implementation, you'd save this to Firestore
    console.log('Saving Journal:', { title, content });
    const newEntry = {
      id: String(Date.now()), // Simple unique ID for placeholder
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      title: title || 'Untitled Journal', // Default title if none provided
    };
    setJournalEntries(prev => [newEntry, ...prev]); // Add to top of the list
    setIsModalOpen(false); // Close modal
    // Here you would integrate with your Next.js API route to save to Firestore
  };

  const handleIJournalClick = (title: string, content: string) => {
    // This function will eventually send the journal content to your AI for suggestions
    console.log('Running IJournal function for:', { title, content });
    // For now, just a console log.
    // In a real implementation, you might show a loading state or a separate modal for suggestions.
  };

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-4xl font-extrabold text-indigo-800 mb-8 text-center md:text-left">Smart Emotional Journal</h1>

      {/* Search Bar */}
      <div className="mb-8 relative">
        <input
          type="text"
          placeholder="Search journals by title or date..."
          className="w-full p-4 pl-12 border border-gray-300 rounded-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-lg"
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">🔍</span>
      </div>

      {/* Journal List Section */}
      <div className="flex-grow bg-indigo-50 p-6 rounded-2xl shadow-inner flex flex-col space-y-4 overflow-y-auto">
        <h2 className="text-2xl font-semibold text-indigo-700 mb-2">Your Journal Entries</h2>
        {journalEntries.length === 0 ? (
          <p className="text-gray-500 italic text-center py-8">No journal entries yet. Start writing!</p>
        ) : (
          journalEntries.map(entry => (
            <div
              key={entry.id}
              className="bg-white p-5 rounded-xl shadow-md border border-indigo-200 flex items-center justify-between transition-transform transform hover:scale-[1.01] cursor-pointer"
            >
              <div>
                <p className="text-sm text-gray-500">{entry.date}</p>
                <h3 className="text-xl font-semibold text-indigo-800">{entry.title}</h3>
              </div>
              {/* Optional: Add a button to view/edit entry later */}
              {/* <button className="text-indigo-600 hover:text-indigo-800 font-medium">View</button> */}
            </div>
          ))
        )}
      </div>

      {/* Floating Action Button to Add New Journal */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 bg-indigo-600 text-white rounded-full p-5 text-4xl shadow-xl hover:bg-indigo-700 transition-transform transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-indigo-300 z-40"
        aria-label="Add New Journal"
      >
        +
      </button>

      {/* Journal Modal Component */}
      <JournalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveJournal}
        onIJournalClick={handleIJournalClick}
      />
    </div>
  );
}