import { useImageDB } from '../hooks/useImageDB';
import { migrationService } from '../services/firebaseService';
import type { ContentMetadata } from '../types';

// Function to migrate images from IndexedDB to Firebase
export const migrateImagesFromIndexedDB = async (): Promise<void> => {
  try {
    console.log('[Migration] Starting image migration from IndexedDB to Firebase');
    
    // Get all images from IndexedDB
    const { getImage } = useImageDB();
    const db = await window.indexedDB.open('ImageStore', 1);
    
    db.onsuccess = async (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      const transaction = database.transaction(['images'], 'readonly');
      const objectStore = transaction.objectStore('images');
      const request = objectStore.getAllKeys();
      
      request.onsuccess = async () => {
        const keys = request.result as string[];
        console.log(`[Migration] Found ${keys.length} images to migrate`);
        
        const images: Record<string, string> = {};
        
        // Get all images data
        for (const key of keys) {
          const imageData = await getImage(key);
          if (imageData) {
            images[key] = imageData;
          }
        }
        
        // Migrate to Firebase
        await migrationService.migrateImages(images);
        console.log('[Migration] Image migration completed successfully');
      };
      
      request.onerror = (error) => {
        console.error('[Migration] Failed to get image keys from IndexedDB:', error);
        throw error;
      };
    };
    
    db.onerror = (error) => {
      console.error('[Migration] Failed to open IndexedDB:', error);
      throw error;
    };
  } catch (error) {
    console.error('[Migration] Image migration failed:', error);
    throw error;
  }
};

// Function to migrate content from localStorage to Firebase
export const migrateContentsFromLocalStorage = async (): Promise<void> => {
  try {
    console.log('[Migration] Starting content migration from localStorage to Firebase');
    
    // Get contents from localStorage
    const contentsJson = localStorage.getItem('admin_contents');
    if (!contentsJson) {
      console.log('[Migration] No contents found in localStorage');
      return;
    }
    
    const contents: ContentMetadata[] = JSON.parse(contentsJson);
    console.log(`[Migration] Found ${contents.length} contents to migrate`);
    
    // Migrate to Firebase
    await migrationService.migrateContents(contents);
    console.log('[Migration] Content migration completed successfully');
  } catch (error) {
    console.error('[Migration] Content migration failed:', error);
    throw error;
  }
};

// Function to migrate user settings from localStorage to Firebase
export const migrateUserSettingsFromLocalStorage = async (userId: string): Promise<void> => {
  try {
    console.log('[Migration] Starting user settings migration from localStorage to Firebase');
    
    // Get all settings keys
    const settingsKeys = [
      'userSettings',
      'wizardState',
      'templateStructure',
      'baseTemplate',
      'templateQuestions'
    ];
    
    const settings: Record<string, any> = {};
    
    // Get all settings from localStorage
    for (const key of settingsKeys) {
      const settingJson = localStorage.getItem(key);
      if (settingJson) {
        try {
          settings[key] = JSON.parse(settingJson);
        } catch (e) {
          console.warn(`[Migration] Failed to parse setting ${key}:`, e);
          settings[key] = settingJson;
        }
      }
    }
    
    // Migrate to Firebase
    await migrationService.migrateUserSettings(userId, settings);
    console.log('[Migration] User settings migration completed successfully');
  } catch (error) {
    console.error('[Migration] User settings migration failed:', error);
    throw error;
  }
};
