// System Controller - Unified orchestration and error handling for AVION.EXE (Memory Optimized)
import db from './database'
import { calendarCore, dailyResetManager } from './calendarSystem'
import aiDecisionLayer from './aiDecisionLayer'
import recoverySystem from './recoverySystem'
import intelligenceLayer from './intelligenceLayer'
import executionEngine from './executionEngine'
import memoryOptimizer from './memoryOptimizer'

class SystemController {
  constructor() {
    this.systemState = {
      initialized: false,
      version: '2.0.0',
      components: {
        database: 'offline',
        calendar: 'offline',
        ai: 'offline',
        recovery: 'offline',
        intelligence: 'offline',
        execution: 'offline'
      },
      lastHealthCheck: null,
      errorCount: 0,
      performanceMetrics: {
        avgResponseTime: 0,
        totalOperations: 0,
        errorRate: 0
      }
    }
    
    this.healthCheckInterval = 5 * 60 * 1000 // 5 minutes
    this.maxRetries = 3
    this.circuitBreaker = {
      ai: { failures: 0, lastFailure: null, isOpen: false },
      database: { failures: 0, lastFailure: null, isOpen: false },
      intelligence: { failures: 0, lastFailure: null, isOpen: false }
    }
  }

  // Main system initialization
  async initializeSystem() {
    try {
      console.log('🚀 Initializing AVION.EXE System...')
      const startTime = Date.now()
      
      // Initialize components in dependency order
      const initResults = await this.initializeComponents()
      
      // Run system health check
      const healthCheck = await this.performHealthCheck()
      
      // Start background services
      this.startBackgroundServices()
      
      // Update system state
      this.systemState.initialized = true
      this.systemState.lastHealthCheck = new Date().toISOString()
      
      const initTime = Date.now() - startTime
      console.log(`✅ AVION.EXE System initialized in ${initTime}ms`)
      
      return {
        success: true,
        initTime,
        components: initResults,
        health: healthCheck,
        version: this.systemState.version
      }
      
    } catch (error) {
      console.error('❌ System initialization failed:', error)
      return {
        success: false,
        error: error.message,
        partialInit: this.systemState.components
      }
    }
  }

  // Initialize all system components
  async initializeComponents() {
    const results = {}
    
    try {
      // 1. Database (Critical - everything depends on this)
      console.log('📊 Initializing Database...')
      await db.init()
      await this.runDatabaseMigrations()
      results.database = { status: 'online', message: 'Database initialized' }
      this.systemState.components.database = 'online'
    } catch (error) {
      results.database = { status: 'error', error: error.message }
      throw new Error(`Database initialization failed: ${error.message}`)
    }

    try {
      // 2. Calendar System (Critical - needed for date awareness)
      console.log('📅 Initializing Calendar System...')
      await calendarCore.initializeCalendarEvents()
      calendarCore.scheduleMidnightReset()
      results.calendar = { status: 'online', message: 'Calendar system active' }
      this.systemState.components.calendar = 'online'
    } catch (error) {
      results.calendar = { status: 'degraded', error: error.message }
      this.systemState.components.calendar = 'degraded'
    }

    try {
      // 3. AI Decision Layer (Important - but has fallbacks)
      console.log('🧠 Initializing AI Decision Layer...')
      const aiHealth = await aiDecisionLayer.healthCheck()
      if (aiHealth) {
        results.ai = { status: 'online', message: 'AI system connected' }
        this.systemState.components.ai = 'online'
      } else {
        results.ai = { status: 'degraded', message: 'AI offline - using fallbacks' }
        this.systemState.components.ai = 'degraded'
      }
    } catch (error) {
      results.ai = { status: 'degraded', error: error.message }
      this.systemState.components.ai = 'degraded'
    }

    try {
      // 4. Recovery System (Important - but can operate without AI)
      console.log('🛡️ Initializing Recovery System...')
      await recoverySystem.checkAndActivateRecovery()
      results.recovery = { status: 'online', message: 'Recovery system monitoring' }
      this.systemState.components.recovery = 'online'
    } catch (error) {
      results.recovery = { status: 'degraded', error: error.message }
      this.systemState.components.recovery = 'degraded'
    }

    try {
      // 5. Intelligence Layer (Optional - enhances experience)
      console.log('🔮 Initializing Intelligence Layer...')
      await intelligenceLayer.getLatestIntelligence()
      results.intelligence = { status: 'online', message: 'Intelligence analysis active' }
      this.systemState.components.intelligence = 'online'
    } catch (error) {
      results.intelligence = { status: 'degraded', error: error.message }
      this.systemState.components.intelligence = 'degraded'
    }

    try {
      // 6. Execution Engine (Critical - core functionality)
      console.log('⚡ Initializing Execution Engine...')
      await executionEngine.orchestrateExecution()
      results.execution = { status: 'online', message: 'Execution engine ready' }
      this.systemState.components.execution = 'online'
    } catch (error) {
      results.execution = { status: 'degraded', error: error.message }
      this.systemState.components.execution = 'degraded'
    }

    return results
  }

