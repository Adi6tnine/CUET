import { motion } from 'framer-motion';
import { Badge } from './Badge';
import { Flag } from 'lucide-react';

export const QuestionPalette = ({ 
  questions, 
  currentQuestion, 
  answers, 
  flaggedQuestions = new Set(),
  onQuestionSelect,
  isOpen,
  onToggle 
}) => {
  const getQuestionStatus = (index) => {
    if (answers[index] !== undefined) return 'answered';
    if (index === currentQuestion) return 'current';
    return 'unanswered';
  };

  const getStatusColor = (status, isFlagged = false) => {
    if (isFlagged) {
      switch (status) {
        case 'answered': return 'bg-orange-500 text-white border-2 border-orange-600';
        case 'current': return 'bg-orange-600 text-white border-2 border-orange-700';
        default: return 'bg-orange-200 text-orange-800 border-2 border-orange-400';
      }
    }
    
    switch (status) {
      case 'answered': return 'bg-green-500 text-white';
      case 'current': return 'bg-indigo-500 text-white';
      default: return 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  const getStatusCount = (status) => {
    return questions.filter((_, index) => getQuestionStatus(index) === status).length;
  };

  const getFlaggedCount = () => {
    return flaggedQuestions.size;
  };

  return (
    <>
      {/* Mobile Toggle Button - Enhanced */}
      <motion.button
        className="fixed top-20 right-4 z-50 lg:hidden bg-indigo-600 text-white p-3 rounded-full shadow-lg"
        onClick={onToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        {/* Notification badge for answered questions */}
        {Object.keys(answers).length > 0 && (
          <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {Object.keys(answers).length}
          </div>
        )}
      </motion.button>

      {/* Overlay for mobile */}
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onToggle}
        />
      )}

      {/* Palette Sidebar - Enhanced */}
      <motion.div
        className={`
          fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          lg:relative lg:translate-x-0 lg:w-72 lg:shadow-none lg:border-l lg:border-gray-200 lg:dark:border-gray-700
        `}
      >
        <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white">
              Question Palette
            </h3>
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={onToggle}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Enhanced Status Summary */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-xl lg:text-2xl font-bold text-green-600">
                {getStatusCount('answered')}
              </div>
              <div className="text-xs text-green-500">Answered</div>
            </div>
            <div className="text-center p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <div className="text-xl lg:text-2xl font-bold text-indigo-600">
                1
              </div>
              <div className="text-xs text-indigo-500">Current</div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-xl lg:text-2xl font-bold text-gray-600">
                {getStatusCount('unanswered')}
              </div>
              <div className="text-xs text-gray-500">Remaining</div>
            </div>
            <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="text-xl lg:text-2xl font-bold text-orange-600">
                {getFlaggedCount()}
              </div>
              <div className="text-xs text-orange-500">Flagged</div>
            </div>
          </div>

          {/* Enhanced Legend */}
          <div className="space-y-3 text-sm">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">Answered</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-indigo-500 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">Current Question</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">Not Visited</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-orange-400 rounded border-2 border-orange-600"></div>
              <Flag className="w-3 h-3 text-orange-500" />
              <span className="text-gray-600 dark:text-gray-400">Flagged for Review</span>
            </div>
          </div>
        </div>

        {/* Enhanced Question Grid */}
        <div className="p-4 lg:p-6 overflow-y-auto h-full pb-24">
          <div className="grid grid-cols-5 gap-3">
            {questions.map((_, index) => {
              const status = getQuestionStatus(index);
              const isFlagged = flaggedQuestions.has(index);
              
              return (
                <motion.button
                  key={index}
                  className={`
                    relative w-12 h-12 lg:w-14 lg:h-14 rounded-xl font-semibold text-sm lg:text-base 
                    transition-all duration-200 shadow-sm hover:shadow-md
                    ${getStatusColor(status, isFlagged)}
                    hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500
                    ${index === currentQuestion ? 'ring-2 ring-indigo-300' : ''}
                  `}
                  onClick={() => onQuestionSelect(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {index + 1}
                  
                  {/* Flag indicator */}
                  {isFlagged && (
                    <div className="absolute -top-1 -right-1 bg-orange-500 rounded-full p-1">
                      <Flag className="w-2 h-2 lg:w-3 lg:h-3 text-white" />
                    </div>
                  )}
                  
                  {/* Current question indicator */}
                  {index === currentQuestion && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Quick Stats */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">
              Progress Summary
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Completion:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {Math.round((Object.keys(answers).length / questions.length) * 100)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Questions Left:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {questions.length - Object.keys(answers).length}
                </span>
              </div>
              {getFlaggedCount() > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Flagged for Review:</span>
                  <span className="font-medium text-orange-600">
                    {getFlaggedCount()}
                  </span>
                </div>
              )}
            </div>
            
            {/* Progress bar */}
            <div className="mt-3">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-indigo-500 to-green-500 h-2 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};