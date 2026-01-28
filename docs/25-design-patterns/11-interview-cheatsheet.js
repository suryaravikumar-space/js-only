/**
 * DESIGN PATTERNS: 11 - Interview Cheat Sheet
 *
 * Quick reference for all patterns - what to say in 30 seconds each
 */


// ═══════════════════════════════════════════════════════════════════════════
// QUICK PATTERN SUMMARY
// ═══════════════════════════════════════════════════════════════════════════

/**
 *
 *   ┌─────────────────────────────────────────────────────────────────────────┐
 *   │  CREATIONAL PATTERNS - How objects are CREATED                         │
 *   ├─────────────────────────────────────────────────────────────────────────┤
 *   │                                                                         │
 *   │  SINGLETON                                                              │
 *   │  "Only one instance exists. getInstance() returns same object always."  │
 *   │  Example: Database connection, Logger, Config                           │
 *   │                                                                         │
 *   │  FACTORY                                                                │
 *   │  "Create objects without 'new'. Factory decides which class to use."    │
 *   │  Example: document.createElement(), UserFactory.create('admin')         │
 *   │                                                                         │
 *   │  PROTOTYPE                                                              │
 *   │  "Create new objects by cloning existing ones."                         │
 *   │  Example: Object.create(), structuredClone(), game character templates  │
 *   │                                                                         │
 *   └─────────────────────────────────────────────────────────────────────────┘
 *
 *   ┌─────────────────────────────────────────────────────────────────────────┐
 *   │  STRUCTURAL PATTERNS - How objects are COMPOSED                         │
 *   ├─────────────────────────────────────────────────────────────────────────┤
 *   │                                                                         │
 *   │  MODULE                                                                 │
 *   │  "Encapsulation using closures. Private variables, public methods."     │
 *   │  Example: IIFE returning object, ES Modules                             │
 *   │                                                                         │
 *   │  DECORATOR                                                              │
 *   │  "Wrap object/function to add behavior without modifying it."           │
 *   │  Example: withLogging(fn), React HOCs, Express middleware               │
 *   │                                                                         │
 *   │  FACADE                                                                 │
 *   │  "Simple interface to complex system. One method, many subsystems."     │
 *   │  Example: jQuery, order.placeOrder() coordinating inventory/payment     │
 *   │                                                                         │
 *   └─────────────────────────────────────────────────────────────────────────┘
 *
 *   ┌─────────────────────────────────────────────────────────────────────────┐
 *   │  BEHAVIORAL PATTERNS - How objects COMMUNICATE                          │
 *   ├─────────────────────────────────────────────────────────────────────────┤
 *   │                                                                         │
 *   │  OBSERVER                                                               │
 *   │  "Subject notifies observers when state changes. Direct relationship."  │
 *   │  Example: addEventListener, React state updates                         │
 *   │                                                                         │
 *   │  PUB/SUB                                                                │
 *   │  "Event channel between publishers and subscribers. Fully decoupled."   │
 *   │  Example: EventEmitter, Redux, message queues                           │
 *   │                                                                         │
 *   │  STRATEGY                                                               │
 *   │  "Swap algorithms at runtime. Same interface, different implementations.│
 *   │  Example: Array.sort(compareFn), payment methods, shipping calculators  │
 *   │                                                                         │
 *   │  MEDIATOR                                                               │
 *   │  "Central hub coordinates communication. Objects don't talk directly."  │
 *   │  Example: Chat room, Redux store, form validation coordinator           │
 *   │                                                                         │
 *   └─────────────────────────────────────────────────────────────────────────┘
 *
 */


// ═══════════════════════════════════════════════════════════════════════════
// CODE SNIPPETS (One-liners to remember)
// ═══════════════════════════════════════════════════════════════════════════

console.log('=== Design Patterns Cheat Sheet ===\n');

// SINGLETON
const Singleton = (() => {
  let instance;
  return { getInstance: () => instance || (instance = { id: Date.now() }) };
})();

