/**
 * THIS BINDING: 03 - "this" in Classes
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ CLASS METHODS AND "this"                                                   ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ In classes, "this" refers to the instance when methods are called          ║
 * ║ on the instance. BUT the same binding rules apply!                         ║
 * ║                                                                            ║
 * ║ The most common bug: passing class methods as callbacks.                   ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// BASIC CLASS "this"
// ═══════════════════════════════════════════════════════════════════════════════

console.log('=== Basic Class "this" ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ "this" IN CLASS METHODS                                                     │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   class User {                                                              │
 * │     constructor(name) {                                                     │
 * │       this.name = name;    ← "this" = the new instance                      │
 * │     }                                                                       │
 * │                                                                             │
 * │     greet() {                                                               │
 * │       console.log(this.name);  ← "this" = ? (depends on call)               │
 * │     }                                                                       │
 * │   }                                                                         │
 * │                                                                             │
 * │   const user = new User('Alice');                                           │
 * │   user.greet();          // "this" = user (implicit binding)                │
 * │                                                                             │
 * │   const fn = user.greet;                                                    │
 * │   fn();                  // "this" = undefined (strict mode in classes!)    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

class User {
  constructor(name) {
    this.name = name;
  }

  greet() {
    console.log(`  Hello, I'm ${this.name}`);
  }
}

const alice = new User('Alice');

console.log('A: Method call on instance:');
alice.greet();  // Hello, I'm Alice

console.log('\nB: Extracted method call:');
const extracted = alice.greet;
try {
  extracted();  // Error! Cannot read property 'name' of undefined
} catch (e) {
  console.log('  Error:', e.message);
}


// ═══════════════════════════════════════════════════════════════════════════════
// THE CALLBACK PROBLEM
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== The Callback Problem ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ PASSING CLASS METHODS AS CALLBACKS                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   class Button {                                                            │
 * │     constructor(label) {                                                    │
 * │       this.label = label;                                                   │
 * │     }                                                                       │
 * │                                                                             │
 * │     handleClick() {                                                         │
 * │       console.log(`Clicked: ${this.label}`);                                │
 * │     }                                                                       │
 * │   }                                                                         │
 * │                                                                             │
 * │   const btn = new Button('Submit');                                         │
 * │   element.addEventListener('click', btn.handleClick);                       │
 * │   // ✗ "this" will be the element, not btn!                                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

class Counter {
  constructor() {
    this.count = 0;
  }

  increment() {
    this.count++;
    console.log(`  Count: ${this.count}`);
  }
}

const counter = new Counter();

console.log('C: Direct method call:');
counter.increment();  // Count: 1

console.log('\nD: As callback (simulated):');
function simulateCallback(callback) {
  callback();  // Called without context!
}

try {
  simulateCallback(counter.increment);  // Error!
} catch (e) {
  console.log('  Error:', e.message);
}


// ═══════════════════════════════════════════════════════════════════════════════
// SOLUTION 1: BIND IN CONSTRUCTOR
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Solution 1: Bind in Constructor ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ BIND METHODS IN CONSTRUCTOR                                                 │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   class Counter {                                                           │
 * │     constructor() {                                                         │
 * │       this.count = 0;                                                       │
 * │       this.increment = this.increment.bind(this);  ← Bind here!             │
 * │     }                                                                       │
 * │                                                                             │
 * │     increment() {                                                           │
 * │       this.count++;                                                         │
 * │     }                                                                       │
 * │   }                                                                         │
 * │                                                                             │
 * │   PROS: Explicit, traditional pattern                                       │
 * │   CONS: Verbose if many methods, each instance gets own copy                │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

class CounterBound {
  constructor() {
    this.count = 0;
    // Bind methods in constructor
    this.increment = this.increment.bind(this);
  }

  increment() {
    this.count++;
    console.log(`  Count: ${this.count}`);
  }
}

const counterBound = new CounterBound();

console.log('E: Bound method as callback:');
simulateCallback(counterBound.increment);  // Count: 1
simulateCallback(counterBound.increment);  // Count: 2


// ═══════════════════════════════════════════════════════════════════════════════
// SOLUTION 2: ARROW FUNCTION CLASS FIELDS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Solution 2: Arrow Function Class Fields ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ ARROW FUNCTION CLASS FIELDS (Modern Approach)                               │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   class Counter {                                                           │
 * │     count = 0;                                                              │
 * │                                                                             │
 * │     increment = () => {      ← Arrow function as class field                │
 * │       this.count++;          ← "this" is always the instance                │
 * │     };                                                                      │
 * │   }                                                                         │
 * │                                                                             │
 * │   PROS: Clean syntax, "this" always correct                                 │
 * │   CONS: Each instance gets own copy (not on prototype)                      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

class CounterArrow {
  count = 0;

  // Arrow function as class field - "this" is always the instance
  increment = () => {
    this.count++;
    console.log(`  Count: ${this.count}`);
  };
}

const counterArrow = new CounterArrow();

console.log('F: Arrow class field as callback:');
simulateCallback(counterArrow.increment);  // Count: 1
simulateCallback(counterArrow.increment);  // Count: 2


// ═══════════════════════════════════════════════════════════════════════════════
// SOLUTION 3: INLINE ARROW FUNCTION
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Solution 3: Inline Arrow Function ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WRAP IN ARROW FUNCTION AT CALL SITE                                         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   element.addEventListener('click', () => btn.handleClick());               │
 * │                                      ▲                                      │
 * │                                      │                                      │
 * │                                      └── Arrow preserves "this"             │
 * │                                                                             │
 * │   PROS: No modification to class needed                                     │
 * │   CONS: Creates new function each time                                      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const counterNormal = new Counter();

console.log('G: Inline arrow function:');
simulateCallback(() => counterNormal.increment());  // Count: 1
simulateCallback(() => counterNormal.increment());  // Count: 2


// ═══════════════════════════════════════════════════════════════════════════════
// REACT CLASS COMPONENTS (Historical)
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== React Class Component Pattern ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ REACT CLASS COMPONENT "this" BINDING                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   class Button extends React.Component {                                    │
 * │     constructor(props) {                                                    │
 * │       super(props);                                                         │
 * │       this.handleClick = this.handleClick.bind(this);  // Option 1          │
 * │     }                                                                       │
 * │                                                                             │
 * │     handleClick() {                                                         │
 * │       console.log(this.props.label);                                        │
 * │     }                                                                       │
 * │                                                                             │
 * │     // Option 2: Arrow class field                                          │
 * │     handleClick = () => {                                                   │
 * │       console.log(this.props.label);                                        │
 * │     };                                                                      │
 * │                                                                             │
 * │     render() {                                                              │
 * │       return <button onClick={this.handleClick}>Click</button>;             │
 * │       // Option 3: Inline arrow                                             │
 * │       return <button onClick={() => this.handleClick()}>Click</button>;     │
 * │     }                                                                       │
 * │   }                                                                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Simulated React-like component
class Component {
  constructor(props) {
    this.props = props;
    // Method 1: Bind in constructor
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    console.log(`  Clicked: ${this.props.label}`);
  }

  // Method 2: Arrow class field
  handleSubmit = () => {
    console.log(`  Submitted: ${this.props.label}`);
  };
}

const button = new Component({ label: 'Save' });

console.log('H: React-style bound method:');
simulateCallback(button.handleClick);   // Clicked: Save

console.log('I: React-style arrow field:');
simulateCallback(button.handleSubmit);  // Submitted: Save


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "In class methods, 'this' follows the same rules as regular functions.      │
 * │ The most common problem is passing methods as callbacks - 'this' is lost.   │
 * │                                                                             │
 * │ Three solutions:                                                            │
 * │                                                                             │
 * │ 1. Bind in constructor:                                                     │
 * │    this.handleClick = this.handleClick.bind(this);                          │
 * │    Pros: Explicit, well-understood                                          │
 * │    Cons: Verbose                                                            │
 * │                                                                             │
 * │ 2. Arrow function class fields:                                             │
 * │    handleClick = () => { ... };                                             │
 * │    Pros: Clean, automatic binding                                           │
 * │    Cons: Each instance gets own copy (memory)                               │
 * │                                                                             │
 * │ 3. Inline arrow at call site:                                               │
 * │    onClick={() => this.handleClick()}                                       │
 * │    Pros: No class modification                                              │
 * │    Cons: New function on each render                                        │
 * │                                                                             │
 * │ In React class components, options 1 or 2 are preferred. Modern React       │
 * │ uses functional components with hooks, avoiding class 'this' issues."       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/21-this-binding/03-this-in-classes.js
 */
