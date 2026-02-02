/**
 * CLASSES & OOP: 07 - Classes vs Factory Functions
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ CLASSES: Use 'new', methods on prototype, 'this' binding issues            ║
 * ║ FACTORIES: No 'new', closures for privacy, no 'this' issues                ║
 * ║                                                                            ║
 * ║   // Class                         // Factory                              ║
 * ║   class Counter {                  function createCounter() {              ║
 * ║     constructor() {                  let count = 0;                        ║
 * ║       this.count = 0;                return {                              ║
 * ║     }                                  inc: () => ++count,                 ║
 * ║     inc() { this.count++; }            get: () => count                    ║
 * ║   }                                  };                                    ║
 * ║   new Counter()                    }                                       ║
 * ║                                    createCounter()                         ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ DECISION FRAMEWORK: When to Use Each                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ USE CLASSES WHEN:                                                           │
 * │                                                                             │
 * │ 1. Need inheritance hierarchy                                               │
 * │    → Animal → Dog → GermanShepherd                                          │
 * │    → Classes excel at multi-level inheritance                               │
 * │                                                                             │
 * │ 2. Need instanceof checks                                                   │
 * │    → if (err instanceof ValidationError)                                    │
 * │    → Type narrowing in TypeScript                                           │
 * │                                                                             │
 * │ 3. Creating many instances (memory efficiency)                              │
 * │    → Methods on prototype = 1 copy shared                                   │
 * │    → 10,000 users share same methods in memory                              │
 * │                                                                             │
 * │ 4. Team from OOP background                                                 │
 * │    → Familiar Java/C# patterns                                              │
 * │    → Cleaner syntax for complex hierarchies                                 │
 * │                                                                             │
 * │ 5. Framework requires it                                                    │
 * │    → React class components, Angular, NestJS                                │
 * │    → TypeORM entities, etc.                                                 │
 * │                                                                             │
 * │                                                                             │
 * │ USE FACTORIES WHEN:                                                         │
 * │                                                                             │
 * │ 1. Need true privacy (pre-ES2022 or simpler)                                │
 * │    → Closure-based privacy                                                  │
 * │    → No # syntax confusion                                                  │
 * │                                                                             │
 * │ 2. Avoiding 'this' binding issues                                           │
 * │    → Event handlers, callbacks, React hooks                                 │
 * │    → No need for .bind() or arrow methods                                   │
 * │                                                                             │
 * │ 3. Functional programming style                                             │
 * │    → Composition over inheritance                                           │
 * │    → No 'new' keyword needed                                                │
 * │                                                                             │
 * │ 4. Simple objects with few methods                                          │
 * │    → Memory overhead is negligible                                          │
 * │    → Simpler mental model                                                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// SAME THING: CLASS vs FACTORY
// ═══════════════════════════════════════════════════════════════════════════════

// === CLASS VERSION ===
class CounterClass {
  constructor(start = 0) {
    this.count = start;  // Public (visible)
  }

  increment() {
    return ++this.count;
  }

  decrement() {
    return --this.count;
  }

  getCount() {
    return this.count;
  }
}

// === FACTORY VERSION ===
function createCounter(start = 0) {
  let count = start;  // Private via closure!

  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count
  };
}

// Usage looks similar
const classCounter = new CounterClass(10);
const factoryCounter = createCounter(10);

console.log('A:', classCounter.increment());   // 11
console.log('B:', factoryCounter.increment()); // 11

// KEY DIFFERENCE: Privacy
console.log('C:', classCounter.count);    // 11 (exposed!)
console.log('D:', factoryCounter.count);  // undefined (truly private)

classCounter.count = 999;  // Can bypass methods!
console.log('E:', classCounter.getCount());  // 999 (modified directly)

// Factory count can't be modified directly
// factoryCounter.count = 999;  // This creates new property, doesn't affect real count
factoryCounter.count = 999;
console.log('F:', factoryCounter.getCount());  // Still 11!

/**
 * OUTPUT:
 *   A: 11
 *   B: 11
 *   C: 11
 *   D: undefined
 *   E: 999
 *   F: 11
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 'this' BINDING ISSUES - Classes vs Factories
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ THE 'this' PROBLEM WITH CLASSES                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ When you pass a class method as a callback, 'this' is lost!                 │
 * │                                                                             │
 * │   const obj = new Counter();                                                │
 * │   button.onclick = obj.increment;  // 'this' is button, not obj!           │
 * │   setTimeout(obj.increment, 100);  // 'this' is undefined!                  │
 * │                                                                             │
 * │ Factories avoid this because they use closures, not 'this'.                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

class TimerClass {
  constructor() {
    this.seconds = 0;
  }

  tick() {
    this.seconds++;
    console.log(`Class tick: ${this.seconds}`);
  }
}

function createTimer() {
  let seconds = 0;

  return {
    tick() {
      seconds++;
      console.log(`Factory tick: ${seconds}`);
    },
    getSeconds: () => seconds
  };
}

const classTimer = new TimerClass();
const factoryTimer = createTimer();

// Direct call - both work
classTimer.tick();    // Class tick: 1
factoryTimer.tick();  // Factory tick: 1

// Callback - CLASS BREAKS!
const classTick = classTimer.tick;
const factoryTick = factoryTimer.tick;

try {
  classTick();  // ERROR! 'this' is undefined
} catch (e) {
  console.log('G:', 'Class tick failed - this is undefined');
}

factoryTick();  // Factory tick: 2 - Works!

/**
 * OUTPUT:
 *   Class tick: 1
 *   Factory tick: 1
 *   G: Class tick failed - this is undefined
 *   Factory tick: 2
 */


