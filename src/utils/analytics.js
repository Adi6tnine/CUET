// Smart Study Analytics Engine for Adarsh's Command Center
import db from './database'
import { subjectData } from '../data/semesterData'

export class StudyAnalytics {
  constructor() {
    this.placementCoreSubjects = ['24CSH-206', '24CSH-207', '24CSP-209'] // DAA, Java, Competitive Coding
  }

  // Calculate study streak (consecutive days with activity)
  async calculateStudyStreak() {
    try {
      const today = new Date()
      const activityData = await db.getActivityData(30) // Get last 30 days
      
      let streak = 0
      let currentDate = new Date(today)
      
      // Check backwards from today
      while (true) {
        const dateStr = currentDate.toISOString().split('T')[0]
        const dayActivity = activityData.find(a => a.date === dateStr)
        
        if (dayActivity && dayActivity.intensity > 0) {
          streak++
          currentDate.setDate(currentDate.getDate() - 1)
        } else {
          break
        }
      }
      
      return streak
    } catch (error) {
      console.error('Failed to calculate study streak:', error)
      return 0
    }
  }

  // Analyze subject-wise progress and identify weak areas
  async analyzeSubjectProgress() {
    try {
      // Get progress for all subjects
      const analysis = {}
      
      for (const subject of subjectData) {
        const subjectProgress = await db.getSyllabusProgress(subject.id)
        
        let totalTopics = 0
        let completedTopics = 0
        
        subject.units.forEach(unit => {
          unit.topics.forEach(topic => {
            totalTopics++
            const progress = subjectProgress.find(p => 
              p.topic === topic || p.topicIndex === unit.topics.indexOf(topic)
            )
            if (progress && progress.completed) completedTopics++
          })
        })
        
        const percentage = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0
        const isPlacementCore = this.placementCoreSubjects.includes(subject.id)
        
        analysis[subject.id] = {
          name: subject.name,
          type: subject.type,
          completed: completedTopics,
          total: totalTopics,
          percentage: Math.round(percentage),
          isPlacementCore,
          status: this.getSubjectStatus(percentage, isPlacementCore),
          recommendation: this.getSubjectRecommendation(percentage, isPlacementCore)
        }
      }
      
      return analysis
    } catch (error) {
      console.error('Failed to analyze subject progress:', error)
      return {}
    }
  }
  // Get subject status based on progress
  getSubjectStatus(percentage, isPlacementCore) {
    if (isPlacementCore) {
      if (percentage >= 80) return { status: 'excellent', color: 'text-cyber-green' }
      if (percentage >= 60) return { status: 'good', color: 'text-yellow-400' }
      if (percentage >= 40) return { status: 'needs_focus', color: 'text-orange-400' }
      return { status: 'critical', color: 'text-cyber-red' }
    } else {
      if (percentage >= 70) return { status: 'excellent', color: 'text-cyber-green' }
      if (percentage >= 50) return { status: 'good', color: 'text-yellow-400' }
      if (percentage >= 30) return { status: 'needs_focus', color: 'text-orange-400' }
      return { status: 'critical', color: 'text-cyber-red' }
    }
  }

  // Get personalized recommendations
  getSubjectRecommendation(percentage, isPlacementCore) {
    if (isPlacementCore) {
      if (percentage >= 80) return "🔥 Excellent! Focus on advanced problems and interview prep"
      if (percentage >= 60) return "💪 Good progress! Aim for 80%+ for placement readiness"
      if (percentage >= 40) return "⚡ Needs attention! Dedicate 2+ hours daily"
      return "🚨 CRITICAL! This is placement-core - prioritize immediately!"
    } else {
      if (percentage >= 70) return "✅ Well done! Maintain steady progress"
      if (percentage >= 50) return "📚 On track! Continue regular study sessions"
      if (percentage >= 30) return "⏰ Catch up needed! Allocate more time"
      return "🎯 Start immediately! Don't let this fall behind"
    }
  }

  // Calculate placement readiness score with detailed breakdown
  async calculatePlacementReadiness() {
    try {
      const subjectAnalysis = await this.analyzeSubjectProgress()
      
      let totalWeight = 0
      let weightedScore = 0
      
      // Weight subjects by importance for placements
      const weights = {
        '24CSH-206': 30, // DAA - highest weight
        '24CSH-207': 25, // Java - high weight
        '24CSP-209': 20, // Competitive Coding - high weight
        '24CSP-210': 15, // Full Stack - medium weight
        '24CST-205': 5,  // OS - low weight
        '24CST-211': 3,  // ML - low weight
        '24CST-208': 2   // Software Engineering - lowest weight
      }
      
      Object.keys(subjectAnalysis).forEach(subjectId => {
        const weight = weights[subjectId] || 1
        const percentage = subjectAnalysis[subjectId].percentage
        totalWeight += weight
        weightedScore += (percentage * weight)
      })
      
      const overallScore = totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 0
      
      return {
        overallScore,
        breakdown: subjectAnalysis,
        recommendation: this.getPlacementRecommendation(overallScore),
        nextSteps: this.getNextSteps(subjectAnalysis)
      }
    } catch (error) {
      console.error('Failed to calculate placement readiness:', error)
      return { overallScore: 0, breakdown: {}, recommendation: '', nextSteps: [] }
    }
  }

