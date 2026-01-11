// Memory Optimizer - Prevent memory leaks and optimize performance
class MemoryOptimizer {
  constructor() {
    this.intervals = new Set()
    this.timeouts = new Set()
    this.eventListeners = new Map()
    this.observers = new Set()
  }

  // Managed interval creation
  setInterval(callback, delay) {
    const intervalId = setInterval(callback, delay)
    this.intervals.add(intervalId)
    return intervalId
  }

  // Managed timeout creation
  setTimeout(callback, delay) {
    const timeoutId = setTimeout(() => {
      callback()
      this.timeouts.delete(timeoutId)
    }, delay)
    this.timeouts.add(timeoutId)
    return timeoutId
  }

  // Managed event listener
  addEventListener(element, event, handler, options) {
    element.addEventListener(event, handler, options)
    
    if (!this.eventListeners.has(element)) {
      this.eventListeners.set(element, [])
    }
    this.eventListeners.get(element).push({ event, handler, options })
  }

  // Managed observer
  addObserver(observer) {
    this.observers.add(observer)
    return observer
  }

  // Clear specific interval
  clearInterval(intervalId) {
    clearInterval(intervalId)
    this.intervals.delete(intervalId)
  }

  // Clear specific timeout
  clearTimeout(timeoutId) {
    clearTimeout(timeoutId)
    this.timeouts.delete(timeoutId)
  }

  // Remove specific event listener
  removeEventListener(element, event, handler) {
    element.removeEventListener(event, handler)
    
    const listeners = this.eventListeners.get(element)
    if (listeners) {
      const index = listeners.findIndex(l => l.event === event && l.handler === handler)
      if (index !== -1) {
        listeners.splice(index, 1)
      }
      if (listeners.length === 0) {
        this.eventListeners.delete(element)
      }
    }
  }

  // Clean up all managed resources
  cleanup() {
    // Clear all intervals
    this.intervals.forEach(intervalId => clearInterval(intervalId))
    this.intervals.clear()

    // Clear all timeouts
    this.timeouts.forEach(timeoutId => clearTimeout(timeoutId))
    this.timeouts.clear()

    // Remove all event listeners
    this.eventListeners.forEach((listeners, element) => {
      listeners.forEach(({ event, handler }) => {
        element.removeEventListener(event, handler)
      })
    })
    this.eventListeners.clear()

    // Disconnect all observers
    this.observers.forEach(observer => {
      if (observer.disconnect) {
        observer.disconnect()
      }
    })
    this.observers.clear()
  }

  // Memory usage monitoring
  getMemoryUsage() {
    if (performance.memory) {
      return {
        used: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB
        total: Math.round(performance.memory.totalJSHeapSize / 1048576), // MB
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576) // MB
      }
    }
    return null
  }

  // Force garbage collection (if available)
  forceGC() {
    if (window.gc) {
      window.gc()
    }
  }

  // Memory pressure detection
  isMemoryPressureHigh() {
    const memory = this.getMemoryUsage()
    if (!memory) return false
    
    const usagePercentage = (memory.used / memory.limit) * 100
    return usagePercentage > 80 // Alert if using more than 80% of available memory
  }

  // Optimize data structures
  optimizeArray(array, maxSize = 1000) {
    if (array.length > maxSize) {
      // Keep only the most recent items
      return array.slice(-maxSize)
    }
    return array
  }

  // Clean up old cache entries
  cleanupCache(cache, maxAge = 24 * 60 * 60 * 1000) { // 24 hours default
    const now = Date.now()
    const keysToDelete = []
    
    for (const [key, value] of cache.entries()) {
      if (value.timestamp && (now - value.timestamp) > maxAge) {
        keysToDelete.push(key)
      }
    }
    
    keysToDelete.forEach(key => cache.delete(key))
    return keysToDelete.length
  }

  // Debounce function to prevent excessive calls
  debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  // Throttle function to limit call frequency
  throttle(func, limit) {
    let inThrottle
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }

  // Monitor and log memory usage
  startMemoryMonitoring(interval = 60000) { // 1 minute default
    const monitoringId = this.setInterval(() => {
      const memory = this.getMemoryUsage()
      if (memory) {
        console.log(`Memory Usage: ${memory.used}MB / ${memory.limit}MB (${Math.round((memory.used / memory.limit) * 100)}%)`)
        
        if (this.isMemoryPressureHigh()) {
          console.warn('⚠️ High memory usage detected. Consider optimizing.')
          this.forceGC()
        }
      }
    }, interval)
    
    return monitoringId
  }
}

// Export singleton instance
export const memoryOptimizer = new MemoryOptimizer()
export default memoryOptimizer