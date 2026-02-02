// ============================================
// TOPIC 2: Scope - Block vs Function Scope
// ============================================

console.log("=== PART 1: The var Problem ===");

// ❌ WRONG: var leaks out of blocks
if (true) {
  var leakedVar = "I escaped!";
}
console.log("leakedVar:", leakedVar); // ✅ Works (but shouldn't!)

// ✅ CORRECT: let stays in block
if (true) {
  let safeVar = "I'm trapped";
}
// console.log("safeVar:", safeVar); // ❌ ReferenceError!

console.log("\n=== PART 2: Loop Scope - The Classic Bug ===");

// ❌ WRONG: var in loop
console.log("var in setTimeout:");
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log("var i:", i), 100);
}
// Output after 100ms: 3, 3, 3 😱

// ✅ CORRECT: let in loop
console.log("\nlet in setTimeout:");
setTimeout(() => {
  for (let j = 0; j < 3; j++) {
    setTimeout(() => console.log("let j:", j), 200);
  }
}, 150);
// Output after 200ms: 0, 1, 2 ✅

console.log("\n=== PART 3: Why Does This Happen? ===");

/*
  VAR - Only ONE variable shared by all iterations:

  for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 0);
  }

  Memory:
  ┌─────┐
  │ i:3 │ ← All 3 callbacks point to THIS variable
  └─────┘
     ↑ ↑ ↑
     │ │ │
   cb1 cb2 cb3

  LET - Creates NEW variable for EACH iteration:

  for (let i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 0);
  }

  Memory:
  ┌─────┐  ┌─────┐  ┌─────┐
  │ i:0 │  │ i:1 │  │ i:2 │ ← Each callback has its OWN i
  └─────┘  └─────┘  └─────┘
     ↑        ↑        ↑
    cb1      cb2      cb3
*/

console.log("\n=== PART 4: Function Scope vs Block Scope ===");

function scopeDemo() {
  // var is function-scoped
  if (true) {
    var funcScoped = "visible everywhere";
  }
  console.log("funcScoped:", funcScoped); // ✅ Works

  // let/const are block-scoped
  if (true) {
    let blockScoped = "only here";
    const alsoBlockScoped = "me too";
  }
  // console.log(blockScoped); // ❌ ReferenceError
}

scopeDemo();

console.log("\n=== PART 5: Real-World Bug Example ===");

// ❌ PRODUCTION BUG with var
function setupClickHandlers_WRONG() {
  var handlers = [];
  for (var i = 0; i < 3; i++) {
    handlers.push(function() {
      console.log("Clicked button", i);
    });
  }
  return handlers;
}

const wrongHandlers = setupClickHandlers_WRONG();
console.log("\nWrong handlers:");
wrongHandlers[0](); // 3 (expected 0!)
wrongHandlers[1](); // 3 (expected 1!)
wrongHandlers[2](); // 3 (expected 2!)

// ✅ FIXED with let
function setupClickHandlers_CORRECT() {
  var handlers = [];
  for (let i = 0; i < 3; i++) {
    handlers.push(function() {
      console.log("Clicked button", i);
    });
  }
  return handlers;
}

const correctHandlers = setupClickHandlers_CORRECT();
console.log("\nCorrect handlers:");
correctHandlers[0](); // 0 ✅
correctHandlers[1](); // 1 ✅
correctHandlers[2](); // 2 ✅

console.log("\n=== PART 6: Nested Block Scopes ===");

{
  let outer = "outer";
  console.log("outer:", outer);

  {
    let inner = "inner";
    console.log("outer inside inner:", outer); // ✅ Can access outer
    console.log("inner:", inner);

    {
      let deepest = "deepest";
      console.log("Can access outer:", outer); // ✅
      console.log("Can access inner:", inner); // ✅
      console.log("deepest:", deepest);
    }

    // console.log(deepest); // ❌ ReferenceError
  }

  // console.log(inner); // ❌ ReferenceError
}

console.log("\n=== PART 7: Shadowing ===");

let x = "global";

function shadowDemo() {
  let x = "function"; // Shadows global x
  console.log("In function:", x); // "function"

  if (true) {
    let x = "block"; // Shadows function x
    console.log("In block:", x); // "block"
  }

  console.log("After block:", x); // "function"
}

shadowDemo();
console.log("Global:", x); // "global"

console.log("\n=== PART 8: Temporal Dead Zone (TDZ) ===");

function tdzDemo() {
  // console.log(myVar); // ✅ undefined (hoisted)
  // console.log(myLet); // ❌ ReferenceError (TDZ!)

  var myVar = "var";
  let myLet = "let";

  console.log("myVar:", myVar);
  console.log("myLet:", myLet);
}

tdzDemo();

/*
  TDZ Explanation:

  var myVar;           ← Hoisted to top, initialized to undefined
  console.log(myVar);  ← undefined (no error)
  myVar = "var";

  // let is different:
  console.log(myLet);  ← TDZ! Variable exists but not initialized
  let myLet = "let";   ← Now initialized
*/

console.log("\n=== PART 9: Switch Statement Scope Trap ===");

// ❌ WRONG: All cases share same scope!
const value = 1;
switch(value) {
  case 1:
    let message = "one";
    console.log(message);
    break;
  case 2:
    // let message = "two"; // ❌ SyntaxError: already declared!
    break;
}

// ✅ CORRECT: Use blocks
const value2 = 1;
switch(value2) {
  case 1: {
    let message = "one";
    console.log(message);
    break;
  }
  case 2: {
    let message = "two"; // ✅ Different scope
    console.log(message);
    break;
  }
}

console.log("\n=== PART 10: Interview Questions ===");

// Q1: What will this print?
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log("Q1:", i), 0);
}
// Answer: 3, 3, 3 (all share same i)

// Q2: What will this print?
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log("Q2:", i), 10);
}
// Answer: 0, 1, 2 (each has own i)

// Q3: What's the output?
setTimeout(() => {
  var a = 10;
  if (true) {
    var a = 20; // Same variable!
  }
  console.log("Q3:", a); // 20
}, 20);

// Q4: What's the output?
setTimeout(() => {
  let b = 10;
  if (true) {
    let b = 20; // Different variable!
  }
  console.log("Q4:", b); // 10
}, 30);

console.log("\n=== SUMMARY ===");
/*
┌──────────────────────────────────────────────────────────────┐
│  VAR (Function Scope):                                       │
│  • Scoped to nearest function                                │
│  • Leaks out of if, for, while, switch blocks               │
│  • Hoisted and initialized to undefined                     │
│  • Can be redeclared                                         │
│  • All loop iterations share same variable                  │
│                                                              │
│  LET/CONST (Block Scope):                                    │
│  • Scoped to nearest { } block                              │
│  • Stays inside if, for, while, switch blocks               │
│  • Hoisted but NOT initialized (TDZ)                        │
│  • Cannot be redeclared in same scope                       │
│  • Each loop iteration gets new variable                    │
│                                                              │
│  Real-World Impact:                                          │
│  • 99% of scope bugs come from var                          │
│  • ESLint rule: no-var                                      │
│  • Modern code: 100% let/const                              │
└──────────────────────────────────────────────────────────────┘
*/

// 📌 GOLDEN RULES:
// 1. "var = function jail, let/const = block jail"
// 2. "var shares, let creates new for each loop iteration"
// 3. "When in doubt, use const. Need to change? Use let. Never var."
