/**
 * CHALLENGE 07: Object.preventExtensions()
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Object.preventExtensions(obj) prevents new properties from being added.    ║
 * ║ It's the WEAKEST form of object protection.                                ║
 * ║                                                                            ║
 * ║   - Cannot ADD new properties                                              ║
 * ║   - CAN DELETE existing properties                                         ║
 * ║   - CAN MODIFY existing property values                                    ║
 * ║   - CAN reconfigure existing properties                                    ║
 * ║                                                                            ║
 * ║   Hierarchy: preventExtensions < seal < freeze                             ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

var obj = Object.preventExtensions({ x: 1, y: 2 });
obj.x = 100;         // Can we modify?
obj.z = 3;           // Can we add?
delete obj.y;        // Can we delete?
console.log('A:', obj);

console.log('B:', Object.isExtensible(obj));
console.log('B2:', Object.isExtensible({ a: 1 }));

// Chain of restrictions
var regular = { a: 1 };
console.log('C1:', Object.isExtensible(regular), Object.isSealed(regular), Object.isFrozen(regular));

Object.preventExtensions(regular);
console.log('C2:', Object.isExtensible(regular), Object.isSealed(regular), Object.isFrozen(regular));

// Can we make non-extensible object sealed/frozen?
var nonExt = Object.preventExtensions({ val: 1 });
Object.defineProperty(nonExt, 'val', { configurable: false });
console.log('D:', Object.isSealed(nonExt));

// Prototype chain still works
var proto = { inherited: 'yes' };
var child = Object.preventExtensions(Object.create(proto));
console.log('E:', child.inherited);

/**
 * OUTPUT:
 *   A: { x: 100 }
 *   B: false
 *   B2: true
 *   C1: true false false
 *   C2: false false false
 *   D: true
 *   E: yes
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: preventExtensions operations                                            ║
 * ║ ──────────────────────────────                                             ║
 * ║   obj.x = 100     → WORKS! x is now 100                                    ║
 * ║   obj.z = 3       → Fails silently, no 'z' added                           ║
 * ║   delete obj.y    → WORKS! y is deleted                                    ║
 * ║   Result: { x: 100 }                                                       ║
 * ║                                                                            ║
 * ║ B: Object.isExtensible()                                                   ║
 * ║ ────────────────────────                                                   ║
 * ║   Non-extensible object → false                                            ║
 * ║   Regular object → true                                                    ║
 * ║                                                                            ║
 * ║ C: All three checks                                                        ║
 * ║ ──────────────────                                                         ║
 * ║   Regular object: extensible=true, sealed=false, frozen=false              ║
 * ║   After preventExtensions: extensible=false, sealed=false, frozen=false    ║
 * ║   (Still not sealed because properties are still configurable)             ║
 * ║                                                                            ║
 * ║ D: Making non-extensible object sealed                                     ║
 * ║ ─────────────────────────────────────                                      ║
 * ║   preventExtensions + all properties non-configurable = sealed             ║
 * ║   After defineProperty with configurable:false, isSealed returns true      ║
 * ║                                                                            ║
 * ║ E: Prototype inheritance still works                                       ║
 * ║ ────────────────────────────────────                                       ║
 * ║   preventExtensions only affects OWN properties                            ║
 * ║   Inherited properties from prototype are still accessible                 ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ HIERARCHY OF OBJECT PROTECTION                                              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌─────────────────────────────────────────────────────────────────────┐   │
 * │   │                     FROZEN (most restrictive)                       │   │
 * │   │  ┌───────────────────────────────────────────────────────────────┐  │   │
 * │   │  │                         SEALED                                │  │   │
 * │   │  │  ┌─────────────────────────────────────────────────────────┐  │  │   │
 * │   │  │  │               PREVENT EXTENSIONS                        │  │  │   │
 * │   │  │  │                                                         │  │  │   │
 * │   │  │  │  Add: NO     Delete: YES    Modify: YES    Config: YES  │  │  │   │
 * │   │  │  └─────────────────────────────────────────────────────────┘  │  │   │
 * │   │  │                                                               │  │   │
 * │   │  │  Add: NO     Delete: NO     Modify: YES    Config: NO        │  │   │
 * │   │  └───────────────────────────────────────────────────────────────┘  │   │
 * │   │                                                                     │   │
 * │   │  Add: NO     Delete: NO     Modify: NO     Config: NO               │   │
 * │   └─────────────────────────────────────────────────────────────────────┘   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ COMPARISON TABLE                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌──────────────────────┬────────────────┬────────┬────────┐               │
 * │   │ Method               │ preventExt     │ seal   │ freeze │               │
 * │   ├──────────────────────┼────────────────┼────────┼────────┤               │
 * │   │ Add properties       │      No        │   No   │   No   │               │
 * │   │ Delete properties    │     YES        │   No   │   No   │               │
 * │   │ Modify values        │     YES        │  YES   │   No   │               │
 * │   │ Reconfigure          │     YES        │   No   │   No   │               │
 * │   │ isExtensible         │     false      │ false  │ false  │               │
 * │   │ isSealed             │     false*     │  true  │  true  │               │
 * │   │ isFrozen             │     false*     │ false* │  true  │               │
 * │   └──────────────────────┴────────────────┴────────┴────────┘               │
 * │                                                                             │
 * │   * Can become true if properties are manually made non-configurable        │
 * │     or non-writable                                                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Object.preventExtensions() is the weakest form of object protection.      │
 * │  It only prevents adding new properties. You can still:                     │
 * │  - Modify existing property values                                          │
 * │  - Delete existing properties                                               │
 * │  - Reconfigure property descriptors                                         │
 * │                                                                             │
 * │  The hierarchy from weakest to strongest is:                                │
 * │  preventExtensions < seal < freeze                                          │
 * │                                                                             │
 * │  Object.isExtensible() checks if new properties can be added.               │
 * │  All objects start as extensible (true).                                    │
 * │  After preventExtensions/seal/freeze, it returns false.                     │
 * │                                                                             │
 * │  Important: None of these methods affect the prototype chain.               │
 * │  Inherited properties are still accessible and modifiable                   │
 * │  (unless the prototype itself is protected)."                               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/06-object-methods/07-object-preventextensions.js
 */
