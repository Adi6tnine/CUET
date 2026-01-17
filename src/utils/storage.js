// LocalStorage utilities for user data persistence
class StorageManager {
  constructor() {
    this.storageKey = 'cuet-ai-ultimate';
  }

  // Get user data
  getUserData() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : this.getDefaultUserData();
    } catch (error) {
      console.error('Failed to load user data:', error);
      return this.getDefaultUserData();
    }
  }

  // Save user data
  saveUserData(userData) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Failed to save user data:', error);
      return false;
    }
  }

  // Default user data structure
  getDefaultUserData() {
    return {
      profile: {
        name: 'CUET Aspirant',
        xp: 0,
        streak: 0,
        level: 1,
        badges: [],
        joinDate: new Date().toISOString()
      },
      stats: {
        totalQuestions: 0,
        correctAnswers: 0,
        totalTime: 0,
        averageAccuracy: 0,
        subjectMastery: {
          "Physics": 0,
          "Chemistry": 0,
          "Mathematics": 0,
          "English": 0,
          "General Test": 0
        },
        chapterProgress: {}
      },
      settings: {
        darkMode: false,
        soundEnabled: true,
        notifications: true,
        autoSubmit: false,
        showExplanations: true,
        timerWarnings: true,
        vibration: true
      },
      quizHistory: [],
      studyTracker: []
    };
  }

  // Update specific data
  updateUserStats(newStats) {
    const userData = this.getUserData();
    userData.stats = { ...userData.stats, ...newStats };
    this.saveUserData(userData);
  }

  updateProfile(newProfile) {
    const userData = this.getUserData();
    userData.profile = { ...userData.profile, ...newProfile };
    this.saveUserData(userData);
  }

  updateSettings(newSettings) {
    const userData = this.getUserData();
    userData.settings = { ...userData.settings, ...newSettings };
    this.saveUserData(userData);
  }

  // Quiz history management
  addQuizResult(quizResult) {
    const userData = this.getUserData();
    userData.quizHistory.unshift(quizResult);
    
    // Keep only last 50 quiz results
    if (userData.quizHistory.length > 50) {
      userData.quizHistory = userData.quizHistory.slice(0, 50);
    }
    
    this.saveUserData(userData);
  }

  // Chapter progress tracking
  updateChapterProgress(subject, chapter, progress) {
    const userData = this.getUserData();
    const key = `${subject}-${chapter}`;
    userData.stats.chapterProgress[key] = {
      ...userData.stats.chapterProgress[key],
      ...progress,
      lastAttempt: new Date().toISOString()
    };
    this.saveUserData(userData);
  }

  getChapterProgress(subject, chapter) {
    const userData = this.getUserData();
    const key = `${subject}-${chapter}`;
    return userData.stats.chapterProgress[key] || {
      mastery: 0,
      attempts: 0,
      bestScore: 0,
      totalQuestions: 0,
      correctAnswers: 0
    };
  }

  // Reset all data
  resetAllData() {
    try {
      localStorage.removeItem(this.storageKey);
      return true;
    } catch (error) {
      console.error('Failed to reset data:', error);
      return false;
    }
  }

  // Export data for backup
  exportData() {
    const userData = this.getUserData();
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cuet-ai-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }

  // Import data from backup
  importData(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const userData = JSON.parse(e.target.result);
          this.saveUserData(userData);
          resolve(userData);
        } catch (error) {
          reject(new Error('Invalid backup file format'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }
}

export const storage = new StorageManager();