/**
 * ============================================================================
 * WHAT ARE PROMISES IN JAVASCRIPT?
 * ============================================================================
 *
 * A Promise is a JavaScript object that represents the eventual completion
 * (or failure) of an asynchronous operation and its resulting value.
 *
 * Think of a promise as a "promise for a future value" - like ordering food
 * at a restaurant. You get a receipt (the promise) immediately, but the
 * actual food (the value) comes later.
 *
 * ⚠️  READ INSTRUCTIONS.md FIRST
 * This file follows the "what breaks if?" methodology.
 * Don't just read - modify the code and see what happens!
 *
 */

/**
 * ============================================================================
 * THE COFFEE SHOP STORY - A Promise You'll Never Forget
 * ============================================================================
 *
 * Imagine you walk into a busy coffee shop. Here's what happens:
 *
 * 1️⃣  YOU PLACE YOUR ORDER (Creating a Promise)
 * ───────────────────────────────────────────────────────────────────────
 *    You: "One large cappuccino, please."
 *    Barista: "Sure! Here's your receipt. Order #42."
 *
 *    💡 The receipt IS the promise. It represents your future coffee.
 *       You don't have the coffee yet, but you have a guarantee it's coming.
 *
 *    In code:
 *    const coffeePromise = new Promise((resolve, reject) => {
 *      // The barista starts making your coffee...
 *    });
 *
 *
 * 2️⃣  THE THREE STATES
 * ───────────────────────────────────────────────────────────────────────
 *
 *    ⏳ PENDING - "Your order is being prepared"
 *       • The barista is making your coffee
 *       • You're waiting, checking your phone
 *       • The outcome is unknown
 *
 *    ✅ FULFILLED - "Order #42! Your cappuccino is ready!"
 *       • Coffee successfully made
 *       • You got what you ordered
 *       • resolve('☕ Hot Cappuccino') was called
 *
 *    ❌ REJECTED - "Sorry, we ran out of milk"
 *       • Coffee couldn't be made
 *       • Something went wrong
 *       • reject('No milk available') was called
 *
 *
 * 3️⃣  WHAT CAN YOU DO WHILE WAITING? (Asynchronous Behavior)
 * ───────────────────────────────────────────────────────────────────────
 *
 *    With OLD SCHOOL (callback hell):
 *    You stand at the counter, blocking everyone, staring at the barista.
 *    When coffee is ready, you take it. Then you realize you need sugar.
 *    You wait again. Then cream. You wait again. Everyone is annoyed.
 *
 *    With PROMISES:
 *    You take your receipt, sit down, check your email, read a book.
 *    When your order is ready, THEY CALL YOU.
 *    You pick it up at your convenience.
 *    This is .then() - "do this when ready"
 *
 *    coffeePromise
 *      .then(coffee => {
 *        console.log('Got my coffee!', coffee);
 *        return coffee;  // You can keep using it
 *      })
 *      .catch(error => {
 *        console.log('Oh no!', error);
 *        // Get tea instead
 *      });
 *
 *
 * 4️⃣  PROMISE CHAINING (Getting Multiple Things)
 * ───────────────────────────────────────────────────────────────────────
 *
 *    You want: Coffee → Add Sugar → Add Cream → Take to Table
 *
 *    OLD WAY (Callback Hell):
 *    getCoffee(function(coffee) {
 *      addSugar(coffee, function(sweetCoffee) {
 *        addCream(sweetCoffee, function(creamyCoffee) {
 *          takeToTable(creamyCoffee, function() {
 *            // Finally can drink!
 *          });
 *        });
 *      });
 *    });
 *
 *    NEW WAY (Promise Chain):
 *    getCoffee()
 *      .then(coffee => addSugar(coffee))
 *      .then(sweetCoffee => addCream(sweetCoffee))
 *      .then(creamyCoffee => takeToTable(creamyCoffee))
 *      .then(() => console.log('Enjoying my coffee! ☕'))
 *      .catch(error => console.log('Something went wrong:', error));
 *
 *    Each .then() is like a step in the process.
 *    If ANY step fails, you jump to .catch()
 *
 *
 * 5️⃣  CRITICAL RULES (What Most People Get Wrong)
 * ───────────────────────────────────────────────────────────────────────
 *
 *    ⚠️  RULE 1: Once your order is fulfilled/rejected, it CAN'T CHANGE
 *
 *        Bad barista: "Here's your coffee! Wait, actually it's tea!
 *                      No wait, it's orange juice!"
 *
 *        This CAN'T happen with promises!
 *        Once resolve() or reject() is called, the promise is SEALED FOREVER.
 *
 *        new Promise((resolve, reject) => {
 *          resolve('Coffee');
 *          resolve('Tea');     // ❌ IGNORED!
 *          reject('Error');    // ❌ IGNORED!
 *        });
 *
 *
 *    ⚠️  RULE 2: You MUST return the receipt to pass it to the next person
 *
 *        Imagine you get your coffee, but forget to tell your friend waiting
 *        outside. They're waiting forever for nothing!
 *
 *        getCoffee()
 *          .then(coffee => {
 *            addSugar(coffee);  // ❌ Didn't return! Next .then gets undefined!
 *          })
 *          .then(result => {
 *            console.log(result);  // undefined! Sugar was lost!
 *          });
 *
 *        FIX:
 *        getCoffee()
 *          .then(coffee => {
 *            return addSugar(coffee);  // ✅ Pass it along!
 *          })
 *          .then(sweetCoffee => {
 *            console.log(sweetCoffee);  // Got the sweet coffee!
 *          });
 *
 *
 *    ⚠️  RULE 3: You can recover from failures
 *
 *        Coffee shop: "Sorry, no milk for cappuccino."
 *        You: "That's okay, I'll get an Americano instead."
 *
 *        getCappuccino()
 *          .catch(error => {
 *            console.log('No cappuccino, getting Americano');
 *            return getAmericano();  // Recovery!
 *          })
 *          .then(coffee => {
 *            console.log('Got coffee anyway:', coffee);
 *          });
 *
 *
 * 6️⃣  PARALLEL ORDERS (Promise.all)
 * ───────────────────────────────────────────────────────────────────────
 *
 *    You're with 3 friends. Everyone orders different drinks.
 *
 *    SEQUENTIAL (Slow):
 *    Get coffee for Friend 1 → wait → done
 *    Get tea for Friend 2 → wait → done
 *    Get juice for Friend 3 → wait → done
 *    Total: 9 minutes
 *
 *    PARALLEL (Fast):
 *    Get all 3 drinks at once → wait → all done together!
 *    Total: 3 minutes
 *
 *    Promise.all([
 *      getCoffee(),
 *      getTea(),
 *      getJuice()
 *    ]).then(([coffee, tea, juice]) => {
 *      console.log('Everyone has their drink!');
 *    });
 *
 *    ⚠️  BUT: If ANY drink fails, the whole order fails!
 *        (If they run out of tea, nobody gets anything)
 *
 *
 * 7️⃣  THE "AHA!" MOMENT
 * ───────────────────────────────────────────────────────────────────────
 *
 *    🤔 "But why not just wait for the coffee?"
 *
 *    Because in JavaScript, you're not just getting coffee.
 *    You might be:
 *    • Fetching user data from a server (takes 2 seconds)
 *    • Loading images from the internet (takes 3 seconds)
 *    • Reading files from the disk (takes 1 second)
 *
 *    If you BLOCK and wait (old way), your entire app freezes.
 *    The user can't click anything. The UI is frozen. Terrible experience.
 *
 *    With Promises:
 *    "Hey, go fetch that data. When it's ready, call me.
 *     Meanwhile, I'll keep the UI responsive for the user."
 *
 *
 * 8️⃣  REMEMBER THIS:
 * ───────────────────────────────────────────────────────────────────────
 *
 *    Promise = Receipt for future value
 *    Pending = Barista is working
 *    Fulfilled = Got your coffee ✅
 *    Rejected = Something went wrong ❌
 *    .then() = "When ready, do this"
 *    .catch() = "If something fails, do this"
 *    .finally() = "No matter what, do this" (like cleaning your table)
 *
 *    And most importantly:
 *    🎯 Promises let you do OTHER THINGS while waiting for slow operations!
 *
 * ============================================================================
 */

