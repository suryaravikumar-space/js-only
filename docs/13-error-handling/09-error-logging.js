/**
 * CHALLENGE 09: Error Logging Best Practices
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Good error logging is the difference between debugging in 5 minutes       ║
 * ║ vs 5 hours. Log the RIGHT information in the RIGHT format.                ║
 * ║                                                                            ║
 * ║   LOG: Context, Error details, Stack trace, Timestamp                      ║
 * ║   DON'T LOG: Passwords, Tokens, PII, Credit cards                         ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 1. What to Log
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 1. What to Log ═══\n");

// BAD: Just logging the message
try {
  throw new Error('Something went wrong');
} catch (e) {
  console.log('A: BAD - Just message:', e.message);
}

// GOOD: Log everything useful
try {
  throw new Error('Something went wrong');
} catch (e) {
  console.log('B: GOOD - Full error info:');
  console.log('   Name:', e.name);
  console.log('   Message:', e.message);
  console.log('   Stack:', e.stack?.split('\n').slice(0, 3).join('\n'));
}

console.log('');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ ERROR LOGGING CHECKLIST                                                     │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ✓ ALWAYS LOG:                                                             │
 * │     • Error name (TypeError, ReferenceError, CustomError)                  │
 * │     • Error message                                                         │
 * │     • Stack trace                                                           │
 * │     • Timestamp                                                             │
 * │     • Request ID / Correlation ID                                           │
 * │     • User ID (if available)                                                │
 * │     • Environment (dev/prod)                                                │
 * │     • Relevant context (what operation was being performed)                 │
 * │                                                                             │
 * │   ✗ NEVER LOG:                                                              │
 * │     • Passwords                                                             │
 * │     • API keys / Tokens                                                     │
 * │     • Credit card numbers                                                   │
 * │     • Social Security Numbers                                               │
 * │     • Full request bodies (may contain sensitive data)                      │
 * │     • Session cookies                                                       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 2. Structured Logging
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 2. Structured Logging ═══\n");

// Log levels
const LOG_LEVELS = {
  ERROR: 'error',   // Application errors, exceptions
  WARN: 'warn',     // Unusual conditions, deprecated usage
  INFO: 'info',     // Important events, startup/shutdown
  DEBUG: 'debug'    // Detailed debugging info
};

class Logger {
  constructor(context = {}) {
    this.context = context;
  }

  log(level, message, data = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...this.context,
      ...data
    };

    // In production, send to logging service
    console.log('C:', JSON.stringify(logEntry, null, 2));
  }

  error(message, error, data = {}) {
    this.log(LOG_LEVELS.ERROR, message, {
      ...data,
      error: {
        name: error?.name,
        message: error?.message,
        stack: error?.stack
      }
    });
  }

  warn(message, data = {}) {
    this.log(LOG_LEVELS.WARN, message, data);
  }

  info(message, data = {}) {
    this.log(LOG_LEVELS.INFO, message, data);
  }
}

// Usage
const logger = new Logger({
  service: 'user-api',
  environment: 'production'
});

try {
  throw new Error('Database connection failed');
} catch (e) {
  logger.error('Failed to fetch user', e, {
    userId: 123,
    operation: 'getUser'
  });
}

console.log('');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STRUCTURED LOGGING FORMAT                                                   │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   {                                                                         │
 * │     "timestamp": "2024-01-15T10:30:00.000Z",                               │
 * │     "level": "error",                                                       │
 * │     "message": "Failed to fetch user",                                      │
 * │     "service": "user-api",                                                  │
 * │     "environment": "production",                                            │
 * │     "userId": 123,                                                          │
 * │     "operation": "getUser",                                                 │
 * │     "error": {                                                              │
 * │       "name": "Error",                                                      │
 * │       "message": "Database connection failed",                              │
 * │       "stack": "Error: Database connection..."                              │
 * │     }                                                                       │
 * │   }                                                                         │
 * │                                                                             │
 * │   WHY STRUCTURED (JSON)?                                                    │
 * │   • Easy to search in log aggregators (Elasticsearch, Splunk)              │
 * │   • Can filter by any field                                                 │
 * │   • Machine-readable                                                        │
 * │   • Consistent format                                                       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 3. Adding Context
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 3. Context-Rich Logging ═══\n");

// Request-scoped logger
function createRequestLogger(req) {
  return new Logger({
    requestId: req.id || Math.random().toString(36).substr(2, 9),
    method: req.method,
    path: req.path,
    userId: req.user?.id,
    ip: req.ip
  });
}

// Simulated request handling
function handleRequest(req) {
  const log = createRequestLogger(req);

  log.info('Request started');

  try {
    if (req.path === '/error') {
      throw new Error('Something broke');
    }
    log.info('Request completed', { status: 200 });
  } catch (e) {
    log.error('Request failed', e, { status: 500 });
  }
}

// Test
handleRequest({
  id: 'req-123',
  method: 'GET',
  path: '/error',
  user: { id: 456 },
  ip: '192.168.1.1'
});

console.log('');


// ═══════════════════════════════════════════════════════════════════════════════
// 4. Sanitizing Sensitive Data
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 4. Sanitizing Sensitive Data ═══\n");

const SENSITIVE_FIELDS = ['password', 'token', 'apiKey', 'secret', 'authorization'];

function sanitize(obj, depth = 0) {
  if (depth > 10) return '[MAX_DEPTH]';
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(item => sanitize(item, depth + 1));
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_FIELDS.some(field => lowerKey.includes(field))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object') {
      sanitized[key] = sanitize(value, depth + 1);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

// Test
const requestData = {
  username: 'john',
  password: 'secret123',
  apiKey: 'sk-12345',
  data: {
    token: 'jwt-token',
    message: 'Hello'
  }
};

console.log('D: Original:', JSON.stringify(requestData, null, 2));
console.log('E: Sanitized:', JSON.stringify(sanitize(requestData), null, 2));
console.log('');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ SECURITY: ALWAYS SANITIZE LOGS                                              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   BEFORE logging request/response bodies:                                   │
 * │   1. Identify sensitive fields                                              │
 * │   2. Redact or hash them                                                    │
 * │   3. Limit depth to prevent circular references                             │
 * │                                                                             │
 * │   Common sensitive fields:                                                  │
 * │   • password, pass, pwd                                                     │
 * │   • token, apiKey, api_key                                                  │
 * │   • secret, private                                                         │
 * │   • authorization, auth                                                     │
 * │   • creditCard, ccv, ssn                                                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 5. Error Aggregation
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 5. Error Aggregation ═══\n");

// Simple error aggregator (like Sentry concept)
class ErrorAggregator {
  constructor() {
    this.errors = new Map();  // fingerprint -> { count, lastSeen, sample }
  }

  capture(error, context = {}) {
    const fingerprint = this.getFingerprint(error);
    const existing = this.errors.get(fingerprint);

    if (existing) {
      existing.count++;
      existing.lastSeen = new Date();
    } else {
      this.errors.set(fingerprint, {
        count: 1,
        firstSeen: new Date(),
        lastSeen: new Date(),
        sample: {
          name: error.name,
          message: error.message,
          stack: error.stack,
          context
        }
      });
    }
  }

  getFingerprint(error) {
    // Simple fingerprint: error name + first stack line
    const firstStackLine = error.stack?.split('\n')[1] || '';
    return `${error.name}:${error.message}:${firstStackLine.trim()}`;
  }

  report() {
    console.log('F: Error Report:');
    for (const [fingerprint, data] of this.errors) {
      console.log(`   [${data.count}x] ${data.sample.name}: ${data.sample.message}`);
    }
  }
}

// Usage
const aggregator = new ErrorAggregator();

// Simulate repeated errors
for (let i = 0; i < 5; i++) {
  try {
    JSON.parse('invalid');
  } catch (e) {
    aggregator.capture(e, { attempt: i });
  }
}

try {
  throw new TypeError('Different error');
} catch (e) {
  aggregator.capture(e);
}

aggregator.report();
console.log('');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHY ERROR AGGREGATION?                                                      │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Without aggregation:                                                      │
 * │   ┌────────────────────────────────────────────────────────────────────┐   │
 * │   │  10,000 identical errors = 10,000 log entries                      │   │
 * │   │  Impossible to see patterns                                        │   │
 * │   │  Alerts firing constantly                                          │   │
 * │   │  Storage costs explode                                             │   │
 * │   └────────────────────────────────────────────────────────────────────┘   │
 * │                                                                             │
 * │   With aggregation:                                                         │
 * │   ┌────────────────────────────────────────────────────────────────────┐   │
 * │   │  10,000 errors = 1 entry with count: 10,000                        │   │
 * │   │  Easy to see impact                                                │   │
 * │   │  Alert once, not 10,000 times                                      │   │
 * │   │  Minimal storage                                                   │   │
 * │   └────────────────────────────────────────────────────────────────────┘   │
 * │                                                                             │
 * │   Tools: Sentry, Rollbar, Bugsnag do this automatically                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 6. Production Logger Example
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 6. Production Logger ═══\n");

class ProductionLogger {
  constructor(config = {}) {
    this.service = config.service || 'unknown';
    this.environment = config.environment || process.env.NODE_ENV || 'development';
    this.minLevel = config.minLevel || 'debug';
    this.levels = { debug: 0, info: 1, warn: 2, error: 3 };
  }

  shouldLog(level) {
    return this.levels[level] >= this.levels[this.minLevel];
  }

  formatMessage(level, message, data) {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      service: this.service,
      environment: this.environment,
      message,
      ...sanitize(data)
    });
  }

  debug(message, data = {}) {
    if (this.shouldLog('debug')) {
      console.log(this.formatMessage('debug', message, data));
    }
  }

  info(message, data = {}) {
    if (this.shouldLog('info')) {
      console.log(this.formatMessage('info', message, data));
    }
  }

  warn(message, data = {}) {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message, data));
    }
  }

  error(message, error = null, data = {}) {
    if (this.shouldLog('error')) {
      const errorData = error ? {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack
        }
      } : {};

      console.error(this.formatMessage('error', message, { ...data, ...errorData }));
    }
  }
}

// Usage
const prodLogger = new ProductionLogger({
  service: 'payment-service',
  environment: 'production',
  minLevel: 'info'  // Won't log debug in production
});

prodLogger.debug('This won\'t appear');  // Filtered out
prodLogger.info('Payment processed', { orderId: '123', amount: 99.99 });
prodLogger.error('Payment failed', new Error('Card declined'), {
  orderId: '456',
  cardLast4: '1234'
});

console.log('');


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Effective error logging requires:                                          │
 * │                                                                             │
 * │  1. Structured format (JSON) for searchability in log aggregators          │
 * │                                                                             │
 * │  2. Rich context: timestamp, request ID, user ID, environment,             │
 * │     operation being performed - everything needed to debug                  │
 * │                                                                             │
 * │  3. Security: sanitize sensitive fields before logging. Never log          │
 * │     passwords, tokens, or PII                                               │
 * │                                                                             │
 * │  4. Log levels: ERROR for exceptions, WARN for unusual conditions,         │
 * │     INFO for important events, DEBUG for detailed tracing                   │
 * │                                                                             │
 * │  5. Error aggregation: group identical errors to see patterns              │
 * │     and reduce noise. Tools like Sentry do this automatically              │
 * │                                                                             │
 * │  6. Correlation IDs: track a request across multiple services              │
 * │     by including a unique ID in all related logs                           │
 * │                                                                             │
 * │  In production, I use structured logging libraries (Winston, Pino)         │
 * │  and error tracking services (Sentry) for aggregation and alerting."       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/13-error-handling/09-error-logging.js
 */
