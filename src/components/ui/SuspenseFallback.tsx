import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';

interface SuspenseFallbackProps {
  message?: string;
  minDisplayTime?: number; // Minimum time to display the loading screen in ms
}

const SuspenseFallback: React.FC<SuspenseFallbackProps> = ({
  message = 'Loading...',
  minDisplayTime = 500 // Default minimum display time of 500ms
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Set a small delay before showing the loading indicator
    // This prevents flashing for fast loads
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Ensure the loading indicator stays visible for at least minDisplayTime
    // This prevents jarring transitions for very quick loads
    const minDisplayTimer = setTimeout(() => {
      // This timeout will be cleared if the component unmounts before minDisplayTime
    }, minDisplayTime);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(minDisplayTimer);
    };
  }, [minDisplayTime]);

  if (!isVisible) {
    return null; // Don't show anything for quick loads
  }

  return (
    <div className="min-h-[200px] flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="flex flex-col items-center"
      >
        <LoadingSpinner size="lg" />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="mt-4 text-gray-600 dark:text-gray-400 font-medium"
        >
          {message}
        </motion.p>
      </motion.div>
    </div>
  );
};

export default SuspenseFallback;
