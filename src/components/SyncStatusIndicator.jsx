import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Cloud, 
  CloudOff, 
  Wifi, 
  WifiOff, 
  RefreshCw,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import syncManager from '../utils/syncManager'

const SyncStatusIndicator = () => {
  const [syncStatus, setSyncStatus] = useState(syncManager.getSyncStatus())
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    // Update sync status every 30 seconds
    const interval = setInterval(() => {
      setSyncStatus(syncManager.getSyncStatus())
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const getSyncIcon = () => {
    if (!syncStatus.isOnline) {
      return <WifiOff className="w-4 h-4 text-gray-500" />
    }
    
    if (!syncStatus.isAuthenticated) {
      return <CloudOff className="w-4 h-4 text-gray-500" />
    }
    
    switch (syncStatus.status) {
      case 'syncing':
        return <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
      case 'synced':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />
      default:
        return <Cloud className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusText = () => {
    if (!syncStatus.isOnline) {
      return 'Offline'
    }
    
    if (!syncStatus.isAuthenticated) {
      return 'Local Only'
    }
    
    switch (syncStatus.status) {
      case 'syncing':
        return 'Syncing...'
      case 'synced':
        const lastSync = syncStatus.lastSyncTime
        if (lastSync) {
          const minutes = Math.floor((Date.now() - new Date(lastSync).getTime()) / 60000)
          if (minutes < 1) return 'Just synced'
          if (minutes < 60) return `${minutes}m ago`
          const hours = Math.floor(minutes / 60)
          return `${hours}h ago`
        }
        return 'Synced'
      case 'error':
        return 'Sync failed'
      default:
        return 'Ready'
    }
  }

  const getStatusColor = () => {
    if (!syncStatus.isOnline) {
      return 'text-gray-500'
    }
    
    if (!syncStatus.isAuthenticated) {
      return 'text-yellow-500'
    }
    
    switch (syncStatus.status) {
      case 'syncing':
        return 'text-blue-400'
      case 'synced':
        return 'text-green-400'
      case 'error':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowDetails(!showDetails)}
        className="flex items-center space-x-2 px-3 py-1 rounded-md bg-cyber-card/50 hover:bg-cyber-card transition-colors"
      >
        {getSyncIcon()}
        <span className={`text-xs ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </motion.button>

      {/* Details Tooltip */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full right-0 mt-2 w-64 cyber-card p-4 z-50"
        >
          <h4 className="font-semibold mb-2">Sync Status</h4>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Network:</span>
              <span className={syncStatus.isOnline ? 'text-green-400' : 'text-red-400'}>
                {syncStatus.isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span>Cloud Sync:</span>
              <span className={syncStatus.isAuthenticated ? 'text-green-400' : 'text-gray-400'}>
                {syncStatus.isAuthenticated ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            
            {syncStatus.queueLength > 0 && (
              <div className="flex justify-between">
                <span>Pending:</span>
                <span className="text-yellow-400">{syncStatus.queueLength} items</span>
              </div>
            )}
            
            {syncStatus.error && (
              <div className="text-red-400 text-xs mt-2">
                {syncStatus.error}
              </div>
            )}
          </div>
          
          <div className="mt-3 pt-3 border-t border-cyber-border">
            <p className="text-xs text-gray-400">
              {syncStatus.isAuthenticated 
                ? '🔒 Data encrypted & synced to cloud'
                : '💾 Data stored locally only'
              }
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default SyncStatusIndicator