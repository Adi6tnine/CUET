// Cloud Storage Service for AVION
// Enables shared data storage and progress tracking across users

class CloudStorageService {
  constructor() {
    this.baseURL = 'https://api.jsonbin.io/v3/b';
    this.apiKey = import.meta.env.VITE_JSONBIN_API_KEY || 'your_jsonbin_api_key_here';
    this.binId = import.meta.env.VITE_JSONBIN_BIN_ID || 'your_bin_id_here';
    this.isEnabled = this.apiKey !== 'your_jsonbin_api_key_here' && this.binId !== 'your_bin_id_here';
    
    // Fallback to localStorage if cloud storage is not configured
    this.storageKey = 'cuet-ai-ultimate-shared-data';
    this.lastSyncKey = 'cuet-ai-ultimate-last-sync';
    
    console.log(`🌐 Cloud Storage: ${this.isEnabled ? 'ENABLED' : 'DISABLED (using localStorage)'}`);
  }

  // Initialize shared data structure
  getDefaultSharedData() {
    return {
      metadata: {
        appName: 'AVION',
        version: '2.0.0',
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        totalUsers: 0,
        totalQuizzes: 0
      },
      globalStats: {
        totalQuestions: 0,
        totalCorrectAnswers: 0,
        totalQuizzes: 0,
        averageAccuracy: 0,
        topPerformers: [],
        subjectStats: {},
        dailyStats: {}
      },
      users: {},
      leaderboard: [],
      achievements: [],
      sharedQuestionBanks: {}
    };
  }

  // Generate unique user ID
  generateUserId() {
    const existingId = localStorage.getItem('cuet-user-id');
    if (existingId) return existingId;
    
    const userId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    localStorage.setItem('cuet-user-id', userId);
    return userId;
  }

  // Get current user ID
  getCurrentUserId() {
    return this.generateUserId();
  }

  // Load shared data from cloud or localStorage
  async loadSharedData() {
    try {
      if (this.isEnabled) {
        console.log('📥 Loading shared data from cloud...');
        const response = await fetch(`${this.baseURL}/${this.binId}/latest`, {
          headers: {
            'X-Master-Key': this.apiKey
          }
        });

        if (response.ok) {
          const data = await response.json();
          const sharedData = data.record || this.getDefaultSharedData();
          
          // Cache locally
          localStorage.setItem(this.storageKey, JSON.stringify(sharedData));
          localStorage.setItem(this.lastSyncKey, new Date().toISOString());
          
          console.log('✅ Shared data loaded from cloud');
          return sharedData;
        }
      }
      
      // Fallback to localStorage
      const localData = localStorage.getItem(this.storageKey);
      if (localData) {
        console.log('📱 Loading shared data from localStorage');
        return JSON.parse(localData);
      }
      
      // Return default data
      const defaultData = this.getDefaultSharedData();
      localStorage.setItem(this.storageKey, JSON.stringify(defaultData));
      return defaultData;
      
    } catch (error) {
      console.error('❌ Failed to load shared data:', error);
      
      // Fallback to localStorage or default
      const localData = localStorage.getItem(this.storageKey);
      return localData ? JSON.parse(localData) : this.getDefaultSharedData();
    }
  }

