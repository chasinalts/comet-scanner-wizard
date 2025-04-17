import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Define log entry types
type LogLevel = 'info' | 'warn' | 'error' | 'debug' | 'image' | 'supabase' | 'state';

interface LogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  message: string;
  details?: any;
  source?: string;
}

interface DebugConsoleProps {
  maxLogs?: number;
}

// Helper function to get color based on log level
const getLogLevelColor = (level: LogLevel): string => {
  switch (level) {
    case 'info':
      return 'text-blue-500';
    case 'warn':
      return 'text-yellow-500';
    case 'error':
      return 'text-red-500';
    case 'debug':
      return 'text-gray-500';
    case 'image':
      return 'text-purple-500';
    case 'supabase':
      return 'text-green-500';
    case 'state':
      return 'text-indigo-500';
    default:
      return 'text-gray-700';
  }
};

// Helper function to get icon based on log level
const LogLevelIcon: React.FC<{ level: LogLevel }> = ({ level }) => {
  switch (level) {
    case 'info':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'warn':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    case 'error':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'image':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    case 'supabase':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
        </svg>
      );
    case 'state':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      );
    default:
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
};

// Create a global debug logger that can be imported anywhere
export class DebugLogger {
  private static instance: DebugLogger;
  private listeners: ((log: LogEntry) => void)[] = [];

  private constructor() {}

  public static getInstance(): DebugLogger {
    if (!DebugLogger.instance) {
      DebugLogger.instance = new DebugLogger();
    }
    return DebugLogger.instance;
  }

  public addListener(callback: (log: LogEntry) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  private notify(log: LogEntry): void {
    this.listeners.forEach(listener => listener(log));
  }

  public log(level: LogLevel, message: string, details?: any, source?: string): void {
    const logEntry: LogEntry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      timestamp: new Date(),
      level,
      message,
      details,
      source
    };

    this.notify(logEntry);

    // Also log to console for convenience
    const consoleMsg = `[${source || 'Debug'}] ${message}`;
    switch (level) {
      case 'info':
        console.info(consoleMsg, details || '');
        break;
      case 'warn':
        console.warn(consoleMsg, details || '');
        break;
      case 'error':
        console.error(consoleMsg, details || '');
        break;
      default:
        console.log(`[${level}] ${consoleMsg}`, details || '');
    }
  }

  // Convenience methods
  public info(message: string, details?: any, source?: string): void {
    this.log('info', message, details, source);
  }

  public warn(message: string, details?: any, source?: string): void {
    this.log('warn', message, details, source);
  }

  public error(message: string, details?: any, source?: string): void {
    this.log('error', message, details, source);
  }

  public debug(message: string, details?: any, source?: string): void {
    this.log('debug', message, details, source);
  }

  public image(message: string, details?: any, source?: string): void {
    this.log('image', message, details, source);
  }

  public supabase(message: string, details?: any, source?: string): void {
    this.log('supabase', message, details, source);
  }

  public state(message: string, details?: any, source?: string): void {
    this.log('state', message, details, source);
  }
}

// Create singleton instance
export const debugLogger = DebugLogger.getInstance();

// Hook to use the debug logger
export const useDebugLogger = () => {
  return debugLogger;
};

