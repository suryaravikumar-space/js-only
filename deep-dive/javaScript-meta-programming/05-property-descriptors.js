/**
 * ═══════════════════════════════════════════════════════════════════════════
 * JAVASCRIPT META-PROGRAMMING - Property Descriptors
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Property descriptors define how properties behave, including their
 * writability, enumerability, and configurability.
 */

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    PROPERTY DESCRIPTOR OVERVIEW                          │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   PROPERTY TYPES:                                                        │
 * │   ═══════════════                                                        │
 * │                                                                          │
 * │   1. DATA PROPERTIES                2. ACCESSOR PROPERTIES               │
 * │      {                                 {                                 │
 * │        value: any,                       get: function,                  │
 * │        writable: boolean,                set: function,                  │
 * │        enumerable: boolean,              enumerable: boolean,            │
 * │        configurable: boolean             configurable: boolean           │
 * │      }                                 }                                 │
 * │                                                                          │
 * │   ATTRIBUTES:                                                            │
 * │   ═══════════                                                            │
 * │                                                                          │
 * │   • value: The property's value                                         │
 * │   • writable: Can the value be changed?                                 │
 * │   • enumerable: Appears in for...in and Object.keys()?                  │
 * │   • configurable: Can attributes be changed? Can delete?                │
 * │   • get: Getter function                                                │
 * │   • set: Setter function                                                │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("═══════════════════════════════════════════════════════════════");
console.log("           PROPERTY DESCRIPTORS");
console.log("═══════════════════════════════════════════════════════════════\n");

// ============================================================================
// Getting Property Descriptors
// ============================================================================
console.log("─── Getting Property Descriptors ───\n");

const obj = {
    name: 'John',
    get age() { return 30; }
};

console.log("Data property (name):");
console.log(Object.getOwnPropertyDescriptor(obj, 'name'));

console.log("\nAccessor property (age):");
console.log(Object.getOwnPropertyDescriptor(obj, 'age'));

console.log("\nAll descriptors:");
console.log(Object.getOwnPropertyDescriptors(obj));
console.log("");

// ============================================================================
// Object.defineProperty()
// ============================================================================
console.log("─── Object.defineProperty() ───\n");

const person = {};

// Define a data property
Object.defineProperty(person, 'name', {
    value: 'John',
    writable: true,
    enumerable: true,
    configurable: true
});

// Define a read-only property
Object.defineProperty(person, 'id', {
    value: 12345,
    writable: false,
    enumerable: true,
    configurable: false
});

// Define a hidden property
Object.defineProperty(person, 'secret', {
    value: 'hidden data',
    writable: true,
    enumerable: false,  // Won't appear in Object.keys()
    configurable: true
});

console.log("person:", person);
console.log("Object.keys(person):", Object.keys(person));  // No 'secret'
console.log("person.secret:", person.secret);               // Still accessible

// Try to modify read-only
person.id = 99999;
console.log("After person.id = 99999:", person.id);  // Still 12345
console.log("");

// ============================================================================
// Accessor Properties (Getters/Setters)
// ============================================================================
console.log("─── Accessor Properties ───\n");

const user = {
    firstName: 'John',
    lastName: 'Doe'
};

Object.defineProperty(user, 'fullName', {
    get() {
        return `${this.firstName} ${this.lastName}`;
    },
    set(value) {
        const parts = value.split(' ');
        this.firstName = parts[0];
        this.lastName = parts[1] || '';
    },
    enumerable: true,
    configurable: true
});

console.log("user.fullName:", user.fullName);
user.fullName = 'Jane Smith';
console.log("After setting fullName:", user.firstName, user.lastName);
console.log("");

// ============================================================================
// Computed Properties with Caching
// ============================================================================
console.log("─── Computed Properties with Caching ───\n");

const data = {
    _value: 0,
    _cache: null,
    _cacheValid: false
};

Object.defineProperty(data, 'value', {
    get() {
        return this._value;
    },
    set(newValue) {
        this._value = newValue;
        this._cacheValid = false;  // Invalidate cache
    },
    enumerable: true
});

Object.defineProperty(data, 'expensive', {
    get() {
        if (this._cacheValid) {
            console.log('  (returning cached)');
            return this._cache;
        }

        console.log('  (computing...)');
        this._cache = this._value * 2;  // Expensive computation
        this._cacheValid = true;
        return this._cache;
    },
    enumerable: true
});

