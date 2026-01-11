// Calendar System - Initializes and coordinates CalendarCore and DailyResetManager
import calendarCore from './calendarCore'
import dailyResetManager from './dailyResetManager'

// Set up the relationship between CalendarCore and DailyResetManager
calendarCore.setDailyResetManager(dailyResetManager)

// Export both components as a unified calendar system
export { calendarCore, dailyResetManager }

// Export calendarCore as default for backward compatibility
export default calendarCore