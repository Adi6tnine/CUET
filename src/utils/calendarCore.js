// CalendarCore - Live date awareness and automatic daily resets for AVION.EXE
import db from './database'

class CalendarCore {
  constructor() {
    this.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    this.midnightResetScheduled = false
    this.eventListeners = new Set()
    this.dailyResetManager = null // Will be set after DailyResetManager is created
  }

  // Set the daily reset manager (to avoid circular imports)
  setDailyResetManager(resetManager) {
    this.dailyResetManager = resetManager
  }

  getCurrentDate() {
    return new Date()
  }

  getTodayString() {
    return new Date().toISOString().split('T')[0]
  }

  getDayOfWeek() {
    return new Date().toLocaleDateString('en-US', { weekday: 'long' })
  }

  async getDayType(date = new Date()) {
    try {
      // Check against academic calendar
      const dateStr = date.toISOString().split('T')[0]
      const event = await this.getAcademicEvent(dateStr)
      
      if (event) {
        return event.eventType // 'exam', 'deadline', 'holiday'
      }
      
      // Check if weekend
      const dayOfWeek = date.getDay()
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        return 'weekend'
      }
      
      return 'normal'
    } catch (error) {
      console.error('Failed to get day type:', error)
      return 'normal'
    }
  }

  async getAcademicRelevance(date = new Date()) {
    try {
      const dateStr = date.toISOString().split('T')[0]
      const events = await this.getUpcomingEvents(dateStr, 7) // Next 7 days
      
      return {
        hasUpcomingExam: events.some(e => e.eventType === 'exam'),
        hasUpcomingDeadline: events.some(e => e.eventType === 'deadline'),
        daysToNextCritical: this.getDaysToNextCritical(events, dateStr),
        urgencyLevel: this.calculateUrgencyLevel(events)
      }
    } catch (error) {
      console.error('Failed to get academic relevance:', error)
      return {
        hasUpcomingExam: false,
        hasUpcomingDeadline: false,
        daysToNextCritical: null,
        urgencyLevel: 'low'
      }
    }
  }

  async getAcademicEvent(dateStr) {
    try {
      // First check the new CalendarEvents database
      const calendarEvents = await db.getCalendarEventsByDate(dateStr)
      if (calendarEvents && calendarEvents.length > 0) {
        return calendarEvents[0] // Return the first event for the date
      }
      
      // Fallback to existing timeline data from semesterData
      const { timelineData } = await import('../data/semesterData')
      return timelineData.find(event => event.date === dateStr)
    } catch (error) {
      console.error('Failed to get academic event:', error)
      return null
    }
  }

  async getUpcomingEvents(fromDate, days) {
    try {
      // First try to get events from the new CalendarEvents database
      const calendarEvents = await db.getUpcomingCalendarEvents(fromDate, days)
      if (calendarEvents && calendarEvents.length > 0) {
        return calendarEvents
      }
      
      // Fallback to existing timeline data from semesterData
      const { timelineData } = await import('../data/semesterData')
      const fromDateTime = new Date(fromDate).getTime()
      const toDateTime = fromDateTime + (days * 24 * 60 * 60 * 1000)
      
      return timelineData.filter(event => {
        const eventTime = new Date(event.date).getTime()
        return eventTime >= fromDateTime && eventTime <= toDateTime
      })
    } catch (error) {
      console.error('Failed to get upcoming events:', error)
      return []
    }
  }

  getDaysToNextCritical(events, fromDate) {
    const criticalEvents = events.filter(e => 
      e.type === 'exam' || e.type === 'dead' || e.eventType === 'exam' || e.eventType === 'deadline'
    )
    
    if (criticalEvents.length === 0) return null
    
    const fromTime = new Date(fromDate).getTime()
    const nextCritical = criticalEvents
      .map(e => ({ ...e, time: new Date(e.date).getTime() }))
      .filter(e => e.time >= fromTime)
      .sort((a, b) => a.time - b.time)[0]
    
    if (!nextCritical) return null
    
    return Math.ceil((nextCritical.time - fromTime) / (24 * 60 * 60 * 1000))
  }

  calculateUrgencyLevel(events) {
    const criticalEvents = events.filter(e => 
      e.type === 'exam' || e.type === 'dead' || e.eventType === 'exam' || e.eventType === 'deadline'
    )
    
    if (criticalEvents.length === 0) return 'low'
    
    const now = new Date().getTime()
    const urgentEvents = criticalEvents.filter(e => {
      const eventTime = new Date(e.date).getTime()
      const daysUntil = (eventTime - now) / (24 * 60 * 60 * 1000)
      return daysUntil <= 3
    })
    
    if (urgentEvents.length > 0) return 'critical'
    
    const soonEvents = criticalEvents.filter(e => {
      const eventTime = new Date(e.date).getTime()
      const daysUntil = (eventTime - now) / (24 * 60 * 60 * 1000)
      return daysUntil <= 7
    })
    
    if (soonEvents.length > 0) return 'high'
    
    return 'medium'
  }

  scheduleMidnightReset() {
    if (this.midnightResetScheduled) return

    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    
    const msUntilMidnight = tomorrow.getTime() - now.getTime()
    
    console.log(`Scheduling midnight reset in ${Math.round(msUntilMidnight / 1000 / 60)} minutes`)
    
    setTimeout(() => {
      this.performMidnightReset()
      this.scheduleMidnightReset() // Schedule next reset
    }, msUntilMidnight)
    
    this.midnightResetScheduled = true
  }

  async performMidnightReset() {
    try {
      console.log('Performing midnight reset:', this.getTodayString())
      
      // Use DailyResetManager if available, otherwise fallback to basic reset
      if (this.dailyResetManager) {
        await this.dailyResetManager.resetDailyStates()
      } else {
        await this.resetDailyStates()
      }
      
      // Update system state
      await this.updateSystemState()
      
      // Trigger UI updates
      this.broadcastDateChange()
      
      console.log('Midnight reset completed:', this.getTodayString())
    } catch (error) {
      console.error('Midnight reset failed:', error)
    }
  }

  async resetDailyStates() {
    try {
      const today = this.getTodayString()
      
      // Initialize today's daily execution record if it doesn't exist
      const existingExecution = await this.getDailyExecution(today)
      if (!existingExecution) {
        await this.initializeDailyExecution(today)
      }
      
      // Reset any cached daily data
      this.clearDailyCache()
      
      console.log('Daily states reset for:', today)
    } catch (error) {
      console.error('Failed to reset daily states:', error)
    }
  }

  async getDailyExecution(date) {
    try {
      // For now, use existing dailyTasks structure
      // Later this will use the new DailyExecution schema
      return await db.getDailyTasks(date)
    } catch (error) {
      console.error('Failed to get daily execution:', error)
      return null
    }
  }

  async initializeDailyExecution(date) {
    try {
      // Initialize basic daily execution structure
      // This will be enhanced when DailyExecution schema is implemented
      console.log('Initializing daily execution for:', date)
      
      // For now, just ensure the date is recorded
      await db.saveActivityData(date, 0)
    } catch (error) {
      console.error('Failed to initialize daily execution:', error)
    }
  }

  clearDailyCache() {
    // Clear any cached daily data
    // This will be expanded as more caching is added
    console.log('Daily cache cleared')
  }

  async updateSystemState() {
    try {
      const today = this.getTodayString()
      
      // Update last active date and other system state
      // This will be enhanced when SystemState schema is implemented
      console.log('System state updated for:', today)
    } catch (error) {
      console.error('Failed to update system state:', error)
    }
  }

  broadcastDateChange() {
    // Emit custom event for UI components to update
    const dateChangeEvent = new CustomEvent('dateChanged', {
      detail: {
        newDate: this.getTodayString(),
        dayOfWeek: this.getDayOfWeek(),
        timestamp: new Date().toISOString()
      }
    })
    
    window.dispatchEvent(dateChangeEvent)
    
    // Also notify registered listeners
    this.eventListeners.forEach(listener => {
      try {
        listener({
          newDate: this.getTodayString(),
          dayOfWeek: this.getDayOfWeek(),
          timestamp: new Date().toISOString()
        })
      } catch (error) {
        console.error('Date change listener error:', error)
      }
    })
    
    console.log('Date change broadcasted:', this.getTodayString())
  }

  isToday(dateString) {
    return dateString === this.getTodayString()
  }

  formatDateForDisplay(date) {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  // Event listener management
  addDateChangeListener(listener) {
    this.eventListeners.add(listener)
  }

  removeDateChangeListener(listener) {
    this.eventListeners.delete(listener)
  }

  // Timezone utilities
  getTimezone() {
    return this.timezone
  }

  // Date comparison utilities
  isSameDay(date1, date2) {
    const d1 = typeof date1 === 'string' ? new Date(date1) : date1
    const d2 = typeof date2 === 'string' ? new Date(date2) : date2
    
    return d1.toISOString().split('T')[0] === d2.toISOString().split('T')[0]
  }

  isWeekend(date = new Date()) {
    const dayOfWeek = date.getDay()
    return dayOfWeek === 0 || dayOfWeek === 6
  }

  // Get relative date strings
  getRelativeDateString(date) {
    const today = new Date()
    const targetDate = typeof date === 'string' ? new Date(date) : date
    
    const diffTime = targetDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays === -1) return 'Yesterday'
    if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`
    if (diffDays < -1 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`
    
    return this.formatDateForDisplay(targetDate)
  }

  // Initialize calendar with existing timeline data
  async initializeCalendarEvents() {
    try {
      // Check if calendar events are already initialized
      const existingEvents = await db.getAllCalendarEvents()
      if (existingEvents && existingEvents.length > 0) {
        console.log('Calendar events already initialized')
        return
      }

      // Import existing timeline data
      const { timelineData } = await import('../data/semesterData')
      
      // Convert timeline data to calendar events format
      const calendarEvents = timelineData.map(event => ({
        id: `timeline-${event.date}-${event.event.replace(/\s+/g, '-').toLowerCase()}`,
        date: event.date,
        eventType: this.mapTimelineTypeToEventType(event.type),
        title: event.event,
        priority: this.mapTimelineToPriority(event.type),
        academicRelevance: {
          subjectId: this.extractSubjectFromEvent(event.event),
          impactLevel: this.calculateImpactLevel(event.type),
          preparationDays: this.calculatePreparationDays(event.type)
        },
        description: `Academic event: ${event.event}`,
        source: 'timeline-import'
      }))

      // Import events to database
      await db.importCalendarEvents(calendarEvents)
      console.log(`Initialized ${calendarEvents.length} calendar events from timeline data`)
      
    } catch (error) {
      console.error('Failed to initialize calendar events:', error)
    }
  }

  mapTimelineTypeToEventType(timelineType) {
    const typeMap = {
      'exam': 'exam',
      'dead': 'deadline',
      'party': 'break',
      'event': 'break',
      'info': 'normal'
    }
    return typeMap[timelineType] || 'normal'
  }

  mapTimelineToPriority(timelineType) {
    const priorityMap = {
      'exam': 'critical',
      'dead': 'high',
      'party': 'low',
      'event': 'medium',
      'info': 'low'
    }
    return priorityMap[timelineType] || 'medium'
  }

  extractSubjectFromEvent(eventTitle) {
    // Simple extraction logic - can be enhanced
    if (eventTitle.includes('MST')) return 'multiple'
    if (eventTitle.includes('Practical')) return 'practical'
    if (eventTitle.includes('PROJECT')) return 'project'
    return 'general'
  }

  calculateImpactLevel(timelineType) {
    const impactMap = {
      'exam': 10,
      'dead': 8,
      'party': 2,
      'event': 5,
      'info': 3
    }
    return impactMap[timelineType] || 5
  }

  calculatePreparationDays(timelineType) {
    const prepMap = {
      'exam': 14,
      'dead': 7,
      'party': 1,
      'event': 3,
      'info': 0
    }
    return prepMap[timelineType] || 3
  }
}

// Create and export singleton instance
const calendarCore = new CalendarCore()

// Auto-start midnight reset scheduling and initialize calendar events
calendarCore.scheduleMidnightReset()

// Initialize calendar events when database is ready
db.init().then(() => {
  calendarCore.initializeCalendarEvents()
}).catch(error => {
  console.error('Failed to initialize calendar system:', error)
})

export default calendarCore