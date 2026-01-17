// System Controller - Simplified for deployment
import db from './database'
import { calendarCore } from './calendarSystem'
import aiDecisionLayer from './aiDecisionLayer'
import recoverySystem from './recoverySystem'
import intelligenceLayer from './intelligenceLayer'
import memoryOptimizer from './memoryOptimizer'

class SystemController {
  constructor() {
    this.systemState = {
      initialized: false,
      version: '1.0.0',
      components: {
        database: 'offline',
        calendar: 'offline',
        ai: 'offline',
        recovery: 'offline',
        intelligence: 'offline'
      }
    }
  }

  async initializeSystem() {
    try {
      const startTime = Date.now()
      
      // Initialize components
      const results = {
        database: null,
        calendar: null,
        ai: null,
        recovery: null,
        intelligence: null
      }
      
      // Initialize database
      try {
        await db.init()
        results.database = { status: 'online', message: 'Database ready' }
        this.systemState.components.database = 'online'
      } catch (error) {
        results.database = { status: 'critical', error: error.message }
      }
      
      // Initialize calendar
      try {
        results.calendar = { status: 'online', message: 'Calendar ready' }
        this.systemState.components.calendar = 'online'
      } catch (error) {
        results.calendar = { status: 'degraded', error: error.message }
      }
      
      // Initialize AI (optional)
      try {
        const aiHealth = await aiDecisionLayer.healthCheck()
        if (aiHealth) {
          results.ai = { status: 'online', message: 'AI decision layer active' }
          this.systemState.components.ai = 'online'
        } else {
          results.ai = { status: 'degraded', message: 'AI offline, using fallbacks' }
          this.systemState.components.ai = 'degraded'
        }
      } catch (error) {
        results.ai = { status: 'degraded', error: error.message }
        this.systemState.components.ai = 'degraded'
      }
      
      // Initialize recovery system
      try {
        await recoverySystem.checkAndActivateRecovery()
        results.recovery = { status: 'online', message: 'Recovery system monitoring' }
        this.systemState.components.recovery = 'online'
      } catch (error) {
        results.recovery = { status: 'degraded', error: error.message }
        this.systemState.components.recovery = 'degraded'
      }
      
      // Initialize intelligence layer
      try {
        await intelligenceLayer.getLatestIntelligence()
        results.intelligence = { status: 'online', message: 'Intelligence analysis active' }
        this.systemState.components.intelligence = 'online'
      } catch (error) {
        results.intelligence = { status: 'degraded', error: error.message }
        this.systemState.components.intelligence = 'degraded'
      }
      
      this.systemState.initialized = true
      const initTime = Date.now() - startTime
      
      return {
        success: true,
        initTime,
        components: results,
        version: this.systemState.version
      }
      
    } catch (error) {
      return {
        success: false,
        error: error.message,
        partialInit: this.systemState.components
      }
    }
  }

  async performHealthCheck() {
    const health = {
      overall: 'healthy',
      components: {},
      issues: []
    }
    
    // Check database
    try {
      if (db.db) {
        health.components.database = 'healthy'
      } else {
        health.components.database = 'unhealthy'
        health.issues.push('Database not initialized')
      }
    } catch (error) {
      health.components.database = 'unhealthy'
      health.issues.push(`Database error: ${error.message}`)
    }
    
    // Determine overall health
    const unhealthyComponents = Object.values(health.components).filter(status => status === 'unhealthy')
    if (unhealthyComponents.length > 0) {
      health.overall = unhealthyComponents.length > 2 ? 'critical' : 'degraded'
    }
    
    return health
  }

  cleanup() {
    try {
      this.systemState.initialized = false
      memoryOptimizer.cleanup()
    } catch (error) {
      console.error('System cleanup failed:', error)
    }
  }
}

// Export singleton instance
export const systemController = new SystemController()
export default systemController