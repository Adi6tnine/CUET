import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Brain
} from 'lucide-react'
import { analytics } from '../utils/analytics'

const AnalyticsDashboard = () => {
  // Core state - simplified
  const [keyInsight, setKeyInsight] = useState('')
  const [recommendation, setRecommendation] = useState('')
  const [trendDirection, setTrendDirection] = useState('→')
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  // Advanced state (hidden by default)
  const [placementReadiness, setPlacementReadiness] = useState(0)
  const [subjectBreakdown, setSubjectBreakdown] = useState({})
  const [studyPatterns, setStudyPatterns] = useState({})

  useEffect(() => {
    loadAnalyticsData()
  }, [])

  const loadAnalyticsData = async () => {
    try {
      // Generate key insight
      const readiness = await analytics.calculatePlacementReadiness()
      const patterns = await analytics.analyzeStudyPatterns()
      
      // Determine key insight
      if (readiness.overallScore >= 80) {
        setKeyInsight('🚀 Placement ready! Focus on interview prep')
        setTrendDirection('↗️')
      } else if (readiness.overallScore >= 60) {
        setKeyInsight('💪 Strong progress! Polish weak areas')
        setTrendDirection('↗️')
      } else {
        setKeyInsight('📚 Focus needed on core subjects')
        setTrendDirection('↘️')
      }
      
      // Set recommendation
      setRecommendation(readiness.recommendation || 'Continue consistent study')
      
      // Load advanced data if needed
      if (showAdvanced) {
        await loadAdvancedData(readiness, patterns)
      }
    } catch (error) {
      console.error('Failed to load analytics:', error)
      setKeyInsight('📊 Analytics loading...')
      setRecommendation('Check back soon for insights')
    }
  }

  const loadAdvancedData = async (readiness, patterns) => {
    try {
      setPlacementReadiness(readiness.overallScore || 0)
      setSubjectBreakdown(readiness.breakdown || {})
      setStudyPatterns(patterns || {})
    } catch (error) {
      console.error('Failed to load advanced analytics:', error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Status Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between py-4 border-b border-gray-700"
      >
        <div className="text-gray-400 text-sm">
          Smart Analytics
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-2xl">{trendDirection}</span>
          <span className="text-white">Trending</span>
        </div>
      </motion.div>

      {/* Key Insight Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-white">AI Insight</h1>
          </div>
          <p className="text-xl text-gray-300 mb-6">
            {keyInsight}
          </p>
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">Recommendation</h3>
            <p className="text-gray-400">
              {recommendation}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-900 border border-gray-700 rounded-lg p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Overall Progress</h3>
            <p className="text-gray-400">Academic + Skills combined</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">
              {placementReadiness}%
            </div>
            <div className="text-sm text-gray-400">placement ready</div>
          </div>
        </div>
      </motion.div>

      {/* Advanced Toggle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <button
          onClick={() => {
            setShowAdvanced(!showAdvanced)
            if (!showAdvanced) loadAnalyticsData()
          }}
          className="flex items-center gap-2 mx-auto text-gray-400 hover:text-white transition-colors"
        >
          <span>View Detailed Analytics</span>
          {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </motion.div>

      {/* Advanced Section */}
      {showAdvanced && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-6"
        >
          {/* Subject Breakdown */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Subject Analysis</h3>
            <div className="space-y-3">
              {Object.entries(subjectBreakdown).map(([subjectId, subject]) => (
                <div key={subjectId} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-white">{subject.name}</h4>
                    <p className="text-gray-400 text-sm">{subject.type}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">{subject.percentage}%</div>
                    <div className="text-xs text-gray-400">{subject.completed}/{subject.total}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Study Patterns */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Study Patterns</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-800 rounded-lg">
                <h4 className="font-semibold text-white mb-2">Daily Average</h4>
                <div className="text-2xl font-bold text-blue-500">
                  {studyPatterns.avgDailyActivity || 0}h
                </div>
              </div>
              <div className="p-4 bg-gray-800 rounded-lg">
                <h4 className="font-semibold text-white mb-2">Most Productive</h4>
                <div className="text-lg text-green-500">
                  {studyPatterns.mostProductiveDay || 'No data'}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default AnalyticsDashboard