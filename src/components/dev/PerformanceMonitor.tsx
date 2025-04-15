import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  threshold: {
    good: number;
    medium: number;
  };
}

const PerformanceMonitor: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);

  useEffect(() => {
    // Only run in development mode
    if (process.env.NODE_ENV !== 'development') return;

    const collectMetrics = () => {
      if (!window.performance) return;

      const newMetrics: PerformanceMetric[] = [];

      // Navigation timing
      const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navEntry) {
        newMetrics.push({
          name: 'Page Load',
          value: navEntry.loadEventEnd - navEntry.fetchStart,
          unit: 'ms',
          threshold: { good: 1000, medium: 2500 }
        });

        newMetrics.push({
          name: 'TTFB',
          value: navEntry.responseStart - navEntry.requestStart,
          unit: 'ms',
          threshold: { good: 100, medium: 300 }
        });

        newMetrics.push({
          name: 'DOM Content',
          value: navEntry.domContentLoadedEventEnd - navEntry.fetchStart,
          unit: 'ms',
          threshold: { good: 800, medium: 1800 }
        });
      }

      // Paint metrics
      const paintEntries = performance.getEntriesByType('paint');
      paintEntries.forEach(entry => {
        if (entry.name === 'first-contentful-paint') {
          newMetrics.push({
            name: 'FCP',
            value: entry.startTime,
            unit: 'ms',
            threshold: { good: 1000, medium: 2500 }
          });
        }
      });

      // Memory usage
      if (performance.memory) {
        const memoryUsage = (performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100;
        newMetrics.push({
          name: 'Memory',
          value: memoryUsage,
          unit: '%',
          threshold: { good: 50, medium: 70 }
        });
      }

      setMetrics(newMetrics);
    };

    // Collect metrics after page load
    window.addEventListener('load', () => {
      setTimeout(collectMetrics, 1000);
    });

    // Toggle visibility with keyboard shortcut (Alt+P)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'p') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Clean up
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Get color based on metric value
  const getMetricColor = (metric: PerformanceMetric) => {
    if (metric.value <= metric.threshold.good) {
      return 'bg-green-500';
    } else if (metric.value <= metric.threshold.medium) {
      return 'bg-yellow-500';
    } else {
      return 'bg-red-500';
    }
  };

  // Don't render anything in production
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 z-50 max-w-xs"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-gray-900 dark:text-white">Performance Metrics</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>
          <div className="space-y-2">
            {metrics.map(metric => (
              <div key={metric.name} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">{metric.name}</span>
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${getMetricColor(metric)}`} />
                  <span className="text-sm font-medium">
                    {metric.value.toFixed(0)}{metric.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Press Alt+P to toggle
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PerformanceMonitor;