console.log('SINGLETON: Same instance?', Singleton.getInstance() === Singleton.getInstance());


// FACTORY
const Factory = {
  create(type) {
    return type === 'admin' ? { role: 'admin', perms: ['all'] } : { role: 'user', perms: ['read'] };
  }
};

console.log('FACTORY:', Factory.create('admin'));


// MODULE
const Module = (() => {
  let private_var = 0;
  return {
    increment: () => ++private_var,
    get: () => private_var
  };
})();

console.log('MODULE:', Module.increment(), Module.increment(), Module.get());


// OBSERVER
class Observable {
  constructor() { this.observers = []; }
  subscribe(fn) { this.observers.push(fn); }
  notify(data) { this.observers.forEach(fn => fn(data)); }
}

const obs = new Observable();
obs.subscribe(d => console.log('OBSERVER received:', d));
obs.notify('Hello');


// DECORATOR
const withLog = fn => (...args) => { console.log('DECORATOR: calling...'); return fn(...args); };
const add = (a, b) => a + b;
console.log('DECORATOR result:', withLog(add)(2, 3));


// STRATEGY
const strategies = { add: (a, b) => a + b, mult: (a, b) => a * b };
const execute = (strategy, a, b) => strategies[strategy](a, b);
console.log('STRATEGY:', execute('add', 5, 3), execute('mult', 5, 3));


// FACADE
const Facade = {
  doEverything() {
    // Coordinates subsystem1, subsystem2, subsystem3...
    return 'All done!';
  }
};
console.log('FACADE:', Facade.doEverything());


// ═══════════════════════════════════════════════════════════════════════════
// WHEN TO USE WHICH?
// ═══════════════════════════════════════════════════════════════════════════

/**
 *
 *   ┌────────────────────┬────────────────────────────────────────────────────┐
 *   │ NEED               │ USE                                                │
 *   ├────────────────────┼────────────────────────────────────────────────────┤
 *   │ One instance only  │ Singleton                                          │
 *   │ Create many types  │ Factory                                            │
 *   │ Clone objects      │ Prototype                                          │
 *   │ Hide privates      │ Module                                             │
 *   │ Add behavior       │ Decorator                                          │
 *   │ Simplify complex   │ Facade                                             │
 *   │ React to changes   │ Observer                                           │
 *   │ Decouple events    │ Pub/Sub                                            │
 *   │ Swap algorithms    │ Strategy                                           │
 *   │ Central control    │ Mediator                                           │
 *   └────────────────────┴────────────────────────────────────────────────────┘
 *
 */


// ═══════════════════════════════════════════════════════════════════════════
// COMMON INTERVIEW QUESTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 *
 *   Q: "What design patterns have you used?"
 *   A: "Observer for event handling, Factory for object creation,
 *       Module for encapsulation, Decorator for adding logging/caching."
 *
 *
 *   Q: "Difference between Observer and Pub/Sub?"
 *   A: "Observer: subject directly knows observers.
 *       Pub/Sub: event channel in middle, fully decoupled."
 *
 *
 *   Q: "What's the Module pattern?"
 *   A: "IIFE with closure. Private variables inside, return public interface."
 *
 *
 *   Q: "When would you use Factory over direct instantiation?"
 *   A: "When creation logic is complex, when type is determined at runtime,
 *       or when I want to centralize and hide creation details."
 *
 *
 *   Q: "How is Singleton different from just a global variable?"
 *   A: "Singleton controls instantiation - ensures only one exists.
 *       Global variable doesn't prevent multiple instances."
 *
 *
 *   Q: "Real-world Decorator example?"
 *   A: "Express middleware, React HOCs like withRouter, retry/timeout wrappers."
 *
 */


console.log('\n=== Review individual pattern files for details ===');


// RUN: node docs/25-design-patterns/11-interview-cheatsheet.js
