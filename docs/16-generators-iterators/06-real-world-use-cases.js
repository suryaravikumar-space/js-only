/**
 * GENERATORS & ITERATORS: 06 - Real World Use Cases
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ PRACTICAL APPLICATIONS OF GENERATORS                                       ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ This file covers real-world patterns you'll encounter in production:       ║
 * ║   1. State Machines                                                        ║
 * ║   2. ID/Sequence Generation                                                ║
 * ║   3. Data Pipeline Processing                                              ║
 * ║   4. Lazy Collections                                                      ║
 * ║   5. Undo/Redo History                                                     ║
 * ║   6. Redux-Saga Pattern                                                    ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 1. STATE MACHINES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ USE CASE: Wizard Forms, Game States, Connection States                      │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Generators naturally model state machines because:                          │
 * │ - They pause at each state (yield)                                          │
 * │ - They receive input to transition (next(input))                            │
 * │ - State is preserved between calls                                          │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

function* loginWizard() {
  // Step 1: Get email
  let email;
  while (true) {
    email = yield { step: 'email', message: 'Enter your email' };
    if (email && email.includes('@')) break;
    yield { step: 'email', error: 'Invalid email format' };
  }

  // Step 2: Get password
  let password;
  while (true) {
    password = yield { step: 'password', message: 'Enter password (min 8 chars)' };
    if (password && password.length >= 8) break;
    yield { step: 'password', error: 'Password too short' };
  }

  // Step 3: Two-factor auth
  const code = yield { step: '2fa', message: 'Enter 2FA code' };

  // Complete
  return {
    step: 'complete',
    user: { email, authenticated: true }
  };
}

const wizard = loginWizard();

console.log('A: Login Wizard State Machine:');
console.log('  ', wizard.next());                  // Email prompt
console.log('  ', wizard.next('invalid'));         // Email error
console.log('  ', wizard.next('user@email.com')); // Password prompt
console.log('  ', wizard.next('short'));           // Password error
console.log('  ', wizard.next('validpassword'));   // 2FA prompt
console.log('  ', wizard.next('123456'));          // Complete


// ═══════════════════════════════════════════════════════════════════════════════
// 2. ID/SEQUENCE GENERATORS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ USE CASE: Unique IDs, Incrementing Sequences, UUIDs                         │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Simple incrementing ID
function* createIdGenerator(prefix = '', startFrom = 1) {
  let id = startFrom;
  while (true) {
    yield `${prefix}${id++}`;
  }
}

// Date-based ID
function* createDateIdGenerator() {
  let counter = 0;
  let lastDate = '';

  while (true) {
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    if (today !== lastDate) {
      counter = 0;
      lastDate = today;
    }
    counter++;
    yield `${today}-${String(counter).padStart(4, '0')}`;
  }
}

// Circular ID (wraps around)
function* createCircularIdGenerator(max) {
  let id = 0;
  while (true) {
    yield id;
    id = (id + 1) % max;
  }
}

const userIdGen = createIdGenerator('USER-', 1000);
console.log('\nB: ID Generators:');
console.log('  ', userIdGen.next().value);  // USER-1000
console.log('  ', userIdGen.next().value);  // USER-1001
console.log('  ', userIdGen.next().value);  // USER-1002

const circularGen = createCircularIdGenerator(3);
console.log('  Circular:', [
  circularGen.next().value,
  circularGen.next().value,
  circularGen.next().value,
  circularGen.next().value,
  circularGen.next().value
]);  // [0, 1, 2, 0, 1]


// ═══════════════════════════════════════════════════════════════════════════════
// 3. DATA PIPELINE (Lazy Processing)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ USE CASE: Processing Large Datasets Without Loading All Into Memory         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Chain operations without creating intermediate arrays!                      │
 * │                                                                             │
 * │ Traditional (eager - creates arrays at each step):                          │
 * │   [1,2,3,4,5].filter(x => x > 2).map(x => x * 2).slice(0, 2)                │
 * │                                                                             │
 * │ Generator (lazy - processes one item at a time):                            │
 * │   take(2, map(filter(data, x => x > 2), x => x * 2))                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Pipeline operators as generators
function* filter(iterable, predicate) {
  for (const item of iterable) {
    if (predicate(item)) yield item;
  }
}

function* map(iterable, transform) {
  for (const item of iterable) {
    yield transform(item);
  }
}

function* take(iterable, n) {
  let count = 0;
  for (const item of iterable) {
    if (count >= n) return;
    yield item;
    count++;
  }
}

function* skip(iterable, n) {
  let count = 0;
  for (const item of iterable) {
    if (count >= n) yield item;
    count++;
  }
}

// Infinite number generator
function* numbers() {
  let n = 0;
  while (true) yield n++;
}

// Chain them together!
console.log('\nC: Data Pipeline:');

// Get first 5 even squares (lazy - only generates what's needed)
const evenSquares = take(
  map(
    filter(numbers(), x => x % 2 === 0),
    x => x * x
  ),
  5
);

console.log('  First 5 even squares:', [...evenSquares]);
// [0, 4, 16, 36, 64]


// ═══════════════════════════════════════════════════════════════════════════════
// 4. LAZY COLLECTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ USE CASE: Range, Repeat, Cycle - Generate Values On Demand                  │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Range generator (like Python's range)
function* range(start, end = null, step = 1) {
  if (end === null) {
    [start, end] = [0, start];
  }

  if (step > 0) {
    for (let i = start; i < end; i += step) yield i;
  } else {
    for (let i = start; i > end; i += step) yield i;
  }
}

// Repeat a value
function* repeat(value, times = Infinity) {
  for (let i = 0; i < times; i++) yield value;
}

// Cycle through values forever
function* cycle(iterable) {
  const saved = [];
  for (const item of iterable) {
    yield item;
    saved.push(item);
  }
  while (saved.length > 0) {
    yield* saved;
  }
}

// Zip multiple iterables
function* zip(...iterables) {
  const iterators = iterables.map(i => i[Symbol.iterator]());

  while (true) {
    const results = iterators.map(i => i.next());
    if (results.some(r => r.done)) return;
    yield results.map(r => r.value);
  }
}

console.log('\nD: Lazy Collections:');
console.log('  range(5):', [...range(5)]);           // [0, 1, 2, 3, 4]
console.log('  range(2, 8):', [...range(2, 8)]);     // [2, 3, 4, 5, 6, 7]
console.log('  range(0, 10, 2):', [...range(0, 10, 2)]); // [0, 2, 4, 6, 8]
console.log('  repeat("x", 3):', [...repeat('x', 3)]); // ['x', 'x', 'x']

const cycler = cycle(['A', 'B']);
console.log('  cycle first 5:', [
  cycler.next().value,
  cycler.next().value,
  cycler.next().value,
  cycler.next().value,
  cycler.next().value
]); // ['A', 'B', 'A', 'B', 'A']

console.log('  zip:', [...zip([1, 2, 3], ['a', 'b', 'c'])]);
// [[1, 'a'], [2, 'b'], [3, 'c']]


// ═══════════════════════════════════════════════════════════════════════════════
// 5. UNDO/REDO HISTORY
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ USE CASE: Editor History, Form State, Game Save States                      │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

function* createHistory(initialState) {
  const history = [initialState];
  let currentIndex = 0;

  while (true) {
    const action = yield {
      current: history[currentIndex],
      canUndo: currentIndex > 0,
      canRedo: currentIndex < history.length - 1
    };

    if (action.type === 'PUSH') {
      // Remove any redo history
      history.splice(currentIndex + 1);
      history.push(action.state);
      currentIndex = history.length - 1;
    } else if (action.type === 'UNDO' && currentIndex > 0) {
      currentIndex--;
    } else if (action.type === 'REDO' && currentIndex < history.length - 1) {
      currentIndex++;
    }
  }
}

const editorHistory = createHistory({ text: '' });

console.log('\nE: Undo/Redo History:');

let state = editorHistory.next();  // Get initial state
console.log('  Initial:', state.value);

state = editorHistory.next({ type: 'PUSH', state: { text: 'Hello' } });
console.log('  After "Hello":', state.value);

state = editorHistory.next({ type: 'PUSH', state: { text: 'Hello World' } });
console.log('  After "Hello World":', state.value);

state = editorHistory.next({ type: 'UNDO' });
console.log('  After Undo:', state.value);

state = editorHistory.next({ type: 'UNDO' });
console.log('  After Undo again:', state.value);

state = editorHistory.next({ type: 'REDO' });
console.log('  After Redo:', state.value);


// ═══════════════════════════════════════════════════════════════════════════════
// 6. REDUX-SAGA PATTERN (Simplified)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ USE CASE: Side Effect Management in Redux Applications                      │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Redux-Saga uses generators for:                                             │
 * │ - Declarative side effects (yield describes WHAT to do)                     │
 * │ - Easy testing (just check yielded values)                                  │
 * │ - Complex async flows (race, parallel, cancellation)                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Simplified saga effects
const call = (fn, ...args) => ({ type: 'CALL', fn, args });
const put = (action) => ({ type: 'PUT', action });
const takeEvery = (pattern, saga) => ({ type: 'TAKE_EVERY', pattern, saga });

// Example saga
function* fetchUserSaga(action) {
  yield put({ type: 'FETCH_USER_START' });

  try {
    // Instead of calling directly, we YIELD a description
    const user = yield call(fetch, `/api/users/${action.userId}`);
    yield put({ type: 'FETCH_USER_SUCCESS', user });
  } catch (error) {
    yield put({ type: 'FETCH_USER_ERROR', error: error.message });
  }
}

// Test the saga without making real API calls!
console.log('\nF: Redux-Saga Pattern:');

const saga = fetchUserSaga({ userId: 123 });

console.log('  Step 1:', saga.next().value);
// { type: 'PUT', action: { type: 'FETCH_USER_START' } }

console.log('  Step 2:', saga.next().value);
// { type: 'CALL', fn: fetch, args: ['/api/users/123'] }

// Simulate successful response
console.log('  Step 3:', saga.next({ id: 123, name: 'Alice' }).value);
// { type: 'PUT', action: { type: 'FETCH_USER_SUCCESS', user: {...} } }


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Generators have many real-world applications:                              │
 * │                                                                             │
 * │ 1. STATE MACHINES                                                           │
 * │    - Wizards, game states, connection states                                │
 * │    - yield pauses at each state, next(input) transitions                    │
 * │                                                                             │
 * │ 2. ID GENERATION                                                            │
 * │    - Auto-incrementing IDs, UUIDs, date-based IDs                           │
 * │    - Encapsulates counter state cleanly                                     │
 * │                                                                             │
 * │ 3. DATA PIPELINES                                                           │
 * │    - Chain filter/map/take operations lazily                                │
 * │    - No intermediate arrays, memory efficient                               │
 * │    - Process infinite sequences                                             │
 * │                                                                             │
 * │ 4. LAZY COLLECTIONS                                                         │
 * │    - range(), repeat(), cycle() - generate on demand                        │
 * │    - Like Python's itertools                                                │
 * │                                                                             │
 * │ 5. UNDO/REDO                                                                │
 * │    - Natural fit for command pattern                                        │
 * │    - yield returns current state, next() receives action                    │
 * │                                                                             │
 * │ 6. REDUX-SAGA                                                               │
 * │    - Declarative side effects (yield description, not execution)            │
 * │    - Makes async flows testable                                             │
 * │    - Enables complex patterns: race, parallel, cancellation"                │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/16-generators-iterators/06-real-world-use-cases.js
 */
