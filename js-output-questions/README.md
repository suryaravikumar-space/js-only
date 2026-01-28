# 100 Tricky JavaScript Output Questions

A comprehensive collection of "Guess the Output" style JavaScript interview questions covering all major concepts.

## Structure

```
js-output-questions/
├── questions/    # Code snippets to predict output
├── answers/      # Solutions with detailed explanations
└── README.md
```

## Categories

### 1. Hoisting (Q01-10)
| # | Topic | Key Concept |
|---|-------|-------------|
| 01 | var hoisting | Declaration hoisted, value undefined |
| 02 | function hoisting | Fully hoisted (name + body) |
| 03 | let TDZ | Temporal Dead Zone |
| 04 | function expression | Only var name hoisted |
| 05 | var vs let scope | Block vs function scope |
| 06 | function in block | Inconsistent behavior |
| 07 | variable shadowing | Inner scope shadows outer |
| 08 | const TDZ | Same as let |
| 09 | function vs var name | Function wins in hoisting |
| 10 | nested function | Functions hoisted in scope |

### 2. Closures & Scope (Q11-20)
| # | Topic | Key Concept |
|---|-------|-------------|
| 11 | basic closure | Functions remember outer scope |
| 12 | loop var closure | All share same variable |
| 13 | loop let closure | Each iteration new binding |
| 14 | IIFE solution | Creates new scope per iteration |
| 15 | shared variable | Common interview gotcha |
| 16 | separate closures | Each call creates new closure |
| 17 | nested closures | Currying pattern |
| 18 | parameter shadowing | Parameter shadows global |
| 19 | module pattern | Private variables via closure |
| 20 | scope chain | Nearest scope wins |

### 3. 'this' Keyword (Q21-30)
| # | Topic | Key Concept |
|---|-------|-------------|
| 21 | method this | Points to object before dot |
| 22 | lost context | this becomes global/undefined |
| 23 | arrow this | Inherits from enclosing scope |
| 24 | arrow inside method | Preserves outer this |
| 25 | nested function | Has own this (undefined) |
| 26 | call() | Explicitly set this |
| 27 | bind() | Permanently bind this |
| 28 | constructor this | Points to new object |
| 29 | class method | Strict mode, lost context |
| 30 | setTimeout this | Regular vs arrow callback |

### 4. Type Coercion (Q31-40)
| # | Topic | Key Concept |
|---|-------|-------------|
| 31 | string + number | Concatenation wins |
| 32 | string - number | Numeric conversion |
| 33 | string comparison | Lexicographic vs numeric |
| 34 | boolean arithmetic | true=1, false=0 |
| 35 | null/undefined | null=0, undefined=NaN |
| 36 | object to primitive | toString/valueOf |
| 37 | array coercion | Join with commas |
| 38 | falsy values | Only 7 falsy values |
| 39 | NaN quirks | NaN !== NaN |
| 40 | unary plus | Quick type conversion |

### 5. Async, Promises & Event Loop (Q41-55)
| # | Topic | Key Concept |
|---|-------|-------------|
| 41 | setTimeout order | Macrotask queue |
| 42 | Promise vs timeout | Microtask priority |
| 43 | promise chaining | Return values flow through |
| 44 | executor sync | Promise executor is sync |
| 45 | nested setTimeout | Each schedules next |
| 46 | async/await basic | Sync until await |
| 47 | await pause | Resumes after sync code |
| 48 | promise throw | Goes to catch |
| 49 | Promise.all | Wait for all |
| 50 | Promise.race | First to settle wins |
| 51 | microtask queue | Drains before macrotasks |
| 52 | task priority | Sync > Micro > Macro |
| 53 | async Promise.all | Parallel execution |
| 54 | finally | Always runs, return ignored |
| 55 | complex event loop | Full cycle understanding |

### 6. Objects & Arrays (Q56-70)
| # | Topic | Key Concept |
|---|-------|-------------|
| 56 | object reference | Assign by reference |
| 57 | shallow copy | Nested objects shared |
| 58 | array reference | Same as objects |
| 59 | array spread | Creates new array |
| 60 | object comparison | Reference equality |
| 61 | map vs forEach | Return value difference |
| 62 | sparse arrays | Holes vs undefined |
| 63 | delete on array | Creates hole, keeps length |
| 64 | keys vs for...in | Own vs inherited |
| 65 | splice vs slice | Mutate vs copy |
| 66 | computed properties | Dynamic keys |
| 67 | array destructuring | Skip, defaults |
| 68 | object destructuring | Rename, defaults |
| 69 | nested destructuring | Deep extraction |
| 70 | method chaining | Filter, map, reduce |

### 7. Operators & Comparisons (Q71-80)
| # | Topic | Key Concept |
|---|-------|-------------|
| 71 | == vs === | Loose vs strict |
| 72 | null comparisons | >= but not == quirk |
| 73 | short-circuit | || and && return values |
| 74 | nullish coalescing | ?? only null/undefined |
| 75 | optional chaining | ?. safe navigation |
| 76 | typeof quirks | null is "object" |
| 77 | instanceof | Prototype chain check |
| 78 | increment | Pre vs post |
| 79 | comma operator | Returns last value |
| 80 | bitwise | AND, OR, XOR, shifts |

### 8. ES6+ Features (Q81-90)
| # | Topic | Key Concept |
|---|-------|-------------|
| 81 | template literals | ${} expressions |
| 82 | default params | undefined triggers default |
| 83 | rest parameters | Collect into array |
| 84 | spread operator | Expand iterables |
| 85 | arrow arguments | No own arguments |
| 86 | Symbol | Unique identifiers |
| 87 | Map | Any key type |
| 88 | Set | Unique values |
| 89 | for...of vs in | Values vs keys |
| 90 | classes | Inheritance, static |

### 9. Miscellaneous Tricky (Q91-100)
| # | Topic | Key Concept |
|---|-------|-------------|
| 91 | floating point | 0.1 + 0.2 !== 0.3 |
| 92 | string methods | charAt vs bracket |
| 93 | array length | Can truncate array |
| 94 | freeze vs seal | Shallow immutability |
| 95 | JSON quirks | What gets serialized |
| 96 | prototype chain | hasOwnProperty vs in |
| 97 | try/finally | Finally always runs |
| 98 | generators | Yield vs return |
| 99 | Proxy | Intercept operations |
| 100 | JS gotchas | Type coercion madness |

## How to Use

1. **Practice**: Open a question file and predict output
2. **Run**: Execute to check your answer
3. **Learn**: Read the detailed explanation in answers

```bash
# Run questions (try to predict first!)
node questions/01-10-hoisting.js

# Check answers with explanations
node answers/01-10-hoisting.js
```

## Key Takeaways

### Hoisting
- `var`: declaration hoisted, value undefined
- `let/const`: hoisted but in TDZ
- Functions: fully hoisted

### Closures
- Functions remember their lexical scope
- `var` in loops shares variable; `let` creates new binding

### this
- Object method: this = object
- Regular function: this = global/undefined
- Arrow function: this = inherited

### Type Coercion
- `+` with string = concatenation
- Other operators = numeric conversion
- Only 7 falsy values

### Event Loop
- Sync → All Microtasks → One Macrotask → Repeat
- Promises = microtasks (higher priority)
- setTimeout = macrotasks

### Objects/Arrays
- Assigned by reference
- Spread = shallow copy
- `===` compares references

## Tips for Interviews

1. Always say "it depends" and explain edge cases
2. Mention strict mode differences
3. Explain WHY, not just WHAT
4. Draw the event loop if asked about async
5. Remember: typeof null === "object" (famous bug)

Happy Coding! 🚀