// ═══════════════════════════════════════════════════════════════════════════════
// FIXING 'this' IN CLASSES
// ═══════════════════════════════════════════════════════════════════════════════

class FixedTimerClass {
  constructor() {
    this.seconds = 0;
    // Option 1: Bind in constructor
    this.tick = this.tick.bind(this);
  }

  tick() {
    this.seconds++;
    return this.seconds;
  }
}

class ArrowTimerClass {
  seconds = 0;

  // Option 2: Arrow function as class field (copies to each instance)
  tick = () => {
    this.seconds++;
    return this.seconds;
  };
}

const fixedTimer = new FixedTimerClass();
const arrowTimer = new ArrowTimerClass();

const fixedTick = fixedTimer.tick;
const arrowTick = arrowTimer.tick;

console.log('H:', fixedTick());  // 1 - Works (bound)
console.log('I:', arrowTick());  // 1 - Works (arrow captures 'this')

/**
 * OUTPUT:
 *   H: 1
 *   I: 1
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ TRADE-OFF: Arrow Methods                                                    │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Arrow methods (tick = () => {}) solve 'this', BUT:                          │
 * │                                                                             │
 * │ - Created on EACH instance (not shared on prototype)                        │
 * │ - Uses more memory (like factory functions)                                 │
 * │ - Cannot be overridden in child classes properly                            │
 * │                                                                             │
 * │ If using arrow methods everywhere, might as well use factory!               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// MEMORY COMPARISON
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ MEMORY: Classes (prototype) vs Factories (closures)                         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ CLASS (methods on prototype):                                               │
 * │                                                                             │
 * │   ┌──────────────────────────────────────────────────────────────┐          │
 * │   │ User.prototype                                               │          │
 * │   │                                                              │          │
 * │   │ greet: function() { ... }   ◄── ONE copy, shared by all      │          │
 * │   │ save: function() { ... }                                     │          │
 * │   └──────────────────────────────────────────────────────────────┘          │
 * │             ▲           ▲           ▲                                       │
 * │             │           │           │                                       │
 * │         user1       user2       user3   (only store data)                   │
 * │                                                                             │
 * │   10,000 users = 10,000 data objects + 1 set of methods                     │
 * │                                                                             │
 * │                                                                             │
 * │ FACTORY (methods in closure):                                               │
 * │                                                                             │
 * │   ┌────────────────┐  ┌────────────────┐  ┌────────────────┐                │
 * │   │ user1          │  │ user2          │  │ user3          │                │
 * │   │                │  │                │  │                │                │
 * │   │ greet: fn()    │  │ greet: fn()    │  │ greet: fn()    │                │
 * │   │ save: fn()     │  │ save: fn()     │  │ save: fn()     │                │
 * │   │ data + closure │  │ data + closure │  │ data + closure │                │
 * │   └────────────────┘  └────────────────┘  └────────────────┘                │
 * │                                                                             │
 * │   10,000 users = 10,000 data + 10,000 method copies + closures              │
 * │                                                                             │
 * │   VERDICT: For many instances, classes are more memory efficient.           │
 * │   For few instances, difference is negligible.                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Demonstrating method sharing
class UserClass {
  constructor(name) { this.name = name; }
  greet() { return `Hello, ${this.name}`; }
}

function createUser(name) {
  return {
    name,
    greet() { return `Hello, ${name}`; }  // Closure over name
  };
}

const classUser1 = new UserClass('Alice');
const classUser2 = new UserClass('Bob');
const factoryUser1 = createUser('Alice');
const factoryUser2 = createUser('Bob');

// Class methods are SAME function
console.log('J:', classUser1.greet === classUser2.greet);  // true

// Factory methods are DIFFERENT functions
console.log('K:', factoryUser1.greet === factoryUser2.greet);  // false

/**
 * OUTPUT:
 *   J: true
 *   K: false
 */


// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSITION WITH FACTORIES (Mixins)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHEN TO USE: Need multiple behaviors without inheritance                    │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Inheritance: Dog extends Animal (single parent)                             │
 * │ Composition: Dog = canWalk + canBark + canEat (multiple behaviors)          │
 * │                                                                             │
 * │ "Favor composition over inheritance" - Gang of Four                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Behavior factories
const canWalk = (state) => ({
  walk() {
    state.position += state.speed;
    return `Walking... now at ${state.position}`;
  }
});

const canSwim = (state) => ({
  swim() {
    state.position += state.speed * 0.5;
    return `Swimming... now at ${state.position}`;
  }
});

const canFly = (state) => ({
  fly() {
    state.position += state.speed * 2;
    return `Flying... now at ${state.position}`;
  }
});

// Compose behaviors
function createDuck(name) {
  const state = {
    name,
    position: 0,
    speed: 10
  };

  return {
    name: state.name,
    ...canWalk(state),
    ...canSwim(state),
    ...canFly(state)
  };
}

function createFish(name) {
  const state = {
    name,
    position: 0,
    speed: 15
  };

  return {
    name: state.name,
    ...canSwim(state)
    // Can't walk or fly!
  };
}

const duck = createDuck('Donald');
const fish = createFish('Nemo');

console.log('L:', duck.walk());  // Walking... now at 10
console.log('M:', duck.swim());  // Swimming... now at 15
console.log('N:', duck.fly());   // Flying... now at 35

console.log('O:', fish.swim());  // Swimming... now at 7.5
console.log('P:', fish.walk);    // undefined (can't walk)

/**
 * OUTPUT:
 *   L: Walking... now at 10
 *   M: Swimming... now at 15
 *   N: Flying... now at 35
 *   O: Swimming... now at 7.5
 *   P: undefined
 */


// ═══════════════════════════════════════════════════════════════════════════════
// REAL WORLD: React Component Patterns
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ React Evolution: Class → Factory (Hooks)                                    │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ // CLASS COMPONENT (old)                                                    │
 * │ class Counter extends React.Component {                                     │
 * │   state = { count: 0 };                                                     │
 * │   increment = () => {  // Must use arrow for 'this'!                        │
 * │     this.setState({ count: this.state.count + 1 });                         │
 * │   };                                                                        │
 * │   render() {                                                                │
 * │     return <button onClick={this.increment}>{this.state.count}</button>;    │
 * │   }                                                                         │
 * │ }                                                                           │
 * │                                                                             │
 * │ // FUNCTION COMPONENT (modern)                                              │
 * │ function Counter() {                                                        │
 * │   const [count, setCount] = useState(0);                                    │
 * │   const increment = () => setCount(c => c + 1);  // No 'this' issues!       │
 * │   return <button onClick={increment}>{count}</button>;                      │
 * │ }                                                                           │
 * │                                                                             │
 * │ Hooks = factory pattern for React!                                          │
 * │ - useState returns [value, setter] - like factory returning methods         │
 * │ - Closures for state                                                        │
 * │ - No 'this' binding issues                                                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Classes and factory functions both create objects, but differ in key ways: │
 * │                                                                             │
 * │  CLASSES:                                                                   │
 * │  + Methods shared on prototype (memory efficient for many instances)        │
 * │  + Supports inheritance with extends/super                                  │
 * │  + Works with instanceof checks                                             │
 * │  + Familiar OOP syntax                                                      │
 * │  - 'this' binding issues (need .bind() or arrow methods)                    │
 * │  - Must use 'new' keyword                                                   │
 * │                                                                             │
 * │  FACTORIES:                                                                 │
 * │  + True privacy via closures (no need for # syntax)                         │
 * │  + No 'this' binding issues (uses closure, not 'this')                      │
 * │  + No 'new' keyword needed                                                  │
 * │  + Easy composition (mix behaviors)                                         │
 * │  - Methods copied to each instance (more memory)                            │
 * │  - No instanceof (use duck typing instead)                                  │
 * │                                                                             │
 * │  Choose based on:                                                           │
 * │  - Many instances → Classes (memory efficient)                              │
 * │  - Callbacks/handlers → Factories (no 'this' issues)                        │
 * │  - Inheritance needed → Classes                                             │
 * │  - Composition preferred → Factories                                        │
 * │  - Need instanceof → Classes                                                │
 * │  - Need true privacy → Factories (or class with #private)                   │
 * │                                                                             │
 * │  React moved from class components to hooks (factory pattern) specifically  │
 * │  to avoid 'this' binding issues and enable composition."                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/15-classes-oop/07-class-vs-factory.js
 */