/**
 * ============================================================================
 * WHY WERE PROMISES INTRODUCED?
 * ============================================================================
 */

// ❌ CALLBACK HELL - Hard to read and maintain
function callbackHell() {
  getData(function(a) {
    getMoreData(a, function(b) {
      getEvenMoreData(b, function(c) {
        getYetMoreData(c, function(d) {
          getFinalData(d, function(e) {
            console.log('Finally got data:', e);
          });
        });
      });
    });
  });
}

// ✅ WITH PROMISES - Clean and readable
function withPromises() {
  getData()
    .then(a => getMoreData(a))
    .then(b => getEvenMoreData(b))
    .then(c => getYetMoreData(c))
    .then(d => getFinalData(d))
    .then(e => console.log('Finally got data:', e))
    .catch(error => console.error('Error:', error));
}

/**
 * ============================================================================
 * PROMISE STATES
 * ============================================================================
 *
 * ┌─────────────────────────────────────────────────────────────────┐
 * │  1. PENDING    → Initial state, neither fulfilled nor rejected  │
 * │  2. FULFILLED  → Operation completed successfully               │
 * │  3. REJECTED   → Operation failed                               │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * Once a promise is fulfilled or rejected, it becomes "SETTLED"
 * and its state CANNOT change (promises are immutable).
 */

