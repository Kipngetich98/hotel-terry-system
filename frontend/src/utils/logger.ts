/**
 * Global logging utility for the restaurant management system
 * Provides centralized logging with different severity levels and context tracking
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

interface LoggerConfig {
  minLevel: LogLevel;
  enableConsole: boolean;
  enableStorage: boolean;
  maxStorageEntries: number;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  stackTrace?: string;
}

class Logger {
  private static instance: Logger;
  private config: LoggerConfig;
  private logs: LogEntry[] = [];

  private constructor() {
    this.config = {
      minLevel: LogLevel.INFO,
      enableConsole: true,
      enableStorage: true,
      maxStorageEntries: 1000,
    };

    try {
      const savedConfig = localStorage.getItem('logger_config');
      if (savedConfig) {
        this.config = { ...this.config, ...JSON.parse(savedConfig) };
      }
    } catch (error) {
      console.error('Failed to load logger configuration:', error);
    }

    try {
      const savedLogs = localStorage.getItem('app_logs');
      if (savedLogs) {
        this.logs = JSON.parse(savedLogs);
      }
    } catch (error) {
      console.error('Failed to load saved logs:', error);
    }
  }

  /**
   * Get the singleton instance of the logger
   */
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Update logger configuration
   */
  public configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
    
    try {
      localStorage.setItem('logger_config', JSON.stringify(this.config));
    } catch (error) {
      console.error('Failed to save logger configuration:', error);
    }
  }

  /**
   * Log a message at DEBUG level
   */
  public debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * Log a message at INFO level
   */
  public info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Log a message at WARN level
   */
  public warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * Log a message at ERROR level
   */
  public error(message: string, error?: Error, context?: Record<string, any>): void {
    const stackTrace = error?.stack;
    const errorContext = error ? { 
      ...context, 
      errorName: error.name, 
      errorMessage: error.message 
    } : context;
    
    this.log(LogLevel.ERROR, message, errorContext, stackTrace);
  }

  /**
   * Internal method to handle logging at any level
   */
  private log(level: LogLevel, message: string, context?: Record<string, any>, stackTrace?: string): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const timestamp = new Date().toISOString();
    const logEntry: LogEntry = {
      timestamp,
      level,
      message,
      context,
      stackTrace,
    };

    if (this.config.enableConsole) {
      this.logToConsole(logEntry);
    }

    if (this.config.enableStorage) {
      this.storeLog(logEntry);
    }
  }

  /**
   * Check if a log level should be logged based on configuration
   */
  private shouldLog(level: LogLevel): boolean {
    const levels = Object.values(LogLevel);
    const configLevelIndex = levels.indexOf(this.config.minLevel);
    const currentLevelIndex = levels.indexOf(level);
    
    return currentLevelIndex >= configLevelIndex;
  }

  /**
   * Output a log entry to the console
   */
  private logToConsole(entry: LogEntry): void {
    const { level, message, context, stackTrace } = entry;
    
    const timestamp = new Date(entry.timestamp).toLocaleTimeString();
    const prefix = `[${timestamp}] [${level}]`;
    
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(prefix, message, context || '');
        break;
      case LogLevel.INFO:
        console.info(prefix, message, context || '');
        break;
      case LogLevel.WARN:
        console.warn(prefix, message, context || '');
        break;
      case LogLevel.ERROR:
        console.error(prefix, message, context || '');
        if (stackTrace) {
          console.error(stackTrace);
        }
        break;
    }
  }

  /**
   * Store a log entry in memory and localStorage
   */
  private storeLog(entry: LogEntry): void {
    this.logs.push(entry);
    
    if (this.logs.length > this.config.maxStorageEntries) {
      this.logs = this.logs.slice(-this.config.maxStorageEntries);
    }
    
    try {
      localStorage.setItem('app_logs', JSON.stringify(this.logs));
    } catch (error) {
      console.error('Failed to save logs to localStorage:', error);
      
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        this.logs = this.logs.slice(-Math.floor(this.config.maxStorageEntries / 2));
        try {
          localStorage.setItem('app_logs', JSON.stringify(this.logs));
        } catch {
          console.error('Still failed to save logs after reducing size');
        }
      }
    }
  }

  /**
   * Get all stored logs
   */
  public getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logs.filter(log => log.level === level);
    }
    return [...this.logs];
  }

  /**
   * Clear all stored logs
   */
  public clearLogs(): void {
    this.logs = [];
    try {
      localStorage.removeItem('app_logs');
    } catch (error) {
      console.error('Failed to clear logs from localStorage:', error);
    }
  }

  /**
   * Export logs as JSON string
   */
  public exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const logger = Logger.getInstance();

export function getLogger(): Logger {
  return Logger.getInstance();
}

export default logger;
