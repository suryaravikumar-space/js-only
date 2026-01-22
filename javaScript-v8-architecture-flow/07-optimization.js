/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                              ║
 * ║         JAVASCRIPT V8 ENGINE - PART 7: OPTIMIZATION                          ║
 * ║                                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ HIDDEN CLASSES (Maps/Shapes)                                                 │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   V8 creates "Hidden Classes" to optimize property access. Objects with
 *   the same property structure share the same hidden class.
 *
 *
 *   HOW HIDDEN CLASSES WORK:
 *   ════════════════════════
 *
 *   var obj = {};           // Hidden Class C0 (empty)
 *   obj.x = 10;             // Hidden Class C1 (has x)
 *   obj.y = 20;             // Hidden Class C2 (has x, y)
 *
 *
 *         obj = {}                   obj.x = 10              obj.y = 20
 *            │                           │                       │
 *            ▼                           ▼                       ▼
 *   ┌───────────────────┐     ┌───────────────────┐    ┌───────────────────┐
 *   │ Hidden Class C0   │     │ Hidden Class C1   │    │ Hidden Class C2   │
 *   │                   │     │                   │    │                   │
 *   │ (empty object)    │────▶│ x: offset 0       │───▶│ x: offset 0       │
 *   │                   │     │                   │    │ y: offset 1       │
 *   └───────────────────┘     └───────────────────┘    └───────────────────┘
 *
 *
 *   WHY THIS MATTERS:
 *   ═════════════════
 *
 *   // GOOD: Same property order = same hidden class = FAST
 *   function PointGood(x, y) {
 *     this.x = x;
 *     this.y = y;
 *   }
 *   var p1 = new PointGood(1, 2);  // Hidden Class: Point{x,y}
 *   var p2 = new PointGood(3, 4);  // Hidden Class: Point{x,y} (SAME!)
 *
 *   // BAD: Different property order = different hidden classes = SLOW
 *   function PointBad(x, y, flag) {
 *     if (flag) {
 *       this.x = x;
 *       this.y = y;
 *     } else {
 *       this.y = y;  // Different order!
 *       this.x = x;
 *     }
 *   }
 *   var p3 = new PointBad(1, 2, true);   // Hidden Class: Point{x,y}
 *   var p4 = new PointBad(3, 4, false);  // Hidden Class: Point{y,x} (DIFFERENT!)
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ INLINE CACHING (IC)                                                          │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   V8 caches property access information at call sites for faster access.
 *
 *   ┌──────────────────────────────────────────────────────────────────────────┐
 *   │ IC STATE           │ DESCRIPTION                       │ PERFORMANCE    │
 *   ├──────────────────────────────────────────────────────────────────────────┤
 *   │ MONOMORPHIC        │ Always same hidden class          │ FASTEST        │
 *   │                    │ "obj.x always on same shape"      │                │
 *   │                    │                                   │                │
 *   │ POLYMORPHIC        │ 2-4 different hidden classes      │ SLOWER         │
 *   │                    │ "obj.x on a few shapes"           │                │
 *   │                    │                                   │                │
 *   │ MEGAMORPHIC        │ Many different hidden classes     │ SLOWEST        │
 *   │                    │ Falls back to hash table lookup   │                │
 *   └──────────────────────────────────────────────────────────────────────────┘
 *
 *
 *   EXAMPLE:
 *   ════════
 *
 *   function getX(obj) {
 *     return obj.x;  // IC at this call site
 *   }
 *
 *   // MONOMORPHIC (FAST)
 *   var a = { x: 1 };
 *   var b = { x: 2 };
 *   var c = { x: 3 };
 *   getX(a); getX(b); getX(c);  // All same shape { x }
 *
 *   // POLYMORPHIC (SLOWER)
 *   var d = { x: 1, y: 2 };     // Different shape { x, y }
 *   getX(d);                     // Now IC has 2 shapes
 *
 *   // MEGAMORPHIC (SLOWEST)
 *   getX({ x: 1, a: 1 });
 *   getX({ x: 1, b: 1 });
 *   getX({ x: 1, c: 1 });
 *   // ... many different shapes
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ OPTIMIZATION BEST PRACTICES                                                  │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   ┌─────────────────────────────────────────────────────────────────────────┐
 *   │                           DO                                            │
 *   ├─────────────────────────────────────────────────────────────────────────┤
 *   │ • Initialize all properties in constructor                             │
 *   │ • Keep property order consistent                                       │
 *   │ • Use consistent types for function arguments                          │
 *   │ • Prefer arrays over array-like objects                                │
 *   │ • Use TypedArrays for numeric data                                     │
 *   │ • Keep functions small (easier to inline)                              │
 *   │ • Use object literals { x: 1, y: 2 } over incremental assignment       │
 *   └─────────────────────────────────────────────────────────────────────────┘
 *
 *   ┌─────────────────────────────────────────────────────────────────────────┐
 *   │                          DON'T                                          │
 *   ├─────────────────────────────────────────────────────────────────────────┤
 *   │ • Don't delete properties (changes hidden class)                       │
 *   │ • Don't add properties after object creation                           │
 *   │ • Don't change variable types                                          │
 *   │ • Don't use eval() or with                                             │
 *   │ • Don't pass arguments object to other functions                       │
 *   │ • Don't use sparse arrays with holes                                   │
 *   │ • Don't mix element types in arrays                                    │
 *   └─────────────────────────────────────────────────────────────────────────┘
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ DEOPTIMIZATION TRIGGERS                                                      │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   ┌─────────────────────┬───────────────────────────────────────────────────┐
 *   │ TRIGGER             │ EXAMPLE                                           │
 *   ├─────────────────────┼───────────────────────────────────────────────────┤
 *   │ Type change         │ var x = 10; x = "string"; // Number → String     │
 *   │ Hidden class change │ obj.newProp = 1; // Adding after creation        │
 *   │ Delete property     │ delete obj.prop; // Changes shape                │
 *   │ Arguments leak      │ function f() { return arguments; }               │
 *   │ eval/with           │ eval("x = 10"); // Prevents optimization         │
 *   │ try-catch (old)     │ try { } catch { } // Better in modern V8        │
 *   └─────────────────────┴───────────────────────────────────────────────────┘
 *
 *
 * RUN: node javaScript-v8-architecture-flow/07-optimization.js
 */