/**
 * ============================================================================
 * CREATING A PROMISE - THE BASICS
 * ============================================================================
 */

const myPromise = new Promise((resolve, reject) => {
  const success = true;

  if (success) {
    resolve('Success! Here is your data');  // Fulfill the promise
  } else {
    reject('Error! Something went wrong');  // Reject the promise
  }
});

console.log(myPromise);  // Promise { 'Success! Here is your data' }

/**
 * ⚡ WHAT BREAKS IF...?
 *
 * 1. What if you call both resolve() AND reject()?
 * 2. What if you call resolve() twice?
 * 3. What if you throw an error instead of calling reject()?
 * 4. What if the executor function is async?
 */

// EXPERIMENT 1: What if you call both resolve() and reject()?
console.log('\n=== EXPERIMENT 1: Calling both resolve() and reject() ===');
const exp1 = new Promise((resolve, reject) => {
  resolve('First');
  reject('Second');   // This is IGNORED!
  resolve('Third');   // This is also IGNORED!
});

exp1
  .then(result => console.log('Result:', result))   // 'Result: First'
  .catch(error => console.log('Error:', error));    // Never runs

/**
 * 💡 KEY INSIGHT:
 * Once a promise is settled (resolved or rejected), it's IMMUTABLE.
 * All subsequent resolve/reject calls are ignored.
 *
 * This is a COMMON INTERVIEW FOLLOW-UP!
 */

// EXPERIMENT 2: What if you throw an error instead of reject()?
console.log('\n=== EXPERIMENT 2: Throwing vs reject() ===');
const exp2 = new Promise((resolve, reject) => {
  throw new Error('I threw an error!');
  // This is equivalent to: reject(new Error('I threw an error!'))
});

exp2.catch(error => console.log('Caught:', error.message));  // 'Caught: I threw an error!'

/**
 * 💡 KEY INSIGHT:
 * Throwing an error in a promise executor automatically rejects the promise.
 * But this ONLY works synchronously! See next example...
 */

// EXPERIMENT 3: What if the error is thrown asynchronously?
console.log('\n=== EXPERIMENT 3: Async throw ===');
const exp3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    throw new Error('Async error!');  // ⚠️  This will NOT be caught!
  }, 1000);
});

// This catch will NOT catch the error!
exp3.catch(error => console.log('Caught?:', error.message));

/**
 * ⚠️  CRITICAL INTERVIEW TRAP:
 * Throwing errors in async callbacks (setTimeout, etc.) CANNOT be caught
 * by promise .catch(). You MUST use reject() explicitly!
 */

// ✅ CORRECT WAY:
const exp3Fixed = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(new Error('Async error!'));  // ✅ This works!
  }, 1000);
});

exp3Fixed.catch(error => console.log('Caught correctly:', error.message));

