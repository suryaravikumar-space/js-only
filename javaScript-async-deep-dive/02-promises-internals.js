/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                              ║
 * ║         JAVASCRIPT ASYNC DEEP DIVE - PART 2: PROMISES INTERNALS              ║
 * ║                                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║  🎤 1-2 MINUTE INTERVIEW EXPLANATION                                         ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                              ║
 * ║  "A Promise is an object representing the eventual completion or failure    ║
 * ║  of an async operation. It solves callback problems by providing:            ║
 * ║                                                                              ║
 * ║  THREE STATES (and it can only be in one):                                   ║
 * ║  - PENDING: Initial state, operation not complete                            ║
 * ║  - FULFILLED: Operation completed successfully                               ║
 * ║  - REJECTED: Operation failed                                                ║
 * ║                                                                              ║
 * ║  KEY GUARANTEES:                                                             ║
 * ║  1. Once settled (fulfilled/rejected), state NEVER changes                   ║
 * ║  2. Handlers are called at most ONCE                                         ║
 * ║  3. .then() always returns a NEW promise (enables chaining)                  ║
 * ║  4. Errors propagate through the chain until caught                          ║
 * ║                                                                              ║
 * ║  CHAINING:                                                                   ║
 * ║  - .then(onFulfilled, onRejected) - handles success/failure                  ║
 * ║  - .catch(onRejected) - shorthand for .then(null, onRejected)               ║
 * ║  - .finally(onSettled) - runs regardless of outcome                          ║
 * ║  - Return value from handler becomes next promise's value                    ║
 * ║  - Throw in handler rejects the returned promise                             ║
 * ║                                                                              ║
 * ║  STATIC METHODS:                                                             ║
 * ║  - Promise.all([]) - wait for ALL, fail on ANY                               ║
 * ║  - Promise.race([]) - first to settle wins                                   ║
 * ║  - Promise.allSettled([]) - wait for ALL, never fails                        ║
 * ║  - Promise.any([]) - first to FULFILL wins, fail only if ALL fail"           ║
 * ║                                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ PROMISE STATES                                                               │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   A Promise is always in one of three states:
 *
 *                        ┌─────────────────────────┐
 *                        │        PENDING          │
 *                        │   (initial state)       │
 *                        └───────────┬─────────────┘
 *                                    │
 *                     ┌──────────────┴──────────────┐
 *                     │                             │
 *                     ▼                             ▼
 *        ┌─────────────────────┐      ┌─────────────────────┐
 *        │     FULFILLED       │      │      REJECTED       │
 *        │   (resolved with    │      │   (rejected with    │
 *        │      value)         │      │      reason)        │
 *        └─────────────────────┘      └─────────────────────┘
 *
 *
 *   IMPORTANT: Once a Promise is SETTLED (fulfilled or rejected),
 *              it CANNOT change state again!
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ CREATING PROMISES                                                            │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   new Promise(function(resolve, reject) {
 *     // Executor function - runs IMMEDIATELY (synchronously)
 *
 *     // Call resolve(value) for success
 *     // Call reject(reason) for failure
 *   });
 *
 *
 *   EXAMPLE:
 *   ════════
 *
 *   var promise = new Promise(function(resolve, reject) {
 *     setTimeout(function() {
 *       var success = Math.random() > 0.5;
 *       if (success) {
 *         resolve('Operation succeeded!');   // Fulfills the promise
 *       } else {
 *         reject(new Error('Operation failed'));  // Rejects the promise
 *       }
 *     }, 1000);
 *   });
 *
 *
 *   EXECUTOR RUNS SYNCHRONOUSLY:
 *   ════════════════════════════
 *
 *   console.log('1');
 *   new Promise(function(resolve) {
 *     console.log('2');  // Runs immediately!
 *     resolve('done');
 *   }).then(function() {
 *     console.log('4');  // Runs as microtask
 *   });
 *   console.log('3');
 *
 *   Output: 1, 2, 3, 4
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ PROMISE CHAINING                                                             │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   .then() ALWAYS returns a NEW promise!
 *
 *
 *   BASIC CHAINING:
 *   ═══════════════
 *
 *   fetch('/api/user')
 *     .then(function(response) {
 *       return response.json();        // Returns promise
 *     })
 *     .then(function(user) {
 *       return fetch('/api/posts/' + user.id);  // Returns promise
 *     })
 *     .then(function(response) {
 *       return response.json();
 *     })
 *     .then(function(posts) {
 *       console.log(posts);
 *     })
 *     .catch(function(error) {
 *       console.error(error);          // Catches ANY error above
 *     });
 *
 *
 *   WHAT HANDLERS CAN RETURN:
 *   ═════════════════════════
 *
 *   .then(function(value) {
 *     return 42;                // Next .then gets 42
 *     return Promise.resolve(42);  // Same as above
 *     throw new Error('oops');  // Next .catch gets error
 *     // return nothing         // Next .then gets undefined
 *   })
 *
 *
 *   CHAINING VISUALIZED:
 *   ════════════════════
 *
 *   Promise.resolve(1)
 *     │
 *     ▼ .then(x => x + 1)
 *   Promise(2)
 *     │
 *     ▼ .then(x => x * 2)
 *   Promise(4)
 *     │
 *     ▼ .then(x => console.log(x))
 *   Promise(undefined)
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ ERROR HANDLING                                                               │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   Errors propagate through the chain until caught:
 *
 *   Promise.resolve('start')
 *     .then(function() {
 *       throw new Error('Something broke!');
 *     })
 *     .then(function() {
 *       console.log('This is skipped');   // Skipped!
 *     })
 *     .then(function() {
 *       console.log('This too');          // Skipped!
 *     })
 *     .catch(function(err) {
 *       console.log('Caught:', err.message);  // 'Caught: Something broke!'
 *       return 'recovered';               // Chain continues!
 *     })
 *     .then(function(value) {
 *       console.log(value);               // 'recovered'
 *     });
 *
 *
 *   .catch() vs .then(null, onRejected):
 *   ════════════════════════════════════
 *
 *   // These are equivalent:
 *   promise.catch(handleError);
 *   promise.then(null, handleError);
 *
 *   // BUT this catches errors in handleSuccess too:
 *   promise
 *     .then(handleSuccess)
 *     .catch(handleError);    // Catches errors from handleSuccess
 *
 *   // This does NOT catch errors in handleSuccess:
 *   promise.then(handleSuccess, handleError);  // handleError only for promise
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ PROMISE.FINALLY()                                                            │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   .finally() runs regardless of fulfilled or rejected:
 *
 *   showLoadingSpinner();
 *
 *   fetchData()
 *     .then(function(data) {
 *       displayData(data);
 *     })
 *     .catch(function(error) {
 *       showError(error);
 *     })
 *     .finally(function() {
 *       hideLoadingSpinner();  // Always runs!
 *     });
 *
 *
 *   KEY BEHAVIOR:
 *   - Does NOT receive the value or reason
 *   - Passes through the value/reason to next handler
 *   - Unless it throws, then the thrown value propagates
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ STATIC METHODS                                                               │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   ┌─────────────────────────────────────────────────────────────────────────┐
 *   │ METHOD              │ BEHAVIOR                                         │
 *   ├─────────────────────────────────────────────────────────────────────────┤
 *   │ Promise.resolve(v)  │ Creates fulfilled promise with value v           │
 *   │                     │                                                   │
 *   │ Promise.reject(r)   │ Creates rejected promise with reason r           │
 *   │                     │                                                   │
 *   │ Promise.all([])     │ Waits for ALL to fulfill                         │
 *   │                     │ Rejects immediately if ANY rejects               │
 *   │                     │ Returns array of results in order                │
 *   │                     │                                                   │
 *   │ Promise.race([])    │ Returns first promise to SETTLE                  │
 *   │                     │ (whether fulfilled or rejected)                  │
 *   │                     │                                                   │
 *   │ Promise.allSettled  │ Waits for ALL to settle                          │
 *   │ ([])                │ Never rejects                                    │
 *   │                     │ Returns [{status, value/reason}, ...]            │
 *   │                     │                                                   │
 *   │ Promise.any([])     │ Returns first promise to FULFILL                 │
 *   │                     │ Only rejects if ALL reject                       │
 *   └─────────────────────────────────────────────────────────────────────────┘
 *
 *
 *   VISUAL COMPARISON:
 *   ══════════════════
 *
 *   Promises: [A(100ms, ✓), B(50ms, ✗), C(150ms, ✓)]
 *
 *   Promise.all     → REJECTS at 50ms (B failed)
 *   Promise.race    → REJECTS at 50ms (B settled first)
 *   Promise.allSettled → RESOLVES at 150ms with all results
 *   Promise.any     → RESOLVES at 100ms (A fulfilled first)
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ HOW PROMISES SOLVE CALLBACK PROBLEMS                                         │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   ┌─────────────────────────────────────────────────────────────────────────┐
 *   │ CALLBACK PROBLEM         │ PROMISE SOLUTION                            │
 *   ├─────────────────────────────────────────────────────────────────────────┤
 *   │ Callback Hell            │ Flat .then() chains                         │
 *   │                          │                                             │
 *   │ Inversion of Control     │ Promise can only settle ONCE               │
 *   │ (callback called wrong)  │ Handlers called at most once               │
 *   │                          │                                             │
 *   │ Error handling           │ Errors propagate through chain             │
 *   │                          │ Single .catch() handles all errors         │
 *   │                          │                                             │
 *   │ Difficult composition    │ Promise.all, .race, .allSettled, .any     │
 *   │                          │                                             │
 *   │ Hard to read             │ Reads top-to-bottom like sync code         │
 *   └─────────────────────────────────────────────────────────────────────────┘
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ COMMON MISTAKES                                                              │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   MISTAKE 1: Forgetting to return
 *   ════════════════════════════════
 *
 *   // BAD - promise not returned, chain broken
 *   .then(function(value) {
 *     doSomethingAsync(value);  // Returns promise but not returned!
 *   })
 *   .then(function(result) {
 *     // result is undefined!
 *   });
 *
 *   // GOOD - return the promise
 *   .then(function(value) {
 *     return doSomethingAsync(value);
 *   })
 *
 *
 *   MISTAKE 2: Nesting instead of chaining
 *   ═══════════════════════════════════════
 *
 *   // BAD - Promise hell (same problem as callbacks!)
 *   getUser().then(function(user) {
 *     getOrders(user.id).then(function(orders) {
 *       getDetails(orders[0]).then(function(details) {
 *         console.log(details);
 *       });
 *     });
 *   });
 *
 *   // GOOD - Flat chain
 *   getUser()
 *     .then(function(user) { return getOrders(user.id); })
 *     .then(function(orders) { return getDetails(orders[0]); })
 *     .then(function(details) { console.log(details); });
 *
 *
 *   MISTAKE 3: Missing error handling
 *   ══════════════════════════════════
 *
 *   // BAD - unhandled rejection
 *   fetch('/api').then(processData);
 *
 *   // GOOD - always handle errors
 *   fetch('/api')
 *     .then(processData)
 *     .catch(handleError);
 *
 *
 * RUN: node javaScript-async-deep-dive/02-promises-internals.js
 */

