/**
 * Error Logging Utility
 * 
 * Centralized error logging for consistent error handling and reporting
 */

export interface ErrorLog {
  message: string
  stack?: string
  context?: string
  timestamp: string
  url?: string
  userAgent?: string
  metadata?: Record<string, any>
}

class ErrorLogger {
  private logs: ErrorLog[] = []
  private maxLogs = 100

  /**
   * Log an error with context
   */
  log(error: Error | string, context?: string, metadata?: Record<string, any>) {
    const errorLog: ErrorLog = {
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'string' ? undefined : error.stack,
      context,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      metadata,
    }

    // Store log
    this.logs.push(errorLog)
    if (this.logs.length > this.maxLogs) {
      this.logs.shift() // Remove oldest log
    }

    // Console output
    if (process.env.NODE_ENV === 'development') {
      console.error(`[${context || 'Error'}]`, error)
      if (metadata) {
        console.error('Metadata:', metadata)
      }
    }

    // Send to error tracking service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToService(errorLog)
    }
  }

  /**
   * Log a warning
   */
  warn(message: string, context?: string, metadata?: Record<string, any>) {
    console.warn(`[${context || 'Warning'}]`, message)
    if (metadata) {
      console.warn('Metadata:', metadata)
    }
  }

  /**
   * Log info message
   */
  info(message: string, context?: string, metadata?: Record<string, any>) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${context || 'Info'}]`, message)
      if (metadata) {
        console.log('Metadata:', metadata)
      }
    }
  }

  /**
   * Get all logged errors
   */
  getLogs(): ErrorLog[] {
    return [...this.logs]
  }

  /**
   * Get recent errors (last n)
   */
  getRecentLogs(count: number = 10): ErrorLog[] {
    return this.logs.slice(-count)
  }

  /**
   * Clear all logs
   */
  clearLogs() {
    this.logs = []
  }

  /**
   * Get logs by context
   */
  getLogsByContext(context: string): ErrorLog[] {
    return this.logs.filter(log => log.context === context)
  }

  /**
   * Send error to tracking service
   */
  private sendToService(errorLog: ErrorLog) {
    // Implement your error tracking service integration here
    // Examples: Sentry, LogRocket, Bugsnag, etc.
    
    // For now, we'll just store it locally
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem('error_logs')
        const logs = stored ? JSON.parse(stored) : []
        logs.push(errorLog)
        
        // Keep only last 50 logs in storage
        if (logs.length > 50) {
          logs.shift()
        }
        
        localStorage.setItem('error_logs', JSON.stringify(logs))
      }
    } catch (e) {
      // Silently fail if localStorage is not available
    }
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }

  /**
   * Download logs as file
   */
  downloadLogs() {
    if (typeof window === 'undefined') return

    const data = this.exportLogs()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `error-logs-${new Date().toISOString()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}

// Singleton instance
export const errorLogger = new ErrorLogger()

/**
 * Helper function to log API errors
 */
export function logApiError(
  error: any,
  endpoint: string,
  method: string = 'GET',
  metadata?: Record<string, any>
) {
  errorLogger.log(
    error,
    'API Error',
    {
      endpoint,
      method,
      ...metadata,
    }
  )
}

/**
 * Helper function to log component errors
 */
export function logComponentError(
  error: Error,
  componentName: string,
  metadata?: Record<string, any>
) {
  errorLogger.log(
    error,
    `Component: ${componentName}`,
    metadata
  )
}

/**
 * Helper function to log database errors
 */
export function logDatabaseError(
  error: any,
  operation: string,
  table?: string,
  metadata?: Record<string, any>
) {
  errorLogger.log(
    error,
    'Database Error',
    {
      operation,
      table,
      ...metadata,
    }
  )
}

/**
 * Helper function to log authentication errors
 */
export function logAuthError(
  error: any,
  action: string,
  metadata?: Record<string, any>
) {
  errorLogger.log(
    error,
    'Authentication Error',
    {
      action,
      ...metadata,
    }
  )
}
