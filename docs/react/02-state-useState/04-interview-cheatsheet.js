/**
 * TOPIC: State & useState - Interview Cheatsheet
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ State is PRIVATE data that a component OWNS and can CHANGE.             ║
 * ║ Props are EXTERNAL data passed IN. State triggers RE-RENDERS.           ║
 * ║ Never mutate state - always create new references.                      ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────────────────────┐
 * │                                                                           │
 * │ Props = your NAME (given by parents, you can't change it).                │
 * │ State = your MOOD (you own it, you change it, it affects your behavior). │
 * │                                                                           │
 * └───────────────────────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────────────────────────┐
 * │                                                                           │
 * │   Props (external)    State (internal)    Derived (computed)               │
 * │   ┌────────────┐     ┌─────────────┐     ┌──────────────┐                │
 * │   │ READ-ONLY  │     │ READ/WRITE  │     │ COMPUTED     │                │
 * │   │ From parent│     │ useState()  │     │ From state   │                │
 * │   │ Immutable  │     │ Setter fn   │     │ No storage   │                │
 * │   └────────────┘     └─────────────┘     └──────────────┘                │
 * │                                                                           │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

// Q1: State vs Props
console.log('Q1: State vs Props?');
console.log('A1: Props = external, read-only, from parent.');
console.log('    State = internal, mutable (via setter), owned by component.\n');

// Q2: How does useState work internally?
console.log('Q2: How does useState work internally?');
console.log('A2: React stores state in an array indexed by hook call order.');
console.log('    Each render resets the index. Closures preserve the state.');
// Demo:
const hooks = [0, 'Surya'];  // React's internal array
let idx = 0;
const useState = (init) => [hooks[idx] !== undefined ? hooks[idx] : init, (v) => { hooks[idx] = v; }];
idx = 0;
const [count] = useState(0);
idx = 1;
const [name] = useState('Surya');
console.log('    Hooks array:', JSON.stringify(hooks), '\n');

// Q3: Why is setState async?
console.log('Q3: Why is setState "async"?');
console.log('A3: setState schedules an update. React batches multiple calls into');
console.log('    one re-render for performance. State is NOT updated immediately.\n');

// Q4: What happens when you call setState with same value?
console.log('Q4: setState with same value?');
console.log('A4: React bails out - no re-render if Object.is(oldState, newState).');
console.log('    That is why immutability matters: same ref = no update.\n');

// Q5: Functional updates
console.log('Q5: When to use functional updates?');
console.log('A5: When new state depends on previous: setCount(prev => prev + 1)');
console.log('    Avoids stale closure when multiple updates in same event.\n');

// Q6: Can you use useState in a loop?
console.log('Q6: Can you use useState in a loop or condition?');
console.log('A6: NO. Hooks must be called in same order every render.');
console.log('    React tracks hooks by call ORDER, not by name.\n');

// Q7: State batching
console.log('Q7: What is state batching?');
console.log('A7: React 18 groups all setState calls (event handlers, promises,');
console.log('    timeouts) into one render. Use flushSync() to opt out.\n');

// Q8: Immutability
console.log('Q8: Why immutable state updates?');
console.log('A8: React uses === to detect changes. Mutation keeps same reference.');
const obj = { a: 1 };
const same = obj; same.a = 2;
console.log('    Mutated: obj === same?', obj === same, '(React skips render!)');
const diff = { ...obj, a: 3 };
console.log('    Spread:  obj === diff?', obj === diff, '(React re-renders!)\n');

// Q9: Lazy initialization
console.log('Q9: What is lazy initial state?');
console.log('A9: useState(() => expensiveCompute()) - function runs only on FIRST');
console.log('    render. useState(expensiveCompute()) runs every render.\n');

// Q10: Derived state
console.log('Q10: When to derive vs store state?');
console.log('A10: If computable from other state/props, DERIVE it. Don\'t store.');
console.log('     Redundant state = sync bugs. Use useMemo for expensive derives.');

/**
 * OUTPUT:
 *   Q1-Q10 with answers and demonstrations
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │ Key themes interviewers expect:                                            │
 * │ 1. useState stores state in an internal array (hook call order matters)    │
 * │ 2. State updates are batched and asynchronous                              │
 * │ 3. Immutability is required for React's change detection                   │
 * │ 4. Functional updates prevent stale closure bugs                           │
 * │ 5. Derive values instead of storing redundant state                        │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/02-state-useState/04-interview-cheatsheet.js
 */
