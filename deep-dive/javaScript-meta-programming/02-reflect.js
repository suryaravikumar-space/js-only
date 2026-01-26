/**
 * ═══════════════════════════════════════════════════════════════════════════
 * JAVASCRIPT META-PROGRAMMING - Reflect API
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Reflect is a built-in object that provides methods for interceptable
 * JavaScript operations. It's designed to work alongside Proxy.
 */

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    REFLECT OVERVIEW                                      │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   WHY REFLECT?                                                           │
 * │   ════════════                                                           │
 * │                                                                          │
 * │   1. Cleaner Syntax                                                     │
 * │      • Object.defineProperty() → Reflect.defineProperty()               │
 * │      • Returns boolean instead of throwing                              │
 * │                                                                          │
 * │   2. Maps to Proxy Traps                                                │
 * │      • Each Reflect method matches a Proxy trap                         │
 * │      • Forward operations to original object behavior                   │
 * │                                                                          │
 * │   3. Function-Based Operations                                          │
 * │      • delete obj.prop → Reflect.deleteProperty(obj, 'prop')           │
 * │      • 'prop' in obj → Reflect.has(obj, 'prop')                        │
 * │                                                                          │
 * │   ┌─────────────────────────────────────────────────────────────────┐   │
 * │   │                  REFLECT + PROXY                                │   │
 * │   └─────────────────────────────────────────────────────────────────┘   │
 * │                                                                          │
 * │   Proxy Trap           ◄─────────►      Reflect Method                  │
 * │   handler.get()        ◄─────────►      Reflect.get()                   │
 * │   handler.set()        ◄─────────►      Reflect.set()                   │
 * │   handler.has()        ◄─────────►      Reflect.has()                   │
 * │   ...                                   ...                              │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("═══════════════════════════════════════════════════════════════");
