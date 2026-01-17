/**
 * PRODUCTION MONITORING AND ERROR HANDLING
 * Comprehensive system for tracking performance and errors in production
 */

class ProductionMonitoring {
  constructor() {
    this.isProduction = import.meta.env.PROD;
    this.startTime = Date.now();
    this.errorCount = 0;
    this.performanceMetrics = {
      questionGeneration: [],
      pageLoads: [],
      apiCalls: []
    };
    
    this.initializeMonitoring();
  }

  /**
   * Initialize production monitoring
   */
  initializeMonitoring() {
    if (!this.isProduction) return;

    // Global error handler
    window.addEventListener('error', (event) => {
      this.logError('JavaScript Error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.logError('Unhandled Promise Rejection', {
        reason: event.reason,
        promise: event.promise
      });
    });

    // Performance observer for monitoring
    if ('PerformanceObserver' in window) {
      this.initializePerformanceObserver();
    }

    // Log successful initialization
    this.logInfo('Production monitoring initialized');
  }

  /**
   * Initialize performance observer
   */
  initializePerformanceObserver() {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            this.performanceMetrics.pageLoads.push({
              timestamp: Date.now(),
              loadTime: entry.loadEventEnd - entry.loadEventStart,
              domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
              firstContentfulPaint: entry.loadEventEnd
            });
          }
        }
      });

      observer.observe({ entryTypes: ['navigation'] });
    } catch (error) {
      console.warn('Performance observer not supported:', error);
    }
  }

  /**
   * Log error with context
   */
  logError(type, details) {
    this.errorCount++;
    
    const errorData = {
      type,
      details,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      sessionId: this.getSessionId(),
      errorCount: this.errorCount
    };

    // Log to console in development
    if (!this.isProduction) {
      console.error(`[${type}]`, errorData);
    }

    // Store error locally for debugging
    this.storeErrorLocally(errorData);

    // Send to monitoring service (if configured)
    this.sendToMonitoringService('error', errorData);
  }

  /**
   * Log performance metric
   */
  logPerformance(metric, value, context = {}) {
    const performanceData = {
      metric,
      value,
      context,
      timestamp: Date.now(),
      sessionId: this.getSessionId()
    };

    // Store performance data
    if (this.performanceMetrics[metric]) {
      this.performanceMetrics[metric].push(performanceData);
      
      // Keep only last 100 entries per metric
      if (this.performanceMetrics[metric].length > 100) {
        this.performanceMetrics[metric] = this.performanceMetrics[metric].slice(-100);
      }
    }

    // Log slow operations
    if (value > 1000) { // More than 1 second
      this.logWarning(`Slow ${metric}`, { value, context });
    }
  }

  /**
   * Log warning
   */
  logWarning(message, details = {}) {
    const warningData = {
      message,
      details,
      timestamp: new Date().toISOString(),
      sessionId: this.getSessionId()
    };

    if (!this.isProduction) {
      console.warn(`[WARNING] ${message}`, details);
    }

    this.sendToMonitoringService('warning', warningData);
  }

  /**
   * Log info
   */
  logInfo(message, details = {}) {
    const infoData = {
      message,
      details,
      timestamp: new Date().toISOString(),
      sessionId: this.getSessionId()
    };

    if (!this.isProduction) {
      console.info(`[INFO] ${message}`, details);
    }

    this.sendToMonitoringService('info', infoData);
  }

  /**
   * Track question generation performance
   */
  trackQuestionGeneration(startTime, endTime, context) {
    const duration = endTime - startTime;
    this.logPerformance('questionGeneration', duration, context);
    
    return {
      duration,
      isSlowGeneration: duration > 2000,
      context
    };
  }

  /**
   * Track API call performance
   */
  trackApiCall(endpoint, startTime, endTime, success, error = null) {
    const duration = endTime - startTime;
    
    this.logPerformance('apiCalls', duration, {
      endpoint,
      success,
      error: error?.message
    });

    if (!success) {
      this.logError('API Call Failed', {
        endpoint,
        duration,
        error: error?.message || 'Unknown error'
      });
    }
  }

  /**
   * Get session ID
   */
  getSessionId() {
    if (!this.sessionId) {
      this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    return this.sessionId;
  }

  /**
   * Store error locally for debugging
   */
  storeErrorLocally(errorData) {
    try {
      const errors = JSON.parse(localStorage.getItem('avion_errors') || '[]');
      errors.push(errorData);
      
      // Keep only last 50 errors
      if (errors.length > 50) {
        errors.splice(0, errors.length - 50);
      }
      
      localStorage.setItem('avion_errors', JSON.stringify(errors));
    } catch (error) {
      console.warn('Failed to store error locally:', error);
    }
  }

  /**
   * Send data to monitoring service
   */
  sendToMonitoringService(type, data) {
    // In production, this would send to a monitoring service like:
    // - Sentry
    // - LogRocket
    // - DataDog
    // - Custom analytics endpoint
    
    if (!this.isProduction) return;

    // Example implementation (replace with actual service)
    try {
      // fetch('/api/monitoring', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ type, data })
      // }).catch(error => {
      //   console.warn('Failed to send monitoring data:', error);
      // });
    } catch (error) {
      console.warn('Monitoring service unavailable:', error);
    }
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary() {
    const summary = {
      sessionId: this.getSessionId(),
      uptime: Date.now() - this.startTime,
      errorCount: this.errorCount,
      metrics: {}
    };

    // Calculate averages for each metric
    Object.keys(this.performanceMetrics).forEach(metric => {
      const values = this.performanceMetrics[metric].map(entry => entry.value);
      if (values.length > 0) {
        summary.metrics[metric] = {
          count: values.length,
          average: values.reduce((a, b) => a + b, 0) / values.length,
          min: Math.min(...values),
          max: Math.max(...values)
        };
      }
    });

    return summary;
  }

  /**
   * Get health status
   */
  getHealthStatus() {
    const summary = this.getPerformanceSummary();
    const uptime = summary.uptime;
    const errorRate = summary.errorCount / (uptime / 60000); // errors per minute

    return {
      status: errorRate < 0.1 ? 'healthy' : errorRate < 1 ? 'warning' : 'critical',
      uptime,
      errorCount: summary.errorCount,
      errorRate,
      performance: summary.metrics,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Export logs for debugging
   */
  exportLogs() {
    const logs = {
      session: this.getSessionId(),
      health: this.getHealthStatus(),
      performance: this.getPerformanceSummary(),
      errors: JSON.parse(localStorage.getItem('avion_errors') || '[]'),
      timestamp: new Date().toISOString()
    };

    // Create downloadable file
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `avion-logs-${this.getSessionId()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Create singleton instance
export const productionMonitoring = new ProductionMonitoring();

// Helper functions for easy use throughout the app
export const logError = (type, details) => productionMonitoring.logError(type, details);
export const logWarning = (message, details) => productionMonitoring.logWarning(message, details);
export const logInfo = (message, details) => productionMonitoring.logInfo(message, details);
export const trackPerformance = (metric, value, context) => productionMonitoring.logPerformance(metric, value, context);
export const trackQuestionGeneration = (startTime, endTime, context) => productionMonitoring.trackQuestionGeneration(startTime, endTime, context);
export const trackApiCall = (endpoint, startTime, endTime, success, error) => productionMonitoring.trackApiCall(endpoint, startTime, endTime, success, error);
export const getHealthStatus = () => productionMonitoring.getHealthStatus();
export const exportLogs = () => productionMonitoring.exportLogs();

// Development helper
if (!import.meta.env.PROD) {
  window.avionMonitoring = productionMonitoring;
  window.exportAvionLogs = exportLogs;
}