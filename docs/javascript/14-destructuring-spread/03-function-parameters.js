/**
 * CHALLENGE 03: Destructuring in Function Parameters
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ You can destructure directly in function parameters!                       ║
 * ║ This is EXTREMELY common in React and modern JavaScript.                   ║
 * ║                                                                            ║
 * ║   // Object parameter destructuring                                        ║
 * ║   function greet({ name, age }) {                                          ║
 * ║     return `${name} is ${age}`;                                           ║
 * ║   }                                                                        ║
 * ║   greet({ name: 'John', age: 30 });                                       ║
 * ║                                                                            ║
 * ║   // Array parameter destructuring                                         ║
 * ║   function getFirst([first]) {                                             ║
 * ║     return first;                                                          ║
 * ║   }                                                                        ║
 * ║   getFirst([1, 2, 3]);                                                     ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 1. Object Parameter Destructuring
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 1. Object Parameter Destructuring ═══\n");

// WITHOUT destructuring (old way)
function createUserOld(options) {
  const name = options.name;
  const age = options.age;
  const role = options.role || 'user';
  return { id: Date.now(), name, age, role };
}

// WITH destructuring (modern way)
function createUser({ name, age, role = 'user' }) {
  return { id: Date.now(), name, age, role };
}

const user1 = createUser({ name: 'Alice', age: 28 });
console.log('A: Created user:', user1);

const user2 = createUser({ name: 'Bob', age: 35, role: 'admin' });
console.log('B: Created admin:', user2);

console.log('');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHY THIS IS BETTER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   OLD WAY:                                                                  │
 * │   function fn(options) {                                                    │
 * │     const name = options.name;        // Verbose                           │
 * │     const age = options.age;          // Repetitive                        │
 * │     const role = options.role || 'x'; // Default handling                  │
 * │   }                                                                         │
 * │                                                                             │
 * │   NEW WAY:                                                                  │
 * │   function fn({ name, age, role = 'x' }) {                                 │
 * │     // name, age, role are immediately available!                          │
 * │     // Defaults are inline                                                  │
 * │     // Self-documenting - you see expected properties                       │
 * │   }                                                                         │
 * │                                                                             │
 * │   BENEFITS:                                                                 │
 * │   ✓ Cleaner, less code                                                      │
 * │   ✓ Default values inline                                                   │
 * │   ✓ Self-documenting parameters                                             │
 * │   ✓ Named parameters (order doesn't matter when calling)                   │
 * │   ✓ Easy to add optional parameters                                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 2. Default for Entire Object Parameter
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 2. Default for Entire Object ═══\n");

// PROBLEM: What if nothing is passed?
function brokenFunc({ name }) {
  return name;
}
// brokenFunc();  // TypeError: Cannot destructure property 'name' of 'undefined'

// SOLUTION: Default empty object
function safeFunc({ name = 'Anonymous' } = {}) {
  return name;
}

console.log('C: With argument:', safeFunc({ name: 'John' }));
console.log('D: Without argument:', safeFunc());
console.log('E: Empty object:', safeFunc({}));

console.log('');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ THE = {} PATTERN                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   function fn({ a = 1, b = 2 } = {}) { }                                   │
 * │                              └──┬──┘                                       │
 * │                                 │                                          │
 * │                 Default for the ENTIRE parameter                           │
 * │                                                                             │
 * │   Without = {}:                                                             │
 * │   fn();  // Tries to destructure undefined → CRASH!                        │
 * │                                                                             │
 * │   With = {}:                                                                │
 * │   fn();  // Destructures empty object → Uses a=1, b=2                      │
 * │                                                                             │
 * │   ┌────────────────────────────────────────────────────────────────────┐   │
 * │   │                                                                     │   │
 * │   │   { a = 1, b = 2 }     ← Defaults for individual properties        │   │
 * │   │                 = {}   ← Default for entire parameter              │   │
 * │   │                                                                     │   │
 * │   │   ALWAYS add = {} when destructuring optional parameters!          │   │
 * │   │                                                                     │   │
 * │   └────────────────────────────────────────────────────────────────────┘   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 3. Array Parameter Destructuring
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 3. Array Parameter Destructuring ═══\n");

// Get first element
function getFirst([first]) {
  return first;
}
console.log('F: First:', getFirst([1, 2, 3]));

// Get first and rest
function processItems([first, ...rest]) {
  console.log('G: First item:', first);
  console.log('H: Remaining:', rest);
}
processItems(['apple', 'banana', 'cherry']);

// Swap using array destructuring
function swap([a, b]) {
  return [b, a];
}
console.log('I: Swapped:', swap([1, 2]));

// With defaults
function getCoords([x = 0, y = 0, z = 0] = []) {
  return { x, y, z };
}
console.log('J: Full:', getCoords([10, 20, 30]));
console.log('K: Partial:', getCoords([10]));
console.log('L: Empty:', getCoords());

console.log('');


// ═══════════════════════════════════════════════════════════════════════════════
// 4. Mixed Destructuring
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 4. Mixed Object and Array ═══\n");

// Complex data structure
function processResponse({
  status,
  data: [firstItem, ...otherItems],
  meta: { total, page = 1 }
}) {
  console.log('M: Status:', status);
  console.log('N: First item:', firstItem);
  console.log('O: Other items:', otherItems);
  console.log('P: Total:', total, 'Page:', page);
}

processResponse({
  status: 'success',
  data: ['Item 1', 'Item 2', 'Item 3'],
  meta: { total: 100 }
});

console.log('');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ NESTED DESTRUCTURING IN PARAMETERS                                         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   function fn({                                                             │
 * │     a,                              // Simple property                      │
 * │     b: { c, d },                    // Nested object                       │
 * │     e: [f, g],                      // Nested array                        │
 * │     h: { i: [j, k] } = { i: [] }   // Deep nested with default            │
 * │   }) { }                                                                    │
 * │                                                                             │
 * │   READABILITY TIP:                                                          │
 * │   If destructuring gets too complex, consider:                              │
 * │   1. Taking the whole object and destructuring in body                     │
 * │   2. Splitting into multiple simpler functions                              │
 * │   3. Using intermediate variables                                           │
 * │                                                                             │
 * │   // Sometimes simpler is better:                                           │
 * │   function fn(data) {                                                       │
 * │     const { complex: { nested: { value } } } = data;                       │
 * │   }                                                                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 5. React Component Pattern
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 5. React Component Pattern ═══\n");

// Simulating React component with props destructuring
function Button({ text, onClick, disabled = false, className = '' }) {
  // This is exactly how React components destructure props!
  console.log('Q: Button props -');
  console.log('   text:', text);
  console.log('   onClick:', typeof onClick);
  console.log('   disabled:', disabled);
  console.log('   className:', className);
}

Button({
  text: 'Click Me',
  onClick: () => console.log('clicked'),
  disabled: false
});

console.log('');

// With rest for forwarding props
function Input({ label, ...inputProps }) {
  console.log('R: Label:', label);
  console.log('S: Props to forward:', inputProps);
  // In React: <input {...inputProps} />
}

Input({
  label: 'Email',
  type: 'email',
  placeholder: 'Enter email',
  required: true
});

console.log('');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ REACT PROPS PATTERN                                                         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // Destructure in parameter:                                              │
 * │   function Component({ name, age, onSubmit }) {                            │
 * │     return <div>{name}</div>;                                               │
 * │   }                                                                         │
 * │                                                                             │
 * │   // Or destructure in body:                                                │
 * │   function Component(props) {                                               │
 * │     const { name, age, onSubmit } = props;                                 │
 * │     return <div>{name}</div>;                                               │
 * │   }                                                                         │
 * │                                                                             │
 * │   // Rest for prop forwarding:                                              │
 * │   function Wrapper({ children, className, ...rest }) {                     │
 * │     return <div className={className} {...rest}>{children}</div>;          │
 * │   }                                                                         │
 * │                                                                             │
 * │   This pattern is EVERYWHERE in React!                                      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 6. Named Parameters Pattern
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 6. Named Parameters Pattern ═══\n");

// PROBLEM with positional parameters:
function createElementPositional(tag, text, className, id, disabled) {
  // What is the 3rd parameter? Hard to remember!
  return { tag, text, className, id, disabled };
}

// Called like this - confusing!
createElementPositional('button', 'Click', 'btn-primary', 'submit-btn', false);

// SOLUTION: Named parameters with destructuring
function createElement({
  tag,
  text = '',
  className = '',
  id = null,
  disabled = false
} = {}) {
  return { tag, text, className, id, disabled };
}

// Much clearer! Order doesn't matter!
const element = createElement({
  tag: 'button',
  text: 'Click',
  disabled: false,
  id: 'submit-btn',
  className: 'btn-primary'
});

console.log('T: Named params result:', element);
console.log('');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ POSITIONAL vs NAMED PARAMETERS                                              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   POSITIONAL (confusing with many args):                                    │
 * │   fn('x', 'y', true, false, null, 42)  // What is each value?             │
 * │                                                                             │
 * │   NAMED (self-documenting):                                                 │
 * │   fn({                                                                      │
 * │     firstName: 'x',                                                         │
 * │     lastName: 'y',                                                          │
 * │     isAdmin: true,                                                          │
 * │     isActive: false,                                                        │
 * │     manager: null,                                                          │
 * │     age: 42                                                                 │
 * │   })                                                                        │
 * │                                                                             │
 * │   WHEN TO USE NAMED:                                                        │
 * │   • More than 2-3 parameters                                                │
 * │   • Boolean parameters                                                      │
 * │   • Optional parameters                                                     │
 * │   • Parameters that could be in any order                                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 7. Callback with Destructuring
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 7. Callback Destructuring ═══\n");

const users = [
  { id: 1, name: 'Alice', age: 28, active: true },
  { id: 2, name: 'Bob', age: 35, active: false },
  { id: 3, name: 'Charlie', age: 42, active: true }
];

// Destructure in map callback
const names = users.map(({ name }) => name);
console.log('U: Names:', names);

// Destructure in filter callback
const activeUsers = users.filter(({ active }) => active);
console.log('V: Active users:', activeUsers.map(u => u.name));

// Destructure in forEach
console.log('W: User details:');
users.forEach(({ name, age }) => {
  console.log(`   ${name}: ${age} years old`);
});

// Destructure in reduce
const totalAge = users.reduce((sum, { age }) => sum + age, 0);
console.log('X: Total age:', totalAge);

console.log('');


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Destructuring in function parameters is extremely useful:                  │
 * │                                                                             │
 * │  1. Object params: function fn({ a, b }) - extracts properties             │
 * │  2. Array params: function fn([first, ...rest]) - extracts elements        │
 * │  3. Defaults: function fn({ a = 1 } = {}) - property AND param defaults    │
 * │  4. Nested: function fn({ data: { id } }) - deep extraction                │
 * │                                                                             │
 * │  The = {} default is critical - without it, calling fn() without           │
 * │  arguments throws TypeError trying to destructure undefined.               │
 * │                                                                             │
 * │  In React, this is the standard pattern for components:                     │
 * │  function Button({ text, onClick, disabled = false }) { }                  │
 * │                                                                             │
 * │  It's also great for callbacks:                                             │
 * │  users.map(({ name, age }) => `${name} is ${age}`)                         │
 * │                                                                             │
 * │  For many parameters, use object destructuring with named properties       │
 * │  instead of positional parameters - it's self-documenting and order        │
 * │  doesn't matter."                                                          │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/14-destructuring-spread/03-function-parameters.js
 */
