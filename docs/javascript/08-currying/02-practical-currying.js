/**
 * CHALLENGE 02: Practical Currying
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Currying shines when you need to create specialized versions of functions. ║
 * ║                                                                            ║
 * ║   var log = level => message => `[${level}] ${message}`;                   ║
 * ║   var info = log('INFO');   // Specialized logger                          ║
 * ║   var error = log('ERROR'); // Another specialized logger                  ║
 * ║                                                                            ║
 * ║ Configure once, use many times!                                            ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

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

/**
 * OUTPUT:
 *   A: [INFO] User logged in
 *   B: [ERROR] Connection failed
 *   C: [hello]
 *   D: (world)
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ WHY THIS IS POWERFUL                                                       ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Without currying (repetitive):                                             ║
 * ║   log('INFO', 'User logged in');                                           ║
 * ║   log('INFO', 'Processing data');                                          ║
 * ║   log('INFO', 'Task complete');                                            ║
 * ║                                                                            ║
 * ║ With currying (DRY):                                                       ║
 * ║   var info = log('INFO');                                                  ║
 * ║   info('User logged in');                                                  ║
 * ║   info('Processing data');                                                 ║
 * ║   info('Task complete');                                                   ║
 * ║                                                                            ║
 * ║ The configuration ('INFO') is captured once in closure!                    ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ MORE PRACTICAL EXAMPLES                                                     │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // 1. URL builder                                                         │
 * │   var url = protocol => domain => path =>                                   │
 * │     `${protocol}://${domain}/${path}`;                                      │
 * │                                                                             │
 * │   var httpsUrl = url('https');                                              │
 * │   var myApiUrl = httpsUrl('api.example.com');                               │
 * │                                                                             │
 * │   myApiUrl('users');     // 'https://api.example.com/users'                 │
 * │   myApiUrl('products');  // 'https://api.example.com/products'              │
 * │                                                                             │
 * │                                                                             │
 * │   // 2. Math operations                                                     │
 * │   var add = a => b => a + b;                                                │
 * │   var multiply = a => b => a * b;                                           │
 * │                                                                             │
 * │   var increment = add(1);                                                   │
 * │   var double = multiply(2);                                                 │
 * │   var triple = multiply(3);                                                 │
 * │                                                                             │
 * │   [1, 2, 3].map(double);  // [2, 4, 6]                                      │
 * │                                                                             │
 * │                                                                             │
 * │   // 3. Validation                                                          │
 * │   var hasMinLength = min => str => str.length >= min;                       │
 * │   var hasMaxLength = max => str => str.length <= max;                       │
 * │                                                                             │
 * │   var isValidUsername = str =>                                              │
 * │     hasMinLength(3)(str) && hasMaxLength(20)(str);                          │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ ARGUMENT ORDER MATTERS                                                      │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // Order arguments from MOST to LEAST likely to be reused                 │
 * │                                                                             │
 * │   // GOOD: config first, data last                                          │
 * │   var format = config => data => { /* ... *\/ };                            │
 * │   var jsonFormatter = format({ indent: 2 });                                │
 * │   jsonFormatter(data1);                                                     │
 * │   jsonFormatter(data2);  // Reuse config!                                   │
 * │                                                                             │
 * │   // BAD: data first, config last                                           │
 * │   var format = data => config => { /* ... *\/ };                            │
 * │   // Can't reuse - data changes each time!                                  │
 * │                                                                             │
 * │                                                                             │
 * │   // General rule:                                                          │
 * │   // 1. Configuration                                                       │
 * │   // 2. Callbacks/functions                                                 │
 * │   // 3. Data to operate on                                                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/06-currying/02-practical-currying.js
 */
