/**
 * TOPIC: What is an Execution Context?
 *
 * DEFINITION:
 * An Execution Context is a DATA STRUCTURE — a container (box)
 * that JavaScript creates to manage and run your code.
 *
 * It holds everything needed to execute a piece of code:
 *   - Variables
 *   - Scope references
 *   - this binding
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ WHEN IS AN EXECUTION CONTEXT CREATED?                         │
 * ├────────────────────────────────────────────────────────────────┤
 * │ 1. When script starts      → Global Execution Context (GEC)   │
 * │ 2. When function is called → Function Execution Context (FEC) │
 * └────────────────────────────────────────────────────────────────┘
 *
 * Every function call = NEW execution context created.
 *
 *
 * ╔════════════════════════════════════════════════════════════════╗
 * ║           EXECUTION CONTEXT — THE 3 COMPONENTS                ║
 * ╠════════════════════════════════════════════════════════════════╣
 * ║                                                                ║
 * ║  1. VARIABLE ENVIRONMENT                                      ║
 * ║     ─────────────────────                                     ║
 * ║     • Stores variables declared with var, let, const          ║
 * ║     • Stores function declarations                            ║
 * ║     • In creation phase: var → undefined, let/const → TDZ     ║
 * ║     • In execution phase: actual values assigned              ║
 * ║                                                                ║
 * ║  2. LEXICAL ENVIRONMENT (Scope Chain)                         ║
 * ║     ────────────────────────────────                          ║
 * ║     • Reference to outer/parent scope                         ║
 * ║     • How JS finds variables in outer scopes                  ║
 * ║     • Determined at DEFINITION time, not call time            ║
 * ║                                                                ║
 * ║  3. this BINDING                                              ║
 * ║     ────────────                                              ║
 * ║     • What "this" refers to in this context                   ║
 * ║     • Depends on HOW the function is called                   ║
 * ║     • Global EC: this = window (browser) or global (Node)     ║
 * ║                                                                ║
 * ╚════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ TWO PHASES OF EXECUTION CONTEXT                               │
 * └────────────────────────────────────────────────────────────────┘
 *
 * PHASE 1: CREATION (before any code runs)
 * ─────────────────────────────────────────
 *   • Variable Environment set up:
 *       - var variables → registered as undefined
 *       - let/const → registered but in TDZ
 *       - function declarations → fully hoisted
 *   • Scope Chain established (link to parent)
 *   • this value determined
 *
 * PHASE 2: EXECUTION (code runs line by line)
 * ────────────────────────────────────────────
 *   • Variables get actual values assigned
 *   • Code executes top to bottom
 *   • Function calls create NEW execution contexts
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ CONNECTING PREVIOUS CONCEPTS TO EXECUTION CONTEXT             │
 * └────────────────────────────────────────────────────────────────┘
 *
 * ┌───────────────────────────────┬────────────────────────────────┐
 * │ What you learned              │ Which component?               │
 * ├───────────────────────────────┼────────────────────────────────┤
 * │ var hoisting (undefined)      │ Variable Environment           │
 * │ let/const TDZ                 │ Variable Environment           │
 * │ Function hoisting             │ Variable Environment           │
 * │ Scope chain (inner→outer)     │ Lexical Environment            │
 * │ this keyword                  │ this Binding                   │
 * │ Call stack                    │ Stack of Execution Contexts    │
 * └───────────────────────────────┴────────────────────────────────┘
 *
 *
 * VISUAL MODEL — Global vs Function Execution Context:
 *
 * var name = 'global';
 *
 * function greet() {
 *   var message = 'hello';
 *   console.log(message);
 * }
 *
 * greet();
 *
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ GLOBAL EXECUTION CONTEXT                                       │
 * ├─────────────────────────────────────────────────────────────────┤
 * │ Variable Environment: { name: 'global', greet: [function] }    │
 * │ Lexical Environment:  null (no parent, this is the top)        │
 * │ this:                 window (browser) / global (Node)         │
 * └─────────────────────────────────────────────────────────────────┘
 *                              │
 *                              │ greet() called
 *                              ▼
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ FUNCTION EXECUTION CONTEXT (greet)                             │
 * ├─────────────────────────────────────────────────────────────────┤
 * │ Variable Environment: { message: 'hello' }                     │
 * │ Lexical Environment:  → points to Global EC                    │
 * │ this:                 window (browser) / global (Node)         │
 * └─────────────────────────────────────────────────────────────────┘
 *
 *
 * KEY INSIGHTS:
 *
 * 1. Every code runs inside an Execution Context
 * 2. Global EC is created once when script starts
 * 3. Function EC is created every time a function is called
 * 4. Call Stack = stack of Execution Contexts
 * 5. When function finishes, its EC is destroyed (popped from stack)
 *
 * WHY THIS MATTERS FOR INTERVIEWS:
 * Understanding Execution Context lets you:
 *   - Explain hoisting properly (not "variables move up")
 *   - Understand scope chain (Lexical Environment links)
 *   - Predict this behavior
 *   - Debug closure issues
 *   - Answer ANY tricky JS question with confidence
 */

// Example to trace:
var name = 'global';

function greet() {
  var message = 'hello';
  console.log(message);
}

greet();

/**
 * RUN: node docs/01-execution-context/09-what-is-execution-context.js
 */
