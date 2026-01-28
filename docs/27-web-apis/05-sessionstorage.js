/**
 * WEB APIS: 05 - sessionStorage
 *
 * ONE CONCEPT: Tab-specific storage that clears when tab closes
 */


// =============================================================================
// WHAT IS SESSIONSTORAGE?
// =============================================================================

/**
 * sessionStorage = Temporary storage that's isolated to a single browser tab.
 *
 *
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  SESSIONSTORAGE vs LOCALSTORAGE                                      │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │                    │ localStorage      │ sessionStorage              │
 *   │  ──────────────────┼───────────────────┼─────────────────────────────│
 *   │  Persistence       │ Permanent         │ Until tab closes            │
 *   │  Scope             │ All tabs/windows  │ Single tab only             │
 *   │  New tab (same URL)│ Shared            │ New empty storage           │
 *   │  Page refresh      │ Survives          │ Survives                    │
 *   │  Browser restart   │ Survives          │ CLEARED                     │
 *   │  Capacity          │ ~5-10 MB          │ ~5-10 MB                    │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 *
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  TAB ISOLATION ILLUSTRATION                                          │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │   Tab 1: myapp.com                   Tab 2: myapp.com                │
 *   │   ┌─────────────────────┐            ┌─────────────────────┐         │
 *   │   │ sessionStorage      │            │ sessionStorage      │         │
 *   │   │ ─────────────────── │            │ ─────────────────── │         │
 *   │   │ formStep: "2"       │            │ formStep: "1"       │         │
 *   │   │ filters: {...}      │            │ filters: {...}      │         │
 *   │   └─────────────────────┘            └─────────────────────┘         │
 *   │   (different data!)                  (different data!)               │
 *   │                                                                      │
 *   │   localStorage (SHARED between both tabs)                            │
 *   │   ┌─────────────────────────────────────────────────────────┐        │
 *   │   │ theme: "dark"                                           │        │
 *   │   │ user: {...}                                             │        │
 *   │   └─────────────────────────────────────────────────────────┘        │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// BASIC API (Same as localStorage)
// =============================================================================

console.log('=== sessionStorage API ===\n');

const basicAPI = `
// ═══════════════════════════════════════════════════════════════════════
// IDENTICAL API TO LOCALSTORAGE
// ═══════════════════════════════════════════════════════════════════════

// Set item
sessionStorage.setItem('currentStep', '2');

// Get item
const step = sessionStorage.getItem('currentStep');  // '2'

// Remove item
sessionStorage.removeItem('currentStep');

// Clear all (for this tab only)
sessionStorage.clear();

// Length
console.log(sessionStorage.length);


// ═══════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS (same pattern)
// ═══════════════════════════════════════════════════════════════════════

function setSessionJSON(key, value) {
  sessionStorage.setItem(key, JSON.stringify(value));
}

function getSessionJSON(key) {
  const item = sessionStorage.getItem(key);
  try {
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
}
`;

console.log(basicAPI);


// =============================================================================
// WHEN TO USE SESSIONSTORAGE
// =============================================================================

console.log('\n=== When to Use sessionStorage ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  PERFECT USE CASES FOR SESSIONSTORAGE                               │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  ✓ Multi-step form wizard (step progress)                           │
 *   │  ✓ Filter/sort state for a specific session                         │
 *   │  ✓ Scroll position restoration                                      │
 *   │  ✓ One-time messages (show once per session)                        │
 *   │  ✓ Temporary UI state                                               │
 *   │  ✓ Shopping comparison (Tab 1: Product A, Tab 2: Product B)         │
 *   │  ✓ Sensitive temporary data (better than localStorage)              │
 *   │                                                                     │
 *   │                                                                     │
 *   │  KEY INSIGHT: Use when each tab should have independent state!      │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// REAL-WORLD EXAMPLES
// =============================================================================

console.log('=== Real-World Examples ===\n');

const realWorldExamples = `
// ═══════════════════════════════════════════════════════════════════════
// EXAMPLE 1: Multi-Step Form Wizard
// ═══════════════════════════════════════════════════════════════════════

/**
 *   Why sessionStorage for forms?
 *
 *   - User can open multiple tabs to fill different forms
 *   - Each tab has its own form progress
 *   - Data clears when they close the tab (privacy)
 *   - Survives page refresh within the session
 */

