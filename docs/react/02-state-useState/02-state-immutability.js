/**
 * TOPIC: State Immutability - Why It Matters
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ NEVER mutate state directly. Always create a NEW object/array.          ║
 * ║ React uses REFERENCE EQUALITY (===) to detect changes.                  ║
 * ║ Same reference = no re-render, even if contents changed.                ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────────────────────┐
 * │                                                                           │
 * │ State is like a SEALED ENVELOPE. To change the message, you don't        │
 * │ open the old envelope - you write a NEW letter in a NEW envelope.        │
 * │ React checks: "Is this a different envelope?" (reference check).        │
 * │                                                                           │
 * └───────────────────────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────────────────────────┐
 * │                                                                           │
 * │   MUTATION (BAD):                IMMUTABLE (GOOD):                        │
 * │   obj.name = "new"              newObj = {...obj, name: "new"}            │
 * │   obj === obj  → true           newObj === obj → false                    │
 * │   React: "same ref, skip"       React: "new ref, RE-RENDER!"            │
 * │                                                                           │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

// A: Mutation vs Immutable update
console.log('A: Reference equality check:');
const obj1 = { name: 'Surya', age: 25 };
const mutated = obj1;
mutated.name = 'Changed';
console.log('   Mutated === original:', mutated === obj1, '(React won\'t re-render!)');

const immutable = { ...obj1, name: 'New' };
console.log('   Spread  === original:', immutable === obj1, '(React WILL re-render!)');

// B: Object update patterns
console.log('\nB: Object update patterns:');
const user = { name: 'Surya', age: 25, address: { city: 'NYC', zip: '10001' } };

// Updating a top-level field
const updated1 = { ...user, age: 26 };
console.log('   Update field:', JSON.stringify(updated1));

// Updating nested field
const updated2 = { ...user, address: { ...user.address, city: 'LA' } };
console.log('   Update nested:', JSON.stringify(updated2));

// Deleting a field
const { age, ...withoutAge } = user;
console.log('   Delete field:', JSON.stringify(withoutAge));

// C: Array update patterns
console.log('\nC: Array update patterns:');
const items = [1, 2, 3, 4, 5];

console.log('   Add:    ', JSON.stringify([...items, 6]));
console.log('   Remove: ', JSON.stringify(items.filter(i => i !== 3)));
console.log('   Update: ', JSON.stringify(items.map(i => i === 3 ? 30 : i)));
console.log('   Insert: ', JSON.stringify([...items.slice(0, 2), 99, ...items.slice(2)]));

// D: Deep vs Shallow copy
console.log('\nD: Shallow vs Deep copy:');
const original = { a: 1, nested: { b: 2 } };
const shallow = { ...original };
shallow.nested.b = 999;
console.log('   Shallow copy shares nested refs:', original.nested.b, '(mutated!)');

const deep = JSON.parse(JSON.stringify({ a: 1, nested: { b: 2 } }));
deep.nested.b = 999;
const orig2 = { a: 1, nested: { b: 2 } };
console.log('   Deep copy is independent:', orig2.nested.b, '(safe)');

// E: Common mistakes
console.log('\nE: Common MISTAKES:');
const mistakes = [
  'state.push(item)        --> use [...state, item]',
  'state.splice(i, 1)      --> use state.filter(...)',
  'state[i] = newVal       --> use state.map(...)',
  'state.sort()            --> use [...state].sort()',
  'state.obj.key = val     --> use {...state, obj: {...state.obj, key: val}}',
];
mistakes.forEach(m => console.log('   ' + m));

/**
 * OUTPUT:
 *   A: Reference equality demonstrations
 *   B: Object spread patterns
 *   C: Array immutable patterns
 *   D: Shallow vs Deep copy
 *   E: Common mutation mistakes
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │ "React detects state changes via reference equality (===). Mutating       │
 * │  state directly keeps the same reference, so React skips re-rendering.    │
 * │  Always create new objects with spread: {...obj, key: val} for objects,   │
 * │  [...arr, item] for arrays. For nested state, spread each level.         │
 * │  Libraries like Immer can simplify deep immutable updates."               │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/02-state-useState/02-state-immutability.js
 */
