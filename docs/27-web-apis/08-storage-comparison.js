/**
 * WEB APIS: 08 - Storage Comparison
 *
 * ONE CONCEPT: When to use localStorage vs sessionStorage vs Cookies vs IndexedDB
 */


// =============================================================================
// THE BIG PICTURE
// =============================================================================

/**
 *
 *   ┌──────────────────────────────────────────────────────────────────────────┐
 *   │  BROWSER STORAGE OPTIONS                                                 │
 *   ├──────────────────────────────────────────────────────────────────────────┤
 *   │                                                                          │
 *   │  ┌─────────────────────────────────────────────────────────────────────┐ │
 *   │  │                         COOKIES                                     │ │
 *   │  │  Size: ~4 KB                                                        │ │
 *   │  │  Sent to server: YES (automatically!)                               │ │
 *   │  │  Use for: Authentication, server-side needs                         │ │
 *   │  └─────────────────────────────────────────────────────────────────────┘ │
 *   │                                                                          │
 *   │  ┌─────────────────────────────────────────────────────────────────────┐ │
 *   │  │                      LOCALSTORAGE                                   │ │
 *   │  │  Size: ~5-10 MB                                                     │ │
 *   │  │  Persistence: Permanent                                             │ │
 *   │  │  Scope: All tabs                                                    │ │
 *   │  │  Use for: Preferences, caching, cart                                │ │
 *   │  └─────────────────────────────────────────────────────────────────────┘ │
 *   │                                                                          │
 *   │  ┌─────────────────────────────────────────────────────────────────────┐ │
 *   │  │                     SESSIONSTORAGE                                  │ │
 *   │  │  Size: ~5-10 MB                                                     │ │
 *   │  │  Persistence: Tab closes = gone                                     │ │
 *   │  │  Scope: Single tab only                                             │ │
 *   │  │  Use for: Form wizard, temporary state                              │ │
 *   │  └─────────────────────────────────────────────────────────────────────┘ │
 *   │                                                                          │
 *   │  ┌─────────────────────────────────────────────────────────────────────┐ │
 *   │  │                       INDEXEDDB                                     │ │
 *   │  │  Size: Large (50 MB+, can request more)                             │ │
 *   │  │  Persistence: Permanent                                             │ │
 *   │  │  Features: Indexes, transactions, complex queries                   │ │
 *   │  │  Use for: Offline data, large datasets, file storage               │ │
 *   │  └─────────────────────────────────────────────────────────────────────┘ │
 *   │                                                                          │
 *   └──────────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// DETAILED COMPARISON TABLE
// =============================================================================

console.log('=== Storage Comparison ===\n');

/**
 *   ┌────────────────┬──────────────┬───────────────┬──────────────┬─────────────┐
 *   │ Feature        │ Cookies      │ localStorage  │sessionStorage│ IndexedDB   │
 *   ├────────────────┼──────────────┼───────────────┼──────────────┼─────────────┤
 *   │ Capacity       │ ~4 KB        │ ~5-10 MB      │ ~5-10 MB     │ 50+ MB      │
 *   │ Persistence    │ Configurable │ Permanent     │ Tab only     │ Permanent   │
 *   │ Sent to Server │ YES          │ NO            │ NO           │ NO          │
 *   │ API            │ String       │ Sync KV       │ Sync KV      │ Async       │
 *   │ Data Types     │ String       │ String        │ String       │ Any         │
 *   │ HttpOnly       │ YES          │ NO            │ NO           │ NO          │
 *   │ Tab Scope      │ All tabs     │ All tabs      │ One tab      │ All tabs    │
 *   │ Workers Access │ NO           │ NO            │ NO           │ YES         │
 *   └────────────────┴──────────────┴───────────────┴──────────────┴─────────────┘
 *
 */

console.log('┌────────────────┬──────────────┬───────────────┬──────────────┬─────────────┐');
console.log('│ Feature        │ Cookies      │ localStorage  │sessionStorage│ IndexedDB   │');
console.log('├────────────────┼──────────────┼───────────────┼──────────────┼─────────────┤');
console.log('│ Capacity       │ ~4 KB        │ ~5-10 MB      │ ~5-10 MB     │ 50+ MB      │');
console.log('│ Persistence    │ Configurable │ Permanent     │ Tab only     │ Permanent   │');
console.log('│ Sent to Server │ YES          │ NO            │ NO           │ NO          │');
console.log('│ API            │ String       │ Sync KV       │ Sync KV      │ Async       │');
console.log('│ Data Types     │ String       │ String        │ String       │ Any         │');
console.log('│ HttpOnly       │ YES          │ NO            │ NO           │ NO          │');
console.log('│ Tab Scope      │ All tabs     │ All tabs      │ One tab      │ All tabs    │');
console.log('└────────────────┴──────────────┴───────────────┴──────────────┴─────────────┘');


// =============================================================================
// DECISION FLOWCHART
// =============================================================================

console.log('\n=== Decision Flowchart ===\n');

/**
 *
 *   ┌───────────────────────────────────────────────────────────────────────────┐
 *   │  WHICH STORAGE SHOULD I USE?                                              │
 *   └───────────────────────────────────────────────────────────────────────────┘
 *
 *                    START
 *                      │
 *                      ▼
 *        ┌─────────────────────────────┐
 *        │ Does server need to read it?│
 *        └─────────────────────────────┘
 *                 │           │
 *               YES          NO
 *                 │           │
 *                 ▼           ▼
 *        ┌─────────────┐  ┌────────────────────────────┐
 *        │  COOKIES    │  │ Is data sensitive?         │
 *        │  (HttpOnly!)│  │ (passwords, tokens)        │
 *        └─────────────┘  └────────────────────────────┘
 *                                │              │
 *                              YES             NO
 *                                │              │
 *                                ▼              ▼
 *                        ┌─────────────┐  ┌─────────────────────────┐
 *                        │  COOKIES    │  │ Need tab isolation?     │
 *                        │  (HttpOnly!)│  └─────────────────────────┘
 *                        └─────────────┘        │             │
 *                                             YES            NO
 *                                               │             │
 *                                               ▼             ▼
 *                                    ┌───────────────┐  ┌─────────────────┐
 *                                    │sessionStorage │  │ Large data      │
 *                                    └───────────────┘  │ (>5 MB)?        │
 *                                                       └─────────────────┘
 *                                                             │        │
 *                                                           YES       NO
 *                                                             │        │
 *                                                             ▼        ▼
 *                                                    ┌───────────┐ ┌────────────┐
 *                                                    │ IndexedDB │ │localStorage│
 *                                                    └───────────┘ └────────────┘
 *
 */

console.log(`
  Server needs it?  →  YES  →  COOKIES (HttpOnly for auth)
        │
        NO
        │
  Sensitive data?   →  YES  →  COOKIES (HttpOnly)
        │
        NO
        │
  Tab isolation?    →  YES  →  sessionStorage
        │
        NO
        │
  Large data?       →  YES  →  IndexedDB
        │
        NO
        │
        ▼
   localStorage
`);


// =============================================================================
// USE CASE EXAMPLES
// =============================================================================

console.log('=== Real-World Use Cases ===\n');

const useCases = `
// ═══════════════════════════════════════════════════════════════════════
// AUTHENTICATION - Use COOKIES (HttpOnly)
// ═══════════════════════════════════════════════════════════════════════

// WHY: Server needs to verify on every request
//      HttpOnly protects from XSS
//      Automatically sent with requests

// Server sets:
res.cookie('sessionId', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'lax'
});


// ═══════════════════════════════════════════════════════════════════════
// USER PREFERENCES - Use LOCALSTORAGE
// ═══════════════════════════════════════════════════════════════════════

// WHY: Persist across sessions
//      Don't need server to read
//      Theme, language, UI settings

localStorage.setItem('theme', 'dark');
localStorage.setItem('fontSize', '16');
localStorage.setItem('sidebarCollapsed', 'true');


// ═══════════════════════════════════════════════════════════════════════
// SHOPPING CART - Use LOCALSTORAGE
// ═══════════════════════════════════════════════════════════════════════

// WHY: Persist if user closes browser
//      Can be synced with server when ready
//      Shared across tabs

const cart = JSON.parse(localStorage.getItem('cart')) || [];
cart.push({ id: 123, qty: 2 });
localStorage.setItem('cart', JSON.stringify(cart));


// ═══════════════════════════════════════════════════════════════════════
// MULTI-STEP FORM - Use SESSIONSTORAGE
// ═══════════════════════════════════════════════════════════════════════

// WHY: Each tab should be independent
//      Data clears when done (privacy)
//      Survives page refresh

sessionStorage.setItem('checkout_step', '2');
sessionStorage.setItem('checkout_data', JSON.stringify({
  address: '123 Main St',
  shipping: 'express'
}));


// ═══════════════════════════════════════════════════════════════════════
// SEARCH FILTERS - Use SESSIONSTORAGE
// ═══════════════════════════════════════════════════════════════════════

// WHY: Tab-specific (different searches in different tabs)
//      Don't persist after session

sessionStorage.setItem('search_filters', JSON.stringify({
  category: 'electronics',
  priceRange: [100, 500],
  sortBy: 'price'
}));


// ═══════════════════════════════════════════════════════════════════════
// OFFLINE APP DATA - Use INDEXEDDB
// ═══════════════════════════════════════════════════════════════════════

// WHY: Large dataset (hundreds of records)
//      Complex queries needed
//      Offline-first app

// Store user's messages for offline access
const db = await openDB('chat', 1);
await db.put('messages', { id: 1, text: 'Hello', timestamp: Date.now() });


// ═══════════════════════════════════════════════════════════════════════
// CACHED API RESPONSES - Use LOCALSTORAGE (small) or INDEXEDDB (large)
// ═══════════════════════════════════════════════════════════════════════

// Small cache with expiration
function cacheWithExpiry(key, data, ttl = 3600000) {
  const item = {
    data,
    expiry: Date.now() + ttl
  };
  localStorage.setItem(key, JSON.stringify(item));
}

function getFromCache(key) {
  const item = JSON.parse(localStorage.getItem(key));
  if (!item) return null;
  if (Date.now() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  return item.data;
}
`;

