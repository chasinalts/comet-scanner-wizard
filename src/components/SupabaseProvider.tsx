import { useState, useEffect, ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SupabaseMigrationManager } from './SupabaseMigrationManager';
import { supabase } from '../lib/supabase';

interface SupabaseProviderProps {
  children: ReactNode;
}

export const SupabaseProvider: React.FC<SupabaseProviderProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const [isSupabaseReady, setIsSupabaseReady] = useState<boolean>(false);
  const [needsMigration, setNeedsMigration] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if Supabase is configured and if we need to migrate data
  useEffect(() => {
    const checkSupabaseSetup = async () => {
      if (!currentUser) {
        // If not logged in, we don't need to check for migration yet
        setIsChecking(false);
        setIsSupabaseReady(true);
        return;
      }

      try {
        // Check if Supabase is properly configured
        const { data, error } = await supabase
          .from('images')
          .select('id')
          .limit(1);
        
        if (error) throw error;
        
        // Check if we need to migrate data
        // If there's no data in Supabase but we have data in localStorage, we need to migrate
        const hasLocalData = localStorage.getItem('admin_contents') !== null;
        
        if (data.length === 0 && hasLocalData) {
          setNeedsMigration(true);
        } else {
          setIsSupabaseReady(true);
        }
      } catch (error) {
        console.error('[Supabase] Error checking Supabase setup:', error);
        setError(error instanceof Error ? error.message : 'Failed to initialize Supabase');
        // Don't set isSupabaseReady to true if there's an error
      } finally {
        setIsChecking(false);
      }
    };

    checkSupabaseSetup();
  }, [currentUser]);

  const handleMigrationComplete = () => {
    setNeedsMigration(false);
    setIsSupabaseReady(true);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-4 max-w-md">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <strong className="font-bold">Supabase Error:</strong>
            <p className="block sm:inline"> {error}</p>
            <p className="mt-2 text-sm">Please check your Supabase configuration in .env.local file.</p>
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
      {needsMigration && <SupabaseMigrationManager onComplete={handleMigrationComplete} />}
      {isSupabaseReady && children}
    </>
  );
};
