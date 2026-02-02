/**
 * TOPIC: React Basics - Interview Cheatsheet
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ React interviews test: Virtual DOM understanding, JSX mechanics,        ║
 * ║ component thinking, reconciliation, and WHY React exists.               ║
 * ║ Know the "under the hood" - not just the API.                           ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────────────────────┐
 * │                                                                           │
 * │ Think of React interviews like a DRIVING TEST. They don't just ask       │
 * │ "can you drive?" They ask "what happens when you turn the key?"          │
 * │ Know the ENGINE (VDOM, reconciliation) not just the STEERING (JSX).     │
 * │                                                                           │
 * └───────────────────────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────────────────────────┐
 * │                                                                           │
 * │   Interview Topic Map:                                                    │
 * │                                                                           │
 * │   BASICS ──► VDOM ──► JSX ──► Components ──► Props ──► State             │
 * │     │                                                    │                │
 * │     └──────── Hooks ◄── Lifecycle ◄── Effects ◄──────────┘                │
 * │                                                                           │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

// Q1: What is React?
console.log('Q1: What is React?');
console.log('A1: A declarative, component-based JS library for building UIs.');
console.log('    Uses Virtual DOM for efficient updates. Created by Meta.\n');

// Q2: What is the Virtual DOM?
console.log('Q2: What is the Virtual DOM?');
console.log('A2: A lightweight JS object tree representing the UI.');
console.log('    React diffs old vs new VDOM and patches only changes to real DOM.\n');

// Q3: How does JSX work?
console.log('Q3: How does JSX work?');
console.log('A3: Babel compiles JSX to React.createElement() calls.');
console.log('    <div id="x">Hi</div> --> createElement("div", {id:"x"}, "Hi")\n');

// Q4: Demonstrate createElement
console.log('Q4: Show createElement output:');
function createElement(type, props, ...children) {
  return { type, props: props || {}, children };
}
const el = createElement('div', { id: 'app' }, createElement('h1', null, 'Hello'));
console.log('   ', JSON.stringify(el));
console.log('');

// Q5: React vs Angular
console.log('Q5: React vs Angular?');
console.log('A5: React = library (view only, flexible, JSX, one-way data flow)');
console.log('    Angular = framework (full solution, TypeScript, two-way binding)\n');

// Q6: What is reconciliation?
console.log('Q6: What is reconciliation?');
console.log('A6: React\'s algorithm to diff two VDOM trees in O(n) time.');
console.log('    Two heuristics: different types = full replace, keys identify items.\n');

// Q7: What is Fiber?
console.log('Q7: What is Fiber?');
console.log('A7: React 16+ architecture that splits rendering into units of work.');
console.log('    Work can be paused/resumed, enabling concurrent features.\n');

// Q8: Why keys matter
console.log('Q8: Why do lists need keys?');
console.log('A8: Keys help React identify which items changed/added/removed.');
console.log('    Without keys, React re-renders entire list. Never use index as key');
console.log('    if the list can reorder.\n');

// Q9: Declarative vs Imperative
console.log('Q9: Declarative vs Imperative?');
console.log('A9: Imperative = HOW (step by step DOM manipulation)');
console.log('    Declarative = WHAT (describe desired UI, React handles the rest)\n');

// Q10: Unidirectional data flow
console.log('Q10: What is unidirectional data flow?');
console.log('A10: Data flows parent -> child via props. Child communicates back');
console.log('     via callback functions passed as props. Predictable & debuggable.');

/**
 * OUTPUT:
 *   Q1-Q10: React basics interview questions with answers
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │ Key themes interviewers look for:                                          │
 * │ 1. You understand VDOM is an optimization, not a feature                   │
 * │ 2. You know JSX compiles to createElement calls                            │
 * │ 3. You can explain reconciliation and why keys matter                      │
 * │ 4. You understand one-way data flow and its benefits                       │
 * │ 5. You know the difference between library vs framework                    │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/00-react-basics/04-interview-cheatsheet.js
 */
