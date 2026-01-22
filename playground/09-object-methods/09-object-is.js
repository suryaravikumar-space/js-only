// CHALLENGE 09: Object.is() vs === vs ==
//
// What prints for A, B, C, D, E?

// NaN comparison
console.log('A1:', NaN === NaN);
console.log('A2:', Object.is(NaN, NaN));

// Positive and negative zero
console.log('B1:', 0 === -0);
console.log('B2:', Object.is(0, -0));
console.log('B3:', Object.is(-0, -0));

// Regular comparisons
console.log('C1:', Object.is(5, 5));
console.log('C2:', Object.is('hello', 'hello'));
console.log('C3:', Object.is({}, {}));

// Comparison table
var a = { x: 1 };
var b = a;
console.log('D1:', a == b, a === b, Object.is(a, b));

var c = { x: 1 };
console.log('D2:', a == c, a === c, Object.is(a, c));

// Edge cases
console.log('E1:', Object.is(null, null));
console.log('E2:', Object.is(undefined, undefined));
console.log('E3:', Object.is(null, undefined));
