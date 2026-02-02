/**
 * MAP, SET, WEAKMAP, WEAKSET: 07 - Common Patterns
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ COMMON CODING PATTERNS WITH MAP, SET, WEAKMAP                              ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ These patterns come up frequently in interviews and real code.             ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// PATTERN 1: GROUP BY
// ═══════════════════════════════════════════════════════════════════════════════

function groupBy(items, keyFn) {
  const groups = new Map();

  for (const item of items) {
    const key = keyFn(item);
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(item);
  }

  return groups;
}

const people = [
  { name: 'Alice', age: 25, city: 'NYC' },
  { name: 'Bob', age: 30, city: 'LA' },
  { name: 'Charlie', age: 25, city: 'NYC' },
  { name: 'Diana', age: 30, city: 'NYC' }
];

console.log('A: Group by age:');
const byAge = groupBy(people, p => p.age);
for (const [age, group] of byAge) {
  console.log(`  ${age}: ${group.map(p => p.name).join(', ')}`);
}

console.log('\nB: Group by city:');
const byCity = groupBy(people, p => p.city);
for (const [city, group] of byCity) {
  console.log(`  ${city}: ${group.map(p => p.name).join(', ')}`);
}


// ═══════════════════════════════════════════════════════════════════════════════
// PATTERN 2: TWO SUM (Interview Classic!)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHY MAP FOR TWO SUM                                                         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Store seen numbers with their indices for O(1) lookup.                      │
 * │ For each number, check if (target - number) exists.                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

function twoSum(nums, target) {
  const seen = new Map();  // value -> index

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }

    seen.set(nums[i], i);
  }

  return null;
}

console.log('\nC: Two Sum [2,7,11,15] target=9:', twoSum([2, 7, 11, 15], 9));
// [0, 1] because nums[0] + nums[1] = 2 + 7 = 9


// ═══════════════════════════════════════════════════════════════════════════════
// PATTERN 3: FIND DUPLICATES
// ═══════════════════════════════════════════════════════════════════════════════

function findDuplicates(arr) {
  const seen = new Set();
  const duplicates = new Set();

  for (const item of arr) {
    if (seen.has(item)) {
      duplicates.add(item);
    } else {
      seen.add(item);
    }
  }

  return [...duplicates];
}

console.log('\nD: Find duplicates:', findDuplicates([1, 2, 3, 2, 4, 3, 5, 6, 3]));
// [2, 3]


// ═══════════════════════════════════════════════════════════════════════════════
// PATTERN 4: FIRST UNIQUE CHARACTER
// ═══════════════════════════════════════════════════════════════════════════════

function firstUnique(str) {
  const counts = new Map();

  // Count occurrences
  for (const char of str) {
    counts.set(char, (counts.get(char) || 0) + 1);
  }

  // Find first with count 1
  for (const char of str) {
    if (counts.get(char) === 1) {
      return char;
    }
  }

  return null;
}

console.log('\nE: First unique in "leetcode":', firstUnique('leetcode'));  // 'l'
console.log('F: First unique in "aabb":', firstUnique('aabb'));  // null


// ═══════════════════════════════════════════════════════════════════════════════
// PATTERN 5: ANAGRAM CHECK
// ═══════════════════════════════════════════════════════════════════════════════

function isAnagram(s1, s2) {
  if (s1.length !== s2.length) return false;

  const counts = new Map();

  // Count characters in s1
  for (const char of s1) {
    counts.set(char, (counts.get(char) || 0) + 1);
  }

  // Subtract characters in s2
  for (const char of s2) {
    if (!counts.has(char)) return false;
    const newCount = counts.get(char) - 1;
    if (newCount === 0) {
      counts.delete(char);
    } else {
      counts.set(char, newCount);
    }
  }

  return counts.size === 0;
}

console.log('\nG: isAnagram("listen", "silent"):', isAnagram('listen', 'silent'));  // true
console.log('H: isAnagram("hello", "world"):', isAnagram('hello', 'world'));  // false


// ═══════════════════════════════════════════════════════════════════════════════
// PATTERN 6: ARRAY INTERSECTION
// ═══════════════════════════════════════════════════════════════════════════════

function arrayIntersection(arr1, arr2) {
  const set1 = new Set(arr1);
  return arr2.filter(x => set1.has(x));
}

// With duplicates counted
function arrayIntersectionWithDupes(arr1, arr2) {
  const counts = new Map();
  for (const num of arr1) {
    counts.set(num, (counts.get(num) || 0) + 1);
  }

  const result = [];
  for (const num of arr2) {
    if (counts.get(num) > 0) {
      result.push(num);
      counts.set(num, counts.get(num) - 1);
    }
  }
  return result;
}

console.log('\nI: Intersection:', arrayIntersection([1, 2, 2, 1], [2, 2]));
console.log('J: With dupes:', arrayIntersectionWithDupes([1, 2, 2, 1], [2, 2]));


// ═══════════════════════════════════════════════════════════════════════════════
// PATTERN 7: INDEX BY PROPERTY
// ═══════════════════════════════════════════════════════════════════════════════

function indexBy(items, keyFn) {
  const index = new Map();
  for (const item of items) {
    index.set(keyFn(item), item);
  }
  return index;
}

const products = [
  { id: 'p1', name: 'Laptop', price: 999 },
  { id: 'p2', name: 'Phone', price: 699 },
  { id: 'p3', name: 'Tablet', price: 499 }
];

const productsById = indexBy(products, p => p.id);

console.log('\nK: Products indexed by ID:');
console.log('  p2:', productsById.get('p2'));


// ═══════════════════════════════════════════════════════════════════════════════
// PATTERN 8: DEFAULT MAP (with automatic initialization)
// ═══════════════════════════════════════════════════════════════════════════════

class DefaultMap extends Map {
  constructor(defaultFactory) {
    super();
    this.defaultFactory = defaultFactory;
  }

  get(key) {
    if (!this.has(key)) {
      this.set(key, this.defaultFactory());
    }
    return super.get(key);
  }
}

// Usage: Auto-creates arrays
const graph = new DefaultMap(() => []);
graph.get('A').push('B');
graph.get('A').push('C');
graph.get('B').push('D');

console.log('\nL: DefaultMap graph:');
console.log('  A neighbors:', graph.get('A'));
console.log('  B neighbors:', graph.get('B'));
console.log('  C neighbors:', graph.get('C'));  // Auto-created empty array


// ═══════════════════════════════════════════════════════════════════════════════
// PATTERN 9: SLIDING WINDOW WITH SET
// ═══════════════════════════════════════════════════════════════════════════════

// Longest substring without repeating characters
function lengthOfLongestSubstring(s) {
  const seen = new Set();
  let left = 0;
  let maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    while (seen.has(s[right])) {
      seen.delete(s[left]);
      left++;
    }
    seen.add(s[right]);
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}

console.log('\nM: Longest unique substring "abcabcbb":', lengthOfLongestSubstring('abcabcbb'));  // 3 ("abc")
console.log('N: Longest unique substring "bbbbb":', lengthOfLongestSubstring('bbbbb'));  // 1 ("b")


// ═══════════════════════════════════════════════════════════════════════════════
// PATTERN 10: DEEP EQUALITY CHECK WITH WEAKSET
// ═══════════════════════════════════════════════════════════════════════════════

function deepEqual(a, b, seen = new WeakSet()) {
  // Primitive comparison
  if (a === b) return true;
  if (typeof a !== 'object' || typeof b !== 'object') return false;
  if (a === null || b === null) return false;

  // Circular reference check
  if (seen.has(a) || seen.has(b)) return true;
  seen.add(a);
  seen.add(b);

  // Array comparison
  if (Array.isArray(a) !== Array.isArray(b)) return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  return keysA.every(key => deepEqual(a[key], b[key], seen));
}

console.log('\nO: Deep equal {a:{b:1}} === {a:{b:1}}:', deepEqual({ a: { b: 1 } }, { a: { b: 1 } }));
console.log('P: Deep equal {a:1} === {a:2}:', deepEqual({ a: 1 }, { a: 2 }));


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Map and Set are essential for many algorithm patterns:                     │
 * │                                                                             │
 * │ MAP PATTERNS:                                                               │
 * │ • Two Sum - Store complement with O(1) lookup                               │
 * │ • Counting/Frequency - Count occurrences of items                           │
 * │ • Group By - Organize items by key                                          │
 * │ • Index By - Fast lookup by property                                        │
 * │ • Anagram Check - Compare character counts                                  │
 * │                                                                             │
 * │ SET PATTERNS:                                                               │
 * │ • Find Duplicates - Track seen items                                        │
 * │ • Sliding Window - Track unique elements in window                          │
 * │ • Array Intersection - O(1) membership testing                              │
 * │ • Deduplication - [...new Set(arr)]                                         │
 * │                                                                             │
 * │ WEAKSET PATTERNS:                                                           │
 * │ • Deep Equality - Detect circular references                                │
 * │ • Deep Clone - Track visited objects                                        │
 * │                                                                             │
 * │ Key insight: These collections turn O(n) lookups into O(1)."                │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/17-map-set-weakmap/07-common-patterns.js
 */