// ═══════════════════════════════════════════════════════════════════════════════
//                         EXECUTABLE EXAMPLES
// ═══════════════════════════════════════════════════════════════════════════════

console.log('═'.repeat(70));
console.log('       ASYNC DEEP DIVE - PART 2: PROMISES INTERNALS');
console.log('═'.repeat(70));

// 1. Promise States
console.log('\n1. PROMISE STATES:');
console.log('─'.repeat(40));

var pendingPromise = new Promise(function(resolve) {
  // Never resolves - stays pending
});
console.log('   Pending promise created (never resolves)');

var fulfilledPromise = Promise.resolve('Success value');
console.log('   Fulfilled promise created');

var rejectedPromise = Promise.reject(new Error('Failure reason'));
rejectedPromise.catch(function() {}); // Silence unhandled rejection
console.log('   Rejected promise created');

// 2. Executor Runs Synchronously
console.log('\n2. EXECUTOR RUNS SYNCHRONOUSLY:');
console.log('─'.repeat(40));

console.log('   1. Before Promise');
new Promise(function(resolve) {
  console.log('   2. Inside executor (sync!)');
  resolve('done');
}).then(function() {
  console.log('   4. Inside .then (microtask)');
});
console.log('   3. After Promise');

// 3. Promise Chaining
console.log('\n3. PROMISE CHAINING:');
console.log('─'.repeat(40));

