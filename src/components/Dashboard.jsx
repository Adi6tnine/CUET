import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircle, 
  Circle,
  Flame,
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { timelineData } from '../data/semesterData'
import db from '../utils/database'
import { analytics } from '../utils/analytics'
import { calendarCore } from '../utils/calendarSystem'
import aiDecisionLayer from '../utils/aiDecisionLayer'
import recoverySystem from '../utils/recoverySystem'
import intelligenceLayer from '../utils/intelligenceLayer'
import systemController from '../utils/systemController'

const Dashboard = () => {
  // Core state - simplified
  const [primaryAction, setPrimaryAction] = useState(null)
  const [studyStreak, setStudyStreak] = useState(0)
  const [nextDeadline, setNextDeadline] = useState(null)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const [aiObjective, setAiObjective] = useState(null)
  const [isLoadingAI, setIsLoadingAI] = useState(false)
  const [recoveryStatus, setRecoveryStatus] = useState(null)
  const [intelligenceInsights, setIntelligenceInsights] = useState(null)
  const [systemDiagnostics, setSystemDiagnostics] = useState(null)
  
  // Advanced state (hidden by default)
  const [placementReadiness, setPlacementReadiness] = useState(0)
  const [protocolStatus, setProtocolStatus] = useState({ completed: 0, total: 4 })
  const [weeklyProgress, setWeeklyProgress] = useState(0)

  // Initialize core data
  useEffect(() => {
    initializeSystem()
  }, [])

  const initializeSystem = async () => {
    try {
      // Initialize database and run migration
      await db.init()
      
      // Run migration to enhanced schemas
      const migrationResult = await db.migrateToEnhancedSchemas()
      console.log('Database migration result:', migrationResult)
      
      // Validate data integrity
      const integrityCheck = await db.validateDataIntegrity()
      console.log('Data integrity check:', integrityCheck)
      
      // Test AI system connectivity (non-blocking)
      try {
        console.log('Testing AI system connectivity...')
        const aiHealthy = await aiDecisionLayer.healthCheck()
        console.log('AI System Status:', aiHealthy ? '✅ Online' : '❌ Offline')
      } catch (aiError) {
        console.warn('AI system test failed:', aiError.message)
      }
      
      // Check recovery system status
      try {
        const recoveryCheck = await recoverySystem.checkAndActivateRecovery()
        setRecoveryStatus(recoveryCheck)
        console.log('Recovery System Status:', recoveryCheck)
        
        // If recovery was activated, show notification
        if (recoveryCheck.recoveryActive && recoveryCheck.message) {
          console.log('🚨 Recovery System:', recoveryCheck.message)
        }
      } catch (recoveryError) {
        console.warn('Recovery system check failed:', recoveryError.message)
      }
      
      // Run intelligence analysis (non-blocking)
      try {
        console.log('Running intelligence analysis...')
        const insights = await intelligenceLayer.getLatestIntelligence()
        setIntelligenceInsights(insights)
        console.log('🧠 Intelligence Insights:', insights)
      } catch (intelligenceError) {
        console.warn('Intelligence analysis failed:', intelligenceError.message)
      }
      
      // Get system diagnostics
      try {
        const diagnostics = await systemController.getSystemDiagnostics()
        setSystemDiagnostics(diagnostics)
        console.log('🔧 System Diagnostics:', diagnostics)
      } catch (diagnosticsError) {
        console.warn('System diagnostics failed:', diagnosticsError.message)
      }
      
      // Load core data
      await loadCoreData()
    } catch (error) {
      console.error('System initialization failed:', error)
      // Continue with basic functionality
      await loadCoreData()
    }
  }

  const loadCoreData = async () => {
    try {
      // Get streak
      const streak = await analytics.calculateStudyStreak()
      setStudyStreak(streak)
      
      // Get next critical deadline
      const today = calendarCore.getTodayString()
      const upcomingEvents = await calendarCore.getUpcomingEvents(today, 90)
      const criticalEvents = upcomingEvents.filter(event => 
        event.eventType === 'exam' || event.eventType === 'deadline' || 
        event.type === 'exam' || event.type === 'dead'
      )
      const nextCritical = criticalEvents.sort((a, b) => new Date(a.date) - new Date(b.date))[0]
      setNextDeadline(nextCritical)
      
      // Determine primary action
      await determinePrimaryAction()
      
      // Load advanced data if needed
      if (showAdvanced) {
        await loadAdvancedData()
      }
    } catch (error) {
      console.error('Failed to load core data:', error)
    }
  }

  const determinePrimaryAction = async () => {
    try {
      setIsLoadingAI(true)
      
      // Try to get AI-generated daily objective first
      try {
        const aiDecision = await aiDecisionLayer.selectDailyObjective()
        setAiObjective(aiDecision)
        
        setPrimaryAction({
          type: aiDecision.type,
          title: aiDecision.objective,
          description: aiDecision.reason,
          urgent: aiDecision.priority === 'critical',
          estimatedTime: aiDecision.estimatedTime,
          successCriteria: aiDecision.successCriteria,
          source: 'ai'
        })
        
        console.log('AI objective selected:', aiDecision.objective)
        return
      } catch (aiError) {
        console.warn('AI objective selection failed, using fallback logic:', aiError.message)
      }
      
      // Fallback to rule-based logic
      const today = calendarCore.getTodayString()
      const todayRoutine = await db.getDailyRoutine(today)
      
      if (!todayRoutine || Object.values(todayRoutine.blocks || {}).filter(b => b?.completed).length === 0) {
        setPrimaryAction({
          type: 'protocol',
          title: 'Complete Morning Block',
          description: 'Start your daily protocol',
          urgent: false,
          source: 'fallback'
        })
        return
      }
      
      // Check if there's an urgent deadline
      if (nextDeadline) {
        const daysUntil = getDaysUntil(nextDeadline.date)
        if (daysUntil <= 3) {
          setPrimaryAction({
            type: 'deadline',
            title: `Prepare for ${nextDeadline.event || nextDeadline.title}`,
            description: `${daysUntil} days remaining`,
            urgent: true,
            source: 'fallback'
          })
          return
        }
      }
      
      // Default to study action
      setPrimaryAction({
        type: 'study',
        title: 'Study DAA Unit 2',
        description: 'Continue with core placement subjects',
        urgent: false,
        source: 'fallback'
      })
    } catch (error) {
      console.error('Failed to determine primary action:', error)
      setPrimaryAction({
        type: 'study',
        title: 'Begin Study Session',
        description: 'Start with your priority subject',
        urgent: false,
        source: 'error'
      })
    } finally {
      setIsLoadingAI(false)
    }
  }

  const loadAdvancedData = async () => {
    try {
      // Load placement readiness
      const readiness = await analytics.calculatePlacementReadiness()
      setPlacementReadiness(readiness.overallScore || 0)
      
      // Load protocol status
      const today = calendarCore.getTodayString()
      const todayRoutine = await db.getDailyRoutine(today)
      if (todayRoutine) {
        const completed = Object.values(todayRoutine.blocks || {}).filter(b => b?.completed).length
        setProtocolStatus({ completed, total: 4 })
      }
      
      // Calculate weekly progress
      const subjectAnalysis = await analytics.analyzeSubjectProgress()
      const totalProgress = Object.values(subjectAnalysis).reduce((sum, subject) => sum + subject.percentage, 0)
      const avgProgress = Object.keys(subjectAnalysis).length > 0 ? totalProgress / Object.keys(subjectAnalysis).length : 0
      setWeeklyProgress(Math.round(avgProgress))
    } catch (error) {
      console.error('Failed to load advanced data:', error)
    }
  }

  const testAISystem = async () => {
    try {
      setIsLoadingAI(true)
      const healthCheck = await aiDecisionLayer.healthCheck()
      
      if (healthCheck) {
        alert('✅ AI System is working correctly!')
        
        // Refresh primary action with new AI decision
        await determinePrimaryAction()
      } else {
        alert('❌ AI System is not responding. Using fallback logic.')
      }
    } catch (error) {
      alert(`❌ AI System Error: ${error.message}`)
    } finally {
      setIsLoadingAI(false)
    }
  }

  const getWeeklyAnalysis = async () => {
    try {
      setIsLoadingAI(true)
      const analysis = await aiDecisionLayer.analyzeWeeklyPerformance()
      
      const message = `📊 Weekly Analysis:
      
Verdict: ${analysis.verdict.toUpperCase()}
Score: ${analysis.weeklyScore}%
Weakest Area: ${analysis.weakestArea.replace(/_/g, ' ')}

Focus for Next Week:
${analysis.focusShift}

Adjustments Needed:
${analysis.adjustments.map(adj => `• ${adj}`).join('\n')}

Strengths:
${analysis.strengths.map(str => `• ${str}`).join('\n')}`

      alert(message)
    } catch (error) {
      alert(`❌ Weekly Analysis Error: ${error.message}`)
    } finally {
      setIsLoadingAI(false)
    }
  }

  const checkRecoverySystem = async () => {
    try {
      setIsLoadingAI(true)
      const recoveryCheck = await recoverySystem.checkAndActivateRecovery()
      setRecoveryStatus(recoveryCheck)
      
      if (recoveryCheck.recoveryActive) {
        const message = `🚨 Recovery System Status:

Mode: ${recoveryCheck.mode.toUpperCase()}
${recoveryCheck.reason ? `Reason: ${recoveryCheck.reason}` : ''}
${recoveryCheck.daysInRecovery ? `Days in Recovery: ${recoveryCheck.daysInRecovery}` : ''}

${recoveryCheck.recoveryTasks ? 'Simplified Tasks:\n' + recoveryCheck.recoveryTasks.map(task => `• ${task}`).join('\n') : ''}

${recoveryCheck.message}`
        alert(message)
      } else {
        alert('✅ Recovery System: Operating normally\n\nNo recovery mode needed at this time.')
      }
    } catch (error) {
      alert(`❌ Recovery System Error: ${error.message}`)
    } finally {
      setIsLoadingAI(false)
    }
  }

  const exitRecoveryMode = async () => {
    try {
      if (!recoveryStatus?.recoveryActive) {
        alert('ℹ️ Not currently in recovery mode')
        return
      }
      
      const confirmed = confirm('Are you sure you want to exit recovery mode?\n\nThis will return to normal difficulty levels.')
      if (!confirmed) return
      
      setIsLoadingAI(true)
      const result = await recoverySystem.forceExitRecovery()
      
      if (result.success) {
        setRecoveryStatus({ recoveryActive: false, mode: 'normal' })
        alert('✅ Recovery mode exited successfully!')
        
        // Refresh primary action
        await determinePrimaryAction()
      }
    } catch (error) {
      alert(`❌ Exit Recovery Error: ${error.message}`)
    } finally {
      setIsLoadingAI(false)
    }
  }

  const getPerformancePrediction = async () => {
    try {
      setIsLoadingAI(true)
      const prediction = await intelligenceLayer.getPerformancePrediction()
      
      const message = `🔮 Performance Prediction:

Trajectory: ${prediction.trajectory?.toUpperCase() || 'STABLE'}
Next Week Score: ${Math.round(prediction.prediction || 70)}%
Confidence: ${Math.round((prediction.confidence || 0.5) * 100)}%

Key Factors:
${prediction.factors?.map(f => `• ${f.replace(/_/g, ' ')}`).join('\n') || '• Consistency\n• Momentum'}

Recommendations:
${prediction.recommendations?.map(r => `• ${r}`).join('\n') || '• Maintain current pace'}`

      alert(message)
    } catch (error) {
      alert(`❌ Performance Prediction Error: ${error.message}`)
    } finally {
      setIsLoadingAI(false)
    }
  }

  const getProductivityInsights = async () => {
    try {
      setIsLoadingAI(true)
      const insights = await intelligenceLayer.getProductivityInsights()
      
      const message = `⚡ Productivity Insights:

Peak Hours: ${insights.timePatterns?.peakHours?.join(', ') || '9 AM, 2 PM, 8 PM'}
Best Days: ${insights.dayPatterns?.bestDays?.join(', ') || 'Mon, Wed, Fri'}
Optimal Session: ${insights.timePatterns?.optimalSessionLength || 45} minutes

Recommendations:
${insights.recommendations?.map(r => `• ${r}`).join('\n') || '• Schedule demanding tasks during peak hours'}

Confidence: ${Math.round((insights.confidence || 0.5) * 100)}%`

      alert(message)
    } catch (error) {
      alert(`❌ Productivity Insights Error: ${error.message}`)
    } finally {
      setIsLoadingAI(false)
    }
  }

  const getSkillRecommendations = async () => {
    try {
      setIsLoadingAI(true)
      const recommendations = await intelligenceLayer.getSkillRecommendations()
      
      const message = `🎯 Skill Recommendations:

Academic-Skill Coupling:
${Object.entries(recommendations.correlations || {}).map(([pair, score]) => 
  `• ${pair}: ${Math.round(score * 100)}% correlation`
).join('\n') || '• DAA-Python: 80%\n• OS-Bash: 90%'}

${recommendations.skillGaps?.length > 0 ? 
  `Skill Gaps Identified:\n${recommendations.skillGaps.map(gap => 
    `• ${gap.skill}: ${gap.reason}`
  ).join('\n')}\n` : 'No significant skill gaps detected.\n'
}
Recommendations:
${recommendations.recommendations?.map(r => `• ${r}`).join('\n') || '• Maintain balanced progress'}

Confidence: ${Math.round((recommendations.confidence || 0.5) * 100)}%`

      alert(message)
    } catch (error) {
      alert(`❌ Skill Recommendations Error: ${error.message}`)
    } finally {
      setIsLoadingAI(false)
    }
  }

  const runFullIntelligenceAnalysis = async () => {
    try {
      setIsLoadingAI(true)
      
      // Clear cache to force fresh analysis
      intelligenceLayer.clearCache()
      
      const analysis = await intelligenceLayer.analyzeAndPredict()
      setIntelligenceInsights(analysis)
      
      const message = `🧠 Full Intelligence Analysis:

Overall Confidence: ${Math.round((analysis.confidence || 0.5) * 100)}%

Key Insights:
${analysis.overallInsights?.map(insight => 
  `• ${insight.message} (${Math.round(insight.confidence * 100)}%)`
).join('\n') || '• Analysis complete - monitoring patterns'}

Performance: ${analysis.performance?.prediction || 'Stable'}
Productivity: ${analysis.productivity?.patterns || 'Baseline patterns'}
Academic-Skill Coupling: ${analysis.coupling?.coupling || 'Balanced'}

${analysis.interventions?.interventions?.length > 0 ? 
  `Interventions Recommended:\n${analysis.interventions.interventions.map(i => 
    `• ${i.description}`
  ).join('\n')}` : 'No interventions needed at this time.'
}

Analysis completed at: ${new Date(analysis.timestamp).toLocaleTimeString()}`

      alert(message)
    } catch (error) {
      alert(`❌ Intelligence Analysis Error: ${error.message}`)
    } finally {
      setIsLoadingAI(false)
    }
  }

  const exportSystemData = async () => {
    try {
      setIsLoadingAI(true)
      const exportData = await systemController.exportSystemData()
      
      // Create download link
      const dataStr = JSON.stringify(exportData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `avion-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      alert('✅ System data exported successfully!')
    } catch (error) {
      alert(`❌ Export Error: ${error.message}`)
    } finally {
      setIsLoadingAI(false)
    }
  }

  const importSystemData = async () => {
    try {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.json'
      
      input.onchange = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        
        try {
          setIsLoadingAI(true)
          const text = await file.text()
          const importData = JSON.parse(text)
          
          const confirmed = confirm('⚠️ This will replace all current data. Continue?')
          if (!confirmed) return
          
          await systemController.importSystemData(importData)
          alert('✅ System data imported successfully!')
          
          // Refresh page to reload with new data
          window.location.reload()
        } catch (error) {
          alert(`❌ Import Error: ${error.message}`)
        } finally {
          setIsLoadingAI(false)
        }
      }
      
      input.click()
    } catch (error) {
      alert(`❌ Import Setup Error: ${error.message}`)
    }
  }

  const runSystemDiagnostics = async () => {
    try {
      setIsLoadingAI(true)
      const diagnostics = await systemController.getSystemDiagnostics()
      setSystemDiagnostics(diagnostics)
      
      const message = `🔧 System Diagnostics:

System Status: ${diagnostics.system.initialized ? 'INITIALIZED' : 'OFFLINE'}
Overall Health: ${diagnostics.health.overall.toUpperCase()}

Component Status:
${Object.entries(diagnostics.health.components).map(([name, status]) => 
  `• ${name}: ${status.status.toUpperCase()} ${status.responseTime ? `(${status.responseTime}ms)` : ''}`
).join('\n')}

Performance Metrics:
• Total Operations: ${diagnostics.performance.totalOperations}
• Error Rate: ${diagnostics.performance.errorRate.toFixed(1)}%
• Uptime: ${Math.round(diagnostics.system.uptime / 1000 / 60)} minutes

${diagnostics.health.issues.length > 0 ? 
  `\nIssues Detected:\n${diagnostics.health.issues.map(issue => `• ${issue}`).join('\n')}` : 
  '\n✅ No issues detected'
}

Diagnostics completed at: ${new Date(diagnostics.timestamp).toLocaleTimeString()}`

      alert(message)
    } catch (error) {
      alert(`❌ Diagnostics Error: ${error.message}`)
    } finally {
      setIsLoadingAI(false)
    }
  }

  const restartSystem = async () => {
    try {
      const confirmed = confirm('🔄 Restart AVION.EXE system?\n\nThis will reinitialize all components.')
      if (!confirmed) return
      
      setIsLoadingAI(true)
      const result = await systemController.restartSystem()
      
      if (result.success) {
        alert('✅ System restarted successfully!')
        window.location.reload()
      } else {
        alert(`❌ System restart failed: ${result.error}`)
      }
    } catch (error) {
      alert(`❌ Restart Error: ${error.message}`)
    } finally {
      setIsLoadingAI(false)
    }
  }



  const getDaysUntil = (date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const eventDate = new Date(date)
    eventDate.setHours(0, 0, 0, 0)
    const diffTime = eventDate.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const completePrimaryAction = async () => {
    try {
      if (primaryAction?.type === 'protocol') {
        // Navigate to Daily Protocol
        // This would be handled by parent component
        console.log('Navigate to Daily Protocol')
      } else if (primaryAction?.type === 'study') {
        // Navigate to Battle Plan
        console.log('Navigate to Battle Plan')
      } else if (primaryAction?.type === 'deadline') {
        // Navigate to Timeline or specific preparation
        console.log('Navigate to Timeline')
      }
      
      // Refresh data after action
      await loadCoreData()
    } catch (error) {
      console.error('Failed to complete primary action:', error)
    }
  }

  // Normal Mode UI - Simplified
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Status Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between py-4 border-b border-gray-700"
      >
        <div className="text-gray-400 text-sm">
          {calendarCore.formatDateForDisplay(new Date())}
        </div>
        <div className="flex items-center gap-6 text-sm">
          {/* Recovery Mode Indicator */}
          {recoveryStatus?.recoveryActive && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-orange-400 font-semibold">
                Recovery Mode: {recoveryStatus.mode.replace(/_/g, ' ').toUpperCase()}
              </span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-red-500" />
            <span className="text-white">{studyStreak} day streak</span>
          </div>
          {nextDeadline && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="text-white">
                {nextDeadline.event || nextDeadline.title} in {getDaysUntil(nextDeadline.date)} days
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Primary Action Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className={`bg-gray-900 border rounded-lg p-8 ${
          primaryAction?.urgent ? 'border-red-500' : 'border-gray-700'
        }`}>
          {/* AI Status Indicator */}
          {primaryAction?.source && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className={`w-2 h-2 rounded-full ${
                primaryAction.source === 'ai' ? 'bg-green-500' : 
                primaryAction.source === 'fallback' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              <span className="text-xs text-gray-400">
                {primaryAction.source === 'ai' ? 'AI-Generated' : 
                 primaryAction.source === 'fallback' ? 'Rule-Based' : 'Error Fallback'}
              </span>
              {isLoadingAI && (
                <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin ml-2" />
              )}
            </div>
          )}
          
          <h1 className="text-3xl font-bold text-white mb-4">
            {primaryAction?.title || 'Loading...'}
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            {primaryAction?.description || 'Determining next action...'}
          </p>
          
          {/* Additional AI Details */}
          {aiObjective && (
            <div className="mb-6 text-sm text-gray-500">
              <p>⏱️ {aiObjective.estimatedTime}</p>
              {aiObjective.successCriteria && (
                <p className="mt-1">🎯 {aiObjective.successCriteria}</p>
              )}
            </div>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={completePrimaryAction}
            disabled={isLoadingAI}
            className={`px-8 py-4 rounded-lg font-semibold text-lg transition-colors ${
              primaryAction?.urgent 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            } ${isLoadingAI ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoadingAI ? 'ANALYZING...' : 
             primaryAction?.urgent ? 'URGENT - START NOW' : 'COMPLETE'}
          </motion.button>
        </div>
      </motion.div>

      {/* Progress Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-900 border border-gray-700 rounded-lg p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Today's Progress</h3>
            <p className="text-gray-400">Protocol blocks completed</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">
              {protocolStatus.completed}/{protocolStatus.total}
            </div>
            <div className="text-sm text-gray-400">blocks</div>
          </div>
        </div>
        
        {/* Intelligence Insights Preview */}
        {intelligenceInsights?.overallInsights?.length > 0 && (
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              <span className="text-blue-400 text-sm font-semibold">Intelligence Insight</span>
            </div>
            <p className="text-blue-300 text-sm">
              {intelligenceInsights.overallInsights[0].message}
            </p>
            <p className="text-blue-400 text-xs mt-1">
              Confidence: {Math.round(intelligenceInsights.overallInsights[0].confidence * 100)}%
            </p>
          </div>
        )}
      </motion.div>

      {/* Secondary Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-4"
      >
        <button className="bg-gray-900 border border-gray-700 rounded-lg p-4 text-left hover:border-gray-600 transition-colors">
          <h4 className="font-semibold text-white mb-1">View Timeline</h4>
          <p className="text-gray-400 text-sm">Check upcoming deadlines</p>
        </button>
        <button className="bg-gray-900 border border-gray-700 rounded-lg p-4 text-left hover:border-gray-600 transition-colors">
          <h4 className="font-semibold text-white mb-1">Skill Training</h4>
          <p className="text-gray-400 text-sm">Continue skill development</p>
        </button>
      </motion.div>

      {/* Advanced Toggle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <button
          onClick={() => {
            setShowAdvanced(!showAdvanced)
            if (!showAdvanced) loadAdvancedData()
          }}
          className="flex items-center gap-2 mx-auto text-gray-400 hover:text-white transition-colors"
        >
          <span>View Details</span>
          {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </motion.div>

      {/* Advanced Section - Hidden by Default */}
      {showAdvanced && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Placement Readiness */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Placement Readiness</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500 mb-2">{placementReadiness}%</div>
                <p className="text-gray-400 text-sm">Academic + Skills</p>
              </div>
            </div>

            {/* Weekly Progress */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Weekly Progress</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500 mb-2">{weeklyProgress}%</div>
                <p className="text-gray-400 text-sm">Average completion</p>
              </div>
            </div>

            {/* Streak Status */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Streak Status</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-500 mb-2">{studyStreak}</div>
                <p className="text-gray-400 text-sm">
                  {studyStreak >= 7 ? 'On fire!' : studyStreak >= 3 ? 'Building momentum' : 'Start your streak'}
                </p>
              </div>
            </div>
          </div>

          {/* AI System Controls */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">AI Intelligence System</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={testAISystem}
                disabled={isLoadingAI}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                {isLoadingAI ? 'Testing...' : 'Test AI System'}
              </button>
              <button
                onClick={getWeeklyAnalysis}
                disabled={isLoadingAI}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                {isLoadingAI ? 'Analyzing...' : 'Get Weekly Analysis'}
              </button>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              <p>• Test AI System: Verify Groq API connectivity</p>
              <p>• Weekly Analysis: Get AI-powered performance insights</p>
            </div>
          </div>

          {/* Recovery System Controls */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recovery & Consistency System</h3>
            
            {/* Recovery Status */}
            <div className="mb-4 p-3 bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Status:</span>
                <span className={`font-semibold ${
                  recoveryStatus?.recoveryActive ? 'text-orange-400' : 'text-green-400'
                }`}>
                  {recoveryStatus?.recoveryActive ? 
                    `Recovery Mode (${recoveryStatus.mode.replace(/_/g, ' ')})` : 
                    'Normal Operation'
                  }
                </span>
              </div>
              {recoveryStatus?.daysInRecovery && (
                <div className="flex items-center justify-between mt-1">
                  <span className="text-gray-300">Duration:</span>
                  <span className="text-gray-400">{recoveryStatus.daysInRecovery} days</span>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={checkRecoverySystem}
                disabled={isLoadingAI}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-800 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                {isLoadingAI ? 'Checking...' : 'Check Recovery Status'}
              </button>
              {recoveryStatus?.recoveryActive && (
                <button
                  onClick={exitRecoveryMode}
                  disabled={isLoadingAI}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:opacity-50 text-white rounded-lg transition-colors"
                >
                  {isLoadingAI ? 'Exiting...' : 'Exit Recovery Mode'}
                </button>
              )}
            </div>
            <div className="mt-4 text-xs text-gray-500">
              <p>• Automatic detection of burnout patterns and streak breaks</p>
              <p>• Simplified tasks and gradual recovery progression</p>
              <p>• Emergency mode for critical intervention when needed</p>
            </div>
          </div>

          {/* Intelligence & Prediction System */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Intelligence & Prediction System</h3>
            
            {/* Intelligence Status */}
            <div className="mb-4 p-3 bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Analysis Status:</span>
                <span className={`font-semibold ${
                  intelligenceInsights ? 'text-blue-400' : 'text-gray-400'
                }`}>
                  {intelligenceInsights ? 
                    `Active (${Math.round((intelligenceInsights.confidence || 0) * 100)}% confidence)` : 
                    'Initializing...'
                  }
                </span>
              </div>
              {intelligenceInsights?.timestamp && (
                <div className="flex items-center justify-between mt-1">
                  <span className="text-gray-300">Last Analysis:</span>
                  <span className="text-gray-400">
                    {new Date(intelligenceInsights.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={getPerformancePrediction}
                disabled={isLoadingAI}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                {isLoadingAI ? 'Predicting...' : 'Performance Prediction'}
              </button>
              <button
                onClick={getProductivityInsights}
                disabled={isLoadingAI}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                {isLoadingAI ? 'Analyzing...' : 'Productivity Insights'}
              </button>
              <button
                onClick={getSkillRecommendations}
                disabled={isLoadingAI}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                {isLoadingAI ? 'Analyzing...' : 'Skill Recommendations'}
              </button>
              <button
                onClick={runFullIntelligenceAnalysis}
                disabled={isLoadingAI}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                {isLoadingAI ? 'Running...' : 'Full Analysis'}
              </button>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              <p>• Performance Prediction: Forecast next week's performance trajectory</p>
              <p>• Productivity Insights: Identify optimal timing and patterns</p>
              <p>• Skill Recommendations: Academic-skill coupling analysis</p>
              <p>• Full Analysis: Complete intelligence report with predictions</p>
            </div>
          </div>

          {/* System Management & Diagnostics */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">System Management & Diagnostics</h3>
            
            {/* System Status */}
            <div className="mb-4 p-3 bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">System Status:</span>
                <span className={`font-semibold ${
                  systemDiagnostics?.system?.initialized ? 'text-green-400' : 'text-red-400'
                }`}>
                  {systemDiagnostics?.system?.initialized ? 'OPERATIONAL' : 'INITIALIZING'}
                </span>
              </div>
              {systemDiagnostics?.health && (
                <div className="flex items-center justify-between mt-1">
                  <span className="text-gray-300">Health:</span>
                  <span className={`text-sm ${
                    systemDiagnostics.health.overall === 'healthy' ? 'text-green-400' :
                    systemDiagnostics.health.overall === 'degraded' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {systemDiagnostics.health.overall.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={runSystemDiagnostics}
                disabled={isLoadingAI}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-800 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                {isLoadingAI ? 'Scanning...' : 'System Diagnostics'}
              </button>
              <button
                onClick={exportSystemData}
                disabled={isLoadingAI}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                {isLoadingAI ? 'Exporting...' : 'Export Data'}
              </button>
              <button
                onClick={importSystemData}
                disabled={isLoadingAI}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-800 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                {isLoadingAI ? 'Importing...' : 'Import Data'}
              </button>
              <button
                onClick={restartSystem}
                disabled={isLoadingAI}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                {isLoadingAI ? 'Restarting...' : 'Restart System'}
              </button>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              <p>• System Diagnostics: Complete health check and performance metrics</p>
              <p>• Export/Import: Backup and restore all system data</p>
              <p>• Restart System: Reinitialize all components and clear caches</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default Dashboard