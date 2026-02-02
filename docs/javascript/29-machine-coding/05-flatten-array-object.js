/**
 * MACHINE CODING 05: Flatten Array & Object
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ flattenArray  — recursively spread nested arrays up to given depth       ║
 * ║ flattenObject — recursively join nested keys with dot notation           ║
 * ║                                                                          ║
 * ║ Both use RECURSION with a depth/prefix accumulator.                      ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 * ┌────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                         │
 * ├────────────────────────────────────────────────────────────────────────────┤
 * │ Think of Russian nesting dolls (Matryoshka). Flatten = open every doll    │
 * │ and lay all pieces on one table. Depth controls how many layers you open. │
 * │ For objects, each doll's name is glued to the inner doll with a dot.      │
 * └────────────────────────────────────────────────────────────────────────────┘
 *
 * ┌────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM                                                            │
 * ├────────────────────────────────────────────────────────────────────────────┤
 * │                                                                           │
 * │  flattenArray([1,[2,[3,[4]]]], 2)                                         │
 * │  depth=2 ─► open 2 layers                                                │
 * │  [1, [2, [3, [4]]]]                                                      │
 * │   ↓ depth 1: [1, 2, [3, [4]]]                                            │
 * │   ↓ depth 2: [1, 2, 3, [4]]        ← stops here, [4] stays              │
 * │                                                                           │
 * │  flattenObject({ a: { b: { c: 1 } } })                                   │
 * │  {} ──► { "a.b.c": 1 }                                                   │
 * │                                                                           │
 * └────────────────────────────────────────────────────────────────────────────┘
 *
 * PROBLEM:
 *   1. Implement flattenArray(arr, depth) — default depth = Infinity
 *   2. Implement flattenObject(obj, prefix) — returns dot-notation keys
 *
 * RUN: node docs/javascript/29-machine-coding/05-flatten-array-object.js
 */

// ─────────────────────────────────────────────
// PART 1: flattenArray
// ─────────────────────────────────────────────

function flattenArray(arr, depth = Infinity) {
  if (depth < 1) return arr.slice();

  var result = [];
  for (var i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      var inner = flattenArray(arr[i], depth - 1);
      for (var j = 0; j < inner.length; j++) {
        result.push(inner[j]);
      }
    } else {
      result.push(arr[i]);
    }
  }
  return result;
}

// ─────────────────────────────────────────────
// PART 2: flattenObject
// ─────────────────────────────────────────────

function flattenObject(obj, prefix, result) {
  result = result || {};
  prefix = prefix || '';

  for (var key in obj) {
    if (!obj.hasOwnProperty(key)) continue;
    var fullKey = prefix ? prefix + '.' + key : key;

    if (
      typeof obj[key] === 'object' &&
      obj[key] !== null &&
      !Array.isArray(obj[key])
    ) {
      flattenObject(obj[key], fullKey, result);
    } else {
      result[fullKey] = obj[key];
    }
  }
  return result;
}

// ─────────────────────────────────────────────
// TEST CASES — flattenArray
// ─────────────────────────────────────────────

console.log('=== flattenArray Tests ===');

console.log('A:', JSON.stringify(flattenArray([1, [2, [3, [4]]]], 1)));
// [1,2,[3,[4]]]

console.log('B:', JSON.stringify(flattenArray([1, [2, [3, [4]]]], 2)));
// [1,2,3,[4]]

console.log('C:', JSON.stringify(flattenArray([1, [2, [3, [4]]]])));
// [1,2,3,4]  (Infinity depth)

console.log('D:', JSON.stringify(flattenArray([1, [], [2, []], [3]])));
// [1,2,3]

console.log('E:', JSON.stringify(flattenArray([[[[[[7]]]]]])));
// [7]

console.log('F:', JSON.stringify(flattenArray([1, [2, 3], [4, [5, [6]]]], 0)));
// [1,[2,3],[4,[5,[6]]]]  (depth 0 = no change)

console.log('G:', JSON.stringify(flattenArray([])));
// []

// ─────────────────────────────────────────────
// TEST CASES — flattenObject
// ─────────────────────────────────────────────

console.log('\n=== flattenObject Tests ===');

console.log('H:', JSON.stringify(flattenObject({ a: 1, b: 2 })));
// {"a":1,"b":2}

console.log('I:', JSON.stringify(flattenObject({ a: { b: { c: 1 } } })));
// {"a.b.c":1}

console.log('J:', JSON.stringify(flattenObject({
  name: 'Surya',
  address: { city: 'Delhi', pin: { code: 110001 } },
  tags: [1, 2, 3]
})));
// {"name":"Surya","address.city":"Delhi","address.pin.code":110001,"tags":[1,2,3]}

console.log('K:', JSON.stringify(flattenObject({
  a: { b: 1, c: { d: 2, e: { f: 3 } } },
  g: 4
})));
// {"a.b":1,"a.c.d":2,"a.c.e.f":3,"g":4}

console.log('L:', JSON.stringify(flattenObject({})));
// {}

console.log('M:', JSON.stringify(flattenObject({ x: null, y: { z: undefined } })));
// {"x":null,"y.z":undefined}  — note: undefined omitted in JSON.stringify

// ─────────────────────────────────────────────
// EDGE CASE: unflattenObject (bonus)
// ─────────────────────────────────────────────

function unflattenObject(obj) {
  var result = {};
  for (var key in obj) {
    var parts = key.split('.');
    var current = result;
    for (var i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) current[parts[i]] = {};
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = obj[key];
  }
  return result;
}

console.log('\n=== Bonus: unflattenObject ===');
console.log('N:', JSON.stringify(unflattenObject({ 'a.b.c': 1, 'a.b.d': 2, 'e': 3 })));
// {"a":{"b":{"c":1,"d":2}},"e":3}

/**
 * FOLLOW-UP QUESTIONS:
 *
 * 1. How does Array.prototype.flat(depth) differ from your implementation?
 * 2. How would you handle circular references in flattenObject?
 * 3. What is the time complexity of flattenArray with depth = Infinity?
 *    - O(n) where n = total number of elements across all nesting levels.
 * 4. How would you flatten an object that has arrays of objects inside?
 * 5. Can you implement flattenArray iteratively using a stack?
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ INTERVIEW ANSWER                                                         ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ flattenArray: Recurse into sub-arrays, decrementing depth each level.    ║
 * ║ When depth hits 0, stop recursing and keep the sub-array as-is.          ║
 * ║ Time: O(n), Space: O(n) for the result array.                           ║
 * ║                                                                          ║
 * ║ flattenObject: Recurse into nested objects, accumulating the key path    ║
 * ║ as a dot-separated prefix string. Non-object values get written to the   ║
 * ║ result with the full dotted key.                                         ║
 * ║ Time: O(k) where k = total number of leaf keys.                         ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */
