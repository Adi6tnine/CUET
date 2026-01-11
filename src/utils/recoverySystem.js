// Recovery System - Intelligent failure detection and recovery for AVION.EXE
import db from './database'
import { calendarCore } from './calendarSystem'
import aiDecisionLayer from './aiDecisionLayer'

class RecoverySystem {
  constructor() {
    this.recoveryThresholds = {
      streakBreakDays: 2, // Days without activity to trigger recovery
      lowCompletionRate: 30, // % completion rate threshold
      lowMomentumScore: 20, // Momentum score threshold
      burnoutIndicators: 3, // Number of stress indicators to trigger burnout detection
      emergencyEscalation: 5 // Days in recovery before emergency escalation
    }
    
    this.stressIndicators = [
      'consecutive_missed_days',
      'declining_completion_rate',
      'emergency_mode_overuse',
      'low_momentum_trend',
      'missed_critical_blocks',
      'time_efficiency_drop'
    ]
    
    this.recoveryModes = {
      NORMAL: 'normal',
      LIGHT_RECOVERY: 'light_recovery',
      DEEP_RECOVERY: 'deep_recovery',
      EMERGENCY: 'emergency'
    }
  }

  // Main recovery detection and activation
  async checkAndActivateRecovery() {
    try {
      console.log('🔍 Checking recovery system status...')
      
      const systemState = await db.getSystemState()
      const recoveryContext = await this.gatherRecoveryContext()
      
      // Check if already in recovery mode
      if (systemState.recoveryMode) {
        return await this.manageExistingRecovery(recoveryContext)
      }
      
      // Detect if recovery should be activated
      const shouldActivate = await this.detectRecoveryNeed(recoveryContext)
      
      if (shouldActivate.activate) {
        return await this.activateRecovery(shouldActivate.mode, shouldActivate.reason, recoveryContext)
      }
      
      return {
        recoveryActive: false,
        mode: this.recoveryModes.NORMAL,
        message: 'System operating normally'
      }
      
    } catch (error) {
      console.error('Recovery system check failed:', error)
      return {
        recoveryActive: false,
        mode: this.recoveryModes.NORMAL,
        error: error.message
      }
    }
  }

  // Detect if recovery mode should be activated
  async detectRecoveryNeed(context) {
    const triggers = []
    
    // 1. Streak Break Detection
    if (context.currentStreak === 0 && context.daysSinceLastActivity >= this.recoveryThresholds.streakBreakDays) {
      triggers.push({
        type: 'streak_break',
        severity: 'high',
        reason: `No activity for ${context.daysSinceLastActivity} days`
      })
    }
    
    // 2. Low Completion Rate
    if (context.recentCompletionRate < this.recoveryThresholds.lowCompletionRate) {
      triggers.push({
        type: 'low_completion',
        severity: 'medium',
        reason: `Completion rate dropped to ${context.recentCompletionRate}%`
      })
    }
    
    // 3. Low Momentum Score
    if (context.momentumScore < this.recoveryThresholds.lowMomentumScore) {
      triggers.push({
        type: 'low_momentum',
        severity: 'medium',
        reason: `Momentum score at ${context.momentumScore}%`
      })
    }
    
    // 4. Burnout Pattern Detection
    const burnoutScore = await this.detectBurnoutPattern(context)
    if (burnoutScore.indicatorCount >= this.recoveryThresholds.burnoutIndicators) {
      triggers.push({
        type: 'burnout_pattern',
        severity: 'high',
        reason: `${burnoutScore.indicatorCount} burnout indicators detected`,
        indicators: burnoutScore.indicators
      })
    }
    
    // 5. Emergency Mode Overuse
    if (context.emergencyModeUsage > 50) { // More than 50% of recent days
      triggers.push({
        type: 'emergency_overuse',
        severity: 'high',
        reason: `Emergency mode used ${context.emergencyModeUsage}% of recent days`
      })
    }
    
    // Determine recovery mode based on triggers
    if (triggers.length === 0) {
      return { activate: false }
    }
    
    const highSeverityTriggers = triggers.filter(t => t.severity === 'high')
    const recoveryMode = highSeverityTriggers.length > 0 ? 
      this.recoveryModes.DEEP_RECOVERY : 
      this.recoveryModes.LIGHT_RECOVERY
    
    return {
      activate: true,
      mode: recoveryMode,
      reason: triggers.map(t => t.reason).join('; '),
      triggers
    }
  }

