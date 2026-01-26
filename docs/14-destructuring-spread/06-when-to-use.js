/**
 * CHALLENGE 06: WHEN and WHY to Use Destructuring & Spread
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THIS FILE ANSWERS THE "WHY" AND "WHEN" QUESTIONS                           ║
 * ║ Understanding CONTEXT is what separates good developers from great ones   ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 1. WHEN TO USE ARRAY DESTRUCTURING
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 1. When to Use Array Destructuring ═══\n");

/**
 * USE ARRAY DESTRUCTURING WHEN:
 *
 * 1. You're working with KNOWN, FIXED-POSITION data
 *    - The array always has the same structure
 *    - Position has meaning (first is always X, second is always Y)
 *
 * 2. You want to SWAP values without a temp variable
 *    - Clean one-liner for swapping
 *
 * 3. You're working with TUPLES or COORDINATE-like data
 *    - [x, y, z] coordinates
 *    - [key, value] pairs from Object.entries()
 *    - [status, data] from API responses
 *
 * 4. You only need SOME elements from the array
 *    - Skip elements you don't need
 *    - Get first and rest separately
 */

// EXAMPLE 1: React's useState returns a tuple [value, setter]
// WHY destructuring: Position is meaningful and fixed
function simulateUseState(initial) {
  let state = initial;
  const setState = (newVal) => { state = newVal; };
  return [state, setState];  // Always: [value, setter]
}

const [count, setCount] = simulateUseState(0);  // Perfect use case!
console.log('A: useState pattern - count:', count);

// EXAMPLE 2: Getting coordinates
// WHY: Position IS the meaning (x is first, y is second)
const point = [10, 20, 30];
const [x, y, z] = point;
console.log('B: Coordinates x:', x, 'y:', y, 'z:', z);

// EXAMPLE 3: Swapping
// WHY: Clean, no temp variable, intention is clear
let left = 'LEFT', right = 'RIGHT';
[left, right] = [right, left];
console.log('C: Swapped:', left, right);

// EXAMPLE 4: Object.entries() returns [key, value] pairs
// WHY: Each entry is a tuple with known structure
const scores = { alice: 95, bob: 87 };
for (const [name, score] of Object.entries(scores)) {
  console.log(`D: ${name}: ${score}`);
}

console.log('');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHEN NOT TO USE ARRAY DESTRUCTURING                                         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ✗ Dynamic length arrays where position doesn't have fixed meaning          │
 * │   const userIds = [1, 2, 3, ...];  // Just iterate, don't destructure     │
 * │                                                                             │
 * │ ✗ When you need all elements anyway                                         │
 * │   const [a, b, c, d, e, f, g] = arr;  // Just use arr directly            │
 * │                                                                             │
 * │ ✗ Deeply nested structures (becomes unreadable)                            │
 * │   const [[[a]]] = [[[1]]];  // Hard to understand                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 2. WHEN TO USE OBJECT DESTRUCTURING
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 2. When to Use Object Destructuring ═══\n");

/**
 * USE OBJECT DESTRUCTURING WHEN:
 *
 * 1. You access the SAME property MULTIPLE times in a function
 *    - Extract once at the top, use throughout
 *    - Cleaner than obj.prop.subprop.value repeated
 *
 * 2. You want SELF-DOCUMENTING function parameters
 *    - function process({ name, age }) shows expected input
 *    - Better than function process(data) then data.name
 *
 * 3. You want to provide DEFAULT VALUES
 *    - Built-in default syntax is cleaner than || checks
 *
 * 4. You want to RENAME properties
 *    - When property names don't fit your naming convention
 *    - When names conflict with local variables
 *
 * 5. You want to REMOVE certain properties (using rest)
 *    - Remove sensitive data before logging
 *    - Separate known props from forwarded props
 */

// EXAMPLE 1: Extracting properties used multiple times
// WHY: Avoid repeating user.profile.settings.theme
const user = {
  name: 'John',
  profile: {
    settings: {
      theme: 'dark',
      fontSize: 16
    }
  }
};

// BAD: Repeat long path
// console.log(user.profile.settings.theme);
// console.log(user.profile.settings.fontSize);

// GOOD: Extract once
const { profile: { settings: { theme, fontSize } } } = user;
console.log('E: Theme:', theme, 'Font:', fontSize);


// EXAMPLE 2: Self-documenting function parameters
// WHY: Caller sees exactly what's expected
function createOrder({ product, quantity, customer, shipping = 'standard' }) {
  // I can immediately see what this function needs!
  return { product, quantity, customer, shipping, id: Date.now() };
}