data.value = 5;
console.log("First access:", data.expensive);
console.log("Second access:", data.expensive);
data.value = 10;
console.log("After change:", data.expensive);
console.log("");

// ============================================================================
// Object.defineProperties()
// ============================================================================
console.log("─── Object.defineProperties() ───\n");

const product = {};

Object.defineProperties(product, {
    name: {
        value: 'Widget',
        writable: true,
        enumerable: true
    },
    price: {
        value: 29.99,
        writable: true,
        enumerable: true
    },
    quantity: {
        value: 100,
        writable: true,
        enumerable: true
    },
    total: {
        get() {
            return this.price * this.quantity;
        },
        enumerable: true
    }
});

console.log("product:", product);
console.log("product.total:", product.total);
console.log("");

// ============================================================================
// Property Flags Behavior
// ============================================================================
console.log("═══════════════════════════════════════════════════════════════");
console.log("           PROPERTY FLAGS BEHAVIOR");
console.log("═══════════════════════════════════════════════════════════════\n");

// ----------------------------------------------------------------------------
// writable: false
// ----------------------------------------------------------------------------
console.log("─── writable: false ───\n");

const readOnlyObj = {};
Object.defineProperty(readOnlyObj, 'constant', {
    value: 42,
    writable: false
});

readOnlyObj.constant = 100;  // Silently fails (throws in strict mode)
console.log("After assignment:", readOnlyObj.constant);  // Still 42
console.log("");

// ----------------------------------------------------------------------------
// enumerable: false
// ----------------------------------------------------------------------------
console.log("─── enumerable: false ───\n");

const hiddenProps = {
    visible: 1
};
Object.defineProperty(hiddenProps, 'hidden', {
    value: 2,
    enumerable: false
});

console.log("Object.keys():", Object.keys(hiddenProps));
console.log("for...in:", (() => { const arr = []; for (const k in hiddenProps) arr.push(k); return arr; })());
console.log("JSON.stringify():", JSON.stringify(hiddenProps));
console.log("Direct access:", hiddenProps.hidden);  // Still works
console.log("");

// ----------------------------------------------------------------------------
// configurable: false
// ----------------------------------------------------------------------------
console.log("─── configurable: false ───\n");

const locked = {};
Object.defineProperty(locked, 'permanent', {
    value: 'fixed',
    configurable: false
});

// Can't delete
delete locked.permanent;
console.log("After delete:", locked.permanent);

// Can't redefine
try {
    Object.defineProperty(locked, 'permanent', {
        configurable: true
    });
} catch (e) {
    console.log("Redefine error:", e.message);
}
console.log("");

// ============================================================================
// Object Sealing and Freezing
// ============================================================================
console.log("═══════════════════════════════════════════════════════════════");
console.log("           OBJECT SEALING AND FREEZING");
console.log("═══════════════════════════════════════════════════════════════\n");

// ----------------------------------------------------------------------------
// Object.preventExtensions()
// ----------------------------------------------------------------------------
console.log("─── Object.preventExtensions() ───\n");

const noExtend = { a: 1 };
Object.preventExtensions(noExtend);

noExtend.b = 2;  // Fails silently
noExtend.a = 10; // Works!
delete noExtend.a; // Works!

console.log("Object.isExtensible(noExtend):", Object.isExtensible(noExtend));
console.log("noExtend:", noExtend);
console.log("");

// ----------------------------------------------------------------------------
// Object.seal()
// ----------------------------------------------------------------------------
console.log("─── Object.seal() ───\n");

const sealed = { a: 1, b: 2 };
Object.seal(sealed);

sealed.a = 10;   // Works! (can modify)
sealed.c = 3;    // Fails (can't add)
delete sealed.b; // Fails (can't delete)

console.log("Object.isSealed(sealed):", Object.isSealed(sealed));
console.log("sealed:", sealed);
console.log("");

// ----------------------------------------------------------------------------
// Object.freeze()
// ----------------------------------------------------------------------------
console.log("─── Object.freeze() ───\n");

const frozen = { a: 1, b: { nested: 2 } };
Object.freeze(frozen);

frozen.a = 10;  // Fails (can't modify)
frozen.c = 3;   // Fails (can't add)
delete frozen.a; // Fails (can't delete)

// But nested objects are NOT frozen!
frozen.b.nested = 20;  // Works!

