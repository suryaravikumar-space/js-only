/**
 * TOPIC: Closure Scope Chain
 *
 * STORY: THE RUSSIAN NESTING DOLLS (Matryoshka)
 * Each doll (function) contains a smaller doll inside it. When the innermost
 * doll needs something, it checks itself first, then opens the next bigger doll,
 * then the next, all the way to the outermost doll. Each doll remembers what's
 * inside all the dolls that contain it — that's the scope chain in action.
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Closures can access variables from ALL outer scopes, not just              ║
 * ║ the immediate parent. They traverse the entire scope chain.                ║
 * ║                                                                            ║
 * ║   global                                                                   ║
 * ║     └── outer                                                              ║
 * ║           └── middle                                                       ║
 * ║                 └── inner → can access ALL parent scopes!                  ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

var global = 'G'; // var used intentionally for global `this` demo

function outer() {
  const outerVar = 'O'; // ES6: const

  function middle() {
    const middleVar = 'M'; // ES6: const

    function inner() {
      const innerVar = 'I'; // ES6: const
      return global + outerVar + middleVar + innerVar;
    }

    return inner;
  }

  return middle;
}

const getMiddle = outer(); // ES6: const
const getInner = getMiddle(); // ES6: const

console.log('A:', getInner());

var outerVar = 'GLOBAL-O'; // var intentional — demonstrates shadowing doesn't affect closure
console.log('B:', getInner());

/**
 * OUTPUT:
 *   A: GOMI
 *   B: GOMI
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ SETUP:                                                                     ║
 * ║   1. var global = 'G' in global scope                                      ║
 * ║   2. outer() creates outerVar = 'O', returns middle                        ║
 * ║   3. getMiddle = middle (has closure over outer's scope)                   ║
 * ║   4. getMiddle() creates middleVar = 'M', returns inner                    ║
 * ║   5. getInner = inner (has closure over ALL parent scopes)                 ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ A: getInner()                                                              ║
 * ║ ─────────────                                                              ║
 * ║   • inner executes: return global + outerVar + middleVar + innerVar        ║
 * ║   • Looks up each variable in scope chain:                                 ║
 * ║                                                                            ║
 * ║     innerVar: found in inner's local scope → 'I'                           ║
 * ║     middleVar: found in middle's scope (closure) → 'M'                     ║
 * ║     outerVar: found in outer's scope (closure) → 'O'                       ║
 * ║     global: found in global scope → 'G'                                    ║
 * ║                                                                            ║
 * ║   • Result: 'G' + 'O' + 'M' + 'I' = 'GOMI'                                 ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ B: getInner() (after var outerVar = 'GLOBAL-O')                            ║
 * ║ ───────────────────────────────────────────────                            ║
 * ║   • A new global variable 'outerVar' was created                           ║
 * ║   • BUT inner's closure captures the ORIGINAL outerVar from outer()        ║
 * ║   • Lexical scope = where function was WRITTEN, not where it's called      ║
 * ║   • inner still uses outer's outerVar = 'O'                                ║
 * ║   • Result: 'GOMI' (unchanged!)                                            ║
 * ║                                                                            ║
 * ║   KEY INSIGHT:                                                             ║
 * ║   The closure captured outer's outerVar when inner was DEFINED.            ║
 * ║   A later global variable with the same name doesn't affect it.            ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: The Scope Chain                                                     │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   When inner() looks for a variable, it searches:                           │
 * │                                                                             │
 * │   ┌─────────────────────────────────────────────────────────┐               │
 * │   │ 1. inner's local scope                                  │               │
 * │   │    └── innerVar = 'I' ✓                                 │               │
 * │   └─────────────────────────────────────────────────────────┘               │
 * │                              ↑ not found? check parent                      │
 * │   ┌─────────────────────────────────────────────────────────┐               │
 * │   │ 2. middle's scope (closure)                             │               │
 * │   │    └── middleVar = 'M' ✓                                │               │
 * │   └─────────────────────────────────────────────────────────┘               │
 * │                              ↑ not found? check parent                      │
 * │   ┌─────────────────────────────────────────────────────────┐               │
 * │   │ 3. outer's scope (closure)                              │               │
 * │   │    └── outerVar = 'O' ✓  ← THIS is what inner sees      │               │
 * │   └─────────────────────────────────────────────────────────┘               │
 * │                              ↑ not found? check parent                      │
 * │   ┌─────────────────────────────────────────────────────────┐               │
 * │   │ 4. global scope                                         │               │
 * │   │    ├── global = 'G' ✓                                   │               │
 * │   │    └── outerVar = 'GLOBAL-O'  ← NOT reached!            │               │
 * │   └─────────────────────────────────────────────────────────┘               │
 * │                              ↑ not found? ReferenceError                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ LEXICAL SCOPE vs DYNAMIC SCOPE                                              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ JavaScript uses LEXICAL (static) scope:                                     │
 * │   - Scope is determined by WHERE the function is WRITTEN                    │
 * │   - NOT where it's called from                                              │
 * │                                                                             │
 * │ EXAMPLE:                                                                    │
 * │                                                                             │
 * │   var x = 'global';                                                         │
 * │                                                                             │
 * │   function inner() {                                                        │
 * │     return x;  // Lexical: looks where inner is DEFINED                     │
 * │   }                                                                         │
 * │                                                                             │
 * │   function outer() {                                                        │
 * │     var x = 'outer';                                                        │
 * │     return inner();  // Does NOT affect which x inner sees!                 │
 * │   }                                                                         │
 * │                                                                             │
 * │   outer();  // Returns 'global', not 'outer'!                               │
 * │                                                                             │
 * │ If JS used dynamic scope (like Bash), inner() would see outer's x.          │
 * │ But JS is lexical, so inner() sees global x from where it was defined.      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * INTERVIEW QUESTIONS:
 *
 * Q: "Can a closure access variables from multiple outer scopes?"
 * A: Yes. Closures capture the entire scope chain, not just the immediate parent.
 *    In nested functions like outer → middle → inner, the innermost function has
 *    access to variables from all enclosing scopes plus the global scope.
 *
 * Q: "If I create a global variable with the same name as a closure variable, which wins?"
 * A: The closure variable wins. JavaScript uses lexical (static) scoping — scope is
 *    determined by WHERE the function is written, not where it's called. The closure
 *    was already "locked in" to outer's outerVar when inner was created, so a later
 *    global outerVar doesn't affect it.
 *
 * Q: "What's the difference between lexical scope and dynamic scope?"
 * A: Lexical scope (JavaScript): variables are resolved based on where the function
 *    is defined in the source code. Dynamic scope (Bash, some Lisps): variables are
 *    resolved based on the call stack at runtime. JS always uses lexical scope.
 *
 *
 * RUN: node docs/javascript/02-closures/01-closure-scope-chain.js
 */
