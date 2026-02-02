/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                  GOLDEN RULE: EXPRESS MIDDLEWARE PATTERNS                  ║
 * ║  Express middleware = fn(req, res, next). app.use() registers them.       ║
 * ║  Order matters! First registered = first executed. Two levels:            ║
 * ║  application-level (app.use) and router-level (router.use).              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                        STORY TO REMEMBER                                  ║
 * ║                                                                            ║
 * ║  Imagine an ASSEMBLY LINE in a factory:                                   ║
 * ║                                                                            ║
 * ║    Worker 1 (Logger)  - stamps the time on each product                   ║
 * ║    Worker 2 (Parser)  - opens the box and reads the contents              ║
 * ║    Worker 3 (Auth)    - checks if the product has a valid serial number   ║
 * ║    Worker 4 (Handler) - processes the product and ships it out            ║
 * ║                                                                            ║
 * ║  Each worker ADDS something to the product (req object) as it passes     ║
 * ║  through. The ORDER of workers matters - you can't check the serial      ║
 * ║  number before opening the box!                                           ║
 * ║                                                                            ║
 * ║  app.use() = hiring a worker and placing them on the assembly line.       ║
 * ║  The POSITION where you place them determines WHEN they act.              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 *
 *  ┌──────────────────────────────────────────────────────────────────────┐
 *  │                EXPRESS MIDDLEWARE STACK DIAGRAM                      │
 *  │                                                                      │
 *  │   Incoming Request                                                   │
 *  │        │                                                             │
 *  │        ▼                                                             │
 *  │   ┌──────────────────────┐                                          │
 *  │   │  APPLICATION-LEVEL   │  ◄── app.use(logger)                     │
 *  │   │  Middleware           │      Runs for ALL routes                 │
 *  │   └────────┬─────────────┘                                          │
 *  │            │ next()                                                  │
 *  │            ▼                                                         │
 *  │   ┌──────────────────────┐                                          │
 *  │   │  APPLICATION-LEVEL   │  ◄── app.use(bodyParser)                 │
 *  │   │  Middleware           │      Runs for ALL routes                 │
 *  │   └────────┬─────────────┘                                          │
 *  │            │ next()                                                  │
 *  │            ▼                                                         │
 *  │   ┌──────────────────────┐                                          │
 *  │   │  ROUTER-LEVEL        │  ◄── router.use(authCheck)               │
 *  │   │  Middleware           │      Runs only for /api/* routes         │
 *  │   └────────┬─────────────┘                                          │
 *  │            │ next()                                                  │
 *  │            ▼                                                         │
 *  │   ┌──────────────────────┐                                          │
 *  │   │  ROUTE HANDLER       │  ◄── app.get('/api/data', handler)       │
 *  │   │  (Final destination)  │      Sends the response                  │
 *  │   └──────────────────────┘                                          │
 *  │            │                                                         │
 *  │            ▼                                                         │
 *  │      Response sent                                                   │
 *  └──────────────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// SIMULATED EXPRESS FRAMEWORK (No real Express needed)
// ============================================================================

const createExpress = () => {
  const appMiddlewares = [];
  const routes = {};
  const routers = {};

  const app = {
    // ── app.use() - Application-level middleware ──
    use: (pathOrFn, fn) => {
      if (typeof pathOrFn === "function") {
        appMiddlewares.push({ path: "/", handler: pathOrFn });
      } else {
        appMiddlewares.push({ path: pathOrFn, handler: fn });
      }
    },

    // ── app.get() - Route handler ──
    get: (path, ...handlers) => {
      routes[`GET:${path}`] = handlers;
    },

    post: (path, ...handlers) => {
      routes[`POST:${path}`] = handlers;
    },

    // ── Simulate an incoming request ──
    handle: (method, url, reqOverrides = {}) => {
      const req = { method, url, headers: {}, body: null, ...reqOverrides };
      const res = {
        statusCode: 200,
        _body: null,
        _headers: {},
        status: function (code) {
          this.statusCode = code;
          return this;
        },
        json: function (data) {
          this._body = JSON.stringify(data);
          this._headers["Content-Type"] = "application/json";
          console.log(`  [Response] ${this.statusCode} ${this._body}`);
        },
        send: function (data) {
          this._body = data;
          console.log(`  [Response] ${this.statusCode} ${this._body}`);
        },
        setHeader: function (key, val) {
          this._headers[key] = val;
        },
      };

      console.log(`\n── Incoming: ${method} ${url} ──`);

      // Collect applicable middleware
      const applicable = appMiddlewares.filter(
        (mw) => url.startsWith(mw.path) || mw.path === "/"
      );
      const routeHandlers = routes[`${method}:${url}`] || [];
      const allHandlers = [...applicable.map((mw) => mw.handler), ...routeHandlers];

      let index = 0;
      const next = (err) => {
        if (err) {
          console.log(`  [Error caught] ${err.message}`);
          return;
        }
        if (index < allHandlers.length) {
          const handler = allHandlers[index];
          index++;
          handler(req, res, next);
        }
      };

      next();
      return { req, res };
    },
  };

  return app;
};

// ============================================================================
// 1. APPLICATION-LEVEL MIDDLEWARE (app.use)
// ============================================================================

console.log("╔══════════════════════════════════════════╗");
console.log("║  APPLICATION-LEVEL MIDDLEWARE            ║");
console.log("╚══════════════════════════════════════════╝");

const app = createExpress();

// Middleware 1: Logger (runs for ALL requests)
app.use((req, res, next) => {
  req.startTime = Date.now();
  console.log(`  [Logger] ${req.method} ${req.url} at ${new Date().toISOString()}`);
  next();
});

// Middleware 2: Body parser simulation (runs for ALL requests)
app.use((req, res, next) => {
  if (req.rawBody) {
    try {
      req.body = JSON.parse(req.rawBody);
      console.log(`  [BodyParser] Parsed body:`, req.body);
    } catch (e) {
      console.log(`  [BodyParser] Could not parse body`);
    }
  }
  next();
});

// Middleware 3: Request ID (runs for ALL requests)
app.use((req, res, next) => {
  req.id = `req_${Math.random().toString(36).slice(2, 8)}`;
  console.log(`  [RequestID] ${req.id}`);
  next();
});

// Route handlers
app.get("/", (req, res, next) => {
  res.json({ message: "Home page", requestId: req.id });
});

app.get("/about", (req, res, next) => {
  res.json({ message: "About page", requestId: req.id });
});

app.handle("GET", "/");
app.handle("GET", "/about");

// ============================================================================
// 2. PATH-SPECIFIC MIDDLEWARE (simulating router-level)
// ============================================================================

console.log("\n╔══════════════════════════════════════════╗");
console.log("║  PATH-SPECIFIC (ROUTER-LEVEL) MIDDLEWARE ║");
console.log("╚══════════════════════════════════════════╝");

const app2 = createExpress();

// Global middleware
app2.use((req, res, next) => {
  console.log(`  [Global Logger] ${req.method} ${req.url}`);
  next();
});

// Only for /api/* paths - simulates router.use()
app2.use("/api", (req, res, next) => {
  console.log(`  [API Auth] Checking token for API route...`);
  if (req.headers.authorization === "Bearer valid-token") {
    req.user = { id: 1, role: "admin" };
    console.log(`  [API Auth] ✓ Authenticated as ${req.user.role}`);
    next();
  } else {
    console.log(`  [API Auth] ✗ Unauthorized`);
    res.status(401).json({ error: "Unauthorized" });
  }
});

// Public route - no auth needed
app2.get("/", (req, res) => {
  res.json({ message: "Public home page" });
});

// Protected API route - auth middleware runs first
app2.get("/api/users", (req, res) => {
  res.json({ users: ["Alice", "Bob"], requestedBy: req.user.role });
});

// Test: public route (auth middleware skipped)
app2.handle("GET", "/");

// Test: API route without token (rejected)
app2.handle("GET", "/api/users");

// Test: API route with valid token (accepted)
app2.handle("GET", "/api/users", { headers: { authorization: "Bearer valid-token" } });

// ============================================================================
// 3. ORDER MATTERS - Demonstrating middleware execution order
// ============================================================================

console.log("\n╔══════════════════════════════════════════╗");
console.log("║  ORDER MATTERS DEMONSTRATION             ║");
console.log("╚══════════════════════════════════════════╝");

const app3 = createExpress();

app3.use((req, res, next) => {
  req.steps = [];
  req.steps.push("Step 1: Logger");
  console.log(`  ${req.steps[req.steps.length - 1]}`);
  next();
});

app3.use((req, res, next) => {
  req.steps.push("Step 2: Auth");
  console.log(`  ${req.steps[req.steps.length - 1]}`);
  next();
});

app3.use((req, res, next) => {
  req.steps.push("Step 3: Validator");
  console.log(`  ${req.steps[req.steps.length - 1]}`);
  next();
});

app3.get("/test", (req, res) => {
  req.steps.push("Step 4: Handler");
  console.log(`  ${req.steps[req.steps.length - 1]}`);
  res.json({ steps: req.steps, message: "Middleware executed in registration order!" });
});

app3.handle("GET", "/test");

// ============================================================================
// 4. MULTIPLE HANDLERS ON A SINGLE ROUTE
// ============================================================================

console.log("\n╔══════════════════════════════════════════╗");
console.log("║  MULTIPLE HANDLERS PER ROUTE             ║");
console.log("╚══════════════════════════════════════════╝");

const app4 = createExpress();

const validateUser = (req, res, next) => {
  console.log(`  [Validate] Checking request data...`);
  if (req.body && req.body.name) {
    console.log(`  [Validate] ✓ Valid`);
    next();
  } else {
    console.log(`  [Validate] ✗ Missing name field`);
    res.status(400).json({ error: "Name is required" });
  }
};

const createUser = (req, res) => {
  console.log(`  [Create] Creating user: ${req.body.name}`);
  res.status(201).json({ id: 1, name: req.body.name, created: true });
};

// Route with inline middleware + handler: app.post('/users', validate, create)
app4.post("/users", validateUser, createUser);

// Test: missing body
app4.handle("POST", "/users", { body: {} });

// Test: valid body
app4.handle("POST", "/users", { body: { name: "Alice" } });

/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                       INTERVIEW ANSWER                                    ║
 * ║                                                                            ║
 * ║  "Express middleware are functions with the signature (req, res, next).    ║
 * ║   They are registered with app.use() and execute in the ORDER they are    ║
 * ║   registered - like workers on an assembly line.                          ║
 * ║                                                                            ║
 * ║   There are two levels:                                                   ║
 * ║   - Application-level: app.use(fn) - runs for every request              ║
 * ║   - Router-level: router.use(fn) - runs for routes under that router     ║
 * ║                                                                            ║
 * ║   Each middleware can: modify req/res, end the request-response cycle,    ║
 * ║   or call next() to pass to the next middleware. If next() is not called, ║
 * ║   the request hangs. Order is critical - a logger must come before        ║
 * ║   route handlers, and auth must come before protected routes."            ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

// ============================================================================
// RUN: node docs/node/08-middleware-patterns/01-express-middleware.js
// ============================================================================