console.log("Object.isFrozen(frozen):", Object.isFrozen(frozen));
console.log("frozen:", frozen);
console.log("frozen.b.nested:", frozen.b.nested);  // 20

// Deep freeze
function deepFreeze(obj) {
    Object.freeze(obj);
    for (const key of Object.keys(obj)) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            deepFreeze(obj[key]);
        }
    }
    return obj;
}

console.log("\nDeep freeze implemented");
console.log("");

// ============================================================================
// Practical Patterns
// ============================================================================
console.log("═══════════════════════════════════════════════════════════════");
console.log("           PRACTICAL PATTERNS");
console.log("═══════════════════════════════════════════════════════════════\n");

// Pattern 1: Observable Properties
console.log("─── Observable Properties ───\n");

function makeObservable(target) {
    const handlers = {};

    return new Proxy(target, {
        set(obj, prop, value) {
            const oldValue = obj[prop];
            obj[prop] = value;

            if (handlers[prop]) {
                handlers[prop].forEach(handler => handler(value, oldValue));
            }

            return true;
        }
    });
}

const observable = makeObservable({ count: 0 });
console.log("Observable pattern created");
console.log("");

// Pattern 2: Immutable Objects
console.log("─── Immutable Object Factory ───\n");

function createImmutable(obj) {
    const immutable = {};

    for (const [key, value] of Object.entries(obj)) {
        Object.defineProperty(immutable, key, {
            value: typeof value === 'object' ? createImmutable(value) : value,
            writable: false,
            configurable: false,
            enumerable: true
        });
    }

    return Object.freeze(immutable);
}

const immutableConfig = createImmutable({
    api: { url: 'https://api.example.com' },
    timeout: 5000
});

console.log("immutableConfig:", immutableConfig);
console.log("");

// Pattern 3: Lazy Initialization
console.log("─── Lazy Initialization ───\n");

function defineLazy(obj, prop, initializer) {
    let initialized = false;
    let value;

    Object.defineProperty(obj, prop, {
        get() {
            if (!initialized) {
                console.log(`Initializing ${prop}...`);
                value = initializer();
                initialized = true;
            }
            return value;
        },
        configurable: true,
        enumerable: true
    });
}

const lazyObj = {};
defineLazy(lazyObj, 'expensiveData', () => {
    // Simulate expensive computation
    return { computed: true, data: [1, 2, 3] };
});

console.log("Property defined");
console.log("First access:", lazyObj.expensiveData);
console.log("Second access:", lazyObj.expensiveData);
console.log("");

// ============================================================================
// Property Descriptors Cheat Sheet
// ============================================================================
console.log("╔══════════════════════════════════════════════════════════════════╗");
console.log("║           PROPERTY DESCRIPTORS CHEAT SHEET                      ║");
console.log("╠══════════════════════════════════════════════════════════════════╣");
console.log("║                                                                  ║");
console.log("║  DATA PROPERTY:           ACCESSOR PROPERTY:                     ║");
console.log("║  { value, writable,       { get, set,                           ║");
console.log("║    enumerable,              enumerable,                          ║");
console.log("║    configurable }           configurable }                       ║");
console.log("║                                                                  ║");
console.log("║  METHODS:                                                        ║");
console.log("║  Object.getOwnPropertyDescriptor(obj, prop)                     ║");
console.log("║  Object.getOwnPropertyDescriptors(obj)                          ║");
console.log("║  Object.defineProperty(obj, prop, descriptor)                   ║");
console.log("║  Object.defineProperties(obj, { prop: descriptor })             ║");
console.log("║                                                                  ║");
console.log("║  PROTECTION LEVELS:                                              ║");
console.log("║  preventExtensions: Can't add props                             ║");
console.log("║  seal: Can't add/delete props                                   ║");
console.log("║  freeze: Can't add/delete/modify props                          ║");
console.log("║                                                                  ║");
console.log("║  DEFAULT VALUES (defineProperty):                                ║");
console.log("║  writable: false, enumerable: false, configurable: false        ║");
console.log("║                                                                  ║");
console.log("╚══════════════════════════════════════════════════════════════════╝\n");

module.exports = {
    createImmutable,
    deepFreeze,
    defineLazy,
    makeObservable
};

console.log("═══ Next: Generators & Iterators Meta ═══");
console.log("Run: node deep-dive/javaScript-meta-programming/06-generators-meta.js");
