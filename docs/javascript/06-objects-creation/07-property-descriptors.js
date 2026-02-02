/**
 * CHALLENGE 07: Property Descriptors with defineProperty
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Every property has a descriptor with these attributes:                     ║
 * ║                                                                            ║
 * ║   writable:     Can the value be changed?                                  ║
 * ║   enumerable:   Does it appear in for...in / Object.keys?                  ║
 * ║   configurable: Can descriptor be changed / property deleted?              ║
 * ║                                                                            ║
 * ║   Object.defineProperty(obj, 'key', { descriptor })                        ║
 * ║                                                                            ║
 * ║ Default descriptor for obj.key = value:                                    ║
 * ║   { writable: true, enumerable: true, configurable: true }                 ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// Basic defineProperty
var obj = {};

Object.defineProperty(obj, 'name', {
  value: 'Alice',
  writable: false,
  enumerable: true,
  configurable: false
});

obj.name = 'Bob';  // Try to change
console.log('A:', obj.name);

// Enumerable property
var person = { visible: 'yes' };
Object.defineProperty(person, 'hidden', {
  value: 'secret',
  enumerable: false
});

console.log('B:', Object.keys(person).length);

// Configurable property
var config = {};
Object.defineProperty(config, 'setting', {
  value: 'locked',
  configurable: false
});

try {
  delete config.setting;
  console.log('C:', 'Deleted');
} catch(e) {
  console.log('C:', 'Cannot delete');
}

console.log('D:', config.setting);

// Multiple properties
var user = {};
Object.defineProperties(user, {
  firstName: { value: 'John', enumerable: true },
  lastName: { value: 'Doe', enumerable: true },
  fullName: {
    get() {
      return this.firstName + ' ' + this.lastName;
    },
    enumerable: true
  }
});

console.log('E:', user.fullName);

/**
 * OUTPUT:
 *   A: Alice
 *   B: 1
 *   C: Cannot delete (in strict mode) or Deleted (silently fails in non-strict)
 *   D: locked
 *   E: John Doe
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: writable: false                                                         ║
 * ║ ───────────────────                                                        ║
 * ║   obj.name = 'Bob' silently fails (throws in strict mode)                  ║
 * ║   obj.name is still 'Alice'                                                ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ B: enumerable: false                                                       ║
 * ║ ─────────────────────                                                      ║
 * ║   person has 2 properties: 'visible' and 'hidden'                          ║
 * ║   Object.keys only returns enumerable: ['visible']                         ║
 * ║   Length = 1                                                               ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ C & D: configurable: false                                                 ║
 * ║ ────────────────────────────                                               ║
 * ║   Cannot delete non-configurable property                                  ║
 * ║   Cannot redefine its descriptor                                           ║
 * ║   config.setting is still 'locked'                                         ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ E: Getter in descriptor                                                    ║
 * ║ ────────────────────────                                                   ║
 * ║   fullName has a getter, no value                                          ║
 * ║   Computed on access: 'John' + ' ' + 'Doe'                                 ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ DESCRIPTOR DEFAULTS                                                         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // Normal assignment: all true                                            │
 * │   obj.key = value;                                                          │
 * │   // { value, writable: true, enumerable: true, configurable: true }        │
 * │                                                                             │
 * │   // defineProperty: all false by default!                                  │
 * │   Object.defineProperty(obj, 'key', { value });                             │
 * │   // { value, writable: false, enumerable: false, configurable: false }     │
 * │                                                                             │
 * │   // Check a property's descriptor                                          │
 * │   Object.getOwnPropertyDescriptor(obj, 'key');                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/06-objects-creation/07-property-descriptors.js
 */