  // Save shared data to cloud and localStorage
  async saveSharedData(data) {
    try {
      // Always save to localStorage first
      data.metadata.lastUpdated = new Date().toISOString();
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      
      if (this.isEnabled) {
        console.log('📤 Saving shared data to cloud...');
        const response = await fetch(`${this.baseURL}/${this.binId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': this.apiKey
          },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          localStorage.setItem(this.lastSyncKey, new Date().toISOString());
          console.log('✅ Shared data saved to cloud');
          return true;
        } else {
          console.warn('⚠️ Failed to save to cloud, data saved locally');
        }
      } else {
        console.log('💾 Shared data saved to localStorage');
      }
      
      return true;
    } catch (error) {
      console.error('❌ Failed to save shared data:', error);
      return false;
    }
  }

  // Add or update user data
  async updateUserData(userData) {
    try {
      const sharedData = await this.loadSharedData();
      const userId = this.getCurrentUserId();
      
      // Update user data
      sharedData.users[userId] = {
        ...sharedData.users[userId],
        ...userData,
        lastActive: new Date().toISOString(),
        userId: userId
      };
      
      // Update metadata
      if (!sharedData.users[userId].createdAt) {
        sharedData.users[userId].createdAt = new Date().toISOString();
        sharedData.metadata.totalUsers = Object.keys(sharedData.users).length;
      }
      
      await this.saveSharedData(sharedData);
      return true;
    } catch (error) {
      console.error('❌ Failed to update user data:', error);
      return false;
    }
  }

  // Update study tracker data
  async updateStudyTracker(trackerData) {
    try {
      const sharedData = await this.loadSharedData();
      const userId = this.getCurrentUserId();
      
      // Ensure user exists
      if (!sharedData.users[userId]) {
        sharedData.users[userId] = {
          userId: userId,
          name: 'Anonymous User',
          createdAt: new Date().toISOString(),
          lastActive: new Date().toISOString()
        };
      }
      
      // Update study tracker data
      sharedData.users[userId].studyTracker = trackerData;
      sharedData.users[userId].lastTrackerUpdate = new Date().toISOString();
      sharedData.users[userId].lastActive = new Date().toISOString();
      
      await this.saveSharedData(sharedData);
      return true;
    } catch (error) {
      console.error('❌ Failed to update study tracker:', error);
      return false;
    }
  }

  // Get study tracker data
  async getStudyTracker() {
    try {
      const sharedData = await this.loadSharedData();
      const userId = this.getCurrentUserId();
      return sharedData.users[userId]?.studyTracker || null;
    } catch (error) {
      console.error('❌ Failed to get study tracker:', error);
      return null;
    }
  }

  // Add quiz result to shared data
  async addQuizResult(quizResult) {
    try {
      const sharedData = await this.loadSharedData();
      const userId = this.getCurrentUserId();
      
      // Ensure user exists
      if (!sharedData.users[userId]) {
        sharedData.users[userId] = {
          userId: userId,
          name: 'Anonymous User',
          createdAt: new Date().toISOString(),
          totalQuizzes: 0,
          totalQuestions: 0,
          totalCorrectAnswers: 0,
          totalXP: 0,
          quizHistory: []
        };
      }
      
      const user = sharedData.users[userId];
      
      // Add quiz to user history
      user.quizHistory = user.quizHistory || [];
      user.quizHistory.push({
        ...quizResult,
        timestamp: new Date().toISOString()
      });
      
      // Update user stats
      user.totalQuizzes = (user.totalQuizzes || 0) + 1;
      user.totalQuestions = (user.totalQuestions || 0) + quizResult.totalQuestions;
      user.totalCorrectAnswers = (user.totalCorrectAnswers || 0) + quizResult.correctAnswers;
      user.totalXP = (user.totalXP || 0) + quizResult.earnedXP;
      user.averageAccuracy = Math.round((user.totalCorrectAnswers / user.totalQuestions) * 100);
      user.lastActive = new Date().toISOString();
      
      // Update global stats
      sharedData.globalStats.totalQuizzes += 1;
      sharedData.globalStats.totalQuestions += quizResult.totalQuestions;
      sharedData.globalStats.totalCorrectAnswers += quizResult.correctAnswers;
      sharedData.globalStats.averageAccuracy = Math.round(
        (sharedData.globalStats.totalCorrectAnswers / sharedData.globalStats.totalQuestions) * 100
      );
      
      // Update subject stats
      const subject = quizResult.subject;
      if (!sharedData.globalStats.subjectStats[subject]) {
        sharedData.globalStats.subjectStats[subject] = {
          totalQuizzes: 0,
          totalQuestions: 0,
          totalCorrectAnswers: 0,
          averageAccuracy: 0
        };
      }
      
      const subjectStats = sharedData.globalStats.subjectStats[subject];
      subjectStats.totalQuizzes += 1;
      subjectStats.totalQuestions += quizResult.totalQuestions;
      subjectStats.totalCorrectAnswers += quizResult.correctAnswers;
      subjectStats.averageAccuracy = Math.round(
        (subjectStats.totalCorrectAnswers / subjectStats.totalQuestions) * 100
      );
      
      // Update daily stats
      const today = new Date().toISOString().split('T')[0];
      if (!sharedData.globalStats.dailyStats[today]) {
        sharedData.globalStats.dailyStats[today] = {
          quizzes: 0,
          questions: 0,
          correctAnswers: 0,
          uniqueUsers: new Set()
        };
      }
      
      sharedData.globalStats.dailyStats[today].quizzes += 1;
      sharedData.globalStats.dailyStats[today].questions += quizResult.totalQuestions;
      sharedData.globalStats.dailyStats[today].correctAnswers += quizResult.correctAnswers;
      sharedData.globalStats.dailyStats[today].uniqueUsers.add(userId);
      
      // Convert Set to array for JSON serialization
      sharedData.globalStats.dailyStats[today].uniqueUsers = 
        Array.from(sharedData.globalStats.dailyStats[today].uniqueUsers);
      
      // Update leaderboard
      this.updateLeaderboard(sharedData);
      
      await this.saveSharedData(sharedData);
      return true;
    } catch (error) {
      console.error('❌ Failed to add quiz result:', error);
      return false;
    }
  }

  // Update leaderboard
  updateLeaderboard(sharedData) {
    const users = Object.values(sharedData.users);
    
    // Sort by total XP, then by accuracy, then by total quizzes
    const leaderboard = users
      .filter(user => user.totalQuizzes > 0)
      .sort((a, b) => {
        if (b.totalXP !== a.totalXP) return b.totalXP - a.totalXP;
        if (b.averageAccuracy !== a.averageAccuracy) return b.averageAccuracy - a.averageAccuracy;
        return b.totalQuizzes - a.totalQuizzes;
      })
      .slice(0, 100) // Top 100 users
      .map((user, index) => ({
        rank: index + 1,
        userId: user.userId,
        name: user.name || 'Anonymous User',
        totalXP: user.totalXP || 0,
        averageAccuracy: user.averageAccuracy || 0,
        totalQuizzes: user.totalQuizzes || 0,
        lastActive: user.lastActive
      }));
    
    sharedData.leaderboard = leaderboard;
  }

  // Get leaderboard
  async getLeaderboard() {
    try {
      const sharedData = await this.loadSharedData();
      return sharedData.leaderboard || [];
    } catch (error) {
      console.error('❌ Failed to get leaderboard:', error);
      return [];
    }
  }

  // Get global stats
  async getGlobalStats() {
    try {
      const sharedData = await this.loadSharedData();
      return sharedData.globalStats || {};
    } catch (error) {
      console.error('❌ Failed to get global stats:', error);
      return {};
    }
  }

  // Get all users (for admin purposes)
  async getAllUsers() {
    try {
      const sharedData = await this.loadSharedData();
      return Object.values(sharedData.users || {});
    } catch (error) {
      console.error('❌ Failed to get all users:', error);
      return [];
    }
  }

  // Get current user data
  async getCurrentUserData() {
    try {
      const sharedData = await this.loadSharedData();
      const userId = this.getCurrentUserId();
      return sharedData.users[userId] || null;
    } catch (error) {
      console.error('❌ Failed to get current user data:', error);
      return null;
    }
  }

  // Sync local data with cloud
  async syncData() {
    try {
      if (!this.isEnabled) {
        console.log('📱 Cloud sync disabled, using localStorage only');
        return true;
      }
      
      const lastSync = localStorage.getItem(this.lastSyncKey);
      const now = new Date();
      const lastSyncTime = lastSync ? new Date(lastSync) : new Date(0);
      const timeDiff = now - lastSyncTime;
      
      // Sync every 5 minutes
      if (timeDiff < 5 * 60 * 1000) {
        console.log('⏰ Sync not needed yet');
        return true;
      }
      
      console.log('🔄 Syncing data with cloud...');
      const sharedData = await this.loadSharedData();
      await this.saveSharedData(sharedData);
      
      return true;
    } catch (error) {
      console.error('❌ Failed to sync data:', error);
      return false;
    }
  }

  // Get sync status
  getSyncStatus() {
    const lastSync = localStorage.getItem(this.lastSyncKey);
    return {
      isEnabled: this.isEnabled,
      lastSync: lastSync ? new Date(lastSync) : null,
      userId: this.getCurrentUserId()
    };
  }
}

// Export singleton instance
export const cloudStorage = new CloudStorageService();
export default CloudStorageService;