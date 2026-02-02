/**
 * TOPIC 04: Circular Dependencies
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Circular dependency: A requires B, B requires A                           ║
 * ║                                                                            ║
 * ║ Node handles this by returning a PARTIAL (incomplete) export:             ║
 * ║                                                                            ║
 * ║   A starts loading → requires B                                           ║
 * ║   B starts loading → requires A → gets A's PARTIAL exports (so far)      ║
 * ║   B finishes loading                                                      ║
 * ║   A finishes loading                                                      ║
 * ║                                                                            ║
 * ║ Result: B sees only what A exported BEFORE requiring B.                   ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  Circular dependency is like TWO FRIENDS writing letters:                  │
 * │                                                                             │
 * │  Alice starts writing a letter to Bob:                                     │
 * │    - "Dear Bob, I'm Alice. Let me ask Bob something..."                   │
 * │    - Alice sends the HALF-WRITTEN letter to Bob                           │
 * │                                                                             │
 * │  Bob gets Alice's half-written letter:                                     │
 * │    - Reads it: "I'm Alice" (that's all he sees - the rest isn't written)  │
 * │    - Bob writes HIS full letter and sends it back                         │
 * │                                                                             │
 * │  Alice gets Bob's COMPLETE letter:                                         │
 * │    - Now finishes her own letter with all the info                        │
 * │                                                                             │
 * │  Result: Bob only saw Alice's PARTIAL letter (what was written so far).   │
 * │  Alice saw Bob's FULL letter.                                              │
 * │                                                                             │
 * │  "Whoever asks first gets an incomplete answer."                          │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM                                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌────── a.js ──────────────────┐                                         │
 * │   │ 1. exports.x = 'hello'      │  ← exported BEFORE require(b)          │
 * │   │ 2. const b = require('./b') ─────→ ┌────── b.js ─────────────┐       │
 * │   │ 3. exports.y = 'world'      │      │ const a = require('./a')│       │
 * │   │    (b never sees this!)      │      │ // a = { x: 'hello' }  │       │
 * │   └──────────────────────────────┘      │ // a.y is UNDEFINED!   │       │
 * │                                          │ exports.z = 'from b'   │       │
 * │                                          └────────────────────────┘       │
 * │                                                                             │
 * │   Timeline:                                                                 │
 * │   ═══════                                                                   │
 * │   a starts → a.x = 'hello' → a requires b → b starts →                   │
 * │   b requires a (gets {x:'hello'}) → b finishes → a gets b →              │
 * │   a.y = 'world' → a finishes                                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Simulating circular dependency behavior
const moduleA = { exports: {} };
const moduleB = { exports: {} };

// Step 1: A starts, exports 'early' before requiring B
moduleA.exports.early = 'I was set before requiring B';

// Step 2: B requires A - gets only what's exported SO FAR
const aFromB = { ...moduleA.exports }; // snapshot of A's partial exports
moduleB.exports.fromA = aFromB;
moduleB.exports.own = 'B is complete';

// Step 3: A continues, adds more exports AFTER requiring B
moduleA.exports.late = 'I was set after requiring B';

console.log('A:', 'What B sees of A:', moduleB.exports.fromA);
// Only { early: '...' } - NOT { early: '...', late: '...' }

console.log('B:', 'A eventually has:', moduleA.exports);
// { early: '...', late: '...' }

// How to avoid circular dependencies
console.log('C:', 'Solutions:');
console.log('   1. Restructure code to remove the cycle');
console.log('   2. Move shared logic to a third module');
console.log('   3. Use lazy require() inside functions');
console.log('   4. Use dependency injection');

// Lazy require pattern
const getLazyModule = () => {
  // require() inside function = loaded only when called
  return require('path');
};
console.log('D:', getLazyModule().sep);

/**
 * OUTPUT:
 *   A: What B sees of A: { early: 'I was set before requiring B' }
 *   B: A eventually has: { early: 'I was set before requiring B', late: 'I was set after requiring B' }
 *   C: Solutions:
 *      1. Restructure code to remove the cycle
 *      2. Move shared logic to a third module
 *      3. Use lazy require() inside functions
 *      4. Use dependency injection
 *   D: /
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ CIRCULAR DEPENDENCY DIAGRAM                                               ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║   ┌──── a.js ────┐     ┌──── b.js ────┐                                  ║
 * ║   │ exports.x = 1│     │              │                                   ║
 * ║   │ require(b) ──────→ │ require(a) ──── gets {x:1} (partial!)           ║
 * ║   │ exports.y = 2│     │ exports.z = 3│                                   ║
 * ║   └──────────────┘     └──────────────┘                                   ║
 * ║                                                                            ║
 * ║   b.js sees a = { x: 1 }        (missing y!)                             ║
 * ║   a.js sees b = { z: 3 }        (complete)                               ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "When A requires B and B requires A, Node returns A's partially loaded    │
 * │  exports to B - only what was exported before the require(B) call.        │
 * │  This prevents infinite loops but can cause bugs with undefined values.   │
 * │  Solutions: restructure to eliminate cycles, extract shared code to a     │
 * │  third module, use lazy require() inside functions, or use dependency     │
 * │  injection."                                                               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/01-modules-system/04-circular-dependencies.js
 */
