// ============================================
// DEEP DIVE: const = Immutable BINDING, NOT Immutable Object
// ============================================

console.log("=== PART 1: Immutable Binding ===");
// ❌ WRONG: Trying to reassign const
const x = 5;
// x = 10; // ❌ TypeError: Assignment to constant variable
console.log("x:", x);

// ✅ This is what "immutable binding" means:
// The VARIABLE NAME (binding) cannot point to a different value

console.log("\n=== PART 2: const with Objects (THE TRAP!) ===");
// 🤔 Many developers think this won't work:
const person = {
  name: "John",
  age: 25
};

// ✅ THIS WORKS! (Object properties CAN be modified)
person.name = "Jane";
person.age = 30;
person.city = "NYC"; // Can add new properties!
console.log("Modified person:", person);

// ❌ But THIS FAILS:
// person = { name: "Bob" }; // ❌ TypeError!
// Why? Because you're trying to change what 'person' points to

console.log("\n=== PART 3: Visual Explanation ===");
/*
  MEMORY VISUALIZATION:

  const person = { name: "John" };

  ┌─────────┐         ┌──────────────┐
  │ person  │────────>│  { name:     │
  │ (const) │  LOCKED │    "John" }  │
  └─────────┘         └──────────────┘
       ↑                     ↑
       │                     │
    Binding              Object Data
   (IMMUTABLE)          (MUTABLE!)

  - The ARROW (binding) is locked ❌
  - The OBJECT contents can change ✅
*/

console.log("\n=== PART 4: const with Arrays ===");
const numbers = [1, 2, 3];

// ✅ All these work:
numbers.push(4);          // Add element
numbers[0] = 100;         // Modify element
numbers.pop();            // Remove element
console.log("Modified array:", numbers); // [100, 2, 3]

// ❌ This fails:
// numbers = [5, 6, 7]; // TypeError!

console.log("\n=== PART 5: FREEZE for True Immutability ===");
const config = Object.freeze({
  apiUrl: "https://api.example.com",
  timeout: 5000
});

// ❌ Silent failure in normal mode (throws in strict mode)
config.apiUrl = "https://hacker.com";
config.newKey = "value";
console.log("config after modification attempt:", config);
// Still shows original values!

console.log("\n=== PART 6: Deep Freeze Problem ===");
const settings = Object.freeze({
  api: {
    url: "https://api.example.com" // Nested object!
  }
});

// ❌ This STILL works (shallow freeze only):
settings.api.url = "https://hacked.com";
console.log("settings.api.url:", settings.api.url); // Changed! 😱

// ✅ Solution: Deep Freeze
function deepFreeze(obj) {
  Object.freeze(obj);
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      deepFreeze(obj[key]);
    }
  });
  return obj;
}

console.log("\n=== PART 7: Real-World Examples ===");

// ❌ WRONG in React/Redux
const state = {
  users: [],
  loading: false
};
// Never mutate state directly:
// state.users.push(newUser); // ❌ BAD!

// ✅ CORRECT: Create new reference
const newState = {
  ...state,
  users: [...state.users, newUser]
};

// ❌ WRONG in API calls
const API_CONFIG = {
  baseURL: "https://api.com",
  headers: { "Content-Type": "application/json" }
};
// Someone might do:
// API_CONFIG.baseURL = "https://test.com"; // ✅ This works but is dangerous!

// ✅ BETTER: Use Object.freeze
const FROZEN_API_CONFIG = Object.freeze({
  baseURL: "https://api.com",
  headers: Object.freeze({ "Content-Type": "application/json" })
});

console.log("\n=== PART 8: Interview Gotcha ===");
const arr1 = [1, 2, 3];
const arr2 = arr1; // Both point to SAME object!

arr2.push(4);
console.log("arr1:", arr1); // [1, 2, 3, 4] - Changed! 😱
console.log("arr2:", arr2); // [1, 2, 3, 4]

// Why? Because const doesn't prevent:
// 1. Modifying object/array contents
// 2. Multiple references to same object

console.log("\n=== SUMMARY ===");
/*
┌────────────────────────────────────────────────────────────┐
│  const LOCKS:                                              │
│  ✅ The variable name (binding)                           │
│                                                            │
│  const DOESN'T LOCK:                                       │
│  ❌ Object properties                                     │
│  ❌ Array elements                                        │
│  ❌ Nested objects                                        │
│                                                            │
│  For true immutability:                                    │
│  → Object.freeze() (shallow)                              │
│  → deepFreeze() (deep)                                    │
│  → Immutable.js library                                   │
│  → Immer.js (for React/Redux)                            │
└────────────────────────────────────────────────────────────┘
*/

// 📌 GOLDEN RULE:
// "const prevents REASSIGNMENT, not MUTATION"
