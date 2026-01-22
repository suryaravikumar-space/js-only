/**
 * CHALLENGE 08: Closure Memory & References
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
  var heavyData = new Array(1000000).fill('data');
  var id = Math.random();

  return {
    getId: function() {
      return id;
    }
    // Note: heavyData is NOT used in returned object
  };
}

var obj1 = createHeavyObject();
console.log('A:', obj1.getId() > 0);

// Question: Is heavyData garbage collected?
console.log('B:', 'heavyData may be retained in closure');

function createOptimized() {
  var heavyData = new Array(1000000).fill('data');
  var id = Math.random();
  var length = heavyData.length; // Extract what we need

  heavyData = null; // Allow GC

  return {
    getId: function() { return id; },
    getLength: function() { return length; }
  };
}

var obj2 = createOptimized();
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
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Closures can cause memory leaks because they keep references to their      │
 * │  entire outer scope alive. Even if a variable isn't used in the closure,    │
 * │  it might still be retained in memory.                                      │
 * │                                                                             │
 * │  Common leak scenarios:                                                     │
 * │  1. Event listeners that are never removed                                  │
 * │  2. setInterval timers that are never cleared                               │
 * │  3. Large data structures kept in closure when only small parts needed      │
 * │                                                                             │
 * │  Best practices:                                                            │
 * │  1. Null out large objects after extracting needed values                   │
 * │  2. Always remove event listeners and clear timers when done                │
 * │  3. Extract only the data you need instead of closing over entire objects   │
 * │  4. Use weak references (WeakMap, WeakSet) when appropriate                 │
 * │                                                                             │
 * │  Modern JS engines do optimize away some unused closure variables,          │
 * │  but don't rely on this - explicitly clean up for safety."                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/02-closures/08-closure-memory.js
 */
