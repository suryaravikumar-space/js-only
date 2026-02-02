/**
 * TOPIC: Callback Basics
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A callback is a function passed as an argument to another function,        ║
 * ║ to be executed later (synchronously or asynchronously).                    ║
 * ║                                                                            ║
 * ║   function doSomething(callback) {                                         ║
 * ║     // ... do work ...                                                     ║
 * ║     callback();  // Execute the callback                                   ║
 * ║   }                                                                        ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  Think of it like ORDERING FOOD at a restaurant:                           │
 * │                                                                             │
 * │   1. You place your order          → call a function                       │
 * │   2. You give your phone number    → pass a callback                       │
 * │   3. Food is ready, they CALL YOU  → callback executes                     │
 * │                                                                             │
 * │  That's why it's called a "CALL-BACK"                                      │
 * │  → "Here's a function, call me back when you're done."                     │
 * │                                                                             │
 * │  One-line mental model:                                                     │
 * │  "I don't know WHEN this finishes, but WHEN it does, run THIS function."  │
 * │                                                                             │
 * │  You already use callbacks everywhere:                                      │
 * │   button.addEventListener('click', cb)   → when clicked, call this        │
 * │   setTimeout(cb, 1000)                   → after 1s, call this            │
 * │   [1,2,3].map(cb)                        → for each item, call this      │
 * │   fetch(url).then(cb)                    → when data arrives, call this   │
 * │                                                                             │
 * │  Pattern: "when X happens, run this function."                             │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// 1. You place your order (call the function), give your phone number (pass callback)
const placeOrder = (dish, callbackWhenReady) => { // ES6: arrow function
  console.log('A:', `Order placed for ${dish}`); // ES6: template literal
  // Kitchen prepares food... then CALLS YOU BACK
  callbackWhenReady(dish);
};

placeOrder('Pizza', (dish) => { // ES6: arrow function
  console.log('B:', `${dish} is ready! Picking up now.`); // ES6: template literal
});

// Same pattern — restaurant calls you with the bill amount
const orderWithBill = (dish, price, callback) => { // ES6: arrow function
  const total = price + 5; // ES6: const
  callback(dish, total);
};

orderWithBill('Burger', 10, (dish, bill) => { // ES6: arrow function
  console.log('C:', `${dish} bill is $${bill}`); // ES6: template literal
});

// Named callback — you already know what to do when called back
const pickupAndTip = (dish, bill) => { // ES6: arrow function
  console.log('D:', `Picked up ${dish}, paid $${bill} + tip`); // ES6: template literal
};

orderWithBill('Sushi', 20, pickupAndTip);

/**
 * OUTPUT:
 *   A: Order placed for Pizza
 *   B: Pizza is ready! Picking up now.
 *   C: Burger bill is $15
 *   D: Picked up Sushi, paid $25 + tip
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A & B: Place order → restaurant calls you back                            ║
 * ║ ──────────────────────────────────────────────                             ║
 * ║   1. placeOrder('Pizza', fn) → you order Pizza                            ║
 * ║   2. Kitchen logs "Order placed for Pizza"                                 ║
 * ║   3. callbackWhenReady('Pizza') → restaurant calls you back              ║
 * ║   4. You pick up: "Pizza is ready! Picking up now."                       ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ C: Callback with arguments (dish + bill)                                   ║
 * ║ ─────────────────────────────────────────                                  ║
 * ║   1. orderWithBill('Burger', 10, fn) → order Burger for $10              ║
 * ║   2. total = 10 + 5 (tax) = 15                                            ║
 * ║   3. callback('Burger', 15) → calls you with dish and bill               ║
 * ║   4. You see: "Burger bill is $15"                                        ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ D: Named callback (you already know what to do)                            ║
 * ║ ──────────────────────────────────────────────                             ║
 * ║   1. orderWithBill('Sushi', 20, pickupAndTip)                             ║
 * ║   2. total = 20 + 5 = 25                                                   ║
 * ║   3. callback('Sushi', 25) → pickupAndTip('Sushi', 25)                   ║
 * ║   4. "Picked up Sushi, paid $25 + tip"                                    ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ CALLBACK PATTERNS                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // 1. Anonymous callback                                                  │
 * │   doSomething(function() { ... });                                          │
 * │                                                                             │
 * │   // 2. Named callback                                                      │
 * │   function myCallback() { ... }                                             │
 * │   doSomething(myCallback);                                                  │
 * │                                                                             │
 * │   // 3. Arrow function callback                                             │
 * │   doSomething(() => { ... });                                               │
 * │                                                                             │
 * │   // 4. Callback with arguments                                             │
 * │   doSomething(function(result) { ... });                                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW QUESTIONS:                                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Q1: What is a callback function in JavaScript?                              │
 * │ A1: A callback is a function passed as an argument to another function,     │
 * │     which is then invoked inside that function to complete some action.     │
 * │                                                                             │
 * │ Q2: What are the two types of callbacks and give examples?                  │
 * │ A2: Callbacks can be:                                                       │
 * │     - Synchronous: executed immediately (like Array.map)                    │
 * │     - Asynchronous: executed later (like setTimeout, fetch)                 │
 * │                                                                             │
 * │ Q3: What patterns do callbacks enable?                                      │
 * │ A3: They enable:                                                            │
 * │     - Higher-order function patterns                                        │
 * │     - Event handling                                                        │
 * │     - Asynchronous programming                                              │
 * │     - Customizable behavior injection                                       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/javascript/07-callbacks/00-callback-basics.js
 */
