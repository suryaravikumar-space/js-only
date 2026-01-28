/**
 * PROXY & REFLECT: 05 - Interview Questions & Answers
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ COMPLETE INTERVIEW GUIDE - Proxy & Reflect                                ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Everything you need to know about Proxy and Reflect for interviews         ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// Q1: What is a Proxy in JavaScript?
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q1: What is a Proxy in JavaScript?                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ANSWER:                                                                     │
 * │                                                                             │
 * │ A Proxy is an object that wraps another object (target) and intercepts      │
 * │ fundamental operations like property access, assignment, enumeration,       │
 * │ function invocation, etc.                                                   │
 * │                                                                             │
 * │ SYNTAX:                                                                     │
 * │   const proxy = new Proxy(target, handler);                                 │
 * │                                                                             │
 * │ TERMINOLOGY:                                                                │
 * │ • target: The original object being proxied                                 │
 * │ • handler: Object containing trap methods                                   │
 * │ • trap: Method in handler that intercepts an operation                      │
 * │                                                                             │
 * │ VISUAL:                                                                     │
 * │                                                                             │
 * │   Your Code ────► Proxy ────► Target Object                                 │
 * │                     │                                                       │
 * │                     ▼                                                       │
 * │                  Handler                                                    │
 * │               (trap methods)                                                │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('=== Q1: Basic Proxy Example ===\n');

const user = { name: 'Alice', age: 30 };

const userProxy = new Proxy(user, {
  get(target, property) {
    console.log(`  Getting "${property}"`);
    return target[property];
  },
  set(target, property, value) {
    console.log(`  Setting "${property}" to "${value}"`);
    target[property] = value;
    return true;
  }
});

userProxy.name;       // Logged: Getting "name"
userProxy.age = 31;   // Logged: Setting "age" to "31"


// ═══════════════════════════════════════════════════════════════════════════════
// Q2: What are the common Proxy traps?
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q2: What are the common Proxy traps?                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ANSWER:                                                                     │
 * │                                                                             │
 * │ There are 13 traps total. Most commonly used:                               │
 * │                                                                             │
 * │ ┌────────────────────┬─────────────────────────────────────────────────┐    │
 * │ │ Trap               │ Intercepts                                      │    │
 * │ ├────────────────────┼─────────────────────────────────────────────────┤    │
 * │ │ get                │ obj.prop, obj[prop]                             │    │
 * │ │ set                │ obj.prop = value                                │    │
 * │ │ has                │ prop in obj                                     │    │
 * │ │ deleteProperty     │ delete obj.prop                                 │    │
 * │ │ ownKeys            │ Object.keys(), for...in                         │    │
 * │ │ apply              │ fn(), fn.call(), fn.apply()                     │    │
 * │ │ construct          │ new Fn()                                        │    │
 * │ └────────────────────┴─────────────────────────────────────────────────┘    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// Q3: What is Reflect and why use it?
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q3: What is Reflect and why use it?                                         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ANSWER:                                                                     │
 * │                                                                             │
 * │ Reflect is a built-in object providing methods for JavaScript operations.   │
 * │ Every Proxy trap has a corresponding Reflect method.                        │
 * │                                                                             │
 * │ WHY USE REFLECT:                                                            │
 * │                                                                             │
 * │ 1. PERFORMS DEFAULT BEHAVIOR in traps                                       │
 * │    → Use Reflect.get() instead of target[prop]                              │
 * │                                                                             │
 * │ 2. HANDLES RECEIVERS correctly for getters/setters                          │
 * │    → target[prop] doesn't pass receiver                                     │
 * │    → Reflect.get(target, prop, receiver) does                               │
 * │                                                                             │
 * │ 3. RETURNS BOOLEANS instead of throwing                                     │
 * │    → Object.defineProperty throws on failure                                │
 * │    → Reflect.defineProperty returns false                                   │
 * │                                                                             │
 * │ 4. CONSISTENT API for all object operations                                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('\n=== Q3: Reflect in Proxy Trap ===\n');

const obj = {
  _value: 10,
  get value() {
    return this._value;
  }
};

const proxy = new Proxy(obj, {
  get(target, property, receiver) {
    console.log(`  Intercepted: ${property}`);
    // Always use Reflect for correct behavior with getters!
    return Reflect.get(target, property, receiver);
  }
});

console.log('  Result:', proxy.value);


// ═══════════════════════════════════════════════════════════════════════════════
// Q4: What are practical use cases for Proxy?
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q4: What are practical use cases for Proxy?                                 │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ANSWER:                                                                     │
 * │                                                                             │
 * │ 1. VALIDATION                                                               │
 * │    Validate data before allowing it to be set                               │
 * │                                                                             │
 * │ 2. REACTIVE/OBSERVABLE OBJECTS                                              │
 * │    Notify subscribers when properties change                                │
 * │    (Foundation of Vue.js reactivity!)                                       │
 * │                                                                             │
 * │ 3. DEFAULT VALUES                                                           │
 * │    Return defaults for non-existent properties                              │
 * │                                                                             │
 * │ 4. ACCESS CONTROL                                                           │
 * │    Hide private properties, enforce read-only                               │
 * │                                                                             │
 * │ 5. LOGGING/DEBUGGING                                                        │
 * │    Track all property access and modifications                              │
 * │                                                                             │
 * │ 6. CACHING                                                                  │
 * │    Cache expensive computed properties                                      │
 * │                                                                             │
 * │ 7. NEGATIVE ARRAY INDICES                                                   │
 * │    arr[-1] returns last element                                             │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('\n=== Q4: Validation Example ===\n');

const person = new Proxy({}, {
  set(target, property, value) {
    if (property === 'age') {
      if (typeof value !== 'number' || value < 0 || value > 150) {
        throw new Error('Invalid age');
      }
    }
    target[property] = value;
    return true;
  }
});

person.name = 'Bob';
person.age = 25;
console.log('  Valid person:', person);

try {
  person.age = -5;
} catch (e) {
  console.log('  Error:', e.message);
}


// ═══════════════════════════════════════════════════════════════════════════════
// Q5: What is Proxy.revocable()?
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q5: What is Proxy.revocable()?                                              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ANSWER:                                                                     │
 * │                                                                             │
 * │ Creates a proxy that can be permanently disabled.                           │
 * │                                                                             │
 * │ SYNTAX:                                                                     │
 * │   const { proxy, revoke } = Proxy.revocable(target, handler);               │
 * │                                                                             │
 * │ After revoke() is called:                                                   │
 * │ • Any operation on proxy throws TypeError                                   │
 * │ • The proxy is permanently unusable                                         │
 * │ • Helps with garbage collection (detaches target)                           │
 * │                                                                             │
 * │ USE CASES:                                                                  │
 * │ • Temporary access to sensitive data                                        │
 * │ • Time-limited API access                                                   │
 * │ • Session management                                                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('\n=== Q5: Revocable Proxy ===\n');

const { proxy: tempProxy, revoke } = Proxy.revocable(
  { secret: 'data' },
  {}
);

console.log('  Before revoke:', tempProxy.secret);
revoke();
try {
  console.log(tempProxy.secret);
} catch (e) {
  console.log('  After revoke:', e.message);
}


// ═══════════════════════════════════════════════════════════════════════════════
// Q6: What are Proxy invariants?
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q6: What are Proxy invariants?                                              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ANSWER:                                                                     │
 * │                                                                             │
 * │ Invariants are rules that Proxy traps MUST follow. They ensure              │
 * │ JavaScript semantics remain consistent.                                     │
 * │                                                                             │
 * │ EXAMPLES:                                                                   │
 * │                                                                             │
 * │ • get: If property is non-writable & non-configurable,                      │
 * │   must return actual value                                                  │
 * │                                                                             │
 * │ • has: Can't return false for non-configurable properties                   │
 * │                                                                             │
 * │ • deleteProperty: Can't return true for non-configurable properties         │
 * │                                                                             │
 * │ • ownKeys: Must include all non-configurable properties                     │
 * │                                                                             │
 * │ If a trap violates an invariant, JavaScript throws TypeError.               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// CHEAT SHEET
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║                   PROXY & REFLECT INTERVIEW CHEAT SHEET                   ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║  PROXY BASICS:                                                             ║
 * ║  ──────────────────────────────────────────────────────────────────        ║
 * ║  const proxy = new Proxy(target, handler);                                 ║
 * ║  • target: Object to wrap                                                  ║
 * ║  • handler: Object with trap methods                                       ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║  COMMON TRAPS:                                                             ║
 * ║  ──────────────────────────────────────────────────────────────────        ║
 * ║  get(target, prop, receiver)      → prop access                            ║
 * ║  set(target, prop, value, receiver) → prop assignment (return bool)        ║
 * ║  has(target, prop)                → "in" operator (return bool)            ║
 * ║  deleteProperty(target, prop)     → "delete" operator (return bool)        ║
 * ║  ownKeys(target)                  → Object.keys, for...in                  ║
 * ║  apply(target, thisArg, args)     → function calls                         ║
 * ║  construct(target, args)          → "new" operator                         ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║  REFLECT:                                                                  ║
 * ║  ──────────────────────────────────────────────────────────────────        ║
 * ║  • One method per Proxy trap (same signatures)                             ║
 * ║  • Performs default operation                                              ║
 * ║  • Returns boolean instead of throwing                                     ║
 * ║  • Always use in traps: return Reflect.get(target, prop, receiver)         ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║  REVOCABLE PROXY:                                                          ║
 * ║  ──────────────────────────────────────────────────────────────────        ║
 * ║  const { proxy, revoke } = Proxy.revocable(target, handler);               ║
 * ║  revoke();  // Proxy now throws on any operation                           ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║  USE CASES:                                                                ║
 * ║  ──────────────────────────────────────────────────────────────────        ║
 * ║  • Validation (type checking, range validation)                            ║
 * ║  • Observable/Reactive objects (Vue.js uses this!)                         ║
 * ║  • Default values for missing properties                                   ║
 * ║  • Access control (private properties, read-only)                          ║
 * ║  • Logging/debugging                                                       ║
 * ║  • Caching computed properties                                             ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║  INVARIANTS:                                                               ║
 * ║  ──────────────────────────────────────────────────────────────────        ║
 * ║  • Can't lie about frozen/non-configurable properties                      ║
 * ║  • Must return actual value for non-writable properties                    ║
 * ║  • Violations throw TypeError                                              ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║  PERFORMANCE:                                                              ║
 * ║  ──────────────────────────────────────────────────────────────────        ║
 * ║  • Adds function call overhead                                             ║
 * ║  • Avoid in hot paths (millions of operations)                             ║
 * ║  • Can't be polyfilled for IE11                                            ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * RUN: node docs/23-proxy-reflect/05-interview-qa.js
 */

console.log('\n=== Proxy & Reflect Interview Q&A ===');
console.log('Review the detailed answers in the comments above');
