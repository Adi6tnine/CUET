// Intelligence Layer - Advanced analytics, learning, and prediction for AVION.EXE
import db from './database'
import { calendarCore } from './calendarSystem'
import aiDecisionLayer from './aiDecisionLayer'
import recoverySystem from './recoverySystem'

class IntelligenceLayer {
  constructor() {
    this.predictionModels = {
      performance: new PerformancePredictionModel(),
      productivity: new ProductivityPatternModel(),
      academicSkill: new AcademicSkillCouplingModel(),
      intervention: new InterventionModel(),
      behavioral: new BehavioralLearningModel()
    }
    
    this.learningThresholds = {
      minDataPoints: 7, // Minimum days of data for predictions
      confidenceThreshold: 0.6, // Minimum confidence for predictions
      patternStrength: 0.7, // Minimum pattern strength for recommendations
      adaptationRate: 0.1 // Learning rate for model updates
    }
    
    this.predictionCache = new Map()
    this.cacheExpiry = 6 * 60 * 60 * 1000 // 6 hours
  }

  // Main intelligence analysis entry point
  async analyzeAndPredict() {
    try {
      console.log('🧠 Running intelligence analysis...')
      
      const context = await this.gatherIntelligenceContext()
      
      // Run all prediction models
      const predictions = await Promise.all([
        this.predictWeeklyPerformance(context),
        this.identifyProductivityPatterns(context),
        this.analyzeAcademicSkillCoupling(context),
        this.recommendInterventions(context),
        this.updateBehavioralModel(context)
      ])
      
      const [performance, productivity, coupling, interventions, behavioral] = predictions
      
      const intelligenceReport = {
        timestamp: new Date().toISOString(),
        performance,
        productivity,
        coupling,
        interventions,
        behavioral,
        overallInsights: this.generateOverallInsights(predictions),
        confidence: this.calculateOverallConfidence(predictions)
      }
      
      // Cache the results
      this.predictionCache.set('latest', {
        data: intelligenceReport,
        timestamp: Date.now()
      })
      
      // Log intelligence analysis
      await db.logAIDecision('intelligence_analysis', context, intelligenceReport, intelligenceReport.confidence)
      
      console.log('🧠 Intelligence analysis completed')
      return intelligenceReport
      
    } catch (error) {
      console.error('Intelligence analysis failed:', error)
      return this.getFallbackIntelligence()
    }
  }

  // 1. Performance Prediction Algorithm
  async predictWeeklyPerformance(context) {
    try {
      const model = this.predictionModels.performance
      
      // Gather performance data
      const executionHistory = context.executionHistory || await db.getExecutionHistory(21) // 3 weeks
      const routineHistory = context.routineHistory || await db.getRoutineHistory(21)
      
      if (executionHistory.length < this.learningThresholds.minDataPoints) {
        return {
          prediction: 'insufficient_data',
          confidence: 0.1,
          message: 'Need more data for accurate predictions'
        }
      }
      
      // Calculate performance trajectory
      const trajectory = model.calculateTrajectory(executionHistory)
      const weeklyPrediction = model.predictNextWeek(trajectory, routineHistory)
      
      // Generate confidence intervals
      const confidence = model.calculateConfidence(trajectory, executionHistory.length)
      
      return {
        prediction: weeklyPrediction,
        trajectory,
        confidence,
        factors: model.getInfluencingFactors(executionHistory),
        recommendations: model.getPerformanceRecommendations(weeklyPrediction)
      }
      
    } catch (error) {
      console.error('Performance prediction failed:', error)
      return {
        prediction: 'stable',
        confidence: 0.3,
        message: 'Using baseline prediction'
      }
    }
  }

