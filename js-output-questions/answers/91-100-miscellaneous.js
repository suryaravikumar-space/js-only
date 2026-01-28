/**
 * Answers 91-100: Miscellaneous Tricky Questions
 *
 * Detailed explanations for each question.
 */

// Question 91: Floating point precision
// Output: 0.30000000000000004, false, 10000000000000000, "0.10000000000000000555"
console.log("Q91a:", 0.1 + 0.2);  // 0.30000000000000004
console.log("Q91b:", 0.1 + 0.2 === 0.3);  // false
console.log("Q91c:", 9999999999999999);   // 10000000000000000
console.log("Q91d:", 0.1.toFixed(20));    // "0.10000000000000000555"
/**
 * Explanation:
 * JavaScript uses IEEE 754 double-precision floats.
 * Some decimals can't be represented exactly in binary.
 * 0.1 and 0.2 have rounding errors.
 *
 * Q91c: Numbers beyond 2^53 - 1 (9007199254740991) lose precision.
 *
 * Solution: Use epsilon comparison or BigInt for large integers.
 * Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON
 */

// Question 92: String methods quirks
// Output: "", undefined, "he", "", 5
console.log("Q92a:", "hello".charAt(100));    // "" (empty string)
console.log("Q92b:", "hello"[100]);           // undefined
console.log("Q92c:", "hello".substring(2, 0)); // "he"
console.log("Q92d:", "hello".slice(2, 0));    // ""
console.log("Q92e:", "  hello  ".trim().length); // 5
/**
 * Explanation:
 * Q92a: charAt() returns "" for out of bounds
 * Q92b: Bracket notation returns undefined for out of bounds
 *
 * Q92c: substring() swaps arguments if start > end: substring(0, 2) = "he"
 * Q92d: slice() doesn't swap, returns "" if start > end
 *
 * Q92e: trim() removes whitespace, "hello".length = 5
 */

// Question 93: Array quirks
// Output: 3, [1,2,3,<2 empty>], [1,2], [0,0,0], [0,0,0], 3
console.log("Q93a:", [1, 2, 3].length);  // 3
const arr = [1, 2, 3];
arr.length = 5;
console.log("Q93b:", arr);  // [1, 2, 3, <2 empty items>]
arr.length = 2;
console.log("Q93c:", arr);  // [1, 2] (truncated!)

console.log("Q93d:", [1, 2, 3].fill(0));  // [0, 0, 0]
console.log("Q93e:", Array(3).fill(0));   // [0, 0, 0]
console.log("Q93f:", [, , ,].length);     // 3
/**
 * Explanation:
 * Setting length > current: creates sparse array with holes
 * Setting length < current: TRUNCATES array (destructive!)
 *
 * Array(3) creates [<3 empty>], not [3]
 * [,,,] has 3 commas creating 3 holes (length 3)
 */

// Question 94: Object.freeze vs Object.seal
// Output: { a: 1, b: { c: 20 } }, { x: 10 }
const frozen = Object.freeze({ a: 1, b: { c: 2 } });
frozen.a = 10;      // Ignored (frozen)
frozen.d = 4;       // Ignored (frozen)
frozen.b.c = 20;    // WORKS! (shallow freeze)
console.log("Q94a:", frozen);  // { a: 1, b: { c: 20 } }

const sealed = Object.seal({ x: 1 });
sealed.x = 10;      // WORKS (can modify existing)
sealed.y = 2;       // Ignored (can't add)
delete sealed.x;    // Ignored (can't delete)
console.log("Q94b:", sealed);  // { x: 10 }
/**
 * Explanation:
 * freeze(): Can't add, delete, or modify properties
 * seal(): Can modify existing, but can't add or delete
 *
 * BOTH are SHALLOW! Nested objects are NOT frozen/sealed.
 * Use deep freeze libraries for complete immutability.
 */

// Question 95: JSON quirks
// Output: '{"d":null,"e":null,"f":null,"g":"hello"}'
const obj = {
    a: undefined,
    b: function() {},
    c: Symbol("sym"),
    d: NaN,
    e: Infinity,
    f: null,
    g: "hello"
};
console.log("Q95:", JSON.stringify(obj));
/**
 * Explanation:
 * JSON.stringify() handles values differently:
 * - undefined: omitted
 * - function: omitted
 * - Symbol: omitted
 * - NaN: becomes null
 * - Infinity: becomes null
 * - null: preserved
 *
 * Only "g" and "f" survive as expected!
 *
 * Circular references throw TypeError.
 */

const circular = { self: null };
circular.self = circular;
console.log("Q95b: Circular reference throws TypeError");

// Question 96: Prototype chain
// Output: "Whiskers speaks", true, false, true
function Animal(name) {
    this.name = name;
}
Animal.prototype.speak = function() {
    return this.name + " speaks";
};