  // Detect burnout patterns using multiple indicators
  async detectBurnoutPattern(context) {
    const indicators = []
    
    // 1. Consecutive missed days
    if (context.consecutiveMissedDays >= 2) {
      indicators.push('consecutive_missed_days')
    }
    
    // 2. Declining completion rate trend
    if (context.completionTrend === 'declining') {
      indicators.push('declining_completion_rate')
    }
    
    // 3. Emergency mode overuse
    if (context.emergencyModeUsage > 30) {
      indicators.push('emergency_mode_overuse')
    }
    
    // 4. Low momentum trend
    if (context.momentumTrend === 'declining') {
      indicators.push('low_momentum_trend')
    }
    
    // 5. Missed critical blocks
    if (context.missedCriticalBlocks > 2) {
      indicators.push('missed_critical_blocks')
    }
    
    // 6. Time efficiency drop
    if (context.timeEfficiency < 60) {
      indicators.push('time_efficiency_drop')
    }
    
    return {
      indicatorCount: indicators.length,
      indicators,
      burnoutRisk: indicators.length >= 3 ? 'high' : indicators.length >= 2 ? 'medium' : 'low'
    }
  }

  // Activate recovery mode
  async activateRecovery(mode, reason, context) {
    try {
      console.log(`🚨 Activating recovery mode: ${mode}`)
      console.log(`Reason: ${reason}`)
      
      // Update system state
      await db.updateSystemState({
        recoveryMode: mode,
        recoveryStartDate: calendarCore.getTodayString(),
        recoveryReason: reason,
        preRecoveryStreak: context.currentStreak
      })
      
      // Generate recovery tasks using AI
      let recoveryTasks
      try {
        const aiDecision = await aiDecisionLayer.shouldEnterRecoveryMode()
        recoveryTasks = aiDecision.simplifiedTasks || this.getDefaultRecoveryTasks(mode)
      } catch (aiError) {
        console.warn('AI recovery decision failed, using defaults:', aiError.message)
        recoveryTasks = this.getDefaultRecoveryTasks(mode)
      }
      
      // Log recovery activation
      await db.logAIDecision('recovery_activation', context, {
        mode,
        reason,
        recoveryTasks,
        activationDate: calendarCore.getTodayString()
      }, 0.9)
      
      return {
        recoveryActive: true,
        mode,
        reason,
        recoveryTasks,
        message: `Recovery mode activated: ${mode}`,
        startDate: calendarCore.getTodayString()
      }
      
    } catch (error) {
      console.error('Failed to activate recovery mode:', error)
      throw error
    }
  }

  // Manage existing recovery mode
  async manageExistingRecovery(context) {
    try {
      const systemState = await db.getSystemState()
      const recoveryStartDate = new Date(systemState.recoveryStartDate)
      const today = new Date()
      const daysInRecovery = Math.floor((today - recoveryStartDate) / (1000 * 60 * 60 * 24))
      
      // Check if recovery should be escalated to emergency
      if (daysInRecovery >= this.recoveryThresholds.emergencyEscalation && 
          systemState.recoveryMode !== this.recoveryModes.EMERGENCY) {
        return await this.escalateToEmergency(context, daysInRecovery)
      }
      
      // Check if recovery can be graduated
      const canGraduate = await this.checkRecoveryGraduation(context, daysInRecovery)
      if (canGraduate.graduate) {
        return await this.graduateFromRecovery(canGraduate.newMode, context)
      }
      
      // Continue current recovery mode
      return {
        recoveryActive: true,
        mode: systemState.recoveryMode,
        daysInRecovery,
        message: `Recovery mode active for ${daysInRecovery} days`,
        reason: systemState.recoveryReason
      }
      
    } catch (error) {
      console.error('Failed to manage existing recovery:', error)
      throw error
    }
  }

  // Check if user can graduate from recovery mode
  async checkRecoveryGraduation(context, daysInRecovery) {
    // Minimum recovery period
    if (daysInRecovery < 2) {
      return { graduate: false, reason: 'Minimum recovery period not met' }
    }
    
    // Check improvement indicators
    const improvements = []
    
    if (context.recentCompletionRate > 70) {
      improvements.push('completion_rate_improved')
    }
    
    if (context.momentumScore > 50) {
      improvements.push('momentum_recovered')
    }
    
    if (context.consecutiveMissedDays === 0) {
      improvements.push('consistency_restored')
    }
    
    if (context.currentStreak >= 2) {
      improvements.push('streak_rebuilding')
    }
    
    // Need at least 2 improvements to graduate
    if (improvements.length >= 2) {
      const systemState = await db.getSystemState()
      const currentMode = systemState.recoveryMode
      
      // Determine graduation path
      if (currentMode === this.recoveryModes.EMERGENCY) {
        return { graduate: true, newMode: this.recoveryModes.DEEP_RECOVERY, improvements }
      } else if (currentMode === this.recoveryModes.DEEP_RECOVERY) {
        return { graduate: true, newMode: this.recoveryModes.LIGHT_RECOVERY, improvements }
      } else if (currentMode === this.recoveryModes.LIGHT_RECOVERY) {
        return { graduate: true, newMode: this.recoveryModes.NORMAL, improvements }
      }
    }
    
    return { 
      graduate: false, 
      reason: `Only ${improvements.length} improvements detected, need 2+`,
      improvements 
    }
  }

