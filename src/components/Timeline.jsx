import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar,
  Clock,
  Plus,
  Edit3,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Star,
  BookOpen,
  Code,
  Trophy,
  Coffee,
  Target,
  Zap
} from 'lucide-react'
import { timelineData } from '../data/semesterData'
import db from '../utils/database'
import { calendarCore } from '../utils/calendarSystem'

const Timeline = () => {
  const [events, setEvents] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [filter, setFilter] = useState('all')
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    type: 'info',
    description: '',
    priority: 'medium'
  })
  
  // Date awareness state
  const [currentDate, setCurrentDate] = useState(calendarCore.getTodayString())
  const [todayEvents, setTodayEvents] = useState([])

  // Initialize date awareness
  useEffect(() => {
    const initializeDateAwareness = async () => {
      try {
        setCurrentDate(calendarCore.getTodayString())
        
        // Get today's events - avoid duplicates by checking timeline first
        const todayStr = calendarCore.getTodayString()
        
        // First check timeline data for today's events
        const timelineTodayEvents = timelineData
          .filter(event => calendarCore.isToday(event.date))
          .map(event => ({
            id: `timeline-today-${event.date}`,
            title: event.event,
            eventType: event.type,
            description: `Academic event: ${event.event}`,
            priority: event.type === 'exam' ? 'critical' : event.type === 'dead' ? 'high' : 'medium'
          }))
        
        // Then check calendar events for today (only if no timeline events)
        let calendarTodayEvents = []
        if (timelineTodayEvents.length === 0) {
          calendarTodayEvents = await db.getCalendarEventsByDate?.(todayStr) || []
        }
        
        const todaysEvents = timelineTodayEvents.length > 0 ? timelineTodayEvents : calendarTodayEvents
        setTodayEvents(todaysEvents)
      } catch (error) {
        console.error('Failed to initialize date awareness:', error)
      }
    }

    initializeDateAwareness()

    // Listen for date changes
    const handleDateChange = (event) => {
      const { newDate } = event.detail
      setCurrentDate(newDate)
      initializeDateAwareness()
      loadEvents() // Reload events for new date
    }

    window.addEventListener('dateChanged', handleDateChange)
    
    return () => {
      window.removeEventListener('dateChanged', handleDateChange)
    }
  }, [])

  // Load events from database and merge with default timeline
  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      // Always start with timeline data as the base
      const defaultEvents = timelineData.map((event, index) => ({
        id: `timeline_${index}`,
        title: event.event,
        date: event.date,
        type: event.type,
        description: `Academic event: ${event.event}`,
        priority: event.type === 'exam' || event.type === 'dead' ? 'high' : 'medium',
        source: 'timeline'
      }))
      
      // Try to get additional calendar events from database
      let additionalEvents = []
      try {
        const calendarEvents = await db.getAllCalendarEvents?.() || []
        
        // Only add calendar events that don't duplicate timeline events
        additionalEvents = calendarEvents
          .filter(calEvent => {
            // Check if this calendar event duplicates a timeline event
            return !defaultEvents.some(timelineEvent => 
              timelineEvent.date === calEvent.date && 
              timelineEvent.title.toLowerCase().includes(calEvent.title.toLowerCase())
            )
          })
          .map(event => ({
            id: event.id,
            title: event.title,
            date: event.date,
            type: event.eventType,
            description: event.description || '',
            priority: event.priority || 'medium',
            source: 'calendar'
          }))
      } catch (dbError) {
        console.warn('Database unavailable for calendar events, using timeline only')
      }
      
      // Combine and sort all events
      const allEvents = [...defaultEvents, ...additionalEvents]
        .sort((a, b) => new Date(a.date) - new Date(b.date))
      
      setEvents(allEvents)
    } catch (error) {
      console.error('Failed to load events:', error)
      // Fallback to timeline data only
      const defaultEvents = timelineData.map((event, index) => ({
        id: `timeline_${index}`,
        title: event.event,
        date: event.date,
        type: event.type,
        description: `Academic event: ${event.event}`,
        priority: event.type === 'exam' || event.type === 'dead' ? 'high' : 'medium',
        source: 'timeline'
      }))
      setEvents(defaultEvents)
    }
  }

  const addEvent = async () => {
    if (!newEvent.title || !newEvent.date) return
    
    try {
      await db.saveCalendarEvent(newEvent)
      await loadEvents()
      setNewEvent({ title: '', date: '', type: 'info', description: '', priority: 'medium' })
      setShowAddForm(false)
    } catch (error) {
      console.error('Failed to add event:', error)
    }
  }

  const updateEvent = async () => {
    if (!editingEvent.title || !editingEvent.date) return
    
    try {
      await db.updateCalendarEvent(editingEvent.id, editingEvent)
      await loadEvents()
      setEditingEvent(null)
    } catch (error) {
      console.error('Failed to update event:', error)
    }
  }

  const deleteEvent = async (eventId) => {
    try {
      await db.deleteCalendarEvent(eventId)
      await loadEvents()
    } catch (error) {
      console.error('Failed to delete event:', error)
    }
  }

  const getDaysUntil = (date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time to start of day for accurate comparison
    
    const eventDate = new Date(date)
    eventDate.setHours(0, 0, 0, 0) // Reset time to start of day
    
    const diffTime = eventDate.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const getEventIcon = (type) => {
    const icons = {
      exam: AlertTriangle,
      dead: Clock,
      party: Trophy,
      event: Star,
      info: BookOpen,
      achievement: CheckCircle,
      deadline: Target,
      break: Coffee
    }
    return icons[type] || Calendar
  }

  const eventTypes = [
    { value: 'all', label: 'All Events', icon: Calendar },
    { value: 'upcoming', label: 'Upcoming', icon: Clock },
    { value: 'exam', label: 'Exams', icon: AlertTriangle },
    { value: 'dead', label: 'Deadlines', icon: Target },
    { value: 'party', label: 'Events', icon: Trophy }
  ]

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true
    if (filter === 'upcoming') return getDaysUntil(event.date) >= 0
    if (filter === 'past') return getDaysUntil(event.date) < 0
    return event.type === filter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold font-mono mb-2">
            <span className="text-cyber-green">Mission</span> Timeline
          </h1>
          <p className="text-gray-400">Track all your academic battles and victories</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(true)}
          className="cyber-button flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Event</span>
        </motion.button>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {eventTypes.map((type) => {
          const Icon = type.icon
          return (
            <motion.button
              key={type.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(type.value)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${
                filter === type.value
                  ? 'border-cyber-green bg-cyber-green text-black'
                  : 'border-cyber-border bg-cyber-card hover:border-cyber-green/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{type.label}</span>
            </motion.button>
          )
        })}
      </div>

      {/* Today's Events Section */}
      {todayEvents.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="cyber-card p-6 border-l-4 border-l-cyber-green bg-cyber-green/5"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-cyber-green rounded-full flex items-center justify-center">
              <Calendar className="w-4 h-4 text-black" />
            </div>
            <h2 className="text-xl font-bold text-cyber-green">Today's Events</h2>
            <span className="text-sm text-gray-400">
              {calendarCore.formatDateForDisplay(new Date(currentDate))}
            </span>
          </div>
          
          <div className="grid gap-3">
            {todayEvents.map((event, index) => {
              const Icon = getEventIcon(event.eventType || event.type)
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-cyber-card rounded-lg border border-cyber-border"
                >
                  <Icon className="w-5 h-5 text-cyber-green" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-cyber-green">{event.title}</h3>
                    {event.description && (
                      <p className="text-sm text-gray-400">{event.description}</p>
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    event.priority === 'critical' ? 'bg-red-500 text-white' :
                    event.priority === 'high' ? 'bg-orange-500 text-white' :
                    'bg-cyber-green text-black'
                  }`}>
                    {event.priority?.toUpperCase() || 'NORMAL'}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Timeline */}
      <div className="space-y-3">
        {filteredEvents.map((event, index) => {
          const Icon = getEventIcon(event.type)
          const daysUntil = getDaysUntil(event.date)
          const isUpcoming = daysUntil >= 0
          const isUrgent = daysUntil <= 7 && daysUntil >= 0
          const isToday = calendarCore.isToday(event.date)
          
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className={`cyber-card p-4 border-l-4 ${
                isToday 
                  ? 'border-l-cyber-green bg-cyber-green/5 ring-1 ring-cyber-green/30' 
                  : isUrgent
                  ? 'border-l-orange-500 bg-orange-500/5'
                  : event.type === 'exam'
                  ? 'border-l-red-500'
                  : event.type === 'dead'
                  ? 'border-l-orange-500'
                  : 'border-l-cyber-purple'
              } hover:scale-[1.01] transition-all duration-200`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isToday 
                      ? 'bg-cyber-green text-black' 
                      : event.type === 'exam'
                      ? 'bg-red-500/20 text-red-400'
                      : event.type === 'dead'
                      ? 'bg-orange-500/20 text-orange-400'
                      : 'bg-cyber-purple/20 text-cyber-purple'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  
                  <div>
                    <h3 className={`font-semibold ${isToday ? 'text-cyber-green' : 'text-cyber-text'}`}>
                      {isToday && '🎯 '}{event.title}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {calendarCore.formatDateForDisplay(new Date(event.date))}
                      {isToday && ' (TODAY)'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    isToday
                      ? 'bg-cyber-green text-black animate-pulse'
                      : isUpcoming
                      ? daysUntil === 0
                        ? 'bg-cyber-red text-white'
                        : isUrgent
                        ? 'bg-yellow-500 text-black'
                        : 'bg-cyber-green/20 text-cyber-green'
                      : 'bg-gray-600 text-gray-300'
                  }`}>
                    {isToday ? 'TODAY' :
                     daysUntil === 0 ? 'TODAY' :
                     daysUntil === 1 ? 'TOMORROW' :
                     daysUntil > 0 ? `${daysUntil}D` :
                     'PAST'}
                  </span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Add Event Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="cyber-card p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4 text-cyber-green">Add New Event</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    className="cyber-input w-full"
                    placeholder="Event title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                    className="cyber-input w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                    className="cyber-input w-full"
                  >
                    <option value="info">Info</option>
                    <option value="exam">Exam</option>
                    <option value="dead">Deadline</option>
                    <option value="party">Event</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Priority</label>
                  <select
                    value={newEvent.priority}
                    onChange={(e) => setNewEvent({...newEvent, priority: e.target.value})}
                    className="cyber-input w-full"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={addEvent}
                  className="cyber-button flex-1"
                >
                  Add Event
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="cyber-button-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Timeline