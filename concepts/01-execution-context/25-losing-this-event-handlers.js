/**
 * CONCEPT 25: Losing `this` in Event Handlers
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE PROBLEM                                                                ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ When you pass a method as an event handler, `this` gets LOST.              ║
 * ║                                                                            ║
 * ║ WHY?                                                                       ║
 * ║   - Event handlers are called as STANDALONE functions                      ║
 * ║   - No object.method() syntax → no implicit `this` binding                 ║
 * ║   - `this` becomes the element (DOM) or undefined (strict mode)            ║
 * ║                                                                            ║
 * ║ This is the #1 cause of "this is undefined" bugs in JavaScript!            ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ============================================================================
// EXAMPLE 1: The Problem Demonstrated
// ============================================================================

console.log('=== Example 1: The Problem ===');

var button = {
  label: 'Submit',
  onClick: function() {
    console.log('Clicked: ' + this.label);
  }
};

// Direct call works
button.onClick();  // Clicked: Submit

// But passing as callback loses `this`
function simulateClick(handler) {
  // This is what event listeners do internally:
  handler();  // Standalone call - no object before dot!
}

simulateClick(button.onClick);  // Clicked: undefined

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHAT HAPPENED?                                                              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ button.onClick()        → this = button (method call)                       │
 * │                                                                             │
 * │ simulateClick(button.onClick)                                               │
 * │   │                                                                         │
 * │   │  We're passing the FUNCTION, not calling it as a method                 │
 * │   │                                                                         │
 * │   └──► handler()        → this = global (standalone call)                   │
 * │                                                                             │
 * │ When you do: element.addEventListener('click', button.onClick)              │
 * │ You're passing the function reference, not calling it with button.          │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ============================================================================
// EXAMPLE 2: DOM Event Handler Simulation
// ============================================================================

console.log('\n=== Example 2: DOM Event Simulation ===');

// Simulating how DOM event handling works
var domElement = {
  id: 'myButton',
  addEventListener: function(event, handler) {
    // DOM stores the handler and later calls it like this:
    // In real DOM: this = the element
    // We simulate: handler() or handler.call(element)

    console.log('Event registered. Simulating click...');

    // Real DOM does something like: handler.call(element, eventObject)
    handler.call(this);  // this = domElement, not our object!
  }
};

var controller = {
  count: 0,
  handleClick: function() {
    this.count++;
    console.log('Count:', this.count);
    console.log('this.id:', this.id);  // From domElement!
  }
};

domElement.addEventListener('click', controller.handleClick);
// Count: NaN (this.count was undefined, undefined++ = NaN)
// this.id: myButton (this is domElement, not controller!)


// ============================================================================
// EXAMPLE 3: Solution 1 - Using bind()
// ============================================================================

console.log('\n=== Example 3: Solution - bind() ===');

var counter1 = {
  count: 0,
  handleClick: function() {
    this.count++;
    console.log('Count (bind):', this.count);
  }
};

// Bind BEFORE passing as callback
var boundHandler = counter1.handleClick.bind(counter1);
simulateClick(boundHandler);  // Count (bind): 1
simulateClick(boundHandler);  // Count (bind): 2

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHY bind() WORKS                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ counter1.handleClick.bind(counter1)                                         │
 * │                                                                             │
 * │ Creates a NEW function where `this` is PERMANENTLY locked to counter1.      │
 * │ No matter how this new function is called later, `this` won't change.       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ============================================================================
// EXAMPLE 4: Solution 2 - Arrow Function Wrapper
// ============================================================================

console.log('\n=== Example 4: Solution - Arrow Function ===');

var counter2 = {
  count: 0,
  handleClick: function() {
    this.count++;
    console.log('Count (arrow):', this.count);
  }
};

// Wrap in arrow function
simulateClick(() => counter2.handleClick());  // Count (arrow): 1
simulateClick(() => counter2.handleClick());  // Count (arrow): 2

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHY ARROW WRAPPER WORKS                                                     │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ () => counter2.handleClick()                                                │
 * │                                                                             │
 * │ The arrow function calls counter2.handleClick() with proper method syntax.  │
 * │ Inside the arrow, counter2.handleClick() is a method call!                  │
 * │                                                                             │
 * │ counter2.handleClick() → this = counter2 (method call)                      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ============================================================================
// EXAMPLE 5: Solution 3 - Arrow Function as Method (Modern Pattern)
// ============================================================================

console.log('\n=== Example 5: Solution - Arrow as Class Property ===');

// ES6 Class with arrow function property (common in React)
class Counter {
  constructor() {
    this.count = 0;
  }

  // Arrow function as class property - auto-binds!
  handleClick = () => {
    this.count++;
    console.log('Count (class arrow):', this.count);
  }
}

var counter3 = new Counter();
simulateClick(counter3.handleClick);  // Count (class arrow): 1
simulateClick(counter3.handleClick);  // Count (class arrow): 2

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHY ARROW CLASS PROPERTY WORKS                                              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ handleClick = () => { ... }                                                 │
 * │                                                                             │
 * │ This creates an arrow function when the instance is created.                │
 * │ Arrow functions inherit `this` from where they're DEFINED.                  │
 * │                                                                             │
 * │ When? During new Counter(), inside the constructor scope.                   │
 * │ What's `this` there? The new instance!                                      │
 * │                                                                             │
 * │ So the arrow function's `this` is permanently the instance.                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ============================================================================
// EXAMPLE 6: Solution 4 - Bind in Constructor (React Classic Pattern)
// ============================================================================

console.log('\n=== Example 6: Solution - Bind in Constructor ===');

class Counter2 {
  constructor() {
    this.count = 0;
    // Bind methods in constructor
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.count++;
    console.log('Count (constructor bind):', this.count);
  }
}

var counter4 = new Counter2();
simulateClick(counter4.handleClick);  // Count (constructor bind): 1
simulateClick(counter4.handleClick);  // Count (constructor bind): 2


// ============================================================================
// EXAMPLE 7: Real-World React Example
// ============================================================================

console.log('\n=== Example 7: React Patterns ===');

// Simulating React component lifecycle
class ReactComponentSimulation {
  constructor(props) {
    this.props = props;
    this.state = { clicks: 0 };

    // Pattern 1: Bind in constructor
    this.handleClickBound = this.handleClickRegular.bind(this);
  }

  // Pattern 2: Regular method (needs binding)
  handleClickRegular() {
    this.state.clicks++;
    console.log('Regular method - clicks:', this.state.clicks);
  }

  // Pattern 3: Arrow function property (auto-bound)
  handleClickArrow = () => {
    this.state.clicks++;
    console.log('Arrow property - clicks:', this.state.clicks);
  }

  render() {
    // In real React, this returns JSX
    // onClick={this.handleClickRegular}  ← BROKEN! Loses this
    // onClick={this.handleClickBound}    ← Works (bound in constructor)
    // onClick={this.handleClickArrow}    ← Works (arrow function)
    // onClick={() => this.handleClickRegular()} ← Works (arrow wrapper)

    return {
      'broken': this.handleClickRegular,           // Will lose this
      'bound': this.handleClickBound,              // Works
      'arrow': this.handleClickArrow,              // Works
      'wrapper': () => this.handleClickRegular()   // Works
    };
  }
}

var component = new ReactComponentSimulation({ name: 'Test' });
var handlers = component.render();

console.log('\nSimulating clicks:');
// handlers.broken();  // Would error - this.state is undefined
handlers.bound();      // Regular method - clicks: 1
handlers.arrow();      // Arrow property - clicks: 2
handlers.wrapper();    // Regular method - clicks: 3


// ============================================================================
// EXAMPLE 8: setTimeout/setInterval Problem
// ============================================================================

console.log('\n=== Example 8: setTimeout Problem ===');

var timer = {
  seconds: 0,

  // Problem: Regular function loses this in setTimeout
  startBroken: function() {
    setTimeout(function() {
      this.seconds++;  // this = global, not timer!
      console.log('Broken:', this.seconds);  // NaN
    }, 100);
  },

  // Solution 1: Arrow function
  startArrow: function() {
    setTimeout(() => {
      this.seconds++;
      console.log('Arrow:', this.seconds);
    }, 200);
  },

  // Solution 2: bind
  startBind: function() {
    setTimeout(function() {
      this.seconds++;
      console.log('Bind:', this.seconds);
    }.bind(this), 300);
  },

  // Solution 3: var self = this (old pattern)
  startSelf: function() {
    var self = this;
    setTimeout(function() {
      self.seconds++;
      console.log('Self:', self.seconds);
    }, 400);
  }
};

timer.startBroken();  // Broken: NaN
timer.startArrow();   // Arrow: 1
timer.startBind();    // Bind: 2
timer.startSelf();    // Self: 3


// ============================================================================
// EXAMPLE 9: Array Methods Problem
// ============================================================================

console.log('\n=== Example 9: Array Methods ===');

var processor = {
  multiplier: 2,

  // Problem: Regular function in forEach loses this
  processBroken: function(numbers) {
    var results = [];
    numbers.forEach(function(n) {
      results.push(n * this.multiplier);  // this.multiplier = undefined
    });
    return results;
  },

  // Solution 1: Arrow function
  processArrow: function(numbers) {
    return numbers.map(n => n * this.multiplier);
  },

  // Solution 2: Second argument to forEach/map (thisArg)
  processThisArg: function(numbers) {
    return numbers.map(function(n) {
      return n * this.multiplier;
    }, this);  // <-- Pass this as second argument!
  },

  // Solution 3: bind
  processBind: function(numbers) {
    return numbers.map(function(n) {
      return n * this.multiplier;
    }.bind(this));
  }
};

var nums = [1, 2, 3, 4, 5];

console.log('Broken:', processor.processBroken(nums));  // [NaN, NaN, NaN, NaN, NaN]
console.log('Arrow:', processor.processArrow(nums));    // [2, 4, 6, 8, 10]
console.log('thisArg:', processor.processThisArg(nums)); // [2, 4, 6, 8, 10]
console.log('Bind:', processor.processBind(nums));      // [2, 4, 6, 8, 10]

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ forEach/map thisArg PARAMETER                                               │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Many array methods accept a second parameter for `this`:                    │
 * │                                                                             │
 * │   array.forEach(callback, thisArg)                                          │
 * │   array.map(callback, thisArg)                                              │
 * │   array.filter(callback, thisArg)                                           │
 * │   array.every(callback, thisArg)                                            │
 * │   array.some(callback, thisArg)                                             │
 * │   array.find(callback, thisArg)                                             │
 * │                                                                             │
 * │ This is often forgotten! Arrow functions are usually cleaner though.        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ SUMMARY: Solutions to "Losing this"                                        ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ SOLUTION 1: bind()                                                         ║
 * ║ ─────────────────                                                          ║
 * ║   element.addEventListener('click', this.handleClick.bind(this));          ║
 * ║                                                                            ║
 * ║   Pros: Works everywhere, clear intent                                     ║
 * ║   Cons: Creates new function each render (if in render method)             ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ SOLUTION 2: Arrow function wrapper                                         ║
 * ║ ─────────────────────────────────                                          ║
 * ║   element.addEventListener('click', () => this.handleClick());             ║
 * ║                                                                            ║
 * ║   Pros: Clean, works everywhere                                            ║
 * ║   Cons: Creates new function each render                                   ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ SOLUTION 3: Arrow function as class property                               ║
 * ║ ────────────────────────────────────────────                               ║
 * ║   handleClick = () => { ... }                                              ║
 * ║                                                                            ║
 * ║   Pros: Clean, no explicit binding needed                                  ║
 * ║   Cons: Creates new function per instance, not on prototype                ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ SOLUTION 4: Bind in constructor                                            ║
 * ║ ──────────────────────────────                                             ║
 * ║   constructor() { this.handleClick = this.handleClick.bind(this); }        ║
 * ║                                                                            ║
 * ║   Pros: Function created once, efficient                                   ║
 * ║   Cons: Verbose, easy to forget                                            ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ SOLUTION 5: var self = this (legacy)                                       ║
 * ║ ────────────────────────────────────                                       ║
 * ║   var self = this;                                                         ║
 * ║   setTimeout(function() { self.method(); }, 100);                          ║
 * ║                                                                            ║
 * ║   Pros: Works in old browsers                                              ║
 * ║   Cons: Ugly, outdated                                                     ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ SOLUTION 6: thisArg parameter (array methods)                              ║
 * ║ ─────────────────────────────────────────────                              ║
 * ║   array.map(function(x) { ... }, this);                                    ║
 * ║                                                                            ║
 * ║   Pros: Built-in, no extra function                                        ║
 * ║   Cons: Only works with certain methods                                    ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ RECOMMENDED MODERN APPROACH                                                ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ 1. In React: Use arrow function class properties or hooks                  ║
 * ║                                                                            ║
 * ║    // Class component                                                      ║
 * ║    handleClick = () => { ... }                                             ║
 * ║                                                                            ║
 * ║    // Function component (hooks)                                           ║
 * ║    const handleClick = () => { ... }                                       ║
 * ║                                                                            ║
 * ║ 2. For callbacks: Arrow functions                                          ║
 * ║                                                                            ║
 * ║    setTimeout(() => this.update(), 100);                                   ║
 * ║    array.map(x => x * this.multiplier);                                    ║
 * ║                                                                            ║
 * ║ 3. When storing reference: bind()                                          ║
 * ║                                                                            ║
 * ║    this.boundHandler = this.handler.bind(this);                            ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "When you pass a method as an event handler or callback, `this` gets lost  │
 * │  because the function is called without an object context - it's a         │
 * │  standalone call where `this` defaults to global or undefined.             │
 * │                                                                             │
 * │  There are several solutions:                                               │
 * │                                                                             │
 * │  1. bind(): Create a version with `this` permanently bound                 │
 * │     element.addEventListener('click', this.handleClick.bind(this))         │
 * │                                                                             │
 * │  2. Arrow function wrapper: Calls the method properly                       │
 * │     element.addEventListener('click', () => this.handleClick())            │
 * │                                                                             │
 * │  3. Arrow function as class property: Auto-binds to instance               │
 * │     handleClick = () => { ... }                                             │
 * │                                                                             │
 * │  In modern React, arrow function class properties are common in class      │
 * │  components, while function components with hooks avoid this issue         │
 * │  entirely since they don't use `this`."                                     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node concepts/01-execution-context/25-losing-this-event-handlers.js
 */
