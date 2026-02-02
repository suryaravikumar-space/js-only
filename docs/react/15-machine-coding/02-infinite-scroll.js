/**
 * TOPIC: Infinite Scroll — Machine Coding Interview
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  GOLDEN RULE: Track page number, loading flag, and hasMore.    ║
 * ║  Only fetch when NOT loading AND hasMore is true.              ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * ┌──────────────────────────────────────────────────────────────────┐
 * │  STORY: Imagine an Instagram feed. As you scroll to the bottom, │
 * │  new posts appear. There's a spinner while loading. If the      │
 * │  network fails, a "Retry" button appears. Eventually the feed   │
 * │  runs out (hasMore = false).                                     │
 * └──────────────────────────────────────────────────────────────────┘
 *
 * ┌─────────────────── VISUAL DIAGRAM ───────────────────┐
 * │                                                       │
 * │   ┌─────────────────────────┐                         │
 * │   │  Item 1                 │ ─ page 1                │
 * │   │  Item 2                 │                         │
 * │   │  Item 3                 │                         │
 * │   ├─────────────────────────┤                         │
 * │   │  Item 4                 │ ─ page 2                │
 * │   │  Item 5                 │                         │
 * │   │  Item 6                 │                         │
 * │   ├─────────────────────────┤                         │
 * │   │  [Loading spinner...]   │ ─ fetching page 3       │
 * │   └─────────────────────────┘                         │
 * │                                                       │
 * │   scroll -> threshold hit -> fetchPage(page+1)        │
 * │                                                       │
 * │   States: idle -> loading -> idle/error                │
 * │   If error: show retry button -> fetchPage(samePage)   │
 * └───────────────────────────────────────────────────────┘
 *
 * PROBLEM: Implement infinite scroll with loading, error retry, and page end.
 *
 * APPROACH:
 *  - State: { items, page, loading, error, hasMore }
 *  - mockFetch(page) returns items for a page (simulates API)
 *  - onScroll checks if near bottom -> triggers fetch
 *  - Error simulation on page 3 first attempt
 *
 * RUN: node docs/react/15-machine-coding/02-infinite-scroll.js
 */

const PAGE_SIZE = 3;
const TOTAL_ITEMS = 10;

// --- Mock API ---
let fetchCallCount = 0;
function mockFetch(page) {
  fetchCallCount++;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate error on page 3, first attempt only
      if (page === 3 && fetchCallCount === 4) {
        reject(new Error('Network error'));
        return;
      }
      const start = (page - 1) * PAGE_SIZE;
      const items = [];
      for (let i = start; i < Math.min(start + PAGE_SIZE, TOTAL_ITEMS); i++) {
        items.push({ id: i + 1, title: `Post #${i + 1}` });
      }
      const hasMore = start + PAGE_SIZE < TOTAL_ITEMS;
      resolve({ items, hasMore });
    }, 100);
  });
}

// --- State ---
const state = {
  items: [],
  page: 0,
  loading: false,
  error: null,
  hasMore: true,
};

function render(label) {
  console.log(`\n${label}`);
  console.log(`  loading=${state.loading} | error=${state.error} | page=${state.page} | hasMore=${state.hasMore}`);
  console.log(`  items: [${state.items.map(i => i.title).join(', ')}]`);
  if (state.loading) console.log('  [Spinner: Loading...]');
  if (state.error) console.log(`  [Error: ${state.error}] [Retry button]`);
  if (!state.hasMore && !state.loading) console.log('  -- End of feed --');
}

// --- Fetch next page ---
async function fetchNextPage() {
  if (state.loading || !state.hasMore) return;

  state.loading = true;
  state.error = null;
  const nextPage = state.page + 1;
  render(`A: Fetching page ${nextPage}...`);

  try {
    const { items, hasMore } = await mockFetch(nextPage);
    state.items = [...state.items, ...items];
    state.page = nextPage;
    state.hasMore = hasMore;
    state.loading = false;
    render(`B: Page ${nextPage} loaded`);
  } catch (err) {
    state.loading = false;
    state.error = err.message;
    render(`C: Page ${nextPage} FAILED`);
  }
}

// --- Retry ---
async function retry() {
  console.log('\n  [User clicks Retry]');
  state.error = null;
  await fetchNextPage();
}

// --- Simulate scroll threshold ---
function simulateScroll() {
  console.log('\n  >> User scrolled near bottom (threshold hit)');
  return fetchNextPage();
}

// --- Intersection Observer concept ---
function explainObserver() {
  console.log('\n--- INTERSECTION OBSERVER CONCEPT ---');
  console.log('  const observer = new IntersectionObserver(([entry]) => {');
  console.log('    if (entry.isIntersecting) fetchNextPage();');
  console.log('  }, { threshold: 1.0 });');
  console.log('  observer.observe(sentinelRef.current);');
  console.log('  // Sentinel is an empty div at the bottom of the list.');
  console.log('  // When it enters viewport -> fetch next page.');
}

// --- Run simulation ---
async function main() {
  console.log('=== INFINITE SCROLL SIMULATION ===');

  // Page 1
  await simulateScroll();

  // Page 2
  await simulateScroll();

  // Page 3 — will fail first time
  await simulateScroll();

  // Retry page 3
  await retry();

  // Page 4 (last page, partial)
  await simulateScroll();

  // Try to scroll again — hasMore is false
  console.log('\n  >> User scrolled near bottom again');
  await fetchNextPage();
  render('D: No more data — fetch skipped');

  // Guard: loading flag prevents double fetch
  console.log('\n--- DOUBLE FETCH GUARD ---');
  state.hasMore = true;
  state.loading = true;
  console.log('  state.loading=true -> fetchNextPage() is a no-op');
  await fetchNextPage();
  console.log('  (nothing happened — guard works)');
  state.loading = false;
  state.hasMore = false;

  explainObserver();

  console.log(`\n--- Total API calls: ${fetchCallCount} ---`);
}

main();

/**
 * FOLLOW-UP QUESTIONS:
 * 1. How to handle scroll-up (reverse infinite scroll, like chat)?
 *    -> Prepend items, maintain scroll position with scrollTop adjustment.
 * 2. How to virtualize for performance?
 *    -> Only render visible items (react-window / react-virtuoso).
 * 3. How to deduplicate if API returns overlapping items?
 *    -> Use a Set of IDs; filter out existing items before appending.
 * 4. How to add pull-to-refresh?
 *    -> Reset state and fetch page 1 on pull gesture.
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  INTERVIEW ANSWER:                                             ║
 * ║  "I track page, loading, error, hasMore in state. A sentinel   ║
 * ║  div at the bottom is observed by IntersectionObserver. When    ║
 * ║  visible, I fetch the next page — but only if !loading &&      ║
 * ║  hasMore. On error, a Retry button re-attempts the same page.  ║
 * ║  Items append to state; React re-renders the list. useCallback ║
 * ║  and useRef prevent stale closures in the observer callback."  ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */
