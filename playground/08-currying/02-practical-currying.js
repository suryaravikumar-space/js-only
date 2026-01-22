// CHALLENGE 02: Practical Currying
//
// What prints for A, B, C, D?

// Curried logger
var log = level => message => `[${level}] ${message}`;

var info = log('INFO');
var error = log('ERROR');
var debug = log('DEBUG');

console.log('A:', info('User logged in'));
console.log('B:', error('Connection failed'));

// Curried formatter
var format = prefix => suffix => value => `${prefix}${value}${suffix}`;

var wrapInBrackets = format('[')(']');
var wrapInParens = format('(')(')');

console.log('C:', wrapInBrackets('hello'));
console.log('D:', wrapInParens('world'));
