/**
 * TOPIC: Autocomplete / Typeahead — Machine Coding Interview
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  GOLDEN RULE: Debounce user input, cache results, and manage   ║
 * ║  keyboard navigation as a state machine (index + isOpen).      ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * ┌──────────────────────────────────────────────────────────────────┐
 * │  STORY: Imagine typing into Google search. Each keystroke       │
 * │  doesn't fire immediately — it waits for you to pause           │
 * │  (debounce). Results appear in a dropdown. Arrow keys move      │
 * │  a highlight up/down. Enter selects. Esc closes.                │
 * └──────────────────────────────────────────────────────────────────┘
 *
 * ┌─────────────────── VISUAL DIAGRAM ───────────────────┐
 * │                                                       │
 * │   [  re____  ]  <-- input                             │
 * │   ┌───────────────────┐                               │
 * │   │ > React           │ <-- highlighted (index=0)     │
 * │   │   Redux           │                               │
 * │   │   React Native    │                               │
 * │   └───────────────────┘                               │
 * │                                                       │
 * │   keystroke -> debounce(300ms) -> search(query)       │
 * │   ArrowDown -> highlightIndex++                       │
 * │   ArrowUp   -> highlightIndex--                       │
 * │   Enter     -> select(items[index])                   │
 * │   Escape    -> close dropdown                         │
 * └───────────────────────────────────────────────────────┘
 *
 * PROBLEM: Build an autocomplete with debounce, caching, keyboard nav.
 *
 * APPROACH:
 *  - State: { query, results, highlightIndex, isOpen, cache }
 *  - debounce() wraps the search call
 *  - Cache: Map<query, results> to avoid repeat API calls
 *  - Keyboard handler adjusts highlightIndex or selects/closes
 *
 * RUN: node docs/react/15-machine-coding/01-autocomplete.js
 */

// --- Mock data (simulates API) ---
const DATA = [
  'React', 'Redux', 'React Native', 'React Router',
  'Angular', 'Astro', 'Alpine.js',
  'Vue', 'Vuex', 'Vite',
  'Svelte', 'SvelteKit', 'Solid', 'Stencil',
  'Next.js', 'Nuxt', 'Node.js', 'Nest.js',
];

function mockFetch(query) {
  const q = query.toLowerCase();
  return DATA.filter(d => d.toLowerCase().includes(q));
}

// --- Debounce ---
function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => { timer = null; fn(...args); }, delay);
  };
}

// --- State ---
const state = {
  query: '',
  results: [],
  highlightIndex: -1,
  isOpen: false,
  cache: {},
  selected: null,
};

function render(label) {
  console.log(`\n${label}`);
  console.log(`  query="${state.query}" | isOpen=${state.isOpen} | highlight=${state.highlightIndex} | selected=${state.selected}`);
  if (state.isOpen && state.results.length > 0) {
    state.results.forEach((item, i) => {
      const arrow = i === state.highlightIndex ? '> ' : '  ';
      // Highlight matching text with brackets
      const q = state.query.toLowerCase();
      const idx = item.toLowerCase().indexOf(q);
      let display = item;
      if (idx !== -1 && q.length > 0) {
        display = item.slice(0, idx) + '[' + item.slice(idx, idx + q.length) + ']' + item.slice(idx + q.length);
      }
      console.log(`  ${arrow}${display}`);
    });
  } else if (state.isOpen) {
    console.log('  (no results)');
  }
}

// --- Search (uses cache) ---
let searchCount = 0;
function doSearch(query) {
  if (state.cache[query]) {
    console.log(`  [cache hit for "${query}"]`);
    state.results = state.cache[query];
  } else {
    searchCount++;
    console.log(`  [API call #${searchCount} for "${query}"]`);
    state.results = mockFetch(query);
    state.cache[query] = state.results;
  }
  state.highlightIndex = -1;
  state.isOpen = state.results.length > 0;
}

const debouncedSearch = debounce(doSearch, 300);

// --- Simulate typing (synchronous for demo — we call doSearch directly) ---
function type(char) {
  state.query += char;
  state.selected = null;
  // In real app we'd call debouncedSearch; here we call directly for output
  doSearch(state.query);
  render(`A: Typed "${char}" -> query="${state.query}"`);
}

function keyDown(key) {
  if (key === 'ArrowDown') {
    if (state.highlightIndex < state.results.length - 1) state.highlightIndex++;
    render(`B: ArrowDown -> index=${state.highlightIndex}`);
  } else if (key === 'ArrowUp') {
    if (state.highlightIndex > 0) state.highlightIndex--;
    render(`B: ArrowUp -> index=${state.highlightIndex}`);
  } else if (key === 'Enter') {
    if (state.highlightIndex >= 0 && state.highlightIndex < state.results.length) {
      state.selected = state.results[state.highlightIndex];
      state.query = state.selected;
      state.isOpen = false;
    }
    render(`C: Enter -> selected="${state.selected}"`);
  } else if (key === 'Escape') {
    state.isOpen = false;
    state.highlightIndex = -1;
    render('D: Escape -> closed');
  }
}

function clearAndType(text) {
  state.query = '';
  for (const ch of text) type(ch);
}

// --- Simulation ---
console.log('=== AUTOCOMPLETE SIMULATION ===');

console.log('\n--- Typing "re" ---');
type('r');
type('e');

console.log('\n--- Keyboard navigation ---');
keyDown('ArrowDown'); // index 0
keyDown('ArrowDown'); // index 1
keyDown('ArrowUp');   // back to 0
keyDown('Enter');     // select

console.log('\n--- Typing "re" again (cache hit) ---');
state.query = '';
state.selected = null;
type('r');
type('e');

console.log('\n--- Escape to close ---');
keyDown('Escape');

console.log('\n--- Typing "sv" (new search) ---');
state.query = '';
type('s');
type('v');

console.log('\n--- Typing "xyz" (no results) ---');
state.query = '';
type('x');
type('y');
type('z');

console.log('\n--- Debounce concept ---');
console.log('  In a real app, rapid keystrokes reset a 300ms timer.');
console.log('  Only the LAST keystroke triggers the API call.');
console.log(`  Total API calls made: ${searchCount} (cache saved redundant calls)`);

/**
 * FOLLOW-UP QUESTIONS:
 * 1. How would you handle async race conditions?
 *    -> Track request ID; ignore stale responses.
 * 2. How to add "recent searches"?
 *    -> Store selections in an array, show when input is focused but empty.
 * 3. How to handle very large result sets?
 *    -> Paginate or virtual-scroll the dropdown.
 * 4. Accessibility?
 *    -> aria-activedescendant, role="listbox", role="option", aria-selected.
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  INTERVIEW ANSWER:                                             ║
 * ║  "I manage query, results, highlightIndex, and isOpen in       ║
 * ║  state. Input changes are debounced (300ms) before searching.  ║
 * ║  A cache (Map) stores previous query results to avoid repeat   ║
 * ║  API calls. Arrow keys adjust highlightIndex, Enter selects,   ║
 * ║  Escape closes. In React I'd use useState + useEffect for the  ║
 * ║  debounced fetch, useRef for the timer, and onKeyDown for      ║
 * ║  keyboard events."                                             ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */
