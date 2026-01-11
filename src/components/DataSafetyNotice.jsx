import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Download, X } from 'lucide-react'

const DataSafetyNotice = () => {
  const [showNotice, setShowNotice] = useState(false)
  const [lastBackupReminder, setLastBackupReminder] = useState(null)

  useEffect(() => {
    // Check if user has seen the notice
    const hasSeenNotice = localStorage.getItem('avion_data_safety_notice')
    const lastReminder = localStorage.getItem('avion_last_backup_reminder')
    
    if (!hasSeenNotice) {
      setShowNotice(true)
    } else if (lastReminder) {
      const daysSinceReminder = (Date.now() - parseInt(lastReminder)) / (1000 * 60 * 60 * 24)
      if (daysSinceReminder > 30) { // Remind every 30 days
        setShowNotice(true)
        setLastBackupReminder(parseInt(lastReminder))
      }
    }
  }, [])

  const handleDismiss = () => {
    localStorage.setItem('avion_data_safety_notice', 'true')
    localStorage.setItem('avion_last_backup_reminder', Date.now().toString())
    setShowNotice(false)
  }

  const handleExportData = async () => {
    try {
      // Import system controller for export functionality
      const { systemController } = await import('../utils/systemController')
      const exportData = await systemController.exportSystemData()
      
      // Create download
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
      
      handleDismiss()
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try using the export function in Dashboard > View Details.')
    }
  }

  if (!showNotice) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-4 right-4 max-w-sm bg-yellow-900/90 border border-yellow-600 rounded-lg p-4 backdrop-blur-md z-50"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-semibold text-yellow-200 mb-2">
            {lastBackupReminder ? 'Backup Reminder' : 'Data Safety Notice'}
          </h4>
          <p className="text-yellow-100 text-sm mb-3">
            Your data is stored locally in your browser. Consider creating a backup to prevent data loss.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleExportData}
              className="flex items-center gap-1 px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-yellow-100 rounded text-sm transition-colors"
            >
              <Download className="w-3 h-3" />
              Backup Now
            </button>
            <button
              onClick={handleDismiss}
              className="px-3 py-1 text-yellow-200 hover:text-yellow-100 text-sm transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-yellow-400 hover:text-yellow-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}

export default DataSafetyNotice