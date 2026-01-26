/**
 * ═══════════════════════════════════════════════════════════════════════════
 * JAVASCRIPT META-PROGRAMMING - Object Internals
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Deep dive into JavaScript object internal operations, prototype chain
 * manipulation, and advanced object techniques.
 */

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    OBJECT INTERNAL SLOTS                                 │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   Every object has internal slots (denoted [[Slot]]):                   │
 * │                                                                          │
 * │   [[Prototype]]     - Object's prototype (or null)                      │
 * │   [[Extensible]]    - Can new properties be added?                      │
 * │                                                                          │
 * │   Functions also have:                                                   │
 * │   [[Call]]          - How function is called                            │
 * │   [[Construct]]     - How function is used with 'new'                   │
 * │                                                                          │
 * │   Arrays have:                                                           │
 * │   [[DefineOwnProperty]] - Special handling for 'length'                 │
 * │                                                                          │
 * │   ┌─────────────────────────────────────────────────────────────────┐   │
 * │   │                  INTERNAL METHODS                               │   │
 * │   └─────────────────────────────────────────────────────────────────┘   │
 * │                                                                          │
 * │   [[GetPrototypeOf]]()        - Get prototype                           │
 * │   [[SetPrototypeOf]](V)       - Set prototype                           │
 * │   [[IsExtensible]]()          - Check extensibility                     │
 * │   [[PreventExtensions]]()     - Make non-extensible                     │
 * │   [[GetOwnProperty]](P)       - Get property descriptor                 │
 * │   [[DefineOwnProperty]](P,D)  - Define/modify property                  │
 * │   [[HasProperty]](P)          - Check property existence                │
 * │   [[Get]](P,R)                - Get property value                      │
 * │   [[Set]](P,V,R)              - Set property value                      │
 * │   [[Delete]](P)               - Delete property                         │
 * │   [[OwnPropertyKeys]]()       - List own keys                           │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("═══════════════════════════════════════════════════════════════");
console.log("           OBJECT INTERNALS");
console.log("═══════════════════════════════════════════════════════════════\n");

// ============================================================================
// Prototype Chain
// ============================================================================
console.log("─── Prototype Chain ───\n");

const grandparent = { inherited: 'from grandparent' };
const parent = Object.create(grandparent);
parent.middle = 'from parent';
const child = Object.create(parent);
child.own = 'from child';

console.log("Prototype chain:");
console.log("  child.own:", child.own);
console.log("  child.middle:", child.middle);
console.log("  child.inherited:", child.inherited);

console.log("\nPrototype lookup:");
let current = child;
let depth = 0;
while (current !== null) {
    console.log(`  Level ${depth}:`, Object.getOwnPropertyNames(current));
    current = Object.getPrototypeOf(current);
    depth++;
}
console.log("");

// ============================================================================
// Object.create() Deep Dive
// ============================================================================
console.log("─── Object.create() ───\n");

// Object with null prototype (dictionary)
const dict = Object.create(null);
dict.key = 'value';
console.log("Null prototype object:", dict);
console.log("dict.hasOwnProperty:", dict.hasOwnProperty);  // undefined
console.log("'toString' in dict:", 'toString' in dict);     // false

// Object.create with property descriptors
const configured = Object.create(Object.prototype, {
    readOnly: {
        value: 42,
        writable: false,
        enumerable: true
    },
    computed: {
        get() { return this.readOnly * 2; },
        enumerable: true
    }
});

console.log("\nConfigured object:");
console.log("  readOnly:", configured.readOnly);
console.log("  computed:", configured.computed);
console.log("");

// ============================================================================
// Object.assign() Internals
// ============================================================================
console.log("─── Object.assign() Internals ───\n");

const source = {
    normal: 1,
    get computed() { return this.normal * 2; }
};

Object.defineProperty(source, 'hidden', {
    value: 'secret',
    enumerable: false
});

const target = {};
Object.assign(target, source);

console.log("Source:", source);
console.log("Target after assign:", target);
console.log("target.computed:", target.computed);  // Copied as value, not getter!
console.log("target.hidden:", target.hidden);      // undefined (non-enumerable)

// Copying with descriptors
function assignWithDescriptors(target, ...sources) {
    for (const source of sources) {
        for (const key of Reflect.ownKeys(source)) {
            const descriptor = Object.getOwnPropertyDescriptor(source, key);
            Object.defineProperty(target, key, descriptor);
        }
    }
    return target;
}

