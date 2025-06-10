// pages/journal/[id].tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

// Define the JournalEntry type
interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
}

export default function ViewJournalPage(): JSX.Element {
  const router = useRouter();
  const { id } = router.query; // Get the ID from the URL
  const [journal, setJournal] = useState<JournalEntry | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // This is a placeholder for fetching data from Firestore
  // In a real app, you'd use Firestore's getDoc or a query here
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      // Simulate data fetching delay
      setTimeout(() => {
        // This is a mock data source, replace with actual Firestore fetch
        const mockAllEntries: JournalEntry[] = [
          { id: '1', date: 'June 7, 2025', title: 'A productive day filled with learning', content: 'Today was a truly fulfilling day. I managed to complete all my planned tasks ahead of schedule, which gave me a great sense of accomplishment. The weather was lovely too, and I took a short walk during my break. Feeling positive and ready for tomorrow!' },
          { id: '2', date: 'June 6, 2025', title: 'Reflecting on yesterday\'s challenges', content: 'Yesterday was a bit rough. I faced some unexpected hurdles at work that left me feeling quite stressed gila. I spent a lot of time trying to figure things out, and ended the day feeling pening kepala. But I\'m trying to learn from it and move forward. Perhaps a long meditation tonight would help.' },
          { id: '3', date: 'June 5, 2025', title: 'First steps into MoodLingo development', content: 'Excited to start working on MoodLingo! The team is great, and the project vision is inspiring. There\'s a lot to learn with TypeScript and Next.js, but I\'m up for the challenge. Feeling hopeful about what we can achieve.' },
          { id: '4', date: 'May 30, 2025', title: 'A quiet evening of reflection', content: 'The rain outside made for a perfect evening to just sit and think. No particular stress, just a calm and peaceful atmosphere. I brewed some tea and read a good book. Simple moments like these are truly precious. 心累 sometimes, but not tonight.' },
        ];
        const foundJournal = mockAllEntries.find(entry => entry.id === id);
        setJournal(foundJournal || null);
        setIsLoading(false);
      }, 500); // Simulate network delay
    }
  }, [id]); // Re-run effect if ID changes

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-lg shadow-xl">
        <div className="text-center text-gray-500 text-xl py-8">
          <p>Loading journal entry...</p>
          <p className="text-5xl mt-4 animate-pulse">📖</p>
        </div>
      </div>
    );
  }

  if (!journal) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-red-50 to-orange-50 p-8 rounded-lg shadow-xl">
        <div className="text-center text-gray-600 text-xl py-8">
          <p>Journal entry not found.</p>
          <p className="text-5xl mt-4">😔</p>
          <Link href="/journal" passHref legacyBehavior>
            <a
              role="button"
              className="mt-6 inline-block bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-indigo-700 transition-colors no-underline"
            >
              Back to Journal List
            </a>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-lg shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold text-indigo-800">View Journal Entry</h1>
        <Link href="/journal" passHref legacyBehavior>
          <a
            role="button"
            className="bg-gray-200 text-gray-700 px-5 py-3 rounded-xl font-semibold shadow-md hover:bg-gray-300 transition-colors flex items-center"
            aria-label="Back to Journal List"
          >
            <span className="text-xl mr-2">←</span> Back to List
          </a>
        </Link>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-inner border border-gray-200 flex-grow overflow-y-auto">
        <p className="text-sm text-gray-500 mb-2">{journal.date}</p>
        <h2 className="text-3xl font-semibold text-indigo-700 mb-6">{journal.title}</h2>
        <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
          {journal.content}
        </p>
      </div>

      {/* You could add "Edit" or "Delete" buttons here in the future */}
      {/* Example:
      <div className="mt-6 flex justify-end space-x-4">
        <button className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600">Edit</button>
        <button className="bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600">Delete</button>
      </div>
      */}
    </div>
  );
}