  // 2. Productivity Pattern Recognition
  async identifyProductivityPatterns(context) {
    try {
      const model = this.predictionModels.productivity
      
      const timeTracking = await db.getTimeTracking() // All time tracking data
      const executionHistory = context.executionHistory || await db.getExecutionHistory(30)
      
      // Identify time-based patterns
      const timePatterns = model.analyzeTimePatterns(timeTracking, executionHistory)
      
      // Identify day-of-week patterns
      const dayPatterns = model.analyzeDayPatterns(executionHistory)
      
      // Identify streak patterns
      const streakPatterns = model.analyzeStreakPatterns(executionHistory)
      
      // Generate optimal scheduling suggestions
      const optimalSchedule = model.generateOptimalSchedule(timePatterns, dayPatterns)
      
      return {
        timePatterns,
        dayPatterns,
        streakPatterns,
        optimalSchedule,
        confidence: model.calculatePatternConfidence(timePatterns, dayPatterns),
        recommendations: model.getProductivityRecommendations(optimalSchedule)
      }
      
    } catch (error) {
      console.error('Productivity pattern analysis failed:', error)
      return {
        patterns: 'baseline',
        confidence: 0.3,
        message: 'Using default productivity patterns'
      }
    }
  }

  // 3. Academic-Skill Coupling Intelligence
  async analyzeAcademicSkillCoupling(context) {
    try {
      const model = this.predictionModels.academicSkill
      
      // Get academic progress
      const syllabusProgress = await this.getAcademicProgress()
      
      // Get skill progress
      const skillProgress = await this.getSkillProgress()
      
      // Get upcoming deadlines
      const upcomingEvents = await calendarCore.getUpcomingEvents(calendarCore.getTodayString(), 30)
      
      // Analyze correlations
      const correlations = model.analyzeCorrelations(syllabusProgress, skillProgress)
      
      // Identify skill gaps for academic needs
      const skillGaps = model.identifySkillGaps(syllabusProgress, skillProgress, upcomingEvents)
      
      // Generate integrated study plan
      const integratedPlan = model.generateIntegratedPlan(correlations, skillGaps, upcomingEvents)
      
      return {
        correlations,
        skillGaps,
        integratedPlan,
        confidence: model.calculateCouplingConfidence(correlations),
        recommendations: model.getCouplingRecommendations(skillGaps, integratedPlan)
      }
      
    } catch (error) {
      console.error('Academic-skill coupling analysis failed:', error)
      return {
        coupling: 'baseline',
        confidence: 0.3,
        message: 'Using default coupling analysis'
      }
    }
  }

  // 4. Intervention Recommendation System
  async recommendInterventions(context) {
    try {
      const model = this.predictionModels.intervention
      
      const executionHistory = context.executionHistory || await db.getExecutionHistory(14)
      const recoveryHistory = await this.getRecoveryHistory()
      
      // Detect declining performance trends
      const declineDetection = model.detectDecline(executionHistory)
      
      // Analyze intervention effectiveness
      const interventionEffectiveness = model.analyzeInterventionHistory(recoveryHistory)
      
      // Generate specific interventions
      const interventions = model.generateInterventions(declineDetection, interventionEffectiveness)
      
      return {
        declineDetection,
        interventions,
        effectiveness: interventionEffectiveness,
        confidence: model.calculateInterventionConfidence(declineDetection),
        urgency: model.calculateUrgency(declineDetection)
      }
      
    } catch (error) {
      console.error('Intervention recommendation failed:', error)
      return {
        interventions: [],
        confidence: 0.3,
        message: 'No specific interventions recommended'
      }
    }
  }

  // 5. Behavioral Learning System
  async updateBehavioralModel(context) {
    try {
      const model = this.predictionModels.behavioral
      
      const userBehavior = await this.gatherBehaviorData()
      const aiDecisions = await db.getAIDecisions(null, 30) // All AI decisions from last 30 days
      
      // Track prediction accuracy
      const accuracyMetrics = model.trackPredictionAccuracy(aiDecisions, userBehavior)
      
      // Update user preference model
      const preferences = model.updatePreferences(userBehavior, accuracyMetrics)
      
      // Adapt recommendation algorithms
      const adaptations = model.adaptRecommendations(preferences, accuracyMetrics)
      
      return {
        accuracyMetrics,
        preferences,
        adaptations,
        confidence: model.calculateLearningConfidence(accuracyMetrics),
        improvements: model.getImprovementSuggestions(adaptations)
      }
      
    } catch (error) {
      console.error('Behavioral learning update failed:', error)
      return {
        learning: 'baseline',
        confidence: 0.3,
        message: 'Using default behavioral model'
      }
    }
  }