/**
 * ============================================================================
 * CONSUMING PROMISES: .then(), .catch(), .finally()
 * ============================================================================
 */

const promise1 = new Promise((resolve) => {
  setTimeout(() => resolve('Data loaded!'), 100);
});

promise1
  .then(result => {
    console.log('\n' + result);  // 'Data loaded!'
    return 'Next step';
  })
  .then(result => {
    console.log(result);  // 'Next step'
  })
  .catch(error => {
    console.error('Error:', error);
  });

/**
 * ⚡ WHAT BREAKS IF...?
 *
 * 1. What if you DON'T return anything in .then()?
 * 2. What if you return a regular value vs a Promise?
 * 3. What if you return a rejected promise inside .then()?
 * 4. What if an error is thrown AFTER .catch()?
 */

// EXPERIMENT 4: Forgetting to return
console.log('\n=== EXPERIMENT 4: Missing return ===');
Promise.resolve('First')
  .then(result => {
    console.log(result);              // 'First'
    Promise.resolve('Second');        // ⚠️  This promise is LOST!
  })
  .then(result => {
    console.log('Next:', result);     // 'Next: undefined'
  });

// ✅ CORRECT:
Promise.resolve('First')
  .then(result => {
    console.log(result);              // 'First'
    return Promise.resolve('Second'); // ✅ Return the promise!
  })
  .then(result => {
    console.log('Next:', result);     // 'Next: Second'
  });

/**
 * 💡 INTERVIEW INSIGHT:
 * .then() returns a NEW promise. If you don't return anything, the next
 * .then() receives 'undefined'. This is THE MOST COMMON promise mistake!
 */

// EXPERIMENT 5: Returning regular value vs Promise
console.log('\n=== EXPERIMENT 5: Value vs Promise ===');
Promise.resolve('Start')
  .then(result => {
    return 'Regular value';  // Not a promise
  })
  .then(result => {
    console.log(result);  // 'Regular value' - Works fine!
  });

Promise.resolve('Start')
  .then(result => {
    return Promise.resolve('Promise value');  // A promise
  })
  .then(result => {
    console.log(result);  // 'Promise value' - Promise is automatically unwrapped!
  });

/**
 * 💡 KEY INSIGHT:
 * You can return EITHER a regular value OR a promise from .then().
 * If you return a promise, it's automatically unwrapped.
 * This is called "promise resolution"!
 */

// EXPERIMENT 6: Error after .catch()
console.log('\n=== EXPERIMENT 6: Error after .catch() ===');
Promise.reject('Error 1')
  .catch(error => {
    console.log('Caught:', error);    // 'Caught: Error 1'
    throw new Error('Error 2');        // New error!
  })
  .then(result => {
    console.log('This will NOT run');
  })
  .catch(error => {
    console.log('Caught again:', error.message);  // 'Caught again: Error 2'
  });

/**
 * 💡 KEY INSIGHT:
 * .catch() returns a new promise. If you throw an error inside .catch(),
 * it creates a NEW rejected promise that needs another .catch()!
 */

/**
 * ============================================================================
 * PROMISE CHAINING - THE INTERVIEW KILLER
 * ============================================================================
 */

// Simple example
function step1() {
  return new Promise(resolve => {
    setTimeout(() => resolve('Step 1'), 100);
  });
}

function step2(prev) {
  return new Promise(resolve => {
    setTimeout(() => resolve(prev + ' → Step 2'), 100);
  });
}

function step3(prev) {
  return new Promise(resolve => {
    setTimeout(() => resolve(prev + ' → Step 3'), 100);
  });
}

console.log('\n=== Basic Chaining ===');
step1()
  .then(result => {
    console.log(result);
    return step2(result);
  })
  .then(result => {
    console.log(result);
    return step3(result);
  })
  .then(result => {
    console.log(result);
  });

/**
 * ⚡ INTERVIEW TWIST: "What if step2 fails?"
 */

function step2Failing(prev) {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject('Step 2 failed!'), 100);
  });
}

console.log('\n=== Chaining with Failure ===');
step1()
  .then(result => {
    console.log(result);
    return step2Failing(result);  // This will fail
  })
  .then(result => {
    console.log('This will NOT run:', result);
  })
  .catch(error => {
    console.log('Error caught:', error);
  });

