import { useState, useEffect, ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MigrationManager } from './MigrationManager';
import { db } from '../lib/firebase';
import { collection, getDocs, limit } from 'firebase/firestore';

interface FirebaseProviderProps {
  children: ReactNode;
}

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const [isFirebaseReady, setIsFirebaseReady] = useState<boolean>(false);
  const [needsMigration, setNeedsMigration] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if Firebase is configured and if we need to migrate data
  useEffect(() => {
    const checkFirebaseSetup = async () => {
      console.log('[FirebaseProvider] Starting initialization check');
      console.log('[FirebaseProvider] Current user:', currentUser?.username || 'No user');
      
      if (!currentUser) {
        console.log('[FirebaseProvider] No user, skipping Firebase check');
        setIsChecking(false);
        setIsFirebaseReady(true);
        return;
      }

      try {
        console.log('[FirebaseProvider] Testing Firebase connection');
        const testQuery = await getDocs(collection(db, 'images'));
        console.log('[FirebaseProvider] Firebase connection test successful');
        
        // Check if we need to migrate data
        // If there's no data in Firebase but we have data in IndexedDB/localStorage, we need to migrate
        const hasLocalData = localStorage.getItem('admin_contents') !== null;
        
        if (testQuery.empty && hasLocalData) {
          setNeedsMigration(true);
        } else {
          setIsFirebaseReady(true);
        }
      } catch (error) {
        console.error('[Firebase] Error checking Firebase setup:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to initialize Firebase';
        console.error('[FirebaseProvider] Detailed error:', errorMessage);
        setError(errorMessage);
        // Don't set isFirebaseReady to true if there's an error
      } finally {
        setIsChecking(false);
      }
    };

    checkFirebaseSetup();
  }, [currentUser]);

  const handleMigrationComplete = () => {
    setNeedsMigration(false);
    setIsFirebaseReady(true);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-4 max-w-md">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <strong className="font-bold">Firebase Error:</strong>
            <p className="block sm:inline"> {error}</p>
            <p className="mt-2 text-sm">Please check your Firebase configuration in .env.local file.</p>
          </div>
        </div>
      </div>
    );
  }

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Initializing application...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {needsMigration && <MigrationManager onComplete={handleMigrationComplete} />}
      {isFirebaseReady && children}
    </>
  );
};
