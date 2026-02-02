/**
 * AUTHENTICATION: 00 - Authentication Overview
 *
 * ONE CONCEPT: How we verify "who are you?" on the web
 */


// =============================================================================
// AUTHENTICATION vs AUTHORIZATION
// =============================================================================

console.log('=== Authentication vs Authorization ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  AUTHENTICATION (AuthN) vs AUTHORIZATION (AuthZ)                    │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  AUTHENTICATION (Who are you?)                                      │
 *   │  "Prove your identity"                                              │
 *   │  • Username + password                                              │
 *   │  • OAuth (Google, GitHub login)                                     │
 *   │  • Biometrics (fingerprint, face)                                  │
 *   │  • MFA (password + OTP)                                            │
 *   │                                                                      │
 *   │  AUTHORIZATION (What can you do?)                                   │
 *   │  "Check your permissions"                                           │
 *   │  • Role-based (admin, editor, viewer)                              │
 *   │  • Resource-based (own data only)                                  │
 *   │  • Scope-based (read:users, write:users)                          │
 *   │                                                                      │
 *   │  Flow:                                                              │
 *   │  User → [Authentication] → "You are John"                         │
 *   │                          → [Authorization] → "John can edit posts" │
 *   │                                                                      │
 *   │  AuthN happens FIRST, then AuthZ                                   │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Authentication: WHO are you? (login)');
console.log('Authorization:  WHAT can you do? (permissions)');
console.log('AuthN first → then AuthZ');


// =============================================================================
// AUTH APPROACHES OVERVIEW
// =============================================================================

console.log('\n=== Auth Approaches ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  AUTH APPROACHES                                                    │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  1. SESSION-BASED (traditional)                                     │
 *   │     Server stores session → sends session ID in cookie            │
 *   │     Stateful (server remembers user)                               │
 *   │                                                                      │
 *   │  2. TOKEN-BASED (JWT)                                               │
 *   │     Server creates signed token → client stores it                │
 *   │     Stateless (token contains user info)                           │
 *   │                                                                      │
 *   │  3. OAUTH 2.0                                                       │
 *   │     "Login with Google/GitHub"                                     │
 *   │     Delegated authentication (third-party verifies)               │
 *   │                                                                      │
 *   │  4. PASSWORDLESS                                                    │
 *   │     Magic link, OTP, WebAuthn/Passkeys                            │
 *   │     No password to remember or steal                               │
 *   │                                                                      │
 *   │  COMPARISON:                                                        │
 *   │  ┌───────────┬────────────┬────────────┬──────────────┐            │
 *   │  │           │ Session    │ JWT        │ OAuth        │            │
 *   │  ├───────────┼────────────┼────────────┼──────────────┤            │
 *   │  │ State     │ Server     │ Client     │ Provider     │            │
 *   │  │ Storage   │ DB/Redis   │ Cookie/LS  │ Provider     │            │
 *   │  │ Scaling   │ Hard*      │ Easy       │ Easy         │            │
 *   │  │ Revoke    │ Easy       │ Hard*      │ Provider     │            │
 *   │  │ Security  │ CSRF risk  │ XSS risk   │ Complex flow │            │
 *   │  └───────────┴────────────┴────────────┴──────────────┘            │
 *   │  * Sessions scale with sticky sessions or Redis                   │
 *   │  * JWTs revoked via blacklist or short expiry                     │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Session: stateful, server stores state, easy revoke');
console.log('JWT: stateless, client stores token, easy scaling');
console.log('OAuth: delegated auth via provider (Google, GitHub)');
console.log('Passwordless: magic links, passkeys, no password');


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "Authentication verifies identity — who are you. Authorization checks
 * permissions — what can you do. AuthN happens first, then AuthZ.
 *
 * The two main approaches are session-based and token-based. Sessions
 * are stateful — the server stores session data and sends a session ID
 * cookie. Easy to revoke but harder to scale across servers. JWTs are
 * stateless — the token itself contains user data, signed by the server.
 * Easy to scale since any server can verify the signature, but harder
 * to revoke since there's no server-side state to invalidate.
 *
 * OAuth 2.0 delegates authentication to a trusted provider like Google.
 * The user authenticates with Google, which sends back an authorization
 * code. My server exchanges it for tokens and creates a local session.
 *
 * For most applications, I use a combination: OAuth for social login,
 * short-lived JWTs for API authentication, and refresh tokens stored
 * in httpOnly cookies for session renewal."
 */


// RUN: node docs/31-authentication/00-auth-overview.js
