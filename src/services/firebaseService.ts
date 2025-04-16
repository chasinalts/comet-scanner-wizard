import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  updateDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { 
  ref, 
  uploadString, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import type { ContentMetadata } from '../types';

// Types for our database collections
export interface ImageRecord {
  id: string;
  imageData: string;
  contentType: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  userId?: string;
}

export interface ContentRecord {
  id: string;
  title: string;
  description: string;
  type: string;
  imageId?: string;
  position: number;
  scale: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  userId?: string;
}

export interface UserSettingsRecord {
  id: string;
  userId: string;
  settings: Record<string, any>;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Image Services
export const imageService = {
  async addImage(id: string, base64Data: string, contentType: string = 'scanner'): Promise<void> {
    try {
      // Store image data in Firestore
      const imageRef = doc(db, 'images', id);
      await setDoc(imageRef, {
        id,
        imageData: base64Data,
        contentType,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      console.log(`[Firebase] Image added/updated with ID: ${id}`);
    } catch (error) {
      console.error(`[Firebase] Failed to add/update image ${id}:`, error);
      throw error;
    }
  },

  async getImage(id: string): Promise<string | undefined> {
    try {
      const imageRef = doc(db, 'images', id);
      const imageDoc = await getDoc(imageRef);
      
      if (imageDoc.exists()) {
        console.log(`[Firebase] Image retrieved for ID: ${id}`);
        return imageDoc.data().imageData;
      } else {
        console.warn(`[Firebase] Image not found for ID: ${id}`);
        return undefined;
      }
    } catch (error) {
      console.error(`[Firebase] Failed to get image ${id}:`, error);
      return undefined;
    }
  },

  async deleteImage(id: string): Promise<void> {
    try {
      const imageRef = doc(db, 'images', id);
      await deleteDoc(imageRef);
      console.log(`[Firebase] Image deleted with ID: ${id}`);
    } catch (error) {
      console.error(`[Firebase] Failed to delete image ${id}:`, error);
      throw error;
    }
  }
};

// Content Services
export const contentService = {
  async getContents(userId?: string): Promise<ContentMetadata[]> {
    try {
      let contentQuery;
      
      if (userId) {
        contentQuery = query(
          collection(db, 'contents'),
          where('userId', '==', userId),
          orderBy('position', 'asc')
        );
      } else {
        contentQuery = query(
          collection(db, 'contents'),
          orderBy('position', 'asc')
        );
      }
      
      const contentSnapshot = await getDocs(contentQuery);
      const contents: ContentMetadata[] = [];
      
      contentSnapshot.forEach(doc => {
        const data = doc.data();
        contents.push({
          id: data.id,
          title: data.title,
          description: data.description,
          type: data.type,
          imageId: data.imageId,
          position: data.position,
          scale: data.scale || 1
        });
      });
      
      return contents;
    } catch (error) {
      console.error('[Firebase] Failed to get contents:', error);
      return [];
    }
  },

  async saveContent(content: ContentMetadata, userId?: string): Promise<void> {
    try {
      const contentRef = doc(db, 'contents', content.id);
      await setDoc(contentRef, {
        id: content.id,
        title: content.title,
        description: content.description,
        type: content.type,
        imageId: content.imageId,
        position: content.position,
        scale: content.scale || 1,
        userId: userId || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      console.log(`[Firebase] Content saved with ID: ${content.id}`);
    } catch (error) {
      console.error(`[Firebase] Failed to save content ${content.id}:`, error);
      throw error;
    }
  },

  async deleteContent(id: string): Promise<void> {
    try {
      const contentRef = doc(db, 'contents', id);
      await deleteDoc(contentRef);
      console.log(`[Firebase] Content deleted with ID: ${id}`);
    } catch (error) {
      console.error(`[Firebase] Failed to delete content ${id}:`, error);
      throw error;
    }
  },

  async saveContents(contents: ContentMetadata[], userId?: string): Promise<void> {
    try {
      // Use a batch to save multiple contents at once
      const batch = db.batch();
      
      contents.forEach(content => {
        const contentRef = doc(db, 'contents', content.id);
        batch.set(contentRef, {
          id: content.id,
          title: content.title,
          description: content.description,
          type: content.type,
          imageId: content.imageId,
          position: content.position,
          scale: content.scale || 1,
          userId: userId || null,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      });
      
      await batch.commit();
      console.log(`[Firebase] ${contents.length} contents saved`);
    } catch (error) {
      console.error('[Firebase] Failed to save contents:', error);
      throw error;
    }
  }
};

// User Settings Services
export const userSettingsService = {
  async saveSettings(userId: string, settings: Record<string, any>): Promise<void> {
    try {
      const settingsRef = doc(db, 'userSettings', userId);
      await setDoc(settingsRef, {
        userId,
        settings,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      console.log(`[Firebase] Settings saved for user: ${userId}`);
    } catch (error) {
      console.error(`[Firebase] Failed to save settings for user ${userId}:`, error);
      throw error;
    }
  },

  async getSettings(userId: string): Promise<Record<string, any> | undefined> {
    try {
      const settingsRef = doc(db, 'userSettings', userId);
      const settingsDoc = await getDoc(settingsRef);
      
      if (settingsDoc.exists()) {
        return settingsDoc.data().settings;
      } else {
        return undefined;
      }
    } catch (error) {
      console.error(`[Firebase] Failed to get settings for user ${userId}:`, error);
      return undefined;
    }
  }
};

// Firebase Storage Service for larger images
export const storageService = {
  async uploadImage(id: string, base64Data: string): Promise<string> {
    try {
      // Remove the data URL prefix if present
      const base64Content = base64Data.includes('base64,') 
        ? base64Data.split('base64,')[1] 
        : base64Data;
      
      // Create a reference to the file location
      const imageRef = ref(storage, `images/${id}`);
      
      // Upload the base64 string
      await uploadString(imageRef, base64Content, 'base64');
      
      // Get the download URL
      const downloadURL = await getDownloadURL(imageRef);
      
      console.log(`[Firebase] Image uploaded to storage with ID: ${id}`);
      return downloadURL;
    } catch (error) {
      console.error(`[Firebase] Failed to upload image ${id} to storage:`, error);
      throw error;
    }
  },
  
  async deleteImage(id: string): Promise<void> {
    try {
      const imageRef = ref(storage, `images/${id}`);
      await deleteObject(imageRef);
      console.log(`[Firebase] Image deleted from storage with ID: ${id}`);
    } catch (error) {
      console.error(`[Firebase] Failed to delete image ${id} from storage:`, error);
      throw error;
    }
  }
};

// Migration Service - to help migrate data from localStorage/IndexedDB to Firebase
export const migrationService = {
  async migrateImages(images: Record<string, string>): Promise<void> {
    try {
      // Use a batch to save multiple images at once
      const batch = db.batch();
      
      Object.entries(images).forEach(([id, imageData]) => {
        const imageRef = doc(db, 'images', id);
        batch.set(imageRef, {
          id,
          imageData,
          contentType: id.startsWith('banner') ? 'banner' : 'scanner',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      });
      
      await batch.commit();
      console.log(`[Firebase] Migrated ${Object.keys(images).length} images`);
    } catch (error) {
      console.error('[Firebase] Failed to migrate images:', error);
      throw error;
    }
  },

  async migrateContents(contents: ContentMetadata[]): Promise<void> {
    await contentService.saveContents(contents);
  },
  
  async migrateUserSettings(userId: string, settings: Record<string, any>): Promise<void> {
    await userSettingsService.saveSettings(userId, settings);
  }
};