  // Run database migrations safely
  async runDatabaseMigrations() {
    try {
      console.log('🔄 Running database migrations...')
      
      // Run enhanced schema migration
      const migrationResult = await db.migrateToEnhancedSchemas()
      if (!migrationResult) {
        console.warn('⚠️ Database migration had issues but continuing...')
      }
      
      // Validate data integrity
      const integrityCheck = await db.validateDataIntegrity()
      if (!integrityCheck.isValid) {
        console.warn('⚠️ Data integrity issues detected:', integrityCheck.issues)
        // Continue anyway - system can handle inconsistencies
      }
      
      console.log('✅ Database migrations completed')
      return true
    } catch (error) {
      console.error('❌ Database migration failed:', error)
      // Don't throw - system can work with existing schema
      return false
    }
  }

  // Comprehensive system health check
  async performHealthCheck() {
    const health = {
      overall: 'healthy',
      components: {},
      timestamp: new Date().toISOString(),
      issues: []
    }

    // Check each component
    for (const [component, status] of Object.entries(this.systemState.components)) {
      try {
        const componentHealth = await this.checkComponentHealth(component)
        health.components[component] = componentHealth
        
        if (componentHealth.status === 'error') {
          health.issues.push(`${component}: ${componentHealth.message}`)
          if (['database', 'execution'].includes(component)) {
            health.overall = 'critical'
          } else if (health.overall === 'healthy') {
            health.overall = 'degraded'
          }
        }
      } catch (error) {
        health.components[component] = { status: 'error', message: error.message }
        health.issues.push(`${component}: Health check failed`)
      }
    }

    return health
  }

  // Check individual component health
  async checkComponentHealth(component) {
    const startTime = Date.now()
    
    try {
      switch (component) {
        case 'database':
          await db.getSystemState()
          return { status: 'online', responseTime: Date.now() - startTime }
          
        case 'calendar':
          calendarCore.getTodayString()
          return { status: 'online', responseTime: Date.now() - startTime }
          
        case 'ai':
          if (this.circuitBreaker.ai.isOpen) {
            return { status: 'degraded', message: 'Circuit breaker open' }
          }
          const aiHealth = await aiDecisionLayer.healthCheck()
          return { 
            status: aiHealth ? 'online' : 'degraded', 
            responseTime: Date.now() - startTime,
            message: aiHealth ? 'Connected' : 'Offline - using fallbacks'
          }
          
        case 'recovery':
          await recoverySystem.getRecoveryStatus()
          return { status: 'online', responseTime: Date.now() - startTime }
          
        case 'intelligence':
          if (this.circuitBreaker.intelligence.isOpen) {
            return { status: 'degraded', message: 'Circuit breaker open' }
          }
          // Quick cache check instead of full analysis
          const cached = intelligenceLayer.predictionCache.get('latest')
          return { 
            status: cached ? 'online' : 'degraded', 
            responseTime: Date.now() - startTime,
            message: cached ? 'Analysis cached' : 'No recent analysis'
          }
          
        case 'execution':
          executionEngine.getExecutionState()
          return { status: 'online', responseTime: Date.now() - startTime }
          
        default:
          return { status: 'unknown', message: 'Unknown component' }
      }
    } catch (error) {
      this.handleComponentError(component, error)
      return { status: 'error', message: error.message, responseTime: Date.now() - startTime }
    }
  }

