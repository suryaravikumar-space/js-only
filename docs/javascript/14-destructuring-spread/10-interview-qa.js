/**
 * CHALLENGE 10: Interview Q&A - Destructuring & Spread
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ MASTER THESE QUESTIONS FOR YOUR INTERVIEW                                  ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// Q1: What is destructuring and why use it?
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ Q1: What is destructuring? ═══\n");

/**
 * ANSWER:
 *
 * "Destructuring is an ES6 feature that extracts values from arrays or objects
 * into distinct variables in a single statement.
 *
 * BENEFITS:
 * 1. Cleaner code - less repetitive property access
 * 2. Self-documenting - shows expected structure
 * 3. Default values - built-in defaults for missing values
 * 4. Works in function parameters - named parameters pattern
 *
 * ARRAY: Position-based extraction
 * const [a, b] = [1, 2];
 *
 * OBJECT: Name-based extraction
 * const { name, age } = person;
 *
 * It's syntactic sugar for:
 * const name = person.name;
 * const age = person.age;"
 */

const { name, age } = { name: 'John', age: 30 };
console.log('Destructured:', name, age);
console.log('');


// ═══════════════════════════════════════════════════════════════════════════════
// Q2: What's the difference between spread and rest?
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ Q2: Spread vs Rest? ═══\n");

/**
 * ANSWER:
 *
 * "They use the same syntax (...) but do OPPOSITE things:
 *
 * SPREAD: Expands/unpacks elements
 * - Used in array/object literals
 * - Used in function calls
 * - Example: [...arr], {...obj}, fn(...args)
 *
 * REST: Collects/packs elements
 * - Used in destructuring
 * - Used in function parameters
 * - Example: const [a, ...rest] = arr; function(...args)
 *
 * Memory trick:
 * - SPREAD = expanding outward (like spreading butter)
 * - REST = gathering the rest"
 */

// SPREAD
const spreadExample = [...[1, 2], 3]; // [1, 2, 3]
console.log('Spread:', spreadExample);

// REST
const [first, ...restExample] = [1, 2, 3]; // first=1, restExample=[2,3]
console.log('Rest:', first, restExample);
console.log('');


// ═══════════════════════════════════════════════════════════════════════════════
// Q3: Does spread create a deep copy?
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ Q3: Deep or shallow copy? ═══\n");

/**
 * ANSWER:
 *
 * "Spread creates a SHALLOW copy, not deep.
 *
 * - Primitives: Copied by value (safe)
 * - Objects/Arrays: Reference copied (shared!)
 *
 * For deep copy, use:
 * - JSON.parse(JSON.stringify(obj)) - loses functions, dates
 * - structuredClone(obj) - modern, handles more types
 * - lodash.cloneDeep(obj) - library solution
 *
 * This is a common interview gotcha!"
 */

const original = { a: 1, nested: { b: 2 } };
const shallow = { ...original };
shallow.a = 99;          // Safe - primitives copied
shallow.nested.b = 99;   // Danger - nested is shared!

console.log('Original a:', original.a);          // Still 1
console.log('Original nested.b:', original.nested.b);  // Now 99!
console.log('');


// ═══════════════════════════════════════════════════════════════════════════════
// Q4: Why does function({a} = {}) need the = {}?
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ Q4: Why = {} default? ═══\n");

/**
 * ANSWER:
 *
 * "Without = {}, calling the function with no arguments throws TypeError.
 *
 * function fn({ a }) { }
 * fn();  // TypeError: Cannot destructure 'a' of undefined
 *
 * The = {} provides an empty object default for the ENTIRE parameter.
 * If no argument passed, it destructures {} instead of undefined.
 *
 * function fn({ a = 1 } = {}) { }
 * fn();  // Works! a = 1
 *
 * Two levels of defaults:
 * - { a = 1 }: Default for property 'a' if missing
 * - = {}: Default for entire parameter if undefined"
 */

function safe({ a = 'default' } = {}) {
  console.log('a:', a);
}
safe();          // Works: 'default'
safe({});        // Works: 'default'
safe({ a: 1 });  // Works: 1
console.log('');


// ═══════════════════════════════════════════════════════════════════════════════
// Q5: When do default values NOT apply?
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ Q5: Default value gotcha? ═══\n");

/**
 * ANSWER:
 *
 * "Defaults only apply when value is UNDEFINED, not any falsy value.
 *
 * Common mistake: thinking defaults work for null, 0, '', or false.
 *
 * const { a = 'default' } = { a: null };  // a = null, NOT 'default'
 * const { b = 'default' } = { b: 0 };     // b = 0, NOT 'default'
 * const { c = 'default' } = { c: '' };    // c = '', NOT 'default'
 *
 * For falsy fallback, use:
 * - || operator (catches all falsy)
 * - ?? operator (catches only null/undefined)"
 */

const { val1 = 'X' } = { val1: undefined }; // 'X'
const { val2 = 'X' } = { val2: null };      // null
const { val3 = 'X' } = { val3: 0 };         // 0

