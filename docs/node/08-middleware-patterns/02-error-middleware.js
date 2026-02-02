/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                 GOLDEN RULE: ERROR-HANDLING MIDDLEWARE                     ║
 * ║  Error middleware has 4 parameters: (err, req, res, next).                ║
 * ║  Express identifies error handlers by the 4-parameter signature.          ║
 * ║  Always place error middleware LAST. It catches everything upstream.       ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                        STORY TO REMEMBER                                  ║
 * ║                                                                            ║
 * ║  Imagine an ASSEMBLY LINE with a QUALITY CONTROL INSPECTOR at the END.    ║
 * ║                                                                            ║
 * ║  Workers (middleware) build products. If any worker finds a DEFECT,       ║
 * ║  they don't just throw the product on the floor - they put it on a       ║
 * ║  special RED CONVEYOR BELT that goes straight to the QC Inspector.        ║
 * ║                                                                            ║
 * ║  The QC Inspector (error middleware):                                     ║
 * ║    - Sits at the END of the assembly line                                 ║
 * ║    - Only receives DEFECTIVE products (errors)                            ║
 * ║    - Logs the defect, categorizes it, and decides what to do              ║
 * ║    - Normal products SKIP the inspector entirely                          ║
 * ║                                                                            ║
 * ║  The RED CONVEYOR BELT = calling next(error)                              ║
 * ║  The QC INSPECTOR = function(err, req, res, next) with 4 params          ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 *
 *  ┌──────────────────────────────────────────────────────────────────────┐
 *  │                ERROR MIDDLEWARE FLOW DIAGRAM                        │
 *  │                                                                      │
 *  │   Request                                                            │
 *  │     │                                                                │
 *  │     ▼                                                                │
 *  │  ┌──────────┐  next()  ┌──────────┐  next()  ┌──────────┐          │
 *  │  │ MW 1     │ ──────▶  │ MW 2     │ ──────▶  │ Handler  │          │
 *  │  │ (Logger) │          │ (Auth)   │          │ (Route)  │          │
 *  │  └──────────┘          └──────────┘          └──────────┘          │
 *  │       │                     │                      │                 │
 *  │       │ next(err)           │ next(err)            │ throws/         │
 *  │       │                     │                      │ next(err)       │
 *  │       └─────────────────────┴──────────────────────┘                 │
 *  │                             │                                        │
 *  │                     ┌───────▼────────┐                               │
 *  │                     │  RED CONVEYOR   │  (skips normal middleware)   │
 *  │                     └───────┬────────┘                               │
 *  │                             │                                        │
 *  │                     ┌───────▼────────┐                               │
 *  │                     │ ERROR MW       │  ◄── function(ERR,req,res,   │
 *  │                     │ (QC Inspector) │              next) - 4 PARAMS │
 *  │                     └───────┬────────┘                               │
 *  │                             │                                        │
 *  │                     ┌───────▼────────┐                               │
 *  │                     │ Error Response │  { error: "message" }        │
 *  │                     └────────────────┘                               │
 *  └──────────────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// SIMULATED EXPRESS WITH ERROR HANDLING SUPPORT
// ============================================================================

const createApp = () => {
  const middlewares = [];
  const errorHandlers = [];

  const app = {
    use: (fn) => {
      // Detect error middleware by parameter count (4 = error handler)
      if (fn.length === 4) {
        errorHandlers.push(fn);
      } else {
        middlewares.push(fn);
      }
    },

    handle: (req, res) => {
      let index = 0;

      const next = (err) => {
        if (err) {
          // Jump to error handlers (RED CONVEYOR BELT)
          let errIndex = 0;
          const nextError = (err2) => {
            if (errIndex < errorHandlers.length) {
              const handler = errorHandlers[errIndex];
              errIndex++;
              handler(err2 || err, req, res, nextError);
            }
          };
          nextError(err);
          return;
        }

        if (index < middlewares.length) {
          const mw = middlewares[index];
          index++;
          try {
            mw(req, res, next);
          } catch (thrownErr) {
            next(thrownErr); // Catch synchronous throws
          }
        }
      };

      next();
    },
  };

  return app;
};

// ============================================================================
// 1. BASIC ERROR HANDLING
// ============================================================================

console.log("╔══════════════════════════════════════════╗");
console.log("║  1. BASIC ERROR MIDDLEWARE               ║");
console.log("╚══════════════════════════════════════════╝\n");

