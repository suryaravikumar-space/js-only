# ES6+ Features Guide

> **Complete mapping of modern JavaScript features to this repository**
>
> Read [INSTRUCTIONS.md](/INSTRUCTIONS.md) first for the learning methodology

---

## What is ES6?

**ES6 (ECMAScript 2015)** was the biggest update to JavaScript, introducing:
- Better syntax for common patterns
- New data structures
- Better async handling
- Module system
- And much more...

**Subsequent versions (ES2016-ES2024)** added incremental improvements.

---

## ES6+ Features Coverage Map

### ✅ FULLY COVERED

#### 1. **Let & Const**
📁 Location: [01-execution-context](/docs/javascript/01-execution-context)
- Block scoping
- Temporal Dead Zone
- Hoisting differences
- var vs let vs const

**Interview Focus:**
- Closure + let/var in loops
- TDZ behavior
- When to use const vs let

---

#### 2. **Arrow Functions**
📁 Location: [01-execution-context](/docs/javascript/01-execution-context) (this binding)
📁 Location: [21-this-binding](/docs/javascript/21-this-binding)
- Syntax variations
- Lexical `this` binding
- No `arguments` object
- Cannot be used as constructors

**Interview Focus:**
- Arrow functions + this
- Arrow functions in classes
- Arrow functions in callbacks

---

#### 3. **Template Literals**
📁 Location: Need to check if covered
- String interpolation
- Multi-line strings
- Tagged templates

**Status:** ⚠️ May need dedicated file

---

#### 4. **Destructuring**
📁 Location: [14-destructuring-spread](/docs/javascript/14-destructuring-spread)
- Array destructuring
- Object destructuring
- Nested destructuring
- Default values
- Rest pattern

**Interview Focus:**
- Swapping values
- Function parameter destructuring
- Renaming during destructuring

---

#### 5. **Spread & Rest Operators**
📁 Location: [14-destructuring-spread](/docs/javascript/14-destructuring-spread)
- Spread in arrays
- Spread in objects
- Rest parameters
- Copying vs referencing

**Interview Focus:**
- Shallow vs deep copy
- Spread with nested objects
- Rest in function parameters

---

#### 6. **Default Parameters**
📁 Location: [14-destructuring-spread](/docs/javascript/14-destructuring-spread) (likely)
- Function default values
- Default with destructuring

**Status:** ⚠️ Verify coverage

---

#### 7. **Enhanced Object Literals**
📁 Location: [06-objects-creation](/docs/javascript/06-objects-creation)
- Shorthand property names
- Shorthand method definitions
- Computed property names

**Status:** ⚠️ Verify coverage

---

