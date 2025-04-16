import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { migrateImagesFromIndexedDB, migrateContentsFromLocalStorage, migrateUserSettingsFromLocalStorage } from '../utils/migrationUtils';
import { collection, getDocs, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface MigrationManagerProps {
  onComplete: () => void;
}

export const MigrationManager: React.FC<MigrationManagerProps> = ({ onComplete }) => {
  const { currentUser } = useAuth();
  const [status, setStatus] = useState<'idle' | 'migrating' | 'completed' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const checkFirebaseData = async () => {
      try {
        // Check if we already have data in Firebase
        const imagesSnapshot = await getDocs(collection(db, 'images'));
        const contentsSnapshot = await getDocs(collection(db, 'contents'));
        
        // If we already have data in Firebase, skip migration
        if (!imagesSnapshot.empty || !contentsSnapshot.empty) {
          console.log('[Migration] Data already exists in Firebase, skipping migration');
          onComplete();
          return;
        }
        
        // Start migration
        startMigration();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        setStatus('error');
      }
    };
    
    checkFirebaseData();
  }, [onComplete]);

  const startMigration = async () => {
    if (!currentUser) {
      setError('User must be logged in to migrate data');
      setStatus('error');
      return;
    }
    
    setStatus('migrating');
    
    try {
      // Migrate images
      setProgress(10);
      await migrateImagesFromIndexedDB();
      setProgress(40);
      
      // Migrate contents
      await migrateContentsFromLocalStorage();
      setProgress(70);
      
      // Migrate user settings
      await migrateUserSettingsFromLocalStorage(currentUser.username);
      setProgress(100);
      
      setStatus('completed');
      onComplete();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setStatus('error');
    }
  };

  if (status === 'idle') {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">
          {status === 'migrating' ? 'Migrating Data to Firebase' : 
           status === 'completed' ? 'Migration Complete' : 'Migration Error'}
        </h2>
        
        {status === 'migrating' && (
          <>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Please wait while we migrate your data to Firebase. This will ensure your data persists across devices and sessions.
            </p>
          </>
        )}
        
        {status === 'completed' && (
          <p className="text-green-600 dark:text-green-400">
            Your data has been successfully migrated to Firebase!
          </p>
        )}
        
        {status === 'error' && (
          <>
            <p className="text-red-600 dark:text-red-400 mb-2">
              An error occurred during migration:
            </p>
            <div className="bg-red-100 dark:bg-red-900 p-3 rounded text-red-800 dark:text-red-200 text-sm mb-4">
              {error}
            </div>
            <button
              onClick={startMigration}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
};
