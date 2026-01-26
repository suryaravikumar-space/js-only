/**
 * Answer 37: Function Currying
 *
 * Multiple approaches to implement currying:
 */

// Approach 1: Basic Curry
function curry(fn) {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn.apply(this, args);
        }
        return function (...nextArgs) {
            return curried.apply(this, [...args, ...nextArgs]);
        };
    };
}

// Approach 2: Using bind
function curryBind(fn) {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn(...args);
        }
        return curried.bind(null, ...args);
    };
}

// Approach 3: Arrow function version
const curryArrow = (fn) => {
    const curried = (...args) =>
        args.length >= fn.length
            ? fn(...args)
            : (...nextArgs) => curried(...args, ...nextArgs);
    return curried;
};

// Approach 4: Infinite Curry (no fixed arity)
function infiniteCurry(fn) {
    return function curried(...args) {
        const next = (...nextArgs) => curried(...args, ...nextArgs);
        next.valueOf = () => args.reduce(fn);
        next.toString = () => args.reduce(fn);
        return next;
    };
}

// Approach 5: Partial Application
function partial(fn, ...presetArgs) {
    return function (...laterArgs) {
        return fn(...presetArgs, ...laterArgs);
    };
}

// Approach 6: Curry with placeholder
const _ = Symbol('placeholder');

function curryWithPlaceholder(fn) {
    return function curried(...args) {
        const complete = args.length >= fn.length &&
            !args.slice(0, fn.length).includes(_);

        if (complete) {
            return fn.apply(this, args);
        }

        return function (...nextArgs) {
            const mergedArgs = args.map(arg =>
                arg === _ && nextArgs.length ? nextArgs.shift() : arg
            );
            return curried.apply(this, [...mergedArgs, ...nextArgs]);
        };
    };
}

// Test cases
console.log("=== Basic Curry ===");
const add = (a, b, c) => a + b + c;
const curriedAdd = curry(add);
console.log(curriedAdd(1)(2)(3)); // 6
console.log(curriedAdd(1, 2)(3)); // 6
console.log(curriedAdd(1)(2, 3)); // 6

console.log("\n=== Practical Example ===");
const multiply = curry((a, b, c) => a * b * c);
const double = multiply(2);
const quadruple = double(2);
console.log(quadruple(5)); // 20

console.log("\n=== Partial Application ===");
const greet = (greeting, name) => `${greeting}, ${name}!`;
const sayHello = partial(greet, 'Hello');
console.log(sayHello('John')); // "Hello, John!"

console.log("\n=== With Placeholder ===");
const subtract = curryWithPlaceholder((a, b, c) => a - b - c);
console.log(subtract(10)(5)(2)); // 3
console.log(subtract(_, 5, _)(10)(2)); // 3

console.log("\n=== Real-world: Logger ===");
const log = curry((level, message, data) => {
    console.log(`[${level}] ${message}:`, data);
});
const errorLog = log('ERROR');
const infoLog = log('INFO');
errorLog('Something went wrong', { code: 500 });
infoLog('User logged in', { userId: 123 });

/**
 * Benefits of Currying:
 * - Reusability with partial application
 * - Function composition
 * - Cleaner code with single-purpose functions
 *
 * Time Complexity: O(1) per call
 * Space Complexity: O(n) for collected arguments
 */