  // Handle component errors with circuit breaker pattern
  handleComponentError(component, error) {
    if (this.circuitBreaker[component]) {
      this.circuitBreaker[component].failures++
      this.circuitBreaker[component].lastFailure = Date.now()
      
      // Open circuit breaker after 3 failures
      if (this.circuitBreaker[component].failures >= 3) {
        this.circuitBreaker[component].isOpen = true
        console.warn(`🔌 Circuit breaker opened for ${component}`)
        
        // Auto-reset after 5 minutes
        setTimeout(() => {
          this.circuitBreaker[component].isOpen = false
          this.circuitBreaker[component].failures = 0
          console.log(`🔌 Circuit breaker reset for ${component}`)
        }, 5 * 60 * 1000)
      }
    }
    
    this.systemState.errorCount++
    console.error(`❌ Component error [${component}]:`, error)
  }

  // Start background services
  startBackgroundServices() {
    // Periodic health checks (using memory optimizer)
    const healthCheckId = memoryOptimizer.setInterval(async () => {
      try {
        const health = await this.performHealthCheck()
        this.systemState.lastHealthCheck = health.timestamp
        
        if (health.overall === 'critical') {
          console.error('🚨 System health critical:', health.issues)
          await this.handleCriticalFailure(health)
        }
      } catch (error) {
        console.error('Health check failed:', error)
      }
    }, this.healthCheckInterval)

    // Performance metrics collection (using memory optimizer)
    const metricsId = memoryOptimizer.setInterval(() => {
      this.updatePerformanceMetrics()
    }, 60 * 1000) // Every minute

    // Automatic cache cleanup (using memory optimizer)
    const cleanupId = memoryOptimizer.setInterval(() => {
      this.cleanupCaches()
    }, 30 * 60 * 1000) // Every 30 minutes

    // Memory monitoring
    const memoryMonitorId = memoryOptimizer.startMemoryMonitoring(5 * 60 * 1000) // Every 5 minutes

    console.log('🔄 Background services started with memory optimization')
    
    // Store interval IDs for cleanup
    this.backgroundServices = {
      healthCheck: healthCheckId,
      metrics: metricsId,
      cleanup: cleanupId,
      memoryMonitor: memoryMonitorId
    }
  }

  // Handle critical system failures
  async handleCriticalFailure(health) {
    try {
      console.log('🚨 Handling critical system failure...')
      
      // Try to save current state
      await this.emergencyStateSave()
      
      // Attempt component restart
      for (const issue of health.issues) {
        if (issue.includes('database')) {
          await this.restartComponent('database')
        } else if (issue.includes('execution')) {
          await this.restartComponent('execution')
        }
      }
      
    } catch (error) {
      console.error('Critical failure handling failed:', error)
    }
  }

  // Emergency state save
  async emergencyStateSave() {
    try {
      const emergencyState = {
        timestamp: new Date().toISOString(),
        systemState: this.systemState,
        executionState: executionEngine.getExecutionState(),
        version: this.systemState.version
      }
      
      // Save to localStorage as backup
      localStorage.setItem('avion_emergency_state', JSON.stringify(emergencyState))
      console.log('💾 Emergency state saved to localStorage')
      
    } catch (error) {
      console.error('Emergency state save failed:', error)
    }
  }

  // Restart individual components
  async restartComponent(component) {
    try {
      console.log(`🔄 Restarting component: ${component}`)
      
      switch (component) {
        case 'database':
          await db.init()
          this.systemState.components.database = 'online'
          break
          
        case 'execution':
          await executionEngine.refreshExecution()
          this.systemState.components.execution = 'online'
          break
          
        case 'ai':
          this.circuitBreaker.ai.isOpen = false
          this.circuitBreaker.ai.failures = 0
          this.systemState.components.ai = 'degraded' // Will be checked on next health check
          break
      }
      
      console.log(`✅ Component restarted: ${component}`)
      
    } catch (error) {
      console.error(`❌ Component restart failed [${component}]:`, error)
    }
  }

