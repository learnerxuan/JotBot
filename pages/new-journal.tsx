// pages/new-journal.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function NewJournalPage(): JSX.Element {
  const router = useRouter();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [aiResponseContent, setAiResponseContent] = useState<string>('');
  const [showAiResponse, setShowAiResponse] = useState<boolean>(false);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);

  const handleSaveJournal = () => {
    // In a real implementation, you'd send this data to your Next.js API route to save to Firestore
    console.log('Saving New Journal:', { title, content });
    // You would typically make a fetch request to another API route for saving
    // Example: fetch('/api/save-journal', { method: 'POST', body: JSON.stringify({ title, content }) });

    alert('Journal Saved! (This is a placeholder action)'); // Replace with proper UI confirmation

    // After saving, navigate back to the journal list
    router.push('/journal');
  };

  const handleIJournalClick = async () => {
    // Do not proceed if content is empty or already loading
    if (content.trim() === '' || isLoadingAi) {
      return;
    }

    setIsLoadingAi(true);
    setShowAiResponse(true); // Show the AI response section
    setAiResponseContent('MoodLingo is crafting your insights...'); // Set loading message

    try {
      // Make a fetch request to your new AI API route
      const response = await fetch('/api/generate-insight', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }), // Send the journal content
      });

      const data = await response.json();

      if (response.ok) {
        // If the API call was successful, display the AI insight
        setAiResponseContent(data.insight);
      } else {
        // If there was an error from the API route
        setAiResponseContent(`Error: ${data.error || 'Something went wrong with AI insight generation.'}`);
      }
    } catch (error) {
      console.error("Client-side error calling generate-insight API:", error);
      setAiResponseContent("Failed to connect to AI. Please check your network or try again.");
    } finally {
      setIsLoadingAi(false); // Always set loading to false when done
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-lg shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold text-indigo-800">New Journal Entry</h1>
        <Link href="/journal" passHref legacyBehavior>
          <a
            role="button"
            className="bg-gray-200 text-gray-700 px-5 py-3 rounded-xl font-semibold shadow-md hover:bg-gray-300 transition-colors flex items-center no-underline"
            aria-label="Back to Journal List"
          >
            <span className="text-xl mr-2">←</span> Back to List
          </a>
        </Link>
      </div>

      {/* Journal Title Input */}
      <input
        type="text"
        placeholder="Journal Title"
        className="w-full p-4 mb-4 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-xl font-semibold shadow-sm"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Journal Content Area */}
      <textarea
        placeholder="Write your thoughts and feelings here..."
        className="flex-grow w-full p-4 mb-6 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-base resize-none min-h-[300px] shadow-sm"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
        <button
          onClick={handleIJournalClick}
          className="bg-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-purple-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoadingAi || content.trim() === ''} // Disable if loading or content is empty
        >
          {isLoadingAi ? 'Processing...' : '💡 IJournal'}
        </button>
        <button
          onClick={handleSaveJournal}
          className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-indigo-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={title.trim() === '' || content.trim() === ''} // Disable if title or content is empty
        >
          💾 Save Journal
        </button>
      </div>

      {/* AI Response Area - Conditionally displayed */}
      {showAiResponse && (
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-blue-200">
          <h2 className="text-2xl font-bold text-indigo-700 mb-4 text-center">Your MoodLingo Insights ✨</h2>
          {isLoadingAi ? (
            <div className="text-center text-gray-500 text-lg py-4 animate-pulse">
              <p>MoodLingo is crafting your insights...</p>
              <p className="text-4xl mt-2">🧠</p>
            </div>
          ) : (
            <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
              {aiResponseContent}
            </p>
          )}
        </div>
      )}
    </div>
  );
}