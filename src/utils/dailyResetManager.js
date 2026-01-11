// DailyResetManager - Handles automatic daily state resets for AVION.EXE
import db from './database'
import calendarCore from './calendarCore'

class DailyResetManager {
  constructor() {
    this.calendar = calendarCore
    this.resetInProgress = false
  }

  async resetDailyStates() {
    if (this.resetInProgress) {
      console.log('Daily reset already in progress, skipping...')
      return
    }

    this.resetInProgress = true
    
    try {
      const today = this.calendar.getTodayString()
      console.log('Starting daily reset for:', today)

      // Initialize today's daily execution record
      await this.initializeDailyExecution(today)
      
      // Check and update streak status
      await this.checkStreakStatus(today)
      
      // Update momentum calculations
      await this.updateMomentumScore(today)
      
      // Clear any cached daily data
      this.clearDailyCache()
      
      // Log successful reset
      console.log('Daily states reset completed for:', today)
      
    } catch (error) {
      console.error('Failed to reset daily states:', error)
      throw error
    } finally {
      this.resetInProgress = false
    }
  }

  async initializeDailyExecution(date) {
    try {
      // Check if daily execution already exists
      const existingExecution = await this.getDailyExecution(date)
      
      if (!existingExecution) {
        // Initialize new daily execution record
        const dailyExecution = {
          date,
          criticalBlocksCompleted: 0,
          totalCriticalBlocks: 4, // Default from Daily Protocol
          timeSpentMinutes: 0,
          emergencyModeUsed: false,
          streakStatus: 'pending',
          momentumScore: 0,
          primaryObjective: null,
          timestamp: new Date().toISOString()
        }
        
        // For now, store in activity data (will be enhanced with DailyExecution schema)
        await db.saveActivityData(date, 0)
        
        console.log('Daily execution initialized for:', date)
      } else {
        console.log('Daily execution already exists for:', date)
      }
    } catch (error) {
      console.error('Failed to initialize daily execution:', error)
      throw error
    }
  }

  async getDailyExecution(date) {
    try {
      // For now, check existing daily tasks structure
      // Later this will use the new DailyExecution schema
      const dailyTasks = await db.getDailyTasks(date)
      const activityData = await db.getActivityData(1)
      
      const todayActivity = activityData.find(a => a.date === date)
      
      return todayActivity || (dailyTasks.length > 0 ? { date, tasks: dailyTasks } : null)
    } catch (error) {
      console.error('Failed to get daily execution:', error)
      return null
    }
  }

  async checkStreakStatus(today) {
    try {
      const yesterday = this.getYesterday(today)
      const yesterdayExecution = await this.getDailyExecution(yesterday)
      
      let streakStatus = 'maintained'
      
      if (!yesterdayExecution) {
        // No data for yesterday - streak might be broken
        streakStatus = 'broken'
        console.log('Streak broken: No execution data for yesterday')
      } else {
        // Check if critical blocks were completed yesterday
        const yesterdayTasks = await db.getDailyTasks(yesterday)
        const completedTasks = yesterdayTasks.filter(task => task.completed)
        
        if (completedTasks.length < 2) { // Minimum 2 critical blocks for streak
          streakStatus = 'broken'
          console.log('Streak broken: Insufficient critical blocks completed yesterday')
        } else {
          console.log('Streak maintained: Critical blocks completed yesterday')
        }
      }
      
      // Update system state with streak status
      await this.updateStreakStatus(today, streakStatus)
      
      return streakStatus
    } catch (error) {
      console.error('Failed to check streak status:', error)
      return 'unknown'
    }
  }

  async updateStreakStatus(date, status) {
    try {
      // For now, log the streak status
      // Later this will update the SystemState schema
      console.log(`Streak status for ${date}:`, status)
      
      if (status === 'broken') {
        // Trigger recovery system (will be implemented in Phase 4)
        console.log('Streak broken - recovery system should be triggered')
      }
    } catch (error) {
      console.error('Failed to update streak status:', error)
    }
  }

  async updateMomentumScore(today) {
    try {
      // Calculate momentum based on recent activity
      const recentActivity = await db.getActivityData(7) // Last 7 days
      
      let momentumScore = 0
      
      if (recentActivity.length > 0) {
        const avgIntensity = recentActivity.reduce((sum, day) => sum + day.intensity, 0) / recentActivity.length
        const consistency = recentActivity.filter(day => day.intensity > 0).length / 7
        
        // Simple momentum calculation (will be enhanced with AI in later phases)
        momentumScore = Math.round((avgIntensity * 50) + (consistency * 50))
      }
      
      console.log(`Momentum score for ${today}:`, momentumScore)
      
      // Store momentum score (will be enhanced with SystemState schema)
      return momentumScore
    } catch (error) {
      console.error('Failed to update momentum score:', error)
      return 0
    }
  }

  clearDailyCache() {
    // Clear any cached daily data
    // This will be expanded as more caching is added
    console.log('Daily cache cleared')
    
    // Clear any browser cache related to daily data
    if (typeof window !== 'undefined' && window.localStorage) {
      // Clear any daily cache keys
      const keysToRemove = []
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i)
        if (key && key.startsWith('daily_cache_')) {
          keysToRemove.push(key)
        }
      }
      
      keysToRemove.forEach(key => {
        window.localStorage.removeItem(key)
      })
    }
  }

  getYesterday(todayStr) {
    const today = new Date(todayStr)
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    return yesterday.toISOString().split('T')[0]
  }

  getTomorrow(todayStr) {
    const today = new Date(todayStr)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  // Manual reset trigger for testing or emergency situations
  async triggerManualReset() {
    console.log('Manual daily reset triggered')
    await this.resetDailyStates()
    this.calendar.broadcastDateChange()
  }

  // Get reset status
  isResetInProgress() {
    return this.resetInProgress
  }

  // Schedule a specific time reset (for testing)
  scheduleResetAt(date) {
    const targetTime = new Date(date).getTime()
    const now = new Date().getTime()
    const delay = targetTime - now
    
    if (delay > 0) {
      console.log(`Scheduling reset in ${Math.round(delay / 1000)} seconds`)
      setTimeout(() => {
        this.resetDailyStates()
        this.calendar.broadcastDateChange()
      }, delay)
    } else {
      console.log('Target time is in the past, executing reset immediately')
      this.triggerManualReset()
    }
  }
}

// Create and export singleton instance
const dailyResetManager = new DailyResetManager()

export default dailyResetManager