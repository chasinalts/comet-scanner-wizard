import React, { useState, useEffect } from 'react';
import { debugLogger } from './DebugConsole';

/**
 * A lightweight version of the debug console that only shows critical errors
 * and provides basic debugging functionality without the overhead of the full console.
 */
const LightDebugConsole: React.FC = () => {
  const [errors, setErrors] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    // Only run in development mode
    if (process.env.NODE_ENV !== 'development') return;

    // Only show if the full debug console is disabled
    if (localStorage.getItem('disable_debug_console') !== 'true') return;

    // Override window.onerror to capture uncaught errors
    const originalOnError = window.onerror;
    window.onerror = (message, source, lineno, colno, error) => {
      const errorMessage = `${message} (${source}:${lineno}:${colno})`;
      setErrors(prev => [errorMessage, ...prev].slice(0, 5));
      
      if (originalOnError) {
        return originalOnError(message, source, lineno, colno, error);
      }
      return false;
    };

    // Override console.error to capture critical errors
    const originalConsoleError = console.error;
    console.error = (...args) => {
      originalConsoleError(...args);
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg).substring(0, 100) : String(arg)
      ).join(' ');
      
      setErrors(prev => [message, ...prev].slice(0, 5));
    };

    // Toggle visibility with keyboard shortcut (Alt+E)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'e') {
        setIsVisible(prev => !prev);
      }
      
      // Alt+Shift+E to re-enable the full debug console
      if (e.altKey && e.shiftKey && e.key === 'E') {
        localStorage.removeItem('disable_debug_console');
        window.location.reload();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.onerror = originalOnError;
      console.error = originalConsoleError;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Don't render anything in production or if full console is enabled
  if (process.env.NODE_ENV !== 'development' || localStorage.getItem('disable_debug_console') !== 'true') {
    return null;
  }

  // Simple logging function for manual debugging
  const logDebugMessage = () => {
    const message = prompt('Enter debug message:');
    if (message) {
      debugLogger.debug(message);
      setErrors(prev => [`[Debug] ${message}`, ...prev].slice(0, 5));
    }
  };

  // Clear memory to help with performance issues
  const clearMemory = () => {
    // Clear console
    console.clear();
    
    // Clear errors
    setErrors([]);
    
    // Force garbage collection if available
    if (window.gc) {
      try {
        (window as any).gc();
      } catch (e) {
        // Ignore if not available
      }
    }
    
    setErrors(prev => ['Memory cleared', ...prev].slice(0, 5));
  };

  if (!isVisible) {
    return (
      <div 
        className="fixed bottom-4 left-4 bg-red-500 text-white p-2 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer z-50"
        onClick={() => setIsVisible(true)}
        title="Show light debug console (Alt+E)"
      >
        !
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3 z-50 max-w-xs">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-gray-900 dark:text-white text-sm">Light Debug Console</h3>
        <div className="flex space-x-1">
          <button
            onClick={logDebugMessage}
            className="text-xs px-1 py-0.5 bg-blue-500 text-white rounded"
            title="Log a debug message"
          >
            Log
          </button>
          <button
            onClick={clearMemory}
            className="text-xs px-1 py-0.5 bg-green-500 text-white rounded"
            title="Clear memory"
          >
            Clear
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>
      </div>
      
      <div className="space-y-1 max-h-32 overflow-auto">
        {errors.length === 0 ? (
          <div className="text-xs text-gray-500 dark:text-gray-400">No errors to display</div>
        ) : (
          errors.map((error, index) => (
            <div key={index} className="text-xs text-red-500 border-l-2 border-red-500 pl-2 py-1">
              {error}
            </div>
          ))
        )}
      </div>
      
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Press Alt+E to toggle | Alt+Shift+E to enable full console
      </div>
    </div>
  );
};

export default LightDebugConsole;
