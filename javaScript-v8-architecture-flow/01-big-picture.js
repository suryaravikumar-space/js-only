/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                              ║
 * ║         JAVASCRIPT V8 ENGINE - PART 1: THE BIG PICTURE                       ║
 * ║                                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ WHAT IS V8?                                                                  │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   V8 is Google's open-source JavaScript and WebAssembly engine, written in C++.
 *
 *   ┌─────────────────────────────────────────────────────────────────────────┐
 *   │ WHERE V8 IS USED                                                        │
 *   ├─────────────────────────────────────────────────────────────────────────┤
 *   │  • Google Chrome browser                                                │
 *   │  • Node.js runtime                                                      │
 *   │  • Deno runtime                                                         │
 *   │  • Electron (VS Code, Slack, Discord)                                   │
 *   │  • MongoDB (for server-side JS)                                         │
 *   │  • Cloudflare Workers                                                   │
 *   └─────────────────────────────────────────────────────────────────────────┘
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ COMPLETE V8 ARCHITECTURE - MIND MAP                                          │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *
 *                              ┌─────────────────┐
 *                              │  JAVASCRIPT     │
 *                              │  SOURCE CODE    │
 *                              │  "var x = 10;"  │
 *                              └────────┬────────┘
 *                                       │
 *                                       ▼
 *   ╔════════════════════════════════════════════════════════════════════════════╗
 *   ║                           V8 ENGINE                                        ║
 *   ╠════════════════════════════════════════════════════════════════════════════╣
 *   ║                                                                            ║
 *   ║   ┌────────────────────────────────────────────────────────────────────┐   ║
 *   ║   │                        PARSER                                      │   ║
 *   ║   │  ┌──────────────┐         ┌──────────────┐                         │   ║
 *   ║   │  │    LEXER     │────────▶│    PARSER    │                         │   ║
 *   ║   │  │ (Tokenizer)  │         │ (AST Builder)│                         │   ║
 *   ║   │  │              │         │              │                         │   ║
 *   ║   │  │ Source→Tokens│         │ Tokens→AST   │                         │   ║
 *   ║   │  └──────────────┘         └──────┬───────┘                         │   ║
 *   ║   └────────────────────────────────────┼───────────────────────────────┘   ║
 *   ║                                        │                                   ║
 *   ║                                        ▼                                   ║
 *   ║   ┌────────────────────────────────────────────────────────────────────┐   ║
 *   ║   │                       IGNITION                                     │   ║
 *   ║   │                    (Interpreter)                                   │   ║
 *   ║   │                                                                    │   ║
 *   ║   │    • Converts AST to BYTECODE                                      │   ║
 *   ║   │    • Executes bytecode immediately                                 │   ║
 *   ║   │    • Collects TYPE FEEDBACK (profiling)                            │   ║
 *   ║   │                                                                    │   ║
 *   ║   └─────────────────────────────┬──────────────────────────────────────┘   ║
 *   ║                                 │                                          ║
 *   ║                    ┌────────────┴────────────┐                             ║
 *   ║                    │                         │                             ║
 *   ║               COLD CODE                 HOT CODE                           ║
 *   ║            (runs few times)         (runs many times)                      ║
 *   ║                    │                         │                             ║
 *   ║                    ▼                         ▼                             ║
 *   ║   ┌─────────────────────────┐   ┌─────────────────────────────────────┐   ║
 *   ║   │  Continue with          │   │            TURBOFAN                 │   ║
 *   ║   │  Bytecode               │   │     (Optimizing Compiler)           │   ║
 *   ║   │                         │   │                                     │   ║
 *   ║   │  Most code stays here   │   │  • Uses type feedback               │   ║
 *   ║   │                         │   │  • Generates optimized MACHINE CODE │   ║
 *   ║   └─────────────────────────┘   │  • Function inlining                │   ║
 *   ║                                 │  • Dead code elimination            │   ║
 *   ║                                 │                                     │   ║
 *   ║                                 └──────────────┬──────────────────────┘   ║
 *   ║                                                │                          ║
 *   ║                                    ┌───────────┴───────────┐              ║
 *   ║                                    │                       │              ║
 *   ║                              Assumptions OK           Assumptions WRONG   ║
 *   ║                                    │                       │              ║
 *   ║                                    ▼                       ▼              ║
 *   ║                           ┌──────────────┐        ┌───────────────────┐   ║
 *   ║                           │   EXECUTE    │        │  DEOPTIMIZATION   │   ║
 *   ║                           │   FAST!      │        │  (Bail out to     │   ║
 *   ║                           │              │        │   bytecode)       │   ║
 *   ║                           └──────────────┘        └───────────────────┘   ║
 *   ║                                                                            ║
 *   ╠════════════════════════════════════════════════════════════════════════════╣
 *   ║                          MEMORY MANAGEMENT                                 ║
 *   ╠════════════════════════════════════════════════════════════════════════════╣
 *   ║                                                                            ║
 *   ║   ┌─────────────────────┐              ┌─────────────────────────────┐    ║
 *   ║   │      STACK          │              │           HEAP              │    ║
 *   ║   │                     │              │                             │    ║
 *   ║   │ • Primitives        │              │ • Objects                   │    ║
 *   ║   │ • References        │              │ • Arrays                    │    ║
 *   ║   │ • Call Frames       │              │ • Functions                 │    ║
 *   ║   │                     │              │ • Closures                  │    ║
 *   ║   │ Fast, Fixed Size    │              │                             │    ║
 *   ║   │ Auto cleanup        │              │ Garbage Collected           │    ║
 *   ║   │                     │              │                             │    ║
 *   ║   └─────────────────────┘              │  ┌───────────────────────┐  │    ║
 *   ║                                        │  │    GARBAGE COLLECTOR  │  │    ║
 *   ║                                        │  │  • Scavenger (Young)   │  │    ║
 *   ║                                        │  │  • Mark-Sweep (Old)    │  │    ║
 *   ║                                        │  │  • Mark-Compact        │  │    ║
 *   ║                                        │  └───────────────────────┘  │    ║
 *   ║                                        └─────────────────────────────┘    ║
 *   ║                                                                            ║
 *   ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ THE JOURNEY: What happens when you run "node file.js"                        │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *
 *   STEP 1                    STEP 2                    STEP 3
 *   ══════                    ══════                    ══════
 *   ┌──────────┐              ┌──────────┐              ┌──────────┐
 *   │  NODE    │              │  READ    │              │  WRAP    │
 *   │  STARTS  │─────────────▶│  FILE    │─────────────▶│  CODE    │
 *   │          │              │          │              │          │
 *   │Initialize│              │ Read as  │              │ Wrap in  │
 *   │V8 + libuv│              │ string   │              │ function │
 *   └──────────┘              └──────────┘              └──────────┘
 *                                                              │
 *                                                              ▼
 *   Your code:                                    (function(exports, require,
 *   ───────────                                    module, __filename, __dirname) {
 *   var x = 10;                                      var x = 10;
 *   console.log(x);                                  console.log(x);
 *                                                  });
 *
 *
 *   STEP 4                    STEP 5                    STEP 6
 *   ══════                    ══════                    ══════
 *   ┌──────────┐              ┌──────────┐              ┌──────────┐
 *   │ TOKENIZE │              │  PARSE   │              │ COMPILE  │
 *   │          │─────────────▶│          │─────────────▶│          │
 *   │          │              │          │              │          │
 *   │Source →  │              │Tokens →  │              │AST →     │
 *   │Tokens    │              │AST       │              │Bytecode  │
 *   └──────────┘              └──────────┘              └──────────┘
 *
 *   Tokens:                   AST:                     Bytecode:
 *   ────────                  ────                     ─────────
 *   [var][x][=][10][;]        Program                  LdaSmi [10]
 *                             └─VariableDeclaration    Star r0
 *                               └─VariableDeclarator   LdaGlobal [console]
 *                                 ├─Identifier: x      ...
 *                                 └─Literal: 10
 *
 *
 *   STEP 7                    STEP 8                    STEP 9
 *   ══════                    ══════                    ══════
 *   ┌──────────┐              ┌──────────┐              ┌──────────┐
 *   │ EXECUTE  │              │  EVENT   │              │  EXIT    │
 *   │          │─────────────▶│  LOOP    │─────────────▶│          │
 *   │          │              │          │              │          │
 *   │Run code  │              │Process   │              │Cleanup   │
 *   │line by   │              │async     │              │GC, exit  │
 *   │line      │              │callbacks │              │process   │
 *   └──────────┘              └──────────┘              └──────────┘
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ V8 COMPONENTS TABLE                                                          │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   ┌─────────────────┬────────────────────────────────────────────────────────┐
 *   │ COMPONENT       │ PURPOSE                                                │
 *   ├─────────────────┼────────────────────────────────────────────────────────┤
 *   │ Lexer/Scanner   │ Converts source code string into tokens               │
 *   │ Parser          │ Converts tokens into Abstract Syntax Tree (AST)       │
 *   │ Ignition        │ Interpreter - compiles AST to bytecode, executes it   │
 *   │ TurboFan        │ Optimizing compiler - compiles hot code to machine code│
 *   │ Orinoco         │ Garbage collector (Scavenger, Mark-Sweep, Mark-Compact)│
 *   │ Liftoff         │ WebAssembly baseline compiler                          │
 *   └─────────────────┴────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node javaScript-v8-architecture-flow/01-big-picture.js
 */

