/**
 * TOPIC: Redeclaration — var vs let/const
 *
 * CONCEPT:
 * var allows redeclaring the same variable.
 * let/const block redeclaration with a SyntaxError.
 *
 * ┌─────────────────┬─────────────┬─────────────────────────┐
 * │ Declaration     │ Error Type  │ When                    │
 * ├─────────────────┼─────────────┼─────────────────────────┤
 * │ var a; var a;   │ No error    │ —                       │
 * │ let b; let b;   │ SyntaxError │ Before code runs        │
 * │ const c; const c│ SyntaxError │ Before code runs        │
 * └─────────────────┴─────────────┴─────────────────────────┘
 *
 * DESIGN PHILOSOPHY:
 *
 * Why var allows redeclaration:
 *   - JavaScript (1995) was designed to be forgiving
 *   - "Just work" mentality, even with sloppy code
 *   - Redeclaring silently reassigns the same variable
 *
 * Why let/const block redeclaration:
 *   - ES6 (2015) introduced stricter rules
 *   - Goal: "Fail fast" — catch mistakes early
 *   - SyntaxError happens at PARSE TIME (before execution)
 *   - Better to crash immediately than have subtle bugs
 */

// TEST 1: var redeclaration — allowed
var a = 1;
var a = 2;
console.log(a);  // 2

// TEST 2: let redeclaration — blocked
// let b = 1;
// let b = 2;  // SyntaxError: Identifier 'b' has already been declared

/**
 * REAL-WORLD BUG THIS PREVENTS:
 *
 * function processUser(data) {
 *   let userId = data.id;
 *
 *   // ... 100 lines of code ...
 *
 *   let userId = data.visitorId;  // OOPS! Typo, meant different name
 *   // With var: silent bug, original userId overwritten
 *   // With let: SyntaxError catches your mistake immediately
 * }
 *
 * KEY INSIGHT:
 * SyntaxError = JavaScript rejects code BEFORE running it.
 * This is parse-time validation, not runtime.
 *
 * RUN: node docs/04-redeclaration.js
 */
