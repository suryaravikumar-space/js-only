/**
 * WEB APIS: 14 - History API
 *
 * ONE CONCEPT: Manipulate browser history for SPA navigation
 */


// =============================================================================
// WHAT IS THE HISTORY API?
// =============================================================================

/**
 *
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  SPA ROUTING PROBLEM                                                 │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  Traditional Site:                                                   │
 *   │  /home  → Full page load                                             │
 *   │  /about → Full page load                                             │
 *   │  Back button works naturally                                         │
 *   │                                                                      │
 *   │  SPA Without History API:                                            │
 *   │  /home → JS changes content (URL stays same!)                        │
 *   │  /about → JS changes content (URL still same!)                       │
 *   │  Back button goes to previous SITE, not previous page!               │
 *   │                                                                      │
 *   │  SPA With History API:                                               │
 *   │  /home → JS changes content + updates URL                            │
 *   │  /about → JS changes content + updates URL                           │
 *   │  Back button works! ✓                                                │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// BASIC API
// =============================================================================

console.log('=== History API Methods ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  HISTORY METHODS                                                    │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  history.pushState(state, title, url)                               │
 *   │    Adds new entry to history (like navigating to new page)          │
 *   │                                                                     │
 *   │  history.replaceState(state, title, url)                            │
 *   │    Replaces current entry (doesn't add to history)                  │
 *   │                                                                     │
 *   │  history.back()      - Go back one page                             │
 *   │  history.forward()   - Go forward one page                          │
 *   │  history.go(n)       - Go n pages (negative = back)                 │
 *   │                                                                     │
 *   │  window.onpopstate   - Fires when user clicks back/forward          │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

const basicAPI = `
// ═══════════════════════════════════════════════════════════════════════
// PUSHSTATE - Add new history entry
// ═══════════════════════════════════════════════════════════════════════

// Navigate to /about without page reload
history.pushState(
  { page: 'about' },  // State object (accessible in popstate)
  '',                  // Title (ignored by most browsers)
  '/about'            // URL to show
);

// Now:
// - URL shows /about
// - Page didn't reload
// - Back button will go to previous URL


// ═══════════════════════════════════════════════════════════════════════
// REPLACESTATE - Replace current entry
// ═══════════════════════════════════════════════════════════════════════

// Change URL without adding to history
history.replaceState(
  { page: 'about', section: 'team' },
  '',
  '/about#team'
);

// Use case: Update URL for filters/tabs without cluttering history


// ═══════════════════════════════════════════════════════════════════════
// POPSTATE - Handle back/forward buttons
// ═══════════════════════════════════════════════════════════════════════

window.addEventListener('popstate', (event) => {
  console.log('User navigated back/forward');
  console.log('State:', event.state);

  // Load the appropriate content
  if (event.state) {
    loadPage(event.state.page);
  }
});
`;

console.log(basicAPI);


// =============================================================================
// SIMPLE SPA ROUTER
// =============================================================================

console.log('\n=== Simple SPA Router ===\n');

const simpleRouter = `
class Router {
  constructor() {
    this.routes = {};

    // Handle back/forward buttons
    window.addEventListener('popstate', (e) => {
      this.handleRoute(window.location.pathname);
    });
  }

  // Register a route
  on(path, handler) {
    this.routes[path] = handler;
  }

  // Navigate to a path
  navigate(path, data = {}) {
    history.pushState(data, '', path);
    this.handleRoute(path);
  }

  // Handle a route
  handleRoute(path) {
    const handler = this.routes[path] || this.routes['/404'];
    if (handler) {
      handler();
    }
  }

  // Initialize with current URL
  init() {
    this.handleRoute(window.location.pathname);
  }
}

// Usage
const router = new Router();

router.on('/', () => {
  document.getElementById('app').innerHTML = '<h1>Home</h1>';
});

router.on('/about', () => {
  document.getElementById('app').innerHTML = '<h1>About</h1>';
});

router.on('/products', async () => {
  const products = await fetch('/api/products').then(r => r.json());
  document.getElementById('app').innerHTML = renderProducts(products);
});

router.on('/404', () => {
  document.getElementById('app').innerHTML = '<h1>Page Not Found</h1>';
});

router.init();

// Handle link clicks
document.addEventListener('click', (e) => {
  if (e.target.matches('a[data-link]')) {
    e.preventDefault();
    router.navigate(e.target.href);
  }
});

// HTML: <a href="/about" data-link>About</a>
`;

console.log(simpleRouter);


// =============================================================================
// REAL-WORLD PATTERNS
// =============================================================================

console.log('\n=== Real-World Patterns ===\n');

const realWorldPatterns = `
// ═══════════════════════════════════════════════════════════════════════
// PATTERN 1: Preserve Scroll Position
// ═══════════════════════════════════════════════════════════════════════

function navigate(path) {
  // Save current scroll position
  history.replaceState(
    { ...history.state, scrollY: window.scrollY },
    '',
    window.location.pathname
  );

  // Navigate to new page
  history.pushState({ scrollY: 0 }, '', path);
  loadPage(path);
  window.scrollTo(0, 0);
}

window.addEventListener('popstate', (e) => {
  loadPage(window.location.pathname);
  // Restore scroll position
  if (e.state?.scrollY) {
    window.scrollTo(0, e.state.scrollY);
  }
});


// ═══════════════════════════════════════════════════════════════════════
// PATTERN 2: Filter/Sort without History Spam
// ═══════════════════════════════════════════════════════════════════════

function updateFilters(filters) {
  const url = new URL(window.location);

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
  });

  // Replace, don't push - filters shouldn't fill history
  history.replaceState(null, '', url);
}

// URL becomes: /products?category=shoes&sort=price


// ═══════════════════════════════════════════════════════════════════════
// PATTERN 3: Modal with URL
// ═══════════════════════════════════════════════════════════════════════

function openModal(modalId) {
  showModal(modalId);
  history.pushState({ modal: modalId }, '', \`?modal=\${modalId}\`);
}

function closeModal() {
  hideModal();
  history.back();  // Go back instead of pushState
}

window.addEventListener('popstate', (e) => {
  if (e.state?.modal) {
    showModal(e.state.modal);
  } else {
    hideAllModals();
  }
});
`;

console.log(realWorldPatterns);


// =============================================================================
// INTERVIEW: What to Say (1-2 minutes)
// =============================================================================

/**
 * QUESTION: "How do you implement client-side routing in a SPA?"
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * YOUR ANSWER:
 *
 * "I use the History API, specifically pushState and popstate.
 *
 * When a user clicks a link, instead of a full page load, I call
 * history.pushState with the new URL. This updates the browser URL
 * without reloading the page. Then I load the appropriate content
 * with JavaScript.
 *
 * The popstate event fires when the user clicks back or forward buttons.
 * In the handler, I check the current URL or the state object and load
 * the correct content.
 *
 * For filters and sort options, I use replaceState instead of pushState.
 * This updates the URL without adding a new history entry, so users don't
 * have to click back 20 times through all their filter changes.
 *
 * I also preserve scroll position by saving it in the state object before
 * navigation and restoring it on popstate.
 *
 * For a real application, I'd use a router library like React Router which
 * handles edge cases, but understanding the underlying History API is
 * important for debugging and custom implementations."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * KEY POINTS TO MENTION:
 * ✓ pushState changes URL without reload
 * ✓ popstate handles back/forward buttons
 * ✓ replaceState for filters (no history spam)
 * ✓ State object for passing data
 * ✓ Scroll position preservation
 *
 */


// RUN: node docs/27-web-apis/14-history-api.js