console.log(useCases);


// =============================================================================
// SECURITY CONSIDERATIONS
// =============================================================================

console.log('\n=== Security Considerations ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────────┐
 *   │  SECURITY COMPARISON                                                    │
 *   ├─────────────────────────────────────────────────────────────────────────┤
 *   │                                                                         │
 *   │  Storage Type       │ XSS Vulnerable?  │ Use for Auth?                  │
 *   │  ───────────────────┼──────────────────┼──────────────────────────────  │
 *   │  localStorage       │ YES (JS access)  │ NO!                            │
 *   │  sessionStorage     │ YES (JS access)  │ NO!                            │
 *   │  Cookies            │ Depends          │ YES (with HttpOnly)            │
 *   │  IndexedDB          │ YES (JS access)  │ NO!                            │
 *   │                                                                         │
 *   │                                                                         │
 *   │  ⚠️  NEVER store in localStorage/sessionStorage:                        │
 *   │  • Authentication tokens                                                │
 *   │  • Passwords                                                            │
 *   │  • Credit card numbers                                                  │
 *   │  • Personal data (SSN, etc.)                                            │
 *   │                                                                         │
 *   │  Any script on your page (including XSS) can read them!                 │
 *   │                                                                         │
 *   └─────────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('❌ localStorage/sessionStorage: JS accessible = XSS vulnerable');
console.log('✓ Cookies with HttpOnly: JS cannot access = XSS protected');
console.log('\nNEVER store auth tokens in localStorage!');


// =============================================================================
// INTERVIEW: What to Say (1-2 minutes)
// =============================================================================

/**
 * QUESTION: "When would you use localStorage vs sessionStorage vs Cookies?"
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * YOUR ANSWER:
 *
 * "Each storage option has specific use cases.
 *
 * Cookies are for authentication and when the server needs to read the data.
 * They're automatically sent with every request. For auth tokens, I always
 * use HttpOnly cookies so JavaScript can't access them - this protects
 * against XSS attacks.
 *
 * localStorage is for persistent client-side data that doesn't need to go
 * to the server. I use it for user preferences like theme or language,
 * shopping carts, and caching API responses. It persists until explicitly
 * cleared and is shared across all tabs.
 *
 * sessionStorage is for tab-specific temporary data. I use it for multi-step
 * forms where each tab should have independent progress, or for search
 * filters where different tabs might have different filters. It clears
 * when the tab closes.
 *
 * IndexedDB is for large amounts of structured data or offline applications.
 * It's like a real database with indexes and transactions. I use it for
 * offline-first apps that need to store hundreds of records.
 *
 * For security, I never store sensitive data like auth tokens in localStorage
 * or sessionStorage because any JavaScript, including XSS attacks, can read
 * them. Sensitive data goes in HttpOnly cookies."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * KEY POINTS TO MENTION:
 * ✓ Cookies: Auth, server needs to read, HttpOnly for security
 * ✓ localStorage: Preferences, cart, cache (persistent, all tabs)
 * ✓ sessionStorage: Forms, filters (temporary, tab-specific)
 * ✓ IndexedDB: Large data, offline apps
 * ✓ Security: Never store auth tokens in localStorage!
 *
 */


// RUN: node docs/27-web-apis/08-storage-comparison.js
