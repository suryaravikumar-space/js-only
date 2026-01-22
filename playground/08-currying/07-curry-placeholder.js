// CHALLENGE 07: Curry with Placeholder
//
// What prints for A, B, C?

var _ = Symbol('placeholder');

function curryWithPlaceholder(fn) {
  return function curried(...args) {
    // Check if we have enough non-placeholder args
    var complete = args.length >= fn.length &&
                   !args.slice(0, fn.length).includes(_);

    if (complete) {
      return fn.apply(this, args);
    }

    return function(...moreArgs) {
      // Replace placeholders with new args
      var newArgs = args.map(arg =>
        arg === _ && moreArgs.length ? moreArgs.shift() : arg
      );
      return curried.apply(this, newArgs.concat(moreArgs));
    };
  };
}

function divide(a, b, c) {
  return a / b / c;
}

var curriedDivide = curryWithPlaceholder(divide);

console.log('A:', curriedDivide(100, 10, 2));       // 100/10/2 = 5
console.log('B:', curriedDivide(_, 10, 2)(100));   // 100/10/2 = 5
console.log('C:', curriedDivide(_, _, 2)(100)(10)); // 100/10/2 = 5