  // Context gathering for intelligence analysis
  async gatherIntelligenceContext() {
    try {
      const [
        executionHistory,
        routineHistory,
        systemState,
        recoveryStatus,
        aiDecisions
      ] = await Promise.all([
        db.getExecutionHistory(30),
        db.getRoutineHistory(30),
        db.getSystemState(),
        recoverySystem.getRecoveryStatus(),
        db.getAIDecisions(null, 30)
      ])
      
      return {
        executionHistory,
        routineHistory,
        systemState,
        recoveryStatus,
        aiDecisions,
        currentDate: calendarCore.getTodayString(),
        dayOfWeek: calendarCore.getDayOfWeek()
      }
    } catch (error) {
      console.error('Failed to gather intelligence context:', error)
      return {}
    }
  }

  // Helper methods for data gathering
  async getAcademicProgress() {
    try {
      // Get progress for all subjects
      const subjects = ['DAA', 'Java', 'OS', 'DBMS', 'CN', 'SE', 'ML'] // 4th sem subjects
      const progress = {}
      
      for (const subject of subjects) {
        const subjectProgress = await db.getSyllabusProgress(subject)
        const totalTopics = subjectProgress.length
        const completedTopics = subjectProgress.filter(p => p.completed).length
        
        progress[subject] = {
          completion: totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0,
          totalTopics,
          completedTopics,
          recentActivity: this.getRecentActivity(subjectProgress)
        }
      }
      
      return progress
    } catch (error) {
      console.error('Failed to get academic progress:', error)
      return {}
    }
  }

  async getSkillProgress() {
    try {
      const tracks = ['bash', 'python', 'security'] // Skill tracks
      const progress = {}
      
      for (const track of tracks) {
        const trackProgress = await db.getEnhancedSkillProgress(track)
        const totalTasks = trackProgress.length
        const completedTasks = trackProgress.filter(p => p.completed).length
        
        progress[track] = {
          completion: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
          totalTasks,
          completedTasks,
          avgDifficulty: this.calculateAvgDifficulty(trackProgress),
          avgConfidence: this.calculateAvgConfidence(trackProgress)
        }
      }
      
      return progress
    } catch (error) {
      console.error('Failed to get skill progress:', error)
      return {}
    }
  }

  async getRecoveryHistory() {
    try {
      const recoveryDecisions = await db.getAIDecisions('recovery_mode', 90)
      return recoveryDecisions.map(decision => ({
        date: decision.date,
        mode: JSON.parse(decision.outputResult).recoveryLevel,
        reason: JSON.parse(decision.outputResult).reason,
        duration: this.calculateRecoveryDuration(decision)
      }))
    } catch (error) {
      console.error('Failed to get recovery history:', error)
      return []
    }
  }

  async gatherBehaviorData() {
    try {
      const [
        executionHistory,
        aiDecisions,
        timeTracking
      ] = await Promise.all([
        db.getExecutionHistory(30),
        db.getAIDecisions(null, 30),
        db.getTimeTracking()
      ])
      
      return {
        executionPatterns: this.analyzeExecutionPatterns(executionHistory),
        aiInteraction: this.analyzeAIInteraction(aiDecisions),
        timePreferences: this.analyzeTimePreferences(timeTracking),
        consistencyBehavior: this.analyzeConsistencyBehavior(executionHistory)
      }
    } catch (error) {
      console.error('Failed to gather behavior data:', error)
      return {}
    }
  }

  // Utility methods
  getRecentActivity(progress) {
    const recent = progress.filter(p => {
      const daysSince = (Date.now() - new Date(p.timestamp).getTime()) / (1000 * 60 * 60 * 24)
      return daysSince <= 7
    })
    return recent.length
  }