class FormWizard {
  constructor(formId) {
    this.formId = formId;
    this.storageKey = 'wizard_' + formId;
  }

  saveProgress(step, data) {
    const current = this.getProgress();
    current.step = step;
    current.data = { ...current.data, ...data };
    current.lastUpdated = Date.now();
    sessionStorage.setItem(this.storageKey, JSON.stringify(current));
  }

  getProgress() {
    const saved = sessionStorage.getItem(this.storageKey);
    return saved ? JSON.parse(saved) : { step: 1, data: {} };
  }

  clearProgress() {
    sessionStorage.removeItem(this.storageKey);
  }
}

// Usage
const wizard = new FormWizard('checkout');

// Step 1: Shipping
wizard.saveProgress(1, {
  address: '123 Main St',
  city: 'New York'
});

// Step 2: Payment
wizard.saveProgress(2, {
  cardType: 'visa',
  lastFour: '4242'
});

// On page load - restore progress
const progress = wizard.getProgress();
goToStep(progress.step);
fillForm(progress.data);


// ═══════════════════════════════════════════════════════════════════════
// EXAMPLE 2: Filter State for Search Page
// ═══════════════════════════════════════════════════════════════════════

/**
 *   User opens 2 tabs:
 *   Tab 1: Searching for "laptops" with price filter
 *   Tab 2: Searching for "phones" with brand filter
 *   Each tab should maintain its own filters!
 */

class SearchFilters {
  constructor() {
    this.key = 'search_filters';
  }

  save(filters) {
    sessionStorage.setItem(this.key, JSON.stringify({
      query: filters.query,
      category: filters.category,
      priceRange: filters.priceRange,
      sortBy: filters.sortBy,
      page: filters.page
    }));
  }

  load() {
    const saved = sessionStorage.getItem(this.key);
    return saved ? JSON.parse(saved) : this.getDefaults();
  }

  getDefaults() {
    return {
      query: '',
      category: 'all',
      priceRange: { min: 0, max: Infinity },
      sortBy: 'relevance',
      page: 1
    };
  }
}

// On page load
const filters = new SearchFilters();
applyFilters(filters.load());

// On filter change
filterForm.addEventListener('change', () => {
  const currentFilters = getFiltersFromForm();
  filters.save(currentFilters);
  performSearch(currentFilters);
});


// ═══════════════════════════════════════════════════════════════════════
// EXAMPLE 3: Scroll Position Restoration
// ═══════════════════════════════════════════════════════════════════════

/**
 *   User scrolls down a long list, clicks an item, then hits back.
 *   They should return to the same scroll position.
 */

// Save scroll position before leaving
window.addEventListener('beforeunload', () => {
  sessionStorage.setItem('scrollPosition', window.scrollY.toString());
});

// Restore on load
window.addEventListener('load', () => {
  const savedPosition = sessionStorage.getItem('scrollPosition');
  if (savedPosition) {
    window.scrollTo(0, parseInt(savedPosition, 10));
    sessionStorage.removeItem('scrollPosition');  // Clear after use
  }
});


// ═══════════════════════════════════════════════════════════════════════
// EXAMPLE 4: One-Time Messages
// ═══════════════════════════════════════════════════════════════════════

/**
 *   Show a banner once per session:
 *   "Welcome! Check out our new features..."
 */

function showOncePerSession(messageId, showFn) {
  const key = 'shown_' + messageId;

  if (!sessionStorage.getItem(key)) {
    showFn();
    sessionStorage.setItem(key, 'true');
  }
}

// Usage
showOncePerSession('welcome_banner', () => {
  document.getElementById('welcome-banner').style.display = 'block';
});

showOncePerSession('cookie_notice', () => {
  showCookieConsent();
});


// ═══════════════════════════════════════════════════════════════════════
// EXAMPLE 5: Tab-Specific Comparison Shopping
// ═══════════════════════════════════════════════════════════════════════