// ═══════════════════════════════════════════════════════════════════════════════
//                         EXECUTABLE EXAMPLES
// ═══════════════════════════════════════════════════════════════════════════════

console.log('═'.repeat(70));
console.log('       PART 7: OPTIMIZATION - HIDDEN CLASSES & IC');
console.log('═'.repeat(70));

// 1. Hidden Class - Same Shape (GOOD)
console.log('\n1. HIDDEN CLASS - SAME SHAPE (GOOD):');
console.log('─'.repeat(40));

function PointGood(x, y) {
  this.x = x;
  this.y = y;
}

var start1 = Date.now();
var pointsGood = [];
for (var i = 0; i < 100000; i++) {
  pointsGood.push(new PointGood(i, i));
}
console.log('   100K points with consistent shape:', Date.now() - start1, 'ms');

// 2. Hidden Class - Different Shape (BAD)
console.log('\n2. HIDDEN CLASS - DIFFERENT SHAPE (BAD):');
console.log('─'.repeat(40));

function PointBad(x, y, flag) {
  if (flag) {
    this.x = x;
    this.y = y;
  } else {
    this.y = y;  // Different order!
    this.x = x;
  }
}

var start2 = Date.now();
var pointsBad = [];
for (var i = 0; i < 100000; i++) {
  pointsBad.push(new PointBad(i, i, i % 2 === 0));
}
console.log('   100K points with varying shape:', Date.now() - start2, 'ms');

// 3. Inline Caching - Monomorphic (FAST)
console.log('\n3. INLINE CACHING - MONOMORPHIC (FAST):');
console.log('─'.repeat(40));

function getXMono(obj) {
  return obj.x;
}

// Same shape objects
var mono1 = { x: 1 };
var mono2 = { x: 2 };
var mono3 = { x: 3 };

// Warm up
for (var i = 0; i < 10000; i++) {
  getXMono(mono1);
  getXMono(mono2);
  getXMono(mono3);
}

var start3 = Date.now();
var sum3 = 0;
for (var i = 0; i < 1000000; i++) {
  sum3 += getXMono(mono1);
  sum3 += getXMono(mono2);
  sum3 += getXMono(mono3);
}
console.log('   Monomorphic IC (same shape):', Date.now() - start3, 'ms');

// 4. Inline Caching - Megamorphic (SLOW)
console.log('\n4. INLINE CACHING - MEGAMORPHIC (SLOW):');
console.log('─'.repeat(40));

function getXMega(obj) {
  return obj.x;
}

// Create many different shapes
var shapes = [];
for (var i = 0; i < 20; i++) {
  var obj = { x: i };
  obj['prop' + i] = i;  // Each has different property
  shapes.push(obj);
}

// Warm up with many shapes (causes megamorphic)
for (var i = 0; i < 1000; i++) {
  for (var j = 0; j < shapes.length; j++) {
    getXMega(shapes[j]);
  }
}

var start4 = Date.now();
var sum4 = 0;
for (var i = 0; i < 100000; i++) {
  for (var j = 0; j < shapes.length; j++) {
    sum4 += getXMega(shapes[j]);
  }
}
console.log('   Megamorphic IC (many shapes):', Date.now() - start4, 'ms');

// 5. Type Stability Demo
console.log('\n5. TYPE STABILITY DEMO:');
console.log('─'.repeat(40));

function addStable(a, b) {
  return a + b;
}

function addUnstable(a, b) {
  return a + b;
}

// Train stable function with only numbers
for (var i = 0; i < 10000; i++) {
  addStable(i, i);
}

// Train unstable function with mixed types
for (var i = 0; i < 10000; i++) {
  if (i % 2) addUnstable(i, i);
  else addUnstable(String(i), String(i));
}

var start5a = Date.now();
for (var i = 0; i < 1000000; i++) {
  addStable(i, 1);
}
console.log('   Type-stable function:', Date.now() - start5a, 'ms');

var start5b = Date.now();
for (var i = 0; i < 1000000; i++) {
  addUnstable(i, 1);
}
console.log('   Type-unstable function:', Date.now() - start5b, 'ms');

// 6. Object Literal vs Incremental Assignment
console.log('\n6. OBJECT LITERAL vs INCREMENTAL:');
console.log('─'.repeat(40));

var start6a = Date.now();
var objsLiteral = [];
for (var i = 0; i < 100000; i++) {
  objsLiteral.push({ x: i, y: i, z: i });
}
console.log('   Object literal:', Date.now() - start6a, 'ms');

var start6b = Date.now();
var objsIncremental = [];
for (var i = 0; i < 100000; i++) {
  var obj = {};
  obj.x = i;
  obj.y = i;
  obj.z = i;
  objsIncremental.push(obj);
}
console.log('   Incremental assignment:', Date.now() - start6b, 'ms');

console.log('\n' + '═'.repeat(70));
console.log('       Read the comments above for complete optimization details!');
console.log('═'.repeat(70) + '\n');
