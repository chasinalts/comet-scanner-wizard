import { openDB, type IDBPDatabase, type DBSchema } from 'idb';

interface ImageDBSchema extends DBSchema {
  images: {
    key: string;
    value: string;
  };
}

const DB_NAME = 'ImageStore';
const STORE_NAME = 'images';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<ImageDBSchema>> | null = null;

const initDB = async (): Promise<IDBPDatabase<ImageDBSchema>> => {
  if (!dbPromise) {
    dbPromise = openDB<ImageDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db: IDBPDatabase<ImageDBSchema>) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
          console.log(`[IndexedDB] Object store "${STORE_NAME}" created.`);
        }
      },
    });
    console.log('[IndexedDB] Database connection initialized.');
  }
  return dbPromise;
};

export const useImageDB = () => {
  const addImage = async (id: string, base64Data: string): Promise<void> => {
    try {
      const db = await initDB();
      await db.put(STORE_NAME, base64Data, id);
      console.log(`[IndexedDB] Image added/updated with ID: ${id}`);
    } catch (error) {
      console.error(`[IndexedDB] Failed to add/update image ${id}:`, error);
      throw error;
    }
  };

  const getImage = async (id: string): Promise<string | undefined> => {
    try {
      const db = await initDB();
      const data = await db.get(STORE_NAME, id);
      console.log(`[IndexedDB] Image retrieved for ID: ${id}, Data found: ${!!data}`);
      return data;
    } catch (error) {
      console.error(`[IndexedDB] Failed to get image ${id}:`, error);
      return undefined;
    }
  };

  const deleteImage = async (id: string): Promise<void> => {
    try {
      const db = await initDB();
      await db.delete(STORE_NAME, id);
      console.log(`[IndexedDB] Image deleted with ID: ${id}`);
    } catch (error) {
      console.error(`[IndexedDB] Failed to delete image ${id}:`, error);
      // Decide if you want to throw here or just log
    }
  };

  const clearStore = async (): Promise<void> => {
    try {
      const db = await initDB();
      await db.clear(STORE_NAME);
      console.log(`[IndexedDB] Store "${STORE_NAME}" cleared.`);
    } catch (error) {
      console.error(`[IndexedDB] Failed to clear store "${STORE_NAME}":`, error);
    }
  };

  return { addImage, getImage, deleteImage, clearStore };
};

// Initialize DB connection early but don't block
initDB().catch(err => console.error('[IndexedDB] Failed to initialize database:', err));