const cat = new Animal("Whiskers");
console.log("Q96a:", cat.speak());              // "Whiskers speaks"
console.log("Q96b:", cat.hasOwnProperty("name")); // true (own property)
console.log("Q96c:", cat.hasOwnProperty("speak")); // false (on prototype)
console.log("Q96d:", "speak" in cat);            // true (includes prototype)
/**
 * Explanation:
 * hasOwnProperty(): only checks OWN properties
 * in operator: checks OWN and PROTOTYPE chain
 *
 * "name" is directly on cat (constructor set it)
 * "speak" is on Animal.prototype, not cat itself
 */

// Question 97: Error handling
// Output: "try", "finally", "return from try"
// Then: "finally"
function test() {
    try {
        console.log("Q97a: try");
        return "Q97b: return from try";
    } finally {
        console.log("Q97c: finally");
    }
}
console.log(test());
/**
 * Explanation:
 * finally ALWAYS runs, even with return in try.
 * Order: try block -> finally block -> return value returned
 */

function test2() {
    try {
        throw new Error("Error!");
    } catch (e) {
        return "Q97d: catch";
    } finally {
        return "Q97e: finally";  // Overwrites catch's return!
    }
}
console.log(test2());  // "Q97e: finally"
/**
 * Explanation:
 * Return in finally OVERWRITES any previous return.
 * This is usually a bug - avoid returning in finally!
 */

// Question 98: Generators
// Output: {value:1, done:false}, {value:2, done:false},
//         {value:3, done:true}, {value:undefined, done:true}
//         [1, 2] (return value not included in spread)
function* gen() {
    yield 1;
    yield 2;
    return 3;
}
const g = gen();
console.log("Q98a:", g.next());  // { value: 1, done: false }
console.log("Q98b:", g.next());  // { value: 2, done: false }
console.log("Q98c:", g.next());  // { value: 3, done: true }
console.log("Q98d:", g.next());  // { value: undefined, done: true }

console.log("Q98e:", [...gen()]);  // [1, 2] - return value NOT included!
/**
 * Explanation:
 * yield pauses and returns value with done: false
 * return gives value with done: true (generator exhausted)
 *
 * Spread/for...of only includes yielded values, NOT return value!
 */

// Question 99: Proxy
// Output: "hello", "Property not found"
const target = { message: "hello" };
const handler = {
    get: function(obj, prop) {
        return prop in obj ? obj[prop] : "Property not found";
    }
};
const proxy = new Proxy(target, handler);
console.log("Q99a:", proxy.message);     // "hello"
console.log("Q99b:", proxy.nonexistent); // "Property not found"
/**
 * Explanation:
 * Proxy intercepts operations on objects.
 * The get trap intercepts property access.
 * We can provide custom default values instead of undefined.
 *
 * Proxies are powerful for: validation, logging, formatting, etc.
 */

// Question 100: Various JS Gotchas
// Output: "fail" (the word!)
console.log("Q100a:", (![]+[])[+[]]+(![]+[])[+!+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]);
/**
 * Explanation (JSFuck style):
 * ![] = false, +[] = 0, +!+[] = 1
 * (![]+[]) = "false"
 * "false"[0] = "f"
 * "false"[1] = "a"
 * Combined: "fail"
 *
 * This is the basis of JSFuck - writing JS with just 6 characters.
 */

console.log("Q100b:", (![] + [])[0]);  // "f" (first char of "false")
console.log("Q100c:", ([] + {})[0]);   // "[" (first char of "[object Object]")
console.log("Q100d:", ({} + [])[0]);   // "[" or "0" depending on context
/**
 * Explanation:
 * [] + {} = "[object Object]" (array becomes "", {} becomes "[object Object]")
 * {} + [] = 0 or "[object Object]" (depends if {} is parsed as block or object)
 */

console.log("Q100e:", 1 < 2 < 3);  // true
console.log("Q100f:", 3 > 2 > 1);  // false!
/**
 * Explanation:
 * Comparisons are left-to-right:
 * Q100e: (1 < 2) < 3 → true < 3 → 1 < 3 → true
 * Q100f: (3 > 2) > 1 → true > 1 → 1 > 1 → false!
 *
 * true becomes 1 in numeric comparison.
 * This is why chained comparisons don't work as expected!
 */

console.log("\n=== Summary ===");
console.log("1. Floating point: 0.1 + 0.2 !== 0.3");
console.log("2. freeze() is shallow, use deep freeze for nested");
console.log("3. JSON.stringify ignores undefined, functions, Symbols");
console.log("4. hasOwnProperty vs 'in' (prototype chain)");
console.log("5. finally always runs and can override returns");
console.log("6. Generators: return value not in spread/for...of");
