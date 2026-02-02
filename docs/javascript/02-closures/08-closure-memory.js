/**
 * TOPIC: Closure Memory & References
 *
 * STORY: THE HOARDER'S STORAGE UNIT
 * A closure is like renting a storage unit. Even if you only need one small
 * box from the unit, you're still paying for the whole room. If you forget
 * to cancel the rental (remove the reference), the storage unit stays full
 * forever. The smart approach: take out what you need, then let the storage
 * company reclaim the space (garbage collection).
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Closures keep references to outer variables ALIVE.                         ║
 * ║ The entire scope is retained, even unused variables!                       ║
 * ║ This can cause memory leaks if not careful.                                ║
 * ║                                                                            ║
 * ║   function create() {                                                      ║
 * ║     var huge = loadMegabytes();  // Might be retained!                     ║
 * ║     var small = 'needed';                                                  ║
 * ║     return function() { return small; };  // Only uses small               ║
 * ║   }                                                                        ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

function createHeavyObject() {
  const heavyData = new Array(1000000).fill('data'); // ES6: const
  const id = Math.random(); // ES6: const

  return {
    getId() { // ES6: shorthand method
      return id;
    }
    // Note: heavyData is NOT used in returned object
  };
}

const obj1 = createHeavyObject(); // ES6: const
console.log('A:', obj1.getId() > 0);

// Question: Is heavyData garbage collected?
console.log('B:', 'heavyData may be retained in closure');

function createOptimized() {
  let heavyData = new Array(1000000).fill('data'); // ES6: let (will be nulled)
  const id = Math.random(); // ES6: const
  const length = heavyData.length; // ES6: const — extract what we need

  heavyData = null; // Allow GC

  return {
    getId() { return id; }, // ES6: shorthand methods
    getLength() { return length; }
  };
}

const obj2 = createOptimized(); // ES6: const
console.log('C:', obj2.getLength());

/**
 * OUTPUT:
 *   A: true
 *   B: heavyData may be retained in closure
 *   C: 1000000
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: obj1.getId() > 0                                                        ║
 * ║ ──────────────────                                                         ║
 * ║   • getId has closure over 'id' (Math.random())                            ║
 * ║   • Random number is between 0 and 1                                       ║
 * ║   • Almost always > 0 (can be exactly 0 but very rare)                     ║
 * ║   • Returns true                                                           ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ B: Memory Question                                                         ║
 * ║ ──────────────────                                                         ║
 * ║   • heavyData is NOT used in the returned object                           ║
 * ║   • BUT it might still be kept in memory!                                  ║
 * ║   • Why? The closure captures the ENTIRE scope                             ║
 * ║   • Modern engines MAY optimize this away, but not guaranteed              ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ C: obj2.getLength()                                                        ║
 * ║ ───────────────────                                                        ║
 * ║   • We extracted length BEFORE nulling heavyData                           ║
 * ║   • heavyData = null allows garbage collection                             ║
 * ║   • getLength() returns 1000000 (the extracted value)                      ║
 * ║   • This is the SAFE pattern for large data                                ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ MEMORY LEAK SCENARIOS                                                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. FORGOTTEN EVENT LISTENERS                                                │
 * │                                                                             │
 * │    function setup() {                                                       │
 * │      var bigData = loadHugeFile();  // 100MB                                │
 * │                                                                             │
 * │      element.addEventListener('click', function() {                         │
 * │        console.log(bigData.length);                                         │
 * │      });                                                                    │
 * │      // bigData lives as long as the listener exists!                       │
 * │    }                                                                        │
 * │                                                                             │
 * │    FIX: Remove listener when done                                           │
 * │    element.removeEventListener('click', handler);                           │
 * │                                                                             │
 * │                                                                             │
 * │ 2. FORGOTTEN TIMERS                                                         │
 * │                                                                             │
 * │    function startPolling() {                                                │
 * │      var data = loadBigData();                                              │
 * │                                                                             │
 * │      setInterval(function() {                                               │
 * │        console.log(data[0]);                                                │
 * │      }, 1000);                                                              │
 * │      // data lives FOREVER until clearInterval!                             │
 * │    }                                                                        │
 * │                                                                             │
 * │    FIX: Store interval ID and clear when done                               │
 * │    var intervalId = setInterval(...);                                       │
 * │    clearInterval(intervalId);                                               │
 * │                                                                             │
 * │                                                                             │
 * │ 3. CIRCULAR REFERENCES WITH DOM                                             │
 * │                                                                             │
 * │    function setup() {                                                       │
 * │      var element = document.getElementById('target');                       │
 * │                                                                             │
 * │      element.onclick = function() {                                         │
 * │        // Closure holds reference to element                                │
 * │        console.log(element.innerHTML);                                      │
 * │      };                                                                     │
 * │      // element → handler → closure → element (circular!)                   │
 * │    }                                                                        │
 * │                                                                             │
 * │    FIX: Use 'this' inside handler or nullify references                     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ BEST PRACTICES TO AVOID MEMORY LEAKS                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. NULL REFERENCES YOU DON'T NEED                                           │
 * │                                                                             │
 * │    function process() {                                                     │
 * │      var bigData = loadBigData();                                           │
 * │      var result = analyze(bigData);                                         │
 * │                                                                             │
 * │      bigData = null;  // Allow GC                                           │
 * │                                                                             │
 * │      return function() {                                                    │
 * │        return result;  // Only keeps what's needed                          │
 * │      };                                                                     │
 * │    }                                                                        │
 * │                                                                             │
 * │                                                                             │
 * │ 2. EXTRACT WHAT YOU NEED                                                    │
 * │                                                                             │
 * │    function create() {                                                      │
 * │      var bigObject = getBigObject();                                        │
 * │      var name = bigObject.name;  // Extract                                 │
 * │      var id = bigObject.id;      // Extract                                 │
 * │                                                                             │
 * │      return {                                                               │
 * │        getName: function() { return name; },                                │
 * │        getId: function() { return id; }                                     │
 * │      };                                                                     │
 * │      // bigObject is NOT referenced, can be GC'd                            │
 * │    }                                                                        │
 * │                                                                             │
 * │                                                                             │
 * │ 3. CLEAN UP IN LIFECYCLE METHODS                                            │
 * │                                                                             │
 * │    // React example                                                         │
 * │    useEffect(() => {                                                        │
 * │      const handler = () => { ... };                                         │
 * │      window.addEventListener('resize', handler);                            │
 * │                                                                             │
 * │      return () => {                                                         │
 * │        window.removeEventListener('resize', handler);  // Cleanup!          │
 * │      };                                                                     │
 * │    }, []);                                                                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * INTERVIEW QUESTIONS:
 *
 * Q: "Can closures cause memory leaks? How?"
 * A: Yes. Closures keep references to their entire outer scope alive. Even if a
 *    variable isn't used in the closure, it might still be retained in memory.
 *    Common scenarios: event listeners never removed, setInterval timers never
 *    cleared, large data structures kept when only small parts are needed.
 *
 * Q: "How do you prevent closure-related memory leaks?"
 * A: (1) Null out large objects after extracting needed values. (2) Always remove
 *    event listeners and clear timers when done. (3) Extract only needed data
 *    instead of closing over entire objects. (4) Use WeakMap/WeakSet (ES6) for
 *    references that shouldn't prevent garbage collection. (5) In React, use
 *    cleanup functions in useEffect to remove listeners.
 *
 * Q: "Do modern engines optimize unused closure variables away?"
 * A: V8 and other modern engines can optimize away variables not referenced by
 *    the closure (dead variable elimination). But don't rely on this — if you use
 *    `eval()` or debugger tools, the engine can't optimize because it doesn't know
 *    which variables might be accessed. Explicitly clean up for safety.
 *
 *
 * RUN: node docs/javascript/02-closures/08-closure-memory.js
 */
