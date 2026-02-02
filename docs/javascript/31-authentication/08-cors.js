/**
 * AUTHENTICATION: 08 - CORS & Authentication
 *
 * ONE CONCEPT: How cross-origin requests work with auth credentials
 */


// =============================================================================
// CORS BASICS
// =============================================================================

console.log('=== CORS & Authentication ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  CORS: Cross-Origin Resource Sharing                                │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  Same-origin: scheme + host + port must match                      │
 *   │  https://app.com:443 → https://app.com:443     ✓ Same             │
 *   │  https://app.com     → https://api.app.com     ✗ Cross-origin     │
 *   │  https://app.com     → http://app.com          ✗ Cross-origin     │
 *   │  https://app.com:443 → https://app.com:8080    ✗ Cross-origin     │
 *   │                                                                      │
 *   │  Browser blocks cross-origin requests by default!                  │
 *   │  Server must explicitly allow with CORS headers:                   │
 *   │                                                                      │
 *   │  Access-Control-Allow-Origin: https://app.com                     │
 *   │  Access-Control-Allow-Methods: GET, POST, PUT, DELETE             │
 *   │  Access-Control-Allow-Headers: Content-Type, Authorization        │
 *   │                                                                      │
 *   │  PREFLIGHT (OPTIONS request):                                       │
 *   │  Before PUT/DELETE/custom headers, browser sends OPTIONS first    │
 *   │  Server responds with allowed methods/headers                     │
 *   │  If allowed → browser sends actual request                        │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Same-origin = same scheme + host + port');
console.log('Cross-origin blocked by default');
console.log('Server allows via Access-Control-Allow-* headers');


// =============================================================================
// CORS WITH COOKIES
// =============================================================================

console.log('\n=== CORS with Credentials ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  CORS + COOKIES/AUTH                                                │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  By default, cross-origin requests DON'T send cookies!            │
 *   │                                                                      │
 *   │  To send cookies cross-origin:                                      │
 *   │                                                                      │
 *   │  CLIENT:                                                            │
 *   │  fetch('https://api.com/data', {                                   │
 *   │    credentials: 'include'    ← "Send cookies please"             │
 *   │  });                                                                │
 *   │                                                                      │
 *   │  SERVER:                                                            │
 *   │  Access-Control-Allow-Origin: https://app.com  ← NOT wildcard!   │
 *   │  Access-Control-Allow-Credentials: true        ← Required!       │
 *   │                                                                      │
 *   │  ⚠ IMPORTANT:                                                       │
 *   │  • Allow-Origin CANNOT be * when using credentials                │
 *   │  • Must be exact origin: https://app.com                          │
 *   │  • SameSite=None required for cross-site cookies                  │
 *   │  • SameSite=None requires Secure (HTTPS)                          │
 *   │                                                                      │
 *   │  ALTERNATIVE: Authorization header (no CORS cookie issues)        │
 *   │  fetch('https://api.com/data', {                                   │
 *   │    headers: { Authorization: 'Bearer <token>' }                   │
 *   │  });                                                                │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Cross-origin cookies: credentials: "include" + Allow-Credentials');
console.log('Allow-Origin cannot be * with credentials (must be exact)');
console.log('Alternative: send JWT in Authorization header (simpler)');


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "CORS is the browser's security mechanism that blocks cross-origin
 * requests by default. The server must explicitly allow origins with
 * Access-Control-Allow-Origin. For non-simple requests (PUT, DELETE,
 * custom headers), the browser sends an OPTIONS preflight first.
 *
 * For authentication, if using cookies cross-origin, the client must set
 * credentials: 'include' and the server must set Allow-Credentials: true
 * with an explicit origin (not wildcard). Cross-site cookies also need
 * SameSite=None and Secure flags.
 *
 * This is one reason I often prefer JWT in the Authorization header for
 * API authentication — it avoids the CORS cookie complexity entirely.
 * The token is sent as a header, which just needs the Authorization
 * header allowed in Access-Control-Allow-Headers."
 */


// RUN: node docs/31-authentication/08-cors.js
