/**
 * Error handling utilities for the Smart Stock Analyzer
 */

// Error types enum
export const ErrorTypes = {
  NETWORK_ERROR: "NETWORK_ERROR",
  API_ERROR: "API_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  TIMEOUT_ERROR: "TIMEOUT_ERROR",
  RATE_LIMIT_ERROR: "RATE_LIMIT_ERROR",
};

/**
 * Custom error class for application-specific errors
 */
export class SmartStockError extends Error {
  constructor(message, type = ErrorTypes.API_ERROR, details = null) {
    super(message);
    this.name = "SmartStockError";
    this.type = type;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Error handler utility for consistent error processing
 */
export class ErrorHandler {
  static handle(error, context = "Unknown") {
    const errorInfo = {
      message: error.message || "An unknown error occurred",
      type: error.type || ErrorTypes.API_ERROR,
      context,
      timestamp: new Date().toISOString(),
      stack: error.stack,
    };

    // Log error for debugging
    console.error(`[${context}] Error:`, errorInfo);

    // Return user-friendly message
    return this.getUserFriendlyMessage(error);
  }

  static getUserFriendlyMessage(error) {
    if (error instanceof SmartStockError) {
      switch (error.type) {
        case ErrorTypes.NETWORK_ERROR:
          return "Connection issue. Please check your internet and try again.";
        case ErrorTypes.API_ERROR:
          return "Service temporarily unavailable. Please try again in a moment.";
        case ErrorTypes.VALIDATION_ERROR:
          return error.message;
        case ErrorTypes.TIMEOUT_ERROR:
          return "Request timed out. Please try again.";
        case ErrorTypes.RATE_LIMIT_ERROR:
          return "Too many requests. Please wait a moment before trying again.";
        default:
          return "An unexpected error occurred. Please try again.";
      }
    }

    // Default error message
    return "An unexpected error occurred. Please refresh the page and try again.";
  }
}

/**
 * Retry mechanism for failed requests
 */
export class RetryHandler {
  static async retry(fn, maxAttempts = 3, delay = 1000) {
    let lastError;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;

        if (attempt === maxAttempts) break;

        // Exponential backoff
        const waitTime = delay * Math.pow(2, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }

    throw lastError;
  }
}
