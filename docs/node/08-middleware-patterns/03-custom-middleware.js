/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                   GOLDEN RULE: CUSTOM MIDDLEWARE                           ║
 * ║  Build your own middleware! Each is just a function(req, res, next).       ║
 * ║  Logger, Auth, Rate Limiter, CORS - all follow the same pattern.          ║
 * ║  A middleware factory is a function that RETURNS middleware.               ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                        STORY TO REMEMBER                                  ║
 * ║                                                                            ║
 * ║  You're BUILDING YOUR OWN SECURITY CHECKPOINT for a building.             ║
 * ║                                                                            ║
 * ║  You need to build 4 stations:                                            ║
 * ║                                                                            ║
 * ║    1. CCTV Camera (Logger)       - records who enters & when              ║
 * ║    2. ID Scanner (Auth)          - verifies identity badges               ║
 * ║    3. Turnstile Counter (Rate)   - only allows 5 people per minute        ║
 * ║    4. Visitor Pass (CORS)        - decides which outsiders are allowed    ║
 * ║                                                                            ║
 * ║  Each station is a separate device you BUILD yourself. You decide:        ║
 * ║    - What it checks                                                       ║
 * ║    - How it's configured                                                  ║
 * ║    - Where to place it in the entrance line                               ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 *
 *  ┌──────────────────────────────────────────────────────────────────────┐
 *  │              CUSTOM MIDDLEWARE EXAMPLES DIAGRAM                     │
 *  │                                                                      │
 *  │   Request ──▶ ┌────────┐ ──▶ ┌────────┐ ──▶ ┌────────┐ ──▶ Route  │
 *  │               │ Logger │     │  Auth  │     │  CORS  │             │
 *  │               │        │     │        │     │        │             │
 *  │               │ Logs   │     │Checks  │     │Sets    │             │
 *  │               │ method │     │JWT/API │     │headers │             │
 *  │               │ url    │     │keys    │     │for     │             │
 *  │               │ time   │     │        │     │cross-  │             │
 *  │               │ status │     │        │     │origin  │             │
 *  │               └────────┘     └────────┘     └────────┘             │
 *  │                                  │                                   │
 *  │                                  │ (if invalid)                      │
 *  │                                  ▼                                   │
 *  │                              401 Reject                              │
 *  │                                                                      │
 *  │   ┌──────────────────────────────────────────────────────────────┐   │
 *  │   │  Rate Limiter (sits before all routes)                      │   │
 *  │   │  ┌─────────────────────────────────────────────────────┐    │   │
 *  │   │  │ IP: 192.168.1.1  │  Requests: 4/5  │  Window: 60s │    │   │
 *  │   │  │ IP: 10.0.0.5     │  Requests: 5/5  │  BLOCKED!    │    │   │
 *  │   │  └─────────────────────────────────────────────────────┘    │   │
 *  │   └──────────────────────────────────────────────────────────────┘   │
 *  └──────────────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// MINI APP FRAMEWORK (shared for all examples)
// ============================================================================

const createApp = () => {
  const middlewares = [];
  const errorHandlers = [];

  return {
    use: (fn) => {
      if (fn.length === 4) errorHandlers.push(fn);
      else middlewares.push(fn);
    },
    handle: (req, res) => {
      let i = 0;
      const next = (err) => {
        if (err) {
          let ei = 0;
          const nextErr = (e) => {
            if (ei < errorHandlers.length) {
              const h = errorHandlers[ei++];
              h(e, req, res, nextErr);
            }
          };
          nextErr(err);
          return;
        }
        if (i < middlewares.length) {
          const mw = middlewares[i++];
          try { mw(req, res, next); } catch (e) { next(e); }
        }
      };
      next();
    },
  };
};

const makeReq = (overrides = {}) => ({
  method: "GET",
  url: "/",
  headers: {},
  ip: "127.0.0.1",
  ...overrides,
});

const makeRes = () => ({
  statusCode: 200,
  _body: null,
  _headers: {},
  status(code) { this.statusCode = code; return this; },
  json(data) { this._body = data; console.log(`    [Response] ${this.statusCode} ${JSON.stringify(data)}`); },
  setHeader(k, v) { this._headers[k] = v; },
});

// ============================================================================
// 1. LOGGER MIDDLEWARE (CCTV Camera)
// ============================================================================

