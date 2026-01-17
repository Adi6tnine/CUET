import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Pages
import UpgradedDashboard from './pages/UpgradedDashboard';
import ChapterWisePractice from './pages/ChapterWisePractice';
import MockTestView from './pages/MockTestView';
import PYQModeView from './pages/PYQModeView';
import RevisionModeView from './pages/RevisionModeView';
import SubjectsView from './pages/SubjectsView';
import QuickQuizView from './pages/QuickQuizView';
import SubjectView from './pages/SubjectView';
import QuizView from './pages/QuizView';
import ResultView from './pages/ResultView';
import AnalyticsView from './pages/AnalyticsView';
import ProfileView from './pages/ProfileView';

// Components
import SimpleBottomNavigation from './components/SimpleBottomNavigation';
import Header from './components/Header';
import FloatingStudyTracker from './components/FloatingStudyTracker';
import { LoadingScreen } from './components/LoadingScreen';
import { NotificationToast, useNotifications } from './components/NotificationToast';
import ErrorBoundary from './components/ErrorBoundary';

// Utils
import { storage } from './utils/storage';
import { questionService } from './utils/QuestionService';
import { cloudStorage } from './utils/cloudStorage';
import { productionMonitoring, logInfo, logError } from './utils/productionMonitoring';

// Context
import { AppProvider } from './context/AppContext';

function App() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [predictionMode, setPredictionMode] = useState(false);
  const { notifications, dismissNotification, showWarning, showSuccess, showInfo } = useNotifications();

  useEffect(() => {
    // Initialize app
    const initializeApp = async () => {
      const startTime = Date.now();
      
      try {
        logInfo('Initializing AVION application');
        
        // Load user data
        const data = storage.getUserData();
        setUserData(data);

        // Apply dark mode setting
        if (data.settings.darkMode) {
          document.documentElement.classList.add('dark');
        }

        // Initialize QuestionService and get user progress
        const progress = questionService.getUserProgress();
        console.log('📊 User Progress Loaded:', progress);

        // Initialize cloud storage
        const syncStatus = cloudStorage.getSyncStatus();
        console.log('🌐 Cloud Storage Status:', syncStatus);

        // Register service worker for offline functionality
        if ('serviceWorker' in navigator && import.meta.env.PROD) {
          try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            logInfo('Service worker registered successfully', { scope: registration.scope });
          } catch (error) {
            logError('Service worker registration failed', { error: error.message });
          }
        }

        logInfo('Application initialized successfully', { 
          loadTime: Date.now() - startTime,
          darkMode: data.settings.darkMode,
          cloudSync: syncStatus.isEnabled
        });

      } catch (error) {
        logError('Failed to initialize app', { error: error.message, stack: error.stack });
        console.error('Failed to initialize app:', error);
      } finally {
        // Show loading screen for at least 1.5 seconds for better UX
        setTimeout(() => {
          setLoading(false);
          logInfo('Loading screen dismissed', { totalLoadTime: Date.now() - startTime });
        }, 1500);
      }
    };

    initializeApp();
  }, []);

  // Handle prediction mode toggle
  const handlePredictionModeToggle = () => {
    const newMode = questionService.togglePredictionMode();
    setPredictionMode(newMode);
    
    if (newMode) {
      // Apply dark red theme for prediction mode
      document.documentElement.classList.add('prediction-mode');
    } else {
      document.documentElement.classList.remove('prediction-mode');
    }
  };

  if (loading) {
    return (
      <LoadingScreen
        message="Initializing AVION..."
        phase="loading"
        showAIStatus={false}
      />
    );
  }

  return (
    <AppProvider initialUserData={userData}>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className={`min-h-mobile transition-colors duration-300 ${
          predictionMode 
            ? 'bg-gradient-to-br from-red-900 to-orange-900 dark:from-red-950 dark:to-orange-950' 
            : 'bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-indigo-900'
        }`}>
            <Header 
              predictionMode={predictionMode} 
              onTogglePredictionMode={handlePredictionModeToggle}
            />
            
            {/* Main Content Area - Responsive Layout */}
            <main className="mobile-nav-spacing desktop-sidebar-spacing pt-16 lg:pt-20">
              <ErrorBoundary>
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/" element={<UpgradedDashboard predictionMode={predictionMode} />} />
                    <Route path="/practice-by-chapter" element={<ChapterWisePractice />} />
                    <Route path="/mock-test" element={<MockTestView />} />
                    <Route path="/pyq-mode" element={<PYQModeView />} />
                    <Route path="/revision-mode" element={<RevisionModeView />} />
                    <Route path="/subjects" element={<SubjectsView predictionMode={predictionMode} />} />
                    <Route path="/quick-quiz" element={<QuickQuizView predictionMode={predictionMode} />} />
                    <Route path="/subject/:subject" element={<SubjectView predictionMode={predictionMode} />} />
                    <Route path="/quiz/:subject/:chapter" element={<QuizView predictionMode={predictionMode} />} />
                    <Route path="/result" element={<ResultView />} />
                    <Route path="/analytics" element={<AnalyticsView />} />
                    <Route path="/profile" element={<ProfileView />} />
                  </Routes>
                </AnimatePresence>
              </ErrorBoundary>
            </main>

            <SimpleBottomNavigation />
            
            {/* Notification System - Responsive Positioning */}
            <NotificationToast
              notifications={notifications}
              onDismiss={dismissNotification}
            />

            {/* Prediction Mode Indicator - Responsive */}
            {predictionMode && (
              <motion.div
                className="fixed top-20 lg:top-24 right-4 lg:right-8 z-50 bg-red-600 text-white px-3 py-2 lg:px-4 lg:py-2 rounded-full text-sm lg:text-base font-bold shadow-lg backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="flex items-center space-x-2">
                  <span className="animate-pulse">🔮</span>
                  <span className="hidden sm:inline">2026 Prediction Mode</span>
                  <span className="sm:hidden">2026</span>
                </div>
              </motion.div>
            )}

            {/* Cloud Sync Status Indicator */}
            <motion.div
              className="fixed bottom-20 lg:bottom-4 right-4 z-40 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-2 rounded-full text-xs text-gray-600 dark:text-gray-300 shadow-lg border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 }}
            >
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${cloudStorage.getSyncStatus().isEnabled ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span>{cloudStorage.getSyncStatus().isEnabled ? 'Global Sync' : 'Local Only'}</span>
              </div>
            </motion.div>

            {/* Floating Study Tracker */}
            <FloatingStudyTracker />

            {/* Mobile-Specific Optimizations */}
            <div className="mobile-only">
              {/* Mobile Pull-to-Refresh Indicator */}
              <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 transition-opacity duration-300" id="pull-refresh-indicator" />
            </div>

            {/* Desktop-Specific Enhancements */}
            <div className="desktop-only">
              {/* Keyboard Shortcuts Hint */}
              <div className="fixed bottom-4 left-4 text-xs text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-2 py-1 rounded">
                Press <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">?</kbd> for shortcuts
              </div>
            </div>
          </div>
        </Router>
      </AppProvider>
    );
}

export default App;