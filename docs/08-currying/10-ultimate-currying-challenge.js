/**
 * CHALLENGE 10: Ultimate Currying Challenge
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Master these currying patterns for interviews:                             ║
 * ║                                                                            ║
 * ║ 1. Implement curry from scratch                                            ║
 * ║ 2. Curried pipe/compose                                                    ║
 * ║ 3. Curried object accessors (prop, map)                                    ║
 * ║ 4. Curried conditionals (ifElse)                                           ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// Challenge 1: Implement curry from scratch
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    return (...moreArgs) => curried(...args, ...moreArgs);
  };
}

var multiply3 = curry((a, b, c) => a * b * c);
console.log('A:', multiply3(2)(3)(4));

// Challenge 2: Curried pipe
var pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);

var add = a => b => a + b;
var mult = a => b => a * b;

var process = pipe(
  add(10),
  mult(2),
  add(-5)
);

console.log('B:', process(5));  // ((5+10)*2)-5

// Challenge 3: Curried object access
var prop = key => obj => obj[key];
var map = fn => arr => arr.map(fn);

var users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Charlie', age: 35 }
];

var getNames = map(prop('name'));
console.log('C:', getNames(users));

// Challenge 4: Curried conditional
var ifElse = predicate => onTrue => onFalse => value =>
  predicate(value) ? onTrue(value) : onFalse(value);

var isEven = n => n % 2 === 0;
var double = n => n * 2;
var triple = n => n * 3;

var processNumber = ifElse(isEven)(double)(triple);

console.log('D:', processNumber(4));  // even: 4*2=8
console.log('E:', processNumber(5));  // odd: 5*3=15

/**
 * OUTPUT:
 *   A: 24
 *   B: 25
 *   C: [ 'Alice', 'Bob', 'Charlie' ]
 *   D: 8
 *   E: 15
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ INTERVIEW IMPLEMENTATIONS TO MEMORIZE                                      ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ 1. CURRY (most important!)                                                 ║
 * ║    const curry = fn => function c(...a) {                                  ║
 * ║      return a.length >= fn.length ? fn(...a) : (...b) => c(...a, ...b);    ║
 * ║    };                                                                      ║
 * ║                                                                            ║
 * ║ 2. PIPE                                                                    ║
 * ║    const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);            ║
 * ║                                                                            ║
 * ║ 3. COMPOSE                                                                 ║
 * ║    const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);    ║
 * ║                                                                            ║
 * ║ 4. PROP                                                                    ║
 * ║    const prop = key => obj => obj[key];                                    ║
 * ║                                                                            ║
 * ║ 5. MAP (curried)                                                           ║
 * ║    const map = fn => arr => arr.map(fn);                                   ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ MORE USEFUL CURRIED UTILITIES                                               │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // Array                                                                  │
 * │   const filter = pred => arr => arr.filter(pred);                           │
 * │   const reduce = (fn, init) => arr => arr.reduce(fn, init);                 │
 * │   const find = pred => arr => arr.find(pred);                               │
 * │   const sort = fn => arr => [...arr].sort(fn);                              │
 * │   const take = n => arr => arr.slice(0, n);                                 │
 * │                                                                             │
 * │   // Comparison                                                             │
 * │   const eq = a => b => a === b;                                             │
 * │   const gt = a => b => b > a;                                               │
 * │   const lt = a => b => b < a;                                               │
 * │   const gte = a => b => b >= a;                                             │
 * │                                                                             │
 * │   // Logic                                                                  │
 * │   const not = fn => x => !fn(x);                                            │
 * │   const and = f => g => x => f(x) && g(x);                                  │
 * │   const or = f => g => x => f(x) || g(x);                                   │
 * │                                                                             │
 * │   // Object                                                                 │
 * │   const path = keys => obj => keys.reduce((o, k) => o?.[k], obj);           │
 * │   const pick = keys => obj => keys.reduce((a, k) => ({...a, [k]: obj[k]}),  │
 * │                                           {});                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ CURRYING CHEAT SHEET                                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌────────────────────┬─────────────────────────────────────────────┐      │
 * │   │ Pattern            │ Example                                     │      │
 * │   ├────────────────────┼─────────────────────────────────────────────┤      │
 * │   │ Basic curry        │ a => b => c => a + b + c                    │      │
 * │   │ Generic curry      │ curry(fn)                                   │      │
 * │   │ Infinite curry     │ sum(1)(2)(3)() with terminator              │      │
 * │   │ With placeholder   │ curry(fn)(_, 2)(1)                          │      │
 * │   │ With this          │ curryThis(fn) preserving context            │      │
 * │   │ Composition        │ compose(f, g)(x) = f(g(x))                  │      │
 * │   │ Pipeline           │ pipe(f, g)(x) = g(f(x))                     │      │
 * │   │ Point-free         │ map(prop('name'))                           │      │
 * │   │ Conditional        │ ifElse(pred)(onT)(onF)(val)                 │      │
 * │   └────────────────────┴─────────────────────────────────────────────┘      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Currying transforms a multi-argument function into a chain of              │
 * │  single-argument functions. Each call returns a new function until          │
 * │  all arguments are collected, then the original function executes.          │
 * │                                                                             │
 * │  Implementation:                                                            │
 * │  const curry = fn => function c(...args) {                                  │
 * │    return args.length >= fn.length                                          │
 * │      ? fn(...args)                                                          │
 * │      : (...more) => c(...args, ...more);                                    │
 * │  };                                                                         │
 * │                                                                             │
 * │  Benefits:                                                                  │
 * │  1. Partial application - pre-fill some arguments                           │
 * │  2. Function composition - curried functions compose well                   │
 * │  3. Reusability - create specialized functions from general ones            │
 * │  4. Point-free style - define transformations without naming data           │
 * │                                                                             │
 * │  Used in: Ramda, Lodash/fp, functional React patterns, Redux selectors"     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/06-currying/10-ultimate-currying-challenge.js
 */