const order = createOrder({
  product: 'Laptop',
  quantity: 1,
  customer: 'Jane'
  // shipping uses default
});
console.log('F: Order created:', order);


// EXAMPLE 3: Removing sensitive data
// WHY: Clean way to omit properties before logging/sending
const sensitiveUser = {
  name: 'Alice',
  email: 'alice@test.com',
  password: 'hash123',
  ssn: '123-45-6789'
};

const { password, ssn, ...safeUser } = sensitiveUser;
console.log('G: Safe to log:', safeUser);
// password and ssn are NOT in safeUser!

console.log('');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHEN NOT TO USE OBJECT DESTRUCTURING                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ✗ When you use a property only once                                         │
 * │   console.log(user.name);  // Fine, no need to destructure                 │
 * │                                                                             │
 * │ ✗ When you need the whole object anyway                                     │
 * │   saveToDatabase(user);  // Just pass the object                           │
 * │                                                                             │
 * │ ✗ Dynamic property access                                                   │
 * │   const key = 'name'; obj[key];  // Can't destructure dynamic key easily  │
 * │                                                                             │
 * │ ✗ When destructuring makes code LESS readable                              │
 * │   const { a: x, b: { c: { d: y } } } = obj;  // Too nested!               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 3. WHEN TO USE SPREAD OPERATOR
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 3. When to Use Spread Operator ═══\n");

/**
 * USE SPREAD WHEN:
 *
 * 1. You need to CREATE A COPY (shallow clone)
 *    - Arrays: [...arr]
 *    - Objects: {...obj}
 *    - Prevents mutation of original
 *
 * 2. You need to MERGE multiple arrays/objects
 *    - [...arr1, ...arr2]
 *    - {...defaults, ...overrides}
 *
 * 3. You're doing IMMUTABLE STATE UPDATES (React, Redux)
 *    - setState(prev => ({ ...prev, count: prev.count + 1 }))
 *
 * 4. You need to PASS array elements as function arguments
 *    - Math.max(...numbers) instead of Math.max.apply(null, numbers)
 *
 * 5. You want to CONVERT to/from array
 *    - [...'string'] → ['s','t','r','i','n','g']
 *    - [...new Set(arr)] → unique array
 */

// EXAMPLE 1: Immutable state update in React
// WHY: React requires new object reference to trigger re-render
const state = { count: 0, name: 'App', theme: 'dark' };

// WRONG: Mutates original (React won't detect change)
// state.count = 1;

// RIGHT: Creates new object with updated value
const newState = { ...state, count: state.count + 1 };
console.log('H: Original state:', state);
console.log('I: New state:', newState);

// EXAMPLE 2: Merging with override
// WHY: Defaults + user options, later values override earlier
const defaults = { host: 'localhost', port: 3000, debug: false };
const userOptions = { port: 8080, debug: true };
const finalConfig = { ...defaults, ...userOptions };
console.log('J: Merged config:', finalConfig);

// EXAMPLE 3: Pass array to function expecting separate args
// WHY: Math.max takes individual args, not array
const numbers = [5, 2, 9, 1, 7];
const max = Math.max(...numbers);  // Same as Math.max(5, 2, 9, 1, 7)
console.log('K: Max of array:', max);

// EXAMPLE 4: Convert iterable to array
// WHY: Sets, Maps, strings can be spread into arrays
const uniqueLetters = [...new Set('mississippi')];
console.log('L: Unique letters:', uniqueLetters);

console.log('');


// ═══════════════════════════════════════════════════════════════════════════════
// 4. WHEN TO USE REST PARAMETERS
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 4. When to Use Rest Parameters ═══\n");

/**
 * USE REST WHEN:
 *
 * 1. Your function should accept VARIABLE NUMBER of arguments
 *    - sum(1, 2) or sum(1, 2, 3, 4, 5)
 *
 * 2. You're WRAPPING another function (decorators, logging)
 *    - Need to forward all arguments to wrapped function
 *
 * 3. You want to SEPARATE some args from "the rest"
 *    - function log(level, ...messages)
 *    - First arg is special, rest are grouped
 *
 * 4. In destructuring, to COLLECT remaining elements
 *    - const [first, ...rest] = arr;
 *    - const { id, ...others } = obj;
 */

// EXAMPLE 1: Variable arguments
// WHY: Don't know how many numbers will be passed
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}
console.log('M: sum(1,2):', sum(1, 2));
console.log('N: sum(1,2,3,4,5):', sum(1, 2, 3, 4, 5));

