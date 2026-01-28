/**
 * Questions 11-20: Closures & Scope
 *
 * Predict the output for each code snippet.
 */

// Question 11: Basic closure
function outer() {
    let count = 0;
    return function inner() {
        count++;
        return count;
    };
}
const counter = outer();
console.log("Q11:", counter(), counter(), counter());

// Question 12: Classic loop closure problem
for (var i = 0; i < 3; i++) {
    setTimeout(function() {
        console.log("Q12:", i);
    }, 100);
}

// Question 13: Loop closure with let
for (let j = 0; j < 3; j++) {
    setTimeout(function() {
        console.log("Q13:", j);
    }, 200);
}

// Question 14: IIFE closure solution
for (var k = 0; k < 3; k++) {
    (function(k) {
        setTimeout(function() {
            console.log("Q14:", k);
        }, 300);
    })(k);
}

// Question 15: Closure with shared variable
function createFunctions() {
    var funcs = [];
    for (var i = 0; i < 3; i++) {
        funcs.push(function() { return i; });
    }
    return funcs;
}
var fns = createFunctions();
console.log("Q15:", fns[0](), fns[1](), fns[2]());

// Question 16: Closure retaining reference
function createCounter() {
    let count = 0;
    return {
        increment: function() { count++; },
        get: function() { return count; }
    };
}
const c1 = createCounter();
const c2 = createCounter();
c1.increment();
c1.increment();
c2.increment();
console.log("Q16:", c1.get(), c2.get());

// Question 17: Nested closures
function outer2(x) {
    return function middle(y) {
        return function inner(z) {
            return x + y + z;
        };
    };
}
console.log("Q17:", outer2(1)(2)(3));

// Question 18: Closure with parameter shadowing
let value = "global";
function test(value) {
    return function() {
        return value;
    };
}
const getValue = test("local");
console.log("Q18:", getValue());

// Question 19: Module pattern closure
const module = (function() {
    let private = "secret";
    return {
        getPrivate: function() { return private; },
        setPrivate: function(val) { private = val; }
    };
})();
console.log("Q19a:", module.getPrivate());
module.setPrivate("new secret");
console.log("Q19b:", module.getPrivate());
console.log("Q19c:", module.private);

// Question 20: Closure scope chain
var x = 10;
function first() {
    var x = 20;
    function second() {
        var x = 30;
        return function third() {
            return x;
        };
    }
    return second();
}
console.log("Q20:", first()());
