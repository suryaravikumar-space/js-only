// ============================================
// YOUR CODE - CORRECTED VERSION
// ============================================

console.log("=== WRONG WAY (Commented out to avoid errors) ===");
// ❌ WRONG: No keyword
// x = 5;
// console.log('x::: ', x);

// ❌ WRONG: var keyword
// var y = 10;
// console.log('y::: ', y);

console.log("\n=== CORRECT WAY ===");
// ✅ CORRECT: Use let/const
let x = 5;
console.log('x::: ', x);

const y = 10;
console.log('y::: ', y);

console.log('typeof x::: ', typeof x);
console.log('typeof y::: ', typeof y);

// ✅ You can reassign let
x = 15;
console.log('x after reassignment::: ', x);

// ❌ You CANNOT reassign const
// y = 20; // TypeError: Assignment to constant variable

console.log("\n=== But const with objects... ===");
const person = { name: "John", age: 25 };
console.log('person before:', person);

// ✅ This works! (mutation, not reassignment)
person.name = "Jane";
person.age = 30;
console.log('person after:', person);

// ❌ This fails (reassignment)
// person = { name: "Bob" }; // TypeError!
