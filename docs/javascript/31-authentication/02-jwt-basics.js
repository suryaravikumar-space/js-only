/**
 * AUTHENTICATION: 02 - JWT Basics
 *
 * ONE CONCEPT: Self-contained signed tokens for stateless authentication
 */


// =============================================================================
// WHAT IS A JWT?
// =============================================================================

console.log('=== JWT (JSON Web Token) ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  JWT STRUCTURE: header.payload.signature                            │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  eyJhbGciOi...  .  eyJ1c2VySWQi...  .  SflKxwRJSM...             │
 *   │  ─────────────     ──────────────────    ─────────────             │
 *   │    HEADER             PAYLOAD             SIGNATURE                │
 *   │                                                                      │
 *   │  HEADER (algorithm + type):                                        │
 *   │  {                                                                  │
 *   │    "alg": "HS256",       ← Signing algorithm                     │
 *   │    "typ": "JWT"                                                    │
 *   │  }                                                                  │
 *   │                                                                      │
 *   │  PAYLOAD (claims / data):                                           │
 *   │  {                                                                  │
 *   │    "sub": "user123",     ← Subject (user ID)                     │
 *   │    "name": "John",       ← Custom claim                          │
 *   │    "role": "admin",      ← Custom claim                          │
 *   │    "iat": 1700000000,    ← Issued at                             │
 *   │    "exp": 1700003600     ← Expires (1 hour later)                │
 *   │  }                                                                  │
 *   │                                                                      │
 *   │  SIGNATURE:                                                         │
 *   │  HMACSHA256(                                                        │
 *   │    base64(header) + "." + base64(payload),                        │
 *   │    secret                                                           │
 *   │  )                                                                  │
 *   │                                                                      │
 *   │  ⚠ Payload is NOT encrypted — just base64 encoded!                │
 *   │    Anyone can DECODE it. Signature prevents TAMPERING.             │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

// Simulate JWT structure
const header = { alg: 'HS256', typ: 'JWT' };
const payload = { sub: 'user123', name: 'John', role: 'admin', iat: 1700000000, exp: 1700003600 };

const base64Header = Buffer.from(JSON.stringify(header)).toString('base64url');
const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64url');
console.log(`Header:  ${base64Header}`);
console.log(`Payload: ${base64Payload}`);
console.log(`Token:   ${base64Header}.${base64Payload}.<signature>`);
console.log('\n⚠ Payload is readable (base64), NOT encrypted!');
console.log('Signature only prevents tampering');


// =============================================================================
// JWT AUTH FLOW
// =============================================================================

console.log('\n=== JWT Auth Flow ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  JWT AUTH FLOW                                                       │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  1. Login                                                            │
 *   │     POST /login { email, password }                                │
 *   │     Server validates → creates JWT → sends to client              │
 *   │                                                                      │
 *   │  2. Client stores token                                             │
 *   │     Option A: httpOnly cookie (recommended)                        │
 *   │     Option B: memory (SPA, lost on refresh)                        │
 *   │     Option C: localStorage (⚠ XSS vulnerable)                     │
 *   │                                                                      │
 *   │  3. Client sends token with requests                               │
 *   │     Authorization: Bearer eyJhbGciOi...                           │
 *   │     (or automatically via cookie)                                   │
 *   │                                                                      │
 *   │  4. Server verifies token                                           │
 *   │     Check signature (not tampered?)                                │
 *   │     Check expiry (not expired?)                                    │
 *   │     Extract user info from payload                                 │
 *   │     NO DATABASE LOOKUP needed!                                     │
 *   │                                                                      │
 *   │  5. Server responds with user-specific data                        │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Login → server creates JWT → client stores it');
console.log('Requests: send JWT in Authorization header or cookie');
console.log('Server verifies signature + expiry → no DB lookup!');


// =============================================================================
// JWT PROS & CONS
// =============================================================================

console.log('\n=== Pros & Cons ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  JWT TRADE-OFFS                                                      │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  PROS:                                                               │
 *   │  ✓ Stateless — no server-side storage needed                       │
 *   │  ✓ Scalable — any server can verify                                │
 *   │  ✓ Cross-domain — works with CORS, mobile, APIs                   │
 *   │  ✓ Self-contained — payload has user info                          │
 *   │  ✓ No CSRF risk (if sent in header, not cookie)                   │
 *   │                                                                      │
 *   │  CONS:                                                               │
 *   │  ✗ Can't revoke (until it expires)                                 │
 *   │  ✗ Larger than session ID (~800 bytes vs ~32 bytes)               │
 *   │  ✗ Payload is readable (don't put secrets)                        │
 *   │  ✗ Token theft = full access until expiry                         │
 *   │  ✗ Must handle token refresh logic                                │
 *   │                                                                      │
 *   │  REVOCATION WORKAROUNDS:                                            │
 *   │  • Short expiry (15min) + refresh tokens                          │
 *   │  • Token blacklist in Redis (defeats stateless benefit)           │
 *   │  • Token version in DB (increment on logout)                      │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('✓ Stateless, scalable, cross-domain');
console.log('✗ Can\'t easily revoke, payload readable, larger size');
console.log('Fix: short expiry (15min) + refresh tokens');


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "A JWT has three base64-encoded parts: header (algorithm), payload
 * (user data and claims like expiry), and signature (HMAC or RSA).
 * The payload isn't encrypted — anyone can decode it — but the
 * signature prevents tampering. If someone modifies the payload, the
 * signature won't match.
 *
 * JWTs are stateless: the server doesn't store anything. Any server
 * with the secret key can verify the token and extract user info
 * without a database lookup. This makes them great for distributed
 * systems and APIs.
 *
 * The main trade-off is revocation. Once issued, a JWT is valid until
 * it expires. If a user logs out or is compromised, you can't
 * invalidate the token without server-side state. I handle this with
 * short-lived access tokens (15 minutes) paired with longer-lived
 * refresh tokens. The access token is used for API calls, and when
 * it expires, the refresh token gets a new one."
 */


// RUN: node docs/31-authentication/02-jwt-basics.js
