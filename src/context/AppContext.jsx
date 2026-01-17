import { createContext, useContext, useReducer, useEffect } from 'react';
import { storage } from '../utils/storage';
import { cloudStorage } from '../utils/cloudStorage';

const AppContext = createContext();

// Action types
const ACTIONS = {
  SET_USER_DATA: 'SET_USER_DATA',
  UPDATE_PROFILE: 'UPDATE_PROFILE',
  UPDATE_STATS: 'UPDATE_STATS',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  ADD_QUIZ_RESULT: 'ADD_QUIZ_RESULT',
  UPDATE_CHAPTER_PROGRESS: 'UPDATE_CHAPTER_PROGRESS',
  UPDATE_STUDY_TRACKER: 'UPDATE_STUDY_TRACKER',
  SET_GLOBAL_STATS: 'SET_GLOBAL_STATS',
  SET_LEADERBOARD: 'SET_LEADERBOARD',
  RESET_DATA: 'RESET_DATA'
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_USER_DATA:
      return action.payload;
    
    case ACTIONS.UPDATE_PROFILE:
      return {
        ...state,
        profile: { ...state.profile, ...action.payload }
      };
    
    case ACTIONS.UPDATE_STATS:
      return {
        ...state,
        stats: { ...state.stats, ...action.payload }
      };
    
    case ACTIONS.UPDATE_SETTINGS:
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
    
    case ACTIONS.ADD_QUIZ_RESULT:
      return {
        ...state,
        quizHistory: [action.payload, ...state.quizHistory.slice(0, 49)]
      };
    
    case ACTIONS.UPDATE_CHAPTER_PROGRESS:
      const { subject, chapter, progress } = action.payload;
      const key = `${subject}-${chapter}`;
      return {
        ...state,
        stats: {
          ...state.stats,
          chapterProgress: {
            ...state.stats.chapterProgress,
            [key]: {
              ...state.stats.chapterProgress[key],
              ...progress,
              lastAttempt: new Date().toISOString()
            }
          }
        }
      };
    
    case ACTIONS.UPDATE_STUDY_TRACKER:
      return {
        ...state,
        studyTracker: action.payload
      };
    
    case ACTIONS.SET_GLOBAL_STATS:
      return {
        ...state,
        globalStats: action.payload
      };
    
    case ACTIONS.SET_LEADERBOARD:
      return {
        ...state,
        leaderboard: action.payload
      };
    
    case ACTIONS.RESET_DATA:
      return storage.getDefaultUserData();
    
    default:
      return state;
  }
};