Promise.resolve(1)
  .then(function(x) {
    console.log('   Step 1: received', x);
    return x + 1;
  })
  .then(function(x) {
    console.log('   Step 2: received', x);
    return x * 2;
  })
  .then(function(x) {
    console.log('   Step 3: received', x);
    return x + 10;
  })
  .then(function(x) {
    console.log('   Final value:', x);
  });

// 4. Error Propagation
console.log('\n4. ERROR PROPAGATION:');
console.log('─'.repeat(40));

setTimeout(function() {
  Promise.resolve('start')
    .then(function(val) {
      console.log('   Step 1:', val);
      throw new Error('Error at step 2!');
    })
    .then(function() {
      console.log('   Step 2: SKIPPED');
    })
    .then(function() {
      console.log('   Step 3: SKIPPED');
    })
    .catch(function(err) {
      console.log('   Caught:', err.message);
      return 'recovered';
    })
    .then(function(val) {
      console.log('   After recovery:', val);
    });
}, 100);

// 5. Promise.all
console.log('\n5. PROMISE.ALL:');
console.log('─'.repeat(40));

setTimeout(function() {
  var p1 = new Promise(function(resolve) {
    setTimeout(function() { resolve('A (100ms)'); }, 100);
  });
  var p2 = new Promise(function(resolve) {
    setTimeout(function() { resolve('B (50ms)'); }, 50);
  });
  var p3 = new Promise(function(resolve) {
    setTimeout(function() { resolve('C (75ms)'); }, 75);
  });

  console.log('   Starting Promise.all...');
  Promise.all([p1, p2, p3]).then(function(results) {
    console.log('   Promise.all results:', results);
    console.log('   ^ Order preserved, completes when slowest finishes');
  });
}, 200);

