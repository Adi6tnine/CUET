import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Database, 
  Download, 
  Upload, 
  Trash2, 
  RefreshCw,
  BarChart3,
  Calendar,
  BookOpen,
  Target
} from 'lucide-react'
import db from '../utils/database'

const DatabaseManager = () => {
  const [stats, setStats] = useState({
    syllabusProgress: 0,
    dailyTasks: 0,
    timelineEvents: 0,
    activityData: 0,
    studySessions: 0,
    notes: 0
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const syllabusProgress = await db.getAll('syllabusProgress')
      const dailyTasks = await db.getAll('dailyTasks')
      const timelineEvents = await db.getAll('timelineEvents')
      const activityData = await db.getAll('activityData')
      const studySessions = await db.getAll('studySessions')
      const notes = await db.getAll('notes')

      setStats({
        syllabusProgress: syllabusProgress.length,
        dailyTasks: dailyTasks.length,
        timelineEvents: timelineEvents.length,
        activityData: activityData.length,
        studySessions: studySessions.length,
        notes: notes.length
      })
    } catch (error) {
      console.error('Failed to load database stats:', error)
    }
  }

  const exportData = async () => {
    setIsLoading(true)
    try {
      const data = {
        syllabusProgress: await db.getAll('syllabusProgress'),
        dailyTasks: await db.getAll('dailyTasks'),
        timelineEvents: await db.getAll('timelineEvents'),
        activityData: await db.getAll('activityData'),
        studySessions: await db.getAll('studySessions'),
        notes: await db.getAll('notes'),
        exportDate: new Date().toISOString()
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `adarsh-command-center-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const importData = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setIsLoading(true)
    try {
      const text = await file.text()
      const data = JSON.parse(text)

      // Import each data type
      for (const [storeName, items] of Object.entries(data)) {
        if (storeName === 'exportDate') continue
        
        for (const item of items) {
          await db.update(storeName, item)
        }
      }

      await loadStats()
      alert('Data imported successfully!')
    } catch (error) {
      console.error('Failed to import data:', error)
      alert('Failed to import data. Please check the file format.')
    } finally {
      setIsLoading(false)
    }
  }

  const clearAllData = async () => {
    if (!confirm('Are you sure you want to clear ALL data? This cannot be undone!')) return

    setIsLoading(true)
    try {
      const stores = ['syllabusProgress', 'dailyTasks', 'timelineEvents', 'activityData', 'studySessions', 'notes']
      
      for (const storeName of stores) {
        const items = await db.getAll(storeName)
        for (const item of items) {
          await db.delete(storeName, item.id)
        }
      }

      await loadStats()
      alert('All data cleared successfully!')
    } catch (error) {
      console.error('Failed to clear data:', error)
      alert('Failed to clear data.')
    } finally {
      setIsLoading(false)
    }
  }

  const statCards = [
    { 
      label: 'Syllabus Progress', 
      value: stats.syllabusProgress, 
      icon: BookOpen, 
      color: 'text-cyber-green' 
    },
    { 
      label: 'Daily Tasks', 
      value: stats.dailyTasks, 
      icon: Target, 
      color: 'text-cyber-purple' 
    },
    { 
      label: 'Timeline Events', 
      value: stats.timelineEvents, 
      icon: Calendar, 
      color: 'text-blue-400' 
    },
    { 
      label: 'Activity Data', 
      value: stats.activityData, 
      icon: BarChart3, 
      color: 'text-yellow-400' 
    }
  ]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold font-mono mb-2">
          <span className="text-cyber-green">Database</span> Command Center
        </h1>
        <p className="text-gray-400">Manage your academic data and backups</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="cyber-card p-4 text-center"
            >
              <Icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
              <div className="text-2xl font-bold font-mono">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          )
        })}
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Export Data */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="cyber-card p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Download className="w-6 h-6 text-cyber-green" />
            <h3 className="text-lg font-semibold">Export Data</h3>
          </div>
          <p className="text-gray-400 mb-4">
            Download all your academic data as a JSON backup file.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportData}
            disabled={isLoading}
            className="cyber-button w-full disabled:opacity-50"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin mx-auto" />
            ) : (
              'Export Backup'
            )}
          </motion.button>
        </motion.div>

        {/* Import Data */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="cyber-card p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Upload className="w-6 h-6 text-cyber-purple" />
            <h3 className="text-lg font-semibold">Import Data</h3>
          </div>
          <p className="text-gray-400 mb-4">
            Restore your academic data from a backup file.
          </p>
          <label className="cyber-button w-full cursor-pointer block text-center">
            <input
              type="file"
              accept=".json"
              onChange={importData}
              className="hidden"
              disabled={isLoading}
            />
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin mx-auto" />
            ) : (
              'Import Backup'
            )}
          </label>
        </motion.div>

        {/* Clear Data */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="cyber-card p-6 border-cyber-red/50"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Trash2 className="w-6 h-6 text-cyber-red" />
            <h3 className="text-lg font-semibold">Clear Data</h3>
          </div>
          <p className="text-gray-400 mb-4">
            Permanently delete all stored academic data.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearAllData}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-cyber-red text-white rounded-md hover:bg-cyber-red/80 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin mx-auto" />
            ) : (
              'Clear All Data'
            )}
          </motion.button>
        </motion.div>
      </div>

      {/* Database Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="cyber-card p-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Database className="w-6 h-6 text-cyber-green" />
          <h3 className="text-lg font-semibold">Database Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold text-cyber-green mb-2">Storage Details</h4>
            <ul className="space-y-1 text-gray-400">
              <li>• Database: IndexedDB (Browser Storage)</li>
              <li>• Persistence: Local Device Only</li>
              <li>• Backup: Manual Export/Import</li>
              <li>• Sync: Not Available</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-cyber-purple mb-2">Data Types</h4>
            <ul className="space-y-1 text-gray-400">
              <li>• Syllabus Progress Tracking</li>
              <li>• Daily Task Completion</li>
              <li>• Timeline Events & Deadlines</li>
              <li>• Activity Heatmap Data</li>
              <li>• Study Sessions & Notes</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-cyber-bg/50 rounded-lg">
          <p className="text-xs text-gray-400">
            💡 <strong>Pro Tip:</strong> Export your data regularly to avoid losing progress. 
            The database is stored locally in your browser and will be lost if you clear browser data.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default DatabaseManager