  // Graduate from recovery mode
  async graduateFromRecovery(newMode, context) {
    try {
      console.log(`🎉 Graduating recovery: ${newMode}`)
      
      if (newMode === this.recoveryModes.NORMAL) {
        // Full graduation - exit recovery mode
        await db.updateSystemState({
          recoveryMode: false,
          recoveryEndDate: calendarCore.getTodayString(),
          lastRecoveryDuration: null // Will be calculated
        })
        
        return {
          recoveryActive: false,
          mode: this.recoveryModes.NORMAL,
          message: 'Successfully graduated from recovery mode!',
          graduated: true
        }
      } else {
        // Partial graduation - move to lighter recovery mode
        await db.updateSystemState({
          recoveryMode: newMode
        })
        
        return {
          recoveryActive: true,
          mode: newMode,
          message: `Recovery mode reduced to: ${newMode}`,
          graduated: true
        }
      }
      
    } catch (error) {
      console.error('Failed to graduate from recovery:', error)
      throw error
    }
  }

  // Escalate to emergency mode
  async escalateToEmergency(context, daysInRecovery) {
    try {
      console.log(`🚨 Escalating to emergency mode after ${daysInRecovery} days`)
      
      await db.updateSystemState({
        recoveryMode: this.recoveryModes.EMERGENCY,
        emergencyEscalationDate: calendarCore.getTodayString()
      })
      
      const emergencyTasks = this.getEmergencyTasks()
      
      return {
        recoveryActive: true,
        mode: this.recoveryModes.EMERGENCY,
        escalated: true,
        daysInRecovery,
        emergencyTasks,
        message: `Emergency mode activated after ${daysInRecovery} days in recovery`
      }
      
    } catch (error) {
      console.error('Failed to escalate to emergency mode:', error)
      throw error
    }
  }

  // Get default recovery tasks based on mode
  getDefaultRecoveryTasks(mode) {
    const taskSets = {
      [this.recoveryModes.LIGHT_RECOVERY]: [
        'Complete one 15-minute study session',
        'Review notes for 10 minutes',
        'Complete basic daily protocol (2 blocks minimum)'
      ],
      [this.recoveryModes.DEEP_RECOVERY]: [
        'Complete one 10-minute study session',
        'Read course material for 5 minutes',
        'Complete morning protocol block only'
      ],
      [this.recoveryModes.EMERGENCY]: [
        'Open study material for 5 minutes',
        'Review one concept or formula',
        'Complete basic morning routine'
      ]
    }
    
    return taskSets[mode] || taskSets[this.recoveryModes.LIGHT_RECOVERY]
  }

  // Get emergency intervention tasks
  getEmergencyTasks() {
    return [
      'Take a 5-minute break and breathe',
      'Open your study material (no pressure to study)',
      'Complete basic self-care routine',
      'Set a 10-minute timer for any academic activity',
      'Review your goals and motivations'
    ]
  }

  // Gather comprehensive recovery context
  async gatherRecoveryContext() {
    try {
      const today = calendarCore.getTodayString()
      const systemState = await db.getSystemState()
      const executionHistory = await db.getExecutionHistory(14) // Last 14 days
      const routineHistory = await db.getRoutineHistory(14)
      
      // Calculate metrics
      const currentStreak = systemState.currentStreak || 0
      const daysSinceLastActivity = this.calculateDaysSinceLastActivity(executionHistory)
      const recentCompletionRate = this.calculateCompletionRate(executionHistory)
      const momentumScore = systemState.momentumScore || 0
      const emergencyModeUsage = this.calculateEmergencyModeUsage(routineHistory)
      const consecutiveMissedDays = this.calculateConsecutiveMissedDays(executionHistory)
      const completionTrend = this.calculateCompletionTrend(executionHistory)
      const momentumTrend = this.calculateMomentumTrend(routineHistory)
      const missedCriticalBlocks = this.calculateMissedCriticalBlocks(routineHistory)
      const timeEfficiency = this.calculateTimeEfficiency(executionHistory)
      
      return {
        currentStreak,
        daysSinceLastActivity,
        recentCompletionRate,
        momentumScore,
        emergencyModeUsage,
        consecutiveMissedDays,
        completionTrend,
        momentumTrend,
        missedCriticalBlocks,
        timeEfficiency,
        executionHistory,
        routineHistory,
        today
      }
      
    } catch (error) {
      console.error('Failed to gather recovery context:', error)
      // Return safe defaults
      return {
        currentStreak: 0,
        daysSinceLastActivity: 0,
        recentCompletionRate: 50,
        momentumScore: 50,
        emergencyModeUsage: 0,
        consecutiveMissedDays: 0,
        completionTrend: 'stable',
        momentumTrend: 'stable',
        missedCriticalBlocks: 0,
        timeEfficiency: 75,
        executionHistory: [],
        routineHistory: [],
        today: calendarCore.getTodayString()
      }
    }
  }