const properCopy = assignWithDescriptors({}, source);
console.log("\nWith descriptor copy:");
console.log("  properCopy.computed:", Object.getOwnPropertyDescriptor(properCopy, 'computed'));
console.log("");

// ============================================================================
// Property Lookup Algorithm
// ============================================================================
console.log("─── Property Lookup Algorithm ───\n");

const lookupDemo = `
When accessing obj.prop:

1. Check if obj has own property 'prop'
   → If found with data descriptor, return value
   → If found with getter, call getter

2. Get [[Prototype]] of obj
   → If null, return undefined
   → Repeat step 1 with prototype

3. Continue up the chain until:
   → Property found
   → Null prototype reached (return undefined)

Property shadowing:
- Own property shadows inherited
- Can access inherited via Object.getPrototypeOf()
`;

console.log(lookupDemo);

// ============================================================================
// Object.setPrototypeOf() Implications
// ============================================================================
console.log("─── Prototype Modification ───\n");

console.log("⚠️  Performance Warning:");
console.log("Changing [[Prototype]] after creation is slow!");
console.log("Engines optimize based on prototype shape.\n");

const obj1 = { a: 1 };
const newProto = { b: 2 };

// Slow! Avoid in hot paths
Object.setPrototypeOf(obj1, newProto);
console.log("obj1.b after setPrototypeOf:", obj1.b);

// Better: Create with correct prototype
const obj2 = Object.create(newProto);
obj2.a = 1;
console.log("obj2.b with Object.create:", obj2.b);
console.log("");

// ============================================================================
// Object Shape (Hidden Classes)
// ============================================================================
console.log("─── Object Shape / Hidden Classes ───\n");

const shapeDemo = `
V8 (and other engines) use hidden classes for optimization:

// Same shape - optimized
const obj1 = { a: 1, b: 2 };
const obj2 = { a: 3, b: 4 };  // Same hidden class as obj1

// Different shape - less optimized
const obj3 = { a: 1 };
obj3.b = 2;  // Different hidden class

// Best practice:
// Initialize all properties in constructor
class Point {
    constructor(x, y) {
        this.x = x;  // Always initialize
        this.y = y;  // in same order
    }
}
`;

console.log(shapeDemo);

// ============================================================================
// Object Keys and Enumeration
// ============================================================================
console.log("─── Object Key Enumeration ───\n");

const symKey = Symbol('symbol');
const demo = {
    b: 2,
    a: 1,
    2: 'two',
    1: 'one',
    [symKey]: 'symbol value'
};

Object.defineProperty(demo, 'hidden', {
    value: 'hidden',
    enumerable: false
});

console.log("Object.keys():", Object.keys(demo));
console.log("Object.values():", Object.values(demo));
console.log("Object.entries():", Object.entries(demo));
console.log("Object.getOwnPropertyNames():", Object.getOwnPropertyNames(demo));
console.log("Object.getOwnPropertySymbols():", Object.getOwnPropertySymbols(demo));
console.log("Reflect.ownKeys():", Reflect.ownKeys(demo));

console.log("\nKey order:");
console.log("  1. Integer indices (ascending)");
console.log("  2. String keys (insertion order)");
console.log("  3. Symbol keys (insertion order)");
console.log("");

// ============================================================================
// Object Comparison and Identity
// ============================================================================
console.log("─── Object Comparison ───\n");

const a = { x: 1 };
const b = { x: 1 };
const c = a;

console.log("a === b:", a === b);       // false (different references)
console.log("a === c:", a === c);       // true (same reference)
console.log("Object.is(a, b):", Object.is(a, b));  // false

// Deep equality
function deepEqual(obj1, obj2) {
    if (obj1 === obj2) return true;

    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return false;
    if (obj1 === null || obj2 === null) return false;

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    return keys1.every(key => deepEqual(obj1[key], obj2[key]));
}

console.log("deepEqual(a, b):", deepEqual(a, b));
console.log("deepEqual({x:{y:1}}, {x:{y:1}}):", deepEqual({ x: { y: 1 } }, { x: { y: 1 } }));
console.log("");

// ============================================================================
// Object Cloning Strategies
// ============================================================================
console.log("─── Object Cloning ───\n");

const original = {
    primitive: 42,
    nested: { deep: true },
    date: new Date(),
    fn: function() { return this.primitive; },
    [Symbol('sym')]: 'symbol value'
};

