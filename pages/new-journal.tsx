// pages/new-journal.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
// Import necessary Firestore functions
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
// Import useFirebase hook to access db and userId
import { useFirebase } from '../context/FirebaseContext';
// Import Google Generative AI SDK (will be used via API route, but included for completeness)
// import { GoogleGenerativeAI } from '@google/generative-ai'; // No longer needed here, moved to API route

export default function NewJournalPage(): JSX.Element {
  const router = useRouter();
  // Access Firestore database instance and current user ID
  const { db, userId, isAuthReady } = useFirebase();

  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [aiResponseContent, setAiResponseContent] = useState<string>('');
  const [showAiResponse, setShowAiResponse] = useState<boolean>(false);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [isSavingJournal, setIsSavingJournal] = useState<boolean>(false); // New state for saving loading

  const handleSaveJournal = async () => {
    // Disable button if already saving or content is empty
    if (isSavingJournal || title.trim() === '' || content.trim() === '' || !db || !userId) {
      // Show a message if not authenticated yet
      if (!isAuthReady || !userId) {
        alert("Please wait, MoodLingo is connecting. Try again in a moment!");
      }
      return;
    }

    setIsSavingJournal(true); // Start saving loading state
    console.log('Attempting to save journal to Firestore...');

    try {
      // Create a new document in the user's private 'journalEntries' collection
      // Path: /artifacts/{appId}/users/{userId}/journalEntries/{docId}
      // Assuming __app_id is available globally or through an environment variable
      const appId = process.env.NEXT_PUBLIC_APP_ID || (typeof __app_id !== 'undefined' ? __app_id : 'default-app-id');
      const docRef = await addDoc(collection(db, `artifacts/${appId}/users/${userId}/journalEntries`), {
        title: title.trim(),
        content: content.trim(),
        aiInsight: aiResponseContent || null, // Store AI response if generated
        createdAt: serverTimestamp(), // Firestore generates timestamp on the server
        // You might add other fields like mood_tags, emotion_score later from AI analysis
      });

      console.log("Journal written with ID: ", docRef.id);
      // Optional: Show a brief success message
      // alert('Journal Saved Successfully!');

      // Clear form and navigate back to the journal list
      setTitle('');
      setContent('');
      setAiResponseContent('');
      setShowAiResponse(false);
      router.push('/journal');

    } catch (e) {
      console.error("Error adding document: ", e);
      alert('Failed to save journal. Please try again or check your network.'); // User-friendly error
    } finally {
      setIsSavingJournal(false); // End saving loading state
    }
  };

  const handleIJournalClick = async () => {
    if (content.trim() === '' || isLoadingAi) {
      return;
    }
    // Check if Firebase auth is ready and userId is available
    if (!isAuthReady || !userId) {
      alert("Please wait, MoodLingo is connecting. Try again in a moment before generating insights!");
      return;
    }

    setIsLoadingAi(true);
    setShowAiResponse(true);
    setAiResponseContent('MoodLingo is crafting your insights...');

    try {
      const response = await fetch('/api/generate-insight', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });

      const data = await response.json();

      if (response.ok) {
        setAiResponseContent(data.insight);
      } else {
        setAiResponseContent(`Error: ${data.error || 'Something went wrong with AI insight generation.'}`);
      }
    } catch (error) {
      console.error("Client-side error calling generate-insight API:", error);
      setAiResponseContent("Failed to connect to AI. Please check your network or try again.");
    } finally {
      setIsLoadingAi(false);
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
          disabled={isLoadingAi || content.trim() === '' || !isAuthReady || !userId} // Disable if loading, content is empty, or not authenticated
        >
          {isLoadingAi ? 'Processing...' : '💡 IJournal'}
        </button>
        <button
          onClick={handleSaveJournal}
          className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-indigo-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSavingJournal || title.trim() === '' || content.trim() === '' || !isAuthReady || !userId} // Disable if saving, content/title empty, or not authenticated
        >
          {isSavingJournal ? 'Saving...' : '💾 Save Journal'}
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