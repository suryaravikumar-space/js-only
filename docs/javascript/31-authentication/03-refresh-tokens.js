/**
 * AUTHENTICATION: 03 - Refresh Tokens
 *
 * ONE CONCEPT: Short-lived access + long-lived refresh = security + UX
 */


// =============================================================================
// ACCESS + REFRESH TOKEN PATTERN
// =============================================================================

console.log('=== Refresh Token Pattern ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  TWO-TOKEN PATTERN                                                  │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  ACCESS TOKEN:                                                      │
 *   │  • Short-lived (15 min)                                             │
 *   │  • Sent with every API request (Authorization header)             │
 *   │  • Contains user info (JWT payload)                                │
 *   │  • If stolen: damage limited to 15 minutes                        │
 *   │                                                                      │
 *   │  REFRESH TOKEN:                                                     │
 *   │  • Long-lived (7-30 days)                                          │
 *   │  • Stored in httpOnly cookie (secure)                              │
 *   │  • Only sent to /api/refresh endpoint                             │
 *   │  • Used to get new access tokens                                   │
 *   │  • Stored in database (revocable!)                                 │
 *   │                                                                      │
 *   │  FLOW:                                                              │
 *   │  Login → get access token (15min) + refresh token (7d cookie)    │
 *   │    │                                                                │
 *   │    ├─ API calls: send access token in header                       │
 *   │    │                                                                │
 *   │    ├─ Access token expired (15min later):                          │
 *   │    │  POST /api/refresh (cookie auto-sent)                        │
 *   │    │  → Server validates refresh token                             │
 *   │    │  → Issues NEW access token + NEW refresh token                │
 *   │    │  → ROTATE: old refresh token invalidated                     │
 *   │    │                                                                │
 *   │    └─ Refresh token expired (7d later):                            │
 *   │       User must log in again                                       │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Access token:  15min, in memory/header, contains user data');
console.log('Refresh token: 7-30d, httpOnly cookie, stored in DB');
console.log('Expired access → POST /refresh → new tokens');
console.log('Rotate: old refresh token invalidated on use');


// =============================================================================
// TOKEN ROTATION
// =============================================================================

console.log('\n=== Refresh Token Rotation ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  REFRESH TOKEN ROTATION (security best practice)                    │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  Each refresh → issue NEW refresh token, invalidate old one        │
 *   │                                                                      │
 *   │  Login:     refresh_token_v1                                        │
 *   │  Refresh 1: refresh_token_v2 (v1 invalidated)                     │
 *   │  Refresh 2: refresh_token_v3 (v2 invalidated)                     │
 *   │                                                                      │
 *   │  THEFT DETECTION:                                                   │
 *   │  If attacker steals refresh_token_v2:                              │
 *   │                                                                      │
 *   │  Attacker uses v2 → gets v3 (v2 invalidated)                     │
 *   │  Real user uses v2 → FAILS! (v2 already used)                    │
 *   │  → Server detects reuse → invalidate ALL tokens for user         │
 *   │  → Force re-login                                                  │
 *   │                                                                      │
 *   │  This is called "refresh token reuse detection"                    │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Rotation: each refresh gives new refresh token');
console.log('Reuse detection: if old token used → revoke all → force re-login');


// =============================================================================
// SILENT REFRESH (SPA)
// =============================================================================

console.log('\n=== Silent Refresh for SPAs ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  SILENT REFRESH IN SINGLE-PAGE APPS                                 │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  // Axios interceptor pattern                                       │
 *   │  api.interceptors.response.use(                                    │
 *   │    response => response,                                            │
 *   │    async (error) => {                                               │
 *   │      if (error.response?.status === 401 && !error.config._retry) {│
 *   │        error.config._retry = true;                                 │
 *   │        const { accessToken } = await refreshTokens();             │
 *   │        error.config.headers.Authorization = `Bearer ${accessToken}`;│
 *   │        return api(error.config); // Retry original request        │
 *   │      }                                                              │
 *   │      return Promise.reject(error);                                 │
 *   │    }                                                                │
 *   │  );                                                                 │
 *   │                                                                      │
 *   │  User never sees "session expired" for normal usage!              │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('401 response → auto-refresh → retry original request');
console.log('User experiences seamless session without manual re-login');


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "I use a two-token pattern: a short-lived access token (15 minutes)
 * for API authentication, and a long-lived refresh token (7-30 days)
 * stored in an httpOnly cookie for getting new access tokens.
 *
 * The access token's short lifespan limits damage if stolen. When it
 * expires, an axios interceptor catches the 401, calls the refresh
 * endpoint, gets a new access token, and retries the original request
 * transparently.
 *
 * I use refresh token rotation — each refresh issues a new refresh
 * token and invalidates the old one. If a stolen token is reused after
 * the legitimate user has already refreshed, the server detects the
 * reuse and revokes all tokens for that user, forcing a re-login.
 * This provides theft detection that plain JWTs don't have.
 *
 * Refresh tokens are stored in the database, so they're easily
 * revocable — unlike access tokens which are stateless JWTs."
 */


// RUN: node docs/31-authentication/03-refresh-tokens.js