console.log("           REFLECT API");
console.log("═══════════════════════════════════════════════════════════════\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    ALL REFLECT METHODS                                   │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   PROPERTY ACCESS:                                                       │
 * │   • Reflect.get(target, prop, receiver?)                                │
 * │   • Reflect.set(target, prop, value, receiver?)                         │
 * │   • Reflect.has(target, prop)                                           │
 * │   • Reflect.deleteProperty(target, prop)                                │
 * │                                                                          │
 * │   PROPERTY DEFINITION:                                                   │
 * │   • Reflect.defineProperty(target, prop, descriptor)                    │
 * │   • Reflect.getOwnPropertyDescriptor(target, prop)                      │
 * │   • Reflect.ownKeys(target)                                             │
 * │                                                                          │
 * │   PROTOTYPE:                                                             │
 * │   • Reflect.getPrototypeOf(target)                                      │
 * │   • Reflect.setPrototypeOf(target, proto)                               │
 * │                                                                          │
 * │   EXTENSIBILITY:                                                         │
 * │   • Reflect.isExtensible(target)                                        │
 * │   • Reflect.preventExtensions(target)                                   │
 * │                                                                          │
 * │   FUNCTION OPERATIONS:                                                   │
 * │   • Reflect.apply(fn, thisArg, args)                                    │
 * │   • Reflect.construct(Target, args, newTarget?)                         │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("─── Reflect Methods Overview ───\n");

console.log("Property Access: get, set, has, deleteProperty");
console.log("Property Definition: defineProperty, getOwnPropertyDescriptor, ownKeys");
console.log("Prototype: getPrototypeOf, setPrototypeOf");
console.log("Extensibility: isExtensible, preventExtensions");
console.log("Functions: apply, construct\n");

// ============================================================================
// Reflect.get()
// ============================================================================
console.log("─── Reflect.get() ───\n");

const obj = {
    name: 'John',
    age: 30,
    get greeting() {
        return `Hello, ${this.name}`;
    }
};

console.log("Reflect.get(obj, 'name'):", Reflect.get(obj, 'name'));
console.log("Reflect.get(obj, 'age'):", Reflect.get(obj, 'age'));
console.log("Reflect.get(obj, 'nonexistent'):", Reflect.get(obj, 'nonexistent'));

// With receiver (for getters)
const receiver = { name: 'Jane' };
console.log("With receiver:", Reflect.get(obj, 'greeting', receiver));
console.log("");

// ============================================================================
// Reflect.set()
// ============================================================================
console.log("─── Reflect.set() ───\n");

const target1 = { x: 1 };
console.log("Before:", target1);

const success = Reflect.set(target1, 'y', 2);
console.log("Reflect.set returned:", success);
console.log("After:", target1);

// Set on frozen object
const frozen = Object.freeze({ x: 1 });
const frozenSet = Reflect.set(frozen, 'y', 2);
console.log("Set on frozen object:", frozenSet);  // false, no error!
console.log("");

// ============================================================================
// Reflect.has()
// ============================================================================
console.log("─── Reflect.has() ───\n");

const proto = { inherited: true };
const child = Object.create(proto);
child.own = true;

console.log("'own' in child:", Reflect.has(child, 'own'));           // true
console.log("'inherited' in child:", Reflect.has(child, 'inherited')); // true
console.log("'missing' in child:", Reflect.has(child, 'missing'));     // false
console.log("");

// ============================================================================
// Reflect.deleteProperty()
// ============================================================================
console.log("─── Reflect.deleteProperty() ───\n");

const delTarget = { a: 1, b: 2 };
console.log("Before:", delTarget);

const deleted = Reflect.deleteProperty(delTarget, 'a');
console.log("Deleted 'a':", deleted);
console.log("After:", delTarget);

// Non-configurable property
Object.defineProperty(delTarget, 'fixed', { value: 100, configurable: false });
const deleteFailed = Reflect.deleteProperty(delTarget, 'fixed');
console.log("Delete non-configurable:", deleteFailed);  // false
console.log("");

// ============================================================================
// Reflect.defineProperty()
// ============================================================================
console.log("─── Reflect.defineProperty() ───\n");

const defTarget = {};

const defined = Reflect.defineProperty(defTarget, 'readonly', {
    value: 42,
    writable: false,
    configurable: true
});

console.log("Defined:", defined);
console.log("defTarget.readonly:", defTarget.readonly);

// Try to define on frozen
const frozenDef = Object.freeze({});
const defineFailed = Reflect.defineProperty(frozenDef, 'new', { value: 1 });
console.log("Define on frozen:", defineFailed);  // false
console.log("");

// ============================================================================
// Reflect.ownKeys()
// ============================================================================
console.log("─── Reflect.ownKeys() ───\n");

const symKey = Symbol('mySymbol');
const keysTarget = {
    normal: 1,
    [symKey]: 2
};
Object.defineProperty(keysTarget, 'hidden', {
    value: 3,
    enumerable: false
});

console.log("Object.keys():", Object.keys(keysTarget));           // ['normal']
console.log("Reflect.ownKeys():", Reflect.ownKeys(keysTarget));   // ['normal', 'hidden', Symbol]
console.log("");

// ============================================================================
// Reflect.apply()
// ============================================================================
console.log("─── Reflect.apply() ───\n");

function greet(greeting, punctuation) {
    return `${greeting}, ${this.name}${punctuation}`;
}

const person = { name: 'Alice' };

// Compare: Function.prototype.apply
const result1 = greet.apply(person, ['Hello', '!']);
console.log("Function.apply:", result1);

// Reflect.apply
const result2 = Reflect.apply(greet, person, ['Hi', '?']);
console.log("Reflect.apply:", result2);
console.log("");

// ============================================================================
// Reflect.construct()
// ============================================================================
console.log("─── Reflect.construct() ───\n");

class Animal {
    constructor(name) {
        this.name = name;
    }
}

class Dog extends Animal {
    constructor(name, breed) {
        super(name);
        this.breed = breed;
    }
}

// Regular construction
const dog1 = new Dog('Max', 'Labrador');
console.log("new Dog():", dog1);

// Reflect.construct
const dog2 = Reflect.construct(Dog, ['Buddy', 'Poodle']);
console.log("Reflect.construct:", dog2);

// With different prototype
const dogArgs = ['Rex', 'German Shepherd'];
const specialDog = Reflect.construct(Animal, ['Special'], Dog);
console.log("With newTarget:", specialDog instanceof Dog);  // true
console.log("");

// ============================================================================
// Reflect in Proxy Handlers
// ============================================================================
console.log("═══════════════════════════════════════════════════════════════");
console.log("           REFLECT WITH PROXY");
console.log("═══════════════════════════════════════════════════════════════\n");

console.log("─── Using Reflect to Forward Operations ───\n");

const logHandler = {
    get(target, prop, receiver) {
        console.log(`[GET] ${String(prop)}`);
        // Use Reflect to perform default behavior
        return Reflect.get(target, prop, receiver);
    },

    set(target, prop, value, receiver) {
        console.log(`[SET] ${String(prop)} = ${value}`);
        // Reflect.set returns boolean, perfect for trap return
        return Reflect.set(target, prop, value, receiver);
    },

    deleteProperty(target, prop) {
        console.log(`[DELETE] ${String(prop)}`);
        return Reflect.deleteProperty(target, prop);
    }
};

const logged = new Proxy({ x: 1 }, logHandler);
logged.x;
logged.y = 2;
delete logged.y;
console.log("");

// Why Reflect is important for receiver
console.log("─── Receiver Parameter Importance ───\n");

const withGetter = {
    _value: 42,
    get value() {
        return this._value;
    }
};

const customReceiver = { _value: 100 };

// Without receiver - uses target's _value
console.log("Direct access:", withGetter.value);  // 42

// With receiver - uses receiver's _value
console.log("With receiver:", Reflect.get(withGetter, 'value', customReceiver));  // 100

// In proxy context
const proxyWithGetter = new Proxy(withGetter, {
    get(target, prop, receiver) {
        // receiver is the proxy itself
        // Passing it maintains correct 'this' in getters
        return Reflect.get(target, prop, receiver);
    }
});
console.log("");

// ============================================================================
// Reflect vs Object Methods
// ============================================================================
console.log("─── Reflect vs Object Methods ───\n");

const comparison = {
    "Object.defineProperty()": {
        old: "Throws on failure",
        reflect: "Reflect.defineProperty() returns boolean"
    },
    "Object.getOwnPropertyDescriptor()": {
        old: "Works the same",
        reflect: "Reflect.getOwnPropertyDescriptor() same API"
    },
    "delete obj.prop": {
        old: "Returns true/false, throws in strict mode",
        reflect: "Reflect.deleteProperty() consistent boolean"
    },
    "'prop' in obj": {
        old: "Operator, not a function",
        reflect: "Reflect.has(obj, 'prop') function form"
    }
};

console.log("Comparison Table:");
Object.entries(comparison).forEach(([method, { old, reflect }]) => {
    console.log(`  ${method}:`);
    console.log(`    Old: ${old}`);
    console.log(`    Reflect: ${reflect}`);
});
console.log("");

// ============================================================================
// Reflect Cheat Sheet
// ============================================================================
console.log("╔══════════════════════════════════════════════════════════════════╗");
console.log("║           REFLECT CHEAT SHEET                                   ║");
console.log("╠══════════════════════════════════════════════════════════════════╣");
console.log("║                                                                  ║");
console.log("║  PROPERTY ACCESS:                                                ║");
console.log("║  Reflect.get(target, prop, receiver?)                           ║");
console.log("║  Reflect.set(target, prop, value, receiver?) → boolean          ║");
console.log("║  Reflect.has(target, prop) → boolean                            ║");
console.log("║  Reflect.deleteProperty(target, prop) → boolean                 ║");
console.log("║                                                                  ║");
console.log("║  PROPERTY DEFINITION:                                            ║");
console.log("║  Reflect.defineProperty(target, prop, descriptor) → boolean     ║");
console.log("║  Reflect.getOwnPropertyDescriptor(target, prop)                 ║");
console.log("║  Reflect.ownKeys(target) → all keys including symbols           ║");
console.log("║                                                                  ║");
console.log("║  FUNCTION CALLS:                                                 ║");
console.log("║  Reflect.apply(fn, thisArg, args)                               ║");
console.log("║  Reflect.construct(Class, args, newTarget?)                     ║");
console.log("║                                                                  ║");
console.log("║  USE WITH PROXY: Forward default behavior                       ║");
console.log("║  get(target, prop, receiver) {                                  ║");
console.log("║      return Reflect.get(target, prop, receiver);                ║");
console.log("║  }                                                               ║");
console.log("║                                                                  ║");
console.log("╚══════════════════════════════════════════════════════════════════╝\n");

module.exports = {
    // Export demonstration objects
};

console.log("═══ Next: Symbols ═══");
console.log("Run: node deep-dive/javaScript-meta-programming/03-symbols.js");
