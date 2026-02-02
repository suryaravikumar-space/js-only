/**
 * AUTHENTICATION: 04 - OAuth 2.0
 *
 * ONE CONCEPT: Delegated authentication — let Google/GitHub verify identity
 */


// =============================================================================
// OAUTH 2.0 FLOW
// =============================================================================

console.log('=== OAuth 2.0 ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  AUTHORIZATION CODE FLOW (most secure, server-side)                 │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  User    Browser    Your Server    Google (Provider)                │
 *   │   │                                                                 │
 *   │   │─ Click "Login with Google" ──▶│                                │
 *   │   │                               │──── Redirect to Google ───────▶│
 *   │   │                               │    ?client_id=xxx              │
 *   │   │                               │    &redirect_uri=xxx          │
 *   │   │                               │    &scope=email profile       │
 *   │   │                               │    &response_type=code        │
 *   │   │◀───── Google login page ──────│◀──────────────────────────────│
 *   │   │                                                                 │
 *   │   │─ User logs in + consents ────▶│                                │
 *   │   │                               │──── Auth code ────────────────▶│
 *   │   │                               │◀── redirect with ?code=abc ───│
 *   │   │                               │                                │
 *   │   │                               │── Exchange code for tokens ──▶│
 *   │   │                               │   POST /token                  │
 *   │   │                               │   { code, client_secret }     │
 *   │   │                               │◀── access_token + id_token ──│
 *   │   │                               │                                │
 *   │   │                               │── GET /userinfo ──────────────▶│
 *   │   │                               │◀── { email, name, picture } ──│
 *   │   │                               │                                │
 *   │   │◀── Create session/JWT ────────│                                │
 *   │   │                                                                 │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('1. Redirect user to Google with client_id + scope');
console.log('2. User logs in + consents');
console.log('3. Google redirects back with authorization code');
console.log('4. Server exchanges code for tokens (using client_secret)');
console.log('5. Server gets user info, creates local session/JWT');


// =============================================================================
// KEY CONCEPTS
// =============================================================================

console.log('\n=== OAuth Key Concepts ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  OAUTH TERMINOLOGY                                                  │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  Resource Owner:     The user                                      │
 *   │  Client:             Your app                                       │
 *   │  Authorization Server: Google's login page                         │
 *   │  Resource Server:    Google's API (user info)                      │
 *   │                                                                      │
 *   │  client_id:          Public app identifier                         │
 *   │  client_secret:      Private key (server-side only!)              │
 *   │  redirect_uri:       Where Google sends user back                  │
 *   │  scope:              What access you need (email, profile)        │
 *   │  authorization code: Temporary code exchanged for tokens          │
 *   │  access_token:       Token to call Google APIs                    │
 *   │  id_token:           JWT with user identity (OpenID Connect)      │
 *   │                                                                      │
 *   │  OPENID CONNECT (OIDC):                                            │
 *   │  Layer on top of OAuth 2.0 for authentication                     │
 *   │  Adds id_token (JWT with user info)                               │
 *   │  OAuth = authorization. OIDC = authentication.                    │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('OAuth 2.0 = authorization protocol');
console.log('OpenID Connect = authentication layer on top of OAuth');
console.log('client_secret stays server-side ONLY');


// =============================================================================
// PKCE (FOR SPAs / MOBILE)
// =============================================================================

console.log('\n=== PKCE for Public Clients ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  PKCE (Proof Key for Code Exchange)                                 │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  SPAs and mobile apps can't keep a client_secret                   │
 *   │  (code is visible to users)                                         │
 *   │                                                                      │
 *   │  PKCE Flow:                                                         │
 *   │  1. Generate random code_verifier                                  │
 *   │  2. Hash it → code_challenge = SHA256(code_verifier)              │
 *   │  3. Send code_challenge with auth request                         │
 *   │  4. Send code_verifier when exchanging code for token            │
 *   │  5. Server verifies: SHA256(code_verifier) === code_challenge    │
 *   │                                                                      │
 *   │  Prevents: authorization code interception attack                  │
 *   │  Even if attacker steals the code, they don't have the verifier  │
 *   │                                                                      │
 *   │  NOW RECOMMENDED for ALL clients (not just public)                │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('PKCE: code_verifier (random) + code_challenge (hash)');
console.log('Prevents code interception without client_secret');
console.log('Required for SPAs and mobile apps');


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "OAuth 2.0 lets users log in via providers like Google without sharing
 * their password with my app. I use the Authorization Code flow: redirect
 * the user to Google, they authenticate and consent, Google redirects
 * back with a temporary authorization code, and my server exchanges it
 * for tokens using the client_secret.
 *
 * The access_token lets me call Google's APIs for user info. The id_token
 * (from OpenID Connect) is a JWT containing the user's identity. I use
 * this to create a local session or issue my own JWTs.
 *
 * For SPAs, I use PKCE since there's no safe place for a client_secret.
 * The client generates a random code_verifier, hashes it to create a
 * code_challenge, and sends the challenge with the auth request. When
 * exchanging the code, it sends the original verifier. This prevents
 * authorization code interception even without a secret.
 *
 * OAuth is authorization, OpenID Connect adds authentication on top.
 * In practice, 'Login with Google' uses both."
 */


// RUN: node docs/31-authentication/04-oauth-basics.js
