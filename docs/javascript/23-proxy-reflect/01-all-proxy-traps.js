/**
 * PROXY & REFLECT: 01 - All Proxy Traps (Complete Reference)
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ 13 PROXY TRAPS - COMPLETE REFERENCE                                       ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A Proxy can intercept 13 different fundamental operations on objects.     ║
 * ║ Each operation has a corresponding "trap" method in the handler.          ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// COMPLETE TRAP LIST
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ ALL 13 PROXY TRAPS                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌─────────────────────────┬───────────────────────────────────────────┐   │
 * │   │ Trap                    │ Intercepts                                │   │
 * │   ├─────────────────────────┼───────────────────────────────────────────┤   │
 * │   │ get                     │ property read                             │   │
 * │   │ set                     │ property write                            │   │
 * │   │ has                     │ "in" operator                             │   │
 * │   │ deleteProperty          │ "delete" operator                         │   │
 * │   │ ownKeys                 │ Object.keys, for...in, etc.               │   │
 * │   │ getOwnPropertyDescriptor│ Object.getOwnPropertyDescriptor           │   │
 * │   │ defineProperty          │ Object.defineProperty                     │   │
 * │   │ preventExtensions       │ Object.preventExtensions                  │   │
 * │   │ isExtensible            │ Object.isExtensible                       │   │
 * │   │ getPrototypeOf          │ Object.getPrototypeOf, instanceof         │   │
 * │   │ setPrototypeOf          │ Object.setPrototypeOf                     │   │
 * │   │ apply                   │ function call                             │   │
 * │   │ construct               │ "new" operator                            │   │
 * │   └─────────────────────────┴───────────────────────────────────────────┘   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 1. GET TRAP
// ═══════════════════════════════════════════════════════════════════════════════

console.log('=== 1. GET Trap ===\n');

const getExample = {
  name: 'Alice',
  age: 30
};

const getProxy = new Proxy(getExample, {
  get(target, property, receiver) {
    if (property in target) {
      return target[property];
    }
    return `Property "${property}" doesn't exist`;
  }
});

console.log('A:', getProxy.name);     // Alice
console.log('B:', getProxy.unknown);  // Property "unknown" doesn't exist


// ═══════════════════════════════════════════════════════════════════════════════
// 2. SET TRAP
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== 2. SET Trap ===\n');

const setExample = { count: 0 };

const setProxy = new Proxy(setExample, {
  set(target, property, value, receiver) {
    if (property === 'count' && typeof value !== 'number') {
      throw new TypeError('count must be a number');
    }
    target[property] = value;
    console.log(`  Set ${property} = ${value}`);
    return true;
  }
});

setProxy.count = 5;
setProxy.name = 'Counter';


// ═══════════════════════════════════════════════════════════════════════════════
// 3. HAS TRAP
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== 3. HAS Trap ===\n');

const range = { start: 1, end: 10 };

const rangeProxy = new Proxy(range, {
  has(target, property) {
    // Make "in" operator check if number is in range
    if (typeof property === 'string') {
      const num = Number(property);
      if (!isNaN(num)) {
        return num >= target.start && num <= target.end;
      }
    }
    return property in target;
  }
});

console.log('C: 5 in range:', 5 in rangeProxy);   // true
console.log('D: 15 in range:', 15 in rangeProxy); // false


// ═══════════════════════════════════════════════════════════════════════════════
// 4. DELETEPROPERTY TRAP
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== 4. DELETEPROPERTY Trap ===\n');

const protectedObj = { id: 1, name: 'Test', data: 'value' };

const deleteProxy = new Proxy(protectedObj, {
  deleteProperty(target, property) {
    if (property === 'id') {
      console.log('  Cannot delete id - protected!');
      return false;
    }
    delete target[property];
    console.log(`  Deleted: ${property}`);
    return true;
  }
});

delete deleteProxy.data;  // Deleted: data
delete deleteProxy.id;    // Cannot delete - protected


// ═══════════════════════════════════════════════════════════════════════════════
// 5. OWNKEYS TRAP
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== 5. OWNKEYS Trap ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ ownKeys(target)                                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Intercepts:                                                                 │
 * │   • Object.keys()                                                           │
 * │   • Object.getOwnPropertyNames()                                            │
 * │   • Object.getOwnPropertySymbols()                                          │
 * │   • for...in loop                                                           │
 * │                                                                             │
 * │ MUST return: Array of strings and/or Symbols                                │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const withPrivate = {
  public1: 'visible',
  public2: 'also visible',
  _private1: 'hidden',
  _private2: 'also hidden'
};

const keysProxy = new Proxy(withPrivate, {
  ownKeys(target) {
    // Filter out keys starting with underscore
    return Object.keys(target).filter(key => !key.startsWith('_'));
  }
});

console.log('E: Object.keys hides private:');
console.log('  ', Object.keys(keysProxy));  // ['public1', 'public2']


// ═══════════════════════════════════════════════════════════════════════════════
// 6. GETOWNPROPERTYDESCRIPTOR TRAP
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== 6. GETOWNPROPERTYDESCRIPTOR Trap ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ getOwnPropertyDescriptor(target, property)                                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Intercepts: Object.getOwnPropertyDescriptor()                               │
 * │                                                                             │
 * │ MUST return: Property descriptor object or undefined                        │
 * │                                                                             │
 * │ NOTE: Often needed with ownKeys for proper Object.keys() behavior           │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const descObj = { x: 1, _y: 2 };

const descProxy = new Proxy(descObj, {
  ownKeys(target) {
    return Object.keys(target).filter(k => !k.startsWith('_'));
  },
  getOwnPropertyDescriptor(target, property) {
    if (property.startsWith('_')) {
      return undefined;  // Hide private properties completely
    }
    return Object.getOwnPropertyDescriptor(target, property);
  }
});

console.log('F: Property descriptor for x:', Object.getOwnPropertyDescriptor(descProxy, 'x'));
console.log('G: Property descriptor for _y:', Object.getOwnPropertyDescriptor(descProxy, '_y'));


// ═══════════════════════════════════════════════════════════════════════════════
// 7. DEFINEPROPERTY TRAP
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== 7. DEFINEPROPERTY Trap ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ defineProperty(target, property, descriptor)                                │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Intercepts:                                                                 │
 * │   • Object.defineProperty()                                                 │
 * │   • Object.defineProperties()                                               │
 * │                                                                             │
 * │ MUST return: boolean                                                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const defineObj = {};

const defineProxy = new Proxy(defineObj, {
  defineProperty(target, property, descriptor) {
    console.log(`  Defining property: ${property}`);
    return Object.defineProperty(target, property, descriptor);
  }
});

Object.defineProperty(defineProxy, 'x', { value: 10, writable: true });
console.log('H: defineProxy.x:', defineProxy.x);


// ═══════════════════════════════════════════════════════════════════════════════
// 8 & 9. PREVENTEXTENSIONS & ISEXTENSIBLE TRAPS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== 8 & 9. PREVENTEXTENSIONS & ISEXTENSIBLE Traps ===\n');

const extensibleObj = { a: 1 };

const extensibleProxy = new Proxy(extensibleObj, {
  preventExtensions(target) {
    console.log('  Preventing extensions');
    Object.preventExtensions(target);
    return true;
  },
  isExtensible(target) {
    console.log('  Checking isExtensible');
    return Object.isExtensible(target);
  }
});

console.log('I: isExtensible:', Object.isExtensible(extensibleProxy));
Object.preventExtensions(extensibleProxy);
console.log('J: isExtensible after:', Object.isExtensible(extensibleProxy));


// ═══════════════════════════════════════════════════════════════════════════════
// 10 & 11. GETPROTOTYPEOF & SETPROTOTYPEOF TRAPS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== 10 & 11. GETPROTOTYPEOF & SETPROTOTYPEOF Traps ===\n');

const protoObj = {};
const proto = { greet: () => 'Hello' };

const protoProxy = new Proxy(protoObj, {
  getPrototypeOf(target) {
    console.log('  Getting prototype');
    return Object.getPrototypeOf(target);
  },
  setPrototypeOf(target, prototype) {
    console.log('  Setting prototype');
    return Object.setPrototypeOf(target, prototype);
  }
});

Object.setPrototypeOf(protoProxy, proto);
console.log('K: getPrototypeOf:', Object.getPrototypeOf(protoProxy) === proto);


// ═══════════════════════════════════════════════════════════════════════════════
// 12. APPLY TRAP (Functions Only)
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== 12. APPLY Trap (Functions Only) ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ apply(target, thisArg, argumentsList)                                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Intercepts: Function calls                                                  │
 * │                                                                             │
 * │   proxy()                                                                   │
 * │   proxy.call(obj, ...args)                                                  │
 * │   proxy.apply(obj, args)                                                    │
 * │   Reflect.apply(proxy, obj, args)                                           │
 * │                                                                             │
 * │ NOTE: Target MUST be a function!                                            │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

function sum(a, b) {
  return a + b;
}

const sumProxy = new Proxy(sum, {
  apply(target, thisArg, args) {
    console.log(`  Calling sum with args: [${args}]`);
    return target.apply(thisArg, args);
  }
});

console.log('L: sumProxy(3, 4):', sumProxy(3, 4));


// ═══════════════════════════════════════════════════════════════════════════════
// 13. CONSTRUCT TRAP (Constructor Functions Only)
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== 13. CONSTRUCT Trap (Constructor Functions Only) ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ construct(target, argumentsList, newTarget)                                 │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Intercepts: new operator                                                    │
 * │                                                                             │
 * │   new proxy(...args)                                                        │
 * │   Reflect.construct(proxy, args)                                            │
 * │                                                                             │
 * │ MUST return: An object (the new instance)                                   │
 * │ NOTE: Target MUST be a constructor function!                                │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

function Person(name) {
  this.name = name;
}

const PersonProxy = new Proxy(Person, {
  construct(target, args, newTarget) {
    console.log(`  Creating Person with name: ${args[0]}`);
    return new target(...args);
  }
});

const person = new PersonProxy('Alice');
console.log('M: person.name:', person.name);


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Proxy has 13 traps that intercept fundamental object operations:           │
 * │                                                                             │
 * │ PROPERTY ACCESS:                                                            │
 * │ • get: property read (obj.prop, obj[prop])                                  │
 * │ • set: property write (obj.prop = value)                                    │
 * │ • has: 'in' operator (prop in obj)                                          │
 * │ • deleteProperty: delete operator (delete obj.prop)                         │
 * │                                                                             │
 * │ PROPERTY ENUMERATION:                                                       │
 * │ • ownKeys: Object.keys, for...in                                            │
 * │ • getOwnPropertyDescriptor: Object.getOwnPropertyDescriptor                 │
 * │ • defineProperty: Object.defineProperty                                     │
 * │                                                                             │
 * │ OBJECT OPERATIONS:                                                          │
 * │ • preventExtensions: Object.preventExtensions                               │
 * │ • isExtensible: Object.isExtensible                                         │
 * │ • getPrototypeOf: Object.getPrototypeOf, instanceof                         │
 * │ • setPrototypeOf: Object.setPrototypeOf                                     │
 * │                                                                             │
 * │ FUNCTION OPERATIONS (for function proxies):                                 │
 * │ • apply: function calls (fn(), fn.call(), fn.apply())                       │
 * │ • construct: new operator (new Fn())                                        │
 * │                                                                             │
 * │ These traps allow complete control over how objects behave."                │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/23-proxy-reflect/01-all-proxy-traps.js
 */