  calculateAvgDifficulty(progress) {
    if (progress.length === 0) return 0
    return progress.reduce((sum, p) => sum + (p.difficultyLevel || 1), 0) / progress.length
  }

  calculateAvgConfidence(progress) {
    if (progress.length === 0) return 0
    return progress.reduce((sum, p) => sum + (p.confidenceRating || 1), 0) / progress.length
  }

  calculateRecoveryDuration(decision) {
    // Calculate duration based on decision timestamps
    return 1 // Simplified for now
  }

  analyzeExecutionPatterns(history) {
    return {
      avgDailyScore: history.reduce((sum, h) => sum + (h.executionScore || 0), 0) / Math.max(history.length, 1),
      consistency: this.calculateConsistency(history),
      peakDays: this.identifyPeakDays(history)
    }
  }

  analyzeAIInteraction(decisions) {
    return {
      totalDecisions: decisions.length,
      avgConfidence: decisions.reduce((sum, d) => sum + (d.confidenceScore || 0), 0) / Math.max(decisions.length, 1),
      decisionTypes: this.groupDecisionTypes(decisions)
    }
  }

  analyzeTimePreferences(timeTracking) {
    return {
      preferredHours: this.identifyPreferredHours(timeTracking),
      avgSessionLength: this.calculateAvgSessionLength(timeTracking)
    }
  }

  analyzeConsistencyBehavior(history) {
    return {
      streakPattern: this.analyzeStreakPattern(history),
      recoveryPattern: this.analyzeRecoveryPattern(history)
    }
  }

  calculateConsistency(history) {
    const activeDays = history.filter(h => h.executionScore > 0).length
    return activeDays / Math.max(history.length, 1)
  }

  identifyPeakDays(history) {
    const dayScores = {}
    history.forEach(h => {
      const day = new Date(h.date).getDay()
      if (!dayScores[day]) dayScores[day] = []
      dayScores[day].push(h.executionScore || 0)
    })
    
    const avgByDay = {}
    Object.keys(dayScores).forEach(day => {
      avgByDay[day] = dayScores[day].reduce((sum, score) => sum + score, 0) / dayScores[day].length
    })
    
    return Object.keys(avgByDay).sort((a, b) => avgByDay[b] - avgByDay[a]).slice(0, 3)
  }

  groupDecisionTypes(decisions) {
    const types = {}
    decisions.forEach(d => {
      types[d.decisionType] = (types[d.decisionType] || 0) + 1
    })
    return types
  }

  identifyPreferredHours(timeTracking) {
    // Simplified - would analyze actual time patterns
    return [9, 14, 20] // 9 AM, 2 PM, 8 PM
  }

  calculateAvgSessionLength(timeTracking) {
    if (timeTracking.length === 0) return 30
    return timeTracking.reduce((sum, t) => sum + (t.timeSpent || 0), 0) / timeTracking.length
  }

  analyzeStreakPattern(history) {
    // Simplified streak pattern analysis
    return {
      avgStreakLength: 5,
      longestStreak: 12,
      streakBreakFrequency: 0.2
    }
  }

  analyzeRecoveryPattern(history) {
    // Simplified recovery pattern analysis
    return {
      avgRecoveryTime: 3,
      recoverySuccessRate: 0.8
    }
  }

  // Generate overall insights from all predictions
  generateOverallInsights(predictions) {
    const insights = []
    
    // Performance insights
    if (predictions[0].confidence > 0.6) {
      insights.push({
        type: 'performance',
        message: `Performance trend: ${predictions[0].prediction}`,
        confidence: predictions[0].confidence
      })
    }
    
    // Productivity insights
    if (predictions[1].confidence > 0.6) {
      insights.push({
        type: 'productivity',
        message: 'Optimal productivity patterns identified',
        confidence: predictions[1].confidence
      })
    }
    
    // Coupling insights
    if (predictions[2].confidence > 0.6) {
      insights.push({
        type: 'coupling',
        message: 'Academic-skill correlations detected',
        confidence: predictions[2].confidence
      })
    }
    
    return insights
  }

