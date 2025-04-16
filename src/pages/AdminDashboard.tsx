import React, { useState, useEffect, ChangeEvent } from 'react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/Toast';
import Button from '../components/ui/Button';
import DragDropUpload from '../components/ui/DragDropUpload';
import { TextField, TextArea, CheckboxField, SelectField } from '../components/ui/FormField';
import { useTheme } from '../contexts/ThemeContext';
import { handleImageUpload, cleanupImageUrl } from '../utils/imageHandlers';
import { useQuestions } from '../hooks/useQuestions';
import { useSections } from '../hooks/useSections';
import { useFirebaseImage } from '../hooks/useFirebaseImage';
import { useFirebaseContent } from '../hooks/useFirebaseContent';

// Types
interface ContentUploadState {
  type: 'banner' | 'scanner';
  progress: number;
  error?: string;
}

interface ContentMetadata {
  id: string;
  type: 'banner' | 'scanner' | 'template' | 'question';
  title: string;
  content: string;
  imageId?: string;
  scale?: number;
  createdAt: number;
  updatedAt: number;
}

const AdminDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Admin Dashboard</h1>
      <AdminDashboardContent />
    </div>
  );
};

const AdminDashboardContent = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const { theme } = useTheme();
  const { addImage, getImage, deleteImage, isLoading: imageLoading } = useFirebaseImage();
  const {
    contents,
    setContents,
    saveContent,
    deleteContent,
    saveAllContents,
    isLoading: contentLoading
  } = useFirebaseContent();

  const [contentUploading, setContentUploading] = useState<ContentUploadState | null>(null);

  // Track loaded image data
  const [bannerImageData, setBannerImageData] = useState<string | undefined>();
  const [scannerImageData, setScannerImageData] = useState<Record<string, string>>({});

  // Find banner and scanner images
  const bannerImage = contents.find(item => item.type === 'banner');
  const scannerImages = contents.filter(item => item.type === 'scanner')
    .sort((a, b) => b.updatedAt - a.updatedAt);

  // Load banner image from Firebase if needed
  useEffect(() => {
    if (bannerImage?.imageId && !bannerImageData) {
      console.log('[Image Load] Loading banner image:', bannerImage.imageId);
      getImage(bannerImage.imageId)
        .then(data => {
          if (data) {
            console.log('[Image Load] Banner image loaded successfully');
            setBannerImageData(data);
          } else {
            console.warn('[Image Load] Banner image not found in Firebase');
          }
        })
        .catch(error => {
          console.error('[Image Load] Failed to load banner image:', error);
          showToast('error', 'Failed to load banner image');
        });
    }
  }, [bannerImage?.imageId, bannerImageData, getImage, showToast]);

  // Load scanner images from Firebase if needed
  useEffect(() => {
    scannerImages.forEach(image => {
      if (image.imageId && !scannerImageData[image.imageId]) {
        console.log('[Image Load] Loading scanner image:', image.imageId);
        getImage(image.imageId)
          .then(data => {
            if (data) {
              console.log('[Image Load] Scanner image loaded:', image.imageId);
              setScannerImageData(prev => ({ ...prev, [image.imageId]: data }));
            } else {
              console.warn('[Image Load] Scanner image not found:', image.imageId);
            }
          })
          .catch(error => {
            console.error('[Image Load] Failed to load scanner image:', error);
            showToast('error', 'Failed to load scanner image');
          });
      }
    });
  }, [scannerImages, scannerImageData, getImage, showToast]);

  // Handle content upload
  const handleContentUpload = async (type: 'banner' | 'scanner', file: File) => {
    if (!file) return;

    try {
      setContentUploading({ type, progress: 0 });

      // Process and store image
      await new Promise<void>((resolve, reject) => {
        handleImageUpload(file, async (imageUrl: string) => {
          console.log('[Upload] Image processed successfully');
          const imageId = `${type}-${Date.now()}`;

          try {
            // Store image data in Firebase
            await addImage(imageId, imageUrl, type);
            console.log('[Upload] Image stored in Firebase:', imageId);

            // Create new content metadata
            const newContent: ContentMetadata = {
              id: crypto.randomUUID(),
              type,
              title: file.name,
              content: '',
              imageId,
              scale: 1,
              createdAt: Date.now(),
              updatedAt: Date.now()
            };

            // If it's a banner, delete the old one
            if (type === 'banner' && bannerImage) {
              await deleteContent(bannerImage.id);
              if (bannerImage.imageId) {
                await deleteImage(bannerImage.imageId);
              }
            }

            // Save the new content to Firebase
            await saveContent(newContent);

            // Load the new image data
            if (type === 'banner') {
              setBannerImageData(imageUrl);
            } else {
              setScannerImageData(prev => ({ ...prev, [imageId]: imageUrl }));
            }

            resolve();
          } catch (error) {
            console.error('[Upload] Failed to store content:', error);
            reject(error);
          }
        });
      });

      showToast('success', `${type === 'banner' ? 'Banner' : 'Scanner'} image uploaded successfully`);
    } catch (error) {
      console.error('[Upload] Content upload failed:', error);
      setContentUploading(prev => prev ? { ...prev, error: 'Upload failed' } : null);
      showToast('error', 'Failed to upload content');
    } finally {
      setContentUploading(null);
    }
  };

  // Handle content deletion
  const handleContentDelete = async (id: string, type: string) => {
    try {
      console.log('[Delete] Deleting content:', { id, type });
      const content = contents.find(item => item.id === id);

      if (content?.imageId) {
        await deleteImage(content.imageId);
        console.log('[Delete] Image deleted from Firebase:', content.imageId);

        // Clear image data from state
        if (content.type === 'banner') {
          setBannerImageData(undefined);
        } else {
          setScannerImageData(prev => {
            const { [content.imageId]: removed, ...rest } = prev;
            return rest;
          });
        }
      }

      // Delete content from Firebase
      await deleteContent(id);
      showToast('success', 'Content deleted successfully');
    } catch (error) {
      console.error('[Delete] Failed to delete content:', error);
      showToast('error', 'Failed to delete content');
    }
  };

  // Handle scale changes
  const handleScaleChange = async (content: ContentMetadata, newScale: number) => {
    console.log('[Scale] Updating scale:', { id: content.id, scale: newScale });

    try {
      const updatedContent = { ...content, scale: newScale, updatedAt: Date.now() };
      await saveContent(updatedContent);
      showToast('success', 'Scale updated successfully');
    } catch (error) {
      console.error('[Scale] Failed to save scale update:', error);
      showToast('error', 'Failed to save scale change');
    }
  };

  if (!currentUser?.isOwner) {
    return <div className="p-8 text-center text-gray-900 dark:text-white">
      You don't have permission to access this page.
    </div>;
  }

  return (
    <div className="space-y-8">
      {/* Banner Image Section */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Banner Image</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          The banner image appears at the top of the main page and sets the tone for your scanner template. Upload an eye-catching image here.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <DragDropUpload
              onFileSelect={(file) => handleContentUpload('banner', file)}
              accept="image/*"
              maxSize={5 * 1024 * 1024} // 5MB
              loading={contentUploading?.type === 'banner'}
              label="Drag & drop a banner image or click to browse"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Current Banner</h3>
            {bannerImage && bannerImageData ? (
              <div className="relative group">
                <img
                  src={bannerImageData}
                  alt="Banner"
                  className="w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg flex items-center justify-center">
                  <button
                    onClick={() => handleContentDelete(bannerImage.id, 'banner')}
                    className="bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    aria-label="Delete banner"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                {bannerImage.scale !== undefined && (
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Scale: {bannerImage.scale.toFixed(1)}
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={bannerImage.scale}
                      onChange={(e) => handleScaleChange(bannerImage, parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center text-gray-500 dark:text-gray-400">
                No banner image uploaded
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Scanner Images Section */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Scanner Variations</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          A scanner's data can be visualized in a variety of ways. Upload different scanner variation images to display on the main page.
        </p>

        <div className="mb-6">
          <DragDropUpload
            onFileSelect={(file) => handleContentUpload('scanner', file)}
            accept="image/*"
            maxSize={5 * 1024 * 1024} // 5MB
            loading={contentUploading?.type === 'scanner'}
            label="Drag & drop a scanner image or click to browse"
          />
        </div>

        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Current Scanner Images</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {scannerImages.map((image) => (
            <div key={image.id} className="relative group bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              {scannerImageData[image.imageId] ? (
                <>
                  <div className="relative aspect-square overflow-hidden rounded-lg mb-2">
                    <img
                      src={scannerImageData[image.imageId]}
                      alt={image.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                      <button
                        onClick={() => handleContentDelete(image.id, 'scanner')}
                        className="bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        aria-label="Delete scanner image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 truncate mb-1">{image.title}</div>
                  {image.scale !== undefined && (
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Scale: {image.scale.toFixed(1)}
                      </label>
                      <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={image.scale}
                        onChange={(e) => handleScaleChange(image, parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              )}
            </div>
          ))}

          {scannerImages.length === 0 && (
            <div className="col-span-full border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center text-gray-500 dark:text-gray-400">
              No scanner images uploaded
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
