import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronDown, 
  ChevronRight, 
  CheckCircle, 
  Circle, 
  Star,
  Zap,
  Brain,
  Code,
  Database,
  Cpu
} from 'lucide-react'
import { subjectData } from '../data/semesterData'
import db from '../utils/database'

const SyllabusTracker = () => {
  const [expandedSubjects, setExpandedSubjects] = useState({})
  const [checkedTopics, setCheckedTopics] = useState({})

  // Load checked topics from database
  useEffect(() => {
    loadTopicProgress()
  }, [])

  const loadTopicProgress = async () => {
    try {
      const allProgress = await db.getAll('syllabusProgress')
      const progressMap = {}
      
      allProgress.forEach(progress => {
        const key = `topic_${progress.subjectId}_${progress.topic}`
        progressMap[key] = progress.completed
      })
      
      setCheckedTopics(progressMap)
    } catch (error) {
      console.error('Failed to load topic progress:', error)
    }
  }

  const toggleSubject = (subjectId) => {
    setExpandedSubjects(prev => ({
      ...prev,
      [subjectId]: !prev[subjectId]
    }))
  }

  const toggleTopic = async (subjectId, topic) => {
    const key = `topic_${subjectId}_${topic}`
    const newValue = !checkedTopics[key]
    
    setCheckedTopics(prev => ({
      ...prev,
      [key]: newValue
    }))
    
    // Save to database instead of localStorage
    try {
      await db.updateTopicProgress(subjectId, topic, newValue)
    } catch (error) {
      console.error('Failed to update topic progress:', error)
    }
  }

  const getSubjectIcon = (type) => {
    switch(type) {
      case 'PLACEMENT CORE': return Star
      case 'PROJECT CORE': return Code
      case 'AI/ML': return Brain
      case 'THEORY': return Database
      case 'GRIND': return Zap
      default: return Cpu
    }
  }

  const getSubjectColor = (type) => {
    switch(type) {
      case 'PLACEMENT CORE': return 'text-cyber-green'
      case 'PROJECT CORE': return 'text-cyber-purple'
      case 'AI/ML': return 'text-cyber-purple'
      case 'THEORY': return 'text-blue-400'
      case 'GRIND': return 'text-cyber-red'
      default: return 'text-cyber-text'
    }
  }

  const getSubjectProgress = (subject) => {
    let total = 0
    let completed = 0
    
    subject.units.forEach(unit => {
      unit.topics.forEach(topic => {
        total++
        const key = `topic_${subject.id}_${topic}`
        if (checkedTopics[key]) completed++
      })
    })
    
    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 }
  }

  const isPrioritySubject = (type) => {
    return type === 'PLACEMENT CORE' || type === 'CORE'
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold font-mono mb-2">
          <span className="text-cyber-green">Battle Plan</span> - Syllabus Tracker
        </h1>
        <p className="text-gray-400">Track your progress across all subjects</p>
      </motion.div>

      <div className="grid gap-6">
        {subjectData.map((subject, index) => {
          const Icon = getSubjectIcon(subject.type)
          const progress = getSubjectProgress(subject)
          const isExpanded = expandedSubjects[subject.id]
          const isPriority = isPrioritySubject(subject.type)
          
          return (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`cyber-card overflow-hidden ${isPriority ? 'priority-border' : ''}`}
            >
              {/* Subject Header */}
              <motion.div
                className="p-6 cursor-pointer hover:bg-cyber-border/30 transition-colors"
                onClick={() => toggleSubject(subject.id)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg bg-cyber-bg ${getSubjectColor(subject.type)}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-3">
                        <h3 className="text-xl font-semibold">{subject.name}</h3>
                        {isPriority && (
                          <span className="px-2 py-1 text-xs bg-cyber-green text-black rounded-full font-semibold">
                            HIGH PRIORITY
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-400">{subject.id}</span>
                        <span className={`text-sm font-medium ${getSubjectColor(subject.type)}`}>
                          {subject.type}
                        </span>
                        <span className="text-sm text-gray-400">
                          {subject.credits} Credits
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {/* Progress Circle */}
                    <div className="relative w-16 h-16">
                      <svg className="w-16 h-16 transform -rotate-90">
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="#27272a"
                          strokeWidth="4"
                          fill="none"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke={isPriority ? "#22c55e" : "#a855f7"}
                          strokeWidth="4"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 28}`}
                          strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress.percentage / 100)}`}
                          className="transition-all duration-500"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-bold">{progress.percentage}%</span>
                      </div>
                    </div>
                    
                    {/* Expand Icon */}
                    <motion.div
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="w-6 h-6 text-gray-400" />
                    </motion.div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress: {progress.completed}/{progress.total} topics</span>
                    <span>{progress.percentage}%</span>
                  </div>
                  <div className="w-full bg-cyber-border rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress.percentage}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`h-2 rounded-full ${
                        isPriority 
                          ? 'bg-gradient-to-r from-cyber-green to-cyber-green/80' 
                          : 'bg-gradient-to-r from-cyber-purple to-cyber-purple/80'
                      }`}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Expanded Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-cyber-border"
                  >
                    <div className="p-6 space-y-6">
                      {subject.units.map((unit, unitIndex) => (
                        <motion.div
                          key={unitIndex}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: unitIndex * 0.1 }}
                          className="bg-cyber-bg/30 rounded-lg p-4"
                        >
                          <h4 className="text-lg font-semibold mb-4 text-cyber-green">
                            {unit.title}
                          </h4>
                          <div className="grid gap-3">
                            {unit.topics.map((topic, topicIndex) => {
                              const key = `topic_${subject.id}_${topic}`
                              const isChecked = checkedTopics[key]
                              
                              return (
                                <motion.div
                                  key={topicIndex}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: (unitIndex * 0.1) + (topicIndex * 0.05) }}
                                  className="flex items-center space-x-3 p-3 rounded-lg bg-cyber-card/50 hover:bg-cyber-border/30 transition-colors cursor-pointer group"
                                  onClick={() => toggleTopic(subject.id, topic)}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    {isChecked ? (
                                      <CheckCircle className="w-5 h-5 text-cyber-green" />
                                    ) : (
                                      <Circle className="w-5 h-5 text-gray-400 group-hover:text-cyber-green transition-colors" />
                                    )}
                                  </motion.div>
                                  <span className={`flex-1 transition-colors ${
                                    isChecked 
                                      ? 'line-through text-gray-400' 
                                      : 'text-cyber-text group-hover:text-cyber-green'
                                  }`}>
                                    {topic}
                                  </span>
                                </motion.div>
                              )
                            })}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default SyllabusTracker