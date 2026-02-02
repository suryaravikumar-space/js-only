/**
 * CHALLENGE 06: Shadowing Properties
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ When you SET a property, it's always set on the object itself.             ║
 * ║ This can SHADOW (hide) a property with the same name on the prototype.     ║
 * ║                                                                            ║
 * ║   Reading: Travels up the prototype chain                                  ║
 * ║   Writing: Always sets on the object itself                                ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

var proto = {
  value: 100,
  getValue: function() {
    return this.value;
  }
};

var obj = Object.create(proto);

console.log('A:', obj.value);
console.log('B:', obj.getValue());

obj.value = 200;

console.log('C:', obj.value);
console.log('D:', proto.value);
console.log('E:', obj.hasOwnProperty('value'));

/**
 * OUTPUT:
 *   A: 100
 *   B: 100
 *   C: 200
 *   D: 100
 *   E: true
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ BEFORE obj.value = 200:                                                    ║
 * ║ ────────────────────────                                                   ║
 * ║   obj = {}  (no own properties)                                            ║
 * ║   obj.__proto__ = proto                                                    ║
 * ║                                                                            ║
 * ║ A: obj.value                                                               ║
 * ║ ────────────                                                               ║
 * ║   • Check obj → not found                                                  ║
 * ║   • Check proto → found value: 100                                         ║
 * ║   • Returns 100                                                            ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ B: obj.getValue()                                                          ║
 * ║ ─────────────────                                                          ║
 * ║   • getValue found on proto                                                ║
 * ║   • this = obj                                                             ║
 * ║   • this.value → 100 (from proto)                                          ║
 * ║   • Returns 100                                                            ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ AFTER obj.value = 200:                                                     ║
 * ║ ───────────────────────                                                    ║
 * ║   obj = { value: 200 }  (now has own property!)                            ║
 * ║   obj.__proto__ = proto (unchanged)                                        ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ C: obj.value                                                               ║
 * ║ ────────────                                                               ║
 * ║   • Check obj → found value: 200                                           ║
 * ║   • Returns 200 (own property SHADOWS prototype's)                         ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ D: proto.value                                                             ║
 * ║ ──────────────                                                             ║
 * ║   • Directly accessing proto                                               ║
 * ║   • proto.value is still 100 (unchanged!)                                  ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ E: obj.hasOwnProperty('value')                                             ║
 * ║ ──────────────────────────────                                             ║
 * ║   • After assignment, obj has its own 'value'                              ║
 * ║   • Returns true                                                           ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: Property Shadowing                                                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   BEFORE obj.value = 200:                                                   │
 * │                                                                             │
 * │   ┌───────────────────┐                                                     │
 * │   │  obj              │       obj.value lookup:                             │
 * │   │  (empty)          │       1. Check obj → not found                      │
 * │   │  __proto__ ───────┼─┐     2. Check proto → found 100                    │
 * │   └───────────────────┘ │                                                   │
 * │                         ▼                                                   │
 * │   ┌───────────────────┐                                                     │
 * │   │  proto            │                                                     │
 * │   │  value: 100 ◄─────┼──── Returns 100                                     │
 * │   └───────────────────┘                                                     │
 * │                                                                             │
 * │                                                                             │
 * │   AFTER obj.value = 200:                                                    │
 * │                                                                             │
 * │   ┌───────────────────┐                                                     │
 * │   │  obj              │       obj.value lookup:                             │
 * │   │  value: 200 ◄─────┼────── 1. Check obj → found 200 (SHADOWS)            │
 * │   │  __proto__ ───────┼─┐                                                   │
 * │   └───────────────────┘ │                                                   │
 * │                         ▼                                                   │
 * │   ┌───────────────────┐                                                     │
 * │   │  proto            │                                                     │
 * │   │  value: 100       │  ← Still 100! Never reached in lookup.              │
 * │   └───────────────────┘                                                     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ IMPORTANT IMPLICATIONS                                                      │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. PROTOTYPE IS UNCHANGED                                                   │
 * │    obj.value = 200 does NOT modify proto.value                              │
 * │    Other objects inheriting from proto still see 100                        │
 * │                                                                             │
 * │ 2. METHODS STILL WORK                                                       │
 * │    obj.getValue() would now return 200                                      │
 * │    Because this.value finds obj's own value first                           │
 * │                                                                             │
 * │ 3. DELETE REVEALS PROTOTYPE                                                 │
 * │    delete obj.value;                                                        │
 * │    obj.value;  // Back to 100 (proto's value)                               │
 * │                                                                             │
 * │ 4. SHARED VS INSTANCE STATE                                                 │
 * │    Prototype: Shared state/methods (same for all instances)                 │
 * │    Own properties: Instance state (different per object)                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Property shadowing occurs when an object has its own property with         │
 * │  the same name as a property on its prototype. Reading and writing          │
 * │  behave differently:                                                        │
 * │                                                                             │
 * │  Reading: JavaScript looks up the prototype chain until it finds            │
 * │  the property. Before shadowing, obj.value found 100 on proto.              │
 * │                                                                             │
 * │  Writing: Always creates/updates a property on the object itself.           │
 * │  obj.value = 200 creates a new property on obj, it doesn't modify proto.    │
 * │                                                                             │
 * │  After shadowing, obj.value returns 200 (own property), but proto.value     │
 * │  is still 100. The prototype property is hidden, not changed.               │
 * │                                                                             │
 * │  This is important for understanding how instances can have their           │
 * │  own values while sharing a prototype with default values or methods."      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/03-prototypes/06-shadowing-properties.js
 */
