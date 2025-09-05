export type ErrorLevel = 'info' | 'warn' | 'error' | 'fatal';

export type ErrorLog = {
  level: ErrorLevel;
  message: string;
  stack?: string;
  timestamp: Date;
  userId?: string;
  url?: string;
  metadata?: Record<string, unknown>;
};

export async function logError(
  level: ErrorLevel,
  message: string,
  error?: Error,
  metadata?: Record<string, unknown>
): Promise<void> {
  // In a real implementation, you would send to a logging service
  // For now, we'll just log to console
  
  const logEntry: ErrorLog = {
    level,
    message,
    stack: error?.stack,
    timestamp: new Date(),
    metadata
  };
  
  switch (level) {
    case 'info':
      console.info('INFO:', logEntry);
      break;
    case 'warn':
      console.warn('WARN:', logEntry);
      break;
    case 'error':
      console.error('ERROR:', logEntry);
      break;
    case 'fatal':
      console.error('FATAL:', logEntry);
      break;
  }
}

export async function logInfo(message: string, metadata?: Record<string, unknown>): Promise<void> {
  await logError('info', message, undefined, metadata);
}

export async function logWarning(message: string, error?: Error, metadata?: Record<string, unknown>): Promise<void> {
  await logError('warn', message, error, metadata);
}

export async function logErrorEvent(message: string, error?: Error, metadata?: Record<string, unknown>): Promise<void> {
  await logError('error', message, error, metadata);
}

export async function logFatal(message: string, error?: Error, metadata?: Record<string, unknown>): Promise<void> {
  await logError('fatal', message, error, metadata);
}