// pages/journal.tsx
import React, { useState, useMemo } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import Link from 'next/link'; // Import Link for navigation

// Define the JournalEntry type for better type safety
interface JournalEntry {
  id: string;
  date: string; // Format like 'June 7, 2025'
  title: string;
  content: string; // Full content for viewing
}

export default function JournalPage(): JSX.Element {
  const { userId, isAuthReady } = useFirebase();

  // Placeholder data for the list of journal entries
  // In a real app, this would be fetched from Firestore
  const [allJournalEntries, setAllJournalEntries] = useState<JournalEntry[]>([
    { id: '1', date: 'June 7, 2025', title: 'A productive day filled with learning', content: 'Today was a truly fulfilling day. I managed to complete all my planned tasks ahead of schedule, which gave me a great sense of accomplishment. The weather was lovely too, and I took a short walk during my break. Feeling positive and ready for tomorrow!' },
    { id: '2', date: 'June 6, 2025', title: 'Reflecting on yesterday\'s challenges', content: 'Yesterday was a bit rough. I faced some unexpected hurdles at work that left me feeling quite stressed gila. I spent a lot of time trying to figure things out, and ended the day feeling pening kepala. But I\'m trying to learn from it and move forward. Perhaps a long meditation tonight would help.' },
    { id: '3', date: 'June 5, 2025', title: 'First steps into MoodLingo development', content: 'Excited to start working on MoodLingo! The team is great, and the project vision is inspiring. There\'s a lot to learn with TypeScript and Next.js, but I\'m up for the challenge. Feeling hopeful about what we can achieve.' },
    { id: '4', date: 'May 30, 2025', title: 'A quiet evening of reflection', content: 'The rain outside made for a perfect evening to just sit and think. No particular stress, just a calm and peaceful atmosphere. I brewed some tea and read a good book. Simple moments like these are truly precious. 心累 sometimes, but not tonight.' },
  ]);

  const [searchTerm, setSearchTerm] = useState<string>('');

  // Filtered journal entries based on search term
  const filteredJournalEntries = useMemo(() => {
    if (!searchTerm) {
      return allJournalEntries; // If no search term, return all entries
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return allJournalEntries.filter(entry =>
      entry.title.toLowerCase().includes(lowerCaseSearchTerm) ||
      entry.date.toLowerCase().includes(lowerCaseSearchTerm) ||
      entry.content.toLowerCase().includes(lowerCaseSearchTerm) // Also search content for better filtering
    );
  }, [allJournalEntries, searchTerm]); // Recalculate only when allJournalEntries or searchTerm changes

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-4xl font-extrabold text-indigo-800 mb-8 text-center md:text-left">Smart Emotional Journal</h1>

      {/* Search Bar */}
      <div className="mb-8 relative">
        <input
          type="text"
          placeholder="Search journals by title, date, or content..."
          className="w-full p-4 pl-12 border border-gray-300 rounded-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-lg font-normal"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term state
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">🔍</span>
      </div>

      {/* Journal List Section */}
      <div className="flex-grow bg-indigo-50 p-6 rounded-2xl shadow-inner flex flex-col space-y-4 overflow-y-auto">
        <h2 className="text-2xl font-semibold text-indigo-700 mb-2">Your Journal Entries</h2>
        {filteredJournalEntries.length === 0 ? (
          <p className="text-gray-500 italic text-center py-8">No journal entries found matching your search.</p>
        ) : (
          filteredJournalEntries.map(entry => (
            <Link href={`/journal/${entry.id}`} key={entry.id} passHref legacyBehavior>
              <a
                className="bg-white p-5 rounded-xl shadow-md border border-indigo-200 flex items-center justify-between transition-transform transform hover:scale-[1.01] cursor-pointer no-underline text-current"
                aria-label={`View journal: ${entry.title}`}
              >
                <div>
                  <p className="text-sm text-gray-500">{entry.date}</p>
                  <h3 className="text-xl font-semibold text-indigo-800">{entry.title}</h3>
                </div>
              </a>
            </Link>
          ))
        )}
      </div>

      {/* Floating Action Button to Add New Journal - Now navigates to a new page */}
      <Link href="/new-journal" passHref legacyBehavior>
        <a
          role="button"
          aria-label="Add New Journal"
          className="fixed bottom-8 right-8 bg-indigo-600 text-white rounded-full p-5 text-4xl shadow-xl hover:bg-indigo-700 transition-transform transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-indigo-300 z-40 no-underline"
        >
          +
        </a>
      </Link>
    </div>
  );
}