import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Badge } from './Badge';
import { Button } from './Button';
import { Menu, X, Zap, Brain, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';

const Header = ({ predictionMode = false, onTogglePredictionMode }) => {
  const { profile } = useApp();
  const [showPredictionToggle, setShowPredictionToggle] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Show prediction mode toggle after user has some experience
    const progress = JSON.parse(localStorage.getItem('cuet-user-stats') || '{}');
    setShowPredictionToggle(progress.totalQuestions > 20);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-all duration-300 ${
        predictionMode 
          ? 'bg-red-900/90 border-red-700' 
          : 'bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo Section */}
          <div className="flex items-center space-x-3 lg:space-x-4">
            <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
              predictionMode 
                ? 'bg-gradient-to-r from-red-600 to-orange-600 shadow-lg shadow-red-500/25' 
                : 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25'
            }`}>
              {/* Aircraft Icon */}
              <svg className="w-6 h-6 lg:w-7 lg:h-7" viewBox="0 0 80 80" fill="none">
                <path
                  d="M10 40L60 10L50 40L80 50L60 55L50 80L40 55L10 40Z"
                  fill="white"
                />
              </svg>
            </div>
            
            <div className="hidden sm:block">
              <h1 className={`text-lg lg:text-xl font-bold transition-colors ${
                predictionMode 
                  ? 'text-red-100' 
                  : 'text-gray-900 dark:text-white'
              }`}>
                AVION
              </h1>
              <div className="flex items-center space-x-2">
                <Badge 
                  variant={predictionMode ? "warning" : "success"} 
                  size="sm" 
                  className="text-xs"
                >
                  {predictionMode ? '🔮 2026 Prediction' : '📚 Practice Mode'}
                </Badge>
                <span className={`text-xs transition-colors ${
                  predictionMode 
                    ? 'text-red-300' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  Elevate your rank
                </span>
              </div>
            </div>

            {/* Mobile Title */}
            <div className="sm:hidden">
              <h1 className={`text-base font-bold transition-colors ${
                predictionMode 
                  ? 'text-red-100' 
                  : 'text-gray-900 dark:text-white'
              }`}>
                AVION
              </h1>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Prediction Mode Toggle */}
            {showPredictionToggle && onTogglePredictionMode && (
              <Button
                variant={predictionMode ? "danger" : "ghost"}
                size="sm"
                onClick={onTogglePredictionMode}
                className="flex items-center space-x-2 px-4 py-2"
              >
                <Brain className="w-4 h-4" />
                <span>{predictionMode ? '2026 Mode ON' : 'Enable 2026 Mode'}</span>
              </Button>
            )}

            {/* Stats Display */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                <Zap className="w-4 h-4 text-orange-500" />
                <span className="font-bold text-orange-600 dark:text-orange-400">
                  {profile?.streak || 0}
                </span>
                <span className="text-xs text-orange-500">streak</span>
              </div>

              <Badge variant={predictionMode ? "warning" : "primary"} size="lg" className="px-3 py-1">
                {profile?.xp || 0} XP
              </Badge>
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center space-x-2">
            {/* Mobile Stats */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <span className="text-orange-500 text-sm">🔥</span>
                <span className={`font-bold text-sm ${
                  predictionMode ? 'text-orange-300' : 'text-orange-500'
                }`}>
                  {profile?.streak || 0}
                </span>
              </div>

              <Badge variant={predictionMode ? "warning" : "primary"} size="sm">
                {profile?.xp || 0}
              </Badge>
            </div>

            {/* Mobile Prediction Toggle */}
            {showPredictionToggle && onTogglePredictionMode && (
              <Button
                variant={predictionMode ? "danger" : "ghost"}
                size="sm"
                onClick={onTogglePredictionMode}
                className="p-2"
              >
                {predictionMode ? '🔮' : <Brain className="w-4 h-4" />}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Prediction Mode Banner */}
        {predictionMode && (
          <motion.div
            className="lg:hidden py-2 px-4 bg-red-800/50 border-t border-red-700"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-center justify-center space-x-2">
              <span className="text-red-200 text-sm">🔮 2026 Prediction Mode Active</span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;