#### 8. **Classes**
📁 Location: [15-classes-oop](/docs/javascript/15-classes-oop)
- Class syntax
- Constructor
- Methods
- Static methods
- Getters/Setters
- Private fields (#)
- Inheritance (extends)

**Interview Focus:**
- Class vs constructor functions
- Prototypal inheritance
- Private fields
- Static vs instance methods

---

#### 9. **Promises**
📁 Location: [10-promise-methods](/docs/javascript/10-promise-methods)
- Promise basics
- .then/.catch/.finally
- Promise.all/race/any/allSettled
- Chaining
- Error handling

**Interview Focus:**
- Promise + event loop
- Promise + closures
- Error handling patterns
- Parallel vs sequential

---

#### 10. **Async/Await**
📁 Location: [04-event-loop](/docs/javascript/04-event-loop)
📁 Location: [10-promise-methods](/docs/javascript/10-promise-methods)
- async functions
- await keyword
- Error handling (try/catch)
- Sequential vs parallel

**Interview Focus:**
- Event loop interaction
- Error handling differences
- Performance considerations

---

#### 11. **Modules (Import/Export)**
📁 Location: [20-modules-esm-cjs](/docs/javascript/20-modules-esm-cjs)
- ES Modules (ESM)
- CommonJS (CJS)
- Named exports/imports
- Default exports/imports
- Dynamic imports
- Tree shaking

**Interview Focus:**
- ESM vs CommonJS
- Circular dependencies
- Import hoisting

---

#### 12. **Iterators & Generators**
📁 Location: [16-generators-iterators](/docs/javascript/16-generators-iterators)
- Iterator protocol
- Iterable protocol
- Generator functions (function*)
- yield keyword
- for...of loops
- Async generators

**Interview Focus:**
- Custom iterators
- Lazy evaluation
- Infinite sequences

---

#### 13. **Map & Set**
📁 Location: [17-map-set-weakmap](/docs/javascript/17-map-set-weakmap)
- Map basics
- Set basics
- WeakMap
- WeakSet
- Map vs Object
- Use cases

**Interview Focus:**
- When to use Map vs Object
- Memory leaks with WeakMap/WeakSet
- Set operations (union, intersection)

---

#### 14. **Symbols**
📁 Location: [24-symbols](/docs/javascript/24-symbols)
- Symbol basics
- Symbol.iterator
- Symbol.for (global registry)
- Well-known symbols
- Use cases

**Interview Focus:**
- Private properties with symbols
- Symbol.iterator implementation
- Symbol vs string keys

---

#### 15. **Proxy & Reflect**
📁 Location: [23-proxy-reflect](/docs/javascript/23-proxy-reflect)
- Proxy traps
- Reflect API
- Use cases (validation, logging, etc.)
- Revocable proxies

**Interview Focus:**
- Vue/React reactivity systems
- Validation patterns
- Performance implications

---

### ⚠️ POTENTIALLY MISSING / NEEDS VERIFICATION

#### 16. **Template Literals (Tagged Templates)**
**Status:** Needs dedicated section
**Should cover:**
- Basic interpolation
- Multi-line strings
- Tagged template functions
- Real-world use cases (styled-components)

**Create file:** `docs/javascript/XX-template-literals/`

---

#### 17. **for...of Loop**
**Status:** Likely covered in iterators, but needs verification
**Should cover:**
- for...of vs for...in
- Iterating arrays, strings, Maps, Sets
- Custom iterables

**Verify in:** [16-generators-iterators](/docs/javascript/16-generators-iterators)

---

#### 18. **Array Methods (ES6+)**
**Status:** Partially covered
📁 Location: [11-custom-array-methods](/docs/javascript/11-custom-array-methods)

**ES6 Methods:**
- Array.from()
- Array.of()
- find() / findIndex()
- fill()
- copyWithin()

**ES2015+:**
- includes() (ES2016)
- flat() / flatMap() (ES2019)
- at() (ES2022)

**Verify coverage**

---

#### 19. **Object Methods (ES6+)**
**Status:** Partially covered
📁 Location: [09-object-methods](/docs/javascript/09-object-methods)

**ES6 Methods:**
- Object.assign()
- Object.is()
- Object.keys/values/entries
- Object.getOwnPropertySymbols()

**ES2017+:**
- Object.getOwnPropertyDescriptors()
- Object.fromEntries() (ES2019)

**Verify coverage**

---

#### 20. **String Methods (ES6+)**
**Status:** Needs dedicated coverage

**ES6 Methods:**
- startsWith()
- endsWith()
- includes()
- repeat()
- padStart() / padEnd() (ES2017)
- trimStart() / trimEnd() (ES2019)

**Should create:** `docs/javascript/XX-string-methods/`

---

#### 21. **Optional Chaining (?.)** - ES2020
**Status:** Missing

**Should cover:**
- obj?.prop
- obj?.[expr]
- func?.()
- Real-world use cases

**Should create:** `docs/javascript/XX-modern-operators/`

---

#### 22. **Nullish Coalescing (??)** - ES2020
**Status:** Missing

**Should cover:**
- ?? vs ||
- Use with optional chaining
- Edge cases

**Should create:** `docs/javascript/XX-modern-operators/`

---

#### 23. **Numeric Separators** - ES2021
**Status:** Missing (low priority)

**Example:**
```javascript
const billion = 1_000_000_000;
```

---

#### 24. **Logical Assignment Operators** - ES2021
**Status:** Missing

**Should cover:**
- &&=
- ||=
- ??=

---

## ES6+ Interview Roadmap

### Must Know (100% of interviews test these)
1. ✅ let/const vs var
2. ✅ Arrow functions + this
3. ✅ Destructuring
4. ✅ Spread/Rest
5. ✅ Promises
6. ✅ Async/Await
7. ✅ Classes
8. ✅ Modules

### Should Know (70% of interviews)
9. ✅ Map/Set
10. ✅ Template literals
11. ✅ Default parameters
12. ⚠️ Optional chaining
13. ⚠️ Nullish coalescing
14. ✅ for...of

### Nice to Know (30% of interviews)
15. ✅ Generators
16. ✅ Symbols
17. ✅ Proxy/Reflect
18. ⚠️ Tagged templates

---

## Recommended Learning Order

### Path 1: Interview Essentials (2-3 weeks)
1. **Week 1:** let/const, arrow functions, destructuring, spread/rest
   - [01-execution-context](/docs/javascript/01-execution-context)
   - [14-destructuring-spread](/docs/javascript/14-destructuring-spread)
   - [21-this-binding](/docs/javascript/21-this-binding)

2. **Week 2:** Promises, async/await, event loop
   - [04-event-loop](/docs/javascript/04-event-loop)
   - [10-promise-methods](/docs/javascript/10-promise-methods)

3. **Week 3:** Classes, modules, array methods
   - [15-classes-oop](/docs/javascript/15-classes-oop)
   - [20-modules-esm-cjs](/docs/javascript/20-modules-esm-cjs)
   - [11-custom-array-methods](/docs/javascript/11-custom-array-methods)

### Path 2: Advanced Features (1-2 weeks)
4. **Week 4:** Map/Set, iterators, generators
   - [17-map-set-weakmap](/docs/javascript/17-map-set-weakmap)
   - [16-generators-iterators](/docs/javascript/16-generators-iterators)

5. **Week 5:** Symbols, Proxy, Reflect
   - [24-symbols](/docs/javascript/24-symbols)
   - [23-proxy-reflect](/docs/javascript/23-proxy-reflect)

---

## Common ES6+ Interview Patterns

### Pattern 1: The Setup (Basic ES6)
"Here's a simple destructuring example..."

### Pattern 2: The Twist (Combining features)
"What if we use destructuring with default parameters?"

### Pattern 3: The Edge Case
"What happens with nested destructuring and undefined values?"

### Pattern 4: The Real-World Application
"How would you use Proxy to implement Vue's reactivity?"

### Pattern 5: The Performance Question
"Why use Map instead of Object for this use case?"

---

## Missing Features to Add

### High Priority
1. **Modern Operators** (Optional Chaining, Nullish Coalescing)
   - Create: `docs/javascript/XX-modern-operators/`

2. **Template Literals** (if not adequately covered)
   - Create: `docs/javascript/XX-template-literals/`

3. **String Methods**
   - Create: `docs/javascript/XX-string-methods/`

### Medium Priority
4. **Enhanced Object Literals** (verify coverage)
5. **for...of loops** (verify coverage)
6. **Array.from/Array.of** (verify coverage)

### Low Priority
7. Numeric separators
8. Logical assignment operators
9. Private class fields (verify if covered in classes)

---

## Verification Checklist

Run these commands to verify coverage:

```bash
# Check template literals
grep -r "template literal" docs/javascript/

# Check optional chaining
grep -r "optional chaining\|?\\." docs/javascript/

# Check nullish coalescing
grep -r "nullish\|??" docs/javascript/

# Check for...of
grep -r "for.*of" docs/javascript/16-generators-iterators/

# Check enhanced object literals
grep -r "computed property\|shorthand" docs/javascript/06-objects-creation/
```

---

## Quick Reference: ES Version Timeline

- **ES6 (ES2015)**: let/const, arrow functions, classes, promises, modules, destructuring, spread/rest, template literals, Map/Set, Symbol, Proxy, generators
- **ES2016**: Array.includes(), Exponentiation operator (**)
- **ES2017**: async/await, Object.values/entries, String padding
- **ES2018**: Rest/Spread for objects, Promise.finally, Async iteration
- **ES2019**: Array.flat/flatMap, Object.fromEntries, Optional catch binding
- **ES2020**: Optional chaining, Nullish coalescing, BigInt, Promise.allSettled
- **ES2021**: Logical assignment, Numeric separators, String.replaceAll
- **ES2022**: Top-level await, Class fields, Array.at()
- **ES2023**: Array.findLast/findLastIndex, Hashbang grammar
- **ES2024**: Object.groupBy, Promise.withResolvers

---

## Next Steps

1. ✅ Read [INSTRUCTIONS.md](/INSTRUCTIONS.md) for learning methodology
2. ✅ Start with must-know features (let/const, arrow functions, promises)
3. ⚠️ Create missing feature folders (modern operators, template literals)
4. ✅ Follow the "what breaks if?" approach for each feature
5. ✅ Combine features (promises + destructuring, classes + async/await)

---

**Remember:** Interviews don't test ES6 features in isolation. They test how features interact!

- "What if we use destructuring with async/await?"
- "What happens with arrow functions in class methods?"
- "How do Promises interact with the event loop?"

**Study for movement, not memorization.**
