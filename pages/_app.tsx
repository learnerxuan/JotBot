// pages/_app.tsx
import '../styles/globals.css';
import { FirebaseProvider } from '../context/FirebaseContext';
import Sidebar from '../components/Sidebar';
import React from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router'; // Import useRouter

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  // Determine if the current route is the homepage
  const isHomePage = router.pathname === '/';

  return (
    <FirebaseProvider>
      <div className="min-h-screen p-4 flex flex-col md:flex-row md:space-x-4">
        <Sidebar userId={null} isAuthReady={false} />

        {/* Main content area - now conditionally styled */}
        <div className={`
          flex-1 m-2 overflow-y-auto relative z-10
          ${isHomePage 
            ? '' // No additional styling for homepage (it fills its own background)
            : 'bg-gradient-to-br from-gray-50 to-blue-50 p-6 md:p-10 rounded-lg shadow-xl' // Styling for other pages
          }
        `}>
          <Component {...pageProps} />
        </div>
      </div>
    </FirebaseProvider>
  );
}

export default MyApp;