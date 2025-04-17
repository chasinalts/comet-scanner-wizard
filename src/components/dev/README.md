# Development Debugging Utilities

This directory contains debugging tools that are only active in development mode. These tools help with troubleshooting issues, especially with image uploads and Supabase operations.

## Available Components

### DebugConsole

A comprehensive debugging console that provides:

- Real-time logging of application events
- Detailed information about image uploads and processing
- Supabase operation tracking
- State change monitoring
- Network request inspection

**Usage:**
- Press `Alt+D` to toggle the debug console
- Filter logs by type using the tabs
- Search for specific log entries using the filter box
- Click on a log entry to expand/collapse details

### PerformanceMonitor

A simple performance monitoring tool that displays:

- Page load time
- Time to First Byte (TTFB)
- DOM Content Loaded time
- First Contentful Paint (FCP)
- Memory usage (if available)

**Usage:**
- Press `Alt+P` to toggle the performance monitor

## Debugging Utilities

The `src/utils/debugUtils.ts` file provides several helper functions for debugging:

### Image Debugging

```typescript
// Track image upload
debugImageUpload(file);

// Track image processing
debugImageProcessing(imageUrl, imagePreview);

// Track image storage
debugImageStorage(id, 'Supabase', success, details);
```

### Supabase Debugging

```typescript
// Track Supabase operations
debugSupabaseOperation('operation name', details);

// Track Supabase errors
debugSupabaseError('operation name', error);
```

### Performance Measurement

```typescript
// Measure performance of async operations
const result = await measurePerformance('operation name', async () => {
  // Your async code here
  return result;
});
```

### State Debugging

```typescript
// Track state changes
debugStateChange('component name', 'state name', oldValue, newValue);
```

## Global Debug Logger

You can use the global debug logger anywhere in your application:

```typescript
import { debugLogger } from '../components/dev/DebugConsole';

// Log different types of messages
debugLogger.info('Info message', details, 'source');
debugLogger.warn('Warning message', details, 'source');
debugLogger.error('Error message', details, 'source');
debugLogger.debug('Debug message', details, 'source');
debugLogger.image('Image operation', details, 'source');
debugLogger.supabase('Supabase operation', details, 'source');
debugLogger.state('State change', details, 'source');
```

## Notes

- All debugging tools are automatically disabled in production builds
- Console logs are captured and displayed in the debug console
- Network requests are monitored and displayed in the "Network" tab
- You can clear the logs using the "Clear" button
- Toggle auto-scrolling with the "Auto-scroll" button
