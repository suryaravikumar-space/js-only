/**
 * TOPIC 03: Logging in Node.js
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ console.log() is for development. Production needs STRUCTURED LOGGING   ║
 * ║ with levels, timestamps, correlation IDs, and JSON format.              ║
 * ║                                                                          ║
 * ║   Development → console.log("User logged in")                           ║
 * ║   Production  → {"level":"info","timestamp":"...","msg":"User logged    ║
 * ║                   in","userId":"123","requestId":"abc-456"}             ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  An airplane's FLIGHT BLACK BOX RECORDER:                                 │
 * │                                                                            │
 * │  It records EVERYTHING - altitude, speed, conversations, warnings.       │
 * │  When something goes wrong (crash), investigators use the black box      │
 * │  to reconstruct exactly what happened.                                    │
 * │                                                                            │
 * │  Your production logs are the same:                                      │
 * │    - ERROR: "Engine failure at 35000ft" → Critical, alert the crew      │
 * │    - WARN: "Fuel below 20%" → Important, but not emergency yet          │
 * │    - INFO: "Reached cruising altitude" → Normal operation milestone     │
 * │    - DEBUG: "Flap position: 15 degrees" → Detailed technical info       │
 * │                                                                            │
 * │  Bad logging (console.log):                                              │
 * │    "something happened" ← What? When? Where? WHO?                       │
 * │                                                                            │
 * │  Good logging (structured):                                              │
 * │    { time: "14:30:01", level: "error", flight: "UA123",                 │
 * │      msg: "Hydraulic pressure drop", system: "landing-gear" }           │
 * │                                                                            │
 * │  "Log like your future self debugging at 3 AM depends on it.            │
 * │   Because it does."                                                      │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM: Logging Pipeline                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │   APPLICATION                                                             │
 * │   ┌─────────────────────────────────────────────────────┐                 │
 * │   │  logger.info("Request received", { userId, path }) │                 │
 * │   └───────────────────────┬─────────────────────────────┘                 │
 * │                           │                                               │
 * │                           ▼                                               │
 * │   LOGGER (Winston / Pino)                                                │
 * │   ┌─────────────────────────────────────────────────────┐                 │
 * │   │  1. Add timestamp                                   │                 │
 * │   │  2. Add log level                                   │                 │
 * │   │  3. Add correlation ID                              │                 │
 * │   │  4. Format as JSON                                  │                 │
 * │   │  5. Filter by level (prod = info+, dev = debug+)   │                 │
 * │   │  6. Sanitize sensitive data                         │                 │
 * │   └───────────────┬────────────────┬────────────────────┘                 │
 * │                   │                │                                      │
 * │              ┌────▼────┐     ┌─────▼────────┐                            │
 * │              │ stdout  │     │ File         │                            │
 * │              │ (Docker)│     │ (traditional)│                            │
 * │              └────┬────┘     └─────┬────────┘                            │
 * │                   │                │                                      │
 * │              ┌────▼────────────────▼────────┐                            │
 * │              │  Log Aggregator               │                            │
 * │              │  (ELK Stack / Datadog /       │                            │
 * │              │   CloudWatch / Grafana Loki)  │                            │
 * │              └───────────────┬───────────────┘                            │
 * │                              │                                            │
 * │              ┌───────────────▼───────────────┐                            │
 * │              │  Search, Alert, Dashboard      │                            │
 * │              │  "Show me all errors from      │                            │
 * │              │   user 123 in last 24 hours"   │                            │
 * │              └────────────────────────────────┘                            │
 * │                                                                            │
 * │   LOG LEVELS (severity order):                                            │
 * │                                                                            │
 * │   Level     │ Num │ When to Use                                           │
 * │   ──────────┼─────┼──────────────────────────────────────                 │
 * │   error     │  0  │ Something BROKE. Needs immediate attention           │
 * │   warn      │  1  │ Something MIGHT break. Keep an eye on it             │
 * │   info      │  2  │ Normal business events. Request served, user login   │
 * │   http      │  3  │ HTTP request/response logging                        │
 * │   debug     │  4  │ Detailed technical info for debugging                │
 * │   silly     │  5  │ Everything. Extremely verbose                        │
 * │                                                                            │
 * │   Production: level=info  (shows error + warn + info)                    │
 * │   Development: level=debug (shows error + warn + info + http + debug)    │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// SECTION 1: Why console.log() Fails in Production
// ============================================================================

console.log('=== SECTION 1: Problems with console.log() in Production ===\n');

// Problem 1: No log levels
console.log('A: Problem 1 - No levels');
console.log('   console.log("Error!")  ← Is this critical? Informational? Debug?');
console.log('   No way to filter or prioritize!\n');

// Problem 2: No timestamps
console.log('B: Problem 2 - No timestamps');
console.log('   When did this happen? Was it before or after the other error?\n');

// Problem 3: No structure
console.log('C: Problem 3 - No structure');
console.log('   console.log("User", userId, "did", action)');
console.log('   Try searching through 10 million lines of this!\n');

// Problem 4: Synchronous and blocking
console.log('D: Problem 4 - console.log is SYNCHRONOUS');
console.log('   It blocks the event loop while writing to stdout');
console.log('   High-throughput apps can slow down significantly!\n');

// Problem 5: No way to disable in production
console.log('E: Problem 5 - No off switch');
console.log('   You either have ALL logs or NO logs');
console.log('   Cannot show only errors in production\n');


// ============================================================================
// SECTION 2: Building a Structured Logger (no dependencies!)
// ============================================================================

console.log('=== SECTION 2: Building a Structured Logger ===\n');

const createLogger = (options = {}) => {
  const {
    level = 'info',
    service = 'my-app',
    pretty = false,
  } = options;

  // Log level hierarchy - lower number = higher severity
  const LEVELS = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  };

  const currentLevel = LEVELS[level] ?? 2;

  // Colors for pretty printing (dev mode)
  const COLORS = {
    error: '\x1b[31m',   // red
    warn: '\x1b[33m',    // yellow
    info: '\x1b[36m',    // cyan
    http: '\x1b[35m',    // magenta
    debug: '\x1b[37m',   // white
    reset: '\x1b[0m',
  };

  // Sanitize sensitive fields
  const SENSITIVE_FIELDS = ['password', 'token', 'secret', 'authorization', 'cookie', 'ssn', 'creditCard'];

  const sanitize = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;

    const sanitized = Array.isArray(obj) ? [...obj] : { ...obj };
    for (const key of Object.keys(sanitized)) {
      if (SENSITIVE_FIELDS.some((f) => key.toLowerCase().includes(f))) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof sanitized[key] === 'object') {
        sanitized[key] = sanitize(sanitized[key]);
      }
    }
    return sanitized;
  };

  // Core log function
  const log = (levelName, message, meta = {}) => {
    // Check if this level should be logged
    if (LEVELS[levelName] > currentLevel) return;

    const entry = {
      timestamp: new Date().toISOString(),
      level: levelName,
      service,
      message,
      ...sanitize(meta),
    };

    // Add error stack if present
    if (meta.error instanceof Error) {
      entry.error = {
        name: meta.error.name,
        message: meta.error.message,
        stack: meta.error.stack,
      };
    }

    if (pretty) {
      // Human-readable format for development
      const color = COLORS[levelName] || '';
      const time = entry.timestamp.split('T')[1].replace('Z', '');
      const metaStr = Object.keys(meta).length > 0
        ? ` ${JSON.stringify(sanitize(meta))}`
        : '';
      const output = `${color}[${time}] ${levelName.toUpperCase().padEnd(5)}${COLORS.reset} ${message}${metaStr}`;
      process.stdout.write(output + '\n');
    } else {
      // JSON format for production (machine-parseable)
      process.stdout.write(JSON.stringify(entry) + '\n');
    }
  };

  // Create level methods
  const logger = {};
  Object.keys(LEVELS).forEach((lvl) => {
    logger[lvl] = (message, meta) => log(lvl, message, meta);
  });

  // Child logger (adds default meta to all logs)
  logger.child = (defaultMeta) => {
    const child = {};
    Object.keys(LEVELS).forEach((lvl) => {
      child[lvl] = (message, meta) => log(lvl, message, { ...defaultMeta, ...meta });
    });
    child.child = logger.child;
    return child;
  };

  return logger;
};

// Demo: JSON format (production)
console.log('F: Production format (JSON):');
const prodLogger = createLogger({ level: 'info', service: 'api-server' });
prodLogger.info('Server started', { port: 3000, pid: process.pid });
prodLogger.warn('High memory usage', { usedMB: 450, threshold: 500 });
prodLogger.error('Database connection failed', {
  error: new Error('ECONNREFUSED'),
  host: 'db.example.com',
  retryIn: 5000,
});
prodLogger.debug('This will NOT appear (level is info)');
console.log('');

// Demo: Pretty format (development)
console.log('G: Development format (pretty):');
const devLogger = createLogger({ level: 'debug', service: 'api-server', pretty: true });
devLogger.info('Server started', { port: 3000 });
devLogger.warn('Slow query detected', { duration: '2.3s', query: 'SELECT *' });
devLogger.error('Payment failed', { userId: 'u-123', amount: 99.99 });
devLogger.debug('Cache miss', { key: 'user:123' });
console.log('');


// ============================================================================
// SECTION 3: Sensitive Data Sanitization
// ============================================================================

console.log('=== SECTION 3: Sensitive Data Sanitization ===\n');

console.log('H: Logging with sensitive data:');
const safeLogger = createLogger({ level: 'debug', service: 'auth' });

// This would be TERRIBLE without sanitization!
safeLogger.info('User login attempt', {
  email: 'user@example.com',
  password: 'super-secret-123',       // Will be REDACTED
  authorizationToken: 'Bearer xyz',   // Will be REDACTED
  userAgent: 'Mozilla/5.0',           // Safe - not sensitive
});
console.log('');

console.log('  TRICKY: What should you NEVER log?');
console.log('    - Passwords, tokens, API keys, secrets');
console.log('    - Credit card numbers, SSNs');
console.log('    - Full request bodies (may contain PII)');
console.log('    - Authorization headers');
console.log('    - Session IDs (can be used for session hijacking)\n');


// ============================================================================
// SECTION 4: Correlation IDs (Tracing Requests)
// ============================================================================

console.log('=== SECTION 4: Correlation IDs ===\n');

const { randomUUID } = require('crypto');

// Simulate a request flowing through multiple services
const simulateRequest = () => {
  const requestId = randomUUID();
  const logger = createLogger({ level: 'debug', service: 'api', pretty: true });
  const reqLogger = logger.child({ requestId });

  // Same requestId appears in ALL logs for this request
  reqLogger.info('Incoming request', { method: 'POST', path: '/api/orders' });
  reqLogger.info('Validating input', { items: 3 });
  reqLogger.info('Checking inventory', { warehouseId: 'w-east-1' });
  reqLogger.warn('Low stock warning', { itemId: 'item-42', remaining: 2 });
  reqLogger.info('Order created', { orderId: 'ord-789', total: 149.99 });
  reqLogger.info('Response sent', { statusCode: 201, duration: '45ms' });
};

console.log('I: Request with correlation ID:');
simulateRequest();
console.log('');

console.log('  WHY correlation IDs matter:');
console.log('  In production with 1000 requests/second, logs are interleaved:');
console.log('    [req-A] Incoming request POST /orders');
console.log('    [req-B] Incoming request GET /users');
console.log('    [req-A] Validating input');
console.log('    [req-C] Incoming request PUT /products');
console.log('    [req-B] User found');
console.log('    [req-A] Order created');
console.log('  Without requestId, you cannot trace a single request flow!\n');


// ============================================================================
// SECTION 5: Log Levels Strategy
// ============================================================================

console.log('=== SECTION 5: Log Level Strategy ===\n');

const logLevelGuide = [
  {
    level: 'error',
    when: 'Something is BROKEN and needs immediate attention',
    examples: [
      'Database connection lost',
      'Unhandled exception',
      'Payment processing failure',
      'Out of memory',
    ],
    alert: 'YES - PagerDuty / on-call notification',
  },
  {
    level: 'warn',
    when: 'Something unexpected but not broken YET',
    examples: [
      'Deprecated API endpoint called',
      'Memory usage above 80%',
      'Retry attempt on failed request',
      'Rate limit approaching threshold',
    ],
    alert: 'Maybe - Slack notification',
  },
  {
    level: 'info',
    when: 'Normal business events worth recording',
    examples: [
      'Server started on port 3000',
      'User logged in',
      'Order placed successfully',
      'Deployment completed',
    ],
    alert: 'No - just for auditing',
  },
  {
    level: 'debug',
    when: 'Detailed technical information for debugging',
    examples: [
      'SQL query: SELECT * FROM users WHERE...',
      'Cache hit/miss for key user:123',
      'Request payload: { ... }',
      'WebSocket frame received',
    ],
    alert: 'Never - dev/debug only',
  },
];

logLevelGuide.forEach((item) => {
  console.log(`  ${item.level.toUpperCase()}:`);
  console.log(`    When: ${item.when}`);
  console.log(`    Alert: ${item.alert}`);
  console.log(`    Examples:`);
  item.examples.forEach((ex) => console.log(`      - ${ex}`));
  console.log('');
});


// ============================================================================
// SECTION 6: Winston vs Pino (Conceptual Comparison)
// ============================================================================

console.log('=== SECTION 6: Winston vs Pino ===\n');

const loggerComparison = [
  ['Feature',            'Winston',               'Pino'                    ],
  ['Speed',              'Slower (flexible)',      '5-10x faster'            ],
  ['Format',             'Customizable',           'JSON by default'         ],
  ['Transports',         'Many built-in',          'Separate (pino-pretty)'  ],
  ['Approach',           'Feature-rich',           'Minimal, fast'           ],
  ['Community',          'Most popular',           'Growing fast'            ],
  ['Async logging',      'Optional',               'Built-in'                ],
  ['Child loggers',      'Yes',                    'Yes (optimized)'         ],
  ['Best for',           'Feature-heavy apps',     'High-throughput APIs'    ],
];

loggerComparison.forEach((row, i) => {
  const formatted = row.map((col, j) => col.padEnd([20, 25, 25][j])).join('| ');
  console.log(`  ${formatted}`);
  if (i === 0) {
    console.log(`  ${'─'.repeat(20)}┼${'─'.repeat(25)}┼${'─'.repeat(25)}`);
  }
});
console.log('');

console.log('  TRICKY: Performance Impact of Logging');
console.log('    - console.log: ~10,000 ops/sec (BLOCKS event loop)');
console.log('    - Winston: ~30,000 ops/sec');
console.log('    - Pino: ~150,000 ops/sec (async, minimal serialization)');
console.log('    - In high-throughput APIs, logging can be the bottleneck!\n');

console.log('  TRICKY: Async vs Sync Logging');
console.log('    Sync: log is written before function returns (slow, safe)');
console.log('    Async: log is buffered and written later (fast, may lose on crash)');
console.log('    Pino uses async by default - fastest but may lose last few logs on crash');
console.log('    For critical error logs, consider sync write or flush before exit\n');


// ============================================================================
// SECTION 7: HTTP Request Logging Middleware Pattern
// ============================================================================

console.log('=== SECTION 7: HTTP Request Logging Pattern ===\n');

// Simulating an HTTP request logger middleware
const httpLoggerMiddleware = (logger) => {
  return (req, res, next) => {
    const start = process.hrtime.bigint();
    const requestId = randomUUID();

    // Attach requestId to request for downstream use
    req.requestId = requestId;
    const reqLogger = logger.child({ requestId });

    // Log when response finishes
    const originalEnd = res.end;
    res.end = (...args) => {
      const duration = Number(process.hrtime.bigint() - start) / 1e6; // ms

      reqLogger.info('HTTP Request', {
        method: req.method,
        path: req.url,
        statusCode: res.statusCode,
        duration: `${duration.toFixed(2)}ms`,
        contentLength: res.getHeader?.('content-length') || '-',
        userAgent: req.headers?.['user-agent'] || '-',
      });

      originalEnd.apply(res, args);
    };

    next();
  };
};

// Simulate requests
console.log('J: Simulated HTTP request logs:');
const httpLogger = createLogger({ level: 'info', service: 'api', pretty: true });

// Simulate a few request log entries
const requests = [
  { method: 'GET', path: '/api/users', status: 200, duration: '12.34ms' },
  { method: 'POST', path: '/api/orders', status: 201, duration: '45.67ms' },
  { method: 'GET', path: '/api/products/999', status: 404, duration: '3.21ms' },
  { method: 'DELETE', path: '/api/users/5', status: 500, duration: '102.44ms' },
];

requests.forEach((req) => {
  const level = req.status >= 500 ? 'error' : req.status >= 400 ? 'warn' : 'info';
  httpLogger[level](`${req.method} ${req.path}`, {
    statusCode: req.status,
    duration: req.duration,
  });
});
console.log('');


// ============================================================================
// SECTION 8: Log Rotation & Where to Send Logs
// ============================================================================

console.log('=== SECTION 8: Log Rotation & Destinations ===\n');

console.log('  LOG ROTATION (when writing to files):');
console.log('    Problem: Log files grow forever, fill up disk');
console.log('    Solution: Rotate based on size or time\n');

console.log('    Approaches:');
console.log('    1. winston-daily-rotate-file (Node.js level)');
console.log('    2. logrotate (OS level - Linux)');
console.log('    3. PM2 logrotate module');
console.log('    4. Docker log driver (best for containers)\n');

console.log('  MODERN APPROACH: Log to STDOUT, let infrastructure handle it');
console.log('    ┌──────────┐     ┌──────────┐     ┌───────────────┐');
console.log('    │ App      │────►│ Docker   │────►│ Log Driver    │');
console.log('    │ (stdout) │     │ captures │     │ (fluentd/     │');
console.log('    └──────────┘     │ stdout   │     │  cloudwatch)  │');
console.log('                     └──────────┘     └───────┬───────┘');
console.log('                                              │');
console.log('                                     ┌────────▼────────┐');
console.log('                                     │ Elasticsearch / │');
console.log('                                     │ Grafana Loki /  │');
console.log('                                     │ Datadog         │');
console.log('                                     └─────────────────┘\n');

console.log('  WHY stdout is best in containers:');
console.log('    1. Docker captures it automatically');
console.log('    2. No file management inside container');
console.log('    3. docker logs command works out of the box');
console.log('    4. Infrastructure handles aggregation & retention');
console.log('    5. 12-Factor App principle: treat logs as event streams\n');


// ============================================================================
// SECTION 9: Common Logging Mistakes
// ============================================================================

console.log('=== SECTION 9: Common Logging Mistakes ===\n');

const mistakes = [
  {
    mistake: 'console.log("Error: " + err)',
    problem: 'Loses stack trace, no level, no timestamp',
    fix: 'logger.error("Payment failed", { error: err, userId })',
  },
  {
    mistake: 'Logging passwords and tokens',
    problem: 'Secrets in log files accessible to anyone with log access',
    fix: 'Sanitize sensitive fields before logging',
  },
  {
    mistake: 'Logging in a hot loop',
    problem: 'for(let i=0; i<1000000; i++) logger.debug("iteration", i)',
    fix: 'Log summaries, not individual iterations',
  },
  {
    mistake: 'No correlation ID',
    problem: 'Cannot trace a request across multiple log lines',
    fix: 'Generate requestId in middleware, pass to all logs',
  },
  {
    mistake: 'Same log level for everything',
    problem: 'Cannot filter important logs from noise',
    fix: 'Use error/warn/info/debug appropriately',
  },
  {
    mistake: 'Logging full objects blindly',
    problem: 'logger.info("Request:", req) logs megabytes of circular refs',
    fix: 'Log specific fields: { method, path, userId }',
  },
  {
    mistake: 'Not logging at all ("clean code")',
    problem: 'Zero visibility when things break at 3 AM',
    fix: 'Log business events and errors. Clean != silent.',
  },
];

mistakes.forEach((m, i) => {
  console.log(`  ${i + 1}. MISTAKE: ${m.mistake}`);
  console.log(`     PROBLEM: ${m.problem}`);
  console.log(`     FIX: ${m.fix}\n`);
});


/**
 * OUTPUT:
 *   === SECTION 1: Problems with console.log() in Production ===
 *   A: Problem 1 - No levels
 *   B: Problem 2 - No timestamps
 *   C: Problem 3 - No structure
 *   D: Problem 4 - console.log is SYNCHRONOUS
 *   E: Problem 5 - No off switch
 *
 *   === SECTION 2: Building a Structured Logger ===
 *   F: Production format (JSON):
 *   {"timestamp":"...","level":"info","service":"api-server","message":"Server started",...}
 *   ...
 *   G: Development format (pretty):
 *   [12:34:56.789] INFO  Server started {"port":3000}
 *   ...
 *
 *   (Sections 3-9 continue...)
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ INTERVIEW ANSWER                                                         ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ "In production, I use structured JSON logging with a library like Pino  ║
 * ║  or Winston instead of console.log. Every log entry has a timestamp,    ║
 * ║  level (error/warn/info/debug), service name, and message. I attach a   ║
 * ║  correlation ID (requestId) in middleware so I can trace a single       ║
 * ║  request across all log lines. I set log level to 'info' in production ║
 * ║  and 'debug' in development. Sensitive data like passwords and tokens   ║
 * ║  are automatically redacted. I log to stdout and let Docker/K8s        ║
 * ║  forward logs to an aggregator like ELK or Datadog for searching and   ║
 * ║  alerting. The key gotcha is that console.log is synchronous and can    ║
 * ║  block the event loop - Pino is ~15x faster due to async logging."     ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * RUN: node docs/node/11-deployment/03-logging.js
 */