/**
 * ⚡ INTERVIEW TWIST: "What if you want to continue after error?"
 */

console.log('\n=== Recovering from Errors ===');
step1()
  .then(result => {
    console.log(result);
    return step2Failing(result);
  })
  .catch(error => {
    console.log('Recovered from:', error);
    return 'Step 1 → Recovered';  // Return a value to continue!
  })
  .then(result => {
    console.log('Continuing:', result);
    return step3(result);
  })
  .then(result => {
    console.log('Final:', result);
  });

/**
 * 💡 CRITICAL INTERVIEW CONCEPT:
 * .catch() can RECOVER from errors by returning a value!
 * The chain continues with the next .then()!
 */

/**
 * ============================================================================
 * PROMISE + CLOSURES = INTERVIEW GOLD
 * ============================================================================
 */

console.log('\n=== Promise + Closures ===');

// QUESTION: What will this print?
function createPromises() {
  const promises = [];

  for (var i = 0; i < 3; i++) {
    promises.push(
      new Promise((resolve) => {
        setTimeout(() => resolve(i), 100);
      })
    );
  }

  return promises;
}

Promise.all(createPromises()).then(results => {
  console.log('Results:', results);  // ⚠️  What will this be?
});

/**
 * 💡 ANSWER: [3, 3, 3]
 *
 * WHY?
 * - 'var' has function scope, not block scope
 * - All promises share the SAME variable 'i'
 * - By the time promises resolve, the loop has finished and i = 3
 *
 * This combines: Promises + Closures + var/let scoping!
 */

// ✅ FIXES:

// Fix 1: Use 'let' (block scope)
function fix1() {
  const promises = [];
  for (let i = 0; i < 3; i++) {  // 'let' instead of 'var'
    promises.push(
      new Promise((resolve) => {
        setTimeout(() => resolve(i), 100);
      })
    );
  }
  return promises;
}

// Fix 2: Use IIFE to create closure
function fix2() {
  const promises = [];
  for (var i = 0; i < 3; i++) {
    (function(num) {  // IIFE captures current value
      promises.push(
        new Promise((resolve) => {
          setTimeout(() => resolve(num), 100);
        })
      );
    })(i);
  }
  return promises;
}

// Fix 3: Pass value to function
function fix3() {
  const promises = [];
  for (var i = 0; i < 3; i++) {
    promises.push(createPromise(i));
  }
  return promises;
}

function createPromise(num) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(num), 100);
  });
}

Promise.all(fix1()).then(results => {
  console.log('Fix 1 (let):', results);  // [0, 1, 2]
});

Promise.all(fix3()).then(results => {
  console.log('Fix 3 (function):', results);  // [0, 1, 2]
});

/**
 * ============================================================================
 * PROMISE + EVENT LOOP = INTERVIEW ESSENTIAL
 * ============================================================================
 */

console.log('\n=== Promise + Event Loop ===');

// QUESTION: What's the execution order?
console.log('1');

setTimeout(() => console.log('2'), 0);

Promise.resolve()
  .then(() => console.log('3'))
  .then(() => console.log('4'));

console.log('5');

/**
 * OUTPUT: 1, 5, 3, 4, 2
 *
 * WHY?
 * 1. Synchronous code runs first: '1', '5'
 * 2. Microtasks (Promises) run next: '3', '4'
 * 3. Macrotasks (setTimeout) run last: '2'
 *
 * This is CRITICAL for interviews!
 * Promises are MICROTASKS - they have priority over MACROTASKS (setTimeout)!
 */

/**
 * ⚡ INTERVIEW FOLLOW-UP: "What if we nest them?"
 */

console.log('\n=== Nested Promise + setTimeout ===');

console.log('A');

setTimeout(() => {
  console.log('B');
  Promise.resolve().then(() => console.log('C'));
}, 0);

Promise.resolve()
  .then(() => {
    console.log('D');
    setTimeout(() => console.log('E'), 0);
  })
  .then(() => console.log('F'));

console.log('G');

