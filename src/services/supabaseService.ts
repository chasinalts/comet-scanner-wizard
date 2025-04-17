import { supabase } from '../lib/supabase';
import type { ContentMetadata } from '../types';

// Types for our database tables
export interface ImageRecord {
  id: string;
  image_data: string;
  content_type: string;
  created_at: string;
  updated_at: string;
  user_id?: string;
}

export interface ContentRecord {
  id: string;
  title: string;
  description: string;
  type: string;
  image_id?: string;
  position: number;
  scale: number;
  created_at: string;
  updated_at: string;
  user_id?: string;
}

export interface UserSettingsRecord {
  id: string;
  user_id: string;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Image Services
export const imageService = {
  async addImage(id: string, base64Data: string, contentType: string = 'scanner'): Promise<void> {
    try {
      console.log(`[Supabase DB] Starting to add image with ID: ${id}, Content Type: ${contentType}`);

      // Check if the images table exists
      try {
        const { count, error: countError } = await supabase
          .from('images')
          .select('id', { count: 'exact', head: true });

        if (countError) {
          console.error(`[Supabase DB] Error checking images table:`, countError);
          throw new Error(`Database table 'images' not accessible: ${countError.message}`);
        }

        console.log(`[Supabase DB] Images table exists, contains ${count} records`);
      } catch (tableCheckError) {
        console.error(`[Supabase DB] Failed to check images table:`, tableCheckError);
        throw new Error(`Failed to access database: ${tableCheckError.message}`);
      }

      // Check data size
      const dataSize = base64Data.length;
      console.log(`[Supabase DB] Image data size: ${(dataSize / 1024).toFixed(2)}KB`);

      // For very large data, we should use storage instead
      if (dataSize > 1000000 && !base64Data.startsWith('http')) {
        console.warn(`[Supabase DB] Image data is very large (${(dataSize / 1024 / 1024).toFixed(2)}MB), consider using Storage instead`);
      }

      // Store image data in Supabase
      console.log(`[Supabase DB] Storing image data in database...`);
      const { error } = await supabase
        .from('images')
        .upsert({
          id,
          image_data: base64Data,
          content_type: contentType,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error(`[Supabase DB] Error storing image:`, error);
        throw error;
      }

      console.log(`[Supabase DB] Image successfully added/updated with ID: ${id}`);
    } catch (error) {
      console.error(`[Supabase DB] Failed to add/update image ${id}:`, error);
      throw error;
    }
  },

  async getImage(id: string): Promise<string | undefined> {
    try {
      const { data, error } = await supabase
        .from('images')
        .select('image_data')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        console.log(`[Supabase] Image retrieved for ID: ${id}`);
        return data.image_data;
      } else {
        console.warn(`[Supabase] Image not found for ID: ${id}`);
        return undefined;
      }
    } catch (error) {
      console.error(`[Supabase] Failed to get image ${id}:`, error);
      return undefined;
    }
  },

  async deleteImage(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('images')
        .delete()
        .eq('id', id);

      if (error) throw error;

      console.log(`[Supabase] Image deleted with ID: ${id}`);
    } catch (error) {
      console.error(`[Supabase] Failed to delete image ${id}:`, error);
      throw error;
    }
  }
};

// Content Services
export const contentService = {
  async getContents(userId?: string): Promise<ContentMetadata[]> {
    try {
      let query = supabase
        .from('contents')
        .select('*')
        .order('position', { ascending: true });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) throw error;

      const contents: ContentMetadata[] = data.map(item => ({
        id: item.id,
        title: item.title,
        content: item.description || '',
        type: item.type,
        imageId: item.image_id,
        position: item.position,
        scale: item.scale || 1,
        createdAt: new Date(item.created_at).getTime(),
        updatedAt: new Date(item.updated_at).getTime()
      }));

      return contents;
    } catch (error) {
      console.error('[Supabase] Failed to get contents:', error);
      return [];
    }
  },

  async saveContent(content: ContentMetadata, userId?: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('contents')
        .upsert({
          id: content.id,
          title: content.title,
          description: content.content,
          type: content.type,
          image_id: content.imageId,
          position: content.position || 0,
          scale: content.scale || 1,
          user_id: userId || null,
          created_at: new Date(content.createdAt).toISOString(),
          updated_at: new Date(content.updatedAt).toISOString()
        });

      if (error) throw error;

      console.log(`[Supabase] Content saved with ID: ${content.id}`);
    } catch (error) {
      console.error(`[Supabase] Failed to save content ${content.id}:`, error);
      throw error;
    }
  },

  async deleteContent(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('contents')
        .delete()
        .eq('id', id);

      if (error) throw error;

      console.log(`[Supabase] Content deleted with ID: ${id}`);
    } catch (error) {
      console.error(`[Supabase] Failed to delete content ${id}:`, error);
      throw error;
    }
  },

  async saveContents(contents: ContentMetadata[], userId?: string): Promise<void> {
    try {
      const records = contents.map(content => ({
        id: content.id,
        title: content.title,
        description: content.content,
        type: content.type,
        image_id: content.imageId,
        position: content.position || 0,
        scale: content.scale || 1,
        user_id: userId || null,
        created_at: new Date(content.createdAt).toISOString(),
        updated_at: new Date(content.updatedAt).toISOString()
      }));

      const { error } = await supabase
        .from('contents')
        .upsert(records);

      if (error) throw error;

      console.log(`[Supabase] ${contents.length} contents saved`);
    } catch (error) {
      console.error('[Supabase] Failed to save contents:', error);
      throw error;
    }
  }
};

