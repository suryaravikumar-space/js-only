/**
 * DESIGN PATTERNS: 00 - What Are Design Patterns?
 *
 * ONE CONCEPT: Understanding what design patterns are and why they exist
 */


// ═══════════════════════════════════════════════════════════════════════════
// WHAT IS A DESIGN PATTERN?
// ═══════════════════════════════════════════════════════════════════════════

/**
 * A Design Pattern is a REUSABLE SOLUTION to a common problem.
 *
 * It's NOT code you copy-paste.
 * It's a TEMPLATE for solving a type of problem.
 *
 *
 * ANALOGY:
 * ────────
 *
 *   Problem: "I need to store water"
 *
 *   Pattern: "Use a container"
 *
 *   Implementations:
 *     - Glass (small, fragile)
 *     - Bottle (portable)
 *     - Tank (large scale)
 *
 *   The PATTERN is "container" - the specific implementation varies.
 *
 */


// ═══════════════════════════════════════════════════════════════════════════
// THREE CATEGORIES
// ═══════════════════════════════════════════════════════════════════════════

/**
 *
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │                    DESIGN PATTERN CATEGORIES                        │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │   1. CREATIONAL                                                     │
 *   │      └── How objects are CREATED                                    │
 *   │          • Singleton                                                │
 *   │          • Factory                                                  │
 *   │          • Builder                                                  │
 *   │          • Prototype                                                │
 *   │                                                                     │
 *   │   2. STRUCTURAL                                                     │
 *   │      └── How objects are COMPOSED                                   │
 *   │          • Module                                                   │
 *   │          • Decorator                                                │
 *   │          • Facade                                                   │
 *   │          • Adapter                                                  │
 *   │                                                                     │
 *   │   3. BEHAVIORAL                                                     │
 *   │      └── How objects COMMUNICATE                                    │
 *   │          • Observer                                                 │
 *   │          • Pub/Sub                                                  │
 *   │          • Mediator                                                 │
 *   │          • Strategy                                                 │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */


// ═══════════════════════════════════════════════════════════════════════════
// WHY USE DESIGN PATTERNS?
// ═══════════════════════════════════════════════════════════════════════════

/**
 *
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  BENEFITS                                                          │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  1. PROVEN SOLUTIONS                                                │
 *   │     Pattern has been tested by thousands of developers              │
 *   │                                                                     │
 *   │  2. COMMON VOCABULARY                                               │
 *   │     Say "Singleton" - everyone knows what you mean                  │
 *   │                                                                     │
 *   │  3. MAINTAINABLE CODE                                               │
 *   │     Patterns lead to organized, predictable structure               │
 *   │                                                                     │
 *   │  4. INTERVIEW LANGUAGE                                              │
 *   │     Interviewers expect you to know these terms                     │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */


// ═══════════════════════════════════════════════════════════════════════════
// PATTERNS WE'LL COVER
// ═══════════════════════════════════════════════════════════════════════════

/**
 *
 *   File 01: Singleton      - Only one instance ever
 *   File 02: Factory        - Create objects without 'new'
 *   File 03: Module         - Encapsulation and privacy
 *   File 04: Observer       - React to changes
 *   File 05: Pub/Sub        - Loose coupling events
 *   File 06: Decorator      - Add behavior dynamically
 *   File 07: Strategy       - Swap algorithms
 *   File 08: Facade         - Simple interface to complex system
 *   File 09: Mediator       - Central communication hub
 *   File 10: Prototype      - Clone objects
 *
 */


// ═══════════════════════════════════════════════════════════════════════════
// 🎤 INTERVIEW: What to Say (1-2 minutes)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * QUESTION: "What are design patterns?"
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * YOUR ANSWER:
 *
 * "Design patterns are reusable solutions to common software problems.
 * They're not actual code - they're templates or blueprints that describe
 * HOW to solve a particular type of problem.
 *
 * They fall into three categories:
 *
 * Creational patterns deal with object creation - like Singleton which
 * ensures only one instance exists, or Factory which creates objects
 * without exposing creation logic.
 *
 * Structural patterns deal with composition - like Module pattern for
 * encapsulation, or Decorator for adding behavior to objects.
 *
 * Behavioral patterns deal with communication - like Observer where
 * objects subscribe to events, or Strategy for swapping algorithms.
 *
 * The main benefit is that they provide a common vocabulary. When I
 * say 'let's use the Observer pattern here', every developer immediately
 * understands the structure and intent. They also lead to more
 * maintainable code because the solutions are proven and well-understood."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * KEY POINTS TO MENTION:
 * ✓ Reusable solutions, not copy-paste code
 * ✓ Three categories: Creational, Structural, Behavioral
 * ✓ Common vocabulary among developers
 * ✓ Name 2-3 specific patterns with their purpose
 *
 */


console.log('Design Patterns Overview');
console.log('See comments for detailed explanation');
console.log('');
console.log('Categories:');
console.log('  1. Creational - How objects are created');
console.log('  2. Structural - How objects are composed');
console.log('  3. Behavioral - How objects communicate');


// RUN: node docs/25-design-patterns/00-what-are-design-patterns.js
