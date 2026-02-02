/**
 * AUTHENTICATION: 09 - Auth Best Practices
 *
 * ONE CONCEPT: Security checklist for production authentication
 */


// =============================================================================
// AUTH SECURITY CHECKLIST
// =============================================================================

console.log('=== Auth Best Practices ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  PRODUCTION AUTH CHECKLIST                                           │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  PASSWORDS:                                                         │
 *   │  ✓ Hash with bcrypt (cost 12+) or Argon2                          │
 *   │  ✓ Enforce minimum length (8+), check breached passwords          │
 *   │  ✓ Rate-limit login attempts (5 per minute)                       │
 *   │  ✓ Lock account after N failures (temporary)                      │
 *   │  ✓ Never log passwords or tokens                                   │
 *   │                                                                      │
 *   │  TOKENS:                                                            │
 *   │  ✓ Short-lived access tokens (15 min)                              │
 *   │  ✓ Refresh tokens in httpOnly cookies                              │
 *   │  ✓ Refresh token rotation with reuse detection                    │
 *   │  ✓ Sign JWTs with strong secret (256+ bits) or RS256              │
 *   │  ✓ Validate all claims (exp, iss, aud)                            │
 *   │                                                                      │
 *   │  COOKIES:                                                           │
 *   │  ✓ HttpOnly (no JS access)                                         │
 *   │  ✓ Secure (HTTPS only)                                             │
 *   │  ✓ SameSite=Lax or Strict                                         │
 *   │  ✓ Set appropriate Path and Domain                                │
 *   │                                                                      │
 *   │  TRANSPORT:                                                         │
 *   │  ✓ HTTPS everywhere (HSTS header)                                  │
 *   │  ✓ Security headers (CSP, X-Content-Type-Options)                 │
 *   │  ✓ Validate redirect URLs (open redirect prevention)              │
 *   │                                                                      │
 *   │  SESSION:                                                           │
 *   │  ✓ Regenerate session ID after login                               │
 *   │  ✓ Invalidate all sessions on password change                     │
 *   │  ✓ Implement logout (clear tokens + server-side)                  │
 *   │                                                                      │
 *   │  MFA:                                                               │
 *   │  ✓ Offer TOTP (Google Authenticator)                               │
 *   │  ✓ Support WebAuthn/Passkeys                                       │
 *   │  ✓ Backup codes for recovery                                       │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

const checklist = [
  'bcrypt/Argon2 for password hashing',
  'Rate-limit login attempts',
  'Short-lived access tokens (15min)',
  'Refresh tokens in httpOnly cookies',
  'Token rotation with reuse detection',
  'HTTPS everywhere + HSTS',
  'CSP + security headers',
  'Regenerate session ID on login',
  'MFA support (TOTP / Passkeys)',
];
checklist.forEach((item, i) => console.log(`  ${i + 1}. ${item}`));


// =============================================================================
// COMMON MISTAKES
// =============================================================================

console.log('\n=== Common Auth Mistakes ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  NEVER DO THIS                                                       │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  ✗ Store passwords in plaintext or MD5/SHA256                      │
 *   │  ✗ Store JWTs in localStorage                                      │
 *   │  ✗ Use JWT secret like "secret123"                                 │
 *   │  ✗ No token expiration                                              │
 *   │  ✗ Trust client-side role checks only                              │
 *   │  ✗ Expose user IDs in JWT without server validation               │
 *   │  ✗ Allow unlimited login attempts                                   │
 *   │  ✗ Log tokens or passwords                                          │
 *   │  ✗ Send tokens in URL query parameters                             │
 *   │  ✗ Use "none" algorithm in JWT                                      │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Never: plaintext passwords, localStorage tokens');
console.log('Never: weak JWT secret, no expiration, unlimited login attempts');
console.log('Always: validate server-side, never trust client');


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "For production auth, I follow defense in depth. Passwords are hashed
 * with bcrypt at cost 12. Login attempts are rate-limited to prevent
 * brute force. I use short-lived JWTs (15 min) with refresh tokens
 * in httpOnly, Secure, SameSite cookies, with token rotation and reuse
 * detection.
 *
 * All communication is over HTTPS with HSTS headers. I set CSP to
 * prevent XSS, and validate all JWT claims (expiry, issuer, audience)
 * server-side. Authorization is always checked on the server — client-
 * side role checks are UX only, never security.
 *
 * I regenerate session IDs after login to prevent fixation, invalidate
 * all sessions on password change, and offer MFA via TOTP or WebAuthn.
 * I never store tokens in localStorage, never log credentials, and
 * never send tokens in URL parameters."
 */


// RUN: node docs/31-authentication/09-auth-best-practices.js
