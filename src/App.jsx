import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Dashboard from './components/Dashboard'
import SyllabusTracker from './components/SyllabusTracker'
import Timeline from './components/Timeline'
import DatabaseManager from './components/DatabaseManager'
import AnalyticsDashboard from './components/AnalyticsDashboard'
import SkillWarRoom from './components/SkillWarRoom'
import DailyCommandProtocol from './components/DailyCommandProtocol'
import GrokChat from './components/GrokChat'
import DataSafetyNotice from './components/DataSafetyNotice'
import SyncManager from './components/SyncManager'
import SyncStatusIndicator from './components/SyncStatusIndicator'
import { Brain, Target, BookOpen, Calendar, Database, TrendingUp, Sword, Shield, Cloud } from 'lucide-react'
import db from './utils/database'
import systemController from './utils/systemController'
import syncManager from './utils/syncManager'
import memoryOptimizer from './utils/memoryOptimizer'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [systemStatus, setSystemStatus] = useState(null)
  const [isInitializing, setIsInitializing] = useState(true)

  // Initialize complete AVION.EXE system
  useEffect(() => {
    const initializeAVION = async () => {
      try {
        setIsInitializing(true)
        console.log('🚀 Starting AVION.EXE initialization...')
        
        // Initialize sync manager and connect to database
        db.setSyncManager(syncManager)
        
        const initResult = await systemController.initializeSystem()
        setSystemStatus(initResult)
        
        if (initResult.success) {
          console.log('✅ AVION.EXE fully operational')
        } else {
          console.warn('⚠️ AVION.EXE started with degraded functionality')
        }
      } catch (error) {
        console.error('❌ AVION.EXE initialization failed:', error)
        setSystemStatus({ success: false, error: error.message })
      } finally {
        setIsInitializing(false)
      }
    }
    
    initializeAVION()
    
    // Cleanup function to prevent memory leaks
    return () => {
      console.log('🧹 Cleaning up AVION.EXE resources...')
      systemController.cleanup()
      syncManager.destroy()
      memoryOptimizer.cleanup()
    }
  }, [])

  const tabs = [
    { id: 'dashboard', label: 'Command HQ', icon: Target },
    { id: 'protocol', label: 'Daily Protocol', icon: Shield },
    { id: 'warroom', label: 'Skill War Room', icon: Sword },
    { id: 'analytics', label: 'Smart Analytics', icon: TrendingUp },
    { id: 'syllabus', label: 'Battle Plan', icon: BookOpen },
    { id: 'timeline', label: 'Mission Timeline', icon: Calendar },
    { id: 'sync', label: 'Zero Data Loss', icon: Cloud },
    { id: 'database', label: 'Data Center', icon: Database }
  ]

  return (
    <div className="min-h-screen bg-cyber-bg">
      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b border-cyber-border bg-cyber-card/50 backdrop-blur-md sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-cyber-green to-cyber-purple rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-black" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-mono">ADARSH.EXE</h1>
                <p className="text-xs text-gray-400">4th Sem Command Center</p>
              </div>
              
              {/* System Status Indicator */}
              {systemStatus && (
                <div className="flex items-center gap-4 ml-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      systemStatus.success ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                    }`} />
                    <span className="text-xs text-gray-400">
                      {isInitializing ? 'Initializing...' : 
                       systemStatus.success ? 'AVION Online' : 'Degraded Mode'}
                    </span>
                  </div>
                  
                  {/* Sync Status Indicator */}
                  <SyncStatusIndicator />
                </div>
              )}
            </div>
            
            <nav className="flex space-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                      activeTab === tab.id 
                        ? 'bg-cyber-green text-black font-semibold' 
                        : 'text-cyber-text hover:bg-cyber-border'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:block">{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'protocol' && <DailyCommandProtocol />}
          {activeTab === 'warroom' && <SkillWarRoom />}
          {activeTab === 'analytics' && <AnalyticsDashboard />}
          {activeTab === 'syllabus' && <SyllabusTracker />}
          {activeTab === 'timeline' && <Timeline />}
          {activeTab === 'sync' && <SyncManager />}
          {activeTab === 'database' && <DatabaseManager />}
        </motion.div>
      </main>

      {/* Grok Chat */}
      <GrokChat />
      
      {/* Data Safety Notice */}
      <DataSafetyNotice />
    </div>
  )
}

export default App