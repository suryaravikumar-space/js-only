# JavaScript Mastery — 30 Day Interview Preparation

## Your Goal
High-paying MNC jobs (React, Next.js, Node.js roles)
Companies will test 50%+ JavaScript fundamentals before frameworks.

---

## The Truth About JavaScript Interviews

```
┌─────────────────────────────────────────────────────────────────┐
│  What most candidates know:     │  What MNCs actually test:    │
├─────────────────────────────────┼──────────────────────────────┤
│  Syntax                         │  WHY things work             │
│  Framework APIs                 │  Engine internals            │
│  Copy-paste solutions           │  Mental models               │
│  "It works"                     │  Edge cases                  │
│  Tutorial knowledge             │  First principles            │
└─────────────────────────────────┴──────────────────────────────┘

You are building: First principles understanding
This is what separates 40 LPA candidates from 10 LPA candidates.
```

---

## 30-Day Curriculum

### Week 1: JavaScript Engine & Execution (Days 1-7)
**Foundation of everything**

| Day | Topic | Why It Matters |
|-----|-------|----------------|
| 1-2 | Execution Context | Everything runs inside this |
| 3 | Call Stack Deep Dive | Debugging, error traces |
| 4 | Scope Chain & Lexical Environment | Variable resolution |
| 5 | Hoisting (all edge cases) | 90% of tricky questions |
| 6 | this Binding (4 rules) | Most confusing topic |
| 7 | Review + Tricky Combined Questions | Interview simulation |

**Status: IN PROGRESS** ← We are here

---

### Week 2: Functions & Closures (Days 8-14)
**The heart of JavaScript**

| Day | Topic | Why It Matters |
|-----|-------|----------------|
| 8 | Closures - What & Why | Asked in every interview |
| 9 | Closures - Practical Patterns | Module pattern, data privacy |
| 10 | Closures - Common Pitfalls | Loop + closure problems |
| 11 | Higher-Order Functions | map, filter, reduce internals |
| 12 | Currying & Partial Application | Functional programming |
| 13 | call, apply, bind Deep Dive | Explicit this binding |
| 14 | Review + Build: Custom map/filter/reduce | Prove understanding |

---

### Week 3: Objects & Prototypes (Days 15-21)
**How JavaScript really does OOP**

| Day | Topic | Why It Matters |
|-----|-------|----------------|
| 15 | Objects - Creation Patterns | Literal, constructor, Object.create |
| 16 | Prototypes - The [[Prototype]] Chain | Inheritance mechanism |
| 17 | Prototypes - Methods & Properties | Own vs inherited |
| 18 | ES6 Classes (Syntactic Sugar) | What classes really are |
| 19 | Inheritance Patterns | Classical vs prototypal |
| 20 | Object Methods Deep Dive | keys, values, entries, assign, freeze |
| 21 | Review + Build: Custom Object.create | Prove understanding |

---

### Week 4: Async JavaScript (Days 22-28)
**The most important topic for Node.js/React**

| Day | Topic | Why It Matters |
|-----|-------|----------------|
| 22 | Event Loop - The Mental Model | Core of async JS |
| 23 | Event Loop - Microtasks vs Macrotasks | Promise vs setTimeout |
| 24 | Callbacks & Callback Hell | Why promises were created |
| 25 | Promises Deep Dive | States, chaining, error handling |
| 26 | Promise Methods | all, race, allSettled, any |
| 27 | async/await - Under the Hood | Generator-based implementation |
| 28 | Review + Predict Event Loop Output | Most common interview Q |

---

### Days 29-30: Advanced Topics & Interview Prep

| Day | Topic |
|-----|-------|
| 29 | Debouncing, Throttling, Memoization |
| 30 | Final Review + Mock Interview Questions |

---

## Additional Critical Topics (Cover Throughout)

### Must Know (High Frequency)
- [ ] == vs === (type coercion)
- [ ] Truthy/Falsy values
- [ ] typeof quirks (null, array, NaN)
- [ ] Shallow vs Deep copy
- [ ] Pass by value vs reference
- [ ] Destructuring (objects, arrays)
- [ ] Spread/Rest operators
- [ ] Template literals
- [ ] Arrow functions vs regular (6 differences)
- [ ] Modules (CommonJS vs ES Modules)
- [ ] Error handling (try/catch/finally)
- [ ] Symbol & its use cases
- [ ] WeakMap & WeakSet
- [ ] Iterators & Generators
- [ ] Proxy & Reflect

### For React Specifically
- [ ] Immutability concepts
- [ ] Shallow comparison
- [ ] Event delegation
- [ ] Synthetic events
- [ ] Reconciliation prerequisites

### For Node.js Specifically
- [ ] Streams & Buffers
- [ ] Process & child_process
- [ ] EventEmitter pattern
- [ ] Module caching
- [ ] Blocking vs Non-blocking I/O

---

## Interview Question Categories

### Conceptual (Explain)
- "Explain closures with an example"
- "What is the event loop?"
- "Difference between == and ==="
- "How does prototypal inheritance work?"
- "What happens when you type a URL?"

### Output Prediction (What prints?)
- Hoisting tricky code
- this binding scenarios
- Promise/setTimeout order
- Closure in loops

### Implementation (Write code)
- Implement debounce
- Implement throttle
- Implement Promise.all
- Implement deep clone
- Implement bind polyfill
- Implement curry function

### Debugging (Find the bug)
- Memory leaks
- Race conditions
- Incorrect this
- Closure bugs

---

## Folder Structure

```
js-only/
├── concepts/           ← Theory & roadmaps
│   ├── 00-javascript-master-roadmap.md (this file)
│   ├── 01-execution-context/
│   ├── 02-closures/
│   ├── 03-this-binding/
│   └── ...
│
├── playground/         ← Code to run and test
│   ├── 01-execution-context/
│   ├── 02-closures/
│   └── ...
│
└── docs/               ← Detailed explanations (synced with playground)
    ├── 01-execution-context/
    ├── 02-closures/
    └── ...
```

---

## Daily Practice Routine

```
Morning (2 hours):
  - Learn new concept
  - Read documentation
  - Understand the "why"

Afternoon (2 hours):
  - Solve challenges
  - Predict outputs
  - Write code without IDE hints

Evening (1 hour):
  - Review what you learned
  - Explain concept out loud (YouTube prep)
  - Note doubts for tomorrow
```

---

## Success Metrics

By Day 30, you should be able to:

1. **Explain** any JS concept in 2 minutes (interview answer)
2. **Predict** output of tricky code without running it
3. **Implement** common utilities from scratch
4. **Debug** any JS issue by understanding internals
5. **Teach** these concepts to someone else (YouTube)

---

## Let's Continue

Current Topic: **Execution Context**
Current Status: **13 challenges completed**
Next: **More edge cases, then Closures**

---

*Remember: JavaScript was built in 10 days, but mastering it takes deliberate practice. You have 30 days. That's enough to be better than 95% of candidates.*
