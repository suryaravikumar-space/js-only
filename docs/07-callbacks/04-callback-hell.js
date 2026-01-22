/**
 * CHALLENGE 04: Callback Hell / Pyramid of Doom
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Callback Hell occurs when callbacks are nested inside callbacks,           ║
 * ║ creating deeply indented, hard-to-read code (pyramid of doom).             ║
 * ║                                                                            ║
 * ║   doA(function() {                                                         ║
 * ║     doB(function() {                                                       ║
 * ║       doC(function() {                                                     ║
 * ║         doD(function() {                                                   ║
 * ║           // 😱 4 levels deep!                                             ║
 * ║         });                                                                ║
 * ║       });                                                                  ║
 * ║     });                                                                    ║
 * ║   });                                                                      ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// Simulating async operations
function getUser(id, callback) {
  setTimeout(function() {
    callback(null, { id: id, name: 'Alice' });
  }, 10);
}

function getOrders(userId, callback) {
  setTimeout(function() {
    callback(null, [{ orderId: 1, item: 'Book' }]);
  }, 10);
}

function getOrderDetails(orderId, callback) {
  setTimeout(function() {
    callback(null, { orderId: orderId, price: 29.99 });
  }, 10);
}

console.log('A:', 'Start');

// Callback Hell - nested callbacks
getUser(1, function(err, user) {
  console.log('B:', user.name);

  getOrders(user.id, function(err, orders) {
    console.log('C:', orders[0].item);

    getOrderDetails(orders[0].orderId, function(err, details) {
      console.log('D:', details.price);

      // Imagine more nesting here...
      console.log('E:', 'All done');
    });
  });
});

/**
 * OUTPUT:
 *   A: Start
 *   B: Alice
 *   C: Book
 *   D: 29.99
 *   E: All done
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ PROBLEMS WITH CALLBACK HELL                                                ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ 1. READABILITY: Code grows horizontally, hard to follow                    ║
 * ║                                                                            ║
 * ║ 2. ERROR HANDLING: Must handle errors at every level                       ║
 * ║    getUser(id, function(err, user) {                                       ║
 * ║      if (err) return handleError(err);                                     ║
 * ║      getOrders(user.id, function(err, orders) {                            ║
 * ║        if (err) return handleError(err);                                   ║
 * ║        // ... repeated at every level                                      ║
 * ║      });                                                                   ║
 * ║    });                                                                     ║
 * ║                                                                            ║
 * ║ 3. INVERSION OF CONTROL: You give control to another function              ║
 * ║    - Callback might be called multiple times                               ║
 * ║    - Callback might never be called                                        ║
 * ║    - Callback might be called too early                                    ║
 * ║                                                                            ║
 * ║ 4. SEQUENTIAL DEPENDENCY: Each step waits for previous                     ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ SOLUTIONS TO CALLBACK HELL                                                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // 1. Named functions (flatten the pyramid)                               │
 * │   function handleUser(err, user) { ... getOrders(user.id, handleOrders); }  │
 * │   function handleOrders(err, orders) { ... }                                │
 * │   getUser(1, handleUser);                                                   │
 * │                                                                             │
 * │   // 2. Promises (chain instead of nest)                                    │
 * │   getUser(1)                                                                │
 * │     .then(user => getOrders(user.id))                                       │
 * │     .then(orders => getOrderDetails(orders[0].orderId))                     │
 * │     .then(details => console.log(details.price))                            │
 * │     .catch(handleError);                                                    │
 * │                                                                             │
 * │   // 3. async/await (looks synchronous)                                     │
 * │   async function processOrder() {                                           │
 * │     const user = await getUser(1);                                          │
 * │     const orders = await getOrders(user.id);                                │
 * │     const details = await getOrderDetails(orders[0].orderId);               │
 * │     console.log(details.price);                                             │
 * │   }                                                                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/05-callbacks/04-callback-hell.js
 */