console.log("╔══════════════════════════════════════════╗");
console.log("║  1. CUSTOM LOGGER MIDDLEWARE             ║");
console.log("╚══════════════════════════════════════════╝\n");

/**
 * Logger Middleware Factory
 * @param {Object} options - Configuration
 * @param {boolean} options.timestamp - Show timestamps
 * @param {boolean} options.duration - Show request duration
 * @param {string} options.format - 'short' or 'detailed'
 */
const createLogger = (options = {}) => {
  const { timestamp = true, duration = true, format = "short" } = options;

  return (req, res, next) => {
    const start = Date.now();
    const time = timestamp ? `[${new Date().toISOString()}] ` : "";

    if (format === "detailed") {
      console.log(`  ${time}──────────────────────────────────`);
      console.log(`  ${time}Method:  ${req.method}`);
      console.log(`  ${time}URL:     ${req.url}`);
      console.log(`  ${time}IP:      ${req.ip}`);
      console.log(`  ${time}Headers: ${JSON.stringify(req.headers)}`);
    } else {
      console.log(`  ${time}${req.method} ${req.url} from ${req.ip}`);
    }

    // Monkey-patch res.json to log after response
    const originalJson = res.json.bind(res);
    res.json = (data) => {
      if (duration) {
        const ms = Date.now() - start;
        console.log(`  ${time}Completed ${res.statusCode} in ${ms}ms`);
      }
      originalJson(data);
    };

    next();
  };
};

// Demo: Short logger
const app1 = createApp();
app1.use(createLogger({ format: "short" }));
app1.use((req, res) => res.json({ message: "Hello" }));

console.log("── Short format:");
app1.handle(makeReq({ method: "GET", url: "/api/users" }), makeRes());

// Demo: Detailed logger
console.log("\n── Detailed format:");
const app1b = createApp();
app1b.use(createLogger({ format: "detailed" }));
app1b.use((req, res) => res.json({ message: "Hello" }));
app1b.handle(
  makeReq({ method: "POST", url: "/api/users", headers: { "content-type": "application/json" } }),
  makeRes()
);

// ============================================================================
// 2. AUTH MIDDLEWARE (ID Scanner)
// ============================================================================

console.log("\n╔══════════════════════════════════════════╗");
console.log("║  2. CUSTOM AUTH MIDDLEWARE               ║");
console.log("╚══════════════════════════════════════════╝\n");

// Simple JWT-like token (base64 encoded JSON)
const createToken = (payload) => {
  const header = Buffer.from(JSON.stringify({ alg: "HS256" })).toString("base64");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64");
  const signature = Buffer.from("fake-signature").toString("base64");
  return `${header}.${body}.${signature}`;
};

const decodeToken = (token) => {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    return JSON.parse(Buffer.from(parts[1], "base64").toString());
  } catch {
    return null;
  }
};

/**
 * Auth Middleware Factory
 * @param {Object} options
 * @param {string[]} options.publicPaths - Paths that don't require auth
 * @param {string[]} options.roles - Required roles (empty = any authenticated user)
 */
const createAuth = (options = {}) => {
  const { publicPaths = [], roles = [] } = options;

  return (req, res, next) => {
    // Skip auth for public paths
    if (publicPaths.includes(req.url)) {
      console.log(`  [Auth] ${req.url} is public, skipping auth`);
      return next();
    }

    const authHeader = req.headers.authorization || "";
    if (!authHeader.startsWith("Bearer ")) {
      console.log(`  [Auth] No token provided`);
      return res.status(401).json({ error: "Authentication required" });
    }

    const token = authHeader.slice(7);
    const payload = decodeToken(token);

    if (!payload) {
      console.log(`  [Auth] Invalid token`);
      return res.status(401).json({ error: "Invalid token" });
    }

    // Check role if required
    if (roles.length > 0 && !roles.includes(payload.role)) {
      console.log(`  [Auth] User role '${payload.role}' not in required: [${roles}]`);
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    req.user = payload;
    console.log(`  [Auth] Authenticated: ${payload.name} (${payload.role})`);
    next();
  };
};

const app2 = createApp();
const auth = createAuth({ publicPaths: ["/", "/health"], roles: ["admin"] });
app2.use(auth);
app2.use((req, res) => res.json({ message: `Welcome ${req.user ? req.user.name : "guest"}` }));

// Error handler
app2.use((err, req, res, next) => res.status(500).json({ error: err.message }));

// Test: Public path
console.log("── Public path (no auth needed):");
app2.handle(makeReq({ url: "/" }), makeRes());

// Test: No token
console.log("\n── Protected path, no token:");
app2.handle(makeReq({ url: "/api/admin" }), makeRes());

// Test: Valid token, wrong role
console.log("\n── Valid token, wrong role:");
const userToken = createToken({ name: "Alice", role: "user" });
app2.handle(makeReq({ url: "/api/admin", headers: { authorization: `Bearer ${userToken}` } }), makeRes());

// Test: Valid token, correct role
console.log("\n── Valid token, admin role:");
const adminToken = createToken({ name: "Bob", role: "admin" });
app2.handle(makeReq({ url: "/api/admin", headers: { authorization: `Bearer ${adminToken}` } }), makeRes());

// ============================================================================
// 3. RATE LIMITER MIDDLEWARE (Turnstile Counter)
// ============================================================================

console.log("\n╔══════════════════════════════════════════╗");
console.log("║  3. CUSTOM RATE LIMITER MIDDLEWARE       ║");
console.log("╚══════════════════════════════════════════╝\n");

/**
 * Rate Limiter Middleware Factory
 * @param {Object} options
 * @param {number} options.windowMs - Time window in milliseconds
 * @param {number} options.maxRequests - Max requests per window
 */
const createRateLimiter = (options = {}) => {
  const { windowMs = 60000, maxRequests = 5 } = options;
  const clients = new Map(); // IP -> { count, resetTime }

  return (req, res, next) => {
    const now = Date.now();
    const clientKey = req.ip;

    if (!clients.has(clientKey)) {
      clients.set(clientKey, { count: 0, resetTime: now + windowMs });
    }

    const client = clients.get(clientKey);

    // Reset window if expired
    if (now > client.resetTime) {
      client.count = 0;
      client.resetTime = now + windowMs;
    }

    client.count++;

    // Set rate limit headers
    const remaining = Math.max(0, maxRequests - client.count);
    res.setHeader("X-RateLimit-Limit", maxRequests);
    res.setHeader("X-RateLimit-Remaining", remaining);
    res.setHeader("X-RateLimit-Reset", client.resetTime);

    console.log(`  [RateLimit] IP: ${clientKey} | Requests: ${client.count}/${maxRequests} | Remaining: ${remaining}`);

    if (client.count > maxRequests) {
      const retryAfter = Math.ceil((client.resetTime - now) / 1000);
      console.log(`  [RateLimit] BLOCKED! Retry after ${retryAfter}s`);
      return res.status(429).json({
        error: "Too many requests",
        retryAfter: `${retryAfter}s`,
      });
    }

    next();
  };
};

const app3 = createApp();
const limiter = createRateLimiter({ windowMs: 60000, maxRequests: 3 });
app3.use(limiter);
app3.use((req, res) => res.json({ data: "Here you go!" }));

// Simulate 5 rapid requests from same IP
for (let i = 1; i <= 5; i++) {
  console.log(`── Request #${i}:`);
  app3.handle(makeReq({ ip: "192.168.1.100", url: "/api/data" }), makeRes());
  console.log();
}

// ============================================================================
// 4. CORS MIDDLEWARE (Visitor Pass System)
// ============================================================================

console.log("╔══════════════════════════════════════════╗");
console.log("║  4. CUSTOM CORS MIDDLEWARE               ║");
console.log("╚══════════════════════════════════════════╝\n");

/**
 * CORS Middleware Factory
 * @param {Object} options
 * @param {string[]} options.allowedOrigins - Allowed origin domains
 * @param {string[]} options.allowedMethods - Allowed HTTP methods
 * @param {string[]} options.allowedHeaders - Allowed request headers
 * @param {boolean} options.credentials - Allow credentials
 * @param {number} options.maxAge - Preflight cache duration in seconds
 */
const createCors = (options = {}) => {
  const {
    allowedOrigins = ["*"],
    allowedMethods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders = ["Content-Type", "Authorization"],
    credentials = false,
    maxAge = 86400,
  } = options;

  return (req, res, next) => {
    const origin = req.headers.origin || "";

    // Check if origin is allowed
    const isAllowed = allowedOrigins.includes("*") || allowedOrigins.includes(origin);

    if (isAllowed) {
      const setOrigin = allowedOrigins.includes("*") ? "*" : origin;
      res.setHeader("Access-Control-Allow-Origin", setOrigin);
      res.setHeader("Access-Control-Allow-Methods", allowedMethods.join(", "));
      res.setHeader("Access-Control-Allow-Headers", allowedHeaders.join(", "));
      res.setHeader("Access-Control-Max-Age", maxAge);

      if (credentials) {
        res.setHeader("Access-Control-Allow-Credentials", "true");
      }

      console.log(`  [CORS] Origin '${origin || "(none)"}' -> ALLOWED`);
      console.log(`  [CORS] Headers set: ${JSON.stringify(res._headers)}`);
    } else {
      console.log(`  [CORS] Origin '${origin}' -> BLOCKED`);
      return res.status(403).json({ error: `Origin ${origin} not allowed` });
    }

    // Handle preflight (OPTIONS) requests
    if (req.method === "OPTIONS") {
      console.log(`  [CORS] Preflight request handled`);
      return res.status(204).json({});
    }

    next();
  };
};

const app4 = createApp();
const cors = createCors({
  allowedOrigins: ["https://myapp.com", "https://dev.myapp.com"],
  credentials: true,
});
app4.use(cors);
app4.use((req, res) => res.json({ data: "Cross-origin data!" }));

// Test: Allowed origin
console.log("── Allowed origin:");
app4.handle(
  makeReq({ headers: { origin: "https://myapp.com" } }),
  makeRes()
);

// Test: Blocked origin
console.log("\n── Blocked origin:");
app4.handle(
  makeReq({ headers: { origin: "https://evil-site.com" } }),
  makeRes()
);

// Test: Preflight request
console.log("\n── Preflight (OPTIONS) request:");
app4.handle(
  makeReq({ method: "OPTIONS", headers: { origin: "https://dev.myapp.com" } }),
  makeRes()
);

// ============================================================================
// 5. PUTTING IT ALL TOGETHER
// ============================================================================

console.log("\n╔══════════════════════════════════════════╗");
console.log("║  5. ALL CUSTOM MIDDLEWARE COMBINED       ║");
console.log("╚══════════════════════════════════════════╝\n");

const fullApp = createApp();

// Stack them in order!
fullApp.use(createCors({ allowedOrigins: ["*"] }));
fullApp.use(createLogger({ format: "short", timestamp: false }));
fullApp.use(createRateLimiter({ maxRequests: 10 }));
fullApp.use(createAuth({ publicPaths: ["/", "/health"] }));

// Route handler
fullApp.use((req, res) => {
  res.json({
    message: `Hello ${req.user ? req.user.name : "guest"}!`,
    headers: res._headers,
  });
});

// Error handler
fullApp.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

console.log("── Full stack: public route");
fullApp.handle(
  makeReq({ url: "/", headers: { origin: "https://example.com" } }),
  makeRes()
);

console.log("\n── Full stack: authenticated route");
const token = createToken({ name: "Surya", role: "admin" });
fullApp.handle(
  makeReq({
    url: "/api/dashboard",
    headers: {
      origin: "https://example.com",
      authorization: `Bearer ${token}`,
    },
  }),
  makeRes()
);

/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                       INTERVIEW ANSWER                                    ║
 * ║                                                                            ║
 * ║  "Custom middleware follows the pattern: function(req, res, next).         ║
 * ║   I use middleware factories - functions that return middleware - so       ║
 * ║   each can be configured differently.                                     ║
 * ║                                                                            ║
 * ║   Common custom middleware I've built:                                    ║
 * ║                                                                            ║
 * ║   1. Logger: Records method, URL, IP, response time                       ║
 * ║   2. Auth: Validates JWT tokens, attaches user to req, checks roles       ║
 * ║   3. Rate Limiter: Tracks requests per IP using a Map, blocks after       ║
 * ║      threshold with 429 status and Retry-After header                     ║
 * ║   4. CORS: Sets Access-Control headers, validates origin against a        ║
 * ║      whitelist, handles preflight OPTIONS requests                        ║
 * ║                                                                            ║
 * ║   The key pattern is the middleware factory:                              ║
 * ║     const createMiddleware = (options) => (req, res, next) => { ... }     ║
 * ║   This makes middleware reusable and configurable."                        ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

// ============================================================================
// RUN: node docs/node/08-middleware-patterns/03-custom-middleware.js
// ============================================================================
