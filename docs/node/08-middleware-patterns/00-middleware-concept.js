/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    GOLDEN RULE: MIDDLEWARE CONCEPT                         ║
 * ║  Middleware = functions that execute in sequence, each deciding whether    ║
 * ║  to pass control to the next one via next(). Think of it as a pipeline.   ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                        STORY TO REMEMBER                                  ║
 * ║                                                                            ║
 * ║  Imagine you're at an AIRPORT. Before you board your flight, you must     ║
 * ║  pass through a series of SECURITY CHECKPOINTS:                           ║
 * ║                                                                            ║
 * ║    1. Passport Check   - "Are you who you say you are?"                   ║
 * ║    2. Baggage Scan     - "Is your luggage safe?"                          ║
 * ║    3. Boarding Pass    - "Do you have a valid ticket?"                    ║
 * ║    4. Gate             - "Welcome aboard!"                                ║
 * ║                                                                            ║
 * ║  Each checkpoint can either:                                              ║
 * ║    - PASS you through to the next checkpoint (call next())                ║
 * ║    - REJECT you and stop the whole process (don't call next())            ║
 * ║                                                                            ║
 * ║  That's EXACTLY how middleware works. Each function in the pipeline       ║
 * ║  decides: "Should I let this request continue, or stop it here?"          ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 *
 *  ┌──────────────────────────────────────────────────────────────────────┐
 *  │                   MIDDLEWARE PIPELINE FLOW                          │
 *  │                                                                      │
 *  │   REQUEST                                                            │
 *  │     │                                                                │
 *  │     ▼                                                                │
 *  │  ┌─────────────┐   next()   ┌─────────────┐   next()                │
 *  │  │ Middleware 1 │ ────────▶  │ Middleware 2 │ ────────▶  ...         │
 *  │  │ (Passport)   │           │ (Baggage)    │                        │
 *  │  └─────────────┘           └─────────────┘                          │
 *  │        │                         │                                   │
 *  │        │ (reject)                │ (reject)                          │
 *  │        ▼                         ▼                                   │
 *  │     STOPPED                   STOPPED                                │
 *  │                                                                      │
 *  │                                                                      │
 *  │   ... ──────▶  ┌─────────────┐   next()   ┌─────────────┐          │
 *  │                │ Middleware 3 │ ────────▶  │  Final Handler│         │
 *  │                │ (Boarding)   │            │  (Gate/Board) │         │
 *  │                └─────────────┘            └─────────────┘          │
 *  │                      │                          │                    │
 *  │                      │ (reject)                 ▼                    │
 *  │                      ▼                      RESPONSE                 │
 *  │                   STOPPED                                            │
 *  └──────────────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// 1. THE SIMPLEST MIDDLEWARE PIPELINE (No Express needed)
// ============================================================================

const buildPipeline = (middlewares) => {
  // Returns a function that runs all middleware in order
  return (context) => {
    let index = 0;

    const next = () => {
      if (index < middlewares.length) {
        const currentMiddleware = middlewares[index];
        index++;
        currentMiddleware(context, next);
      }
    };

    next(); // Start the pipeline
  };
};

// ============================================================================
// 2. AIRPORT SECURITY CHECKPOINTS AS MIDDLEWARE
// ============================================================================

const passportCheck = (passenger, next) => {
  console.log(`[Checkpoint 1] Checking passport for: ${passenger.name}`);
  if (passenger.hasPassport) {
    console.log(`  ✓ Passport valid. Proceed.\n`);
    next(); // Pass to next checkpoint
  } else {
    console.log(`  ✗ No passport! REJECTED. Cannot proceed.\n`);
    // NOT calling next() = pipeline stops here
  }
};

const baggageScan = (passenger, next) => {
  console.log(`[Checkpoint 2] Scanning baggage for: ${passenger.name}`);
  if (passenger.baggageSafe) {
    console.log(`  ✓ Baggage clear. Proceed.\n`);
    next();
  } else {
    console.log(`  ✗ Prohibited items found! REJECTED.\n`);
  }
};

const boardingPassVerify = (passenger, next) => {
  console.log(`[Checkpoint 3] Verifying boarding pass for: ${passenger.name}`);
  if (passenger.hasBoardingPass) {
    console.log(`  ✓ Boarding pass valid. Proceed.\n`);
    next();
  } else {
    console.log(`  ✗ No boarding pass! REJECTED.\n`);
  }
};

const gate = (passenger, next) => {
  console.log(`[Gate] Welcome aboard, ${passenger.name}! Enjoy your flight.\n`);
  // Final step - no need to call next()
};

// Build the pipeline
const airportSecurity = buildPipeline([
  passportCheck,
  baggageScan,
  boardingPassVerify,
  gate,
]);

// Test with valid passenger
console.log("═══════════════════════════════════════");
console.log("  PASSENGER 1: Everything in order");
console.log("═══════════════════════════════════════\n");

airportSecurity({
  name: "Alice",
  hasPassport: true,
  baggageSafe: true,
  hasBoardingPass: true,
});

// Test with rejected passenger
console.log("═══════════════════════════════════════");
console.log("  PASSENGER 2: No boarding pass");
console.log("═══════════════════════════════════════\n");

airportSecurity({
  name: "Bob",
  hasPassport: true,
  baggageSafe: true,
  hasBoardingPass: false,
});

// Test with early rejection
console.log("═══════════════════════════════════════");
console.log("  PASSENGER 3: No passport at all");
console.log("═══════════════════════════════════════\n");

airportSecurity({
  name: "Charlie",
  hasPassport: false,
  baggageSafe: true,
  hasBoardingPass: true,
});

// ============================================================================
// 3. GENERIC REQUEST/RESPONSE MIDDLEWARE (Simulating HTTP)
// ============================================================================

console.log("\n═══════════════════════════════════════");
console.log("  HTTP-STYLE MIDDLEWARE PIPELINE");
console.log("═══════════════════════════════════════\n");

const createApp = () => {
  const middlewares = [];

  const app = {
    use: (fn) => {
      middlewares.push(fn);
    },
    handle: (req, res) => {
      let index = 0;

      const next = () => {
        if (index < middlewares.length) {
          const mw = middlewares[index];
          index++;
          mw(req, res, next);
        }
      };

      next();
    },
  };

  return app;
};

const app = createApp();

// Middleware 1: Logger
app.use((req, res, next) => {
  console.log(`[Logger] ${req.method} ${req.url}`);
  req.startTime = Date.now();
  next();
});

// Middleware 2: Add request ID
app.use((req, res, next) => {
  req.id = `req_${Math.random().toString(36).slice(2, 8)}`;
  console.log(`[RequestID] Assigned ID: ${req.id}`);
  next();
});

// Middleware 3: Auth check
app.use((req, res, next) => {
  if (req.headers.authorization === "Bearer secret123") {
    console.log(`[Auth] Token valid`);
    req.user = { name: "Admin" };
    next();
  } else {
    console.log(`[Auth] Unauthorized! Pipeline stopped.`);
    res.status = 401;
    res.body = "Unauthorized";
  }
});

// Middleware 4: Final handler
app.use((req, res, next) => {
  const duration = Date.now() - req.startTime;
  res.status = 200;
  res.body = `Hello ${req.user.name}! (Request ${req.id}, ${duration}ms)`;
  console.log(`[Handler] Response: ${res.body}`);
});

// Simulate a request with valid auth
const req1 = { method: "GET", url: "/api/data", headers: { authorization: "Bearer secret123" } };
const res1 = {};
app.handle(req1, res1);
console.log(`Final response: ${res1.status} - ${res1.body}\n`);

// Simulate a request with invalid auth
const req2 = { method: "GET", url: "/api/secret", headers: { authorization: "Bearer wrong" } };
const res2 = {};
app.handle(req2, res2);
console.log(`Final response: ${res2.status} - ${res2.body}`);

// ============================================================================
// 4. KEY CONCEPTS SUMMARY
// ============================================================================

/**
 *  ┌──────────────────────────────────────────────────────────────────┐
 *  │                     KEY TAKEAWAYS                               │
 *  │                                                                  │
 *  │  1. Middleware = function(context, next)                        │
 *  │  2. Calling next() passes control to the NEXT middleware        │
 *  │  3. NOT calling next() STOPS the pipeline                       │
 *  │  4. Each middleware can READ and MODIFY the context             │
 *  │  5. Order of middleware MATTERS (first added = first executed)  │
 *  │  6. The pattern: receive → process → pass or reject            │
 *  └──────────────────────────────────────────────────────────────────┘
 *
 *
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                       INTERVIEW ANSWER                                    ║
 * ║                                                                            ║
 * ║  "Middleware is a function that sits between a request and a response.     ║
 * ║   It receives the request, can modify it, and then either passes control  ║
 * ║   to the next middleware by calling next(), or stops the chain.            ║
 * ║                                                                            ║
 * ║   Think of it like airport security: each checkpoint inspects you,        ║
 * ║   can add stamps to your passport (modify context), and decides           ║
 * ║   whether to let you through or reject you.                               ║
 * ║                                                                            ║
 * ║   The key is the next() function - it's the mechanism that chains         ║
 * ║   middleware together into a pipeline. Without calling next(), the         ║
 * ║   request stops at that middleware."                                       ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

// ============================================================================
// RUN: node docs/node/08-middleware-patterns/00-middleware-concept.js
// ============================================================================