// 6. Promise.all with rejection
console.log('\n6. PROMISE.ALL WITH REJECTION:');
console.log('─'.repeat(40));

setTimeout(function() {
  var p1 = new Promise(function(resolve) {
    setTimeout(function() { resolve('Success A'); }, 100);
  });
  var p2 = new Promise(function(resolve, reject) {
    setTimeout(function() { reject(new Error('B Failed!')); }, 50);
  });
  var p3 = new Promise(function(resolve) {
    setTimeout(function() { resolve('Success C'); }, 75);
  });

  console.log('   Starting Promise.all (one will reject)...');
  Promise.all([p1, p2, p3])
    .then(function(results) {
      console.log('   Results:', results);
    })
    .catch(function(err) {
      console.log('   Promise.all rejected:', err.message);
      console.log('   ^ Fails fast on first rejection');
    });
}, 400);

// 7. Promise.race
console.log('\n7. PROMISE.RACE:');
console.log('─'.repeat(40));

setTimeout(function() {
  var slow = new Promise(function(resolve) {
    setTimeout(function() { resolve('Slow (200ms)'); }, 200);
  });
  var fast = new Promise(function(resolve) {
    setTimeout(function() { resolve('Fast (50ms)'); }, 50);
  });
  var medium = new Promise(function(resolve) {
    setTimeout(function() { resolve('Medium (100ms)'); }, 100);
  });

  console.log('   Starting Promise.race...');
  Promise.race([slow, fast, medium]).then(function(winner) {
    console.log('   Winner:', winner);
    console.log('   ^ First to settle wins');
  });
}, 600);