  calculateOverallConfidence(predictions) {
    const confidences = predictions.map(p => p.confidence || 0.3)
    return confidences.reduce((sum, c) => sum + c, 0) / confidences.length
  }

  getFallbackIntelligence() {
    return {
      timestamp: new Date().toISOString(),
      performance: { prediction: 'stable', confidence: 0.3 },
      productivity: { patterns: 'baseline', confidence: 0.3 },
      coupling: { coupling: 'baseline', confidence: 0.3 },
      interventions: { interventions: [], confidence: 0.3 },
      behavioral: { learning: 'baseline', confidence: 0.3 },
      overallInsights: [],
      confidence: 0.3,
      message: 'Using fallback intelligence analysis'
    }
  }

  // Public interface methods
  async getLatestIntelligence() {
    const cached = this.predictionCache.get('latest')
    if (cached && (Date.now() - cached.timestamp) < this.cacheExpiry) {
      return cached.data
    }
    
    return await this.analyzeAndPredict()
  }

  async getPerformancePrediction() {
    const context = await this.gatherIntelligenceContext()
    return await this.predictWeeklyPerformance(context)
  }

  async getProductivityInsights() {
    const context = await this.gatherIntelligenceContext()
    return await this.identifyProductivityPatterns(context)
  }

  async getSkillRecommendations() {
    const context = await this.gatherIntelligenceContext()
    return await this.analyzeAcademicSkillCoupling(context)
  }

  clearCache() {
    this.predictionCache.clear()
    console.log('Intelligence cache cleared')
  }
}

// Simplified prediction models (would be more sophisticated in production)
class PerformancePredictionModel {
  calculateTrajectory(history) {
    if (history.length < 3) return 'insufficient_data'
    
    const recent = history.slice(0, 7).reduce((sum, h) => sum + (h.executionScore || 0), 0) / 7
    const older = history.slice(7, 14).reduce((sum, h) => sum + (h.executionScore || 0), 0) / 7
    
    if (recent > older + 10) return 'improving'
    if (recent < older - 10) return 'declining'
    return 'stable'
  }

  predictNextWeek(trajectory, routineHistory) {
    const baseScore = routineHistory.reduce((sum, r) => sum + (r.momentumScore || 0), 0) / Math.max(routineHistory.length, 1)
    
    switch (trajectory) {
      case 'improving': return Math.min(100, baseScore + 15)
      case 'declining': return Math.max(0, baseScore - 15)
      default: return baseScore
    }
  }

  calculateConfidence(trajectory, dataPoints) {
    if (dataPoints < 7) return 0.3
    if (dataPoints < 14) return 0.6
    return trajectory === 'insufficient_data' ? 0.2 : 0.8
  }

  getInfluencingFactors(history) {
    return ['consistency', 'momentum', 'recovery_patterns']
  }

  getPerformanceRecommendations(prediction) {
    if (prediction > 80) return ['Maintain current momentum', 'Consider increasing difficulty']
    if (prediction < 50) return ['Focus on consistency', 'Consider recovery mode']
    return ['Steady progress', 'Monitor trends']
  }
}

class ProductivityPatternModel {
  analyzeTimePatterns(timeTracking, executionHistory) {
    return {
      peakHours: [9, 14, 20],
      lowEnergyHours: [12, 16],
      optimalSessionLength: 45
    }
  }

  analyzeDayPatterns(executionHistory) {
    return {
      bestDays: ['Monday', 'Wednesday', 'Friday'],
      challengingDays: ['Tuesday', 'Thursday'],
      weekendPattern: 'moderate'
    }
  }

  analyzeStreakPatterns(executionHistory) {
    return {
      avgStreakLength: 5,
      streakBreakTriggers: ['weekend', 'low_energy'],
      recoveryTime: 2
    }
  }

  generateOptimalSchedule(timePatterns, dayPatterns) {
    return {
      morningBlock: '9:00-10:30',
      afternoonBlock: '14:00-15:30',
      eveningBlock: '20:00-21:00',
      restDays: ['Sunday']
    }
  }

