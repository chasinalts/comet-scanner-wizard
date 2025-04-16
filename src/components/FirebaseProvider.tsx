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

  // Check if Firebase is configured and if we need to migrate data
  useEffect(() => {
    const checkFirebaseSetup = async () => {
      if (!currentUser) {
        // If not logged in, we don't need to check for migration yet
        setIsChecking(false);
        setIsFirebaseReady(true);
        return;
      }

      try {
        // Check if Firebase is properly configured
        const testQuery = await getDocs(collection(db, 'images'));
        
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
        // If Firebase is not configured properly, we'll just use local storage
        setIsFirebaseReady(true);
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
