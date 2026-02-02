/**
 * FUNCTIONAL PROGRAMMING: 14 - Real-World Patterns
 *
 * ONE CONCEPT: Practical FP patterns used in production React, Node, etc.
 */


// =============================================================================
// PATTERN 1: DATA TRANSFORMATION PIPELINES
// =============================================================================

console.log('=== Pattern 1: Data Pipelines ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  INTERVIEW FAVORITE: Transform API data                            │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  API Response → Normalize → Filter → Sort → Format → Display       │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);

// Simulated API response
const apiResponse = {
  data: {
    users: [
      { id: 1, first_name: 'Alice', last_name: 'Smith', age: 25, role: 'admin', status: 'active' },
      { id: 2, first_name: 'Bob', last_name: 'Jones', age: 17, role: 'user', status: 'inactive' },
      { id: 3, first_name: 'Charlie', last_name: 'Brown', age: 35, role: 'user', status: 'active' },
      { id: 4, first_name: 'Diana', last_name: 'Prince', age: 30, role: 'admin', status: 'active' },
      { id: 5, first_name: 'Eve', last_name: 'Adams', age: 15, role: 'user', status: 'active' }
    ]
  }
};

// Small, reusable functions
const extractUsers = response => response.data.users;
const normalizeUser = user => ({
  id: user.id,
  fullName: `${user.first_name} ${user.last_name}`,
  age: user.age,
  role: user.role,
  isActive: user.status === 'active'
});
const normalizeAll = users => users.map(normalizeUser);
const filterActive = users => users.filter(u => u.isActive);
const filterAdults = users => users.filter(u => u.age >= 18);
const sortByName = users => [...users].sort((a, b) => a.fullName.localeCompare(b.fullName));

// Pipeline
const getActiveAdults = pipe(
  extractUsers,
  normalizeAll,
  filterActive,
  filterAdults,
  sortByName
);

console.log('Active adults:', getActiveAdults(apiResponse));


// =============================================================================
// PATTERN 2: VALIDATION CHAINS
// =============================================================================

console.log('\n=== Pattern 2: Validation ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  COMPOSABLE VALIDATORS                                             │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  Input → [required] → [minLength] → [format] → Success/Errors       │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

// Validator factory: returns { valid, errors }
const createValidator = (test, message) => value =>
  test(value) ? { valid: true, errors: [] } : { valid: false, errors: [message] };

// Individual validators
const required = createValidator(
  v => v !== null && v !== undefined && v !== '',
  'Field is required'
);

const minLength = min => createValidator(
  v => v && v.length >= min,
  `Minimum ${min} characters`
);

const maxLength = max => createValidator(
  v => !v || v.length <= max,
  `Maximum ${max} characters`
);

const matchesPattern = (regex, msg) => createValidator(
  v => regex.test(v),
  msg
);

// Combine validators
function validateAll(...validators) {
  return function(value) {
    const results = validators.map(v => v(value));
    const errors = results.flatMap(r => r.errors);
    return {
      valid: errors.length === 0,
      errors
    };
  };
}

// Usage
const validateUsername = validateAll(
  required,
  minLength(3),
  maxLength(20),
  matchesPattern(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores')
);

const validateEmail = validateAll(
  required,
  matchesPattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format')
);

console.log('Valid username:', validateUsername('alice_123'));
console.log('Invalid username:', validateUsername('a'));
console.log('Valid email:', validateEmail('alice@example.com'));
console.log('Invalid email:', validateEmail('not-an-email'));


// =============================================================================
// PATTERN 3: EVENT HANDLER FACTORIES
// =============================================================================

console.log('\n=== Pattern 3: Event Handlers ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  REACT: Avoid creating new functions in render                     │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  // BAD: New function every render                                  │
 *   │  onClick={() => handleDelete(item.id)}                              │
 *   │                                                                     │
 *   │  // GOOD: Curried handler                                           │
 *   │  const handleDelete = (id) => () => deleteItem(id);                 │
 *   │  onClick={handleDelete(item.id)}                                    │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

// Curried event handlers
const handleChange = fieldName => event => {
  console.log(`  Field "${fieldName}" changed to: ${event.value}`);
};

const handleNameChange = handleChange('name');
const handleEmailChange = handleChange('email');

handleNameChange({ value: 'Alice' });
handleEmailChange({ value: 'alice@example.com' });


// Generic action creator
const createHandler = (action, ...preArgs) => (...eventArgs) => {
  console.log(`  Action: ${action}`, [...preArgs, ...eventArgs]);
};

const handleDeleteUser = createHandler('DELETE_USER', '/api/users');
handleDeleteUser(42);


// =============================================================================
// PATTERN 4: REDUCER COMPOSITION
// =============================================================================

console.log('\n=== Pattern 4: Reducer Composition ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  COMPOSING REDUCERS (Redux-style)                                  │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  rootReducer = combineReducers({                                    │
 *   │    users: usersReducer,                                             │
 *   │    posts: postsReducer,                                             │
 *   │    ui: uiReducer                                                    │
 *   │  });                                                                │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

// Simple combineReducers
function combineReducers(reducerMap) {
  return function(state = {}, action) {
    const newState = {};
    let hasChanged = false;

    for (const [key, reducer] of Object.entries(reducerMap)) {
      const prevStateForKey = state[key];
      newState[key] = reducer(prevStateForKey, action);
      hasChanged = hasChanged || newState[key] !== prevStateForKey;
    }

    return hasChanged ? newState : state;
  };
}

// Individual reducers (pure functions!)
const counterReducer = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT': return state + 1;
    case 'DECREMENT': return state - 1;
    default: return state;
  }
};

const todosReducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO': return [...state, action.payload];
    default: return state;
  }
};

