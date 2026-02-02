/**
 * WEB APIS: 04 - localStorage
 *
 * ONE CONCEPT: Persistent key-value storage in the browser
 */


// =============================================================================
// WHAT IS LOCALSTORAGE?
// =============================================================================

/**
 * localStorage = Persistent storage that survives browser restart.
 *
 *
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  LOCALSTORAGE CHARACTERISTICS                                        │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  Capacity:     ~5-10 MB per origin                                   │
 *   │  Persistence:  PERMANENT (until manually cleared)                    │
 *   │  Scope:        Per origin (protocol + domain + port)                 │
 *   │  Access:       Synchronous (blocks main thread)                      │
 *   │  Data Type:    Strings ONLY (must serialize objects)                 │
 *   │  Sent to Server: NO (unlike cookies)                                 │
 *   │                                                                      │
 *   │                                                                      │
 *   │  PERSISTENCE ILLUSTRATION:                                           │
 *   │  ─────────────────────────────────────────────────────────────────── │
 *   │                                                                      │
 *   │  Day 1: User visits site                                             │
 *   │         localStorage.setItem('theme', 'dark')                        │
 *   │                                                                      │
 *   │  Day 2: User closes browser                                          │
 *   │         (localStorage persists)                                      │
 *   │                                                                      │
 *   │  Day 30: User returns                                                │
 *   │          localStorage.getItem('theme') → 'dark' ✓                    │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// BASIC API
// =============================================================================

console.log('=== localStorage API ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  METHODS                                                            │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  setItem(key, value)  - Store a value                               │
 *   │  getItem(key)         - Retrieve a value (null if not found)        │
 *   │  removeItem(key)      - Delete a key                                │
 *   │  clear()              - Delete ALL keys for this origin             │
 *   │  key(index)           - Get key name by index                       │
 *   │  length               - Number of stored items                      │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

const basicAPI = `
// ═══════════════════════════════════════════════════════════════════════
// BASIC OPERATIONS
// ═══════════════════════════════════════════════════════════════════════

// Set item
localStorage.setItem('username', 'john_doe');

// Get item
const username = localStorage.getItem('username');  // 'john_doe'
const missing = localStorage.getItem('nonexistent'); // null

// Remove item
localStorage.removeItem('username');

// Clear all
localStorage.clear();

// Get number of items
console.log(localStorage.length);  // 0

// Get key by index
const firstKey = localStorage.key(0);  // key name at index 0
`;

console.log(basicAPI);


// =============================================================================
// STORING OBJECTS (JSON)
// =============================================================================

console.log('\n=== Storing Objects ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  ⚠️  localStorage ONLY stores STRINGS!                              │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  // This FAILS!                                                     │
 *   │  localStorage.setItem('user', { name: 'John' });                    │
 *   │  localStorage.getItem('user');  // "[object Object]" ← WRONG!       │
 *   │                                                                     │
 *   │  // Use JSON.stringify / JSON.parse                                 │
 *   │  localStorage.setItem('user', JSON.stringify({ name: 'John' }));    │
 *   │  JSON.parse(localStorage.getItem('user'));  // { name: 'John' } ✓   │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

const objectStorage = `
// ═══════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS (use these!)
// ═══════════════════════════════════════════════════════════════════════

function setJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getJSON(key) {
  const item = localStorage.getItem(key);
  if (item === null) return null;

  try {
    return JSON.parse(item);
  } catch {
    return null;  // Invalid JSON
  }
}

// Usage
setJSON('user', { id: 1, name: 'John', roles: ['admin', 'user'] });
const user = getJSON('user');  // { id: 1, name: 'John', roles: [...] }

setJSON('settings', { theme: 'dark', notifications: true });
const settings = getJSON('settings');


// ═══════════════════════════════════════════════════════════════════════
// STORING ARRAYS
// ═══════════════════════════════════════════════════════════════════════

// Save cart items
const cart = [
  { id: 1, name: 'Product A', qty: 2 },
  { id: 2, name: 'Product B', qty: 1 }
];
setJSON('cart', cart);

// Retrieve and modify
const savedCart = getJSON('cart') || [];
savedCart.push({ id: 3, name: 'Product C', qty: 1 });
setJSON('cart', savedCart);
`;

console.log(objectStorage);


// =============================================================================
// REAL-WORLD USE CASES
// =============================================================================

console.log('\n=== Real-World Use Cases ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  WHEN TO USE LOCALSTORAGE                                           │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  ✓ User preferences (theme, language, layout)                       │
 *   │  ✓ Shopping cart (persists if user closes tab)                      │
 *   │  ✓ Form drafts (auto-save)                                          │
 *   │  ✓ Recently viewed items                                            │
 *   │  ✓ UI state (sidebar collapsed, table sort order)                   │
 *   │  ✓ Feature flags / A-B test variants                                │
 *   │  ✓ Cached API responses (with expiration)                           │
 *   │                                                                     │
 *   │  ✗ DON'T USE FOR:                                                   │
 *   │  ✗ Sensitive data (passwords, tokens - use httpOnly cookies)        │
 *   │  ✗ Large data (use IndexedDB)                                       │
 *   │  ✗ Data that must be secure (accessible to any JS)                  │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

const realWorldExamples = `
// ═══════════════════════════════════════════════════════════════════════
// EXAMPLE 1: Theme Preference
// ═══════════════════════════════════════════════════════════════════════
function setTheme(theme) {
  document.body.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

function loadTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.setAttribute('data-theme', savedTheme);
}

// On page load
loadTheme();


// ═══════════════════════════════════════════════════════════════════════
// EXAMPLE 2: Shopping Cart Persistence
// ═══════════════════════════════════════════════════════════════════════
class Cart {
  constructor() {
    this.items = JSON.parse(localStorage.getItem('cart')) || [];
  }

  save() {
    localStorage.setItem('cart', JSON.stringify(this.items));
  }

  addItem(product, quantity = 1) {
    const existing = this.items.find(i => i.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({ ...product, quantity });
    }
    this.save();
  }

  removeItem(productId) {
    this.items = this.items.filter(i => i.id !== productId);
    this.save();
  }

  clear() {
    this.items = [];
    localStorage.removeItem('cart');
  }

  get total() {
    return this.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }
}

// Cart persists across sessions!
const cart = new Cart();


// ═══════════════════════════════════════════════════════════════════════
// EXAMPLE 3: Form Auto-Save (Draft)
// ═══════════════════════════════════════════════════════════════════════
const form = document.getElementById('blog-post-form');
const DRAFT_KEY = 'blog_post_draft';

// Save draft on input
form.addEventListener('input', debounce(() => {
  const draft = {
    title: form.title.value,
    content: form.content.value,
    savedAt: Date.now()
  };
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  showNotification('Draft saved');
}, 1000));

// Load draft on page load
function loadDraft() {
  const draft = JSON.parse(localStorage.getItem(DRAFT_KEY));
  if (draft) {
    form.title.value = draft.title;
    form.content.value = draft.content;
    showNotification('Draft restored from ' + new Date(draft.savedAt).toLocaleString());
  }
}

// Clear draft on successful submit
form.addEventListener('submit', () => {
  localStorage.removeItem(DRAFT_KEY);
});


// ═══════════════════════════════════════════════════════════════════════
// EXAMPLE 4: Cached API Response with Expiration
// ═══════════════════════════════════════════════════════════════════════
async function fetchWithCache(url, cacheTime = 5 * 60 * 1000) {  // 5 min
  const cacheKey = 'cache_' + url;
  const cached = JSON.parse(localStorage.getItem(cacheKey));

  // Check if cache is valid
  if (cached && Date.now() - cached.timestamp < cacheTime) {
    console.log('Using cached data');
    return cached.data;
  }

  // Fetch fresh data
  const response = await fetch(url);
  const data = await response.json();

  // Cache the response
  localStorage.setItem(cacheKey, JSON.stringify({
    data,
    timestamp: Date.now()
  }));

  return data;
}

// Usage
const products = await fetchWithCache('/api/products');
`;

console.log(realWorldExamples);


// =============================================================================
// STORAGE EVENT (Cross-Tab Communication)
// =============================================================================

console.log('\n=== Storage Event (Cross-Tab) ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  CROSS-TAB SYNCHRONIZATION                                          │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  When localStorage changes in one tab, other tabs are notified!     │
 *   │                                                                     │
 *   │  Tab 1: localStorage.setItem('user', '...')                         │
 *   │            │                                                        │
 *   │            ▼                                                        │
 *   │  Tab 2: window.addEventListener('storage', handler)                 │
 *   │         handler receives: { key, oldValue, newValue, url }          │
 *   │                                                                     │
 *   │  Note: Event fires in OTHER tabs, not the one that made the change  │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

const storageEventCode = `
// Listen for changes from OTHER tabs
window.addEventListener('storage', (event) => {
  console.log('Storage changed in another tab!');
  console.log('Key:', event.key);
  console.log('Old Value:', event.oldValue);
  console.log('New Value:', event.newValue);
  console.log('URL:', event.url);

  // React to specific changes
  if (event.key === 'user') {
    if (event.newValue === null) {
      // User logged out in another tab
      window.location.href = '/login';
    } else {
      // User changed, reload data
      loadUserData();
    }
  }

  if (event.key === 'theme') {
    // Sync theme across tabs
    setTheme(event.newValue);
  }
});

// REAL-WORLD: Logout everywhere
function logout() {
  localStorage.removeItem('user');
  localStorage.removeItem('accessToken');
  // All other tabs will redirect to login!
}
`;

console.log(storageEventCode);


// =============================================================================
// ERROR HANDLING
// =============================================================================

console.log('\n=== Error Handling ===\n');

const errorHandling = `
// localStorage can throw errors!
// - QuotaExceededError when storage is full
// - SecurityError in private browsing (some browsers)

function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      console.error('Storage full! Consider clearing old data.');
      // Maybe clear old cached data
      clearOldCacheEntries();
    }
    return false;
  }
}

function safeGetItem(key) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
}

// Check if localStorage is available
function isLocalStorageAvailable() {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}
`;

console.log(errorHandling);


// =============================================================================
// INTERVIEW: What to Say (1-2 minutes)
// =============================================================================

/**
 * QUESTION: "When would you use localStorage?"
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * YOUR ANSWER:
 *
 * "localStorage is persistent key-value storage that survives browser restarts.
 * It's perfect for non-sensitive data that should persist across sessions.
 *
 * I use it for user preferences like theme or language settings, shopping
 * carts in e-commerce sites, form drafts with auto-save, and caching API
 * responses with expiration timestamps.
 *
 * The API is simple - setItem, getItem, removeItem, clear. But it only
 * stores strings, so I always use JSON.stringify and JSON.parse for
 * objects. I usually create helper functions to handle this.
 *
 * There are important limitations. It's synchronous and blocks the main
 * thread, so don't store too much data. It's about 5-10MB per origin.
 * For larger data, I'd use IndexedDB.
 *
 * Security-wise, any JavaScript on the page can access it, so I never
 * store sensitive data like authentication tokens there. For auth, I use
 * httpOnly cookies that JavaScript can't access.
 *
 * One cool feature is the storage event. When localStorage changes in one
 * tab, other tabs get notified. I've used this to sync logout across tabs -
 * when user logs out in one tab, all tabs redirect to login."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * KEY POINTS TO MENTION:
 * ✓ Persistent (survives restart), ~5-10MB
 * ✓ Strings only - use JSON.stringify/parse
 * ✓ Use for: preferences, cart, drafts, caching
 * ✓ DON'T use for: sensitive data (use httpOnly cookies)
 * ✓ Storage event for cross-tab sync
 *
 */


// RUN: node docs/27-web-apis/04-localstorage.js
