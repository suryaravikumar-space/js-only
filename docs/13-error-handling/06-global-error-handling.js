/**
 * CHALLENGE 06: Global Error Handling
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Global error handlers are your LAST LINE OF DEFENSE.                       ║
 * ║ They catch errors that slip through all other error handling.              ║
 * ║                                                                            ║
 * ║   Node.js:                                                                 ║
 * ║   • process.on('uncaughtException')   - Sync errors                        ║
 * ║   • process.on('unhandledRejection')  - Async Promise rejections           ║
 * ║                                                                            ║
 * ║   Browser:                                                                 ║
 * ║   • window.onerror                    - Sync errors                        ║
 * ║   • window.onunhandledrejection       - Async Promise rejections           ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 1. Node.js: uncaughtException
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 1. uncaughtException (Node.js) ═══\n");

// Set up the handler FIRST
process.on('uncaughtException', (error, origin) => {
  console.log('A: UNCAUGHT EXCEPTION!');
  console.log('   Error:', error.message);
  console.log('   Origin:', origin);
  console.log('   Stack:', error.stack?.split('\n')[1]);

  // In production: log to monitoring service
  // logToSentry(error);
  // logToCloudWatch(error);

  // DON'T exit here during demo, but normally you should!
  // process.exit(1);
});

// This would trigger it (commented to not crash demo)
// throw new Error('Unhandled sync error!');

console.log('B: uncaughtException handler registered\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ UNCAUGHT EXCEPTION HANDLING                                                 │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   throw new Error() ────► No try-catch ────► uncaughtException handler     │
 * │                                                                             │
 * │   ╔═══════════════════════════════════════════════════════════════════╗     │
 * │   ║ IMPORTANT: After uncaughtException, your app is in an             ║     │
 * │   ║ UNDEFINED STATE. Memory may be corrupted, resources leaked.       ║     │
 * │   ║                                                                   ║     │
 * │   ║ Best practice:                                                    ║     │
 * │   ║ 1. Log the error                                                  ║     │
 * │   ║ 2. Close connections gracefully                                   ║     │
 * │   ║ 3. Exit the process                                               ║     │
 * │   ║ 4. Let a process manager (PM2, systemd) restart                   ║     │
 * │   ╚═══════════════════════════════════════════════════════════════════╝     │
 * │                                                                             │
 * │   process.on('uncaughtException', (error) => {                             │
 * │     logger.fatal('Uncaught exception', error);                              │
 * │     server.close(() => process.exit(1));                                   │
 * │   });                                                                       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 2. Node.js: unhandledRejection
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 2. unhandledRejection (Node.js) ═══\n");

process.on('unhandledRejection', (reason, promise) => {
  console.log('C: UNHANDLED REJECTION!');
  console.log('   Reason:', reason?.message || reason);
  console.log('   Promise:', promise);

  // Option 1: Convert to uncaughtException (Node.js default since v15)
  // throw reason;

  // Option 2: Log and continue (for non-critical)
  // logger.error('Unhandled rejection', reason);
});

// This would trigger it
// Promise.reject(new Error('Unhandled async error!'));

// Also triggered by:
// async function foo() { throw new Error('oops'); }
// foo(); // No await, no .catch()

console.log('D: unhandledRejection handler registered\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ UNHANDLED REJECTION TIMELINE                                                │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Node.js Version Behavior:                                                 │
 * │                                                                             │
 * │   < 15:  Warning printed, process continues                                │
 * │   >= 15: Throws, crashes the process (like uncaughtException)              │
 * │                                                                             │
 * │   ┌─────────────────────────────────────────────────────────────────────┐   │
 * │   │  Promise.reject()                                                   │   │
 * │   │       │                                                             │   │
 * │   │       ▼                                                             │   │
 * │   │  No .catch() attached?                                              │   │
 * │   │       │                                                             │   │
 * │   │       ▼                                                             │   │
 * │   │  Event loop tick passes                                             │   │
 * │   │       │                                                             │   │
 * │   │       ▼                                                             │   │
 * │   │  'unhandledRejection' event fires                                   │   │
 * │   └─────────────────────────────────────────────────────────────────────┘   │
 * │                                                                             │
 * │   COMMON CAUSES:                                                            │
 * │   • Promise without .catch()                                                │
 * │   • async function called without await or .catch()                         │
 * │   • Error thrown inside .then() with no .catch()                            │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 3. Graceful Shutdown
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 3. Graceful Shutdown Pattern ═══\n");

class Application {
  constructor() {
    this.server = null;
    this.connections = new Set();
    this.isShuttingDown = false;
  }

  start() {
    // Simulated server
    console.log('E: Application starting...');
    this.setupErrorHandlers();
    console.log('F: Application started\n');
  }

  setupErrorHandlers() {
    // Handle process signals
    process.on('SIGTERM', () => this.shutdown('SIGTERM'));
    process.on('SIGINT', () => this.shutdown('SIGINT'));

    // Handle uncaught errors
    process.on('uncaughtException', (error) => {
      console.log('G: Fatal error:', error.message);
      this.shutdown('uncaughtException');
    });

    process.on('unhandledRejection', (reason) => {
      console.log('H: Unhandled rejection:', reason);
      this.shutdown('unhandledRejection');
    });
  }

  async shutdown(signal) {
    if (this.isShuttingDown) return;
    this.isShuttingDown = true;

    console.log(`I: Received ${signal}. Starting graceful shutdown...`);

    // 1. Stop accepting new connections
    console.log('   - Stop accepting connections');

    // 2. Wait for existing requests to complete
    console.log('   - Wait for pending requests');

    // 3. Close database connections
    console.log('   - Close database connections');

    // 4. Flush logs
    console.log('   - Flush logs');

    // 5. Exit
    console.log('J: Shutdown complete');
    // process.exit(signal === 'uncaughtException' ? 1 : 0);
  }
}

const app = new Application();
app.start();

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ GRACEFUL SHUTDOWN SEQUENCE                                                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Signal Received (SIGTERM, SIGINT, uncaughtException)                      │
 * │           │                                                                 │
 * │           ▼                                                                 │
 * │   ┌─────────────────────────────────────────────────────────────────────┐   │
 * │   │  1. Set "isShuttingDown" flag                                       │   │
 * │   │     (Reject new incoming requests)                                  │   │
 * │   └─────────────────────────────────────────────────────────────────────┘   │
 * │           │                                                                 │
 * │           ▼                                                                 │
 * │   ┌─────────────────────────────────────────────────────────────────────┐   │
 * │   │  2. Wait for in-flight requests                                     │   │
 * │   │     (With timeout - don't wait forever)                             │   │
 * │   └─────────────────────────────────────────────────────────────────────┘   │
 * │           │                                                                 │
 * │           ▼                                                                 │
 * │   ┌─────────────────────────────────────────────────────────────────────┐   │
 * │   │  3. Close resources                                                 │   │
 * │   │     - Database connections                                          │   │
 * │   │     - Redis connections                                             │   │
 * │   │     - File handles                                                  │   │
 * │   └─────────────────────────────────────────────────────────────────────┘   │
 * │           │                                                                 │
 * │           ▼                                                                 │
 * │   ┌─────────────────────────────────────────────────────────────────────┐   │
 * │   │  4. Flush logs and metrics                                          │   │
 * │   └─────────────────────────────────────────────────────────────────────┘   │
 * │           │                                                                 │
 * │           ▼                                                                 │
 * │       process.exit(0 or 1)                                                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 4. Browser: window.onerror
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 4. Browser Global Handlers (reference) ═══\n");

console.log(`K: Browser equivalent code:

// For synchronous errors
window.onerror = function(message, source, lineno, colno, error) {
  console.log('Global error:', message);
  console.log('Source:', source, 'Line:', lineno);

  // Send to error tracking service
  sendToErrorService({
    message,
    source,
    lineno,
    colno,
    stack: error?.stack
  });

  // Return true to prevent default browser error handling
  return true;
};

// For unhandled promise rejections
window.onunhandledrejection = function(event) {
  console.log('Unhandled rejection:', event.reason);

  // Prevent default console error
  event.preventDefault();

  // Log to service
  sendToErrorService({
    type: 'unhandledrejection',
    reason: event.reason
  });
};
`);

console.log('');


// ═══════════════════════════════════════════════════════════════════════════════
// 5. Domain-specific Error Handling (Express.js pattern)
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 5. Express.js Error Middleware Pattern ═══\n");

// Express-style error handling middleware
function errorHandler(err, req, res, next) {
  // Log the error
  console.log('L: Error caught by middleware:', err.message);

  // Determine if operational or programming error
  const isOperational = err.isOperational || false;

  if (isOperational) {
    // Expected error - send appropriate response
    return {
      status: err.statusCode || 400,
      body: { error: err.message }
    };
  } else {
    // Programming error - don't leak details
    console.log('   Programming error - hiding details from user');
    return {
      status: 500,
      body: { error: 'Internal server error' }
    };
  }
}

// Simulate Express middleware chain
class MockExpress {
  constructor() {
    this.handlers = [];
    this.errorHandlers = [];
  }

  use(handler) {
    if (handler.length === 4) {
      this.errorHandlers.push(handler);
    } else {
      this.handlers.push(handler);
    }
  }

  async handle(req) {
    try {
      for (const handler of this.handlers) {
        await handler(req, null, () => {});
      }
    } catch (err) {
      for (const errorHandler of this.errorHandlers) {
        return errorHandler(err, req, null, () => {});
      }
    }
  }
}

// Demo
const mockApp = new MockExpress();

mockApp.use((req, res, next) => {
  if (req.path === '/error') {
    const err = new Error('Something went wrong');
    err.isOperational = true;
    err.statusCode = 400;
    throw err;
  }
  next();
});

mockApp.use(errorHandler);

// Test
mockApp.handle({ path: '/error' }).then(response => {
  console.log('M: Response:', response);
  console.log('');
});

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ EXPRESS ERROR HANDLING FLOW                                                 │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Request ──► Middleware 1 ──► Middleware 2 ──► Route Handler              │
 * │                   │                │                 │                      │
 * │               throw?           throw?            throw?                     │
 * │                   │                │                 │                      │
 * │                   └────────────────┴─────────────────┘                      │
 * │                                    │                                        │
 * │                                    ▼                                        │
 * │                   ┌────────────────────────────────────┐                   │
 * │                   │  Error Middleware (4 args)         │                   │
 * │                   │  function(err, req, res, next)     │                   │
 * │                   └────────────────────────────────────┘                   │
 * │                                    │                                        │
 * │                   ┌────────────────┴────────────────┐                       │
 * │                   │                                 │                       │
 * │            Operational?                     Programming?                    │
 * │                   │                                 │                       │
 * │                   ▼                                 ▼                       │
 * │         Send error details              Send generic message               │
 * │         to client                       Log full details                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Global error handlers are the last line of defense for errors that        │
 * │  escape all other error handling.                                           │
 * │                                                                             │
 * │  In Node.js:                                                                │
 * │  - process.on('uncaughtException') catches synchronous errors              │
 * │  - process.on('unhandledRejection') catches Promise rejections             │
 * │                                                                             │
 * │  After uncaughtException, the app is in an undefined state. Best           │
 * │  practice is to log the error, close connections gracefully, then          │
 * │  exit and let a process manager like PM2 restart.                          │
 * │                                                                             │
 * │  Since Node 15, unhandled rejections crash the process by default.         │
 * │                                                                             │
 * │  For Express, I use error middleware (4 parameters) at the end of          │
 * │  the middleware chain. It distinguishes operational errors (bad            │
 * │  user input, known issues) from programming errors. Operational            │
 * │  errors return details to the client; programming errors return            │
 * │  generic 500s to avoid leaking implementation details.                     │
 * │                                                                             │
 * │  In browsers, window.onerror and window.onunhandledrejection serve         │
 * │  similar purposes, often used to send errors to monitoring services        │
 * │  like Sentry or LogRocket."                                                │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/13-error-handling/06-global-error-handling.js
 */
