import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircle, 
  Circle,
  Flame,
  Clock,
  ChevronDown,
  ChevronUp,
  AlertTriangle
} from 'lucide-react'
import { dailyRoutineBlocks } from '../data/skillTracks'
import db from '../utils/database'
import { calendarCore } from '../utils/calendarSystem'
import recoverySystem from '../utils/recoverySystem'
import { analytics } from '../utils/analytics'

const DailyCommandProtocol = () => {
  // Core state - simplified
  const [currentBlock, setCurrentBlock] = useState(null)
  const [completedBlocks, setCompletedBlocks] = useState(0)
  const [totalBlocks] = useState(4)
  const [streakCount, setStreakCount] = useState(0)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [isEmergencyMode, setIsEmergencyMode] = useState(false)
  const [recoveryStatus, setRecoveryStatus] = useState(null)
  
  // Advanced state (hidden by default)
  const [allBlocks, setAllBlocks] = useState([])
  const [momentumScore, setMomentumScore] = useState(0)
  const [todayRoutine, setTodayRoutine] = useState(null)

  useEffect(() => {
    loadProtocolData()
  }, [])

  const loadProtocolData = async () => {
    try {
      const today = calendarCore.getTodayString()
      
      // Check recovery system status first
      const recovery = await recoverySystem.getRecoveryStatus()
      setRecoveryStatus(recovery)
      
      // Load today's routine
      const routine = await db.getDailyRoutine(today) || {
        date: today,
        blocks: {},
        completionStatus: 'incomplete'
      }
      
      setTodayRoutine(routine)
      
      // Calculate completed blocks
      const completed = Object.values(routine.blocks || {}).filter(b => b?.completed).length
      setCompletedBlocks(completed)
      
      // Adapt blocks based on recovery mode
      const adaptedBlocks = recovery.isInRecovery ? 
        await getRecoveryBlocks(recovery.mode) : 
        dailyRoutineBlocks
      
      setAllBlocks(adaptedBlocks)
      
      // Set current block (first incomplete)
      const firstIncomplete = adaptedBlocks.find(block => 
        !routine.blocks[block.id]?.completed
      )
      setCurrentBlock(firstIncomplete || adaptedBlocks[0])
      
      // Load streak and momentum data
      const systemState = await db.getSystemState()
      setStreakCount(systemState.currentStreak || 0)
      setMomentumScore(routine.momentumScore || 0)
      
      // Check emergency mode
      setIsEmergencyMode(systemState.currentStreak < 3)
      
      // Load advanced data if needed
      if (showAdvanced) {
        await loadAdvancedData()
      }
    } catch (error) {
      console.error('Failed to load protocol data:', error)
    }
  }

  // Get simplified blocks for recovery mode
  const getRecoveryBlocks = async (recoveryMode) => {
    const recoveryBlocks = {
      light_recovery: [
        {
          id: 'morning-light',
          title: 'Light Morning Routine',
          description: 'Simplified morning protocol',
          duration: 15,
          emergencyDuration: 8,
          tasks: [
            'Review daily goals (2 min)',
            'Quick subject overview (5 min)',
            'Set one priority task (3 min)'
          ]
        },
        {
          id: 'study-light',
          title: 'Light Study Block',
          description: 'Gentle study session',
          duration: 20,
          emergencyDuration: 10,
          tasks: [
            'Read course material (10 min)',
            'Take simple notes (5 min)',
            'Review one concept (5 min)'
          ]
        }
      ],
      deep_recovery: [
        {
          id: 'minimal-morning',
          title: 'Minimal Morning',
          description: 'Basic morning check-in',
          duration: 10,
          emergencyDuration: 5,
          tasks: [
            'Open study material (2 min)',
            'Set one small goal (3 min)',
            'Quick motivation reminder (5 min)'
          ]
        }
      ],
      emergency: [
        {
          id: 'emergency-check',
          title: 'Emergency Check-in',
          description: 'Minimal engagement',
          duration: 5,
          emergencyDuration: 3,
          tasks: [
            'Open any study material (2 min)',
            'Acknowledge one academic goal (3 min)'
          ]
        }
      ]
    }
    
    return recoveryBlocks[recoveryMode] || dailyRoutineBlocks
  }

  const loadAdvancedData = async () => {
    try {
      // Load all blocks with status
      const blocksWithStatus = dailyRoutineBlocks.map(block => ({
        ...block,
        completed: todayRoutine?.blocks[block.id]?.completed || false,
        completedAt: todayRoutine?.blocks[block.id]?.completedAt || null
      }))
      setAllBlocks(blocksWithStatus)
      
      // Calculate momentum (simplified)
      const momentum = Math.round((completedBlocks / totalBlocks) * 100)
      setMomentumScore(momentum)
    } catch (error) {
      console.error('Failed to load advanced data:', error)
    }
  }

  const completeCurrentBlock = async () => {
    if (!currentBlock) return
    
    try {
      const updatedBlocks = {
        ...todayRoutine.blocks,
        [currentBlock.id]: {
          completed: true,
          completedAt: new Date().toISOString()
        }
      }
      
      const newCompleted = completedBlocks + 1
      const updatedRoutine = {
        ...todayRoutine,
        blocks: updatedBlocks,
        completionStatus: newCompleted === totalBlocks ? 'complete' : 'partial'
      }
      
      const today = calendarCore.getTodayString()
      await db.saveDailyRoutine(today, updatedRoutine.blocks, updatedRoutine.completionStatus, 0, newCompleted >= 2)
      
      setTodayRoutine(updatedRoutine)
      setCompletedBlocks(newCompleted)
      
      // Find next block
      const nextBlock = allBlocks.find(block => 
        !updatedBlocks[block.id]?.completed
      )
      setCurrentBlock(nextBlock)
      
      // Update advanced data if shown
      if (showAdvanced) {
        await loadAdvancedData()
      }
    } catch (error) {
      console.error('Failed to complete block:', error)
    }
  }

  const toggleBlock = async (blockId) => {
    try {
      const block = todayRoutine.blocks[blockId] || { completed: false }
      const updatedBlocks = {
        ...todayRoutine.blocks,
        [blockId]: {
          completed: !block.completed,
          completedAt: !block.completed ? new Date().toISOString() : null
        }
      }
      
      const newCompleted = Object.values(updatedBlocks).filter(b => b?.completed).length
      const updatedRoutine = {
        ...todayRoutine,
        blocks: updatedBlocks,
        completionStatus: newCompleted === totalBlocks ? 'complete' : 'partial'
      }
      
      const today = calendarCore.getTodayString()
      await db.saveDailyRoutine(today, updatedRoutine.blocks, updatedRoutine.completionStatus, 0, newCompleted >= 2)
      
      setTodayRoutine(updatedRoutine)
      setCompletedBlocks(newCompleted)
      
      // Update current block
      const nextBlock = allBlocks.find(block => 
        !updatedBlocks[block.id]?.completed
      )
      setCurrentBlock(nextBlock)
      
      // Refresh advanced data
      if (showAdvanced) {
        await loadAdvancedData()
      }
    } catch (error) {
      console.error('Failed to toggle block:', error)
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
          Daily Protocol - {calendarCore.formatDateForDisplay(new Date())}
        </div>
        <div className="flex items-center gap-6 text-sm">
          {/* Recovery Mode Indicator */}
          {recoveryStatus?.isInRecovery && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-orange-400 font-semibold">
                Recovery: {recoveryStatus.mode.replace(/_/g, ' ').toUpperCase()}
              </span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-red-500" />
            <span className="text-white">{streakCount} day streak</span>
          </div>
          {isEmergencyMode && (
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <span className="text-orange-500">Emergency Mode</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Current Block Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        {currentBlock ? (
          <div className={`bg-gray-900 border rounded-lg p-8 ${
            recoveryStatus?.isInRecovery ? 'border-orange-500' : 'border-gray-700'
          }`}>
            {recoveryStatus?.isInRecovery && (
              <div className="mb-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                <p className="text-orange-400 text-sm text-center">
                  🛡️ Recovery Mode Active - Simplified tasks for gentle progress
                </p>
              </div>
            )}
            
            <h1 className="text-3xl font-bold text-white mb-4">
              {currentBlock.title || currentBlock.name}
            </h1>
            <p className="text-gray-400 text-lg mb-2">
              {currentBlock.description}
            </p>
            <p className="text-gray-500 text-sm mb-8">
              {isEmergencyMode ? 
                Math.floor((currentBlock.emergencyDuration || currentBlock.minTime) * 0.5) : 
                (currentBlock.duration || currentBlock.minTime)
              } minutes {recoveryStatus?.isInRecovery ? '(simplified)' : 'minimum'}
            </p>
            
            {/* Recovery Mode Tasks */}
            {recoveryStatus?.isInRecovery && currentBlock.tasks && (
              <div className="mb-6 p-4 bg-gray-800 rounded-lg">
                <h4 className="text-sm font-semibold text-orange-400 mb-2">Recovery Tasks:</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  {currentBlock.tasks.map((task, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Circle className="w-3 h-3 text-orange-400" />
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={completeCurrentBlock}
              className={`px-8 py-4 rounded-lg font-semibold text-lg transition-colors ${
                recoveryStatus?.isInRecovery 
                  ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {recoveryStatus?.isInRecovery ? 'COMPLETE RECOVERY TASK' : 'COMPLETE BLOCK'}
            </motion.button>
          </div>
        ) : (
          <div className="bg-gray-900 border border-green-500 rounded-lg p-8">
            <h1 className="text-3xl font-bold text-green-500 mb-4">
              🏆 All Blocks Complete!
            </h1>
            <p className="text-gray-400 text-lg">
              Mission accomplished for today. Streak maintained!
            </p>
          </div>
        )}
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
              {completedBlocks}/{totalBlocks}
            </div>
            <div className="text-sm text-gray-400">blocks</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4 w-full bg-gray-700 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(completedBlocks / totalBlocks) * 100}%` }}
            className="bg-green-500 h-2 rounded-full transition-all duration-500"
          />
        </div>
      </motion.div>

      {/* Secondary Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-4"
      >
        <button 
          onClick={() => setIsEmergencyMode(!isEmergencyMode)}
          className="bg-gray-900 border border-gray-700 rounded-lg p-4 text-left hover:border-gray-600 transition-colors"
        >
          <h4 className="font-semibold text-white mb-1">
            {isEmergencyMode ? 'Exit Emergency' : 'Emergency Mode'}
          </h4>
          <p className="text-gray-400 text-sm">
            {isEmergencyMode ? 'Return to normal timing' : 'Reduce time by 50%'}
          </p>
        </button>
        <button className="bg-gray-900 border border-gray-700 rounded-lg p-4 text-left hover:border-gray-600 transition-colors">
          <h4 className="font-semibold text-white mb-1">View Analytics</h4>
          <p className="text-gray-400 text-sm">Check consistency trends</p>
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
          <span>View All Blocks</span>
          {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </motion.div>

      {/* Advanced Section - All Blocks */}
      {showAdvanced && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-semibold text-white text-center">All Protocol Blocks</h3>
          
          {allBlocks.map((block, index) => {
            const isCompleted = todayRoutine?.blocks[block.id]?.completed || false
            const completedAt = todayRoutine?.blocks[block.id]?.completedAt
            
            return (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gray-900 border rounded-lg p-4 ${
                  isCompleted ? 'border-green-500 bg-green-500/5' : 'border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleBlock(block.id)}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400 hover:text-green-500 transition-colors" />
                      )}
                    </motion.button>
                    
                    <div>
                      <h4 className={`font-semibold ${isCompleted ? 'line-through text-gray-400' : 'text-white'}`}>
                        {block.name}
                      </h4>
                      <p className="text-gray-400 text-sm">{block.description}</p>
                      {completedAt && (
                        <p className="text-green-500 text-xs mt-1">
                          ✓ Completed at {new Date(completedAt).toLocaleTimeString()}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">
                      {isEmergencyMode ? Math.floor(block.minTime * 0.5) : block.minTime}m
                    </div>
                    <div className="text-xs text-gray-400">
                      {block.priority.toUpperCase()}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
          
          {/* Momentum Score */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 text-center">
            <h4 className="text-lg font-semibold text-white mb-2">Momentum Score</h4>
            <div className="text-3xl font-bold text-blue-500 mb-2">{momentumScore}%</div>
            <p className="text-gray-400 text-sm">Based on today's completion rate</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default DailyCommandProtocol