// Provider component
export const AppProvider = ({ children, initialUserData }) => {
  const [state, dispatch] = useReducer(appReducer, initialUserData);

  // Save to localStorage and cloud whenever state changes
  useEffect(() => {
    if (state) {
      storage.saveUserData(state);
      
      // Update cloud storage with user data
      cloudStorage.updateUserData({
        name: state.profile?.name || 'Anonymous User',
        totalXP: state.profile?.xp || 0,
        streak: state.profile?.streak || 0,
        badges: state.profile?.badges || [],
        totalQuizzes: state.stats?.totalQuestions ? Math.floor(state.stats.totalQuestions / 30) : 0,
        totalQuestions: state.stats?.totalQuestions || 0,
        totalCorrectAnswers: state.stats?.correctAnswers || 0,
        averageAccuracy: state.stats?.totalQuestions > 0 ? 
          Math.round((state.stats.correctAnswers / state.stats.totalQuestions) * 100) : 0,
        subjectMastery: state.stats?.subjectMastery || {},
        settings: state.settings || {}
      });
    }
  }, [state]);

  // Load global stats and leaderboard on mount
  useEffect(() => {
    const loadGlobalData = async () => {
      try {
        const [globalStats, leaderboard] = await Promise.all([
          cloudStorage.getGlobalStats(),
          cloudStorage.getLeaderboard()
        ]);
        
        dispatch({ type: ACTIONS.SET_GLOBAL_STATS, payload: globalStats });
        dispatch({ type: ACTIONS.SET_LEADERBOARD, payload: leaderboard });
      } catch (error) {
        console.error('Failed to load global data:', error);
      }
    };
    
    loadGlobalData();
    
    // Sync data periodically
    const syncInterval = setInterval(() => {
      cloudStorage.syncData();
    }, 5 * 60 * 1000); // Every 5 minutes
    
    return () => clearInterval(syncInterval);
  }, []);

  // Actions
  const actions = {
    setUserData: (userData) => {
      dispatch({ type: ACTIONS.SET_USER_DATA, payload: userData });
    },

    updateProfile: (profileData) => {
      dispatch({ type: ACTIONS.UPDATE_PROFILE, payload: profileData });
    },

    updateStats: (statsData) => {
      dispatch({ type: ACTIONS.UPDATE_STATS, payload: statsData });
    },

    updateSettings: (settingsData) => {
      dispatch({ type: ACTIONS.UPDATE_SETTINGS, payload: settingsData });
      
      // Apply dark mode immediately
      if (settingsData.darkMode !== undefined) {
        if (settingsData.darkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    },

    addQuizResult: async (quizResult) => {
      dispatch({ type: ACTIONS.ADD_QUIZ_RESULT, payload: quizResult });
      
      // Add to cloud storage
      await cloudStorage.addQuizResult(quizResult);
      
      // Refresh global stats and leaderboard
      const [globalStats, leaderboard] = await Promise.all([
        cloudStorage.getGlobalStats(),
        cloudStorage.getLeaderboard()
      ]);
      
      dispatch({ type: ACTIONS.SET_GLOBAL_STATS, payload: globalStats });
      dispatch({ type: ACTIONS.SET_LEADERBOARD, payload: leaderboard });
    },

    updateChapterProgress: (subject, chapter, progress) => {
      dispatch({ 
        type: ACTIONS.UPDATE_CHAPTER_PROGRESS, 
        payload: { subject, chapter, progress } 
      });
    },

    updateStudyTracker: async (trackerData) => {
      dispatch({ type: ACTIONS.UPDATE_STUDY_TRACKER, payload: trackerData });
      
      // Save to cloud storage
      try {
        await cloudStorage.updateStudyTracker(trackerData);
      } catch (error) {
        console.error('Failed to save study tracker to cloud:', error);
      }
    },

    getStudyTracker: async () => {
      try {
        const trackerData = await cloudStorage.getStudyTracker();
        if (trackerData && trackerData.length > 0) {
          dispatch({ type: ACTIONS.UPDATE_STUDY_TRACKER, payload: trackerData });
          return trackerData;
        }
        return null;
      } catch (error) {
        console.error('Failed to get study tracker:', error);
        return null;
      }
    },

    resetAllData: () => {
      dispatch({ type: ACTIONS.RESET_DATA });
      storage.resetAllData();
    },

    // Cloud storage actions
    refreshGlobalData: async () => {
      try {
        const [globalStats, leaderboard] = await Promise.all([
          cloudStorage.getGlobalStats(),
          cloudStorage.getLeaderboard()
        ]);
        
        dispatch({ type: ACTIONS.SET_GLOBAL_STATS, payload: globalStats });
        dispatch({ type: ACTIONS.SET_LEADERBOARD, payload: leaderboard });
      } catch (error) {
        console.error('Failed to refresh global data:', error);
      }
    },

    getCurrentUserId: () => {
      return cloudStorage.getCurrentUserId();
    },

    getSyncStatus: () => {
      return cloudStorage.getSyncStatus();
    },

    // Utility functions
    getChapterProgress: (subject, chapter) => {
      const key = `${subject}-${chapter}`;
      return state?.stats?.chapterProgress?.[key] || {
        mastery: 0,
        attempts: 0,
        bestScore: 0,
        totalQuestions: 0,
        correctAnswers: 0
      };
    },

    calculateXP: (score, totalQuestions, timeBonus = 0) => {
      const baseXP = score * 10;
      const accuracyBonus = Math.floor((score / totalQuestions) * 50);
      return baseXP + accuracyBonus + timeBonus;
    },

    updateStreak: (isCorrect) => {
      const currentStreak = state?.profile?.streak || 0;
      const newStreak = isCorrect ? currentStreak + 1 : 0;
      
      actions.updateProfile({ streak: newStreak });
      return newStreak;
    },

    awardBadge: (badgeId) => {
      const currentBadges = state?.profile?.badges || [];
      if (!currentBadges.includes(badgeId)) {
        actions.updateProfile({ 
          badges: [...currentBadges, badgeId] 
        });
        return true;
      }
      return false;
    },

    checkAchievements: (quizResult) => {
      const { score, totalQuestions, subject, chapter } = quizResult;
      const accuracy = (score / totalQuestions) * 100;
      const newBadges = [];

      // Perfect score badge
      if (accuracy === 100 && !state.profile.badges.includes('perfect-score')) {
        newBadges.push('perfect-score');
      }

      // First quiz badge
      if (state.stats.totalQuestions === 0 && !state.profile.badges.includes('first-quiz')) {
        newBadges.push('first-quiz');
      }

      // Subject master badges
      const subjectMastery = state.stats.subjectMastery[subject] || 0;
      if (subjectMastery >= 80 && !state.profile.badges.includes(`${subject.toLowerCase()}-master`)) {
        newBadges.push(`${subject.toLowerCase()}-master`);
      }

      // Award new badges
      if (newBadges.length > 0) {
        const currentBadges = state.profile.badges || [];
        actions.updateProfile({ 
          badges: [...currentBadges, ...newBadges] 
        });
      }

      return newBadges;
    }
  };

  const value = {
    ...state,
    ...actions
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};