// ═══════════════════════════════════════════════════════════════════════════════
//                         EXECUTABLE EXAMPLE
// ═══════════════════════════════════════════════════════════════════════════════

console.log('═'.repeat(70));
console.log('       PART 1: THE BIG PICTURE - V8 ARCHITECTURE');
console.log('═'.repeat(70));

// PROOF: Node.js wraps your code in a function
console.log('\n1. PROOF OF CODE WRAPPING:');
console.log('─'.repeat(40));
console.log('   typeof exports:', typeof exports);
console.log('   typeof require:', typeof require);
console.log('   typeof module:', typeof module);
console.log('   typeof __filename:', typeof __filename);
console.log('   typeof __dirname:', typeof __dirname);
console.log('   arguments.length:', arguments.length, '(5 args from wrapper!)');

// Show the actual wrapper
console.log('\n2. THE ACTUAL WRAPPER CODE:');
console.log('─'.repeat(40));
console.log(require('module').wrapper);

// Show current file info
console.log('\n3. CURRENT FILE INFO:');
console.log('─'.repeat(40));
console.log('   __filename:', __filename);
console.log('   __dirname:', __dirname);

console.log('\n' + '═'.repeat(70));
console.log('       Read the comments above for the complete architecture!');
console.log('═'.repeat(70) + '\n');
