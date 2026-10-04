/**
 * Structured logging.
 *
 * One line of JSON per event so the output is greppable in development and
 * ingestible by a log pipeline in production without a reformatting step.
 */

type Level = 'debug' | 'info' | 'warn' | 'error';

const write = (level: Level, message: string, context?: Record<string, unknown>) => {
  const entry = {
    ts: new Date().toISOString(),
    level,
    message,
    ...(context ?? {}),
  };
  const line = JSON.stringify(entry);
  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.log(line);
};

export const logger = {
  debug: (message: string, context?: Record<string, unknown>) => write('debug', message, context),
  info: (message: string, context?: Record<string, unknown>) => write('info', message, context),
  warn: (message: string, context?: Record<string, unknown>) => write('warn', message, context),
  error: (message: string, context?: Record<string, unknown>) => write('error', message, context),
};
