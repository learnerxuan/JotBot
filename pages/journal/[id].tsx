// pages/journal/[id].tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
// Import Firestore functions for fetching a single document
import { doc, getDoc } from 'firebase/firestore';
import { useFirebase } from '../../context/FirebaseContext'; // Correct relative path

// Define the JournalEntry type
interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  aiInsight?: string | null; // AI insight is optional
}

export default function ViewJournalPage(): JSX.Element {
  const router = useRouter();
  const { id } = router.query; // Get the ID from the URL (this will be the Firestore doc ID)
  // Access Firestore database instance, user ID, and auth readiness
  const { db, userId, isAuthReady } = useFirebase();

  const [journal, setJournal] = useState<JournalEntry | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // useEffect to fetch the specific journal entry from Firestore
  useEffect(() => {
    // Only attempt to fetch if Firebase is ready, we have a userId, db, and a journal ID from the URL
    if (isAuthReady && userId && db && typeof id === 'string') {
      setIsLoading(true); // Set loading to true when starting fetch

      // Get the appId from environment variable or global variable
      const appId = process.env.NEXT_PUBLIC_APP_ID || (typeof __app_id !== 'undefined' ? __app_id : 'default-app-id');
      
      // Construct the document reference
      const docRef = doc(db, `artifacts/${appId}/users/${userId}/journalEntries`, id);

      const fetchJournal = async () => {
        try {
          const docSnap = await getDoc(docRef); // Fetch the document

          if (docSnap.exists()) {
            const data = docSnap.data();
            // Format createdAt timestamp to a displayable date string
            const createdAtDate = data.createdAt?.toDate ? data.createdAt.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'No Date';

            setJournal({
              id: docSnap.id,
              date: createdAtDate,
              title: data.title,
              content: data.content,
              aiInsight: data.aiInsight || null, // Include AI insight if it exists
            });
          } else {
            console.log("No such document!");
            setJournal(null); // Set to null if not found
          }
        } catch (error) {
          console.error("Error fetching document:", error);
          alert("Failed to load journal entry. Please check your internet connection.");
          setJournal(null); // Set to null on error
        } finally {
          setIsLoading(false); // Always set loading to false when done
        }
      };

      fetchJournal(); // Execute the fetch
    } else if (!isAuthReady || !userId || !db) {
        // If Firebase not ready or userId/db is null, stop loading and set journal to null
        setIsLoading(false);
        setJournal(null);
        if (!isAuthReady || !userId) {
            console.warn("Cannot fetch individual journal: Firebase not ready or userId is null.");
        } else {
            console.warn("Cannot fetch individual journal: db instance is null.");
        }
    }
  }, [id, db, userId, isAuthReady]); // Dependencies: re-run effect if id, db, userId, or isAuthReady changes

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
          <p>Journal entry not found or failed to load.</p>
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
            className="bg-gray-200 text-gray-700 px-5 py-3 rounded-xl font-semibold shadow-md hover:bg-gray-300 transition-colors flex items-center no-underline"
            aria-label="Back to Journal List"
          >
            <span className="text-xl mr-2">←</span> Back to List
          </a>
        </Link>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-inner border border-gray-200 flex-grow overflow-y-auto">
        <p className="text-sm text-gray-500 mb-2">{journal.date}</p>
        <h2 className="text-3xl font-semibold text-indigo-700 mb-6">{journal.title}</h2>
        <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap mb-6">
          {journal.content}
        </p>

        {/* Display AI Insight if available */}
        {journal.aiInsight && (
          <div className="mt-8 pt-6 border-t border-blue-200">
            <h3 className="text-2xl font-bold text-purple-700 mb-3 text-center">MoodLingo AI Insight ✨</h3>
            <p className="bg-purple-50 text-purple-800 p-5 rounded-xl border border-purple-200 italic leading-relaxed whitespace-pre-wrap">
              "{journal.aiInsight}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}