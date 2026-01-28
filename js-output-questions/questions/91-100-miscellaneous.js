/**
 * Questions 91-100: Miscellaneous Tricky Questions
 *
 * Predict the output for each code snippet.
 */

// Question 91: Floating point precision
console.log("Q91a:", 0.1 + 0.2);
console.log("Q91b:", 0.1 + 0.2 === 0.3);
console.log("Q91c:", 9999999999999999);
console.log("Q91d:", 0.1.toFixed(20));

// Question 92: String methods quirks
console.log("Q92a:", "hello".charAt(100));
console.log("Q92b:", "hello"[100]);
console.log("Q92c:", "hello".substring(2, 0));
console.log("Q92d:", "hello".slice(2, 0));
console.log("Q92e:", "  hello  ".trim().length);

// Question 93: Array quirks
console.log("Q93a:", [1, 2, 3].length);
const arr = [1, 2, 3];
arr.length = 5;
console.log("Q93b:", arr);
arr.length = 2;
console.log("Q93c:", arr);

console.log("Q93d:", [1, 2, 3].fill(0));
console.log("Q93e:", Array(3).fill(0));
console.log("Q93f:", [, , ,].length);

// Question 94: Object.freeze vs Object.seal
const frozen = Object.freeze({ a: 1, b: { c: 2 } });
frozen.a = 10;
frozen.d = 4;
frozen.b.c = 20;
console.log("Q94a:", frozen);

const sealed = Object.seal({ x: 1 });
sealed.x = 10;
sealed.y = 2;
delete sealed.x;
console.log("Q94b:", sealed);

// Question 95: JSON quirks
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

const circular = { self: null };
circular.self = circular;
// console.log(JSON.stringify(circular)); // TypeError!
console.log("Q95b: Circular reference throws TypeError");

// Question 96: Prototype chain
function Animal(name) {
    this.name = name;
}
Animal.prototype.speak = function() {
    return this.name + " speaks";
};

const cat = new Animal("Whiskers");
console.log("Q96a:", cat.speak());
console.log("Q96b:", cat.hasOwnProperty("name"));
console.log("Q96c:", cat.hasOwnProperty("speak"));
console.log("Q96d:", "speak" in cat);

// Question 97: Error handling
function test() {
    try {
        console.log("Q97a: try");
        return "Q97b: return from try";
    } finally {
        console.log("Q97c: finally");
    }
}
console.log(test());

function test2() {
    try {
        throw new Error("Error!");
    } catch (e) {
        return "Q97d: catch";
    } finally {
        return "Q97e: finally";
    }
}
console.log(test2());

// Question 98: Generators
function* gen() {
    yield 1;
    yield 2;
    return 3;
}
const g = gen();
console.log("Q98a:", g.next());
console.log("Q98b:", g.next());
console.log("Q98c:", g.next());
console.log("Q98d:", g.next());

console.log("Q98e:", [...gen()]);

// Question 99: Proxy
const target = { message: "hello" };
const handler = {
    get: function(obj, prop) {
        return prop in obj ? obj[prop] : "Property not found";
    }
};
const proxy = new Proxy(target, handler);
console.log("Q99a:", proxy.message);
console.log("Q99b:", proxy.nonexistent);

// Question 100: Various JS Gotchas
console.log("Q100a:", (![]+[])[+[]]+(![]+[])[+!+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]);
// Hint: This spells something!

console.log("Q100b:", (![] + [])[0]);
console.log("Q100c:", ([] + {})[0]);
console.log("Q100d:", ({} + [])[0]);

// Bonus: What's the output?
console.log("Q100e:", 1 < 2 < 3);
console.log("Q100f:", 3 > 2 > 1);
