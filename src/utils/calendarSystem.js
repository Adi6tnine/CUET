// Simplified Calendar System for AVION.EXE
class CalendarCore {
  constructor() {
    this.today = new Date()
  }

  getTodayString() {
    return new Date().toISOString().split('T')[0]
  }

  getWeekString() {
    const today = new Date()
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()))
    return startOfWeek.toISOString().split('T')[0]
  }

  formatDate(date) {
    return new Date(date).toLocaleDateString()
  }

  isToday(dateString) {
    return dateString === this.getTodayString()
  }

  getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate()
  }

  getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    const dayNum = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
  }
}

// Create singleton instance
export const calendarCore = new CalendarCore()

// Export as default for backward compatibility
export default calendarCore