// 8. Promise.allSettled
console.log('\n8. PROMISE.ALLSETTLED:');
console.log('─'.repeat(40));

setTimeout(function() {
  var p1 = Promise.resolve('Success 1');
  var p2 = Promise.reject(new Error('Error 2'));
  var p3 = Promise.resolve('Success 3');

  console.log('   Starting Promise.allSettled...');
  Promise.allSettled([p1, p2, p3]).then(function(results) {
    results.forEach(function(result, i) {
      if (result.status === 'fulfilled') {
        console.log('   [' + i + '] Fulfilled:', result.value);
      } else {
        console.log('   [' + i + '] Rejected:', result.reason.message);
      }
    });
    console.log('   ^ Never rejects, reports all outcomes');
  });
}, 900);

// 9. Promise.any
console.log('\n9. PROMISE.ANY:');
console.log('─'.repeat(40));

setTimeout(function() {
  var p1 = new Promise(function(resolve, reject) {
    setTimeout(function() { reject(new Error('First fails')); }, 50);
  });
  var p2 = new Promise(function(resolve) {
    setTimeout(function() { resolve('Second succeeds!'); }, 100);
  });
  var p3 = new Promise(function(resolve, reject) {
    setTimeout(function() { reject(new Error('Third fails')); }, 75);
  });

  console.log('   Starting Promise.any...');
  Promise.any([p1, p2, p3])
    .then(function(winner) {
      console.log('   First to fulfill:', winner);
      console.log('   ^ Ignores rejections if any fulfills');
    })
    .catch(function(err) {
      console.log('   All rejected:', err);
    });
}, 1100);

// 10. Promise.finally
console.log('\n10. PROMISE.FINALLY:');
console.log('─'.repeat(40));

setTimeout(function() {
  console.log('   Testing .finally() on success:');
  Promise.resolve('data')
    .then(function(val) {
      console.log('   Then:', val);
      return val;
    })
    .finally(function() {
      console.log('   Finally: cleanup (no value received)');
    })
    .then(function(val) {
      console.log('   After finally:', val, '(value passed through)');
    });
}, 1300);

// 11. Comparing with Callbacks
console.log('\n11. CALLBACKS vs PROMISES:');
console.log('─'.repeat(40));

setTimeout(function() {
  // Simulated async operations
  function getUser(id) {
    return new Promise(function(resolve) {
      setTimeout(function() { resolve({ id: id, name: 'John' }); }, 50);
    });
  }

  function getOrders(userId) {
    return new Promise(function(resolve) {
      setTimeout(function() { resolve(['Order1', 'Order2']); }, 50);
    });
  }

  // Clean promise chain (vs callback hell)
  console.log('   Promise chain (flat, readable):');
  getUser(1)
    .then(function(user) {
      console.log('   Got user:', user.name);
      return getOrders(user.id);
    })
    .then(function(orders) {
      console.log('   Got orders:', orders);
    })
    .catch(function(err) {
      console.log('   Error:', err);
    });
}, 1500);

// Summary
setTimeout(function() {
  console.log('\n' + '═'.repeat(70));
  console.log('       PROMISE INTERNALS SUMMARY:');
  console.log('─'.repeat(70));
  console.log('   States: PENDING → FULFILLED or REJECTED (immutable)');
  console.log('   .then() always returns a NEW promise');
  console.log('   Errors propagate until caught by .catch()');
  console.log('   .finally() runs regardless, passes value through');
  console.log('');
  console.log('   Static Methods:');
  console.log('   - Promise.all    → All must succeed');
  console.log('   - Promise.race   → First to settle');
  console.log('   - Promise.allSettled → Wait for all, report all');
  console.log('   - Promise.any    → First to succeed');
  console.log('═'.repeat(70) + '\n');
}, 1800);