const rootReducer = combineReducers({
  counter: counterReducer,
  todos: todosReducer
});

let state = rootReducer(undefined, { type: '@@INIT' });
console.log('Initial:', state);

state = rootReducer(state, { type: 'INCREMENT' });
console.log('After increment:', state);

state = rootReducer(state, { type: 'ADD_TODO', payload: 'Learn FP' });
console.log('After add todo:', state);


// =============================================================================
// PATTERN 5: MIDDLEWARE / DECORATOR CHAIN
// =============================================================================

console.log('\n=== Pattern 5: Middleware Chain ===\n');

// Build an API client with composable middleware
function createFetchClient(...middlewares) {
  return async function(url, options = {}) {
    let finalOptions = { url, ...options, headers: {} };

    // Apply each middleware
    for (const middleware of middlewares) {
      finalOptions = await middleware(finalOptions);
    }

    console.log(`  ${finalOptions.method || 'GET'} ${finalOptions.url}`);
    console.log('  Headers:', finalOptions.headers);
    return { ok: true, data: 'mock response' };
  };
}

// Composable middleware
const withBaseUrl = base => options => ({
  ...options,
  url: base + options.url
});

const withAuth = token => options => ({
  ...options,
  headers: { ...options.headers, Authorization: `Bearer ${token}` }
});

const withJSON = options => ({
  ...options,
  headers: { ...options.headers, 'Content-Type': 'application/json' }
});

// Configured client
const api = createFetchClient(
  withBaseUrl('https://api.example.com'),
  withAuth('token123'),
  withJSON
);

api('/users');


// =============================================================================
// PATTERN 6: TRANSDUCERS (Efficient Pipelines)
// =============================================================================

console.log('\n=== Pattern 6: Transducers ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  PROBLEM: Chaining creates intermediate arrays                     │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  [1M items].filter(fn1).map(fn2).filter(fn3)                       │
 *   │            ↑ 1M loop    ↑ new arr  ↑ new arr                       │
 *   │            3 passes, 2 intermediate arrays!                         │
 *   │                                                                     │
 *   │  Transducer: 1 pass, 0 intermediate arrays                         │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

// Simple transducer implementation
const mapT = fn => reducer => (acc, item) => reducer(acc, fn(item));
const filterT = pred => reducer => (acc, item) =>
  pred(item) ? reducer(acc, item) : acc;

const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);

// Compose transducers (compose, not pipe!)
const xform = compose(
  filterT(x => x % 2 !== 0),      // Keep odd
  mapT(x => x * 10),               // Multiply by 10
  filterT(x => x > 20)             // Keep > 20
);

// Single pass!
const arrayReducer = (acc, item) => { acc.push(item); return acc; };
const transducedResult = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  .reduce(xform(arrayReducer), []);

console.log('Transduced (1 pass):', transducedResult);


// =============================================================================
// PATTERN 7: LENS (Immutable Deep Updates)
// =============================================================================

console.log('\n=== Pattern 7: Lens ===\n');

// Simple lens implementation
const lens = (getter, setter) => ({
  get: getter,
  set: setter,
  over: (fn, obj) => setter(fn(getter(obj)), obj)
});

const prop = key => lens(
  obj => obj[key],
  (val, obj) => ({ ...obj, [key]: val })
);

// Compose lenses for deep access
const composeLens = (outer, inner) => lens(
  obj => inner.get(outer.get(obj)),
  (val, obj) => outer.over(innerObj => inner.set(val, innerObj), obj)
);

// Usage
const addressLens = prop('address');
const cityLens = prop('city');
const addressCityLens = composeLens(addressLens, cityLens);

const person = { name: 'Alice', address: { city: 'NYC', zip: '10001' } };

console.log('Get city:', addressCityLens.get(person));

const updated = addressCityLens.set('LA', person);
console.log('Set city:', updated);
console.log('Original unchanged:', person.address.city);

const upperCity = addressCityLens.over(c => c.toUpperCase(), person);
console.log('Transform city:', upperCity);


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "In production, I use several FP patterns daily:
 *
 * 1. Data pipelines - I compose small functions with pipe to transform
 *    API responses: extract, normalize, filter, sort, format. Each step
 *    is independently testable.
 *
 * 2. Composable validation - I create validator factories and combine them
 *    with a validateAll function. Each validator is a pure function that
 *    returns { valid, errors }.
 *
 * 3. Reducer composition - In Redux, combineReducers lets each reducer
 *    manage its own slice of state. Reducers must be pure functions.
 *
 * 4. Middleware chains - I build API clients by composing middleware like
 *    withAuth, withBaseUrl, and withJSON. Each middleware is a function
 *    that transforms the request options.
 *
 * 5. For deep immutable updates, I use the lens pattern or libraries
 *    like Immer. Lenses let you focus on nested properties and update
 *    them immutably.
 *
 * The key principle is: small pure functions composed together. Each
 * function does one thing, is easy to test, and can be reused."
 */


// RUN: node docs/28-functional-programming/14-real-world-patterns.js