/**
 *   E-commerce: User opens Product A in Tab 1, Product B in Tab 2
 *   Each tab tracks its own "recently viewed" for comparison
 */

function addToSessionHistory(product) {
  const history = JSON.parse(sessionStorage.getItem('viewHistory') || '[]');

  // Add to front, remove duplicates, limit to 5
  const filtered = history.filter(p => p.id !== product.id);
  const updated = [product, ...filtered].slice(0, 5);

  sessionStorage.setItem('viewHistory', JSON.stringify(updated));
}

// Each tab has its own view history!
`;

console.log(realWorldExamples);


// =============================================================================
// DUPLICATE TAB BEHAVIOR
// =============================================================================

console.log('\n=== Duplicate Tab Behavior ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  WHAT HAPPENS WHEN USER DUPLICATES A TAB?                           │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  Ctrl+D or Right-click → Duplicate Tab                              │
 *   │                                                                     │
 *   │  The sessionStorage is COPIED to the new tab!                       │
 *   │  But after that, they are INDEPENDENT.                              │
 *   │                                                                     │
 *   │  Tab 1: sessionStorage.setItem('count', '1')                        │
 *   │  [User duplicates tab]                                              │
 *   │  Tab 2: sessionStorage.getItem('count') → '1' (copied!)             │
 *   │                                                                     │
 *   │  Tab 1: sessionStorage.setItem('count', '2')                        │
 *   │  Tab 2: sessionStorage.getItem('count') → '1' (independent!)        │
 *   │                                                                     │
 *   │  Note: This is DIFFERENT from opening a new tab via URL             │
 *   │        New tab via URL = empty sessionStorage                       │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Duplicate tab: sessionStorage is copied, then independent');
console.log('New tab (same URL): sessionStorage is empty');


// =============================================================================
// NO STORAGE EVENT!
// =============================================================================

console.log('\n=== No Cross-Tab Events ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  ⚠️  sessionStorage does NOT trigger 'storage' event!               │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  localStorage: Changes trigger 'storage' event in other tabs        │
 *   │  sessionStorage: Changes are isolated, no cross-tab events          │
 *   │                                                                     │
 *   │  This makes sense - sessionStorage is TAB-SPECIFIC!                 │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

const noEventCode = `
// This event listener will NOT fire for sessionStorage changes
window.addEventListener('storage', (e) => {
  // Only fires for localStorage changes!
  console.log('Change from another tab:', e.key);
});

// To react to sessionStorage changes within same tab,
// use custom events or state management
`;

console.log(noEventCode);


// =============================================================================
// INTERVIEW: What to Say (1-2 minutes)
// =============================================================================

/**
 * QUESTION: "What's the difference between localStorage and sessionStorage?"
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * YOUR ANSWER:
 *
 * "The key difference is scope and persistence.
 *
 * localStorage is permanent and shared across all tabs of the same origin.
 * If I save a theme preference in one tab, all other tabs see it. It
 * persists even after closing the browser.
 *
 * sessionStorage is temporary and isolated to a single tab. Each tab has
 * its own separate storage. When the tab closes, the data is cleared.
 *
 * I use sessionStorage for tab-specific state. For example, in a multi-step
 * checkout form, I store the current step and form data in sessionStorage.
 * This way, if a user opens two tabs to make two different orders, each
 * tab tracks its own progress independently. It also survives page refresh,
 * so if they accidentally refresh, they don't lose their progress.
 *
 * Other use cases include filter state on search pages, scroll position
 * restoration, and one-time banners that should only show once per session.
 *
 * One thing to note - if a user duplicates a tab, the sessionStorage is
 * copied to the new tab, but after that they're independent. If they
 * open a new tab via URL, it starts with empty sessionStorage.
 *
 * Also, unlike localStorage, sessionStorage doesn't trigger cross-tab
 * events, which makes sense since it's tab-specific."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * KEY POINTS TO MENTION:
 * ✓ Tab-specific (isolated per tab)
 * ✓ Clears when tab closes
 * ✓ Survives page refresh
 * ✓ Use for: form wizards, filters, scroll position
 * ✓ No cross-tab storage event
 *
 */


// RUN: node docs/27-web-apis/05-sessionstorage.js