/**
 * OUTPUT: A, G, D, F, B, C, E
 *
 * BREAKDOWN:
 * 1. Sync: A, G
 * 2. Microtask queue: D (setTimeout E queued), F
 * 3. Macrotask queue: B (Promise C becomes microtask)
 * 4. Microtask queue: C
 * 5. Macrotask queue: E
 */

/**
 * ============================================================================
 * ASYNC/AWAIT - NOT JUST SYNTACTIC SUGAR!
 * ============================================================================
 */

// They look similar, but behave differently in edge cases!

console.log('\n=== .then() vs async/await ===');

// With .then() - continues execution immediately
function withThen() {
  console.log('Start then');
  Promise.resolve('Data')
    .then(result => {
      console.log('Inside then:', result);
    });
  console.log('End then');
}

// With async/await - waits for promise
async function withAwait() {
  console.log('Start await');
  const result = await Promise.resolve('Data');
  console.log('Inside await:', result);
  console.log('End await');
}

withThen();
// Output:
// Start then
// End then
// Inside then: Data

setTimeout(() => {
  withAwait();
  // Output:
  // Start await
  // Inside await: Data
  // End await
}, 200);

/**
 * 💡 KEY DIFFERENCE:
 * - .then() is NON-BLOCKING - execution continues
 * - await is BLOCKING (within the async function) - execution pauses
 */

/**
 * ⚡ INTERVIEW TRAP: Error handling differences
 */

console.log('\n=== Error Handling: .then() vs async/await ===');

// With .then() - errors don't throw to outer scope
function errorWithThen() {
  try {
    Promise.reject('Error')
      .then(result => console.log(result))
      .catch(error => console.log('Caught in .catch():', error));
  } catch (e) {
    console.log('Caught in try/catch:', e);  // This will NOT run!
  }
}

// With async/await - errors can be caught with try/catch
async function errorWithAwait() {
  try {
    await Promise.reject('Error');
  } catch (e) {
    console.log('Caught in try/catch:', e);  // ✅ This works!
  }
}

errorWithThen();
setTimeout(() => errorWithAwait(), 300);

/**
 * ============================================================================
 * COMMON INTERVIEW MISTAKES (AND WHY THEY HAPPEN)
 * ============================================================================
 */

// ❌ MISTAKE 1: Promise constructor anti-pattern
function badFetch(url) {
  return new Promise((resolve, reject) => {
    fetch(url)  // fetch ALREADY returns a promise!
      .then(response => resolve(response))
      .catch(error => reject(error));
  });
}

// ✅ CORRECT: Just return the promise
function goodFetch(url) {
  return fetch(url);
}

/**
 * ❌ MISTAKE 2: Not returning in .then()
 */
function badChain() {
  return Promise.resolve('data')
    .then(result => {
      doSomething(result);  // Missing return!
    })
    .then(result => {
      console.log(result);  // undefined!
    });
}

// ✅ CORRECT: Return the result
function goodChain() {
  return Promise.resolve('data')
    .then(result => {
      return doSomething(result);  // ✅ Return!
    })
    .then(result => {
      console.log(result);  // Correct value
    });
}

/**
 * ❌ MISTAKE 3: Sequential instead of parallel
 */
async function badParallel() {
  const user = await fetchUser(1);      // Waits
  const posts = await fetchPosts(1);    // Then waits
  const comments = await fetchComments(1);  // Then waits
  // Total: 3 seconds if each takes 1 second
}

// ✅ CORRECT: Run in parallel
async function goodParallel() {
  const [user, posts, comments] = await Promise.all([
    fetchUser(1),
    fetchPosts(1),
    fetchComments(1)
  ]);
  // Total: 1 second (all run simultaneously)
}

/**
 * ============================================================================
 * INTERVIEW SIMULATION: THE REAL TEST
 * ============================================================================
 *
 * INTERVIEWER: "Explain what happens here:"
 */

async function complexScenario() {
  console.log('1');

  const promise1 = new Promise((resolve) => {
    console.log('2');
    resolve('3');
  });

  console.log('4');

  const result = await promise1;
  console.log(result);

  Promise.resolve().then(() => console.log('5'));

  console.log('6');
}

complexScenario();
console.log('7');

