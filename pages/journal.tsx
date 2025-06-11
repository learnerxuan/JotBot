// pages/journal.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import Link from 'next/link';
// Import necessary Firestore functions for fetching and deleting
import { collection, query, orderBy, onSnapshot, DocumentData, deleteDoc, doc } from 'firebase/firestore';
import ConfirmationModal from '../components/ConfirmationModal'; // Import the modal

// Define the JournalEntry type for better type safety
interface JournalEntry {
  id: string;
  date: string; // Format like 'June 7, 2025'
  title: string;
  content: string; // Full content for viewing
  aiInsight?: string | null; // AI insight is optional
  createdAt: {
    seconds: number;
    nanoseconds: number;
    toDate: () => Date; // Function to convert to Date object
  };
}

export default function JournalPage(): JSX.Element {
  // Access Firestore database instance, user ID, and auth readiness
  const { db, userId, isAuthReady } = useFirebase();

  // State to hold the fetched journal entries
  const [allJournalEntries, setAllJournalEntries] = useState<JournalEntry[]>([]);
  // State for loading status of journals list
  const [isLoadingJournals, setIsLoadingJournals] = useState<boolean>(true);
  // State for the search bar input
  const [searchTerm, setSearchTerm] = useState<string>('');

  // States for confirmation modal
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [journalToDeleteId, setJournalToDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false); // New state for delete loading

  // useEffect to fetch journals from Firestore in real-time
  useEffect(() => {
    // Only attempt to fetch if Firebase is ready and we have a userId and db instance
    if (isAuthReady && userId && db) {
      setIsLoadingJournals(true); // Set loading to true when starting fetch

      // Get the appId from environment variable or global variable
      const appId = process.env.NEXT_PUBLIC_APP_ID || (typeof __app_id !== 'undefined' ? __app_id : 'default-app-id');
      
      // Construct the Firestore query:
      // 1. Target the user's specific journalEntries collection
      // 2. Order by 'createdAt' in descending order (latest first)
      const journalCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/journalEntries`);
      const q = query(
        journalCollectionRef,
        orderBy('createdAt', 'desc') // Order by timestamp to get latest first
      );

      // Set up a real-time listener using onSnapshot
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const fetchedJournals: JournalEntry[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as Omit<JournalEntry, 'id' | 'date'> & { createdAt: DocumentData };
          // Format date for display
          const date = data.createdAt?.toDate ? data.createdAt.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'No Date';
          
          fetchedJournals.push({
            id: doc.id,
            date: date,
            title: data.title,
            content: data.content,
            aiInsight: data.aiInsight || null,
            createdAt: data.createdAt as { seconds: number; nanoseconds: number; toDate: () => Date; }, // Store original createdAt for sorting if needed
          });
        });
        setAllJournalEntries(fetchedJournals); // Update state with fetched journals
        setIsLoadingJournals(false); // Set loading to false once data is received
      }, (error) => {
        console.error("Error fetching journals:", error);
        alert("Failed to load journals. Please check your internet connection.");
        setIsLoadingJournals(false); // Stop loading on error
      });

      // Cleanup function: unsubscribe from the listener when the component unmounts
      return () => unsubscribe();
    } else if (!isAuthReady) {
        setIsLoadingJournals(true); // Keep loading if auth not ready
    } else { // !userId || !db
        setIsLoadingJournals(false);
        setAllJournalEntries([]); // No journals if no user/db
        console.warn("Cannot fetch journals: userId or db is null/undefined after auth readiness.");
    }
  }, [db, userId, isAuthReady]); // Dependencies: re-run effect if db, userId, or isAuthReady changes

  // Filtered journal entries based on search term (uses fetched data now)
  const filteredJournals = useMemo(() => {
    if (!searchTerm) {
      return allJournalEntries; // If no search term, return all fetched entries
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return allJournalEntries.filter(entry =>
      entry.title.toLowerCase().includes(lowerCaseSearchTerm) ||
      entry.date.toLowerCase().includes(lowerCaseSearchTerm) ||
      entry.content.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [allJournalEntries, searchTerm]);

  // Function to handle click on delete icon
  const openConfirmDeleteModal = (e: React.MouseEvent, journalId: string) => {
    e.stopPropagation(); // Prevent click from bubbling to parent Link
    e.preventDefault();  // Prevent default Link navigation
    setJournalToDeleteId(journalId);
    setIsConfirmModalOpen(true);
  };

  const handleCancelDelete = () => {
    setIsConfirmModalOpen(false);
    setJournalToDeleteId(null);
  };

  const handleDeleteJournal = async () => {
    if (!journalToDeleteId || !db || !userId) return; // Ensure we have an ID, db, and user

    setIsDeleting(true); // Set deleting loading state
    console.log(`Attempting to delete journal with ID: ${journalToDeleteId}`);

    try {
      const appId = process.env.NEXT_PUBLIC_APP_ID || (typeof __app_id !== 'undefined' ? __app_id : 'default-app-id');
      const docPath = `artifacts/${appId}/users/${userId}/journalEntries/${journalToDeleteId}`;
      
      await deleteDoc(doc(db, docPath)); // Delete the document from Firestore

      console.log(`Journal ${journalToDeleteId} deleted successfully.`);
      // The onSnapshot listener will automatically update the list, no need to manually remove from state
      
      handleCancelDelete(); // Close modal and reset states
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Failed to delete journal. Please try again."); // Keep this alert for error feedback
    } finally {
      setIsDeleting(false); // Reset deleting loading state
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      <h1 className="text-4xl font-extrabold text-indigo-800 mb-8 text-center md:text-left">Smart Emotional Journal</h1>

      {/* Search Bar */}
      <div className="mb-8 relative">
        <input
          type="text"
          placeholder="Search journals by title, date, or content..."
          className="w-full p-4 pl-12 border border-gray-300 rounded-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-lg font-normal"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">🔍</span>
      </div>

      {/* Journal List Section */}
      <div className="flex-grow bg-indigo-50 p-6 rounded-2xl shadow-inner flex flex-col space-y-4 overflow-y-auto">
        <h2 className="text-2xl font-semibold text-indigo-700 mb-2">Your Journal Entries</h2>
        
        {isLoadingJournals ? (
          <div className="text-center text-gray-500 text-lg py-8">
            <p>Loading your journals...</p>
            <p className="text-5xl mt-4 animate-pulse">📖</p>
          </div>
        ) : filteredJournals.length === 0 ? (
          <p className="text-gray-500 italic text-center py-8">
            {searchTerm ? "No journal entries found matching your search." : "No journal entries yet. Click '+' to start writing!"}
          </p>
        ) : (
          filteredJournals.map(entry => (
            <Link href={`/journal/${entry.id}`} key={entry.id} passHref legacyBehavior>
              <a
                className="bg-white p-5 rounded-xl shadow-md border border-indigo-200 flex items-center justify-between transition-transform transform hover:scale-[1.01] cursor-pointer no-underline text-current"
                aria-label={`View journal: ${entry.title}`}
              >
                <div>
                  <p className="text-sm text-gray-500">{entry.date}</p>
                  <h3 className="text-xl font-semibold text-indigo-800">{entry.title}</h3>
                </div>
                {/* Delete Button */}
                <button
                  onClick={(e) => openConfirmDeleteModal(e, entry.id)} // Pass event and ID
                  className="bg-red-100 text-red-600 p-2 rounded-full hover:bg-red-200 transition-colors ml-4 shadow-sm"
                  aria-label={`Delete journal: ${entry.title}`}
                  disabled={isDeleting} // Disable if deletion is in progress
                >
                  <span className="text-xl">🗑️</span> {/* Trash can emoji */}
                </button>
              </a>
            </Link>
          ))
        )}
      </div>

      {/* Floating Action Button to Add New Journal */}
      <Link href="/new-journal" passHref legacyBehavior>
        <a
          role="button"
          aria-label="Add New Journal"
          className="fixed bottom-8 right-8 bg-indigo-600 text-white rounded-full p-5 text-4xl shadow-xl hover:bg-indigo-700 transition-transform transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-indigo-300 z-40 no-underline"
        >
          +
        </a>
      </Link>

      {/* Confirmation Modal - now with transparent overlay and backdrop-blur */}
      {isConfirmModalOpen && (
        // The overlay div is now transparent, but still covers the screen and centers the modal.
        // It also applies a backdrop blur.
        <div className="fixed inset-0 bg-transparent flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <ConfirmationModal
            isOpen={isConfirmModalOpen} // This will always be true when this div is rendered
            onCancel={handleCancelDelete}
            onConfirm={handleDeleteJournal}
            title="Confirm Deletion"
            message="Are you sure you want to permanently delete this journal entry? This action cannot be undone."
            confirmText="Delete"
            isLoading={isDeleting}
          />
        </div>
      )}
    </div>
  );
}