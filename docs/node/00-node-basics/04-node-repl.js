/**
 * TOPIC 04: Node.js REPL
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ REPL = Read-Eval-Print-Loop                                               ║
 * ║                                                                            ║
 * ║   Type `node` in terminal → interactive JS environment                    ║
 * ║                                                                            ║
 * ║   Commands:                                                               ║
 * ║   .help    - show commands                                                 ║
 * ║   .exit    - exit REPL                                                    ║
 * ║   .break   - abort multi-line expression                                  ║
 * ║   .save    - save session to file                                         ║
 * ║   .load    - load file into session                                       ║
 * ║   _        - last result                                                   ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  REPL is like a CALCULATOR with superpowers:                               │
 * │                                                                             │
 * │  1. READ   → You type something (2 + 3)                                   │
 * │  2. EVAL   → Calculator computes it                                        │
 * │  3. PRINT  → Shows the answer (5)                                         │
 * │  4. LOOP   → Waits for your next input                                    │
 * │                                                                             │
 * │  But unlike a calculator, you can:                                         │
 * │    - Define variables and functions                                        │
 * │    - Import modules (require)                                              │
 * │    - Run any JavaScript                                                    │
 * │    - Access the last answer with _ (like ANS button)                       │
 * │                                                                             │
 * │  "It's your JavaScript playground - type and see results instantly!"      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM                                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │        ┌────────┐                                                          │
 * │   ───→ │  READ  │  You type: 2 + 3                                        │
 * │   │    └───┬────┘                                                          │
 * │   │        ↓                                                               │
 * │   │    ┌────────┐                                                          │
 * │   │    │  EVAL  │  V8 computes: 5                                         │
 * │   │    └───┬────┘                                                          │
 * │   │        ↓                                                               │
 * │   │    ┌────────┐                                                          │
 * │   │    │ PRINT  │  Shows: 5                                               │
 * │   │    └───┬────┘                                                          │
 * │   │        ↓                                                               │
 * │   │    ┌────────┐                                                          │
 * │   └─── │  LOOP  │  Back to waiting for input...                           │
 * │        └────────┘                                                          │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// You can create a custom REPL programmatically
const repl = require('repl');

// REPL features demonstration (as code, not interactive)
console.log('A:', 'REPL = Read-Eval-Print-Loop');
console.log('B:', 'Start REPL: type `node` in terminal');
console.log('C:', 'Exit REPL: .exit or Ctrl+D');

// The _ variable holds the last evaluated result
// > 2 + 3
// 5
// > _
// 5
console.log('D:', '_ holds last result in REPL');

// Tab completion
console.log('E:', 'Press TAB for auto-completion');

// Multi-line expressions
// > const add = (a, b) => {
// ...   return a + b;
// ... };
console.log('F:', 'REPL supports multi-line with ... prompt');

// Programmatic REPL (uncomment to try)
// const myRepl = repl.start({ prompt: 'myapp > ' });
// myRepl.context.greeting = 'Hello from custom REPL!';

/**
 * OUTPUT:
 *   A: REPL = Read-Eval-Print-Loop
 *   B: Start REPL: type `node` in terminal
 *   C: Exit REPL: .exit or Ctrl+D
 *   D: _ holds last result in REPL
 *   E: Press TAB for auto-completion
 *   F: REPL supports multi-line with ... prompt
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ REPL COMMANDS                                                              ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║   $ node              → Start REPL                                        ║
 * ║   > 2 + 3             → 5                                                 ║
 * ║   > _                 → 5 (last result)                                   ║
 * ║   > .help             → Show all REPL commands                            ║
 * ║   > .exit             → Exit (or Ctrl+D)                                  ║
 * ║   > .save file.js     → Save session to file                             ║
 * ║   > .load file.js     → Load and execute file                            ║
 * ║   > .break            → Exit multi-line input                             ║
 * ║   > .clear            → Clear context                                     ║
 * ║                                                                            ║
 * ║   $ node -e "code"    → Execute code inline                               ║
 * ║   $ node -p "2+3"     → Print result: 5                                   ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "The Node.js REPL is an interactive shell for executing JavaScript.        │
 * │  It reads input, evaluates it, prints the result, and loops. Useful for   │
 * │  quick testing and prototyping. The _ variable stores the last result.     │
 * │  You can also create custom REPLs programmatically using the 'repl'       │
 * │  module for building interactive CLI tools."                               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/00-node-basics/04-node-repl.js
 */
