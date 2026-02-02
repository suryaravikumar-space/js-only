/**
 * WEB APIS: 06 - Cookies Basics
 *
 * ONE CONCEPT: Small data automatically sent with every HTTP request
 */


// =============================================================================
// WHAT ARE COOKIES?
// =============================================================================

/**
 * Cookies = Small pieces of data stored by browser and sent with EVERY request.
 *
 *
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  HOW COOKIES WORK                                                    │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  1. Server sets cookie in response:                                  │
 *   │                                                                      │
 *   │     HTTP Response                                                    │
 *   │     ┌─────────────────────────────────────────────────────┐          │
 *   │     │ Set-Cookie: sessionId=abc123; Path=/; HttpOnly      │          │
 *   │     └─────────────────────────────────────────────────────┘          │
 *   │                           │                                          │
 *   │                           ▼                                          │
 *   │                    Browser stores it                                 │
 *   │                                                                      │
 *   │  2. Browser sends cookie with EVERY subsequent request:              │
 *   │                                                                      │
 *   │     HTTP Request                                                     │
 *   │     ┌─────────────────────────────────────────────────────┐          │
 *   │     │ Cookie: sessionId=abc123                            │          │
 *   │     └─────────────────────────────────────────────────────┘          │
 *   │                           │                                          │
 *   │                           ▼                                          │
 *   │                    Server reads it                                   │
 *   │                                                                      │
 *   │                                                                      │
 *   │  KEY INSIGHT: Cookies are sent AUTOMATICALLY!                        │
 *   │  Unlike localStorage, you don't manually attach them to requests.   │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// COOKIE CHARACTERISTICS
// =============================================================================

console.log('=== Cookie Characteristics ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  COOKIES vs LOCALSTORAGE                                            │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │                    │ Cookies            │ localStorage              │
 *   │  ──────────────────┼────────────────────┼────────────────────────── │
 *   │  Size limit        │ ~4 KB per cookie   │ ~5-10 MB                  │
 *   │  Sent to server    │ YES (auto!)        │ NO                        │
 *   │  Set by            │ Server or JS       │ JS only                   │
 *   │  Expiration        │ Configurable       │ Never (manual clear)      │
 *   │  HTTP Only option  │ YES                │ NO                        │
 *   │  Secure option     │ YES                │ NO                        │
 *   │                                                                     │
 *   │  WHEN TO USE COOKIES:                                               │
 *   │  • Authentication (session ID, tokens)                              │
 *   │  • Server needs to read the data                                    │
 *   │  • Need HttpOnly for security                                       │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Cookies: ~4KB, sent with every request, can be HttpOnly');
console.log('localStorage: ~5-10MB, NOT sent to server, JS accessible only');


// =============================================================================
// JAVASCRIPT COOKIE API (document.cookie)
// =============================================================================

console.log('\n=== JavaScript Cookie API ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  ⚠️  The document.cookie API is... WEIRD                            │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  Reading: Returns ALL cookies as one string                         │
 *   │  document.cookie → "name=John; theme=dark; lang=en"                 │
 *   │                                                                     │
 *   │  Writing: Assignment ADDS a cookie (doesn't replace all!)           │
 *   │  document.cookie = "newCookie=value"                                │
 *   │  // Now: "name=John; theme=dark; lang=en; newCookie=value"          │
 *   │                                                                     │
 *   │  Deleting: Set expiration to past date                              │
 *   │  document.cookie = "name=; expires=Thu, 01 Jan 1970 00:00:00 GMT"   │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

const cookieAPI = `
// ═══════════════════════════════════════════════════════════════════════
// RAW API (awkward but works)
// ═══════════════════════════════════════════════════════════════════════

// SET a cookie
document.cookie = "username=john";

// SET with options
document.cookie = "username=john; max-age=86400; path=/; secure";

// READ all cookies (returns string)
console.log(document.cookie);  // "username=john; theme=dark"

// DELETE a cookie (set to expired date)
document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";


// ═══════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS (USE THESE!)
// ═══════════════════════════════════════════════════════════════════════

function setCookie(name, value, days = 7, path = '/') {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  document.cookie = \`\${encodeURIComponent(name)}=\${encodeURIComponent(value)}; \` +
                   \`expires=\${expires.toUTCString()}; path=\${path}\`;
}

function getCookie(name) {
  const cookies = document.cookie.split('; ');

  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=');
    if (decodeURIComponent(cookieName) === name) {
      return decodeURIComponent(cookieValue);
    }
  }

  return null;
}

function deleteCookie(name, path = '/') {
  document.cookie = \`\${encodeURIComponent(name)}=; \` +
                   \`expires=Thu, 01 Jan 1970 00:00:00 GMT; path=\${path}\`;
}

function getAllCookies() {
  const cookies = {};
  document.cookie.split('; ').forEach(cookie => {
    const [name, value] = cookie.split('=');
    if (name) {
      cookies[decodeURIComponent(name)] = decodeURIComponent(value || '');
    }
  });
  return cookies;
}

// Usage
setCookie('theme', 'dark', 365);           // Expires in 1 year
setCookie('sessionId', 'abc123', 1);       // Expires in 1 day
console.log(getCookie('theme'));           // 'dark'
console.log(getAllCookies());              // { theme: 'dark', sessionId: 'abc123' }
deleteCookie('sessionId');
`;

console.log(cookieAPI);


// =============================================================================
// COOKIE ATTRIBUTES
// =============================================================================

console.log('\n=== Cookie Attributes ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  COOKIE ATTRIBUTES                                                   │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  name=value          The actual data                                 │
 *   │                                                                      │
 *   │  EXPIRATION:                                                         │
 *   │  expires=DATE        Absolute expiration date                        │
 *   │  max-age=SECONDS     Seconds until expiration (preferred)            │
 *   │                      No expiration = "session cookie" (tab close)    │
 *   │                                                                      │
 *   │  SCOPE:                                                              │
 *   │  path=/              Which paths can access the cookie               │
 *   │  domain=.example.com Which domains can access (including subdomains) │
 *   │                                                                      │
 *   │  SECURITY:                                                           │
 *   │  secure              Only send over HTTPS                            │
 *   │  httponly            JavaScript CANNOT access (server only)          │
 *   │  samesite=Strict     CSRF protection                                 │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

const attributesExample = `
// Session cookie (deleted when browser closes)
document.cookie = "sessionToken=abc123";

// Persistent cookie (expires in 7 days)
document.cookie = "rememberMe=true; max-age=604800";

// With expiration date
const date = new Date();
date.setFullYear(date.getFullYear() + 1);
document.cookie = "annual=value; expires=" + date.toUTCString();

// Path-specific (only for /admin pages)
document.cookie = "adminToken=xyz; path=/admin";

// Subdomain accessible
document.cookie = "shared=value; domain=.example.com";
// Accessible by: www.example.com, api.example.com, example.com

// Secure (HTTPS only)
document.cookie = "secure_token=abc; secure";

// Multiple attributes
document.cookie = "authToken=xyz123; max-age=86400; path=/; secure; samesite=strict";
`;

console.log(attributesExample);


// =============================================================================
// REAL-WORLD USE CASES
// =============================================================================

console.log('\n=== Real-World Use Cases ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  WHEN TO USE COOKIES                                                │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  1. AUTHENTICATION                                                  │
 *   │     Session IDs, JWT tokens (with HttpOnly!)                        │
 *   │     Sent automatically with every request                           │
 *   │                                                                     │
 *   │  2. SERVER-SIDE PERSONALIZATION                                     │
 *   │     Language preference, currency, region                           │
 *   │     Server can read before rendering page                           │
 *   │                                                                     │
 *   │  3. TRACKING & ANALYTICS                                            │
 *   │     User ID for analytics                                           │
 *   │     Third-party cookies (being phased out!)                         │
 *   │                                                                     │
 *   │  4. CSRF TOKENS                                                     │
 *   │     Double-submit cookie pattern                                    │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

const realWorldExamples = `
// ═══════════════════════════════════════════════════════════════════════
// EXAMPLE 1: Remember Me Checkbox
// ═══════════════════════════════════════════════════════════════════════

function handleLogin(username, password, rememberMe) {
  // After successful login...

  if (rememberMe) {
    // Long-lived cookie (30 days)
    setCookie('rememberToken', generateToken(), 30);
  } else {
    // Session cookie (expires when browser closes)
    document.cookie = 'sessionToken=' + generateToken();
  }
}

// On page load, check for remember token
const rememberToken = getCookie('rememberToken');
if (rememberToken) {
  autoLogin(rememberToken);
}


// ═══════════════════════════════════════════════════════════════════════
// EXAMPLE 2: Language Preference (Server needs it)
// ═══════════════════════════════════════════════════════════════════════

function setLanguage(lang) {
  // Cookie so server can read it and render correct language
  setCookie('lang', lang, 365);  // 1 year

  // Reload to apply
  window.location.reload();
}

// Server-side (Node.js example):
// const lang = req.cookies.lang || 'en';
// res.render('page', { lang });


// ═══════════════════════════════════════════════════════════════════════
// EXAMPLE 3: Cookie Consent Banner
// ═══════════════════════════════════════════════════════════════════════

function checkCookieConsent() {
  if (!getCookie('cookieConsent')) {
    showConsentBanner();
  }
}

function acceptCookies() {
  setCookie('cookieConsent', 'accepted', 365);
  hideConsentBanner();
  enableAnalytics();
}

function rejectCookies() {
  setCookie('cookieConsent', 'rejected', 365);
  hideConsentBanner();
  // Don't set tracking cookies
}


// ═══════════════════════════════════════════════════════════════════════
// EXAMPLE 4: A/B Testing
// ═══════════════════════════════════════════════════════════════════════

function getExperimentVariant(experimentId) {
  const key = 'exp_' + experimentId;
  let variant = getCookie(key);

  if (!variant) {
    // Assign random variant
    variant = Math.random() < 0.5 ? 'A' : 'B';
    setCookie(key, variant, 30);  // Persist for 30 days
  }

  return variant;
}

// Usage
const variant = getExperimentVariant('checkout_flow');
if (variant === 'A') {
  showOriginalCheckout();
} else {
  showNewCheckout();
}
`;

console.log(realWorldExamples);


// =============================================================================
// FIRST-PARTY vs THIRD-PARTY COOKIES
// =============================================================================

console.log('\n=== First-Party vs Third-Party ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  FIRST-PARTY vs THIRD-PARTY COOKIES                                 │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  FIRST-PARTY (your domain sets it)                                  │
 *   │  You're on: mystore.com                                             │
 *   │  Cookie from: mystore.com ✓                                         │
 *   │  Use: Login, preferences, cart                                      │
 *   │                                                                     │
 *   │  THIRD-PARTY (another domain sets it)                               │
 *   │  You're on: mystore.com                                             │
 *   │  Cookie from: analytics.com, ads.com                                │
 *   │  Use: Tracking across sites, targeted ads                           │
 *   │                                                                     │
 *   │  ⚠️  Third-party cookies are being BLOCKED by browsers!             │
 *   │  Safari: Already blocks                                             │
 *   │  Firefox: Blocks by default                                         │
 *   │  Chrome: Phasing out (Privacy Sandbox)                              │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('First-party: Set by current domain (your site)');
console.log('Third-party: Set by other domains (ads, analytics)');
console.log('Third-party cookies are being phased out for privacy!');


// =============================================================================
// INTERVIEW: What to Say (1-2 minutes)
// =============================================================================

/**
 * QUESTION: "What are cookies and when would you use them?"
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * YOUR ANSWER:
 *
 * "Cookies are small pieces of data that the browser stores and automatically
 * sends with every HTTP request to the server. This is the key difference
 * from localStorage - cookies are sent automatically, localStorage is not.
 *
 * I primarily use cookies for authentication. When a user logs in, the
 * server sets a session cookie or JWT token. On every subsequent request,
 * the browser sends this cookie, so the server knows who the user is.
 *
 * For auth cookies, I always use HttpOnly which prevents JavaScript from
 * accessing them - this protects against XSS attacks. I also use Secure
 * to ensure they're only sent over HTTPS, and SameSite to prevent CSRF.
 *
 * I also use cookies when the server needs to read data before rendering.
 * For example, language preference - the server reads the cookie and renders
 * the page in the correct language.
 *
 * The main limitations are size - only about 4KB per cookie - and the fact
 * that they're sent with every request, which can add overhead. For larger
 * data that doesn't need to go to the server, I use localStorage.
 *
 * One thing to know is that third-party cookies for tracking are being
 * phased out by browsers for privacy reasons. Safari and Firefox already
 * block them, and Chrome is following."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * KEY POINTS TO MENTION:
 * ✓ Automatically sent with every request (unlike localStorage)
 * ✓ Primary use: authentication
 * ✓ HttpOnly, Secure, SameSite for security
 * ✓ ~4KB limit, sent with every request (overhead)
 * ✓ Third-party cookies being phased out
 *
 */


// RUN: node docs/27-web-apis/06-cookies-basics.js