  // Get overall placement recommendation
  getPlacementRecommendation(score) {
    if (score >= 85) return "🚀 PLACEMENT READY! Focus on interview prep and projects"
    if (score >= 70) return "💪 Strong foundation! Polish weak areas and practice coding"
    if (score >= 55) return "⚡ Good progress! Intensify study schedule for core subjects"
    if (score >= 40) return "📚 Moderate readiness. Focus heavily on DAA and Java"
    return "🚨 URGENT ACTION NEEDED! Prioritize placement-core subjects immediately"
  }

  // Get actionable next steps
  getNextSteps(subjectAnalysis) {
    const steps = []
    const sortedSubjects = Object.values(subjectAnalysis)
      .filter(s => s.isPlacementCore)
      .sort((a, b) => a.percentage - b.percentage)
    
    if (sortedSubjects.length > 0) {
      const weakest = sortedSubjects[0]
      if (weakest.percentage < 60) {
        steps.push(`🎯 PRIORITY: Focus on ${weakest.name} (${weakest.percentage}% complete)`)
      }
    }
    
    const criticalSubjects = Object.values(subjectAnalysis)
      .filter(s => s.percentage < 40)
    
    if (criticalSubjects.length > 0) {
      steps.push(`🚨 ${criticalSubjects.length} subject(s) need immediate attention`)
    }
    
    steps.push("📅 Maintain daily coding practice (LeetCode)")
    steps.push("🔄 Review completed topics weekly")
    
    return steps
  }

  // Analyze study patterns and efficiency
  async analyzeStudyPatterns() {
    try {
      // For now, use activity data as proxy for study sessions
      const activityData = await db.getActivityData(30)
      
      // Calculate average study time per day
      const avgDailyActivity = activityData.length > 0 
        ? activityData.reduce((sum, day) => sum + day.intensity, 0) / activityData.length 
        : 0
      
      // Find most productive days
      const dayStats = {}
      activityData.forEach(day => {
        const date = new Date(day.date)
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
        if (!dayStats[dayName]) dayStats[dayName] = { total: 0, count: 0 }
        dayStats[dayName].total += day.intensity
        dayStats[dayName].count += 1
      })
      
      const productiveDays = Object.entries(dayStats)
        .map(([day, stats]) => ({
          day,
          average: stats.count > 0 ? stats.total / stats.count : 0
        }))
        .sort((a, b) => b.average - a.average)
      
      return {
        avgDailyActivity: Math.round(avgDailyActivity * 100) / 100,
        mostProductiveDay: productiveDays[0]?.day || 'No data',
        leastProductiveDay: productiveDays[productiveDays.length - 1]?.day || 'No data',
        totalStudySessions: activityData.length,
        recommendation: this.getEfficiencyRecommendation(avgDailyActivity, productiveDays)
      }
    } catch (error) {
      console.error('Failed to analyze study patterns:', error)
      return {
        avgDailyActivity: 0,
        mostProductiveDay: 'No data',
        leastProductiveDay: 'No data',
        totalStudySessions: 0,
        recommendation: 'Start tracking your study sessions!'
      }
    }
  }

  // Get efficiency recommendations
  getEfficiencyRecommendation(avgActivity, productiveDays) {
    if (avgActivity >= 3.5) {
      return `🔥 Excellent consistency! Your most productive day is ${productiveDays[0]?.day}. Consider scheduling important topics on this day.`
    } else if (avgActivity >= 2.5) {
      return `💪 Good study rhythm! Try to increase activity on ${productiveDays[productiveDays.length - 1]?.day} to boost overall performance.`
    } else if (avgActivity >= 1.5) {
      return `📚 Building momentum! Focus on consistency. Your ${productiveDays[0]?.day} sessions are strong - replicate this pattern.`
    } else {
      return `🚨 Need more consistent study habits! Start with 2-3 focused sessions daily. Track your progress to build momentum.`
    }
  }

  // Predict exam performance based on current progress
  async predictExamPerformance() {
    try {
      const placementReadiness = await this.calculatePlacementReadiness()
      const studyPatterns = await this.analyzeStudyPatterns()
      const streak = await this.calculateStudyStreak()
      
      // Simple prediction algorithm
      const progressScore = placementReadiness.overallScore * 0.6
      const consistencyScore = Math.min(studyPatterns.avgDailyActivity * 20, 30)
      const streakScore = Math.min(streak * 2, 10)
      
      const predictedScore = Math.round(progressScore + consistencyScore + streakScore)
      
      return {
        predictedScore: Math.min(predictedScore, 100),
        confidence: this.getConfidenceLevel(studyPatterns.totalStudySessions, streak),
        factors: {
          progress: Math.round(progressScore),
          consistency: Math.round(consistencyScore),
          streak: Math.round(streakScore)
        },
        recommendation: this.getPerformancePredictionAdvice(predictedScore)
      }
    } catch (error) {
      console.error('Failed to predict exam performance:', error)
      return {
        predictedScore: 0,
        confidence: 'low',
        factors: { progress: 0, consistency: 0, streak: 0 },
        recommendation: 'Start tracking your study data for predictions!'
      }
    }
  }

  getConfidenceLevel(sessions, streak) {
    if (sessions >= 20 && streak >= 7) return 'high'
    if (sessions >= 10 && streak >= 3) return 'medium'
    return 'low'
  }

  getPerformancePredictionAdvice(score) {
    if (score >= 85) return "🏆 Excellent trajectory! You're on track for top performance"
    if (score >= 70) return "🎯 Strong performance expected! Keep up the momentum"
    if (score >= 55) return "📈 Good progress! Increase study intensity for better results"
    return "⚡ Performance at risk! Immediate action needed to improve trajectory"
  }
}

// Export singleton instance
export const analytics = new StudyAnalytics()