console.log('undefined:', val1);  // 'X' (default applied)
console.log('null:', val2);       // null (NOT default)
console.log('0:', val3);          // 0 (NOT default)
console.log('');


// ═══════════════════════════════════════════════════════════════════════════════
// Q6: How to use destructuring in React?
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ Q6: Destructuring in React? ═══\n");

/**
 * ANSWER:
 *
 * "React uses destructuring extensively:
 *
 * 1. Component props:
 *    function Button({ text, onClick }) { }
 *
 * 2. useState hook:
 *    const [count, setCount] = useState(0);
 *
 * 3. Props forwarding with rest:
 *    function Input({ label, ...inputProps }) {
 *      return <input {...inputProps} />;
 *    }
 *
 * 4. Immutable state updates with spread:
 *    setState(prev => ({ ...prev, count: prev.count + 1 }));
 *
 * 5. Context destructuring:
 *    const { user, logout } = useContext(AuthContext);
 *
 * It's fundamental to React's patterns!"
 */

// Simulated React patterns
const [state, setState] = ['value', () => {}];
console.log('useState pattern:', typeof state, typeof setState);

function Component({ name, onClick, ...rest }) {
  console.log('Props destructured:', name, typeof onClick, rest);
}
Component({ name: 'Test', onClick: () => {}, id: 1, className: 'btn' });
console.log('');


// ═══════════════════════════════════════════════════════════════════════════════
// Q7: How to rename during destructuring?
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ Q7: Renaming syntax? ═══\n");

/**
 * ANSWER:
 *
 * "Use colon syntax: { property: newName }
 *
 * The property name comes first, followed by the new variable name.
 * Think of it as 'extract property AS newName'.
 *
 * const { name: userName } = user;
 * // Creates variable 'userName', NOT 'name'
 *
 * Useful when:
 * - Property name conflicts with existing variable
 * - Property name doesn't follow your naming conventions
 * - You want more descriptive variable names"
 */

const user = { name: 'John', age: 30 };
const { name: userName, age: userAge } = user;

// console.log(name);  // ReferenceError: name is not defined
console.log('Renamed:', userName, userAge);
console.log('');


// ═══════════════════════════════════════════════════════════════════════════════
// Q8: Swap variables without temp?
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ Q8: Swap without temp? ═══\n");

/**
 * ANSWER:
 *
 * "Use array destructuring for clean swap:
 * [a, b] = [b, a];
 *
 * How it works:
 * 1. Right side creates new array: [b, a] with current values
 * 2. Left side destructures into a and b
 * 3. a gets old b value, b gets old a value
 *
 * No temporary variable needed!"
 */

let a = 1, b = 2;
console.log('Before:', a, b);
[a, b] = [b, a];
console.log('After:', a, b);
console.log('');


// ═══════════════════════════════════════════════════════════════════════════════
// CHEAT SHEET
// ═══════════════════════════════════════════════════════════════════════════════

console.log("╔══════════════════════════════════════════════════════════════════╗");
console.log("║           DESTRUCTURING & SPREAD CHEAT SHEET                     ║");
console.log("╠══════════════════════════════════════════════════════════════════╣");
console.log("║                                                                  ║");
console.log("║ ARRAY DESTRUCTURING:                                             ║");
console.log("║   const [a, b] = arr;           // By position                  ║");
console.log("║   const [, second] = arr;       // Skip elements                ║");
console.log("║   const [a, ...rest] = arr;     // Rest pattern                 ║");
console.log("║   const [a = 1] = [];           // Default value                ║");
console.log("║                                                                  ║");
console.log("║ OBJECT DESTRUCTURING:                                            ║");
console.log("║   const { a, b } = obj;         // By name                      ║");
console.log("║   const { a: x } = obj;         // Rename to x                  ║");
console.log("║   const { a = 1 } = {};         // Default value                ║");
console.log("║   const { a, ...rest } = obj;   // Rest pattern                 ║");
console.log("║                                                                  ║");
console.log("║ SPREAD OPERATOR:                                                 ║");
console.log("║   [...arr1, ...arr2]            // Combine arrays               ║");
console.log("║   {...obj1, ...obj2}            // Merge objects (last wins)    ║");
console.log("║   fn(...arr)                    // Pass array as args           ║");
console.log("║                                                                  ║");
console.log("║ GOTCHAS:                                                         ║");
console.log("║   • Spread = SHALLOW copy only                                  ║");
console.log("║   • Default only for undefined (not null, 0, '')                ║");
console.log("║   • Use = {} for optional object params                         ║");
console.log("║   • Object spread: later values override                        ║");
console.log("║                                                                  ║");
console.log("╚══════════════════════════════════════════════════════════════════╝\n");

console.log("═══════════════════════════════════════════════════════════════════");
console.log("    Completed: docs/14-destructuring-spread/");
console.log("    Next: docs/15-classes-oop/");
console.log("═══════════════════════════════════════════════════════════════════\n");


/**
 * RUN: node docs/14-destructuring-spread/10-interview-qa.js
 */
