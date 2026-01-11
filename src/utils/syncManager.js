// Sync Manager - Zero Data Loss Architecture for AVION.EXE (Memory Optimized)
import db from './database'

class SyncManager {
  constructor() {
    this.isOnline = navigator.onLine
    this.syncQueue = []
    this.syncInProgress = false
    this.deviceId = this.getOrCreateDeviceId()
    this.userId = null
    this.encryptionKey = null
    this.syncInterval = 5 * 60 * 1000 // 5 minutes
    this.retryDelay = 30 * 1000 // 30 seconds
    
    // Sync status
    this.lastSyncTime = null
    this.syncStatus = 'offline' // 'offline', 'syncing', 'synced', 'error'
    this.syncError = null
    
    // Event listener references for cleanup
    this.onlineHandler = null
    this.offlineHandler = null
    this.syncIntervalId = null
    
    this.initializeSync()
  }

  async initializeSync() {
    // Create bound event handlers for proper cleanup
    this.onlineHandler = () => {
      this.isOnline = true
      this.processSyncQueue()
    }
    
    this.offlineHandler = () => {
      this.isOnline = false
      this.syncStatus = 'offline'
    }
    
    // Listen for online/offline events
    window.addEventListener('online', this.onlineHandler)
    window.addEventListener('offline', this.offlineHandler)
    
    // Initialize sync queue from IndexedDB
    await this.loadSyncQueue()
    
    // Start periodic sync if user is authenticated
    if (this.isAuthenticated()) {
      this.startPeriodicSync()
    }
  }

  // Cleanup method to prevent memory leaks
  destroy() {
    // Remove event listeners
    if (this.onlineHandler) {
      window.removeEventListener('online', this.onlineHandler)
    }
    if (this.offlineHandler) {
      window.removeEventListener('offline', this.offlineHandler)
    }
    
    // Clear intervals
    this.stopPeriodicSync()
    
    // Clear references
    this.syncQueue = []
    this.onlineHandler = null
    this.offlineHandler = null
  }

  // Device identification
  getOrCreateDeviceId() {
    let deviceId = localStorage.getItem('avion_device_id')
    if (!deviceId) {
      deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      localStorage.setItem('avion_device_id', deviceId)
    }
    return deviceId
  }

  // Authentication check
  isAuthenticated() {
    return localStorage.getItem('avion_user_token') !== null
  }

  // Enable sync for authenticated user
  async enableSync(userToken, userId) {
    try {
      this.userId = userId
      localStorage.setItem('avion_user_token', userToken)
      localStorage.setItem('avion_user_id', userId)
      
      // Generate encryption key from user credentials
      this.encryptionKey = await this.deriveEncryptionKey(userId, userToken)
      
      // Perform initial backup of existing data
      await this.performInitialBackup()
      
      // Start periodic sync
      this.startPeriodicSync()
      
      return { success: true, message: 'Sync enabled successfully' }
    } catch (error) {
      console.error('Failed to enable sync:', error)
      return { success: false, error: error.message }
    }
  }

  // Disable sync (go offline-only)
  async disableSync() {
    this.stopPeriodicSync()
    localStorage.removeItem('avion_user_token')
    localStorage.removeItem('avion_user_id')
    this.userId = null
    this.encryptionKey = null
    this.syncStatus = 'offline'
    
    // Clear sync queue
    await this.clearSyncQueue()
  }

  // Add operation to sync queue
  async queueSync(operation, storeName, recordId, data) {
    const syncItem = {
      id: 'sync_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      operation, // 'create', 'update', 'delete'
      storeName,
      recordId,
      data: JSON.parse(JSON.stringify(data)), // Deep clone
      timestamp: new Date().toISOString(),
      retryCount: 0,
      maxRetries: 3,
      status: 'pending'
    }
    
    this.syncQueue.push(syncItem)
    await this.saveSyncQueue()
    
    // Process immediately if online
    if (this.isOnline && this.isAuthenticated()) {
      this.processSyncQueue()
    }
  }

  // Process sync queue
  async processSyncQueue() {
    if (this.syncInProgress || !this.isOnline || !this.isAuthenticated()) {
      return
    }
    
    this.syncInProgress = true
    this.syncStatus = 'syncing'
    
    try {
      const pendingItems = this.syncQueue.filter(item => item.status === 'pending')
      
      for (const item of pendingItems) {
        try {
          await this.syncItem(item)
          item.status = 'completed'
        } catch (error) {
          item.retryCount++
          if (item.retryCount >= item.maxRetries) {
            item.status = 'failed'
            console.error('Sync item failed permanently:', item, error)
          } else {
            console.warn('Sync item failed, will retry:', item, error)
          }
        }
      }
      
      // Remove completed items
      this.syncQueue = this.syncQueue.filter(item => item.status !== 'completed')
      await this.saveSyncQueue()
      
      // Update sync status
      const failedItems = this.syncQueue.filter(item => item.status === 'failed')
      if (failedItems.length > 0) {
        this.syncStatus = 'error'
        this.syncError = `${failedItems.length} items failed to sync`
      } else {
        this.syncStatus = 'synced'
        this.lastSyncTime = new Date().toISOString()
        this.syncError = null
      }
      
    } catch (error) {
      this.syncStatus = 'error'
      this.syncError = error.message
      console.error('Sync queue processing failed:', error)
    } finally {
      this.syncInProgress = false
    }
  }

  // Sync individual item to cloud
  async syncItem(item) {
    // This would integrate with your chosen cloud provider
    // For now, simulate the sync operation
    
    const payload = {
      userId: this.userId,
      deviceId: this.deviceId,
      operation: item.operation,
      storeName: item.storeName,
      recordId: item.recordId,
      data: await this.encryptData(item.data),
      timestamp: item.timestamp,
      version: 1
    }
    
    // Simulate cloud API call
    await this.cloudSync(payload)
  }

  // Cloud sync implementation (placeholder)
  async cloudSync(payload) {
    // This would be replaced with actual cloud provider integration
    // Examples: Firebase, Supabase, or custom backend
    
    return new Promise((resolve, reject) => {
      // Simulate network delay
      setTimeout(() => {
        if (Math.random() > 0.1) { // 90% success rate
          resolve({ success: true })
        } else {
          reject(new Error('Network error'))
        }
      }, 100 + Math.random() * 500)
    })
  }

  // Encrypt data before cloud storage
  async encryptData(data) {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not available')
    }
    
    // Simple encryption implementation (use crypto-js in production)
    const jsonString = JSON.stringify(data)
    const encrypted = btoa(jsonString) // Base64 encoding (replace with AES-256)
    return encrypted
  }

  // Decrypt data from cloud
  async decryptData(encryptedData) {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not available')
    }
    
    // Simple decryption implementation
    const jsonString = atob(encryptedData) // Base64 decoding
    return JSON.parse(jsonString)
  }

  // Derive encryption key from user credentials
  async deriveEncryptionKey(userId, userToken) {
    // In production, use PBKDF2 or similar
    const keyMaterial = userId + userToken
    return btoa(keyMaterial).substr(0, 32) // Simple key derivation
  }

  // Perform initial backup of existing data
  async performInitialBackup() {
    try {
      console.log('Performing initial backup...')
      
      // Export all existing data
      const allData = await db.exportData()
      
      // Create backup record
      const backup = {
        userId: this.userId,
        deviceId: this.deviceId,
        backupId: 'initial_' + Date.now(),
        timestamp: new Date().toISOString(),
        version: '2.0.0',
        encryptedData: await this.encryptData(allData),
        metadata: {
          recordCount: this.calculateRecordCount(allData),
          lastActivity: new Date().toISOString(),
          dataChecksum: this.calculateChecksum(allData),
          schemaVersion: 4
        }
      }
      
      // Upload to cloud
      await this.uploadBackup(backup)
      
      console.log('Initial backup completed')
    } catch (error) {
      console.error('Initial backup failed:', error)
      throw error
    }
  }

  // Upload backup to cloud
  async uploadBackup(backup) {
    // Placeholder for cloud backup upload
    console.log('Uploading backup:', backup.backupId)
    return this.cloudSync(backup)
  }

  // Restore data from cloud backup
  async restoreFromCloud() {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('User not authenticated')
      }
      
      console.log('Restoring data from cloud...')
      
      // Download latest backup
      const backup = await this.downloadLatestBackup()
      
      if (!backup) {
        return { success: false, message: 'No backup found' }
      }
      
      // Decrypt data
      const decryptedData = await this.decryptData(backup.encryptedData)
      
      // Clear existing data
      await db.clearAllData()
      
      // Import restored data
      await this.importData(decryptedData)
      
      console.log('Data restored successfully')
      return { 
        success: true, 
        message: `Restored from backup: ${backup.timestamp}`,
        recordCount: backup.metadata.recordCount
      }
      
    } catch (error) {
      console.error('Restore failed:', error)
      return { success: false, error: error.message }
    }
  }

  // Download latest backup from cloud
  async downloadLatestBackup() {
    // Placeholder for cloud backup download
    // Would query cloud provider for latest backup for this user
    return null
  }

  // Import data into IndexedDB
  async importData(data) {
    // Use existing database import methods
    const storeNames = Object.keys(data)
    
    for (const storeName of storeNames) {
      const storeData = data[storeName]
      if (Array.isArray(storeData)) {
        for (const record of storeData) {
          await this.importRecord(storeName, record)
        }
      }
    }
  }

  // Import individual record
  async importRecord(storeName, record) {
    // Add sync metadata to imported records
    const recordWithSync = {
      ...record,
      syncMeta: {
        lastModified: new Date().toISOString(),
        syncStatus: 'synced',
        version: 1,
        deviceId: this.deviceId,
        conflictResolved: false
      }
    }
    
    // Use appropriate database method based on store
    switch (storeName) {
      case 'syllabusProgress':
        await db.saveSyllabusProgress(record.subjectId, record.unitIndex, record.topicIndex, record.completed)
        break
      case 'dailyTasks':
        await db.saveDailyTask(record.taskId, record.completed, record.date)
        break
      case 'activityData':
        await db.saveActivityData(record.date, record.intensity)
        break
      // Add other store types as needed
    }
  }

  // Utility methods
  calculateRecordCount(data) {
    return Object.values(data).reduce((total, storeData) => {
      return total + (Array.isArray(storeData) ? storeData.length : 0)
    }, 0)
  }

  calculateChecksum(data) {
    const str = JSON.stringify(data)
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return hash.toString(16)
  }

  // Sync queue persistence
  async saveSyncQueue() {
    try {
      localStorage.setItem('avion_sync_queue', JSON.stringify(this.syncQueue))
    } catch (error) {
      console.error('Failed to save sync queue:', error)
    }
  }

  async loadSyncQueue() {
    try {
      const saved = localStorage.getItem('avion_sync_queue')
      if (saved) {
        this.syncQueue = JSON.parse(saved)
      }
    } catch (error) {
      console.error('Failed to load sync queue:', error)
      this.syncQueue = []
    }
  }

  async clearSyncQueue() {
    this.syncQueue = []
    localStorage.removeItem('avion_sync_queue')
  }

  // Periodic sync
  startPeriodicSync() {
    this.stopPeriodicSync() // Clear any existing interval
    
    this.syncIntervalId = setInterval(() => {
      if (this.isOnline && this.isAuthenticated()) {
        this.processSyncQueue()
      }
    }, this.syncInterval)
  }

  stopPeriodicSync() {
    if (this.syncIntervalId) {
      clearInterval(this.syncIntervalId)
      this.syncIntervalId = null
    }
  }

  // Public interface
  getSyncStatus() {
    return {
      status: this.syncStatus,
      lastSyncTime: this.lastSyncTime,
      error: this.syncError,
      queueLength: this.syncQueue.length,
      isAuthenticated: this.isAuthenticated(),
      isOnline: this.isOnline
    }
  }

  async forcSync() {
    if (!this.isAuthenticated()) {
      throw new Error('User not authenticated')
    }
    
    await this.processSyncQueue()
    return this.getSyncStatus()
  }

  // Manual export (ultimate fallback)
  async exportForManualBackup() {
    const allData = await db.exportData()
    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        deviceId: this.deviceId,
        version: '2.0.0'
      },
      data: allData,
      checksum: this.calculateChecksum(allData)
    }
    
    return exportData
  }
}

// Export singleton instance
export const syncManager = new SyncManager()
export default syncManager