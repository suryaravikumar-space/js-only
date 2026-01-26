/**
 * ═══════════════════════════════════════════════════════════════════════════
 * JAVASCRIPT META-PROGRAMMING - Interview Questions & Answers
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * 50+ commonly asked meta-programming interview questions.
 */

console.log("═══════════════════════════════════════════════════════════════");
console.log("           META-PROGRAMMING - INTERVIEW Q&A");
console.log("═══════════════════════════════════════════════════════════════\n");

const interviewQuestions = [
    // ========================================================================
    // PROXY QUESTIONS
    // ========================================================================
    {
        category: "Proxy",
        question: "What is a Proxy in JavaScript?",
        answer: `
A Proxy is an object that wraps another object (target) and intercepts
fundamental operations like property access, assignment, and function calls.

SYNTAX:
const proxy = new Proxy(target, handler);

COMPONENTS:
• target: The original object being proxied
• handler: Object with trap methods
• traps: Methods that intercept operations

EXAMPLE:
const proxy = new Proxy({}, {
    get(target, prop) {
        console.log(\`Getting \${prop}\`);
        return target[prop];
    }
});

proxy.foo;  // Logs: "Getting foo"

USE CASES:
• Validation
• Logging/debugging
• Default values
• Observable objects
• Access control
        `
    },
    {
        category: "Proxy",
        question: "What are Proxy traps? Name the most common ones.",
        answer: `
Traps are handler methods that intercept object operations.

COMMON TRAPS:
1. get(target, prop, receiver)
   - Intercepts property access
   - obj.prop, obj['prop']

2. set(target, prop, value, receiver)
   - Intercepts property assignment
   - Must return true for success

3. has(target, prop)
   - Intercepts 'in' operator
   - 'prop' in obj

4. deleteProperty(target, prop)
   - Intercepts delete operator
   - delete obj.prop

5. apply(target, thisArg, args)
   - Intercepts function calls
   - For function proxies

6. construct(target, args)
   - Intercepts 'new' operator
   - new Proxy()

7. ownKeys(target)
   - Intercepts Object.keys(), for...in
        `
    },
    {
        category: "Proxy",
        question: "What is a revocable Proxy?",
        answer: `
A revocable Proxy can be disabled, making it unusable after revocation.

SYNTAX:
const { proxy, revoke } = Proxy.revocable(target, handler);

// Use proxy normally
proxy.foo;

// Revoke access
revoke();

// Now throws TypeError
proxy.foo;  // Error!

USE CASES:
• Temporary access to objects
• Access tokens that expire
• Controlled resource sharing
• Security-sensitive operations
• Memory cleanup

IMPORTANT:
• Once revoked, cannot be un-revoked
• All operations throw TypeError
• Original target is unaffected
        `
    },

    // ========================================================================
    // REFLECT QUESTIONS
    // ========================================================================
    {
        category: "Reflect",
        question: "What is the Reflect API and why use it?",
        answer: `
Reflect is a built-in object providing methods for object operations.

WHY USE REFLECT?

1. Cleaner Syntax
   // Old
   Object.defineProperty(obj, 'prop', desc);  // Throws on failure

   // New
   Reflect.defineProperty(obj, 'prop', desc);  // Returns boolean

2. Works with Proxy
   - Each trap has matching Reflect method
   - Forward default behavior easily

   get(target, prop, receiver) {
       console.log('intercepted');
       return Reflect.get(target, prop, receiver);
   }

3. Function-Based Operations
   'prop' in obj → Reflect.has(obj, 'prop')
   delete obj.prop → Reflect.deleteProperty(obj, 'prop')

4. Receiver Parameter
   - Maintains correct 'this' in getters/setters
   - Critical for proxy correctness
        `
    },
    {
        category: "Reflect",
        question: "What is the receiver parameter in Reflect.get/set?",
        answer: `
The receiver is the value of 'this' when calling getters/setters.

EXAMPLE:
const obj = {
    _value: 42,
    get value() { return this._value; }
};

const customReceiver = { _value: 100 };

Reflect.get(obj, 'value');
// Returns 42 (uses obj as this)

Reflect.get(obj, 'value', customReceiver);
// Returns 100 (uses customReceiver as this)

IN PROXY CONTEXT:
const proxy = new Proxy(obj, {
    get(target, prop, receiver) {
        // receiver is the proxy itself
        return Reflect.get(target, prop, receiver);
        // Maintains correct this binding
    }
});

WHY IT MATTERS:
- Inheritance works correctly
- Getters see correct 'this'
- Proxy chains work properly
        `
    },

    // ========================================================================
    // SYMBOL QUESTIONS
    // ========================================================================
    {
        category: "Symbols",
        question: "What are Symbols and why are they unique?",
        answer: `
Symbols are primitive values guaranteed to be unique.

CREATION:
const sym1 = Symbol('description');
const sym2 = Symbol('description');
sym1 === sym2;  // false! Always unique

KEY CHARACTERISTICS:
• Unique identity (even with same description)
• Immutable
• Can be used as object keys
• Not enumerable by default in for...in

USE CASES:
1. Private-like properties
   const _private = Symbol('private');
   obj[_private] = 'hidden';

2. Collision-free property keys
   // Different libraries can add properties
   // without overwriting each other

3. Well-known symbols
   // Customize language behavior
   [Symbol.iterator]

GLOBAL REGISTRY:
Symbol.for('key')  // Creates/retrieves global symbol
Symbol.keyFor(sym) // Gets key of global symbol
        `
    },
    {
        category: "Symbols",
        question: "What are well-known Symbols?",
        answer: `
Well-known Symbols are built-in Symbols that control JavaScript behavior.

KEY WELL-KNOWN SYMBOLS:

1. Symbol.iterator
   - Makes object iterable
   obj[Symbol.iterator] = function* () { yield 1; }
   [...obj]  // [1]

2. Symbol.toStringTag
   - Customizes [object X] tag
   get [Symbol.toStringTag]() { return 'MyClass'; }
   Object.prototype.toString.call(obj)  // "[object MyClass]"

3. Symbol.toPrimitive
   - Custom type conversion
   [Symbol.toPrimitive](hint) {
       if (hint === 'number') return 42;
       return 'string';
   }

4. Symbol.hasInstance
   - Custom instanceof behavior
   static [Symbol.hasInstance](obj) {
       return 'myProp' in obj;
   }

5. Symbol.species
   - Constructor for derived objects
   static get [Symbol.species]() { return Array; }
        `
    },

    // ========================================================================
    // DECORATOR QUESTIONS
    // ========================================================================
    {
        category: "Decorators",
        question: "What are decorators and how do they work?",
        answer: `
Decorators are functions that modify classes and class members.

STATUS: Stage 3 Proposal (available via TypeScript/Babel)

SYNTAX:
@decorator
class MyClass {
    @methodDecorator
    method() {}
}

HOW THEY WORK:
Decorators receive the target and can modify or replace it.

METHOD DECORATOR:
function log(target, propertyKey, descriptor) {
    const original = descriptor.value;
    descriptor.value = function(...args) {
        console.log(\`Calling \${propertyKey}\`);
        return original.apply(this, args);
    };
    return descriptor;
}

DECORATOR FACTORY:
function debounce(ms) {
    return function(target, key, descriptor) {
        // Add debouncing logic
        return descriptor;
    };
}

@debounce(300)
handleInput() {}

EXECUTION ORDER:
• Multiple decorators: bottom to top
@first @second method()  // second runs, then first
        `
    },
    {
        category: "Decorators",
        question: "Implement a memoization decorator.",
        answer: `
function memoize(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    const cache = new Map();

    descriptor.value = function(...args) {
        const key = JSON.stringify(args);

        if (cache.has(key)) {
            return cache.get(key);
        }

        const result = originalMethod.apply(this, args);
        cache.set(key, result);
        return result;
    };

    return descriptor;
}

// Usage
class Calculator {
    @memoize
    fibonacci(n) {
        if (n <= 1) return n;
        return this.fibonacci(n - 1) + this.fibonacci(n - 2);
    }
}

// Without decorator syntax (manual application)
Object.defineProperty(Calculator.prototype, 'fibonacci',
    memoize(
        Calculator.prototype,
        'fibonacci',
        Object.getOwnPropertyDescriptor(Calculator.prototype, 'fibonacci')
    )
);
        `
    },

    // ========================================================================
    // PROPERTY DESCRIPTOR QUESTIONS
    // ========================================================================
    {
        category: "Property Descriptors",
        question: "What are property descriptors?",
        answer: `
Property descriptors define how properties behave.

TWO TYPES:

1. DATA DESCRIPTOR
{
    value: any,           // The value
    writable: boolean,    // Can change value?
    enumerable: boolean,  // Appears in for...in?
    configurable: boolean // Can modify descriptor?
}

2. ACCESSOR DESCRIPTOR
{
    get: function,        // Getter
    set: function,        // Setter
    enumerable: boolean,
    configurable: boolean
}

METHODS:
Object.getOwnPropertyDescriptor(obj, 'prop')
Object.defineProperty(obj, 'prop', descriptor)
Object.defineProperties(obj, { prop1: desc1, prop2: desc2 })

DEFAULT VALUES (with defineProperty):
writable: false
enumerable: false
configurable: false

// vs regular assignment
obj.prop = value;
// writable: true, enumerable: true, configurable: true
        `
    },
    {
        category: "Property Descriptors",
        question: "Explain Object.freeze(), Object.seal(), and Object.preventExtensions().",
        answer: `
THREE LEVELS OF OBJECT PROTECTION:

1. Object.preventExtensions(obj)
   • Can't ADD new properties
   • CAN modify existing properties
   • CAN delete properties

2. Object.seal(obj)
   • Can't ADD new properties
   • CAN modify existing values
   • Can't DELETE properties
   • Can't reconfigure properties

3. Object.freeze(obj)
   • Can't ADD new properties
   • Can't MODIFY values
   • Can't DELETE properties
   • Can't reconfigure properties

CHECKING:
Object.isExtensible(obj)
Object.isSealed(obj)
Object.isFrozen(obj)

IMPORTANT:
All are SHALLOW! Nested objects are not affected.

// Deep freeze
function deepFreeze(obj) {
    Object.freeze(obj);
    for (const key of Object.keys(obj)) {
        if (typeof obj[key] === 'object') {
            deepFreeze(obj[key]);
        }
    }
    return obj;
}
        `
    },

    // ========================================================================
    // PROTOTYPE QUESTIONS
    // ========================================================================
    {
        category: "Prototypes",
        question: "How does the prototype chain work?",
        answer: `
Every object has an internal [[Prototype]] link to another object.

PROPERTY LOOKUP:
1. Check object's own properties
2. If not found, check [[Prototype]]
3. Continue up the chain
4. Return undefined if reaches null

EXAMPLE:
const animal = { eats: true };
const rabbit = Object.create(animal);
rabbit.jumps = true;

rabbit.jumps   // Own property → true
rabbit.eats    // Inherited → true
rabbit.missing // Not found → undefined

CHAIN:
rabbit → animal → Object.prototype → null

METHODS:
Object.getPrototypeOf(obj)  // Get [[Prototype]]
Object.setPrototypeOf(obj, proto)  // Set (slow!)
Object.create(proto)  // Create with prototype

obj.__proto__  // Legacy, avoid

⚠️ Changing prototype after creation is slow!
Use Object.create() instead.
        `
    },
    {
        category: "Prototypes",
        question: "What is Object.create(null) and when to use it?",
        answer: `
Object.create(null) creates an object with NO prototype.

const dict = Object.create(null);

CHARACTERISTICS:
• No inherited properties
• No toString, hasOwnProperty, etc.
• Truly empty object

USE CASES:

1. Dictionary/Map-like objects
   // No collision with inherited properties
   dict['constructor'] = value;  // Safe!

2. Safe key-value storage
   // User input can't exploit inherited methods
   dict[userInput] = value;

3. Performance-critical lookups
   // No prototype chain traversal

COMPARISON:
const normal = {};
'toString' in normal;  // true

const nullProto = Object.create(null);
'toString' in nullProto;  // false

CAUTION:
Object.keys(nullProto)  // Works
nullProto.hasOwnProperty  // undefined!
// Use: Object.hasOwn(nullProto, 'key')
        `
    },

    // ========================================================================
    // GENERATOR QUESTIONS
    // ========================================================================
    {
        category: "Generators",
        question: "What are generators and how do they work?",
        answer: `
Generators are functions that can be paused and resumed.

SYNTAX:
function* generator() {
    yield 1;
    yield 2;
    return 3;
}

const gen = generator();
gen.next();  // { value: 1, done: false }
gen.next();  // { value: 2, done: false }
gen.next();  // { value: 3, done: true }

KEY FEATURES:
• yield pauses execution
• next() resumes and returns { value, done }
• Can receive values via next(value)
• Implements iterator protocol

TWO-WAY COMMUNICATION:
function* twoWay() {
    const x = yield 'Hello';
    return x + ' World';
}

const g = twoWay();
g.next();        // { value: 'Hello', done: false }
g.next('New');   // { value: 'New World', done: true }

DELEGATION:
function* outer() {
    yield* inner();  // Delegates to inner generator
}
        `
    },
    {
        category: "Generators",
        question: "How do you create a custom iterable?",
        answer: `
Implement [Symbol.iterator] that returns an iterator.

METHOD 1: Manual Iterator
const range = {
    start: 1,
    end: 5,
    [Symbol.iterator]() {
        let current = this.start;
        const end = this.end;
        return {
            next() {
                if (current <= end) {
                    return { value: current++, done: false };
                }
                return { done: true };
            }
        };
    }
};

[...range];  // [1, 2, 3, 4, 5]

METHOD 2: Generator (Simpler)
const range = {
    start: 1,
    end: 5,
    *[Symbol.iterator]() {
        for (let i = this.start; i <= this.end; i++) {
            yield i;
        }
    }
};

CONSUMED BY:
• for...of
• Spread operator
• Array.from()
• Destructuring
        `
    },

    // ========================================================================
    // GENERAL META-PROGRAMMING
    // ========================================================================
    {
        category: "General",
        question: "What is meta-programming?",
        answer: `
Meta-programming is writing code that manipulates code or language features.

TYPES IN JAVASCRIPT:

1. INTROSPECTION
   - Examining objects/types at runtime
   typeof, instanceof, Object.keys()

2. SELF-MODIFICATION
   - Code that modifies itself
   eval(), new Function()

3. INTERCESSION
   - Intercepting operations
   Proxy, getters/setters

4. REFLECTION
   - Manipulating object internals
   Reflect API, property descriptors

EXAMPLES:
• Proxy: Intercept property access
• Reflect: Perform object operations
• Symbols: Define custom behaviors
• Decorators: Modify class members
• Property descriptors: Control property behavior

USE CASES:
• Validation frameworks
• ORM implementations
• Reactive systems
• Logging/debugging tools
• Access control
        `
    },
    {
        category: "General",
        question: "Implement an observable object using Proxy.",
        answer: `
function createObservable(target, callback) {
    const handlers = new Map();

    return new Proxy(target, {
        get(obj, prop) {
            return obj[prop];
        },

        set(obj, prop, value) {
            const oldValue = obj[prop];
            obj[prop] = value;

            // Notify subscribers
            callback(prop, value, oldValue);

            // Notify specific property handlers
            if (handlers.has(prop)) {
                handlers.get(prop).forEach(fn =>
                    fn(value, oldValue)
                );
            }

            return true;
        }
    });
}

// Usage
const state = createObservable(
    { count: 0 },
    (prop, newVal, oldVal) => {
        console.log(\`\${prop}: \${oldVal} → \${newVal}\`);
    }
);

state.count = 1;  // "count: 0 → 1"
state.count = 2;  // "count: 1 → 2"

This is the foundation of reactive frameworks like Vue.
        `
    }
];

