/**
 * CHALLENGE 05: Common Destructuring & Spread Patterns
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ REAL-WORLD PATTERNS YOU'LL USE DAILY                                       ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

console.log("═══ Common Patterns ═══\n");

// ═══════════════════════════════════════════════════════════════════════════════
// 1. IMMUTABLE ARRAY OPERATIONS
// ═══════════════════════════════════════════════════════════════════════════════

console.log("─── 1. Immutable Array Updates ───\n");

const todos = [
  { id: 1, text: 'Learn JS', done: true },
  { id: 2, text: 'Learn React', done: false },
  { id: 3, text: 'Build App', done: false }
];

// Add item (immutable)
const withNew = [...todos, { id: 4, text: 'Deploy', done: false }];
console.log('A: Add item - length:', withNew.length);

// Remove item (immutable)
const without2 = todos.filter(t => t.id !== 2);
console.log('B: Remove id:2 - length:', without2.length);

// Update item (immutable) - VERY IMPORTANT!
const updated = todos.map(t =>
  t.id === 2 ? { ...t, done: true } : t
);
console.log('C: Updated id:2:', updated[1]);

// Insert at position
const insertAt = (arr, index, item) => [
  ...arr.slice(0, index),
  item,
  ...arr.slice(index)
];
console.log('D: Insert at 1:', insertAt([1, 3, 4], 1, 2));

console.log('');


// ═══════════════════════════════════════════════════════════════════════════════
// 2. IMMUTABLE OBJECT UPDATES
// ═══════════════════════════════════════════════════════════════════════════════

console.log("─── 2. Immutable Object Updates ───\n");

const user = {
  name: 'John',
  address: {
    city: 'NYC',
    zip: '10001'
  },
  preferences: {
    theme: 'dark',
    notifications: true
  }
};

// Update shallow property
const renamed = { ...user, name: 'Jane' };
console.log('E: Renamed:', renamed.name);

// Update nested property (TRICKY!)
const newCity = {
  ...user,
  address: {
    ...user.address,
    city: 'LA'
  }
};
console.log('F: New city:', newCity.address.city);
console.log('G: Original unchanged:', user.address.city);

// Delete property (create new without it)
const { preferences, ...userWithoutPrefs } = user;
console.log('H: Without prefs:', Object.keys(userWithoutPrefs));

console.log('');


// ═══════════════════════════════════════════════════════════════════════════════
// 3. REACT STATE PATTERNS
// ═══════════════════════════════════════════════════════════════════════════════

console.log("─── 3. React State Patterns ───\n");

// Simulated React state
let state = {
  user: null,
  items: [],
  loading: false,
  error: null
};

// setState simulation
const setState = (updates) => {
  state = { ...state, ...updates };
  console.log('   State updated:', state);
};

// Pattern 1: Simple update
setState({ loading: true });

// Pattern 2: Add to array
setState({ items: [...state.items, { id: 1, name: 'Item 1' }] });

// Pattern 3: Update specific item in array
setState({
  items: state.items.map(item =>
    item.id === 1 ? { ...item, name: 'Updated' } : item
  )
});

console.log('I: Final items:', state.items);
console.log('');


// ═══════════════════════════════════════════════════════════════════════════════
// 4. API RESPONSE HANDLING
// ═══════════════════════════════════════════════════════════════════════════════

console.log("─── 4. API Response Handling ───\n");

const apiResponse = {
  status: 'success',
  data: {
    users: [
      { id: 1, name: 'Alice', email: 'alice@test.com' },
      { id: 2, name: 'Bob', email: 'bob@test.com' }
    ],
    meta: {
      total: 100,
      page: 1,
      limit: 10
    }
  },
  timestamp: Date.now()
};

// Extract what you need
const {
  status,
  data: { users, meta: { total, page } }
} = apiResponse;

console.log('J: Status:', status);
console.log('K: Users:', users.map(u => u.name));
console.log('L: Pagination:', { total, page });

// Transform response
const userNames = apiResponse.data.users.map(({ name }) => name);
console.log('M: Names only:', userNames);

console.log('');


// ═══════════════════════════════════════════════════════════════════════════════
// 5. CONFIGURATION MERGING
// ═══════════════════════════════════════════════════════════════════════════════

console.log("─── 5. Configuration Merging ───\n");

const defaultConfig = {
  api: {
    baseUrl: 'http://localhost:3000',
    timeout: 5000,
    retries: 3
  },
  ui: {
    theme: 'light',
    language: 'en'
  }
};

const userConfig = {
  api: {
    baseUrl: 'https://api.example.com'
  },
  ui: {
    theme: 'dark'
  }
};

// Deep merge (manual for 1 level)
const finalConfig = {
  ...defaultConfig,
  api: { ...defaultConfig.api, ...userConfig.api },
  ui: { ...defaultConfig.ui, ...userConfig.ui }
};

console.log('N: Merged config:', finalConfig);
console.log('');


// ═══════════════════════════════════════════════════════════════════════════════
// 6. FUNCTION COMPOSITION
// ═══════════════════════════════════════════════════════════════════════════════

console.log("─── 6. Function Composition ───\n");

// Pipe: left-to-right composition
const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);

// Compose: right-to-left composition
const compose = (...fns) => (x) => fns.reduceRight((v, f) => f(v), x);

const trim = s => s.trim();
const lower = s => s.toLowerCase();
const split = s => s.split(' ');

const processText = pipe(trim, lower, split);
console.log('O: Piped:', processText('  HELLO WORLD  '));

console.log('');


// ═══════════════════════════════════════════════════════════════════════════════
// 7. PROPS FORWARDING (REACT)
// ═══════════════════════════════════════════════════════════════════════════════

console.log("─── 7. Props Forwarding ───\n");

// Simulate React component
function Input({ label, error, ...inputProps }) {
  console.log('P: Label:', label);
  console.log('Q: Error:', error);
  console.log('R: Forward to <input>:', inputProps);
  // In React: <input {...inputProps} />
}

Input({
  label: 'Email',
  error: 'Invalid email',
  type: 'email',
  placeholder: 'Enter email',
  required: true,
  autoFocus: true
});

console.log('');


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ PATTERN SUMMARY                                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ARRAY IMMUTABILITY:                                                       │
 * │   • Add:    [...arr, item]                                                  │
 * │   • Remove: arr.filter(x => x !== item)                                    │
 * │   • Update: arr.map(x => x.id === id ? {...x, ...changes} : x)            │
 * │                                                                             │
 * │   OBJECT IMMUTABILITY:                                                      │
 * │   • Shallow: {...obj, key: newValue}                                       │
 * │   • Nested:  {...obj, nested: {...obj.nested, key: value}}                 │
 * │   • Delete:  const {key, ...rest} = obj; use rest                          │
 * │                                                                             │
 * │   FUNCTION PATTERNS:                                                        │
 * │   • Wrapper: (...args) => fn(...args)                                      │
 * │   • Compose: (...fns) => x => fns.reduce((v,f) => f(v), x)                │
 * │   • Forward: ({known, ...rest}) => <C {...rest} />                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * RUN: node docs/14-destructuring-spread/05-common-patterns.js
 */