  // Update performance metrics
  updatePerformanceMetrics() {
    const metrics = this.systemState.performanceMetrics
    metrics.totalOperations++
    
    // Calculate error rate
    metrics.errorRate = (this.systemState.errorCount / metrics.totalOperations) * 100
    
    // Log performance summary every 10 minutes
    if (metrics.totalOperations % 10 === 0) {
      console.log(`📊 Performance: ${metrics.totalOperations} ops, ${metrics.errorRate.toFixed(1)}% error rate`)
    }
  }

  // Cleanup caches and temporary data
  cleanupCaches() {
    try {
      // Clear intelligence cache if old
      intelligenceLayer.clearCache()
      
      // Use memory optimizer for cache cleanup
      const keysCleared = memoryOptimizer.cleanupCache(new Map(Object.entries(localStorage)))
      
      // Clear old localStorage entries
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith('avion_temp_') || key.startsWith('avion_cache_')) {
          const item = localStorage.getItem(key)
          try {
            const data = JSON.parse(item)
            if (data.timestamp && Date.now() - new Date(data.timestamp).getTime() > 24 * 60 * 60 * 1000) {
              localStorage.removeItem(key)
            }
          } catch (e) {
            localStorage.removeItem(key) // Remove invalid entries
          }
        }
      })
      
      // Force garbage collection if memory pressure is high
      if (memoryOptimizer.isMemoryPressureHigh()) {
        console.warn('🧹 High memory pressure detected, forcing cleanup')
        memoryOptimizer.forceGC()
      }
      
      console.log(`🧹 Cache cleanup completed (${keysCleared} items cleared)`)
    } catch (error) {
      console.error('Cache cleanup failed:', error)
    }
  }

  // System export functionality
  async exportSystemData() {
    try {
      console.log('📦 Exporting system data...')
      const startTime = Date.now()
      
      // Export all database data
      const databaseExport = await db.exportData()
      
      // Export system configuration
      const systemConfig = {
        version: this.systemState.version,
        components: this.systemState.components,
        performanceMetrics: this.systemState.performanceMetrics,
        exportDate: new Date().toISOString()
      }
      
      // Export AI decision history
      const aiDecisions = await db.getAIDecisions(null, 90) // Last 90 days
      
      const exportData = {
        metadata: {
          version: this.systemState.version,
          exportDate: new Date().toISOString(),
          exportTime: Date.now() - startTime
        },
        systemConfig,
        database: databaseExport,
        aiDecisions,
        checksum: this.calculateChecksum(databaseExport)
      }
      
      console.log(`✅ System data exported in ${Date.now() - startTime}ms`)
      return exportData
      
    } catch (error) {
      console.error('System export failed:', error)
      throw error
    }
  }

  // System import functionality
  async importSystemData(importData) {
    try {
      console.log('📥 Importing system data...')
      
      // Validate import data
      if (!this.validateImportData(importData)) {
        throw new Error('Invalid import data format')
      }
      
      // Create backup before import
      const backup = await this.exportSystemData()
      localStorage.setItem('avion_pre_import_backup', JSON.stringify(backup))
      
      // Clear existing data
      await db.clearAllData()
      
      // Import database data
      await this.importDatabaseData(importData.database)
      
      // Import AI decisions
      if (importData.aiDecisions) {
        await this.importAIDecisions(importData.aiDecisions)
      }
      
      // Reinitialize system
      await this.initializeSystem()
      
      console.log('✅ System data imported successfully')
      return { success: true, message: 'Import completed successfully' }
      
    } catch (error) {
      console.error('System import failed:', error)
      
      // Attempt to restore from backup
      try {
        const backup = localStorage.getItem('avion_pre_import_backup')
        if (backup) {
          console.log('🔄 Restoring from backup...')
          await this.importSystemData(JSON.parse(backup))
        }
      } catch (restoreError) {
        console.error('Backup restore failed:', restoreError)
      }
      
      throw error
    }
  }

  // Validate import data structure
  validateImportData(data) {
    return data && 
           data.metadata && 
           data.database && 
           data.metadata.version &&
           typeof data.database === 'object'
  }

  // Import database data
  async importDatabaseData(databaseData) {
    const storeNames = Object.keys(databaseData)
    
    for (const storeName of storeNames) {
      const storeData = databaseData[storeName]
      if (Array.isArray(storeData)) {
        // Import each record
        for (const record of storeData) {
          try {
            // Use appropriate import method based on store
            await this.importRecord(storeName, record)
          } catch (error) {
            console.warn(`Failed to import record to ${storeName}:`, error)
          }
        }
      }
    }
  }

  // Import individual records
  async importRecord(storeName, record) {
    // Map store names to import methods
    const importMethods = {
      'syllabusProgress': () => db.saveSyllabusProgress(record.subjectId, record.unitIndex, record.topicIndex, record.completed),
      'dailyTasks': () => db.saveDailyTask(record.taskId, record.completed, record.date),
      'activityData': () => db.saveActivityData(record.date, record.intensity),
      'dailyExecution': () => db.saveDailyExecution(record.date, record),
      'systemState': () => db.saveSystemState(record),
      'calendarEvents': () => db.saveCalendarEvent(record)
    }
    
    const importMethod = importMethods[storeName]
    if (importMethod) {
      await importMethod()
    }
  }

  // Import AI decisions
  async importAIDecisions(aiDecisions) {
    for (const decision of aiDecisions) {
      try {
        await db.logAIDecision(
          decision.decisionType,
          JSON.parse(decision.inputSnapshot),
          JSON.parse(decision.outputResult),
          decision.confidenceScore
        )
      } catch (error) {
        console.warn('Failed to import AI decision:', error)
      }
    }
  }

  // Calculate data checksum for integrity
  calculateChecksum(data) {
    const str = JSON.stringify(data)
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return hash.toString(16)
  }

  // Public interface methods
  getSystemStatus() {
    return {
      ...this.systemState,
      uptime: this.systemState.initialized ? Date.now() - new Date(this.systemState.lastHealthCheck).getTime() : 0
    }
  }

  async forceHealthCheck() {
    return await this.performHealthCheck()
  }

  async restartSystem() {
    console.log('🔄 Restarting AVION.EXE System...')
    this.systemState.initialized = false
    return await this.initializeSystem()
  }

  async emergencyReset() {
    try {
      console.log('🚨 Emergency system reset...')
      
      // Save current state
      await this.emergencyStateSave()
      
      // Clear all caches
      this.cleanupCaches()
      intelligenceLayer.clearCache()
      
      // Reset circuit breakers
      Object.keys(this.circuitBreaker).forEach(component => {
        this.circuitBreaker[component] = { failures: 0, lastFailure: null, isOpen: false }
      })
      
      // Reinitialize
      return await this.initializeSystem()
      
    } catch (error) {
      console.error('Emergency reset failed:', error)
      throw error
    }
  }

  // Get comprehensive system diagnostics
  async getSystemDiagnostics() {
    const health = await this.performHealthCheck()
    const executionState = executionEngine.getExecutionState()
    const recoveryStatus = await recoverySystem.getRecoveryStatus()
    const memoryUsage = memoryOptimizer.getMemoryUsage()
    
    return {
      system: this.getSystemStatus(),
      health,
      execution: executionState,
      recovery: recoveryStatus,
      performance: this.systemState.performanceMetrics,
      circuitBreakers: this.circuitBreaker,
      memory: memoryUsage,
      timestamp: new Date().toISOString()
    }
  }

  // Cleanup system resources
  cleanup() {
    try {
      console.log('🧹 Cleaning up system resources...')
      
      // Stop background services
      if (this.backgroundServices) {
        Object.values(this.backgroundServices).forEach(intervalId => {
          memoryOptimizer.clearInterval(intervalId)
        })
      }
      
      // Cleanup memory optimizer
      memoryOptimizer.cleanup()
      
      // Clear system state
      this.systemState.initialized = false
      
      console.log('✅ System cleanup completed')
    } catch (error) {
      console.error('❌ System cleanup failed:', error)
    }
  }
}

// Export singleton instance
export const systemController = new SystemController()
export default systemController