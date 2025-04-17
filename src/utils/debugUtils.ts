import { debugLogger } from '../components/dev/DebugConsole';

// Image debugging utilities
export const debugImageUpload = (file: File): void => {
  debugLogger.image('Image upload started', {
    fileName: file.name,
    fileSize: formatFileSize(file.size),
    fileType: file.type,
    lastModified: new Date(file.lastModified).toLocaleString()
  }, 'ImageUpload');
};

export const debugImageProcessing = (imageUrl: string, imagePreview: string): void => {
  debugLogger.image('Image processed', {
    imageUrlLength: imageUrl.length,
    imageUrlPrefix: imageUrl.substring(0, 30) + '...',
    imagePreviewType: imagePreview.startsWith('blob:') ? 'Blob URL' : 'Data URL',
    imagePreview: imagePreview.substring(0, 30) + '...'
  }, 'ImageProcessing');
};

export const debugImageStorage = (id: string, storageType: 'Supabase' | 'IndexedDB' | 'LocalStorage', success: boolean, details?: any): void => {
  if (success) {
    debugLogger.image(`Image stored in ${storageType}`, {
      id,
      ...details
    }, 'ImageStorage');
  } else {
    debugLogger.error(`Failed to store image in ${storageType}`, {
      id,
      ...details
    }, 'ImageStorage');
  }
};

// Supabase debugging utilities
export const debugSupabaseOperation = (operation: string, details?: any): void => {
  debugLogger.supabase(`Supabase operation: ${operation}`, details, 'Supabase');
};

export const debugSupabaseError = (operation: string, error: any): void => {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  const errorDetails = error instanceof Error ? error.stack : error;
  
  debugLogger.error(`Supabase error in ${operation}`, {
    message: errorMessage,
    details: errorDetails
  }, 'Supabase');
};

// State debugging utilities
export const debugStateChange = (component: string, stateName: string, oldValue: any, newValue: any): void => {
  debugLogger.state(`State changed in ${component}`, {
    stateName,
    oldValue,
    newValue,
    diff: getObjectDiff(oldValue, newValue)
  }, 'StateChange');
};

// Helper functions
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getObjectDiff = (oldObj: any, newObj: any): any => {
  // If either is not an object, just return the new value
  if (typeof oldObj !== 'object' || typeof newObj !== 'object' || 
      oldObj === null || newObj === null) {
    return { old: oldObj, new: newObj };
  }
  
  const diff: Record<string, any> = {};
  
  // Check for properties in newObj that are different from oldObj
  Object.keys(newObj).forEach(key => {
    // If property doesn't exist in old object or values are different
    if (!(key in oldObj) || !isEqual(oldObj[key], newObj[key])) {
      diff[key] = {
        old: oldObj[key],
        new: newObj[key]
      };
    }
  });
  
  // Check for properties in oldObj that don't exist in newObj
  Object.keys(oldObj).forEach(key => {
    if (!(key in newObj) && !(key in diff)) {
      diff[key] = {
        old: oldObj[key],
        new: undefined
      };
    }
  });
  
  return diff;
};

// Simple deep equality check
const isEqual = (a: any, b: any): boolean => {
  if (a === b) return true;
  
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) {
    return false;
  }
  
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  
  if (keysA.length !== keysB.length) return false;
  
  return keysA.every(key => keysB.includes(key) && isEqual(a[key], b[key]));
};

// Create a hook to track state changes
export const createDebugState = <T>(
  initialState: T,
  componentName: string,
  stateName: string
): [T, (newState: T | ((prevState: T) => T)) => void] => {
  let state = initialState;
  
  const setState = (newState: T | ((prevState: T) => T)): void => {
    const prevState = state;
    state = typeof newState === 'function' 
      ? (newState as ((prevState: T) => T))(prevState)
      : newState;
    
    debugStateChange(componentName, stateName, prevState, state);
  };
  
  return [state, setState];
};

// Create a hook to track image operations
export const createImageDebugger = () => {
  return {
    trackUpload: (file: File) => debugImageUpload(file),
    trackProcessing: (imageUrl: string, imagePreview: string) => debugImageProcessing(imageUrl, imagePreview),
    trackStorage: (id: string, storageType: 'Supabase' | 'IndexedDB' | 'LocalStorage', success: boolean, details?: any) => 
      debugImageStorage(id, storageType, success, details)
  };
};

// Create a hook to track Supabase operations
export const createSupabaseDebugger = () => {
  return {
    trackOperation: (operation: string, details?: any) => debugSupabaseOperation(operation, details),
    trackError: (operation: string, error: any) => debugSupabaseError(operation, error)
  };
};

// Export a function to measure performance
export const measurePerformance = async <T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> => {
  const startTime = performance.now();
  
  try {
    const result = await fn();
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    debugLogger.debug(`Performance: ${name}`, {
      duration: `${duration.toFixed(2)}ms`
    }, 'Performance');
    
    return result;
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    debugLogger.error(`Performance error: ${name}`, {
      duration: `${duration.toFixed(2)}ms`,
      error
    }, 'Performance');
    
    throw error;
  }
};

// Export a function to inspect an object
export const inspectObject = (name: string, obj: any): void => {
  debugLogger.debug(`Inspect: ${name}`, obj, 'Inspection');
};

// Export a function to track memory usage
export const trackMemoryUsage = (): void => {
  if (performance.memory) {
    const memoryUsage = {
      jsHeapSizeLimit: formatFileSize(performance.memory.jsHeapSizeLimit),
      totalJSHeapSize: formatFileSize(performance.memory.totalJSHeapSize),
      usedJSHeapSize: formatFileSize(performance.memory.usedJSHeapSize),
      usagePercentage: ((performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100).toFixed(2) + '%'
    };
    
    debugLogger.debug('Memory Usage', memoryUsage, 'Performance');
  }
};
