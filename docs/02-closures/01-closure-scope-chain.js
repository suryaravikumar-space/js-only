/**
 * CHALLENGE 01: Closure Scope Chain
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

var global = 'G';

function outer() {
  var outerVar = 'O';

  function middle() {
    var middleVar = 'M';

    function inner() {
      var innerVar = 'I';
      return global + outerVar + middleVar + innerVar;
    }

    return inner;
  }

  return middle;
}

var getMiddle = outer();
var getInner = getMiddle();

console.log('A:', getInner());

var outerVar = 'GLOBAL-O';
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
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Closures don't just capture the immediate parent scope - they capture      │
 * │  the entire scope chain. In this example, inner() has access to variables   │
 * │  from middle's scope, outer's scope, and the global scope.                  │
 * │                                                                             │
 * │  The key insight is that JavaScript uses lexical scoping. When inner()      │
 * │  looks for outerVar, it finds the one from outer()'s scope where inner      │
 * │  was defined - not the later global variable with the same name.            │
 * │                                                                             │
 * │  This is why B also returns 'GOMI' - the global outerVar doesn't            │
 * │  shadow the closure's outerVar because the closure was already              │
 * │  'locked in' to outer()'s scope when inner was created.                     │
 * │                                                                             │
 * │  Understanding the scope chain is crucial for debugging closure             │
 * │  issues and for patterns like the revealing module pattern."                │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/02-closures/01-closure-scope-chain.js
 */
