import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Cloud, 
  CloudOff, 
  Wifi, 
  WifiOff, 
  Shield, 
  Download, 
  Upload,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  XCircle,
  Settings
} from 'lucide-react'
import syncManager from '../utils/syncManager'

const SyncManager = () => {
  const [syncStatus, setSyncStatus] = useState(syncManager.getSyncStatus())
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const [restoreResult, setRestoreResult] = useState(null)

  useEffect(() => {
    // Update sync status every 30 seconds
    const interval = setInterval(() => {
      setSyncStatus(syncManager.getSyncStatus())
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const handleEnableSync = async () => {
    // In production, this would integrate with Google/GitHub OAuth
    // For now, simulate authentication
    const mockUserToken = 'mock_token_' + Date.now()
    const mockUserId = 'user_' + Date.now()
    
    const result = await syncManager.enableSync(mockUserToken, mockUserId)
    
    if (result.success) {
      setSyncStatus(syncManager.getSyncStatus())
      setShowAuthModal(false)
    } else {
      alert('Failed to enable sync: ' + result.error)
    }
  }

  const handleDisableSync = async () => {
    if (confirm('Disable cloud sync? Your data will remain local only.')) {
      await syncManager.disableSync()
      setSyncStatus(syncManager.getSyncStatus())
    }
  }

  const handleForceSync = async () => {
    try {
      await syncManager.forcSync()
      setSyncStatus(syncManager.getSyncStatus())
    } catch (error) {
      alert('Sync failed: ' + error.message)
    }
  }

  const handleRestoreFromCloud = async () => {
    setIsRestoring(true)
    setRestoreResult(null)
    
    try {
      const result = await syncManager.restoreFromCloud()
      setRestoreResult(result)
    } catch (error) {
      setRestoreResult({ success: false, error: error.message })
    } finally {
      setIsRestoring(false)
    }
  }

  const handleExportManualBackup = async () => {
    try {
      const exportData = await syncManager.exportForManualBackup()
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `avion-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      alert('Export failed: ' + error.message)
    }
  }

  const getSyncStatusIcon = () => {
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

  const getSyncStatusText = () => {
    if (!syncStatus.isOnline) {
      return 'Offline'
    }
    
    if (!syncStatus.isAuthenticated) {
      return 'Sync disabled'
    }
    
    switch (syncStatus.status) {
      case 'syncing':
        return 'Syncing...'
      case 'synced':
        const lastSync = syncStatus.lastSyncTime
        if (lastSync) {
          const minutes = Math.floor((Date.now() - new Date(lastSync).getTime()) / 60000)
          return `Synced ${minutes}m ago`
        }
        return 'Synced'
      case 'error':
        return `Error: ${syncStatus.error}`
      default:
        return 'Ready to sync'
    }
  }

  const getSyncStatusColor = () => {
    if (!syncStatus.isOnline || !syncStatus.isAuthenticated) {
      return 'text-gray-400'
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
    <div className="space-y-6">
      {/* Sync Status Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="cyber-card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-cyber-green" />
            <h2 className="text-xl font-bold">Zero Data Loss System</h2>
          </div>
          
          <div className="flex items-center space-x-2">
            {getSyncStatusIcon()}
            <span className={`text-sm ${getSyncStatusColor()}`}>
              {getSyncStatusText()}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="font-mono text-lg">
              {syncStatus.isOnline ? '🟢' : '🔴'}
            </div>
            <div className="text-gray-400">Network</div>
          </div>
          
          <div className="text-center">
            <div className="font-mono text-lg">
              {syncStatus.isAuthenticated ? '🔐' : '🔓'}
            </div>
            <div className="text-gray-400">Auth</div>
          </div>
          
          <div className="text-center">
            <div className="font-mono text-lg text-cyber-green">
              {syncStatus.queueLength}
            </div>
            <div className="text-gray-400">Queue</div>
          </div>
          
          <div className="text-center">
            <div className="font-mono text-lg text-cyber-purple">
              ∞
            </div>
            <div className="text-gray-400">Retention</div>
          </div>
        </div>
      </motion.div>

      {/* Sync Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Enable/Disable Sync */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="cyber-card p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Cloud className="w-6 h-6 text-cyber-green" />
            <h3 className="text-lg font-semibold">Cloud Sync</h3>
          </div>
          
          {!syncStatus.isAuthenticated ? (
            <>
              <p className="text-gray-400 mb-4">
                Enable cloud sync to never lose your data across devices and browsers.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAuthModal(true)}
                className="cyber-button w-full"
              >
                Enable Cloud Sync
              </motion.button>
            </>
          ) : (
            <>
              <p className="text-gray-400 mb-4">
                Cloud sync is active. Your data is automatically backed up.
              </p>
              <div className="space-y-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleForceSync}
                  className="cyber-button w-full"
                >
                  Force Sync Now
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDisableSync}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors"
                >
                  Disable Sync
                </motion.button>
              </div>
            </>
          )}
        </motion.div>

        {/* Restore Data */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="cyber-card p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Download className="w-6 h-6 text-cyber-purple" />
            <h3 className="text-lg font-semibold">Restore Data</h3>
          </div>
          
          <p className="text-gray-400 mb-4">
            Restore your data from cloud backup or manual export file.
          </p>
          
          <div className="space-y-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRestoreFromCloud}
              disabled={!syncStatus.isAuthenticated || isRestoring}
              className="cyber-button w-full disabled:opacity-50"
            >
              {isRestoring ? (
                <RefreshCw className="w-4 h-4 animate-spin mx-auto" />
              ) : (
                'Restore from Cloud'
              )}
            </motion.button>
            
            <label className="cyber-button w-full cursor-pointer block text-center">
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={(e) => {
                  // Handle manual file restore
                  console.log('Manual restore:', e.target.files[0])
                }}
              />
              Restore from File
            </label>
          </div>
          
          {restoreResult && (
            <div className={`mt-4 p-3 rounded-lg ${
              restoreResult.success ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'
            }`}>
              <div className="flex items-center space-x-2">
                {restoreResult.success ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                <span className="text-sm">
                  {restoreResult.success ? restoreResult.message : restoreResult.error}
                </span>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Manual Backup */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="cyber-card p-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Upload className="w-6 h-6 text-yellow-400" />
          <h3 className="text-lg font-semibold">Manual Backup</h3>
        </div>
        
        <p className="text-gray-400 mb-4">
          Download a complete backup file as ultimate fallback. Works without internet or authentication.
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleExportManualBackup}
          className="cyber-button"
        >
          Download Backup File
        </motion.button>
      </motion.div>

      {/* Data Safety Guarantees */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="cyber-card p-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="w-6 h-6 text-cyber-green" />
          <h3 className="text-lg font-semibold">Data Safety Guarantees</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold text-cyber-green mb-2">✅ Survives</h4>
            <ul className="space-y-1 text-gray-400">
              <li>• Browser changes</li>
              <li>• Device changes</li>
              <li>• OS reinstalls</li>
              <li>• App redeployments</li>
              <li>• Network outages</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-cyber-purple mb-2">🔒 Security</h4>
            <ul className="space-y-1 text-gray-400">
              <li>• End-to-end encryption</li>
              <li>• User-controlled keys</li>
              <li>• No data mining</li>
              <li>• Local-first priority</li>
              <li>• Manual export always available</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Auth Modal */}
      {showAuthModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowAuthModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="cyber-card p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">Enable Cloud Sync</h3>
            
            <p className="text-gray-400 mb-6">
              Sign in to enable automatic cloud backup. Your data will be encrypted before upload.
            </p>
            
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEnableSync}
                className="cyber-button w-full"
              >
                🔐 Sign in with Mock Auth
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAuthModal(false)}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors"
              >
                Cancel
              </motion.button>
            </div>
            
            <div className="mt-4 p-3 bg-cyber-bg/50 rounded-lg">
              <p className="text-xs text-gray-400">
                🔒 Your data is encrypted with your credentials before cloud storage. 
                Even we cannot read your data.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default SyncManager