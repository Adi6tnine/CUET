// IndexedDB Database for Adarsh's Command Center
class CommandCenterDB {
  constructor() {
    this.dbName = 'AdarshCommandCenter'
    this.version = 4 // Upgraded for Phase 2: Enhanced Data Schemas
    this.db = null
    this.syncManager = null // Will be set after sync manager is initialized
  }

  // Set sync manager reference (called from sync manager)
  setSyncManager(syncManager) {
    this.syncManager = syncManager
  }

  async init() {
    return new Promise((resolve, reject) => {
      // Check if IndexedDB is available
      if (!window.indexedDB) {
        console.error('IndexedDB not supported')
        reject(new Error('IndexedDB not supported in this browser'))
        return
      }

      const request = indexedDB.open(this.dbName, this.version)
      
      request.onerror = () => {
        console.error('Database initialization failed:', request.error)
        reject(request.error)
      }
      
      request.onsuccess = () => {
        this.db = request.result
        
        // Handle database errors after initialization
        this.db.onerror = (event) => {
          console.error('Database error:', event.target.error)
        }
        
        // Handle unexpected database closure
        this.db.onclose = () => {
          console.warn('Database connection closed unexpectedly')
        }
        
        resolve(this.db)
      }
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result
        
        // Existing stores (keep as-is)
        if (!db.objectStoreNames.contains('syllabusProgress')) {
          const syllabusStore = db.createObjectStore('syllabusProgress', { keyPath: 'id' })
          syllabusStore.createIndex('subjectId', 'subjectId', { unique: false })
          syllabusStore.createIndex('completed', 'completed', { unique: false })
        }
        
        if (!db.objectStoreNames.contains('dailyTasks')) {
          const tasksStore = db.createObjectStore('dailyTasks', { keyPath: 'id' })
          tasksStore.createIndex('date', 'date', { unique: false })
          tasksStore.createIndex('completed', 'completed', { unique: false })
        }
        
        if (!db.objectStoreNames.contains('timelineEvents')) {
          const timelineStore = db.createObjectStore('timelineEvents', { keyPath: 'id' })
          timelineStore.createIndex('date', 'date', { unique: false })
          timelineStore.createIndex('type', 'type', { unique: false })
        }
        
        if (!db.objectStoreNames.contains('activityData')) {
          const activityStore = db.createObjectStore('activityData', { keyPath: 'date' })
          activityStore.createIndex('intensity', 'intensity', { unique: false })
        }
        
        if (!db.objectStoreNames.contains('projectProgress')) {
          const projectStore = db.createObjectStore('projectProgress', { keyPath: 'id' })
          projectStore.createIndex('name', 'name', { unique: false })
        }
        
        if (!db.objectStoreNames.contains('studySessions')) {
          const studyStore = db.createObjectStore('studySessions', { keyPath: 'id' })
          studyStore.createIndex('date', 'date', { unique: false })
          studyStore.createIndex('subject', 'subject', { unique: false })
        }
        
        if (!db.objectStoreNames.contains('notes')) {
          const notesStore = db.createObjectStore('notes', { keyPath: 'id' })
          notesStore.createIndex('subject', 'subject', { unique: false })
          notesStore.createIndex('createdAt', 'createdAt', { unique: false })
        }

        // NEW STORES FOR SKILL WAR ROOM & ROUTINE ENFORCEMENT
        if (!db.objectStoreNames.contains('skillProgress')) {
          const skillStore = db.createObjectStore('skillProgress', { keyPath: 'id' })
          skillStore.createIndex('trackId', 'trackId', { unique: false })
          skillStore.createIndex('weekNumber', 'weekNumber', { unique: false })
          skillStore.createIndex('completed', 'completed', { unique: false })
          skillStore.createIndex('date', 'date', { unique: false })
        }

        if (!db.objectStoreNames.contains('dailyRoutines')) {
          const routineStore = db.createObjectStore('dailyRoutines', { keyPath: 'date' })
          routineStore.createIndex('completionStatus', 'completionStatus', { unique: false })
          routineStore.createIndex('momentumScore', 'momentumScore', { unique: false })
          routineStore.createIndex('streakMaintained', 'streakMaintained', { unique: false })
        }

        if (!db.objectStoreNames.contains('weeklyAnalysis')) {
          const weeklyStore = db.createObjectStore('weeklyAnalysis', { keyPath: 'weekId' })
          weeklyStore.createIndex('performanceScore', 'performanceScore', { unique: false })
          weeklyStore.createIndex('createdAt', 'createdAt', { unique: false })
        }

        if (!db.objectStoreNames.contains('skillSyllabus')) {
          const syllabusStore = db.createObjectStore('skillSyllabus', { keyPath: 'id' })
          syllabusStore.createIndex('trackId', 'trackId', { unique: false })
          syllabusStore.createIndex('weekNumber', 'weekNumber', { unique: false })
          syllabusStore.createIndex('isGenerated', 'isGenerated', { unique: false })
        }

        if (!db.objectStoreNames.contains('timeTracking')) {
          const timeStore = db.createObjectStore('timeTracking', { keyPath: 'id' })
          timeStore.createIndex('date', 'date', { unique: false })
          timeStore.createIndex('activity', 'activity', { unique: false })
          timeStore.createIndex('trackId', 'trackId', { unique: false })
        }

        if (!db.objectStoreNames.contains('consistencyMetrics')) {
          const consistencyStore = db.createObjectStore('consistencyMetrics', { keyPath: 'date' })
          consistencyStore.createIndex('streakCount', 'streakCount', { unique: false })
          consistencyStore.createIndex('momentumScore', 'momentumScore', { unique: false })
        }

        // NEW STORES FOR AVION INTELLIGENCE UPGRADE
        if (!db.objectStoreNames.contains('calendarEvents')) {
          const calendarStore = db.createObjectStore('calendarEvents', { keyPath: 'id' })
          calendarStore.createIndex('date', 'date', { unique: false })
          calendarStore.createIndex('eventType', 'eventType', { unique: false })
          calendarStore.createIndex('priority', 'priority', { unique: false })
          calendarStore.createIndex('subjectId', 'subjectId', { unique: false })
        }

        // PHASE 2: ENHANCED DATA SCHEMAS FOR AI INTELLIGENCE
        if (!db.objectStoreNames.contains('dailyExecution')) {
          const executionStore = db.createObjectStore('dailyExecution', { keyPath: 'date' })
          executionStore.createIndex('criticalBlocksCompleted', 'criticalBlocksCompleted', { unique: false })
          executionStore.createIndex('emergencyModeUsed', 'emergencyModeUsed', { unique: false })
          executionStore.createIndex('streakStatus', 'streakStatus', { unique: false })
          executionStore.createIndex('executionScore', 'executionScore', { unique: false })
        }

        if (!db.objectStoreNames.contains('aiDecisions')) {
          const aiStore = db.createObjectStore('aiDecisions', { keyPath: 'id' })
          aiStore.createIndex('date', 'date', { unique: false })
          aiStore.createIndex('decisionType', 'decisionType', { unique: false })
          aiStore.createIndex('confidenceScore', 'confidenceScore', { unique: false })
          aiStore.createIndex('executionTime', 'executionTime', { unique: false })
        }

        if (!db.objectStoreNames.contains('systemState')) {
          const systemStore = db.createObjectStore('systemState', { keyPath: 'id' })
          systemStore.createIndex('lastUpdated', 'lastUpdated', { unique: false })
        }

        // Enhanced SkillProgress (extend existing with AI fields)
        if (db.objectStoreNames.contains('skillProgress')) {
          // Note: In a real migration, we'd need to handle existing data
          // For now, we'll add the new indexes to the existing store
          const skillStore = event.target.transaction.objectStore('skillProgress')
          if (!skillStore.indexNames.contains('difficultyLevel')) {
            skillStore.createIndex('difficultyLevel', 'difficultyLevel', { unique: false })
          }
          if (!skillStore.indexNames.contains('confidenceRating')) {
            skillStore.createIndex('confidenceRating', 'confidenceRating', { unique: false })
          }
          if (!skillStore.indexNames.contains('aiGenerated')) {
            skillStore.createIndex('aiGenerated', 'aiGenerated', { unique: false })
          }
        }
      }
    })
  }

  // EXISTING METHODS (Academic System)
  async saveSyllabusProgress(subjectId, unitIndex, topicIndex, completed) {
    const transaction = this.db.transaction(['syllabusProgress'], 'readwrite')
    const store = transaction.objectStore('syllabusProgress')
    
    const id = `${subjectId}-${unitIndex}-${topicIndex}`
    const data = {
      id,
      subjectId,
      unitIndex,
      topicIndex,
      completed,
      timestamp: new Date().toISOString(),
      // Add sync metadata
      syncMeta: {
        lastModified: new Date().toISOString(),
        syncStatus: 'pending',
        version: 1,
        deviceId: this.syncManager?.deviceId || 'unknown'
      }
    }
    
    const result = await store.put(data)
    
    // Queue for sync if sync manager is available
    if (this.syncManager) {
      await this.syncManager.queueSync('update', 'syllabusProgress', id, data)
    }
    
    return result
  }

  async getSyllabusProgress(subjectId) {
    const transaction = this.db.transaction(['syllabusProgress'], 'readonly')
    const store = transaction.objectStore('syllabusProgress')
    const index = store.index('subjectId')
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(subjectId)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async saveDailyTask(taskId, completed, date = new Date().toISOString().split('T')[0]) {
    const transaction = this.db.transaction(['dailyTasks'], 'readwrite')
    const store = transaction.objectStore('dailyTasks')
    
    const id = `${date}-${taskId}`
    const data = {
      id,
      taskId,
      date,
      completed,
      timestamp: new Date().toISOString(),
      // Add sync metadata
      syncMeta: {
        lastModified: new Date().toISOString(),
        syncStatus: 'pending',
        version: 1,
        deviceId: this.syncManager?.deviceId || 'unknown'
      }
    }
    
    const result = await store.put(data)
    
    // Queue for sync if sync manager is available
    if (this.syncManager) {
      await this.syncManager.queueSync('update', 'dailyTasks', id, data)
    }
    
    return result
  }

  async getDailyTasks(date = new Date().toISOString().split('T')[0]) {
    const transaction = this.db.transaction(['dailyTasks'], 'readonly')
    const store = transaction.objectStore('dailyTasks')
    const index = store.index('date')
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(date)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async saveActivityData(date, intensity) {
    const transaction = this.db.transaction(['activityData'], 'readwrite')
    const store = transaction.objectStore('activityData')
    
    const data = {
      date,
      intensity,
      timestamp: new Date().toISOString()
    }
    
    return store.put(data)
  }

  async getActivityData(days = 30) {
    const transaction = this.db.transaction(['activityData'], 'readonly')
    const store = transaction.objectStore('activityData')
    
    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => {
        const allData = request.result
        const cutoffDate = new Date()
        cutoffDate.setDate(cutoffDate.getDate() - days)
        
        const recentData = allData.filter(item => 
          new Date(item.date) >= cutoffDate
        )
        resolve(recentData)
      }
      request.onerror = () => reject(request.error)
    })
  }

  async saveProjectProgress(projectId, progress, name) {
    const transaction = this.db.transaction(['projectProgress'], 'readwrite')
    const store = transaction.objectStore('projectProgress')
    
    const data = {
      id: projectId,
      name,
      progress,
      lastUpdated: new Date().toISOString()
    }
    
    return store.put(data)
  }

  async getProjectProgress(projectId) {
    const transaction = this.db.transaction(['projectProgress'], 'readonly')
    const store = transaction.objectStore('projectProgress')
    
    return new Promise((resolve, reject) => {
      const request = store.get(projectId)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // NEW METHODS FOR SKILL WAR ROOM & ROUTINE ENFORCEMENT

  async updateSkillProgress(trackId, weekNumber, taskId, completed, timeSpent = 0) {
    const transaction = this.db.transaction(['skillProgress'], 'readwrite')
    const store = transaction.objectStore('skillProgress')
    
    const id = `${trackId}-${weekNumber}-${taskId}`
    const data = {
      id,
      trackId,
      weekNumber,
      taskId,
      completed,
      timeSpent,
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString()
    }
    
    return store.put(data)
  }

  async getSkillProgress(trackId, weekNumber = null) {
    const transaction = this.db.transaction(['skillProgress'], 'readonly')
    const store = transaction.objectStore('skillProgress')
    const index = store.index('trackId')
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(trackId)
      request.onsuccess = () => {
        let results = request.result
        if (weekNumber !== null) {
          results = results.filter(item => item.weekNumber === weekNumber)
        }
        resolve(results)
      }
      request.onerror = () => reject(request.error)
    })
  }

  async saveDailyRoutine(date, blocks, completionStatus, momentumScore, streakMaintained) {
    const transaction = this.db.transaction(['dailyRoutines'], 'readwrite')
    const store = transaction.objectStore('dailyRoutines')
    
    const data = {
      date,
      blocks,
      completionStatus,
      momentumScore,
      streakMaintained,
      timestamp: new Date().toISOString()
    }
    
    return store.put(data)
  }

  async getDailyRoutine(date = new Date().toISOString().split('T')[0]) {
    const transaction = this.db.transaction(['dailyRoutines'], 'readonly')
    const store = transaction.objectStore('dailyRoutines')
    
    return new Promise((resolve, reject) => {
      const request = store.get(date)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async getRoutineHistory(days = 30) {
    const transaction = this.db.transaction(['dailyRoutines'], 'readonly')
    const store = transaction.objectStore('dailyRoutines')
    
    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => {
        const allData = request.result
        const cutoffDate = new Date()
        cutoffDate.setDate(cutoffDate.getDate() - days)
        
        const recentData = allData.filter(item => 
          new Date(item.date) >= cutoffDate
        ).sort((a, b) => new Date(b.date) - new Date(a.date))
        
        resolve(recentData)
      }
      request.onerror = () => reject(request.error)
    })
  }

  async saveWeeklyAnalysis(weekId, performanceScore, skillBreakdown, recommendations) {
    const transaction = this.db.transaction(['weeklyAnalysis'], 'readwrite')
    const store = transaction.objectStore('weeklyAnalysis')
    
    const data = {
      weekId,
      performanceScore,
      skillBreakdown,
      recommendations,
      createdAt: new Date().toISOString()
    }
    
    return store.put(data)
  }

  async getWeeklyAnalysis(weekId) {
    const transaction = this.db.transaction(['weeklyAnalysis'], 'readonly')
    const store = transaction.objectStore('weeklyAnalysis')
    
    return new Promise((resolve, reject) => {
      const request = store.get(weekId)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async saveSkillSyllabus(trackId, weekNumber, syllabus, isGenerated = false) {
    const transaction = this.db.transaction(['skillSyllabus'], 'readwrite')
    const store = transaction.objectStore('skillSyllabus')
    
    const id = `${trackId}-week-${weekNumber}`
    const data = {
      id,
      trackId,
      weekNumber,
      syllabus,
      isGenerated,
      createdAt: new Date().toISOString()
    }
    
    return store.put(data)
  }

  async getSkillSyllabus(trackId, weekNumber) {
    const transaction = this.db.transaction(['skillSyllabus'], 'readonly')
    const store = transaction.objectStore('skillSyllabus')
    
    const id = `${trackId}-week-${weekNumber}`
    return new Promise((resolve, reject) => {
      const request = store.get(id)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async trackTime(activity, trackId, timeSpent, date = new Date().toISOString().split('T')[0]) {
    const transaction = this.db.transaction(['timeTracking'], 'readwrite')
    const store = transaction.objectStore('timeTracking')
    
    const id = `${date}-${activity}-${trackId}-${Date.now()}`
    const data = {
      id,
      date,
      activity,
      trackId,
      timeSpent,
      timestamp: new Date().toISOString()
    }
    
    return store.put(data)
  }

  async getTimeTracking(date = new Date().toISOString().split('T')[0], trackId = null) {
    const transaction = this.db.transaction(['timeTracking'], 'readonly')
    const store = transaction.objectStore('timeTracking')
    const index = store.index('date')
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(date)
      request.onsuccess = () => {
        let results = request.result
        if (trackId) {
          results = results.filter(item => item.trackId === trackId)
        }
        resolve(results)
      }
      request.onerror = () => reject(request.error)
    })
  }

  async saveConsistencyMetrics(date, streakCount, momentumScore, details) {
    const transaction = this.db.transaction(['consistencyMetrics'], 'readwrite')
    const store = transaction.objectStore('consistencyMetrics')
    
    const data = {
      date,
      streakCount,
      momentumScore,
      details,
      timestamp: new Date().toISOString()
    }
    
    return store.put(data)
  }

  async getConsistencyMetrics(days = 30) {
    const transaction = this.db.transaction(['consistencyMetrics'], 'readonly')
    const store = transaction.objectStore('consistencyMetrics')
    
    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => {
        const allData = request.result
        const cutoffDate = new Date()
        cutoffDate.setDate(cutoffDate.getDate() - days)
        
        const recentData = allData.filter(item => 
          new Date(item.date) >= cutoffDate
        ).sort((a, b) => new Date(b.date) - new Date(a.date))
        
        resolve(recentData)
      }
      request.onerror = () => reject(request.error)
    })
  }

  async updateDailyTask(taskId, completed, date = new Date().toISOString().split('T')[0]) {
    return this.saveDailyTask(taskId, completed, date)
  }

  async updateActivity(date, intensity) {
    return this.saveActivityData(date, intensity)
  }

  async getActivityRange(startDate, endDate) {
    const transaction = this.db.transaction(['activityData'], 'readonly')
    const store = transaction.objectStore('activityData')
    
    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => {
        const allData = request.result
        const startTime = startDate.getTime()
        const endTime = endDate.getTime()
        
        const rangeData = allData.filter(item => {
          const itemTime = new Date(item.date).getTime()
          return itemTime >= startTime && itemTime <= endTime
        })
        resolve(rangeData)
      }
      request.onerror = () => reject(request.error)
    })
  }

  // UTILITY METHODS
  async clearAllData() {
    const storeNames = [
      'syllabusProgress', 'dailyTasks', 'timelineEvents', 'activityData',
      'projectProgress', 'studySessions', 'notes', 'skillProgress',
      'dailyRoutines', 'weeklyAnalysis', 'skillSyllabus', 'timeTracking',
      'consistencyMetrics', 'calendarEvents', 'dailyExecution', 'aiDecisions', 'systemState'
    ]
    
    const transaction = this.db.transaction(storeNames, 'readwrite')
    
    const promises = storeNames.map(storeName => {
      const store = transaction.objectStore(storeName)
      return store.clear()
    })
    
    return Promise.all(promises)
  }

  async exportData() {
    const storeNames = [
      'syllabusProgress', 'dailyTasks', 'timelineEvents', 'activityData',
      'projectProgress', 'studySessions', 'notes', 'skillProgress',
      'dailyRoutines', 'weeklyAnalysis', 'skillSyllabus', 'timeTracking',
      'consistencyMetrics', 'calendarEvents', 'dailyExecution', 'aiDecisions', 'systemState'
    ]
    
    const transaction = this.db.transaction(storeNames, 'readonly')
    const exportData = {}
    
    const promises = storeNames.map(storeName => {
      const store = transaction.objectStore(storeName)
      return new Promise((resolve, reject) => {
        const request = store.getAll()
        request.onsuccess = () => {
          exportData[storeName] = request.result
          resolve()
        }
        request.onerror = () => reject(request.error)
      })
    })
    
    await Promise.all(promises)
    return exportData
  }

  // CALENDAR EVENTS METHODS (AVION Intelligence Upgrade)
  async saveCalendarEvent(eventData) {
    const transaction = this.db.transaction(['calendarEvents'], 'readwrite')
    const store = transaction.objectStore('calendarEvents')
    
    const data = {
      id: eventData.id || `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      date: eventData.date,
      eventType: eventData.eventType, // 'exam', 'deadline', 'holiday', 'break'
      title: eventData.title,
      priority: eventData.priority || 'medium', // 'critical', 'high', 'medium', 'low'
      academicRelevance: eventData.academicRelevance || {},
      description: eventData.description || '',
      timestamp: new Date().toISOString(),
      ...eventData
    }
    
    return store.put(data)
  }

  async getCalendarEvent(eventId) {
    const transaction = this.db.transaction(['calendarEvents'], 'readonly')
    const store = transaction.objectStore('calendarEvents')
    
    return new Promise((resolve, reject) => {
      const request = store.get(eventId)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async getCalendarEventsByDate(date) {
    const transaction = this.db.transaction(['calendarEvents'], 'readonly')
    const store = transaction.objectStore('calendarEvents')
    const index = store.index('date')
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(date)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async getCalendarEventsByType(eventType) {
    const transaction = this.db.transaction(['calendarEvents'], 'readonly')
    const store = transaction.objectStore('calendarEvents')
    const index = store.index('eventType')
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(eventType)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async getUpcomingCalendarEvents(fromDate, days = 30) {
    const transaction = this.db.transaction(['calendarEvents'], 'readonly')
    const store = transaction.objectStore('calendarEvents')
    
    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => {
        const allEvents = request.result
        const fromTime = new Date(fromDate).getTime()
        const toTime = fromTime + (days * 24 * 60 * 60 * 1000)
        
        const upcomingEvents = allEvents.filter(event => {
          const eventTime = new Date(event.date).getTime()
          return eventTime >= fromTime && eventTime <= toTime
        }).sort((a, b) => new Date(a.date) - new Date(b.date))
        
        resolve(upcomingEvents)
      }
      request.onerror = () => reject(request.error)
    })
  }

  async updateCalendarEvent(eventId, updates) {
    const transaction = this.db.transaction(['calendarEvents'], 'readwrite')
    const store = transaction.objectStore('calendarEvents')
    
    return new Promise((resolve, reject) => {
      const getRequest = store.get(eventId)
      getRequest.onsuccess = () => {
        const existingEvent = getRequest.result
        if (!existingEvent) {
          reject(new Error('Calendar event not found'))
          return
        }
        
        const updatedEvent = {
          ...existingEvent,
          ...updates,
          id: eventId, // Ensure ID doesn't change
          lastModified: new Date().toISOString()
        }
        
        const putRequest = store.put(updatedEvent)
        putRequest.onsuccess = () => resolve(updatedEvent)
        putRequest.onerror = () => reject(putRequest.error)
      }
      getRequest.onerror = () => reject(getRequest.error)
    })
  }

  async deleteCalendarEvent(eventId) {
    const transaction = this.db.transaction(['calendarEvents'], 'readwrite')
    const store = transaction.objectStore('calendarEvents')
    
    return new Promise((resolve, reject) => {
      const request = store.delete(eventId)
      request.onsuccess = () => resolve(true)
      request.onerror = () => reject(request.error)
    })
  }

  async getAllCalendarEvents() {
    const transaction = this.db.transaction(['calendarEvents'], 'readonly')
    const store = transaction.objectStore('calendarEvents')
    
    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // Bulk import calendar events (for initial setup)
  async importCalendarEvents(events) {
    const transaction = this.db.transaction(['calendarEvents'], 'readwrite')
    const store = transaction.objectStore('calendarEvents')
    
    const promises = events.map(event => {
      const eventData = {
        ...event,
        id: event.id || `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString()
      }
      return store.put(eventData)
    })
    
    return Promise.all(promises)
  }

  // PHASE 2: ENHANCED DATA SCHEMAS METHODS

  // DailyExecution Schema Methods
  async saveDailyExecution(date, executionData) {
    const transaction = this.db.transaction(['dailyExecution'], 'readwrite')
    const store = transaction.objectStore('dailyExecution')
    
    const data = {
      date,
      criticalBlocksCompleted: executionData.criticalBlocksCompleted || 0,
      timeSpent: executionData.timeSpent || 0,
      emergencyModeUsed: executionData.emergencyModeUsed || false,
      streakStatus: executionData.streakStatus || 'maintained', // 'maintained', 'broken', 'started'
      executionScore: executionData.executionScore || 0,
      blocksCompleted: executionData.blocksCompleted || [],
      skillTasksCompleted: executionData.skillTasksCompleted || 0,
      academicTasksCompleted: executionData.academicTasksCompleted || 0,
      timestamp: new Date().toISOString()
    }
    
    return store.put(data)
  }

  async getDailyExecution(date) {
    const transaction = this.db.transaction(['dailyExecution'], 'readonly')
    const store = transaction.objectStore('dailyExecution')
    
    return new Promise((resolve, reject) => {
      const request = store.get(date)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async getExecutionHistory(days = 30) {
    const transaction = this.db.transaction(['dailyExecution'], 'readonly')
    const store = transaction.objectStore('dailyExecution')
    
    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => {
        const allData = request.result
        const cutoffDate = new Date()
        cutoffDate.setDate(cutoffDate.getDate() - days)
        
        const recentData = allData.filter(item => 
          new Date(item.date) >= cutoffDate
        ).sort((a, b) => new Date(b.date) - new Date(a.date))
        
        resolve(recentData)
      }
      request.onerror = () => reject(request.error)
    })
  }

  // Enhanced SkillProgress Methods (with AI fields)
  async saveEnhancedSkillProgress(trackId, weekNumber, taskId, progressData) {
    const transaction = this.db.transaction(['skillProgress'], 'readwrite')
    const store = transaction.objectStore('skillProgress')
    
    const id = `${trackId}-${weekNumber}-${taskId}`
    const data = {
      id,
      trackId,
      weekNumber,
      taskId,
      completed: progressData.completed || false,
      timeSpent: progressData.timeSpent || 0,
      difficultyLevel: progressData.difficultyLevel || 1, // 1-5 scale
      confidenceRating: progressData.confidenceRating || 1, // 1-5 scale
      aiGenerated: progressData.aiGenerated || false,
      adaptationCount: progressData.adaptationCount || 0,
      lastAdaptation: progressData.lastAdaptation || null,
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString()
    }
    
    return store.put(data)
  }

  async getEnhancedSkillProgress(trackId, weekNumber = null) {
    const transaction = this.db.transaction(['skillProgress'], 'readonly')
    const store = transaction.objectStore('skillProgress')
    const index = store.index('trackId')
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(trackId)
      request.onsuccess = () => {
        let results = request.result
        if (weekNumber !== null) {
          results = results.filter(item => item.weekNumber === weekNumber)
        }
        resolve(results)
      }
      request.onerror = () => reject(request.error)
    })
  }

  // AI Decisions Schema Methods
  async logAIDecision(decisionType, inputSnapshot, outputResult, confidenceScore) {
    const transaction = this.db.transaction(['aiDecisions'], 'readwrite')
    const store = transaction.objectStore('aiDecisions')
    
    const id = `${decisionType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const data = {
      id,
      date: new Date().toISOString().split('T')[0],
      decisionType, // 'daily_objective', 'weekly_analysis', 'skill_syllabus', 'recovery_mode', 'placement_readiness'
      inputSnapshot: JSON.stringify(inputSnapshot),
      outputResult: JSON.stringify(outputResult),
      confidenceScore: confidenceScore || 0.5, // 0-1 scale
      executionTime: Date.now(),
      timestamp: new Date().toISOString()
    }
    
    return store.put(data)
  }

  async getAIDecisions(decisionType = null, days = 30) {
    const transaction = this.db.transaction(['aiDecisions'], 'readonly')
    const store = transaction.objectStore('aiDecisions')
    
    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => {
        let results = request.result
        
        // Filter by decision type if specified
        if (decisionType) {
          results = results.filter(item => item.decisionType === decisionType)
        }
        
        // Filter by date range
        const cutoffDate = new Date()
        cutoffDate.setDate(cutoffDate.getDate() - days)
        results = results.filter(item => 
          new Date(item.date) >= cutoffDate
        )
        
        // Sort by most recent first
        results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        
        resolve(results)
      }
      request.onerror = () => reject(request.error)
    })
  }

  async getLatestAIDecision(decisionType) {
    const decisions = await this.getAIDecisions(decisionType, 7) // Last 7 days
    return decisions.length > 0 ? decisions[0] : null
  }

  // SystemState Schema Methods
  async saveSystemState(stateData) {
    const transaction = this.db.transaction(['systemState'], 'readwrite')
    const store = transaction.objectStore('systemState')
    
    const data = {
      id: 'current', // Singleton record
      currentStreak: stateData.currentStreak || 0,
      momentumScore: stateData.momentumScore || 0,
      recoveryMode: stateData.recoveryMode || false,
      lastActiveDate: stateData.lastActiveDate || new Date().toISOString().split('T')[0],
      totalExecutionDays: stateData.totalExecutionDays || 0,
      longestStreak: stateData.longestStreak || 0,
      systemVersion: stateData.systemVersion || '2.0',
      lastUpdated: new Date().toISOString()
    }
    
    return store.put(data)
  }

  async getSystemState() {
    const transaction = this.db.transaction(['systemState'], 'readonly')
    const store = transaction.objectStore('systemState')
    
    return new Promise((resolve, reject) => {
      const request = store.get('current')
      request.onsuccess = () => {
        const result = request.result
        if (!result) {
          // Initialize default system state
          const defaultState = {
            id: 'current',
            currentStreak: 0,
            momentumScore: 0,
            recoveryMode: false,
            lastActiveDate: new Date().toISOString().split('T')[0],
            totalExecutionDays: 0,
            longestStreak: 0,
            systemVersion: '2.0',
            lastUpdated: new Date().toISOString()
          }
          resolve(defaultState)
        } else {
          resolve(result)
        }
      }
      request.onerror = () => reject(request.error)
    })
  }

  async updateSystemState(updates) {
    const currentState = await this.getSystemState()
    const updatedState = {
      ...currentState,
      ...updates,
      lastUpdated: new Date().toISOString()
    }
    return this.saveSystemState(updatedState)
  }

  // Migration and Utility Methods
  async migrateToEnhancedSchemas() {
    try {
      console.log('Starting migration to enhanced schemas...')
      
      // Initialize system state if it doesn't exist
      const systemState = await this.getSystemState()
      if (!systemState.id) {
        await this.saveSystemState({
          currentStreak: 0,
          momentumScore: 0,
          recoveryMode: false,
          lastActiveDate: new Date().toISOString().split('T')[0],
          totalExecutionDays: 0,
          longestStreak: 0,
          systemVersion: '2.0'
        })
      }
      
      // Migrate existing daily routines to daily execution format
      const routineHistory = await this.getRoutineHistory(90) // Last 90 days
      for (const routine of routineHistory) {
        const existingExecution = await this.getDailyExecution(routine.date)
        if (!existingExecution) {
          const executionData = {
            criticalBlocksCompleted: Object.values(routine.blocks || {}).filter(b => b?.completed).length,
            timeSpent: 0, // Will be populated from time tracking
            emergencyModeUsed: routine.emergencyMode || false,
            streakStatus: routine.streakMaintained ? 'maintained' : 'broken',
            executionScore: routine.momentumScore || 0,
            blocksCompleted: Object.keys(routine.blocks || {}).filter(blockId => routine.blocks[blockId]?.completed),
            skillTasksCompleted: 0,
            academicTasksCompleted: 0
          }
          await this.saveDailyExecution(routine.date, executionData)
        }
      }
      
      console.log('Migration to enhanced schemas completed successfully')
      return true
    } catch (error) {
      console.error('Migration failed:', error)
      return false
    }
  }

  async validateDataIntegrity() {
    try {
      const issues = []
      
      // Check system state exists
      const systemState = await this.getSystemState()
      if (!systemState.id) {
        issues.push('System state not initialized')
      }
      
      // Check for orphaned records
      const executionHistory = await this.getExecutionHistory(30)
      const routineHistory = await this.getRoutineHistory(30)
      
      if (executionHistory.length === 0 && routineHistory.length > 0) {
        issues.push('Daily execution records missing for existing routines')
      }
      
      return {
        isValid: issues.length === 0,
        issues
      }
    } catch (error) {
      return {
        isValid: false,
        issues: [`Data integrity check failed: ${error.message}`]
      }
    }
  }

  // Storage quota monitoring
  async checkStorageQuota() {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate()
        const usagePercentage = (estimate.usage / estimate.quota) * 100
        
        return {
          usage: estimate.usage,
          quota: estimate.quota,
          usagePercentage: Math.round(usagePercentage * 100) / 100,
          available: estimate.quota - estimate.usage
        }
      }
      return null
    } catch (error) {
      console.error('Storage quota check failed:', error)
      return null
    }
  }

  // Check if running in incognito mode
  isIncognitoMode() {
    try {
      // Test localStorage availability
      localStorage.setItem('test', 'test')
      localStorage.removeItem('test')
      return false
    } catch (e) {
      return true
    }
  }
}

// Create and export singleton instance
const db = new CommandCenterDB()

export default db