// Shallow copy
const shallowSpread = { ...original };
const shallowAssign = Object.assign({}, original);

// JSON (loses functions, symbols, dates)
const jsonCopy = JSON.parse(JSON.stringify(original));

// Deep clone with structuredClone (modern)
// const structuredCopy = structuredClone(original);  // Loses functions

// Custom deep clone
function deepClone(obj, seen = new WeakMap()) {
    if (obj === null || typeof obj !== 'object') return obj;

    if (seen.has(obj)) return seen.get(obj);

    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof RegExp) return new RegExp(obj);
    if (obj instanceof Map) {
        const result = new Map();
        seen.set(obj, result);
        obj.forEach((v, k) => result.set(deepClone(k, seen), deepClone(v, seen)));
        return result;
    }
    if (obj instanceof Set) {
        const result = new Set();
        seen.set(obj, result);
        obj.forEach(v => result.add(deepClone(v, seen)));
        return result;
    }

    const clone = Array.isArray(obj) ? [] : {};
    seen.set(obj, clone);

    for (const key of Reflect.ownKeys(obj)) {
        clone[key] = deepClone(obj[key], seen);
    }

    return clone;
}

const deepCopy = deepClone(original);
console.log("Original nested:", original.nested.deep);
console.log("Shallow copy nested:", shallowSpread.nested.deep);

original.nested.deep = false;
console.log("After modifying original:");
console.log("  Shallow copy nested:", shallowSpread.nested.deep);  // false
console.log("  Deep copy nested:", deepCopy.nested.deep);           // true
console.log("");

// ============================================================================
// WeakMap and Object Identity
// ============================================================================
console.log("─── WeakMap for Object Metadata ───\n");

const metadata = new WeakMap();

class DataObject {
    constructor(data) {
        this.data = data;
        metadata.set(this, {
            createdAt: new Date(),
            accessCount: 0
        });
    }

    getData() {
        const meta = metadata.get(this);
        meta.accessCount++;
        return this.data;
    }

    getMetadata() {
        return metadata.get(this);
    }
}

const obj = new DataObject({ value: 42 });
obj.getData();
obj.getData();
console.log("Metadata:", obj.getMetadata());
console.log("Visible properties:", Object.keys(obj));  // Only 'data'
console.log("");

// ============================================================================
// Object Internals Cheat Sheet
// ============================================================================
console.log("╔══════════════════════════════════════════════════════════════════╗");
console.log("║           OBJECT INTERNALS CHEAT SHEET                          ║");
console.log("╠══════════════════════════════════════════════════════════════════╣");
console.log("║                                                                  ║");
console.log("║  PROTOTYPE:                                                      ║");
console.log("║  Object.getPrototypeOf(obj)                                     ║");
console.log("║  Object.setPrototypeOf(obj, proto) ⚠️ slow                      ║");
console.log("║  Object.create(proto, descriptors)                              ║");
console.log("║                                                                  ║");
console.log("║  KEY ENUMERATION:                                                ║");
console.log("║  Object.keys() - own enumerable strings                         ║");
console.log("║  Object.getOwnPropertyNames() - own strings                     ║");
console.log("║  Object.getOwnPropertySymbols() - own symbols                   ║");
console.log("║  Reflect.ownKeys() - all own keys                               ║");
console.log("║                                                                  ║");
console.log("║  CLONING:                                                        ║");
console.log("║  { ...obj } - shallow                                           ║");
console.log("║  Object.assign({}, obj) - shallow                               ║");
console.log("║  JSON.parse(JSON.stringify()) - loses functions/symbols         ║");
console.log("║  structuredClone(obj) - deep, loses functions                   ║");
console.log("║                                                                  ║");
console.log("║  KEY ORDER:                                                      ║");
console.log("║  1. Integer indices (ascending)                                 ║");
console.log("║  2. String keys (insertion order)                               ║");
console.log("║  3. Symbol keys (insertion order)                               ║");
console.log("║                                                                  ║");
console.log("╚══════════════════════════════════════════════════════════════════╝\n");

module.exports = {
    assignWithDescriptors,
    deepEqual,
    deepClone,
    DataObject
};

console.log("═══ Next: Meta-programming Interview Q&A ═══");
console.log("Run: node deep-dive/javaScript-meta-programming/08-interview-qa.js");