  // Helper calculation methods
  calculateDaysSinceLastActivity(executionHistory) {
    if (executionHistory.length === 0) return 7 // Default to 7 if no history
    
    const lastActivity = executionHistory[0] // Most recent
    const lastDate = new Date(lastActivity.date)
    const today = new Date()
    
    return Math.floor((today - lastDate) / (1000 * 60 * 60 * 24))
  }

  calculateCompletionRate(executionHistory) {
    if (executionHistory.length === 0) return 0
    
    const totalScore = executionHistory.reduce((sum, exec) => sum + (exec.executionScore || 0), 0)
    return Math.round(totalScore / executionHistory.length)
  }

  calculateEmergencyModeUsage(routineHistory) {
    if (routineHistory.length === 0) return 0
    
    const emergencyDays = routineHistory.filter(routine => routine.emergencyMode).length
    return Math.round((emergencyDays / routineHistory.length) * 100)
  }

  calculateConsecutiveMissedDays(executionHistory) {
    let consecutiveMissed = 0
    const today = new Date()
    
    for (let i = 0; i < 7; i++) { // Check last 7 days
      const checkDate = new Date(today)
      checkDate.setDate(checkDate.getDate() - i)
      const dateStr = checkDate.toISOString().split('T')[0]
      
      const dayExecution = executionHistory.find(exec => exec.date === dateStr)
      if (!dayExecution || dayExecution.executionScore === 0) {
        consecutiveMissed++
      } else {
        break // Stop at first non-missed day
      }
    }
    
    return consecutiveMissed
  }

  calculateCompletionTrend(executionHistory) {
    if (executionHistory.length < 4) return 'stable'
    
    const recent = executionHistory.slice(0, 3).reduce((sum, exec) => sum + (exec.executionScore || 0), 0) / 3
    const older = executionHistory.slice(3, 6).reduce((sum, exec) => sum + (exec.executionScore || 0), 0) / 3
    
    if (recent > older + 10) return 'improving'
    if (recent < older - 10) return 'declining'
    return 'stable'
  }

  calculateMomentumTrend(routineHistory) {
    if (routineHistory.length < 4) return 'stable'
    
    const recent = routineHistory.slice(0, 3).reduce((sum, routine) => sum + (routine.momentumScore || 0), 0) / 3
    const older = routineHistory.slice(3, 6).reduce((sum, routine) => sum + (routine.momentumScore || 0), 0) / 3
    
    if (recent > older + 10) return 'improving'
    if (recent < older - 10) return 'declining'
    return 'stable'
  }

  calculateMissedCriticalBlocks(routineHistory) {
    return routineHistory.reduce((count, routine) => {
      const blocks = routine.blocks || {}
      const criticalBlocks = ['morning', 'evening'] // Define critical blocks
      const missedCritical = criticalBlocks.filter(blockId => !blocks[blockId]?.completed).length
      return count + missedCritical
    }, 0)
  }

  calculateTimeEfficiency(executionHistory) {
    if (executionHistory.length === 0) return 75 // Default
    
    const avgTimeSpent = executionHistory.reduce((sum, exec) => sum + (exec.timeSpent || 0), 0) / executionHistory.length
    const avgScore = executionHistory.reduce((sum, exec) => sum + (exec.executionScore || 0), 0) / executionHistory.length
    
    if (avgTimeSpent === 0) return 75
    return Math.min(100, Math.round((avgScore / avgTimeSpent) * 100))
  }

  // Public interface methods
  async getRecoveryStatus() {
    const systemState = await db.getSystemState()
    return {
      isInRecovery: !!systemState.recoveryMode,
      mode: systemState.recoveryMode || this.recoveryModes.NORMAL,
      startDate: systemState.recoveryStartDate,
      reason: systemState.recoveryReason
    }
  }

  async forceExitRecovery() {
    await db.updateSystemState({
      recoveryMode: false,
      recoveryEndDate: calendarCore.getTodayString(),
      forceExited: true
    })
    
    console.log('🔄 Recovery mode force exited by user')
    return { success: true, message: 'Recovery mode exited' }
  }
}

// Export singleton instance
export const recoverySystem = new RecoverySystem()
export default recoverySystem