const app1 = createApp();

// Normal middleware
app1.use((req, res, next) => {
  console.log(`[Logger] ${req.method} ${req.url}`);
  next();
});

// Route that throws an error
app1.use((req, res, next) => {
  if (req.url === "/crash") {
    // Passing error to next() - this is the RED CONVEYOR BELT
    next(new Error("Something went terribly wrong!"));
  } else {
    res.body = `Success: ${req.url}`;
    console.log(`[Handler] ${res.body}`);
  }
});

// Error middleware - 4 PARAMETERS (err, req, res, next)
app1.use((err, req, res, next) => {
  console.log(`[Error Handler] Caught: ${err.message}`);
  res.statusCode = 500;
  res.body = { error: err.message };
  console.log(`[Error Handler] Responded with 500\n`);
});

// Test: success
app1.handle({ method: "GET", url: "/home" }, {});

// Test: error
app1.handle({ method: "GET", url: "/crash" }, {});

// ============================================================================
// 2. CUSTOM ERROR CLASSES
// ============================================================================

console.log("╔══════════════════════════════════════════╗");
console.log("║  2. CUSTOM ERROR CLASSES                 ║");
console.log("╚══════════════════════════════════════════╝\n");

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

class NotFoundError extends AppError {
  constructor(resource) {
    super(`${resource} not found`, 404);
  }
}

class ValidationError extends AppError {
  constructor(field) {
    super(`Validation failed: ${field} is required`, 400);
  }
}

class UnauthorizedError extends AppError {
  constructor() {
    super("Authentication required", 401);
  }
}

const app2 = createApp();

app2.use((req, res, next) => {
  console.log(`[Request] ${req.method} ${req.url}`);
  next();
});

// Simulate different errors based on URL
app2.use((req, res, next) => {
  if (req.url === "/api/users/999") {
    next(new NotFoundError("User #999"));
  } else if (req.url === "/api/users" && req.method === "POST") {
    next(new ValidationError("email"));
  } else if (req.url === "/api/admin") {
    next(new UnauthorizedError());
  } else {
    res.body = "OK";
    console.log(`[Handler] Success\n`);
  }
});

// Error handler that categorizes errors
app2.use((err, req, res, next) => {
  if (err.isOperational) {
    // Known operational errors
    console.log(`[Error Handler] Operational Error:`);
    console.log(`  Status: ${err.statusCode}`);
    console.log(`  Message: ${err.message}`);
    res.statusCode = err.statusCode;
    res.body = { error: err.message };
  } else {
    // Unknown/programming errors
    console.log(`[Error Handler] CRITICAL - Unknown Error:`);
    console.log(`  ${err.message}`);
    res.statusCode = 500;
    res.body = { error: "Internal Server Error" };
  }
  console.log();
});

app2.handle({ method: "GET", url: "/home" }, {});
app2.handle({ method: "GET", url: "/api/users/999" }, {});
app2.handle({ method: "POST", url: "/api/users" }, {});
app2.handle({ method: "GET", url: "/api/admin" }, {});

// ============================================================================
// 3. CHAINED ERROR HANDLERS (Multiple QC Inspectors)
// ============================================================================

console.log("╔══════════════════════════════════════════╗");
console.log("║  3. CHAINED ERROR HANDLERS               ║");
console.log("╚══════════════════════════════════════════╝\n");

const app3 = createApp();

app3.use((req, res, next) => {
  next(new ValidationError("username"));
});

// Error handler 1: Log the error
app3.use((err, req, res, next) => {
  console.log(`[Error Logger] ${new Date().toISOString()} - ${err.message}`);
  next(err); // Pass to next error handler
});

// Error handler 2: Track metrics
app3.use((err, req, res, next) => {
  console.log(`[Error Metrics] Incrementing error counter for status ${err.statusCode}`);
  next(err); // Pass to next error handler
});

// Error handler 3: Send response
app3.use((err, req, res, next) => {
  console.log(`[Error Responder] Sending ${err.statusCode}: ${err.message}\n`);
  res.statusCode = err.statusCode;
  res.body = { error: err.message };
});

app3.handle({ method: "POST", url: "/api/register" }, {});

// ============================================================================
// 4. ASYNC ERROR HANDLING
// ============================================================================

