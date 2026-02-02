/**
 * SYMBOLS: 02 - Well-Known Symbols
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ BUILT-IN WELL-KNOWN SYMBOLS                                               ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ JavaScript has built-in symbols that allow you to customize how            ║
 * ║ objects behave with built-in language features!                            ║
 * ║                                                                            ║
 * ║ These are the "hooks" into JavaScript's internal operations.               ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// OVERVIEW OF WELL-KNOWN SYMBOLS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('=== Well-Known Symbols Overview ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ IMPORTANT WELL-KNOWN SYMBOLS                                                │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌─────────────────────────┬────────────────────────────────────────┐      │
 * │   │ Symbol                  │ Customizes                             │      │
 * │   ├─────────────────────────┼────────────────────────────────────────┤      │
 * │   │ Symbol.iterator         │ for...of loops                         │      │
 * │   │ Symbol.toStringTag      │ Object.prototype.toString()            │      │
 * │   │ Symbol.toPrimitive      │ Type coercion                          │      │
 * │   │ Symbol.hasInstance      │ instanceof operator                    │      │
 * │   │ Symbol.species          │ Derived object creation                │      │
 * │   │ Symbol.isConcatSpreadable│ Array.prototype.concat()              │      │
 * │   │ Symbol.match            │ String.prototype.match()               │      │
 * │   │ Symbol.replace          │ String.prototype.replace()             │      │
 * │   │ Symbol.search           │ String.prototype.search()              │      │
 * │   │ Symbol.split            │ String.prototype.split()               │      │
 * │   └─────────────────────────┴────────────────────────────────────────┘      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// SYMBOL.ITERATOR - MAKE OBJECTS ITERABLE
// ═══════════════════════════════════════════════════════════════════════════════

console.log('=== Symbol.iterator ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Symbol.iterator - Make any object iterable!                                 │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Define [Symbol.iterator]() to make object work with:                      │
 * │   • for...of loops                                                          │
 * │   • Array.from()                                                            │
 * │   • Spread operator (...)                                                   │
 * │   • Destructuring                                                           │
 * │                                                                             │
 * │   The method must return an iterator object with next() method.             │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Make a Range class iterable
class Range {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

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
}

const range = new Range(1, 5);

console.log('A: for...of loop:');
for (const num of range) {
  console.log('  ', num);
}

console.log('\nB: Spread operator:');
console.log('  ', [...range]);

console.log('\nC: Array.from:');
console.log('  ', Array.from(range));


// ═══════════════════════════════════════════════════════════════════════════════
// SYMBOL.TOSTRINGTAG - CUSTOMIZE TYPE STRING
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Symbol.toStringTag ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Symbol.toStringTag - Customize [object X] string                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   When you call Object.prototype.toString() on an object,                   │
 * │   it returns "[object Type]".                                               │
 * │                                                                             │
 * │   You can customize "Type" using Symbol.toStringTag!                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

class MyClass {
  get [Symbol.toStringTag]() {
    return 'MyCustomClass';
  }
}

const obj = new MyClass();

console.log('D: Default toString:');
console.log('  Regular object:', Object.prototype.toString.call({}));
console.log('  Array:', Object.prototype.toString.call([]));
console.log('  Our class:', Object.prototype.toString.call(obj));


// ═══════════════════════════════════════════════════════════════════════════════
// SYMBOL.TOPRIMITIVE - CUSTOMIZE TYPE COERCION
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Symbol.toPrimitive ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Symbol.toPrimitive - Control type coercion                                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Receives a "hint" argument:                                               │
 * │   • "number" - when numeric conversion needed (+obj, Math.floor(obj))       │
 * │   • "string" - when string conversion needed (String(obj), `${obj}`)        │
 * │   • "default" - when operator could be either (+, ==)                       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

class Temperature {
  constructor(celsius) {
    this.celsius = celsius;
  }

  [Symbol.toPrimitive](hint) {
    console.log(`    (hint: "${hint}")`);
    switch (hint) {
      case 'number':
        return this.celsius;
      case 'string':
        return `${this.celsius}°C`;
      default:
        return this.celsius;  // Default to number for + and ==
    }
  }
}

const temp = new Temperature(25);

console.log('E: toPrimitive with different hints:');
console.log('  +temp (number hint):', +temp);
console.log('  String(temp) (string hint):', String(temp));
console.log('  temp + 10 (default hint):', temp + 10);


// ═══════════════════════════════════════════════════════════════════════════════
// SYMBOL.HASINSTANCE - CUSTOMIZE INSTANCEOF
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Symbol.hasInstance ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Symbol.hasInstance - Customize instanceof operator                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   obj instanceof Class                                                      │
 * │                                                                             │
 * │   Normally checks prototype chain.                                          │
 * │   With [Symbol.hasInstance], you define your own logic!                     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

class Even {
  static [Symbol.hasInstance](value) {
    return typeof value === 'number' && value % 2 === 0;
  }
}

console.log('F: Custom instanceof:');
console.log('  4 instanceof Even:', 4 instanceof Even);   // true
console.log('  3 instanceof Even:', 3 instanceof Even);   // false
console.log('  "hi" instanceof Even:', "hi" instanceof Even); // false


// ═══════════════════════════════════════════════════════════════════════════════
// SYMBOL.ISCONCATSPREADABLE - CUSTOMIZE CONCAT
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Symbol.isConcatSpreadable ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Symbol.isConcatSpreadable - Control Array.concat() behavior                 │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   • Arrays are spread by default in concat()                                │
 * │   • Set [Symbol.isConcatSpreadable] = false to prevent spreading            │
 * │   • Array-like objects can be made spreadable by setting it to true         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Prevent array from being spread
const noSpread = [3, 4];
noSpread[Symbol.isConcatSpreadable] = false;

console.log('G: isConcatSpreadable:');
console.log('  [1, 2].concat([3, 4]):', [1, 2].concat([3, 4]));           // [1,2,3,4]
console.log('  [1, 2].concat(noSpread):', [1, 2].concat(noSpread));       // [1,2,[3,4]]

// Make array-like spreadable
const arrayLike = {
  0: 'a',
  1: 'b',
  length: 2,
  [Symbol.isConcatSpreadable]: true
};

console.log('  [1].concat(arrayLike):', [1].concat(arrayLike));  // [1, 'a', 'b']


// ═══════════════════════════════════════════════════════════════════════════════
// SYMBOL.SPECIES - DERIVED CONSTRUCTOR
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Symbol.species ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Symbol.species - Control derived object type                                │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   When built-in methods create new objects (like map(), filter()),          │
 * │   they use Symbol.species to determine the constructor.                     │
 * │                                                                             │
 * │   Useful when extending built-in classes but want methods to                │
 * │   return the parent type instead of your subclass.                          │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

class MyArray extends Array {
  static get [Symbol.species]() {
    return Array;  // Methods return plain Arrays
  }
}

const myArr = new MyArray(1, 2, 3);
const mapped = myArr.map(x => x * 2);

console.log('H: Symbol.species:');
console.log('  myArr instanceof MyArray:', myArr instanceof MyArray);  // true
console.log('  mapped instanceof MyArray:', mapped instanceof MyArray);  // false!
console.log('  mapped instanceof Array:', mapped instanceof Array);    // true


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Well-known symbols are built-in symbols that customize JavaScript's        │
 * │ internal behaviors. Most important ones:                                    │
 * │                                                                             │
 * │ Symbol.iterator:                                                            │
 * │ • Makes objects work with for...of, spread, Array.from                      │
 * │ • Must return an iterator object with next() method                         │
 * │                                                                             │
 * │ Symbol.toStringTag:                                                         │
 * │ • Customizes Object.prototype.toString() output                             │
 * │ • Returns custom type string like [object MyClass]                          │
 * │                                                                             │
 * │ Symbol.toPrimitive:                                                         │
 * │ • Controls type coercion (to string or number)                              │
 * │ • Receives 'hint': 'number', 'string', or 'default'                         │
 * │                                                                             │
 * │ Symbol.hasInstance:                                                         │
 * │ • Customizes instanceof operator behavior                                   │
 * │ • Allows duck typing: x instanceof MyClass can use any logic                │
 * │                                                                             │
 * │ These symbols are the 'hooks' that let you extend JavaScript's              │
 * │ built-in behavior in powerful ways."                                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/24-symbols/02-well-known-symbols.js
 */
