/**
 * AUTHENTICATION: 05 - Cookies vs Tokens (Where to Store Auth)
 *
 * ONE CONCEPT: Each storage option has different security trade-offs
 */


// =============================================================================
// STORAGE OPTIONS
// =============================================================================

console.log('=== Where to Store Auth Credentials ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  STORAGE COMPARISON                                                  │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  ┌────────────────┬──────────┬──────────┬──────────┬──────────┐    │
 *   │  │                │ httpOnly │ local    │ session  │ Memory   │    │
 *   │  │                │ Cookie   │ Storage  │ Storage  │ (JS var) │    │
 *   │  ├────────────────┼──────────┼──────────┼──────────┼──────────┤    │
 *   │  │ XSS safe?      │ ✓ Yes   │ ✗ No     │ ✗ No     │ ✗ No*    │    │
 *   │  │ CSRF safe?     │ ✗ No*   │ ✓ Yes    │ ✓ Yes    │ ✓ Yes    │    │
 *   │  │ Persists       │ ✓ Yes   │ ✓ Yes    │ Tab only │ ✗ No     │    │
 *   │  │ Auto-sent      │ ✓ Yes   │ ✗ No     │ ✗ No     │ ✗ No     │    │
 *   │  │ Size limit     │ 4KB     │ 5-10MB   │ 5MB      │ No limit │    │
 *   │  │ Cross-origin   │ ✗ No    │ ✗ No     │ ✗ No     │ N/A      │    │
 *   │  └────────────────┴──────────┴──────────┴──────────┴──────────┘    │
 *   │  * httpOnly cookies: CSRF mitigated with SameSite                  │
 *   │  * Memory: harder to extract but not impossible with XSS           │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('httpOnly Cookie: XSS safe (JS cant read), CSRF risk (auto-sent)');
console.log('localStorage:    CSRF safe (manual send), XSS risk (JS reads)');
console.log('Memory (JS var): safest but lost on refresh');


// =============================================================================
// RECOMMENDED PATTERN
// =============================================================================

console.log('\n=== Recommended Pattern ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  BEST PRACTICE: httpOnly Cookie + SameSite                          │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  Access Token:                                                      │
 *   │  • Store in memory (JS variable)                                   │
 *   │  • Lost on refresh → use refresh token to get new one             │
 *   │  • Send via Authorization: Bearer header                          │
 *   │                                                                      │
 *   │  Refresh Token:                                                     │
 *   │  • httpOnly cookie (JS can't access → XSS safe)                   │
 *   │  • Secure flag (HTTPS only)                                        │
 *   │  • SameSite=Strict (CSRF safe)                                    │
 *   │  • Path=/api/refresh (only sent to refresh endpoint)              │
 *   │                                                                      │
 *   │  Set-Cookie: refresh_token=xyz;                                    │
 *   │              HttpOnly;                                              │
 *   │              Secure;                                                │
 *   │              SameSite=Strict;                                       │
 *   │              Path=/api/refresh;                                    │
 *   │              Max-Age=604800                                         │
 *   │                                                                      │
 *   │  WHY NOT localStorage?                                              │
 *   │  Any XSS vulnerability → attacker reads all localStorage          │
 *   │  httpOnly cookie → XSS can't read it at all                       │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Access token:  in memory (JS variable)');
console.log('Refresh token: httpOnly + Secure + SameSite=Strict cookie');
console.log('Never store tokens in localStorage!');


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "I store the access token in a JavaScript variable in memory and the
 * refresh token in an httpOnly, Secure, SameSite=Strict cookie scoped
 * to the refresh endpoint path.
 *
 * This combination protects against both major attack vectors: httpOnly
 * prevents XSS from reading the refresh token since JavaScript can't
 * access it at all. SameSite=Strict prevents CSRF because the cookie
 * isn't sent with cross-origin requests. The access token in memory
 * is harder for XSS to extract compared to localStorage, and its
 * 15-minute lifespan limits damage.
 *
 * I avoid localStorage for tokens because any XSS vulnerability lets
 * an attacker steal everything in localStorage with a single line of
 * JavaScript. With httpOnly cookies, even a successful XSS attack
 * can't directly steal the token — the attacker can make requests
 * using the cookie but can't exfiltrate it.
 *
 * On page refresh, the access token is lost (memory cleared), so the
 * app automatically calls the refresh endpoint to get a new one using
 * the cookie — this is transparent to the user."
 */


// RUN: node docs/31-authentication/05-cookies-vs-tokens.js
