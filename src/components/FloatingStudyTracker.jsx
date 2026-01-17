import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, BookOpen } from 'lucide-react';
import StudyTracker from './StudyTracker';
import SimpleStudyTracker from './SimpleStudyTracker';
import StudyTrackerErrorBoundary from './StudyTrackerErrorBoundary';

const FloatingStudyTracker = () => {
  const [showTracker, setShowTracker] = useState(false);

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        onClick={() => setShowTracker(true)}
        className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-50 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.3 }}
      >
        <Calendar className="w-6 h-6" />
        
        {/* Tooltip */}
        <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
          Study Tracker
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
        </div>
        
        {/* Pulse Animation */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 animate-ping opacity-20"></div>
      </motion.button>

      {/* Study Tracker Modal with Error Boundary */}
      <AnimatePresence>
        {showTracker && (
          <StudyTrackerErrorBoundary onClose={() => setShowTracker(false)}>
            <StudyTracker onClose={() => setShowTracker(false)} />
          </StudyTrackerErrorBoundary>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingStudyTracker;