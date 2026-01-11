// Execution Engine - AI-powered task prioritization and execution management for AVION.EXE
import db from './database'
import { calendarCore } from './calendarSystem'
import aiDecisionLayer from './aiDecisionLayer'
import recoverySystem from './recoverySystem'
import intelligenceLayer from './intelligenceLayer'

class ExecutionEngine {
  constructor() {
    this.executionState = {
      currentObjective: null,
      emergencyMode: false,
      momentumScore: 0,
      executionScore: 0,
      lastUpdate: null
    }
    
    this.prioritizationWeights = {
      urgency: 0.4,        // Deadline proximity
      impact: 0.3,         // Academic/placement importance
      momentum: 0.2,       // Current streak/flow state
      aiConfidence: 0.1    // AI recommendation confidence
    }
    
    this.emergencyThresholds = {
      streakRisk: 2,       // Days without activity
      deadlineUrgency: 3,  // Days until critical deadline
      momentumDrop: 30     // Momentum score threshold
    }
  }

  // Main execution orchestration
  async orchestrateExecution() {
    try {
      console.log('🎯 Orchestrating daily execution...')
      
      // Gather execution context
      const context = await this.gatherExecutionContext()
      
      // Check for emergency mode activation
      const emergencyCheck = await this.checkEmergencyMode(context)
      
      // Get AI-selected primary objective
      const primaryObjective = await this.selectPrimaryObjective(context, emergencyCheck.isEmergency)
      
      // Prioritize all tasks using AI + rules
      const prioritizedTasks = await this.prioritizeTasks(context, primaryObjective)
      
      // Calculate momentum and execution scores
      const scores = await this.calculateExecutionScores(context, prioritizedTasks)
      
      // Update execution state
      this.executionState = {
        currentObjective: primaryObjective,
        emergencyMode: emergencyCheck.isEmergency,
        momentumScore: scores.momentum,
        executionScore: scores.execution,
        lastUpdate: new Date().toISOString()
      }
      
      // Save execution state to database
      await this.saveExecutionState(context.today)
      
      return {
        objective: primaryObjective,
        tasks: prioritizedTasks,
        scores,
        emergencyMode: emergencyCheck.isEmergency,
        recommendations: this.generateExecutionRecommendations(context, scores)
      }
      
    } catch (error) {
      console.error('Execution orchestration failed:', error)
      return this.getFallbackExecution()
    }
  }

  // AI-powered primary objective selection
  async selectPrimaryObjective(context, isEmergency) {
    try {
      // Use AI decision layer for intelligent objective selection
      const aiObjective = await aiDecisionLayer.selectDailyObjective()
      
      // Validate AI objective against context
      const validatedObjective = this.validateObjective(aiObjective, context, isEmergency)
      
      return {
        ...validatedObjective,
        source: 'ai',
        confidence: aiObjective.confidence || 0.7,
        reasoning: aiObjective.reason
      }
      
    } catch (error) {
      console.warn('AI objective selection failed, using rule-based:', error.message)
      return this.getRuleBasedObjective(context, isEmergency)
    }
  }

  // AI-powered task prioritization
  async prioritizeTasks(context, primaryObjective) {
    try {
      // Get all available tasks
      const allTasks = await this.gatherAllTasks(context)
      
      // Use intelligence layer for advanced prioritization
      const intelligenceInsights = await intelligenceLayer.getLatestIntelligence()
      
      // Apply AI prioritization algorithm
      const prioritizedTasks = this.applyAIPrioritization(
        allTasks, 
        primaryObjective, 
        intelligenceInsights,
        context
      )
      
      return prioritizedTasks
      
    } catch (error) {
      console.warn('AI task prioritization failed, using rule-based:', error.message)
      return this.getRuleBasedPrioritization(context, primaryObjective)
    }
  }

  // Emergency mode detection and activation
  async checkEmergencyMode(context) {
    try {
      // Check multiple emergency triggers
      const triggers = []
      
      // 1. Streak risk
      if (context.currentStreak === 0 && context.daysSinceActivity >= this.emergencyThresholds.streakRisk) {
        triggers.push({
          type: 'streak_risk',
          severity: 'high',
          reason: `No activity for ${context.daysSinceActivity} days`
        })
      }
      
      // 2. Deadline urgency
      if (context.nextDeadline && context.nextDeadline.daysUntil <= this.emergencyThresholds.deadlineUrgency) {
        triggers.push({
          type: 'deadline_urgency',
          severity: 'critical',
          reason: `${context.nextDeadline.title} in ${context.nextDeadline.daysUntil} days`
        })
      }
      
      // 3. Momentum drop
      if (context.momentumScore < this.emergencyThresholds.momentumDrop) {
        triggers.push({
          type: 'momentum_drop',
          severity: 'medium',
          reason: `Momentum score at ${context.momentumScore}%`
        })
      }
      
      // 4. Recovery system recommendation
      if (context.recoveryStatus?.recoveryActive) {
        triggers.push({
          type: 'recovery_active',
          severity: context.recoveryStatus.mode === 'emergency' ? 'critical' : 'medium',
          reason: `Recovery mode: ${context.recoveryStatus.mode}`
        })
      }
      
      const isEmergency = triggers.some(t => t.severity === 'critical') || triggers.length >= 2
      
      return {
        isEmergency,
        triggers,
        complexity: isEmergency ? 0.5 : 1.0, // 50% complexity reduction in emergency
        message: isEmergency ? 'Emergency mode activated - simplified tasks' : 'Normal operation'
      }
      
    } catch (error) {
      console.error('Emergency mode check failed:', error)
      return { isEmergency: false, triggers: [], complexity: 1.0 }
    }
  }

  // Calculate momentum and execution scores
  async calculateExecutionScores(context, tasks) {
    try {
      // Momentum score based on recent consistency
      const momentumScore = this.calculateMomentumScore(context)
      
      // Execution score based on task completion and quality
      const executionScore = this.calculateExecutionScore(context, tasks)
      
      // AI influence on scoring
      const aiInfluence = await this.getAIInfluence(context)
      
      return {
        momentum: Math.round(momentumScore + aiInfluence.momentumAdjustment),
        execution: Math.round(executionScore + aiInfluence.executionAdjustment),
        aiInfluence
      }
      
    } catch (error) {
      console.error('Score calculation failed:', error)
      return { momentum: 50, execution: 50, aiInfluence: {} }
    }
  }

  // Gather comprehensive execution context
  async gatherExecutionContext() {
    try {
      const today = calendarCore.getTodayString()
      
      const [
        systemState,
        todayExecution,
        todayRoutine,
        executionHistory,
        upcomingEvents,
        recoveryStatus
      ] = await Promise.all([
        db.getSystemState(),
        db.getDailyExecution(today),
        db.getDailyRoutine(today),
        db.getExecutionHistory(7),
        calendarCore.getUpcomingEvents(today, 14),
        recoverySystem.getRecoveryStatus()
      ])
      
      // Find next critical deadline
      const criticalEvents = upcomingEvents.filter(e => 
        e.eventType === 'exam' || e.eventType === 'deadline' || e.type === 'exam' || e.type === 'dead'
      )
      const nextDeadline = criticalEvents.sort((a, b) => new Date(a.date) - new Date(b.date))[0]
      
      return {
        today,
        systemState,
        todayExecution,
        todayRoutine,
        executionHistory,
        recoveryStatus,
        currentStreak: systemState.currentStreak || 0,
        momentumScore: systemState.momentumScore || 0,
        daysSinceActivity: this.calculateDaysSinceActivity(executionHistory),
        nextDeadline: nextDeadline ? {
          title: nextDeadline.event || nextDeadline.title,
          daysUntil: Math.ceil((new Date(nextDeadline.date) - new Date()) / (1000 * 60 * 60 * 24)),
          type: nextDeadline.type || nextDeadline.eventType
        } : null
      }
    } catch (error) {
      console.error('Failed to gather execution context:', error)
      return { today: calendarCore.getTodayString() }
    }
  }

  // Validate AI objective against context
  validateObjective(aiObjective, context, isEmergency) {
    // Apply emergency mode complexity reduction
    if (isEmergency && aiObjective.estimatedTime) {
      const originalTime = parseInt(aiObjective.estimatedTime.match(/\d+/)?.[0] || '30')
      const reducedTime = Math.floor(originalTime * 0.5)
      aiObjective.estimatedTime = `${reducedTime} minutes (emergency mode)`
    }
    
    // Ensure objective aligns with recovery mode
    if (context.recoveryStatus?.recoveryActive) {
      aiObjective.type = 'recovery'
      aiObjective.priority = 'medium' // Never critical in recovery
    }
    
    return aiObjective
  }

  // Rule-based objective fallback
  getRuleBasedObjective(context, isEmergency) {
    if (context.recoveryStatus?.recoveryActive) {
      return {
        objective: 'Complete Recovery Task',
        type: 'recovery',
        priority: 'medium',
        reason: 'Recovery mode active - gentle progress',
        estimatedTime: isEmergency ? '10 minutes' : '20 minutes',
        source: 'rule_based'
      }
    }
    
    if (context.nextDeadline && context.nextDeadline.daysUntil <= 3) {
      return {
        objective: `Prepare for ${context.nextDeadline.title}`,
        type: 'deadline',
        priority: 'critical',
        reason: `Urgent deadline in ${context.nextDeadline.daysUntil} days`,
        estimatedTime: isEmergency ? '30 minutes' : '60 minutes',
        source: 'rule_based'
      }
    }
    
    return {
      objective: 'Complete Morning Protocol Block',
      type: 'protocol',
      priority: 'high',
      reason: 'Maintain daily consistency',
      estimatedTime: isEmergency ? '15 minutes' : '30 minutes',
      source: 'rule_based'
    }
  }

  // Gather all available tasks
  async gatherAllTasks(context) {
    const tasks = []
    
    // Protocol tasks
    if (context.todayRoutine) {
      const protocolTasks = Object.keys(context.todayRoutine.blocks || {}).map(blockId => ({
        id: `protocol-${blockId}`,
        title: `Complete ${blockId} block`,
        type: 'protocol',
        priority: 'high',
        completed: context.todayRoutine.blocks[blockId]?.completed || false,
        estimatedTime: 30
      }))
      tasks.push(...protocolTasks)
    }
    
    // Academic tasks (simplified)
    tasks.push({
      id: 'academic-study',
      title: 'Study Priority Subject',
      type: 'academic',
      priority: 'high',
      completed: false,
      estimatedTime: 45
    })
    
    // Skill tasks (simplified)
    tasks.push({
      id: 'skill-practice',
      title: 'Practice Priority Skill',
      type: 'skill',
      priority: 'medium',
      completed: false,
      estimatedTime: 30
    })
    
    return tasks
  }

  // Apply AI prioritization algorithm
  applyAIPrioritization(tasks, primaryObjective, intelligenceInsights, context) {
    return tasks.map(task => {
      // Calculate priority score using weighted factors
      let priorityScore = 0
      
      // Urgency factor
      const urgencyScore = this.calculateUrgencyScore(task, context)
      priorityScore += urgencyScore * this.prioritizationWeights.urgency
      
      // Impact factor
      const impactScore = this.calculateImpactScore(task, intelligenceInsights)
      priorityScore += impactScore * this.prioritizationWeights.impact
      
      // Momentum factor
      const momentumScore = this.calculateMomentumFactor(task, context)
      priorityScore += momentumScore * this.prioritizationWeights.momentum
      
      // AI confidence factor
      const aiScore = task.id === primaryObjective.type ? 1.0 : 0.5
      priorityScore += aiScore * this.prioritizationWeights.aiConfidence
      
      return {
        ...task,
        priorityScore,
        aiRecommended: task.id === primaryObjective.type,
        reasoning: this.generateTaskReasoning(task, priorityScore, primaryObjective)
      }
    }).sort((a, b) => b.priorityScore - a.priorityScore)
  }

  // Rule-based prioritization fallback
  getRuleBasedPrioritization(context, primaryObjective) {
    const tasks = []
    
    // Always prioritize primary objective
    tasks.push({
      id: primaryObjective.type,
      title: primaryObjective.objective,
      priority: primaryObjective.priority,
      priorityScore: 1.0,
      aiRecommended: true
    })
    
    return tasks
  }

  // Calculate various scoring factors
  calculateUrgencyScore(task, context) {
    if (task.type === 'deadline' && context.nextDeadline) {
      return Math.max(0, 1 - (context.nextDeadline.daysUntil / 7))
    }
    if (task.type === 'protocol') return 0.8
    return 0.5
  }

  calculateImpactScore(task, intelligenceInsights) {
    // Use intelligence insights to determine impact
    if (intelligenceInsights?.coupling?.skillGaps?.some(gap => task.type.includes(gap.skill))) {
      return 0.9
    }
    if (task.type === 'academic') return 0.8
    return 0.6
  }

  calculateMomentumFactor(task, context) {
    if (context.currentStreak > 5 && task.type === 'protocol') return 0.9
    if (context.momentumScore > 70) return 0.8
    return 0.5
  }

  generateTaskReasoning(task, score, primaryObjective) {
    if (task.aiRecommended) return 'AI-recommended primary objective'
    if (score > 0.8) return 'High priority based on urgency and impact'
    if (score > 0.6) return 'Medium priority - good momentum builder'
    return 'Lower priority - complete when time allows'
  }

  // Score calculation methods
  calculateMomentumScore(context) {
    let score = 50 // Base score
    
    // Streak bonus
    score += Math.min(30, context.currentStreak * 3)
    
    // Recent execution bonus
    const recentAvg = context.executionHistory.slice(0, 3).reduce((sum, e) => sum + (e.executionScore || 0), 0) / 3
    score += (recentAvg - 50) * 0.4
    
    // Recovery penalty
    if (context.recoveryStatus?.recoveryActive) {
      score *= 0.7
    }
    
    return Math.max(0, Math.min(100, score))
  }

  calculateExecutionScore(context, tasks) {
    let score = 50 // Base score
    
    // Task completion bonus
    const completedTasks = tasks.filter(t => t.completed).length
    const totalTasks = tasks.length
    if (totalTasks > 0) {
      score += (completedTasks / totalTasks) * 30
    }
    
    // Protocol completion bonus
    if (context.todayRoutine) {
      const protocolCompletion = Object.values(context.todayRoutine.blocks || {}).filter(b => b?.completed).length
      score += protocolCompletion * 5
    }
    
    return Math.max(0, Math.min(100, score))
  }

  async getAIInfluence(context) {
    try {
      // Get AI recommendations for score adjustments
      const intelligenceInsights = await intelligenceLayer.getLatestIntelligence()
      
      return {
        momentumAdjustment: intelligenceInsights?.behavioral?.adaptations?.confidenceAdjustment * 10 || 0,
        executionAdjustment: intelligenceInsights?.performance?.confidence > 0.7 ? 5 : 0
      }
    } catch (error) {
      return { momentumAdjustment: 0, executionAdjustment: 0 }
    }
  }

  // Utility methods
  calculateDaysSinceActivity(executionHistory) {
    if (executionHistory.length === 0) return 7
    
    const lastActivity = executionHistory.find(e => e.executionScore > 0)
    if (!lastActivity) return 7
    
    const daysSince = Math.floor((Date.now() - new Date(lastActivity.date).getTime()) / (1000 * 60 * 60 * 24))
    return daysSince
  }

  generateExecutionRecommendations(context, scores) {
    const recommendations = []
    
    if (scores.momentum < 30) {
      recommendations.push('Focus on building momentum with small wins')
    }
    
    if (scores.execution < 50) {
      recommendations.push('Prioritize protocol completion for consistency')
    }
    
    if (context.recoveryStatus?.recoveryActive) {
      recommendations.push('Gentle progress - recovery mode active')
    }
    
    return recommendations
  }

  async saveExecutionState(date) {
    try {
      await db.saveDailyExecution(date, {
        criticalBlocksCompleted: 0, // Will be updated as tasks complete
        timeSpent: 0,
        emergencyModeUsed: this.executionState.emergencyMode,
        streakStatus: 'maintained',
        executionScore: this.executionState.executionScore,
        blocksCompleted: [],
        skillTasksCompleted: 0,
        academicTasksCompleted: 0
      })
    } catch (error) {
      console.error('Failed to save execution state:', error)
    }
  }

  getFallbackExecution() {
    return {
      objective: {
        objective: 'Complete Morning Protocol',
        type: 'protocol',
        priority: 'high',
        source: 'fallback'
      },
      tasks: [{
        id: 'protocol-morning',
        title: 'Complete Morning Block',
        priority: 'high',
        priorityScore: 1.0
      }],
      scores: { momentum: 50, execution: 50 },
      emergencyMode: false,
      recommendations: ['Start with basic protocol completion']
    }
  }

  // Public interface methods
  async getCurrentObjective() {
    if (!this.executionState.currentObjective) {
      const execution = await this.orchestrateExecution()
      return execution.objective
    }
    return this.executionState.currentObjective
  }

  async getPrioritizedTasks() {
    const execution = await this.orchestrateExecution()
    return execution.tasks
  }

  getExecutionState() {
    return { ...this.executionState }
  }

  async refreshExecution() {
    return await this.orchestrateExecution()
  }
}

// Export singleton instance
export const executionEngine = new ExecutionEngine()
export default executionEngine