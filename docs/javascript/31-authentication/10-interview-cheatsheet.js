/**
 * AUTHENTICATION: 10 - Interview Cheatsheet
 *
 * Quick reference for all authentication concepts
 */


// =============================================================================
// MASTER CHEATSHEET
// =============================================================================

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  AUTHENTICATION CHEATSHEET                                           │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  SESSION vs JWT                                                      │
 *   │  Session: stateful, server stores data, cookie holds ID           │
 *   │  JWT: stateless, client holds token, server verifies signature    │
 *   │  Session = easy revoke, hard scale. JWT = easy scale, hard revoke │
 *   │                                                                      │
 *   │  JWT STRUCTURE                                                      │
 *   │  header.payload.signature (base64 encoded, NOT encrypted)         │
 *   │  Signature prevents tampering. Payload is readable.               │
 *   │                                                                      │
 *   │  TOKEN PATTERN                                                      │
 *   │  Access: 15min, in memory, sent via Authorization header          │
 *   │  Refresh: 7-30d, httpOnly cookie, stored in DB, rotated          │
 *   │  Silent refresh: 401 → auto-refresh → retry request              │
 *   │                                                                      │
 *   │  OAUTH 2.0                                                          │
 *   │  Auth Code flow: redirect → code → exchange for tokens           │
 *   │  PKCE for SPAs: code_verifier + code_challenge (no secret)       │
 *   │  OIDC adds id_token (JWT with user identity)                      │
 *   │                                                                      │
 *   │  STORAGE: WHERE TO PUT TOKENS                                       │
 *   │  httpOnly cookie: XSS safe, CSRF risk (use SameSite)             │
 *   │  localStorage: CSRF safe, XSS risk (never use for tokens!)       │
 *   │  Memory: safest but lost on refresh                                │
 *   │  Best: access in memory + refresh in httpOnly cookie              │
 *   │                                                                      │
 *   │  PASSWORDS                                                          │
 *   │  bcrypt (cost 12) or Argon2. Never plaintext/MD5/SHA.            │
 *   │  Salt included. Slow by design (anti-brute-force).               │
 *   │                                                                      │
 *   │  SECURITY                                                           │
 *   │  XSS: escape output, CSP, httpOnly cookies                        │
 *   │  CSRF: SameSite cookies, CSRF tokens                               │
 *   │  CORS: Allow-Origin, Allow-Credentials for cookies                │
 *   │  HTTPS everywhere + HSTS                                            │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// TOP INTERVIEW Q&A
// =============================================================================

console.log('=== Top Interview Q&A ===\n');

const qa = [
  {
    q: 'Session-based vs JWT authentication?',
    a: 'Sessions are stateful — server stores data in Redis, client holds session ID cookie. Easy to revoke (delete session), harder to scale (shared store needed). JWTs are stateless — token contains user data, signed by server. Any server verifies without DB lookup. Easy to scale, but hard to revoke before expiry. I use short JWTs (15min) + refresh tokens for both benefits.'
  },
  {
    q: 'How do you store auth tokens securely?',
    a: 'Access token in memory (JS variable) — lost on refresh but safe from XSS/CSRF. Refresh token in httpOnly, Secure, SameSite=Strict cookie — JS can\'t read it (XSS safe) and it won\'t send cross-site (CSRF safe). Never localStorage — any XSS reads everything.'
  },
  {
    q: 'What is OAuth 2.0 and how does it work?',
    a: 'Delegated auth via a provider (Google). Authorization Code flow: redirect user to Google → user authenticates → Google sends code back → server exchanges code for tokens using client_secret → gets user info. For SPAs, use PKCE (code_verifier/challenge) since there\'s no safe place for a client_secret.'
  },
  {
    q: 'How do refresh tokens work?',
    a: 'Short-lived access token (15min) + long-lived refresh token (7-30d). When access expires, send refresh token to get new pair. Rotate refresh tokens: each use issues a new one and invalidates the old. If an old token is reused (theft detection), revoke all tokens and force re-login.'
  },
  {
    q: 'How do you prevent XSS and CSRF?',
    a: 'XSS: escape output (React default), CSP headers to whitelist script sources, httpOnly cookies so JS can\'t steal tokens, sanitize HTML input with DOMPurify. CSRF: SameSite=Lax/Strict cookies (won\'t send cross-site), CSRF tokens in forms for extra protection.'
  },
  {
    q: 'How should passwords be stored?',
    a: 'Hash with bcrypt (cost 12) or Argon2. Never plaintext, MD5, or SHA256 alone. bcrypt includes a random salt (prevents rainbow tables) and is intentionally slow (~400ms at cost 12). Argon2 is newer and memory-hard, making GPU attacks impractical.'
  },
  {
    q: 'Explain CORS in the context of authentication.',
    a: 'Browser blocks cross-origin requests by default. Server allows with Access-Control-Allow-Origin. For cookies cross-origin: client needs credentials:include, server needs Allow-Credentials:true with exact origin (not wildcard). This is why I prefer JWT in Authorization header — avoids CORS cookie complexity.'
  },
];

qa.forEach(({ q, a }, i) => {
  console.log(`${i + 1}. Q: ${q}`);
  console.log(`   A: ${a}\n`);
});


// RUN: node docs/31-authentication/10-interview-cheatsheet.js
