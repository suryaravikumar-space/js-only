# Execution Context — Learning Roadmap

## What You'll Master

By the end of this section, you will understand how JavaScript **actually runs your code** — not surface-level syntax, but the internal machinery.

---

## Prerequisites

- Basic JavaScript syntax (variables, functions, console.log)
- Nothing else — we build from first principles

---

## Learning Path (A → B)

```
START
  │
  ▼
┌─────────────────────────────────────────────────────────────┐
│ PHASE 1: Variable Hoisting                                  │
│ Understanding what happens BEFORE code runs                 │
├─────────────────────────────────────────────────────────────┤
│ 00 - var hoisting (undefined behavior)                      │
│ 01 - let vs var (Temporal Dead Zone)                        │
│ 02 - Function hoisting (declarations vs expressions)        │
│ 03 - const function expressions                             │
│ 04 - Redeclaration rules                                    │
│ 05 - Hoisting in conditionals (tricky edge case)            │
└─────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────┐
│ PHASE 2: Scope & Scope Chain                                │
│ How JavaScript finds variables                              │
├─────────────────────────────────────────────────────────────┤
│ 06 - Scope chain (inner → outer lookup)                     │
│ ?? - Block scope vs function scope                          │
│ ?? - Lexical scoping (definition-time, not call-time)       │
└─────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────┐
│ PHASE 3: Call Stack                                         │
│ How JavaScript tracks function execution                    │
├─────────────────────────────────────────────────────────────┤
│ 07 - Call stack basics                                      │
│ 08 - Stack overflow (recursion without base case)           │
│ ?? - Stack traces & debugging                               │
└─────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────┐
│ PHASE 4: Execution Context Deep Dive                        │
│ The complete mental model                                   │
├─────────────────────────────────────────────────────────────┤
│ 09 - What is an Execution Context? (3 components)           │
│ ?? - Global vs Function Execution Context                   │
│ ?? - Creation phase vs Execution phase (formal)             │
│ ?? - Variable Environment vs Lexical Environment            │
│ ?? - Arguments object                                       │
│ ?? - this binding (introduction)                            │
└─────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────┐
│ PHASE 5: Interview-Level Challenges                         │
│ Combined tricky questions                                   │
├─────────────────────────────────────────────────────────────┤
│ ?? - Multiple hoisting + scope combined                     │
│ ?? - Nested function execution contexts                     │
│ ?? - Edge cases interviewers love                           │
└─────────────────────────────────────────────────────────────┘
  │
  ▼
 END → Ready for Closures topic
```

---

## Key Concepts (Summary)

| Concept | One-Line Definition |
|---------|---------------------|
| Execution Context | A box that holds variables, scope chain, and `this` for running code |
| Creation Phase | JS sets up the box (registers variables, links scope, sets this) |
| Execution Phase | JS runs code line by line inside the box |
| Variable Environment | Where variables and functions are stored |
| Lexical Environment | Link to parent scope (scope chain) |
| Call Stack | Stack of Execution Contexts (LIFO) |
| Hoisting | Variables/functions registered in creation phase before execution |
| TDZ | Temporal Dead Zone — let/const exist but can't be accessed yet |

---

## Folder Structure

```
01-execution-context/
│
├── concepts/     ← You are here (theory & roadmap)
│   ├── 00-roadmap.md
│   └── what-is-execution-context.js
│
├── playground/   ← Run these to test yourself
│   ├── 00-var-hoisting.js
│   ├── 01-let-vs-var.js
│   └── ...
│
└── docs/         ← Detailed explanations (synced with playground)
    ├── 00-var-hoisting.js
    ├── 01-let-vs-var.js
    └── ...
```

---

## How to Use This Material

1. **Read** the concept file first (theory)
2. **Predict** the output of playground file (don't run yet)
3. **Run** the playground file to verify
4. **Study** the docs file if your prediction was wrong
5. **Repeat** until you can predict correctly every time

---

## YouTube Video Order (if creating content)

1. "JavaScript Execution Context Explained — What Actually Happens When Code Runs"
2. "var vs let vs const — The Truth About Hoisting"
3. "The Call Stack — Why JavaScript is Single-Threaded"
4. "Scope Chain — How JavaScript Finds Your Variables"
5. "Interview Traps — Execution Context Questions That Trip Everyone Up"
