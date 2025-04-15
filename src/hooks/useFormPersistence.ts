import { useEffect, useCallback } from 'react';
import { debounce } from '../utils/debounce';

interface PersistenceOptions<T> {
  key: string;
  values: T;
  onRestore?: (values: T) => void;
  debounceMs?: number;
  excludeFields?: (keyof T)[];
  version?: string;
}

interface StoredData<T> {
  values: T;
  timestamp: number;
  version?: string;
}

export function useFormPersistence<T extends Record<string, any>>({
  key,
  values,
  onRestore,
  debounceMs = 500,
  excludeFields = [],
  version
}: PersistenceOptions<T>) {
  // Save form state to storage
  const persistToStorage = useCallback(
    (data: T) => {
      try {
        const filteredData = { ...data };
        excludeFields.forEach(field => {
          delete filteredData[field];
        });

        const storedData: StoredData<T> = {
          values: filteredData,
          timestamp: Date.now(),
          version
        };

        localStorage.setItem(key, JSON.stringify(storedData));
      } catch (error) {
        console.error('Error saving form state:', error);
      }
    },
    [key, excludeFields, version]
  );

  // Debounced save function
  const debouncedSave = debounce(persistToStorage, debounceMs);

  // Load form state from storage
  const loadFromStorage = useCallback(() => {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return null;

      const data: StoredData<T> = JSON.parse(stored);

      // Check version mismatch
      if (version && data.version !== version) {
        localStorage.removeItem(key);
        return null;
      }

      // Check if data is too old (24 hours)
      const isExpired = Date.now() - data.timestamp > 24 * 60 * 60 * 1000;
      if (isExpired) {
        localStorage.removeItem(key);
        return null;
      }

      return data.values;
    } catch (error) {
      console.error('Error loading form state:', error);
      return null;
    }
  }, [key, version]);

  // Clear stored form state
  const clearStorage = useCallback(() => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error clearing form state:', error);
    }
  }, [key]);

  // Save form state when values change
  useEffect(() => {
    debouncedSave(values);
  }, [values, debouncedSave]);

  // Load saved state on mount
  useEffect(() => {
    const savedState = loadFromStorage();
    if (savedState && onRestore) {
      const shouldRestore = window.confirm(
        'We found a saved version of this form. Would you like to restore it?'
      );
      if (shouldRestore) {
        onRestore(savedState);
      } else {
        clearStorage();
      }
    }
  }, [loadFromStorage, onRestore, clearStorage]);

  return {
    clearStorage,
    loadFromStorage,
    hasSavedState: !!loadFromStorage()
  };
}