// pages/journal.tsx
import React, { useState, useMemo } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import JournalModal from '../components/JournalModal';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Define the JournalEntry type for better type safety
interface JournalEntry {
  id: string;
  date: string; // Format like 'June 7, 2025'
  title: string;
  content: string; // Full content for viewing
}

export default function JournalPage() {
  const { userId, isAuthReady } = useFirebase();

  // State for controlling the modal's visibility
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  // State to hold the journal entry being viewed/edited (null for new entry)
  const [selectedJournal, setSelectedJournal] = useState<JournalEntry | null>(null);
  // State for the search bar input
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Placeholder data for the list of journal entries
  // In a real app, this would be fetched from Firestore
  const [allJournalEntries, setAllJournalEntries] = useState<JournalEntry[]>([
    { id: '1', date: 'June 7, 2025', title: 'A productive day filled with learning', content: 'Today was a truly fulfilling day. I managed to complete all my planned tasks ahead of schedule, which gave me a great sense of accomplishment. The weather was lovely too, and I took a short walk during my break. Feeling positive and ready for tomorrow!' },
    { id: '2', date: 'June 6, 2025', title: 'Reflecting on yesterday\'s challenges', content: 'Yesterday was a bit rough. I faced some unexpected hurdles at work that left me feeling quite stressed gila. I spent a lot of time trying to figure things out, and ended the day feeling pening kepala. But I\'m trying to learn from it and move forward. Perhaps a long meditation tonight would help.' },
    { id: '3', date: 'June 5, 2025', title: 'First steps into MoodLingo development', content: 'Excited to start working on MoodLingo! The team is great, and the project vision is inspiring. There\'s a lot to learn with TypeScript and Next.js, but I\'m up for the challenge. Feeling hopeful about what we can achieve.' },
    { id: '4', date: 'May 30, 2025', title: 'A quiet evening of reflection', content: 'The rain outside made for a perfect evening to just sit and think. No particular stress, just a calm and peaceful atmosphere. I brewed some tea and read a good book. Simple moments like these are truly precious. 心累 sometimes, but not tonight.' },
  ]);

  // Filtered journal entries based on search term
  const filteredJournalEntries = useMemo(() => {
    if (!searchTerm) {
      return allJournalEntries; // If no search term, return all entries
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return allJournalEntries.filter(entry =>
      entry.title.toLowerCase().includes(lowerCaseSearchTerm) ||
      entry.date.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [allJournalEntries, searchTerm]);

  const handleSaveJournal = (title: string, content: string) => {
    // In a real implementation, you'd send this to your Next.js API route to save to Firestore
    console.log('Saving Journal:', { title, content });

    const newEntry: JournalEntry = {
      id: String(Date.now()), // Simple unique ID for placeholder
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      title: title || 'Untitled Journal',
      content: content,
    };
    setAllJournalEntries(prev => [newEntry, ...prev]);
    setIsModalOpen(false);
    setSelectedJournal(null); // Clear selected journal
  };

  const handleIJournalClick = (title: string, content: string) => {
    console.log('Running IJournal function for:', { title, content });
  };

  const handleViewJournal = (entry: JournalEntry) => {
    setSelectedJournal(entry);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJournal(null); // Clear selected journal when closing
  };

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

const handleAIFeedback = async (content: string) => {
  let reply: string | undefined;
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-05-20' });

    // Actual "ask AI then AI answers" process is here
    const prompt = `Following is the content of a human-written diary: ${content}. Read it, then give a simple feedback of it, and respond to it like you're talking to the user who wrote the content. Simply your response to a sentence and only use that as your output.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    reply = response.text();
    
  } catch (error) {
    console.error("Error connecting to Gemini AI:", error);
    reply = undefined;
  }
  if (reply) {
    console.log("AI Reply:", reply);
  } else {
    console.log("error")
  }
};

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-4xl font-extrabold text-indigo-800 mb-8 text-center md:text-left">Smart Emotional Journal</h1>

      {/* Search Bar */}
      <div className="mb-8 relative">
        <input
          type="text"
          placeholder="Search journals by title or date..."
          className="w-full p-4 pl-12 border border-gray-300 rounded-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-lg font-normal"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
            <div
              key={entry.id}
              className="bg-white p-5 rounded-xl shadow-md border border-indigo-200 flex items-center justify-between transition-transform transform hover:scale-[1.01] cursor-pointer"
              onClick={() => handleViewJournal(entry)}
            >
              <div>
                <p className="text-sm text-gray-500">{entry.date}</p>
                <h3 className="text-xl font-semibold text-indigo-800">{entry.title}</h3>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating Action Button to Add New Journal */}
      <button
        onClick={() => {
          setSelectedJournal(null);
          setIsModalOpen(true);
        }}
        className="fixed bottom-8 right-8 bg-indigo-600 text-white rounded-full p-5 text-4xl shadow-xl hover:bg-indigo-700 transition-transform transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-indigo-300 z-40"
        aria-label="Add New Journal"
      >
        +
      </button>

      {/* Journal Modal Component */}
      <JournalModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveJournal}
        onIJournalClick={handleIJournalClick}
        initialTitle={selectedJournal?.title || ''}
        initialContent={selectedJournal?.content || ''}
        isViewMode={selectedJournal !== null}
        onAIFeedbackClick={handleAIFeedback}
      />
    </div>
  );
}