// EXAMPLE 2: Wrapper function
// WHY: Need to pass any arguments to original function
function withTiming(fn) {
  return function(...args) {
    const start = Date.now();
    const result = fn(...args);  // Forward all args
    console.log(`O: Took ${Date.now() - start}ms`);
    return result;
  };
}

const timedSum = withTiming(sum);
timedSum(1, 2, 3, 4, 5);

// EXAMPLE 3: First arg special, rest grouped
// WHY: Different handling for first vs rest
function log(level, ...messages) {
  console.log(`[${level.toUpperCase()}]`, ...messages);
}
log('error', 'Failed to', 'connect to', 'database');

console.log('');


// ═══════════════════════════════════════════════════════════════════════════════
// 5. REAL-WORLD DECISION EXAMPLES
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 5. Real-World Decisions ═══\n");

/**
 * SCENARIO 1: Processing API Response
 *
 * You receive: { status: 200, data: { users: [...], meta: {...} } }
 * You need: users array and total count from meta
 *
 * WHY DESTRUCTURE? Because you're extracting specific pieces from
 * a known structure, and will use them multiple times.
 */
const response = {
  status: 200,
  data: { users: [{id: 1}, {id: 2}], meta: { total: 100 } }
};

const { status, data: { users, meta: { total } } } = response;
console.log('P: Users:', users.length, 'Total:', total);

/**
 * SCENARIO 2: React Component Props
 *
 * Component receives: { className, children, onClick, ...htmlProps }
 * You need to handle some, forward others to <button>
 *
 * WHY REST PATTERN? To separate "your" props from DOM props
 * that should be forwarded to the underlying element.
 */
function Button({ className, children, onClick, ...rest }) {
  console.log('Q: My props - className:', className, 'onClick:', typeof onClick);
  console.log('R: Forward to <button>:', rest);
  // In React: <button className={className} {...rest}>{children}</button>
}

Button({
  className: 'btn-primary',
  children: 'Click Me',
  onClick: () => {},
  type: 'submit',
  disabled: false,
  'aria-label': 'Submit form'
});

/**
 * SCENARIO 3: Updating Nested State
 *
 * State: { user: { name, address: { city, zip } } }
 * Need to: Update just the city
 *
 * WHY SPREAD? React requires immutable updates. Must create
 * new objects at every level of nesting to trigger re-render.
 */
const userState = {
  user: {
    name: 'John',
    address: { city: 'NYC', zip: '10001' }
  }
};

const updatedState = {
  ...userState,
  user: {
    ...userState.user,
    address: {
      ...userState.user.address,
      city: 'LA'  // Only this changes
    }
  }
};

console.log('S: Original city:', userState.user.address.city);
console.log('T: Updated city:', updatedState.user.address.city);

console.log('');


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ DECISION TREE                                                               │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Need to extract values from array/object?                                 │
 * │     └── Position matters? → Array destructuring [a, b]                     │
 * │     └── Property names matter? → Object destructuring { a, b }             │
 * │                                                                             │
 * │   Need to copy/merge arrays or objects?                                     │
 * │     └── Use spread: [...arr], {...obj}                                     │
 * │                                                                             │
 * │   Need to collect variable arguments?                                       │
 * │     └── Use rest parameters: function fn(...args)                          │
 * │                                                                             │
 * │   Need to separate some from rest?                                          │
 * │     └── Destructuring + rest: { a, ...rest }                               │
 * │                                                                             │
 * │   Need to pass array as separate function args?                             │
 * │     └── Spread in call: fn(...arr)                                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "I use destructuring when I need specific values from an object or array   │
 * │  and will use them multiple times. It makes code self-documenting -        │
 * │  readers immediately see what data the function expects.                   │
 * │                                                                             │
 * │  Array destructuring is best for tuple-like data where position has        │
 * │  meaning - like useState returns [value, setter], or coordinates [x, y].   │
 * │                                                                             │
 * │  Object destructuring shines in function parameters - it shows expected    │
 * │  properties, provides defaults, and allows renaming all in one place.      │
 * │                                                                             │
 * │  Spread operator is essential for immutable updates in React. I use it     │
 * │  to copy objects/arrays, merge configurations, and pass array elements     │
 * │  as function arguments.                                                    │
 * │                                                                             │
 * │  Rest parameters let me write flexible functions that accept any number    │
 * │  of arguments, and in destructuring they help me separate known            │
 * │  properties from 'everything else' - crucial for props forwarding."        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * RUN: node docs/14-destructuring-spread/06-when-to-use.js
 */
