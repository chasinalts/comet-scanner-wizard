import { useState, useEffect, ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { migrationService } from '../services/supabaseService';
import Button from './ui/Button';
import type { ContentMetadata } from '../types';

interface MigrationManagerProps {
  onComplete: () => void;
}

export const SupabaseMigrationManager: React.FC<MigrationManagerProps> = ({ onComplete }) => {
  const { currentUser } = useAuth();
  const [step, setStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);

  // Check if there's data to migrate
  const [hasLocalData, setHasLocalData] = useState<boolean>(false);
  const [localImages, setLocalImages] = useState<Record<string, string>>({});
  const [localContents, setLocalContents] = useState<ContentMetadata[]>([]);

  useEffect(() => {
    const checkLocalData = () => {
      // Check for images in localStorage
      const storedImages = localStorage.getItem('admin_images');
      if (storedImages) {
        try {
          const parsedImages = JSON.parse(storedImages);
          setLocalImages(parsedImages);
        } catch (err) {
          console.error('Failed to parse stored images:', err);
        }
      }

      // Check for contents in localStorage
      const storedContents = localStorage.getItem('admin_contents');
      if (storedContents) {
        try {
          const parsedContents = JSON.parse(storedContents);
          setLocalContents(parsedContents);
        } catch (err) {
          console.error('Failed to parse stored contents:', err);
        }
      }

      // Set flag if we have any data to migrate
      const hasData = !!storedImages || !!storedContents;
      setHasLocalData(hasData);

      if (!hasData) {
        // If no data to migrate, complete immediately
        onComplete();
      }
    };

    checkLocalData();
  }, [onComplete]);

  const handleMigration = async () => {
    if (!hasLocalData) {
      onComplete();
      return;
    }

    setIsLoading(true);
    setError(null);
    setProgress(0);

    try {
      // Step 1: Migrate images
      setStep(1);
      if (Object.keys(localImages).length > 0) {
        await migrationService.migrateImages(localImages);
      }
      setProgress(50);

      // Step 2: Migrate contents
      setStep(2);
      if (localContents.length > 0) {
        await migrationService.migrateContents(localContents);
      }
      setProgress(100);

      // Migration complete
      onComplete();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Migration failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  if (!hasLocalData) {
    return null; // No data to migrate
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Data Migration</h2>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          We need to migrate your existing data to the new database system.
          This will ensure all your content is preserved.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        <div className="mb-6">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                  {isLoading ? `Step ${step} of 2` : 'Ready to migrate'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-blue-600">
                  {progress}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
              <div 
                style={{ width: `${progress}%` }} 
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
              ></div>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <Button
            variant="secondary"
            onClick={handleSkip}
            disabled={isLoading}
          >
            Skip Migration
          </Button>
          <Button
            variant="primary"
            onClick={handleMigration}
            isLoading={isLoading}
            loadingText="Migrating..."
            disabled={isLoading}
          >
            Start Migration
          </Button>
        </div>
      </div>
    </div>
  );
};
