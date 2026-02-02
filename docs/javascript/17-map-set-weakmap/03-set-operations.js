/**
 * MAP, SET, WEAKMAP, WEAKSET: 03 - Set Operations
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Set operations (union, intersection, difference) are fundamental for       ║
 * ║ comparing and combining collections of unique items.                       ║
 * ║                                                                            ║
 * ║   Union:        All items from both sets                                   ║
 * ║   Intersection: Items in BOTH sets                                         ║
 * ║   Difference:   Items in first but NOT in second                           ║
 * ║   Symmetric:    Items in ONE set but not BOTH                              ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ REAL WORLD USE CASES                                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. Union: Combine all tags from multiple posts                              │
 * │ 2. Intersection: Find mutual friends between users                          │
 * │ 3. Difference: Find items to add/remove when syncing                        │
 * │ 4. Symmetric: Find items that differ between two lists                      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL: Set Operations
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ SET OPERATIONS VISUAL                                                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Set A = {1, 2, 3, 4}        Set B = {3, 4, 5, 6}                          │
 * │                                                                             │
 * │   ┌───────────────────────────────────────────────────────────┐             │
 * │   │                                                           │             │
 * │   │      ┌─────────┐           ┌─────────┐                    │             │
 * │   │      │  1  2   │     ┌─────┤  5  6   │                    │             │
 * │   │      │         ├─────┤ 3 4 │         │                    │             │
 * │   │      │    A    │     │     │    B    │                    │             │
 * │   │      └─────────┘     └─────┴─────────┘                    │             │
 * │   │                                                           │             │
 * │   └───────────────────────────────────────────────────────────┘             │
 * │                                                                             │
 * │   Union (A ∪ B):        {1, 2, 3, 4, 5, 6}  // All elements                 │
 * │   Intersection (A ∩ B): {3, 4}             // Elements in both             │
 * │   Difference (A - B):   {1, 2}             // In A but not B               │
 * │   Difference (B - A):   {5, 6}             // In B but not A               │
 * │   Symmetric (A △ B):    {1, 2, 5, 6}       // In one but not both          │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// SET OPERATION IMPLEMENTATIONS
// ═══════════════════════════════════════════════════════════════════════════════

// Union: All elements from both sets
function union(setA, setB) {
  return new Set([...setA, ...setB]);
}

// Intersection: Elements in both sets
function intersection(setA, setB) {
  return new Set([...setA].filter(x => setB.has(x)));
}

// Difference: Elements in A but not in B
function difference(setA, setB) {
  return new Set([...setA].filter(x => !setB.has(x)));
}

// Symmetric Difference: Elements in one set but not both
function symmetricDifference(setA, setB) {
  const diff = new Set(setA);
  for (const elem of setB) {
    if (diff.has(elem)) {
      diff.delete(elem);
    } else {
      diff.add(elem);
    }
  }
  return diff;
}

// Is Subset: All elements of A are in B
function isSubset(setA, setB) {
  return [...setA].every(x => setB.has(x));
}

// Is Superset: A contains all elements of B
function isSuperset(setA, setB) {
  return isSubset(setB, setA);
}

// Are Disjoint: No common elements
function areDisjoint(setA, setB) {
  return intersection(setA, setB).size === 0;
}


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLES
// ═══════════════════════════════════════════════════════════════════════════════

const setA = new Set([1, 2, 3, 4]);
const setB = new Set([3, 4, 5, 6]);

console.log('A: Set A:', [...setA]);
console.log('B: Set B:', [...setB]);
console.log('');

console.log('C: Union (A ∪ B):', [...union(setA, setB)]);
// [1, 2, 3, 4, 5, 6]

console.log('D: Intersection (A ∩ B):', [...intersection(setA, setB)]);
// [3, 4]

console.log('E: Difference (A - B):', [...difference(setA, setB)]);
// [1, 2]

console.log('F: Difference (B - A):', [...difference(setB, setA)]);
// [5, 6]

console.log('G: Symmetric Difference:', [...symmetricDifference(setA, setB)]);
// [1, 2, 5, 6]


// ═══════════════════════════════════════════════════════════════════════════════
// SUBSET, SUPERSET, DISJOINT
// ═══════════════════════════════════════════════════════════════════════════════

const small = new Set([1, 2]);
const large = new Set([1, 2, 3, 4, 5]);
const other = new Set([6, 7, 8]);

console.log('\nH: isSubset(small, large):', isSubset(small, large));   // true
console.log('I: isSubset(large, small):', isSubset(large, small));   // false
console.log('J: isSuperset(large, small):', isSuperset(large, small)); // true
console.log('K: areDisjoint(small, other):', areDisjoint(small, other)); // true
console.log('L: areDisjoint(small, large):', areDisjoint(small, large)); // false


// ═══════════════════════════════════════════════════════════════════════════════
// ES2025+ SET METHODS (Native - where supported)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ NEW SET METHODS (ES2025 / Stage 3)                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ These methods are now available in modern browsers and Node.js:             │
 * │                                                                             │
 * │ setA.union(setB)                 → New set with all elements                │
 * │ setA.intersection(setB)         → New set with common elements              │
 * │ setA.difference(setB)           → New set with A's unique elements          │
 * │ setA.symmetricDifference(setB)  → New set with unique to either             │
 * │ setA.isSubsetOf(setB)           → Boolean                                   │
 * │ setA.isSupersetOf(setB)         → Boolean                                   │
 * │ setA.isDisjointFrom(setB)       → Boolean                                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Check if native methods are available
if (typeof Set.prototype.union === 'function') {
  console.log('\nM: Native Set methods available!');
  const a = new Set([1, 2, 3]);
  const b = new Set([3, 4, 5]);
  console.log('N: a.union(b):', [...a.union(b)]);
  console.log('O: a.intersection(b):', [...a.intersection(b)]);
} else {
  console.log('\nM: Native Set methods not available - use polyfills above');
}


// ═══════════════════════════════════════════════════════════════════════════════
// REAL WORLD: Mutual Friends
// ═══════════════════════════════════════════════════════════════════════════════

const aliceFriends = new Set(['Bob', 'Charlie', 'David', 'Eve']);
const bobFriends = new Set(['Alice', 'Charlie', 'Frank', 'Grace']);

// Mutual friends
const mutualFriends = intersection(aliceFriends, bobFriends);
console.log('\nP: Mutual friends:', [...mutualFriends]);
// ['Charlie']

// People only Alice knows (friend recommendations for Bob)
const onlyAliceKnows = difference(aliceFriends, bobFriends);
console.log('Q: Only Alice knows:', [...onlyAliceKnows]);
// ['Bob', 'David', 'Eve']


// ═══════════════════════════════════════════════════════════════════════════════
// REAL WORLD: Syncing Data
// ═══════════════════════════════════════════════════════════════════════════════

const localTags = new Set(['javascript', 'python', 'rust']);
const serverTags = new Set(['javascript', 'go', 'rust', 'kotlin']);

// Tags to add locally (on server but not local)
const tagsToAdd = difference(serverTags, localTags);
console.log('\nR: Tags to download:', [...tagsToAdd]);
// ['go', 'kotlin']

// Tags to upload (local but not on server)
const tagsToUpload = difference(localTags, serverTags);
console.log('S: Tags to upload:', [...tagsToUpload]);
// ['python']

// Tags that are in sync
const syncedTags = intersection(localTags, serverTags);
console.log('T: Synced tags:', [...syncedTags]);
// ['javascript', 'rust']


// ═══════════════════════════════════════════════════════════════════════════════
// REAL WORLD: Permission System
// ═══════════════════════════════════════════════════════════════════════════════

const adminPermissions = new Set(['read', 'write', 'delete', 'admin']);
const userPermissions = new Set(['read', 'write']);

// Check if user has all required permissions
const requiredPermissions = new Set(['read', 'write']);
const hasAllPermissions = isSubset(requiredPermissions, userPermissions);
console.log('\nU: User has required permissions:', hasAllPermissions);
// true

// What permissions is user missing for admin?
const missingForAdmin = difference(adminPermissions, userPermissions);
console.log('V: Missing for admin:', [...missingForAdmin]);
// ['delete', 'admin']


// ═══════════════════════════════════════════════════════════════════════════════
// REAL WORLD: Feature Flags
// ═══════════════════════════════════════════════════════════════════════════════

const enabledFeatures = new Set(['darkMode', 'notifications', 'export']);
const betaFeatures = new Set(['aiAssistant', 'export', 'voiceControl']);

// All available features
const allFeatures = union(enabledFeatures, betaFeatures);
console.log('\nW: All features:', [...allFeatures]);

// Features in both stable and beta (may need coordination)
const overlappingFeatures = intersection(enabledFeatures, betaFeatures);
console.log('X: Overlapping:', [...overlappingFeatures]);

// Beta-only features
const betaOnly = difference(betaFeatures, enabledFeatures);
console.log('Y: Beta-only:', [...betaOnly]);


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Set operations are used to compare and combine collections:                │
 * │                                                                             │
 * │ Union: All elements from both sets                                          │
 * │   new Set([...setA, ...setB])                                               │
 * │                                                                             │
 * │ Intersection: Elements in both sets                                         │
 * │   new Set([...setA].filter(x => setB.has(x)))                               │
 * │                                                                             │
 * │ Difference: Elements in A but not B                                         │
 * │   new Set([...setA].filter(x => !setB.has(x)))                              │
 * │                                                                             │
 * │ Symmetric Difference: Elements in one set but not both                      │
 * │                                                                             │
 * │ Real-world uses:                                                            │
 * │ • Find mutual friends (intersection)                                        │
 * │ • Sync data - find what to add/remove (difference)                          │
 * │ • Combine tags from multiple sources (union)                                │
 * │ • Check permissions subset (isSubset)                                       │
 * │                                                                             │
 * │ ES2025 adds native methods: .union(), .intersection(), .difference(), etc.  │
 * │ Until then, use array methods with Set for O(n) operations."                │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/17-map-set-weakmap/03-set-operations.js
 */
