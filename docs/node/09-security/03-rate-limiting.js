/**
 * TOPIC 03: Rate Limiting Patterns (DEFENSIVE Security Education)
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Every public endpoint MUST have a rate limit. No exceptions.              ║
 * ║ Without rate limiting, one attacker can bring down your entire service.   ║
 * ║                                                                            ║
 * ║   Fixed Window   = simple counter per time window                         ║
 * ║   Sliding Window = smoother, prevents burst at window edges               ║
 * ║   Token Bucket   = allows controlled bursts                               ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  Think of rate limiting as a WATER FAUCET:                                 │
 * │                                                                             │
 * │  1. FIXED WINDOW = A faucet that resets every hour                         │
 * │     - You get 100 cups per hour, counter resets at :00                     │
 * │     - Problem: Use 99 at :59, get 100 more at :00 = 199 in 2 minutes!    │
 * │                                                                             │
 * │  2. SLIDING WINDOW = A faucet that forgets old usage gradually            │
 * │     - Tracks WHEN each cup was used over the last 60 minutes              │
 * │     - No burst exploit at window boundaries                                │
 * │                                                                             │
 * │  3. TOKEN BUCKET = A bucket that fills with tokens over time              │
 * │     - Bucket holds max 10 tokens, gets 1 new token per second             │
 * │     - Each request costs 1 token. Burst allowed if bucket is full!        │
 * │     - Empty bucket = WAIT for refill                                       │
 * │                                                                             │
 * │  "Rate limiting is the difference between a service and a crash."        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM: Rate Limiting Algorithms                                   │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  FIXED WINDOW:                                                             │
 * │  ┌───────────────┐  ┌───────────────┐                                     │
 * │  │ Window 1      │  │ Window 2      │                                     │
 * │  │ :00 ───── :59 │  │ :00 ───── :59 │                                     │
 * │  │ count: 98/100 │  │ count: 0/100  │  ← Counter RESETS                   │
 * │  └───────────────┘  └───────────────┘                                     │
 * │                                                                             │
 * │  SLIDING WINDOW:                                                           │
 * │  ────────[=========60min window=========]──────▶ time                     │
 * │          ^ always looks back 60 min from NOW                               │
 * │                                                                             │
 * │  TOKEN BUCKET:                                                             │
 * │  ┌─────────┐                                                               │
 * │  │ ● ● ● ● │ ← bucket (max 10 tokens)                                    │
 * │  │ ● ● ●   │   refills at 1/sec                                           │
 * │  └────┬────┘   request takes 1 token                                      │
 * │       ▼                                                                     │
 * │  tokens > 0 → ALLOW     tokens = 0 → DENY (429)                           │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// 1. FIXED WINDOW RATE LIMITER
// ============================================================================

console.log('=== 1. FIXED WINDOW Rate Limiter ===\n');

class FixedWindowLimiter {
  constructor(maxRequests, windowMs) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.windows = new Map(); // key -> { count, windowStart }
  }

  isAllowed(key) {
    const now = Date.now();
    const record = this.windows.get(key);

    if (!record || now - record.windowStart >= this.windowMs) {
      // New window
      this.windows.set(key, { count: 1, windowStart: now });
      return { allowed: true, remaining: this.maxRequests - 1 };
    }

    if (record.count < this.maxRequests) {
      record.count++;
      return { allowed: true, remaining: this.maxRequests - record.count };
    }

    return { allowed: false, remaining: 0, retryAfter: Math.ceil((record.windowStart + this.windowMs - now) / 1000) };
  }
}

const fixedLimiter = new FixedWindowLimiter(5, 60000); // 5 requests per 60 seconds
const clientIp = '192.168.1.100';

console.log('A:', 'Fixed Window: 5 requests per 60 seconds');
for (let i = 1; i <= 7; i++) {
  const result = fixedLimiter.isAllowed(clientIp);
  console.log(`B:   Request ${i}: ${result.allowed ? 'ALLOWED' : 'BLOCKED'} (remaining: ${result.remaining}${result.retryAfter ? `, retry in ${result.retryAfter}s` : ''})`);
}

// ============================================================================
// 2. SLIDING WINDOW RATE LIMITER
// ============================================================================

console.log('\n=== 2. SLIDING WINDOW Rate Limiter ===\n');

class SlidingWindowLimiter {
  constructor(maxRequests, windowMs) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map(); // key -> [timestamp, timestamp, ...]
  }

  isAllowed(key) {
    const now = Date.now();
    let timestamps = this.requests.get(key) || [];

    // Remove expired timestamps
    timestamps = timestamps.filter((ts) => now - ts < this.windowMs);

    if (timestamps.length < this.maxRequests) {
      timestamps.push(now);
      this.requests.set(key, timestamps);
      return { allowed: true, remaining: this.maxRequests - timestamps.length, windowUsed: timestamps.length };
    }

    const oldestInWindow = timestamps[0];
    const retryAfter = Math.ceil((oldestInWindow + this.windowMs - now) / 1000);
    return { allowed: false, remaining: 0, retryAfter, windowUsed: timestamps.length };
  }
}

const slidingLimiter = new SlidingWindowLimiter(3, 10000); // 3 requests per 10 seconds

console.log('C:', 'Sliding Window: 3 requests per 10 seconds');
for (let i = 1; i <= 5; i++) {
  const result = slidingLimiter.isAllowed('user-42');
  console.log(`D:   Request ${i}: ${result.allowed ? 'ALLOWED' : 'BLOCKED'} (used: ${result.windowUsed}, remaining: ${result.remaining})`);
}

// ============================================================================
// 3. TOKEN BUCKET RATE LIMITER
// ============================================================================

console.log('\n=== 3. TOKEN BUCKET Rate Limiter ===\n');

class TokenBucket {
  constructor(maxTokens, refillRate) {
    this.maxTokens = maxTokens;
    this.refillRate = refillRate; // tokens per second
    this.buckets = new Map(); // key -> { tokens, lastRefill }
  }

  _refill(bucket) {
    const now = Date.now();
    const elapsed = (now - bucket.lastRefill) / 1000;
    bucket.tokens = Math.min(this.maxTokens, bucket.tokens + elapsed * this.refillRate);
    bucket.lastRefill = now;
    return bucket;
  }

  consume(key, tokens = 1) {
    let bucket = this.buckets.get(key);
    if (!bucket) {
      bucket = { tokens: this.maxTokens, lastRefill: Date.now() };
      this.buckets.set(key, bucket);
    }

    this._refill(bucket);

    if (bucket.tokens >= tokens) {
      bucket.tokens -= tokens;
      return { allowed: true, tokensLeft: Math.floor(bucket.tokens) };
    }

    const waitTime = Math.ceil((tokens - bucket.tokens) / this.refillRate);
    return { allowed: false, tokensLeft: Math.floor(bucket.tokens), retryInSeconds: waitTime };
  }
}

const tokenBucket = new TokenBucket(5, 2); // 5 max tokens, refills 2/sec

console.log('E:', 'Token Bucket: max 5 tokens, refills 2/sec');
for (let i = 1; i <= 7; i++) {
  const result = tokenBucket.consume('api-client-1');
  console.log(`F:   Request ${i}: ${result.allowed ? 'ALLOWED' : 'BLOCKED'} (tokens left: ${result.tokensLeft}${result.retryInSeconds ? `, wait ${result.retryInSeconds}s` : ''})`);
}

// ============================================================================
// 4. EXPRESS-RATE-LIMIT CONFIGURATION (Conceptual)
// ============================================================================

console.log('\n=== 4. express-rate-limit Configuration Patterns ===\n');

const expressRateLimitConfigs = {
  // Global API limiter
  global: `const rateLimit = require('express-rate-limit');

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 100,                     // 100 requests per window
  message: { error: 'Too many requests, try again later' },
  standardHeaders: true,        // Return rate limit info in headers
  legacyHeaders: false,
});
app.use('/api/', globalLimiter);`,

  // Strict auth limiter
  auth: `const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,                       // Only 5 login attempts per 15 min
  skipSuccessfulRequests: true,  // Don't count successful logins
  message: { error: 'Too many login attempts' },
});
app.use('/api/auth/login', authLimiter);`,

  // Per-user with key generator
  perUser: `const userLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  keyGenerator: (req) => req.user?.id || req.ip,  // Rate limit by user ID or IP
});`,
};

console.log('G:', 'Global API limiter (100 req / 15 min):');
console.log(`H:   ${expressRateLimitConfigs.global}`);
console.log('\nI:', 'Auth route limiter (5 attempts / 15 min):');
console.log(`J:   ${expressRateLimitConfigs.auth}`);
console.log('\nK:', 'Per-user limiter (30 req / min):');
console.log(`L:   ${expressRateLimitConfigs.perUser}`);

// ============================================================================
// 5. RATE LIMIT RESPONSE HEADERS
// ============================================================================

console.log('\n=== 5. Rate Limit Response Headers ===\n');

const buildRateLimitHeaders = (limit, remaining, resetTime) => {
  return {
    'RateLimit-Limit': limit,
    'RateLimit-Remaining': remaining,
    'RateLimit-Reset': resetTime,
    'Retry-After': remaining === 0 ? resetTime : undefined,
  };
};

const headers = buildRateLimitHeaders(100, 42, 1706600000);
console.log('M:', 'Standard rate limit headers:');
Object.entries(headers).forEach(([key, value]) => {
  if (value !== undefined) console.log(`N:   ${key}: ${value}`);
});

const blockedHeaders = buildRateLimitHeaders(100, 0, 58);
console.log('\nO:', 'When rate limited (429 Too Many Requests):');
Object.entries(blockedHeaders).forEach(([key, value]) => {
  if (value !== undefined) console.log(`P:   ${key}: ${value}`);
});

// ============================================================================
// 6. ALGORITHM COMPARISON
// ============================================================================

console.log('\n=== 6. Algorithm Comparison ===\n');

const algorithms = [
  {
    name: 'Fixed Window',
    pros: 'Simple, low memory, fast',
    cons: 'Burst at window edges (2x spike)',
    useCase: 'General API rate limiting',
  },
  {
    name: 'Sliding Window',
    pros: 'No edge burst, accurate',
    cons: 'Higher memory (stores timestamps)',
    useCase: 'Precise rate control needed',
  },
  {
    name: 'Token Bucket',
    pros: 'Allows controlled bursts, smooth',
    cons: 'More complex to implement',
    useCase: 'APIs needing burst tolerance',
  },
  {
    name: 'Leaky Bucket',
    pros: 'Constant output rate',
    cons: 'No burst allowed at all',
    useCase: 'Strict constant-rate processing',
  },
];

algorithms.forEach((algo) => {
  console.log(`Q: ${algo.name}:`);
  console.log(`R:   Pros: ${algo.pros}`);
  console.log(`R:   Cons: ${algo.cons}`);
  console.log(`R:   Best for: ${algo.useCase}\n`);
});

// ============================================================================
// 7. DDoS PROTECTION LAYERS
// ============================================================================

console.log('=== 7. DDoS Protection Layers ===\n');

const ddosLayers = [
  { layer: 'L1 - CDN/Edge', tool: 'Cloudflare, AWS Shield', blocks: 'Volumetric attacks before hitting server' },
  { layer: 'L2 - Load Balancer', tool: 'Nginx, HAProxy', blocks: 'Connection limits, IP blocking' },
  { layer: 'L3 - App Rate Limit', tool: 'express-rate-limit', blocks: 'Per-route and per-user limits' },
  { layer: 'L4 - Business Logic', tool: 'Custom middleware', blocks: 'Account lockout, CAPTCHA triggers' },
];

ddosLayers.forEach((layer) => {
  console.log(`S: ${layer.layer}: ${layer.tool} → ${layer.blocks}`);
});

/**
 * OUTPUT:
 *   === 1. FIXED WINDOW Rate Limiter ===
 *
 *   A: Fixed Window: 5 requests per 60 seconds
 *   B:   Request 1: ALLOWED (remaining: 4)
 *   B:   Request 2: ALLOWED (remaining: 3)
 *   B:   Request 3: ALLOWED (remaining: 2)
 *   B:   Request 4: ALLOWED (remaining: 1)
 *   B:   Request 5: ALLOWED (remaining: 0)
 *   B:   Request 6: BLOCKED (remaining: 0, retry in 60s)
 *   B:   Request 7: BLOCKED (remaining: 0, retry in 60s)
 *
 *   === 2. SLIDING WINDOW Rate Limiter ===
 *
 *   C: Sliding Window: 3 requests per 10 seconds
 *   D:   Request 1: ALLOWED (used: 1, remaining: 2)
 *   D:   Request 2: ALLOWED (used: 2, remaining: 1)
 *   D:   Request 3: ALLOWED (used: 3, remaining: 0)
 *   D:   Request 4: BLOCKED (used: 3, remaining: 0)
 *   D:   Request 5: BLOCKED (used: 3, remaining: 0)
 *
 *   === 3. TOKEN BUCKET Rate Limiter ===
 *
 *   E: Token Bucket: max 5 tokens, refills 2/sec
 *   F:   Request 1-5: ALLOWED (tokens decreasing)
 *   F:   Request 6-7: BLOCKED (tokens left: 0)
 *
 *   === 4-7: Configuration patterns, headers, comparisons, DDoS layers ===
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Rate limiting prevents abuse by capping requests per client per time     │
 * │  window. The three main algorithms are: Fixed Window (simple counter,     │
 * │  resets each period - fast but allows edge bursts), Sliding Window        │
 * │  (tracks individual timestamps - accurate but more memory), and Token     │
 * │  Bucket (refills tokens over time - allows controlled bursts). In         │
 * │  Express, I use express-rate-limit with stricter limits on auth routes    │
 * │  (5 attempts/15min) vs general API (100 req/15min). I set standard       │
 * │  RateLimit headers so clients know their quota. For production DDoS       │
 * │  protection, rate limiting is just one layer - combine with CDN, load    │
 * │  balancer limits, and business logic controls like CAPTCHA."             │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/09-security/03-rate-limiting.js
 */