  calculatePatternConfidence(timePatterns, dayPatterns) {
    return 0.7 // Simplified
  }

  getProductivityRecommendations(schedule) {
    return [
      'Schedule demanding tasks during peak hours',
      'Use low-energy periods for review',
      'Maintain consistent daily rhythm'
    ]
  }
}

class AcademicSkillCouplingModel {
  analyzeCorrelations(academic, skills) {
    return {
      'DAA-python': 0.8,
      'OS-bash': 0.9,
      'DBMS-python': 0.7,
      'CN-security': 0.6
    }
  }

  identifySkillGaps(academic, skills, events) {
    const gaps = []
    
    // Check if DAA progress needs Python skills
    if (academic.DAA?.completion > skills.python?.completion + 20) {
      gaps.push({
        skill: 'python',
        reason: 'DAA progress ahead of Python skills',
        urgency: 'medium'
      })
    }
    
    return gaps
  }

  generateIntegratedPlan(correlations, gaps, events) {
    return {
      weeklyFocus: gaps.length > 0 ? gaps[0].skill : 'balanced',
      skillPriority: gaps.map(g => g.skill),
      academicAlignment: 'maintain_pace'
    }
  }

  calculateCouplingConfidence(correlations) {
    return 0.6 // Simplified
  }

  getCouplingRecommendations(gaps, plan) {
    if (gaps.length === 0) return ['Maintain balanced progress']
    return gaps.map(gap => `Focus on ${gap.skill} to support academic progress`)
  }
}

class InterventionModel {
  detectDecline(history) {
    const recent = history.slice(0, 3).reduce((sum, h) => sum + (h.executionScore || 0), 0) / 3
    const baseline = history.reduce((sum, h) => sum + (h.executionScore || 0), 0) / history.length
    
    return {
      isDecline: recent < baseline - 20,
      severity: recent < baseline - 30 ? 'high' : 'medium',
      trend: recent < baseline ? 'declining' : 'stable'
    }
  }

  analyzeInterventionHistory(recoveryHistory) {
    return {
      totalInterventions: recoveryHistory.length,
      avgDuration: 3,
      successRate: 0.8
    }
  }

  generateInterventions(decline, effectiveness) {
    if (!decline.isDecline) return []
    
    return [
      {
        type: 'schedule_adjustment',
        description: 'Reduce daily targets by 25%',
        urgency: decline.severity
      },
      {
        type: 'recovery_mode',
        description: 'Activate light recovery mode',
        urgency: decline.severity
      }
    ]
  }

  calculateInterventionConfidence(decline) {
    return decline.isDecline ? 0.8 : 0.3
  }

  calculateUrgency(decline) {
    return decline.severity === 'high' ? 'immediate' : 'moderate'
  }
}

class BehavioralLearningModel {
  trackPredictionAccuracy(decisions, behavior) {
    return {
      overallAccuracy: 0.75,
      byDecisionType: {
        daily_objective: 0.8,
        weekly_analysis: 0.7,
        recovery_mode: 0.9
      }
    }
  }

  updatePreferences(behavior, accuracy) {
    return {
      preferredTaskLength: behavior.timePreferences?.avgSessionLength || 30,
      preferredDifficulty: 'moderate',
      recoveryTolerance: 'medium'
    }
  }

  adaptRecommendations(preferences, accuracy) {
    return {
      taskLengthAdjustment: 0,
      difficultyAdjustment: 0,
      confidenceAdjustment: accuracy.overallAccuracy - 0.5
    }
  }

  calculateLearningConfidence(accuracy) {
    return accuracy.overallAccuracy
  }

  getImprovementSuggestions(adaptations) {
    return [
      'Continue current approach',
      'Monitor accuracy trends',
      'Adjust based on user feedback'
    ]
  }
}

// Export singleton instance
export const intelligenceLayer = new IntelligenceLayer()
export default intelligenceLayer