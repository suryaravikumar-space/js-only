/**
 * MAP, SET, WEAKMAP, WEAKSET: 09 - Interview Q&A Summary
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ COMPLETE INTERVIEW GUIDE FOR MAP, SET, WEAKMAP, WEAKSET                    ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ This file contains the most common interview questions with detailed       ║
 * ║ answers, plus a quick reference cheat sheet.                               ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q1: What is the difference between Map and Object?                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Map and Object are both key-value stores, but Map is more versatile:       │
 * │                                                                             │
 * │ KEY TYPES:                                                                  │
 * │ • Map: Any type (objects, functions, primitives)                            │
 * │ • Object: Only strings and symbols (others are converted)                   │
 * │                                                                             │
 * │ SIZE:                                                                       │
 * │ • Map: map.size is O(1)                                                     │
 * │ • Object: Object.keys(obj).length is O(n)                                   │
 * │                                                                             │
 * │ ITERATION:                                                                  │
 * │ • Map: Directly iterable with for...of                                      │
 * │ • Object: Need Object.entries() first                                       │
 * │                                                                             │
 * │ ORDER:                                                                      │
 * │ • Map: Always insertion order                                               │
 * │ • Object: Numeric keys sorted, others by insertion                          │
 * │                                                                             │
 * │ PROTOTYPE:                                                                  │
 * │ • Map: No inherited properties                                              │
 * │ • Object: Has prototype pollution risk                                      │
 * │                                                                             │
 * │ Use Map for dynamic keys, frequent changes, or non-string keys.             │
 * │ Use Object for static structures or when JSON serialization needed."        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q2: What is Set and when would you use it?                                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Set is a collection of unique values. Duplicates are automatically         │
 * │ ignored when added.                                                         │
 * │                                                                             │
 * │ Common use cases:                                                           │
 * │                                                                             │
 * │ 1. DEDUPLICATION: [...new Set(array)]                                       │
 * │    One-liner to remove duplicates from array                                │
 * │                                                                             │
 * │ 2. FAST LOOKUP: set.has(x) is O(1)                                          │
 * │    vs array.includes(x) which is O(n)                                       │
 * │                                                                             │
 * │ 3. SET OPERATIONS:                                                          │
 * │    Union, intersection, difference for permissions, features                │
 * │                                                                             │
 * │ 4. TRACKING: Unique visitors, processed items, seen values                  │
 * │                                                                             │
 * │ Key behavior: Uses SameValueZero for equality.                              │
 * │ Objects compared by reference, NaN equals NaN."                             │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q3: What are WeakMap and WeakSet? When would you use them?                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "WeakMap and WeakSet hold WEAK references to objects. When an object        │
 * │ has no other references, it's garbage collected and automatically           │
 * │ removed from the Weak collection.                                           │
 * │                                                                             │
 * │ KEY RESTRICTIONS:                                                           │
 * │ • Keys/values must be objects (not primitives)                              │
 * │ • NOT iterable (can't list contents)                                        │
 * │ • No .size property                                                         │
 * │                                                                             │
 * │ WEAKMAP USE CASES:                                                          │
 * │ • Private data for objects (class private fields alternative)               │
 * │ • Memoization/caching by object key                                         │
 * │ • DOM element metadata                                                      │
 * │                                                                             │
 * │ WEAKSET USE CASES:                                                          │
 * │ • Tracking seen objects (circular reference detection)                      │
 * │ • Object branding/tagging                                                   │
 * │ • Instance tracking                                                         │
 * │                                                                             │
 * │ Main benefit: Prevents memory leaks in long-running applications."          │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q4: How do you convert between Map/Set and Array/Object?                    │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "ARRAY ↔ SET:                                                               │
 * │ • Array → Set: new Set(array)                                               │
 * │ • Set → Array: [...set] or Array.from(set)                                  │
 * │                                                                             │
 * │ OBJECT ↔ MAP:                                                               │
 * │ • Object → Map: new Map(Object.entries(obj))                                │
 * │ • Map → Object: Object.fromEntries(map) (string keys only!)                 │
 * │                                                                             │
 * │ MAP ↔ ARRAY:                                                                │
 * │ • Array → Map: new Map([[key1, val1], [key2, val2]])                        │
 * │ • Map → Array: [...map] or [...map.entries()]                               │
 * │                                                                             │
 * │ Common gotcha: new Map({a: 1}) doesn't work!                                │
 * │ Objects aren't iterable in the way Map expects."                            │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q5: Explain Set operations (union, intersection, difference)                │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Three fundamental set operations:                                          │
 * │                                                                             │
 * │ UNION (A ∪ B) - All elements from both:                                     │
 * │   new Set([...A, ...B])                                                     │
 * │                                                                             │
 * │ INTERSECTION (A ∩ B) - Elements in BOTH:                                    │
 * │   new Set([...A].filter(x => B.has(x)))                                     │
 * │                                                                             │
 * │ DIFFERENCE (A - B) - Elements in A but NOT in B:                            │
 * │   new Set([...A].filter(x => !B.has(x)))                                    │
 * │                                                                             │
 * │ ES2024 adds native methods:                                                 │
 * │   A.union(B), A.intersection(B), A.difference(B)                            │
 * │                                                                             │
 * │ Real-world uses:                                                            │
 * │ • Permissions: (role1Perms ∪ role2Perms)                                    │
 * │ • New users: (todayUsers - yesterdayUsers)                                  │
 * │ • Common tags: (post1Tags ∩ post2Tags)"                                     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q6: How does equality work in Map and Set?                                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Map and Set use SameValueZero algorithm for key/value equality:            │
 * │                                                                             │
 * │ PRIMITIVES: Same as === except NaN                                          │
 * │   map.set(1, 'a'); map.get(1);    // 'a'                                    │
 * │   map.set('1', 'b'); map.get(1);  // still 'a' (different types!)           │
 * │                                                                             │
 * │ NaN: Treated as equal to itself (unlike ===)                                │
 * │   set.add(NaN); set.add(NaN);                                               │
 * │   set.size;  // 1 (not 2!)                                                  │
 * │                                                                             │
 * │ OBJECTS: Reference equality, not content                                    │
 * │   const obj1 = {a: 1};                                                      │
 * │   const obj2 = {a: 1};  // Same content                                     │
 * │   set.add(obj1); set.add(obj2);                                             │
 * │   set.size;  // 2 (different references!)                                   │
 * │                                                                             │
 * │ This is why {} !== {} even though they look the same."                      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ CHEAT SHEET: Map, Set, WeakMap, WeakSet                                    ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ MAP:                                                                       ║
 * ║   const map = new Map([['a', 1], ['b', 2]]);                               ║
 * ║   map.set(key, value)  // Add/update (chainable)                           ║
 * ║   map.get(key)         // Get value                                        ║
 * ║   map.has(key)         // Check existence                                  ║
 * ║   map.delete(key)      // Remove (returns boolean)                         ║
 * ║   map.clear()          // Remove all                                       ║
 * ║   map.size             // Count of entries                                 ║
 * ║   for (const [k, v] of map) { }  // Iterate                                ║
 * ║                                                                            ║
 * ║ SET:                                                                       ║
 * ║   const set = new Set([1, 2, 3]);                                          ║
 * ║   set.add(value)       // Add (chainable)                                  ║
 * ║   set.has(value)       // Check existence O(1)                             ║
 * ║   set.delete(value)    // Remove (returns boolean)                         ║
 * ║   set.clear()          // Remove all                                       ║
 * ║   set.size             // Count of values                                  ║
 * ║   [...new Set(arr)]    // Deduplicate array                                ║
 * ║                                                                            ║
 * ║ WEAKMAP:                                                                   ║
 * ║   const wm = new WeakMap();                                                ║
 * ║   wm.set(objKey, value)  // Object keys only!                              ║
 * ║   wm.get(objKey)                                                           ║
 * ║   wm.has(objKey)                                                           ║
 * ║   wm.delete(objKey)                                                        ║
 * ║   // No .size, no iteration, no .clear()                                   ║
 * ║                                                                            ║
 * ║ WEAKSET:                                                                   ║
 * ║   const ws = new WeakSet();                                                ║
 * ║   ws.add(obj)          // Objects only!                                    ║
 * ║   ws.has(obj)                                                              ║
 * ║   ws.delete(obj)                                                           ║
 * ║   // No .size, no iteration, no .clear()                                   ║
 * ║                                                                            ║
 * ║ CONVERSIONS:                                                               ║
 * ║   Array → Set:   new Set(array)                                            ║
 * ║   Set → Array:   [...set]                                                  ║
 * ║   Object → Map:  new Map(Object.entries(obj))                              ║
 * ║   Map → Object:  Object.fromEntries(map)                                   ║
 * ║                                                                            ║
 * ║ SET OPERATIONS:                                                            ║
 * ║   Union:        new Set([...A, ...B])                                      ║
 * ║   Intersection: [...A].filter(x => B.has(x))                               ║
 * ║   Difference:   [...A].filter(x => !B.has(x))                              ║
 * ║                                                                            ║
 * ║ WHEN TO USE:                                                               ║
 * ║   Map    → Non-string keys, dynamic keys, need .size                       ║
 * ║   Set    → Unique values, fast lookup, deduplication                       ║
 * ║   WeakMap → Private data, caching without memory leaks                     ║
 * ║   WeakSet → Object tracking, circular reference detection                  ║
 * ║   Object → Static structure, JSON needed, simple key-value                 ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * RUN: node docs/17-map-set-weakmap/09-interview-qa.js
 */


// Verify file loads
console.log('Map, Set, WeakMap, WeakSet module complete!');
console.log('Topics covered:');
console.log('  00 - Map basics');
console.log('  01 - Map vs Object');
console.log('  02 - Set basics');
console.log('  03 - Set operations');
console.log('  04 - WeakMap');
console.log('  05 - WeakSet');
console.log('  06 - Real world use cases');
console.log('  07 - Common patterns');
console.log('  08 - Tricky examples');
console.log('  09 - Interview Q&A');
console.log('\nNext: 18-recursion');