// User Settings Services
export const userSettingsService = {
  async saveSettings(userId: string, settings: Record<string, any>): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          id: userId,
          user_id: userId,
          settings,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      console.log(`[Supabase] Settings saved for user: ${userId}`);
    } catch (error) {
      console.error(`[Supabase] Failed to save settings for user ${userId}:`, error);
      throw error;
    }
  },

  async getSettings(userId: string): Promise<Record<string, any> | undefined> {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('settings')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      if (data) {
        return data.settings;
      } else {
        return undefined;
      }
    } catch (error) {
      console.error(`[Supabase] Failed to get settings for user ${userId}:`, error);
      return undefined;
    }
  }
};

// Storage Service for larger images
export const storageService = {
  async uploadImage(id: string, base64Data: string): Promise<string> {
    try {
      console.log(`[Supabase Storage] Starting upload for image ID: ${id}`);

      // Check if storage bucket exists
      const { data: buckets, error: bucketError } = await supabase
        .storage
        .listBuckets();

      if (bucketError) {
        console.error(`[Supabase Storage] Error listing buckets:`, bucketError);
        throw new Error(`Storage buckets not accessible: ${bucketError.message}`);
      }

      const imagesBucket = buckets.find(b => b.name === 'images');
      if (!imagesBucket) {
        console.error(`[Supabase Storage] 'images' bucket not found`);
        throw new Error(`'images' storage bucket not found. Please create it in the Supabase dashboard.`);
      }

      console.log(`[Supabase Storage] 'images' bucket found, proceeding with upload`);

      // Remove the data URL prefix if present
      let base64Content;
      if (base64Data.includes('base64,')) {
        base64Content = base64Data.split('base64,')[1];
        console.log(`[Supabase Storage] Removed data URL prefix`);
      } else {
        base64Content = base64Data;
      }

      // Convert base64 to Blob
      try {
        console.log(`[Supabase Storage] Converting base64 to Blob`);
        const byteCharacters = atob(base64Content);
        const byteArrays = [];

        // Process in smaller chunks to avoid memory issues
        const chunkSize = 512;
        for (let offset = 0; offset < byteCharacters.length; offset += chunkSize) {
          const slice = byteCharacters.slice(offset, offset + chunkSize);

          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }

          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, { type: 'image/jpeg' });
        console.log(`[Supabase Storage] Successfully created Blob, size: ${blob.size} bytes`);

        // Check if blob size is within limits (< 50MB)
        if (blob.size > 50 * 1024 * 1024) {
          throw new Error(`Image size (${(blob.size / 1024 / 1024).toFixed(2)}MB) exceeds the 50MB limit`);
        }

        // Upload to Supabase Storage
        console.log(`[Supabase Storage] Uploading to Supabase Storage...`);
        const { data, error } = await supabase
          .storage
          .from('images')
          .upload(`${id}`, blob, {
            cacheControl: '3600',
            upsert: true
          });

        if (error) {
          console.error(`[Supabase Storage] Upload error:`, error);
          throw error;
        }

        // Get the public URL
        console.log(`[Supabase Storage] Upload successful, getting public URL`);
        const { data: urlData } = supabase
          .storage
          .from('images')
          .getPublicUrl(data.path);

        console.log(`[Supabase Storage] Image uploaded successfully with ID: ${id}`);
        return urlData.publicUrl;
      } catch (conversionError) {
        console.error(`[Supabase Storage] Error converting base64 to Blob:`, conversionError);
        throw new Error(`Failed to process image: ${conversionError.message}`);
      }
    } catch (error) {
      console.error(`[Supabase Storage] Failed to upload image ${id}:`, error);
      throw error;
    }
  },

  async deleteImage(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .storage
        .from('images')
        .remove([`${id}`]);

      if (error) throw error;

      console.log(`[Supabase] Image deleted from storage with ID: ${id}`);
    } catch (error) {
      console.error(`[Supabase] Failed to delete image ${id} from storage:`, error);
      throw error;
    }
  }
};

// Migration Service - to help migrate data from Firebase to Supabase
export const migrationService = {
  async migrateImages(images: Record<string, string>): Promise<void> {
    try {
      const records = Object.entries(images).map(([id, imageData]) => ({
        id,
        image_data: imageData,
        content_type: id.startsWith('banner') ? 'banner' : 'scanner',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('images')
        .upsert(records);

      if (error) throw error;

      console.log(`[Supabase] Migrated ${Object.keys(images).length} images`);
    } catch (error) {
      console.error('[Supabase] Failed to migrate images:', error);
      throw error;
    }
  },

  async migrateContents(contents: ContentMetadata[]): Promise<void> {
    try {
      const records = contents.map(content => ({
        id: content.id,
        title: content.title,
        description: content.content,
        type: content.type,
        image_id: content.imageId,
        position: content.position || 0,
        scale: content.scale || 1,
        created_at: new Date(content.createdAt).toISOString(),
        updated_at: new Date(content.updatedAt).toISOString()
      }));

      const { error } = await supabase
        .from('contents')
        .upsert(records);

      if (error) throw error;

      console.log(`[Supabase] Migrated ${contents.length} contents`);
    } catch (error) {
      console.error('[Supabase] Failed to migrate contents:', error);
      throw error;
    }
  },

  async migrateUserSettings(userId: string, settings: Record<string, any>): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          id: crypto.randomUUID(),
          user_id: userId,
          settings: settings,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      console.log(`[Supabase] Migrated user settings for user ${userId}`);
    } catch (error) {
      console.error(`[Supabase] Failed to migrate user settings for user ${userId}:`, error);
      throw error;
    }
  }
};
