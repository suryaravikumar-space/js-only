/**
 * AUTHENTICATION: 01 - Session-Based Authentication
 *
 * ONE CONCEPT: Server stores session state, client holds session ID cookie
 */


// =============================================================================
// HOW SESSIONS WORK
// =============================================================================

console.log('=== Session-Based Auth ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  SESSION-BASED AUTH FLOW                                            │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  1. User sends credentials                                         │
 *   │     POST /login { email, password }                                │
 *   │     │                                                               │
 *   │     ▼                                                               │
 *   │  2. Server validates credentials                                    │
 *   │     Compare hashed password (bcrypt)                               │
 *   │     │                                                               │
 *   │     ▼                                                               │
 *   │  3. Server creates session                                          │
 *   │     Store in: memory, Redis, or database                           │
 *   │     { sessionId: "abc123", userId: 42, role: "admin" }            │
 *   │     │                                                               │
 *   │     ▼                                                               │
 *   │  4. Server sends session ID in cookie                              │
 *   │     Set-Cookie: sid=abc123; HttpOnly; Secure; SameSite=Lax       │
 *   │     │                                                               │
 *   │     ▼                                                               │
 *   │  5. Browser auto-sends cookie on every request                     │
 *   │     Cookie: sid=abc123                                              │
 *   │     │                                                               │
 *   │     ▼                                                               │
 *   │  6. Server looks up session by ID                                   │
 *   │     Redis: GET session:abc123 → { userId: 42 }                   │
 *   │     │                                                               │
 *   │     ▼                                                               │
 *   │  7. Server responds with user-specific data                        │
 *   │                                                                      │
 *   │  LOGOUT: Server deletes session from store                        │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Login: validate → create session → set cookie');
console.log('Subsequent requests: browser sends cookie → server looks up session');
console.log('Logout: server deletes session');


// =============================================================================
// SESSION STORAGE OPTIONS
// =============================================================================

console.log('\n=== Session Storage ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  WHERE TO STORE SESSIONS                                            │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  IN-MEMORY (default express-session):                               │
 *   │  ✓ Fastest                                                          │
 *   │  ✗ Lost on server restart                                          │
 *   │  ✗ Can't share across servers                                      │
 *   │  → Only for development                                            │
 *   │                                                                      │
 *   │  REDIS:                                                              │
 *   │  ✓ Fast (in-memory store)                                          │
 *   │  ✓ Shared across servers                                           │
 *   │  ✓ TTL (auto-expire sessions)                                     │
 *   │  ✓ Persists across restarts                                        │
 *   │  → Best for production                                             │
 *   │                                                                      │
 *   │  DATABASE (PostgreSQL, MongoDB):                                    │
 *   │  ✓ Persistent, shared                                              │
 *   │  ✗ Slower (disk I/O)                                               │
 *   │  → OK for low traffic, audit requirements                         │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Development: in-memory (simple)');
console.log('Production:  Redis (fast, shared, TTL)');
console.log('Low traffic: database (persistent, auditable)');


// =============================================================================
// SECURITY CONSIDERATIONS
// =============================================================================

console.log('\n=== Session Security ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  SESSION SECURITY                                                    │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  COOKIE FLAGS (all required!):                                      │
 *   │  HttpOnly   → JS can't read (prevents XSS stealing session)      │
 *   │  Secure     → HTTPS only (prevents MitM interception)             │
 *   │  SameSite   → Lax or Strict (prevents CSRF)                      │
 *   │  Path=/     → Available on all routes                              │
 *   │                                                                      │
 *   │  SESSION HIJACKING PREVENTION:                                      │
 *   │  • Regenerate session ID after login (prevent fixation)           │
 *   │  • Set short expiry (e.g., 24h)                                   │
 *   │  • Bind to IP/user-agent (optional, breaks mobile)               │
 *   │  • Use HTTPS everywhere                                            │
 *   │                                                                      │
 *   │  CSRF PROTECTION:                                                   │
 *   │  Sessions are vulnerable to CSRF because cookies auto-send!       │
 *   │  Fix: CSRF token in forms + SameSite cookies                      │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Cookie: HttpOnly + Secure + SameSite=Lax');
console.log('Regenerate session ID after login');
console.log('CSRF risk: cookies auto-send → use CSRF tokens');


// =============================================================================
// SCALING SESSIONS
// =============================================================================

console.log('\n=== Scaling ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  SCALING SESSION-BASED AUTH                                         │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  PROBLEM: Multiple servers, session on Server A                    │
 *   │  User's next request hits Server B → session not found!           │
 *   │                                                                      │
 *   │  SOLUTIONS:                                                         │
 *   │  1. STICKY SESSIONS (load balancer)                                │
 *   │     Route user to same server every time                           │
 *   │     Simple but uneven load, fails on server restart               │
 *   │                                                                      │
 *   │  2. SHARED SESSION STORE (Redis)                                   │
 *   │     All servers read/write sessions to Redis                       │
 *   │     ← Best approach                                                │
 *   │                                                                      │
 *   │  3. SWITCH TO JWT (stateless)                                      │
 *   │     No server-side state needed                                    │
 *   │     Any server can verify the token                                │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Multi-server: use Redis as shared session store');
console.log('Or switch to JWT (stateless, any server verifies)');


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "Session-based auth is stateful. After the user logs in, the server
 * creates a session object stored in Redis, and sends the session ID
 * in an httpOnly, Secure, SameSite cookie. On every request, the
 * browser automatically sends this cookie, and the server looks up the
 * session to identify the user.
 *
 * The advantages are easy revocation — just delete the session — and
 * the sensitive data stays server-side. The main challenge is scaling:
 * with multiple servers, sessions must be in a shared store like Redis
 * so any server can look them up.
 *
 * The main vulnerability is CSRF, since cookies are sent automatically.
 * I mitigate this with SameSite=Lax cookies and CSRF tokens in forms.
 * I also regenerate the session ID after login to prevent session
 * fixation attacks, and set httpOnly to prevent JavaScript from reading
 * the session cookie."
 */


// RUN: node docs/31-authentication/01-session-based-auth.js
