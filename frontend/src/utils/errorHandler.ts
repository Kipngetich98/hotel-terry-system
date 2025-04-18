/**
 * Global error handling utility for the restaurant management system
 * Provides centralized error handling, reporting, and recovery mechanisms
 */

import logger, { LogLevel } from './logger';

export enum ErrorSeverity {
  LOW = 'LOW',         // Non-critical errors that don't affect core functionality
  MEDIUM = 'MEDIUM',   // Errors that affect some functionality but app can continue
  HIGH = 'HIGH',       // Serious errors that affect major functionality
  CRITICAL = 'CRITICAL' // Fatal errors that prevent the app from functioning
}

export enum ErrorCategory {
  NETWORK = 'NETWORK',       // Network-related errors (API calls, offline mode)
  VALIDATION = 'VALIDATION', // Input validation errors
  AUTHENTICATION = 'AUTHENTICATION', // Auth-related errors
  PAYMENT = 'PAYMENT',       // Payment processing errors
  DATA = 'DATA',             // Data handling errors
  UI = 'UI',                 // UI-related errors
  SYSTEM = 'SYSTEM'          // System/runtime errors
}

export interface ErrorMetadata {
  severity: ErrorSeverity;
  category: ErrorCategory;
  code?: string;
  userMessage?: string;
  recoverable?: boolean;
  retryable?: boolean;
}

const DEFAULT_ERROR_MESSAGES: Record<ErrorCategory, string> = {
  [ErrorCategory.NETWORK]: 'Network error occurred. Please check your connection.',
  [ErrorCategory.VALIDATION]: 'Invalid input provided.',
  [ErrorCategory.AUTHENTICATION]: 'Authentication error. Please log in again.',
  [ErrorCategory.PAYMENT]: 'Payment processing error. Please try again.',
  [ErrorCategory.DATA]: 'Data processing error occurred.',
  [ErrorCategory.UI]: 'User interface error occurred.',
  [ErrorCategory.SYSTEM]: 'System error occurred. Please refresh the page.'
};

/**
 * Custom application error class with additional metadata
 */
export class AppError extends Error {
  public readonly metadata: ErrorMetadata;
  public readonly originalError?: Error;
  public readonly timestamp: Date;

  constructor(
    message: string,
    metadata: Partial<ErrorMetadata> & { severity: ErrorSeverity; category: ErrorCategory },
    originalError?: Error
  ) {
    super(message);
    this.name = 'AppError';
    this.originalError = originalError;
    this.timestamp = new Date();
    
    this.metadata = {
      severity: metadata.severity,
      category: metadata.category,
      code: metadata.code || `${metadata.category}_ERROR`,
      userMessage: metadata.userMessage || DEFAULT_ERROR_MESSAGES[metadata.category],
      recoverable: metadata.recoverable !== undefined ? metadata.recoverable : true,
      retryable: metadata.retryable !== undefined ? metadata.retryable : true
    };

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

/**
 * Main error handler class
 */
class ErrorHandler {
  private static instance: ErrorHandler;
  private errorListeners: Array<(error: AppError) => void> = [];

  private constructor() {}

  /**
   * Get the singleton instance of the error handler
   */
  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Handle an error with proper logging and notification
   */
  public handleError(
    error: Error | AppError,
    metadata?: Partial<ErrorMetadata> & { severity?: ErrorSeverity; category?: ErrorCategory },
    context?: Record<string, any>
  ): AppError {
    if (error instanceof AppError) {
      this.logError(error, context);
      this.notifyListeners(error);
      return error;
    }

    const appError = new AppError(
      error.message,
      {
        severity: metadata?.severity || ErrorSeverity.MEDIUM,
        category: metadata?.category || ErrorCategory.SYSTEM,
        ...metadata
      },
      error
    );

    this.logError(appError, context);
    this.notifyListeners(appError);
    return appError;
  }

  /**
   * Log the error with appropriate level based on severity
   */
  private logError(error: AppError, context?: Record<string, any>): void {
    const logContext = {
      ...context,
      errorMetadata: error.metadata,
      originalError: error.originalError ? {
        name: error.originalError.name,
        message: error.originalError.message
      } : undefined
    };

    switch (error.metadata.severity) {
      case ErrorSeverity.LOW:
        logger.info(`Error (${error.metadata.category}): ${error.message}`, logContext);
        break;
      case ErrorSeverity.MEDIUM:
        logger.warn(`Error (${error.metadata.category}): ${error.message}`, logContext);
        break;
      case ErrorSeverity.HIGH:
      case ErrorSeverity.CRITICAL:
        logger.error(`Error (${error.metadata.category}): ${error.message}`, error.originalError, logContext);
        break;
    }
  }

  /**
   * Create a network error
   */
  public createNetworkError(
    message: string,
    originalError?: Error,
    metadata?: Partial<Omit<ErrorMetadata, 'category'>>
  ): AppError {
    return new AppError(
      message,
      {
        severity: metadata?.severity || ErrorSeverity.MEDIUM,
        category: ErrorCategory.NETWORK,
        ...metadata
      },
      originalError
    );
  }

  /**
   * Create a validation error
   */
  public createValidationError(
    message: string,
    originalError?: Error,
    metadata?: Partial<Omit<ErrorMetadata, 'category'>>
  ): AppError {
    return new AppError(
      message,
      {
        severity: metadata?.severity || ErrorSeverity.LOW,
        category: ErrorCategory.VALIDATION,
        ...metadata
      },
      originalError
    );
  }

  /**
   * Create a payment error
   */
  public createPaymentError(
    message: string,
    originalError?: Error,
    metadata?: Partial<Omit<ErrorMetadata, 'category'>>
  ): AppError {
    return new AppError(
      message,
      {
        severity: metadata?.severity || ErrorSeverity.HIGH,
        category: ErrorCategory.PAYMENT,
        ...metadata
      },
      originalError
    );
  }

  /**
   * Add an error listener
   */
  public addErrorListener(listener: (error: AppError) => void): void {
    this.errorListeners.push(listener);
  }

  /**
   * Remove an error listener
   */
  public removeErrorListener(listener: (error: AppError) => void): void {
    this.errorListeners = this.errorListeners.filter(l => l !== listener);
  }

  /**
   * Notify all listeners about an error
   */
  private notifyListeners(error: AppError): void {
    this.errorListeners.forEach(listener => {
      try {
        listener(error);
      } catch (listenerError) {
        console.error('Error in error listener:', listenerError);
      }
    });
  }

  /**
   * Show a user-friendly error message (can be overridden by UI components)
   */
  public showErrorToUser(error: AppError): void {
    alert(error.metadata.userMessage || error.message);
  }
}

export const errorHandler = ErrorHandler.getInstance();

export function getErrorHandler(): ErrorHandler {
  return ErrorHandler.getInstance();
}

export default errorHandler;
