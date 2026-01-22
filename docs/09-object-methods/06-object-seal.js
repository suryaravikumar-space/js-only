/**
 * CHALLENGE 06: Object.seal() and isSealed
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Object.seal(obj) prevents adding/deleting properties, but ALLOWS           ║
 * ║ modifying existing property values.                                        ║
 * ║                                                                            ║
 * ║   - Cannot ADD new properties                                              ║
 * ║   - Cannot DELETE existing properties                                      ║
 * ║   - CAN MODIFY existing property values (unlike freeze!)                   ║
 * ║   - Makes all properties non-configurable                                  ║
 * ║                                                                            ║
 * ║   Think: "The shape is fixed, but values can change"                       ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

var sealed = Object.seal({ name: 'Alice', age: 25 });
sealed.name = 'Bob';        // Can we modify?
sealed.city = 'NYC';        // Can we add?
delete sealed.age;          // Can we delete?
console.log('A:', sealed);

console.log('B:', Object.isSealed(sealed));
console.log('B2:', Object.isSealed({ x: 1 }));

// Sealed vs Frozen
var sealedObj = Object.seal({ x: 1 });
var frozenObj = Object.freeze({ x: 1 });
sealedObj.x = 100;
frozenObj.x = 100;
console.log('C:', sealedObj.x, frozenObj.x);

// Property descriptors after seal
var obj = { value: 42 };
console.log('D before:', Object.getOwnPropertyDescriptor(obj, 'value').configurable);
Object.seal(obj);
console.log('D after:', Object.getOwnPropertyDescriptor(obj, 'value').configurable);

// isSealed on frozen object?
var frozen = Object.freeze({ a: 1 });
console.log('E:', Object.isSealed(frozen));

/**
 * OUTPUT:
 *   A: { name: 'Bob', age: 25 }
 *   B: true
 *   B2: false
 *   C: 100 1
 *   D before: true
 *   D after: false
 *   E: true
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: Sealed object operations                                                ║
 * ║ ───────────────────────────                                                ║
 * ║   sealed.name = 'Bob'   → WORKS! Modified to 'Bob'                         ║
 * ║   sealed.city = 'NYC'   → Fails silently, no 'city' added                  ║
 * ║   delete sealed.age     → Fails silently, 'age' still exists               ║
 * ║   Result: { name: 'Bob', age: 25 }                                         ║
 * ║                                                                            ║
 * ║ B: Object.isSealed()                                                       ║
 * ║ ────────────────────                                                       ║
 * ║   sealed object → true                                                     ║
 * ║   regular object → false                                                   ║
 * ║                                                                            ║
 * ║ C: Sealed vs Frozen key difference                                         ║
 * ║ ──────────────────────────────────                                         ║
 * ║   Sealed: x changed from 1 to 100 (modification allowed)                   ║
 * ║   Frozen: x stays 1 (modification blocked)                                 ║
 * ║   Result: 100 1                                                            ║
 * ║                                                                            ║
 * ║ D: Seal makes properties non-configurable                                  ║
 * ║ ─────────────────────────────────────────                                  ║
 * ║   Before seal: configurable = true                                         ║
 * ║   After seal: configurable = false                                         ║
 * ║   (Can't delete or reconfigure, but CAN still write)                       ║
 * ║                                                                            ║
 * ║ E: Frozen implies sealed                                                   ║
 * ║ ──────────────────────────                                                 ║
 * ║   A frozen object IS also sealed (freeze is stricter)                      ║
 * ║   All frozen objects return true for isSealed()                            ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: seal vs freeze                                                      │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   SEALED:                          FROZEN:                                  │
 * │   ┌─────────────────────┐          ┌─────────────────────┐                  │
 * │   │  { x: 1 }           │          │  { x: 1 }           │                  │
 * │   │                     │          │                     │                  │
 * │   │  x = 2    ✓ Works   │          │  x = 2    ✗ Blocked │                  │
 * │   │  y = 3    ✗ Blocked │          │  y = 3    ✗ Blocked │                  │
 * │   │  delete x ✗ Blocked │          │  delete x ✗ Blocked │                  │
 * │   └─────────────────────┘          └─────────────────────┘                  │
 * │                                                                             │
 * │   Seal: Shape fixed, values changeable                                      │
 * │   Freeze: Everything fixed                                                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHEN TO USE SEAL VS FREEZE                                                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Use SEAL when:                                                            │
 * │   - You want a fixed object shape (no new properties)                       │
 * │   - But values need to be updatable                                         │
 * │   - Example: Configuration objects with known keys                          │
 * │                                                                             │
 * │   Use FREEZE when:                                                          │
 * │   - You want complete immutability                                          │
 * │   - Values should never change                                              │
 * │   - Example: Constants, default values                                      │
 * │                                                                             │
 * │   // Sealed config - values can change                                      │
 * │   const config = Object.seal({                                              │
 * │     theme: 'light',                                                         │
 * │     fontSize: 14                                                            │
 * │   });                                                                       │
 * │   config.theme = 'dark';  // OK                                             │
 * │   config.newProp = true;  // Blocked                                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Object.seal() prevents adding or deleting properties, but unlike freeze,  │
 * │  it ALLOWS modifying existing property values.                              │
 * │                                                                             │
 * │  What seal does:                                                            │
 * │  1. Makes the object non-extensible (can't add properties)                  │
 * │  2. Makes all properties non-configurable (can't delete or reconfigure)     │
 * │  3. Keeps writable properties writable (can still modify values)            │
 * │                                                                             │
 * │  Key relationship:                                                          │
 * │  - Every frozen object is also sealed (isSealed returns true)               │
 * │  - But not every sealed object is frozen                                    │
 * │  - freeze is stricter than seal                                             │
 * │                                                                             │
 * │  Use seal when you want a fixed object shape but need to update values.     │
 * │  Like a form where fields are predefined but values change."                │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/06-object-methods/06-object-seal.js
 */