/**
 * ANSWER: 2, 4, 1, 7, 3, 6, 5
 *
 * EXPLANATION:
 * 1. 'complexScenario' is called (async function)
 * 2. console.log('1') executes → '1'
 * 3. Promise constructor executes IMMEDIATELY → '2'
 * 4. promise1 is already resolved
 * 5. console.log('4') executes → '4'
 * 6. 'await' pauses the async function, returns control to caller
 * 7. console.log('7') executes → '7'
 * 8. Microtask queue processes: await resumes
 * 9. console.log(result) executes → '3'
 * 10. Promise.resolve().then() queues '5' as microtask
 * 11. console.log('6') executes → '6'
 * 12. Microtask queue processes → '5'
 *
 * FOLLOW-UP: "What if the promise had a setTimeout inside?"
 * FOLLOW-UP: "What if we remove 'await'?"
 * FOLLOW-UP: "What if complexScenario was NOT async?"
 */

/**
 * ============================================================================
 * KEY TAKEAWAYS - INTERVIEW PERSPECTIVE
 * ============================================================================
 *
 * LEVEL 1 - RECOGNITION (Everyone knows this):
 * ✓ Promises have three states
 * ✓ Use .then() for success, .catch() for errors
 * ✓ Async/await is cleaner syntax
 *
 * LEVEL 2 - APPLICATION (Better, but not enough):
 * ✓ Can write promise chains
 * ✓ Can convert callbacks to promises
 * ✓ Can use Promise.all()
 *
 * LEVEL 3 - MOVEMENT (Interview ready):
 * ✓ Know what breaks when you don't return in .then()
 * ✓ Understand promise + closure interactions
 * ✓ Can trace execution with event loop (microtasks vs macrotasks)
 * ✓ Know error handling differences (.then vs async/await)
 * ✓ Recognize when to use parallel vs sequential
 * ✓ Can explain promise resolution/unwrapping
 * ✓ Understand promise constructor anti-pattern
 *
 * INTERVIEWS TEST LEVEL 3!
 */

/**
 * ============================================================================
 * PRACTICE QUESTIONS (TRY THESE!)
 * ============================================================================
 *
 * 1. What prints and in what order?
 *    Promise.resolve(1)
 *      .then(x => x + 1)
 *      .then(x => { throw new Error('fail') })
 *      .catch(() => 2)
 *      .then(x => console.log(x))
 *
 * 2. What's the difference?
 *    await Promise.resolve(1)
 *    vs
 *    Promise.resolve(1).then(x => x)
 *
 * 3. Fix this code:
 *    for (var i = 0; i < 3; i++) {
 *      setTimeout(() => {
 *        Promise.resolve(i).then(console.log)
 *      }, 100)
 *    }
 *
 * 4. Why is this bad?
 *    new Promise((resolve) => {
 *      resolve(Promise.resolve(1))
 *    })
 *
 * 5. What's the execution order?
 *    async function test() {
 *      console.log('1')
 *      await console.log('2')
 *      console.log('3')
 *    }
 *    test()
 *    console.log('4')
 */

/**
 * HELPER FUNCTIONS (used in examples above)
 */
function getData() { return Promise.resolve('data'); }
function getMoreData(a) { return Promise.resolve(a + ' more'); }
function getEvenMoreData(b) { return Promise.resolve(b + ' even more'); }
function getYetMoreData(c) { return Promise.resolve(c + ' yet more'); }
function getFinalData(d) { return Promise.resolve(d + ' final'); }
function doSomething(x) { return x; }
function fetchUser(id) {
  return new Promise(resolve => setTimeout(() => resolve({ id }), 100));
}
function fetchPosts(id) {
  return new Promise(resolve => setTimeout(() => resolve([]), 100));
}
function fetchComments(id) {
  return new Promise(resolve => setTimeout(() => resolve([]), 100));
}

/**
 * RUN: node docs/javascript/10-promise-methods/00-what-are-promises.js
 *
 * NEXT STEPS:
 * 1. Run this file and study the outputs
 * 2. Modify the code - break things on purpose
 * 3. Read INSTRUCTIONS.md for the learning methodology
 * 4. Practice explaining out loud
 * 5. Move to promise-specific methods (Promise.all, race, etc.)
 */