console.log("╔══════════════════════════════════════════╗");
console.log("║  4. ASYNC ERROR HANDLING                 ║");
console.log("╚══════════════════════════════════════════╝\n");

const createAsyncApp = () => {
  const middlewares = [];
  const errorHandlers = [];

  const app = {
    use: (fn) => {
      if (fn.length === 4) {
        errorHandlers.push(fn);
      } else {
        middlewares.push(fn);
      }
    },

    handle: async (req, res) => {
      let index = 0;

      const next = async (err) => {
        if (err) {
          let errIndex = 0;
          const nextError = async (err2) => {
            if (errIndex < errorHandlers.length) {
              const handler = errorHandlers[errIndex];
              errIndex++;
              await handler(err2 || err, req, res, nextError);
            }
          };
          await nextError(err);
          return;
        }

        if (index < middlewares.length) {
          const mw = middlewares[index];
          index++;
          try {
            await mw(req, res, next);
          } catch (thrownErr) {
            await next(thrownErr);
          }
        }
      };

      await next();
    },
  };

  return app;
};

const app4 = createAsyncApp();

// Simulate async database call that fails
const fetchFromDatabase = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id === "999") {
        reject(new NotFoundError(`Record #${id}`));
      } else {
        resolve({ id, name: "Alice" });
      }
    }, 100);
  });
};

app4.use(async (req, res, next) => {
  console.log(`[Async Handler] Fetching record...`);
  try {
    const data = await fetchFromDatabase(req.id);
    console.log(`[Async Handler] Found: ${JSON.stringify(data)}`);
    res.body = data;
  } catch (err) {
    next(err); // Pass async error to error middleware
  }
});

app4.use((err, req, res, next) => {
  console.log(`[Async Error Handler] ${err.statusCode}: ${err.message}\n`);
  res.statusCode = err.statusCode;
  res.body = { error: err.message };
});

// Test: success
app4.handle({ id: "1" }, {}).then(() => {
  // Test: error
  return app4.handle({ id: "999" }, {});
});

// ============================================================================
// 5. CENTRALIZED ERROR HANDLING PATTERN
// ============================================================================

console.log("╔══════════════════════════════════════════╗");
console.log("║  5. CENTRALIZED ERROR HANDLING PATTERN   ║");
console.log("╚══════════════════════════════════════════╝\n");

const centralErrorHandler = (err, req, res, next) => {
  // 1. Log it
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ERROR:`);
  console.log(`  URL: ${req.method} ${req.url}`);
  console.log(`  Message: ${err.message}`);
  console.log(`  Status: ${err.statusCode || 500}`);
  console.log(`  Operational: ${err.isOperational || false}`);

  // 2. Decide response based on environment
  const isDev = true; // In production, set to false

  const response = {
    error: {
      message: err.isOperational ? err.message : "Internal Server Error",
      status: err.statusCode || 500,
    },
  };

  if (isDev) {
    response.error.stack = err.stack ? err.stack.split("\n").slice(0, 3).join(" | ") : "N/A";
  }

  res.statusCode = err.statusCode || 500;
  res.body = response;
  console.log(`  Response: ${JSON.stringify(response)}\n`);
};

const app5 = createApp();
app5.use((req, res, next) => next(new NotFoundError("Page")));
app5.use(centralErrorHandler);
app5.handle({ method: "GET", url: "/missing-page" }, {});

/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                       INTERVIEW ANSWER                                    ║
 * ║                                                                            ║
 * ║  "Error-handling middleware in Express has exactly 4 parameters:           ║
 * ║   (err, req, res, next). Express identifies it as an error handler        ║
 * ║   by the parameter count - this is NOT optional.                          ║
 * ║                                                                            ║
 * ║   When any middleware calls next(error) or throws, Express skips all      ║
 * ║   normal middleware and jumps straight to the error handler - like a      ║
 * ║   red conveyor belt sending defective products to the QC inspector.       ║
 * ║                                                                            ║
 * ║   Best practices:                                                         ║
 * ║   1. Place error middleware LAST in the stack                             ║
 * ║   2. Use custom error classes (AppError, NotFoundError, etc.)             ║
 * ║   3. Distinguish operational errors from programming bugs                 ║
 * ║   4. For async code, always catch and pass to next(err)                   ║
 * ║   5. Centralize error handling in one place for consistency"              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

// ============================================================================
// RUN: node docs/node/08-middleware-patterns/02-error-middleware.js
// ============================================================================
