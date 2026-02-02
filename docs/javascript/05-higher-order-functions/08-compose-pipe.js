/**
 * CHALLENGE 08: Compose and Pipe
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ compose: Apply functions RIGHT to LEFT (mathematical convention)           ║
 * ║ pipe:    Apply functions LEFT to RIGHT (natural reading order)             ║
 * ║                                                                            ║
 * ║   compose(f, g, h)(x)  =  f(g(h(x)))    // h first, then g, then f         ║
 * ║   pipe(f, g, h)(x)     =  h(g(f(x)))    // f first, then g, then h         ║
 * ║                                                                            ║
 * ║ These are fundamental to functional programming!                           ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// Helper functions
var add10 = x => x + 10;
var multiply2 = x => x * 2;
var subtract5 = x => x - 5;

// Manual composition (right to left)
var result1 = subtract5(multiply2(add10(5)));
console.log('A:', result1);  // ((5 + 10) * 2) - 5

// Compose function (right to left)
function compose(...fns) {
  return function(x) {
    return fns.reduceRight(function(acc, fn) {
      return fn(acc);
    }, x);
  };
}

var composed = compose(subtract5, multiply2, add10);
console.log('B:', composed(5));

// Pipe function (left to right)
function pipe(...fns) {
  return function(x) {
    return fns.reduce(function(acc, fn) {
      return fn(acc);
    }, x);
  };
}

var piped = pipe(add10, multiply2, subtract5);
console.log('C:', piped(5));

// Different order gives different result
var piped2 = pipe(multiply2, add10, subtract5);
console.log('D:', piped2(5));  // ((5 * 2) + 10) - 5

/**
 * OUTPUT:
 *   A: 25
 *   B: 25
 *   C: 25
 *   D: 15
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: Manual composition                                                      ║
 * ║ ─────────────────────                                                      ║
 * ║   subtract5(multiply2(add10(5)))                                           ║
 * ║   = subtract5(multiply2(15))    // 5 + 10 = 15                             ║
 * ║   = subtract5(30)               // 15 * 2 = 30                             ║
 * ║   = 25                          // 30 - 5 = 25                             ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ B: compose(subtract5, multiply2, add10)(5)                                 ║
 * ║ ──────────────────────────────────────────                                 ║
 * ║   • reduceRight processes: add10 → multiply2 → subtract5                   ║
 * ║   • Step 1: add10(5) = 15                                                  ║
 * ║   • Step 2: multiply2(15) = 30                                             ║
 * ║   • Step 3: subtract5(30) = 25                                             ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ C: pipe(add10, multiply2, subtract5)(5)                                    ║
 * ║ ───────────────────────────────────────                                    ║
 * ║   • reduce processes: add10 → multiply2 → subtract5                        ║
 * ║   • Same order as B, same result!                                          ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ D: pipe(multiply2, add10, subtract5)(5)                                    ║
 * ║ ───────────────────────────────────────                                    ║
 * ║   • Step 1: multiply2(5) = 10                                              ║
 * ║   • Step 2: add10(10) = 20                                                 ║
 * ║   • Step 3: subtract5(20) = 15                                             ║
 * ║   • Different order → different result!                                    ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ COMPOSE vs PIPE                                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌───────────┬─────────────────────┬────────────────────────────────┐      │
 * │   │           │ compose             │ pipe                           │      │
 * │   ├───────────┼─────────────────────┼────────────────────────────────┤      │
 * │   │ Direction │ Right to Left       │ Left to Right                  │      │
 * │   │ Uses      │ reduceRight         │ reduce                         │      │
 * │   │ Like math │ f(g(h(x)))          │ h(g(f(x)))                     │      │
 * │   │ Common in │ Ramda, math         │ Lodash/fp, RxJS                │      │
 * │   └───────────┴─────────────────────┴────────────────────────────────┘      │
 * │                                                                             │
 * │   // compose: read right-to-left (like math)                                │
 * │   compose(                                                                  │
 * │     formatCurrency,  // 3rd: format as currency                             │
 * │     calculateTax,    // 2nd: add tax                                        │
 * │     calculateTotal   // 1st: get total                                      │
 * │   )                                                                         │
 * │                                                                             │
 * │   // pipe: read left-to-right (natural order)                               │
 * │   pipe(                                                                     │
 * │     calculateTotal,   // 1st: get total                                     │
 * │     calculateTax,     // 2nd: add tax                                       │
 * │     formatCurrency    // 3rd: format as currency                            │
 * │   )                                                                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ REAL-WORLD EXAMPLE                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // Processing user input                                                  │
 * │   var trim = s => s.trim();                                                 │
 * │   var toLowerCase = s => s.toLowerCase();                                   │
 * │   var sanitize = s => s.replace(/[^a-z0-9]/g, '');                          │
 * │                                                                             │
 * │   var processUsername = pipe(                                               │
 * │     trim,                                                                   │
 * │     toLowerCase,                                                            │
 * │     sanitize                                                                │
 * │   );                                                                        │
 * │                                                                             │
 * │   processUsername('  John_Doe!  ');  // 'johndoe'                           │
 * │                                                                             │
 * │                                                                             │
 * │   // Processing orders                                                      │
 * │   var getActiveOrders = orders => orders.filter(o => o.active);             │
 * │   var sumTotals = orders => orders.reduce((s, o) => s + o.total, 0);        │
 * │   var formatPrice = n => `$${n.toFixed(2)}`;                                │
 * │                                                                             │
 * │   var getFormattedTotal = pipe(                                             │
 * │     getActiveOrders,                                                        │
 * │     sumTotals,                                                              │
 * │     formatPrice                                                             │
 * │   );                                                                        │
 * │                                                                             │
 * │   getFormattedTotal(orders);  // '$1,234.56'                                │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Compose and pipe are higher-order functions that combine multiple          │
 * │  functions into one. They enable point-free programming - defining          │
 * │  transformations without mentioning the data.                               │
 * │                                                                             │
 * │  compose applies functions right-to-left (like mathematical notation):      │
 * │    compose(f, g, h)(x) = f(g(h(x)))                                         │
 * │                                                                             │
 * │  pipe applies functions left-to-right (natural reading order):              │
 * │    pipe(f, g, h)(x) = h(g(f(x)))                                            │
 * │                                                                             │
 * │  Implementation uses reduce/reduceRight over the function array.            │
 * │  These patterns improve code readability by making data pipelines           │
 * │  explicit and enabling easy composition of small, focused functions."       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/05-higher-order-functions/08-compose-pipe.js
 */
