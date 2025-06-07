// pages/_app.tsx
import '../styles/globals.css';
import { FirebaseProvider } from '../context/FirebaseContext';
import Sidebar from '../components/Sidebar'; // Import Sidebar
import React from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router'; // Import useRouter

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  // Determine activePage from router.pathname to highlight sidebar correctly
  // Example: /journal -> 'journal', /garden -> 'garden', / -> 'journal' (default)
  const activePage = router.pathname.split('/')[1] || 'journal';

  return (
    <FirebaseProvider>
      <div className="min-h-screen p-4 flex flex-col md:flex-row items-stretch justify-center md:space-x-4">
        {/* Sidebar uses router.pathname to determine active link */}
        <Sidebar userId={null} isAuthReady={false} /> {/* userId and isAuthReady are placeholder in Sidebar for now, derived from context */}

        {/* Main content area */}
        <div className="flex-1 bg-white p-6 md:p-10 rounded-lg shadow-xl m-2 overflow-y-auto">
          <Component {...pageProps} />
        </div>
      </div>
    </FirebaseProvider>
  );
}

export default MyApp;