// Main Debug Console Component
const DebugConsole: React.FC<DebugConsoleProps> = ({ maxLogs = 20 }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'image' | 'supabase' | 'state' | 'network'>('all');
  const [filter, setFilter] = useState<string>('');
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const logContainerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const [networkRequests, setNetworkRequests] = useState<any[]>([]);

  // Toggle expanded state for a log
  const toggleLogExpanded = (logId: string) => {
    setExpandedLogs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(logId)) {
        newSet.delete(logId);
      } else {
        newSet.add(logId);
      }
      return newSet;
    });
  };

  // Clear all logs
  const clearLogs = () => {
    setLogs([]);
    setNetworkRequests([]);
  };

  // Increase max listeners to prevent warnings
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    // Increase the maximum number of listeners for EventEmitter
    if (typeof window !== 'undefined' && window.process && window.process.setMaxListeners) {
      window.process.setMaxListeners(20);
    }

    // Also increase for Node.js EventEmitter if available
    try {
      const events = require('events');
      if (events && events.EventEmitter && events.EventEmitter.defaultMaxListeners) {
        events.EventEmitter.defaultMaxListeners = 20;
      }
    } catch (e) {
      // Ignore if not in Node.js environment
    }
  }, []);

  // Monitor network requests
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    // Create a proxy for the fetch function to monitor network requests
    const originalFetch = window.fetch;

    // Use a more memory-efficient approach to track network requests
    let pendingRequests = 0;
    const MAX_PENDING_REQUESTS = 10; // Limit concurrent request tracking

    window.fetch = async (input, init) => {
      // Skip tracking if we have too many pending requests
      const shouldTrack = pendingRequests < MAX_PENDING_REQUESTS;

      if (shouldTrack) {
        pendingRequests++;
      }

      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
      const method = init?.method || 'GET';
      const startTime = Date.now();

      try {
        const response = await originalFetch(input, init);
        const endTime = Date.now();
        const duration = endTime - startTime;

        if (shouldTrack) {
          pendingRequests--;

          // Only track non-asset requests to reduce memory usage
          const isAsset = url.match(/\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|css|js)$/i);
          if (!isAsset) {
            const requestInfo = {
              id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
              url,
              method,
              status: response.status,
              duration,
              timestamp: new Date(),
              // Don't store full headers to save memory
              headers: init?.headers ? 'Present' : 'None',
            };

            setNetworkRequests(prev => {
              const newRequests = [requestInfo, ...prev];
              // Keep array size reasonable
              return newRequests.slice(0, Math.min(maxLogs, 50));
            });
          }
        }

        return response;
      } catch (error) {
        const endTime = Date.now();
        const duration = endTime - startTime;

        if (shouldTrack) {
          pendingRequests--;

          const requestInfo = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
            url,
            method,
            error: error instanceof Error ? error.message : 'Unknown error',
            duration,
            timestamp: new Date(),
            // Don't store full headers to save memory
            headers: init?.headers ? 'Present' : 'None',
          };

          setNetworkRequests(prev => {
            const newRequests = [requestInfo, ...prev];
            // Keep array size reasonable
            return newRequests.slice(0, Math.min(maxLogs, 50));
          });
        }

        throw error;
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, [maxLogs]);

  // Subscribe to debug logger with batched updates
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    let pendingLogs: LogEntry[] = [];
    let updateTimeout: number | null = null;

    // Batch log updates to reduce render frequency
    const processPendingLogs = () => {
      if (pendingLogs.length === 0) return;

      setLogs(prev => {
        const newLogs = [...pendingLogs, ...prev].slice(0, maxLogs);
        pendingLogs = [];
        return newLogs;
      });

      // Auto scroll to top if enabled
      if (autoScroll && logContainerRef.current) {
        logContainerRef.current.scrollTop = 0;
      }

      updateTimeout = null;
    };

    const removeListener = debugLogger.addListener((log) => {
      pendingLogs.push(log);

      // Schedule an update if one isn't already pending
      if (!updateTimeout) {
        updateTimeout = window.setTimeout(processPendingLogs, 100);
      }

      // Force update if we have accumulated enough logs
      if (pendingLogs.length >= 10) {
        if (updateTimeout) {
          clearTimeout(updateTimeout);
          updateTimeout = null;
        }
        processPendingLogs();
      }
    });

    return () => {
      removeListener();
      if (updateTimeout) {
        clearTimeout(updateTimeout);
      }
    };
  }, [maxLogs, autoScroll]);

  // Toggle visibility with keyboard shortcut (Alt+D)
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'd') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Override console methods to capture logs
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const originalConsoleLog = console.log;
    const originalConsoleInfo = console.info;
    const originalConsoleWarn = console.warn;
    const originalConsoleError = console.error;

    // Helper function to safely stringify objects
    const safeStringify = (obj: any): string => {
      if (obj === null) return 'null';
      if (obj === undefined) return 'undefined';
      if (typeof obj !== 'object') return String(obj);

      try {
        // Limit object depth and handle circular references
        const seen = new WeakSet();
        return JSON.stringify(obj, (key, value) => {
          if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
              return '[Circular Reference]';
            }
            seen.add(value);
          }
          return value;
        }, 2).substring(0, 500) + (JSON.stringify(obj).length > 500 ? '...' : '');
      } catch (e) {
        return '[Object - Unable to stringify]';
      }
    };

    // Throttle log processing to avoid overwhelming the UI
    let lastLogTime = 0;
    const LOG_THROTTLE_MS = 100; // Only process logs every 100ms

    // Process console logs with throttling
    const processLog = (level: 'debug' | 'info' | 'warn' | 'error', args: any[]) => {
      const now = Date.now();
      if (now - lastLogTime < LOG_THROTTLE_MS) return;
      lastLogTime = now;

      try {
        const message = args.map(arg =>
          typeof arg === 'object' ? safeStringify(arg) : String(arg)
        ).join(' ');

        // Don't log debug console's own logs to avoid infinite loop
        if (!message.includes('[Debug]')) {
          switch (level) {
            case 'debug': debugLogger.debug(message); break;
            case 'info': debugLogger.info(message); break;
            case 'warn': debugLogger.warn(message); break;
            case 'error': debugLogger.error(message); break;
          }
        }
      } catch (e) {
        // Silently fail to avoid breaking the application
      }
    };

    console.log = (...args) => {
      originalConsoleLog(...args);
      processLog('debug', args);
    };

    console.info = (...args) => {
      originalConsoleInfo(...args);
      processLog('info', args);
    };

    console.warn = (...args) => {
      originalConsoleWarn(...args);
      processLog('warn', args);
    };

    console.error = (...args) => {
      originalConsoleError(...args);
      processLog('error', args);
    };

    return () => {
      console.log = originalConsoleLog;
      console.info = originalConsoleInfo;
      console.warn = originalConsoleWarn;
      console.error = originalConsoleError;
    };
  }, []);

  // Don't render anything in production or if disabled via localStorage
  if (process.env.NODE_ENV !== 'development' || localStorage.getItem('disable_debug_console') === 'true') return null;

  // Add a way to completely disable the debug console if it causes issues
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt+Shift+D to disable the debug console completely
      if (e.altKey && e.shiftKey && e.key === 'D') {
        localStorage.setItem('disable_debug_console', 'true');
        window.location.reload();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter logs based on active tab and search filter
  const filteredLogs = logs.filter(log => {
    // Filter by tab
    if (activeTab !== 'all' && log.level !== activeTab) {
      return false;
    }

    // Filter by search text
    if (filter && !log.message.toLowerCase().includes(filter.toLowerCase())) {
      return false;
    }

    return true;
  });

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-50 w-[90vw] max-w-4xl max-h-[80vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Debug Console
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={clearLogs}
                className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Clear
              </button>
              <button
                onClick={() => setAutoScroll(!autoScroll)}
                className={`text-xs px-2 py-1 rounded ${
                  autoScroll
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {autoScroll ? 'Auto-scroll: On' : 'Auto-scroll: Off'}
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'all'
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('image')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'image'
                  ? 'border-b-2 border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              Images
            </button>
            <button
              onClick={() => setActiveTab('supabase')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'supabase'
                  ? 'border-b-2 border-green-500 text-green-600 dark:text-green-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              Supabase
            </button>
            <button
              onClick={() => setActiveTab('state')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'state'
                  ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              State
            </button>
            <button
              onClick={() => setActiveTab('network')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'network'
                  ? 'border-b-2 border-orange-500 text-orange-600 dark:text-orange-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              Network
            </button>
            <div className="flex-grow flex items-center justify-end px-2">
              <input
                type="text"
                placeholder="Filter logs..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="text-sm px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              />
            </div>
          </div>

          {/* Log Content */}
          {activeTab !== 'network' ? (
            <div
              ref={logContainerRef}
              className="overflow-auto flex-grow p-2 space-y-1"
              style={{ maxHeight: 'calc(80vh - 120px)' }}
            >
              {filteredLogs.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                  No logs to display
                </div>
              ) : (
                filteredLogs.map(log => (
                  <div
                    key={log.id}
                    className="text-sm border-l-2 pl-2 py-1 mb-1 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
                    style={{ borderLeftColor: getLogLevelColor(log.level).replace('text-', 'border-').replace('-500', '-400') }}
                    onClick={() => toggleLogExpanded(log.id)}
                  >
                    <div className="flex items-start">
                      <div className={`mr-2 ${getLogLevelColor(log.level)}`}>
                        <LogLevelIcon level={log.level} />
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">
                            {log.timestamp.toLocaleTimeString()}
                          </span>
                          {log.source && (
                            <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-1 rounded mr-2">
                              {log.source}
                            </span>
                          )}
                        </div>
                        <div className={`${getLogLevelColor(log.level)} font-medium`}>
                          {log.message}
                        </div>
                        {expandedLogs.has(log.id) && log.details && (
                          <pre className="mt-1 p-2 bg-gray-100 dark:bg-gray-900 rounded text-xs overflow-auto max-h-40">
                            {typeof log.details === 'object'
                              ? JSON.stringify(log.details, null, 2)
                              : String(log.details)}
                          </pre>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div
              className="overflow-auto flex-grow"
              style={{ maxHeight: 'calc(80vh - 120px)' }}
            >
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Method</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">URL</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Duration</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {networkRequests.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-3 py-4 text-center text-gray-500 dark:text-gray-400">
                        No network requests to display
                      </td>
                    </tr>
                  ) : (
                    networkRequests.map(request => (
                      <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-3 py-2 whitespace-nowrap">
                          <span className={`
                            px-2 py-1 text-xs rounded-full
                            ${request.method === 'GET' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}
                            ${request.method === 'POST' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : ''}
                            ${request.method === 'PUT' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : ''}
                            ${request.method === 'DELETE' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : ''}
                            ${request.method === 'PATCH' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' : ''}
                          `}>
                            {request.method}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-xs text-gray-700 dark:text-gray-300 max-w-xs truncate">
                          {request.url}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {request.status ? (
                            <span className={`
                              px-2 py-1 text-xs rounded-full
                              ${request.status < 300 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}
                              ${request.status >= 300 && request.status < 400 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : ''}
                              ${request.status >= 400 ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : ''}
                            `}>
                              {request.status}
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                              Error
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-700 dark:text-gray-300">
                          {request.duration}ms
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                          {request.timestamp.toLocaleTimeString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
          <div className="p-2 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
            Press Alt+D to toggle debug console
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DebugConsole;