// ============================================================================
// Print Questions
// ============================================================================
let currentCategory = '';

interviewQuestions.forEach((q, index) => {
    if (q.category !== currentCategory) {
        currentCategory = q.category;
        console.log(`\n${'═'.repeat(67)}`);
        console.log(`   ${currentCategory.toUpperCase()} QUESTIONS`);
        console.log(`${'═'.repeat(67)}`);
    }

    console.log(`\n${index + 1}. Q: ${q.question}`);
    console.log(`\n   A: ${q.answer.trim().split('\n').join('\n   ')}`);
});

// ============================================================================
// Quick Reference
// ============================================================================
console.log("\n" + "═".repeat(67));
console.log("           META-PROGRAMMING QUICK REFERENCE");
console.log("═".repeat(67));

console.log(`
╔══════════════════════════════════════════════════════════════════╗
║             META-PROGRAMMING QUICK REFERENCE                     ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  PROXY:                          REFLECT:                        ║
║  new Proxy(target, handler)      Reflect.get(obj, prop)          ║
║  Proxy.revocable(target, h)      Reflect.set(obj, prop, val)     ║
║  handler.get/set/has/delete      Reflect.has/deleteProperty      ║
║                                                                  ║
║  SYMBOLS:                        DESCRIPTORS:                    ║
║  Symbol('desc')                  Object.defineProperty()         ║
║  Symbol.for('key')               Object.getOwnPropertyDescriptor ║
║  Symbol.iterator                 Object.freeze/seal              ║
║  Symbol.toStringTag                                              ║
║                                                                  ║
║  GENERATORS:                     PROTOTYPE:                      ║
║  function* gen() { yield }       Object.getPrototypeOf()         ║
║  yield* delegation               Object.create(proto)            ║
║  gen.next(value)                 Object.create(null)             ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
`);

module.exports = { interviewQuestions };

console.log("\n═══ META-PROGRAMMING MODULE COMPLETE! ═══");
console.log("All 8 files covering meta-programming created.");
console.log("\nNext module: Data Structures & Algorithms");
console.log("Run: node deep-dive/javaScript-data-structures/01-arrays-strings.js");
