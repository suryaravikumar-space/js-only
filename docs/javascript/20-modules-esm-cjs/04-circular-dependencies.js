/**
 * MODULES: 04 - Circular Dependencies
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ CIRCULAR DEPENDENCIES                                                      ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ When module A imports B, and B imports A.                                  ║
 * ║ Both CJS and ESM handle this, but DIFFERENTLY!                             ║
 * ║                                                                            ║
 * ║ Common in: Event emitters, state management, plugin systems                ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// WHAT IS A CIRCULAR DEPENDENCY?
// ═══════════════════════════════════════════════════════════════════════════════

console.log('=== What is a Circular Dependency? ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ CIRCULAR DEPENDENCY DIAGRAM                                                 │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   SIMPLE CYCLE:                                                             │
 * │                                                                             │
 * │   ┌─────────┐                    ┌─────────┐                                │
 * │   │    A    │ ──── imports ────► │    B    │                                │
 * │   └─────────┘                    └─────────┘                                │
 * │        ▲                              │                                     │
 * │        │                              │                                     │
 * │        └────────── imports ───────────┘                                     │
 * │                                                                             │
 * │                                                                             │
 * │   COMPLEX CYCLE:                                                            │
 * │                                                                             │
 * │   ┌─────────┐     ┌─────────┐     ┌─────────┐                               │
 * │   │    A    │ ──► │    B    │ ──► │    C    │                               │
 * │   └─────────┘     └─────────┘     └─────────┘                               │
 * │        ▲                              │                                     │
 * │        └──────────────────────────────┘                                     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('A: Circular dependency: A imports B, B imports A');


// ═══════════════════════════════════════════════════════════════════════════════
// COMMONJS BEHAVIOR
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== CommonJS: Partial Exports ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ CJS CIRCULAR DEPENDENCY BEHAVIOR                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // a.js                                                                   │
 * │   console.log('a: start');                                                  │
 * │   exports.done = false;                                                     │
 * │   const b = require('./b');          // ◄─── Goes to b.js                   │
 * │   console.log('a: b.done =', b.done);                                       │
 * │   exports.done = true;                                                      │
 * │   console.log('a: done');                                                   │
 * │                                                                             │
 * │   // b.js                                                                   │
 * │   console.log('b: start');                                                  │
 * │   exports.done = false;                                                     │
 * │   const a = require('./a');          // ◄─── Gets PARTIAL a.exports!        │
 * │   console.log('b: a.done =', a.done); // false (a not finished yet)         │
 * │   exports.done = true;                                                      │
 * │   console.log('b: done');                                                   │
 * │                                                                             │
 * │   // Running: node a.js                                                     │
 * │   OUTPUT:                                                                   │
 * │   a: start                                                                  │
 * │   b: start                                                                  │
 * │   b: a.done = false     ◄─── Gets incomplete a.exports!                     │
 * │   b: done                                                                   │
 * │   a: b.done = true                                                          │
 * │   a: done                                                                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Simulating CJS circular dependency behavior
function simulateCJSCircular() {
  const modules = {};
  const cache = {};

  // Module A
  modules['a'] = function(module, exports, require) {
    console.log('  a: start');
    exports.done = false;
    const b = require('b');
    console.log('  a: b.done =', b.done);
    exports.done = true;
    console.log('  a: done');
  };

  // Module B
  modules['b'] = function(module, exports, require) {
    console.log('  b: start');
    exports.done = false;
    const a = require('a');
    console.log('  b: a.done =', a.done);  // false! (partial)
    exports.done = true;
    console.log('  b: done');
  };

  // Require function
  function require(name) {
    if (cache[name]) return cache[name].exports;

    const module = { exports: {} };
    cache[name] = module;

    modules[name](module, module.exports, require);

    return module.exports;
  }

  require('a');
}

console.log('B: CJS Simulation:');
simulateCJSCircular();


// ═══════════════════════════════════════════════════════════════════════════════
// ES MODULES BEHAVIOR
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== ES Modules: Live Bindings ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ ESM CIRCULAR DEPENDENCY BEHAVIOR                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ESM handles circular deps better because of LIVE BINDINGS!                │
 * │                                                                             │
 * │   // a.mjs                                                                  │
 * │   import { bDone } from './b.mjs';                                          │
 * │   export let aDone = false;                                                 │
 * │   console.log('a: bDone =', bDone);  // Initially false                     │
 * │   aDone = true;                                                             │
 * │                                                                             │
 * │   // b.mjs                                                                  │
 * │   import { aDone } from './a.mjs';                                          │
 * │   export let bDone = false;                                                 │
 * │   console.log('b: aDone =', aDone);  // Live binding!                       │
 * │   bDone = true;                                                             │
 * │                                                                             │
 * │                                                                             │
 * │   KEY DIFFERENCE:                                                           │
 * │   ┌─────────────────────────────────────────────────────────────────────┐   │
 * │   │                                                                     │   │
 * │   │   CJS: Gets COPY of exports at time of require()                    │   │
 * │   │        → If module not finished, you get partial/incomplete data    │   │
 * │   │                                                                     │   │
 * │   │   ESM: Gets LIVE BINDING to export                                  │   │
 * │   │        → Always sees current value, even if set later               │   │
 * │   │                                                                     │   │
 * │   └─────────────────────────────────────────────────────────────────────┘   │
 * │                                                                             │
 * │   ⚠️ BUT: Accessing export before initialization → ReferenceError!         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('C: ESM uses live bindings - see detailed explanation in comments');


// ═══════════════════════════════════════════════════════════════════════════════
// TIMELINE COMPARISON
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Timeline Comparison ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ EXECUTION TIMELINE                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   COMMONJS:                                                                 │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   Time ─────────────────────────────────────────────────────────────►       │
 * │                                                                             │
 * │   │ Start A │ require B │ Start B │ require A │ B gets partial A │          │
 * │   ├─────────┼───────────┼─────────┼───────────┼──────────────────┼──►       │
 * │   │         │           │         │           │  Finish B        │          │
 * │   │         │           │         │           │  Finish A        │          │
 * │                                                                             │
 * │   Problem: B gets A's exports BEFORE A has finished setting them!           │
 * │                                                                             │
 * │                                                                             │
 * │   ES MODULES:                                                               │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   Phase 1: Parse all modules (no execution)                                 │
 * │   Phase 2: Instantiate (set up live bindings)                               │
 * │   Phase 3: Evaluate (execute code)                                          │
 * │                                                                             │
 * │   │ Parse A │ Parse B │ Link │ Eval B │ Eval A │                            │
 * │   ├─────────┼─────────┼──────┼────────┼────────┼────────────────►           │
 * │                                                                             │
 * │   Live bindings are set up BEFORE evaluation!                               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('D: See timeline comparison in comments above');


// ═══════════════════════════════════════════════════════════════════════════════
// REAL-WORLD SCENARIOS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Real-World Circular Dependency Scenarios ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ COMMON CIRCULAR DEPENDENCY PATTERNS                                         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   1. PARENT-CHILD COMPONENTS                                                │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │   // Parent.js                                                              │
 * │   import Child from './Child';                                              │
 * │   export default class Parent { }                                           │
 * │                                                                             │
 * │   // Child.js                                                               │
 * │   import Parent from './Parent';  // Needs Parent for type checking         │
 * │   export default class Child { }                                            │
 * │                                                                             │
 * │                                                                             │
 * │   2. STATE AND ACTIONS                                                      │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │   // store.js                                                               │
 * │   import { actions } from './actions';                                      │
 * │   export const store = { ... };                                             │
 * │                                                                             │
 * │   // actions.js                                                             │
 * │   import { store } from './store';  // Needs store to dispatch              │
 * │   export const actions = { ... };                                           │
 * │                                                                             │
 * │                                                                             │
 * │   3. EVENT SYSTEM                                                           │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │   // eventBus.js                                                            │
 * │   import { handlers } from './handlers';                                    │
 * │   export const eventBus = { ... };                                          │
 * │                                                                             │
 * │   // handlers.js                                                            │
 * │   import { eventBus } from './eventBus';  // Handlers emit events           │
 * │   export const handlers = { ... };                                          │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// SOLUTIONS TO CIRCULAR DEPENDENCIES
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Solutions ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ HOW TO FIX CIRCULAR DEPENDENCIES                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   SOLUTION 1: RESTRUCTURE - Extract shared code                             │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   BEFORE:                        AFTER:                                     │
 * │   A ←──────► B                   A ──────► shared ◄────── B                 │
 * │                                                                             │
 * │   // shared.js (new file)                                                   │
 * │   export const sharedFunction = () => { ... };                              │
 * │                                                                             │
 * │                                                                             │
 * │   SOLUTION 2: DEPENDENCY INJECTION                                          │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   // Instead of importing, pass as parameter                                │
 * │   export function createB(a) {                                              │
 * │     return { doSomething: () => a.method() };                               │
 * │   }                                                                         │
 * │                                                                             │
 * │                                                                             │
 * │   SOLUTION 3: LAZY LOADING                                                  │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   // Don't import at top level                                              │
 * │   export function getB() {                                                  │
 * │     const { b } = require('./b');  // CJS                                   │
 * │     return b;                                                               │
 * │   }                                                                         │
 * │                                                                             │
 * │   // OR with ESM                                                            │
 * │   export async function getB() {                                            │
 * │     const { b } = await import('./b.js');                                   │
 * │     return b;                                                               │
 * │   }                                                                         │
 * │                                                                             │
 * │                                                                             │
 * │   SOLUTION 4: BARREL FILE PATTERN                                           │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   // index.js (barrel)                                                      │
 * │   export { A } from './a';                                                  │
 * │   export { B } from './b';                                                  │
 * │                                                                             │
 * │   // All modules import from barrel                                         │
 * │   import { A, B } from './index';                                           │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Example: Dependency Injection solution
console.log('E: Dependency Injection Example:');

// Bad: circular
// class A { constructor() { this.b = new B(); } }
// class B { constructor() { this.a = new A(); } }

// Good: dependency injection
class ModuleA {
  setB(b) { this.b = b; }
  doSomething() { console.log('  A doing something with B'); }
}

class ModuleB {
  setA(a) { this.a = a; }
  doSomething() { console.log('  B doing something with A'); }
}

const a = new ModuleA();
const b = new ModuleB();
a.setB(b);  // Inject dependency
b.setA(a);  // Inject dependency

a.doSomething();
b.doSomething();


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Circular dependencies occur when module A imports B and B imports A.       │
 * │ Both CJS and ESM handle them, but differently:                              │
 * │                                                                             │
 * │ CommonJS:                                                                   │
 * │ • Returns a PARTIAL exports object when the cycle is detected               │
 * │ • The importing module gets whatever exports were defined up to that point  │
 * │ • This can cause undefined values or missing functions                      │
 * │                                                                             │
 * │ ES Modules:                                                                 │
 * │ • Uses LIVE BINDINGS - imports always reflect the current export value      │
 * │ • Better handling because the binding exists even before value is assigned  │
 * │ • But accessing before initialization causes ReferenceError                 │
 * │                                                                             │
 * │ Solutions:                                                                  │
 * │ 1. Restructure: Extract shared code into a separate module                  │
 * │ 2. Dependency injection: Pass dependencies as parameters                    │
 * │ 3. Lazy loading: Use dynamic import() or require() inside functions         │
 * │ 4. Barrel exports: Use index.js to centralize exports                       │
 * │                                                                             │
 * │ The best approach is usually restructuring to avoid the cycle entirely."    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/20-modules-esm-cjs/04-circular-dependencies.js
 */
