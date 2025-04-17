import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/Toast';
// import Button from '../components/ui/Button';
import DragDropUpload from '../components/ui/DragDropUpload';
// import { TextField, TextArea, CheckboxField, SelectField } from '../components/ui/FormField';
import { useTheme } from '../contexts/ThemeContext';
import { handleImageUpload } from '../utils/imageHandlers';
// import { useQuestions } from '../hooks/useQuestions';
// import { useSections } from '../hooks/useSections';
import { useSupabaseImage } from '../hooks/useSupabaseImage';
import { useSupabaseContent } from '../hooks/useSupabaseContent';

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
  useTheme(); // Keep the hook call to maintain dependencies
  const { addImage, getImage, deleteImage } = useSupabaseImage();
  const {
    contents,
    // setContents,
    saveContent,
    deleteContent,
    // saveAllContents,
    // isLoading: contentLoading
  } = useSupabaseContent();

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
            console.warn('[Image Load] Banner image not found in Supabase');
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
              setScannerImageData(prev => {
                if (image.imageId) {
                  return { ...prev, [image.imageId]: data };
                }
                return prev;
              });
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
      console.log(`[Upload] Starting ${type} image upload: ${file.name} (${file.size} bytes)`);

      // Process and store image
      await new Promise<void>((resolve, reject) => {
        handleImageUpload(file, async (imageUrl: string) => {
          console.log('[Upload] Image processed successfully, data URL length:', imageUrl.length);
          const imageId = `${type}-${Date.now()}`;

          try {
            console.log(`[Upload] Attempting to store image in Supabase with ID: ${imageId}`);
            let supabaseStorageSuccessful = true;

            // Store image data in Supabase
            try {
              await addImage(imageId, imageUrl, type);
              console.log('[Upload] Image successfully stored in Supabase:', imageId);
            } catch (uploadError) {
              console.error('[Upload] Supabase storage failed:', uploadError);
              supabaseStorageSuccessful = false;

              // Store in localStorage as fallback
              console.log('[Upload] Falling back to localStorage for image storage');
              localStorage.setItem(`image_${imageId}`, imageUrl);
              console.log('[Upload] Image stored in localStorage as fallback');

              // Show warning to user
              showToast('info', 'Image stored locally. It may not persist across devices.');
            }

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
              console.log('[Upload] Removing old banner image:', bannerImage.id);
              try {
                await deleteContent(bannerImage.id);
                if (bannerImage.imageId) {
                  await deleteImage(bannerImage.imageId);
                }
                console.log('[Upload] Old banner image removed successfully');
              } catch (deleteError) {
                console.error('[Upload] Error removing old banner:', deleteError);
                // Continue anyway - we'll overwrite it
              }
            }

            // Save the new content to Supabase
            let contentSaveSuccessful = true;
            try {
              console.log('[Upload] Saving content metadata to Supabase');
              await saveContent(newContent);
              console.log('[Upload] Content metadata saved successfully');
            } catch (contentError) {
              console.error('[Upload] Error saving content metadata:', contentError);
              contentSaveSuccessful = false;

              // Store in localStorage as fallback
              console.log('[Upload] Falling back to localStorage for content metadata');
              const existingContents = JSON.parse(localStorage.getItem('admin_contents') || '[]');
              existingContents.push(newContent);
              localStorage.setItem('admin_contents', JSON.stringify(existingContents));
              console.log('[Upload] Content metadata stored in localStorage as fallback');
            }

            // Load the new image data
            console.log('[Upload] Updating UI with new image');
            if (type === 'banner') {
              setBannerImageData(imageUrl);
            } else {
              setScannerImageData(prev => ({ ...prev, [imageId]: imageUrl }));
            }

            // Show appropriate message based on storage success
            if (!supabaseStorageSuccessful || !contentSaveSuccessful) {
              showToast('info', 'Image uploaded with limited persistence. Check console for details.');
            }

            console.log('[Upload] Upload process completed successfully');
            resolve();
          } catch (error) {
            console.error('[Upload] Critical error in upload process:', error);
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
        console.log('[Delete] Image deleted from Supabase:', content.imageId);

        // Clear image data from state
        if (content.type === 'banner') {
          setBannerImageData(undefined);
        } else {
          setScannerImageData(prev => {
            if (!content.imageId) return prev;
            const { [content.imageId]: removed, ...rest } = prev;
            return rest;
          });
        }
      }

      // Delete content from Supabase
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
              maxSize={5} // 5MB
              isLoading={contentUploading?.type === 'banner'}
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
            maxSize={5} // 5MB
            isLoading={contentUploading?.type === 'scanner'}
            label="Drag & drop a scanner image or click to browse"
          />
        </div>

        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Current Scanner Images</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {scannerImages.map((image) => (
            <div key={image.id} className="relative group bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              {image.imageId && scannerImageData[image.imageId] ? (
                <>
                  <div className="relative aspect-square overflow-hidden rounded-lg mb-2">
                    <img
                      src={image.imageId ? scannerImageData[image.imageId] : ''}
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
