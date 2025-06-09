// pages/_app.tsx
import '../styles/globals.css';
import { FirebaseProvider } from '../context/FirebaseContext';
import Sidebar from '../components/Sidebar';
import React from 'react';
import type { AppProps } from 'next/app';
// useRouter is imported by Sidebar internally now

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <FirebaseProvider>
      {/* Main container with slightly adjusted flex properties */}
      <div className="min-h-screen p-4 flex flex-col md:flex-row md:space-x-4">
        {/* Sidebar now has z-20 to ensure it's above other content */}
        <Sidebar userId={null} isAuthReady={false} />

        {/* Main content area - now with a subtle background design and z-10 */}
        <div className="flex-1 bg-gradient-to-br from-gray-50 to-blue-50 p-6 md:p-10 rounded-lg shadow-xl m-2 overflow-y-auto relative z-10">
          <Component {...pageProps} />
        </div>
      </div>
    </FirebaseProvider>
  );
}

export default MyApp;