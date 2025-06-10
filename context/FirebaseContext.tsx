// context/FirebaseContext.tsx
import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

interface FirebaseContextType {
  db: Firestore | null;
  auth: Auth | null;
  userId: string | null;
  isAuthReady: boolean;
}

const FirebaseContext = createContext<FirebaseContextType | null>(null);

interface FirebaseProviderProps {
  children: ReactNode;
}

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({ children }) => {
  const [db, setDb] = useState<Firestore | null>(null);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);

  useEffect(() => {
    const appId = process.env.NEXT_PUBLIC_APP_ID || (typeof __app_id !== 'undefined' ? __app_id : 'default-app-id');
    const firebaseConfigString = process.env.NEXT_PUBLIC_FIREBASE_CONFIG || (typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
    let firebaseConfig: object = {};
    try {
      firebaseConfig = JSON.parse(firebaseConfigString);
    } catch (e) {
      console.error("Error parsing Firebase config:", e);
      firebaseConfig = {};
    }

    if (Object.keys(firebaseConfig).length === 0) {
      console.error("Firebase config is missing or invalid. Please ensure NEXT_PUBLIC_FIREBASE_CONFIG is set.");
      return;
    }

    const app: FirebaseApp = initializeApp(firebaseConfig);
    const firestore: Firestore = getFirestore(app);
    const firebaseAuth: Auth = getAuth(app);

    setDb(firestore);
    setAuth(firebaseAuth);

    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        const initialAuthToken = process.env.NEXT_PUBLIC_INITIAL_AUTH_TOKEN || (typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null);
        if (initialAuthToken) {
          try {
            await signInWithCustomToken(firebaseAuth, initialAuthToken);
            setUserId(firebaseAuth.currentUser?.uid || null);
          } catch (error) {
            console.error("Error signing in with custom token:", error);
            await signInAnonymously(firebaseAuth);
            setUserId(firebaseAuth.currentUser?.uid || crypto.randomUUID());
          }
        } else {
          await signInAnonymously(firebaseAuth);
          setUserId(firebaseAuth.currentUser?.uid || crypto.randomUUID());
        }
      }
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  return (
    <FirebaseContext.Provider value={{ db, auth, userId, isAuthReady }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = (): FirebaseContextType => {
  const context = useContext(FirebaseContext);
  if (context === null) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};