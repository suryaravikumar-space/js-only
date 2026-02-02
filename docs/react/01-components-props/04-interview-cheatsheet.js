/**
 * TOPIC: Components & Props - Interview Cheatsheet
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ Components are FUNCTIONS. Props are ARGUMENTS. Children are CONTENT.    ║
 * ║ Data flows DOWN. Events flow UP. Never mutate props.                    ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────────────────────┐
 * │                                                                           │
 * │ Components are LEGO bricks. Props are the STUDS that connect them.       │
 * │ Children fill the INSIDE. You build complex structures by snapping       │
 * │ simple pieces together. Each brick does one thing well.                  │
 * │                                                                           │
 * └───────────────────────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────────────────────────┐
 * │                                                                           │
 * │   Parent ──props──► Child ──props──► Grandchild                           │
 * │     ▲                  │                                                  │
 * │     └──callback fn─────┘  (child communicates UP via callbacks)           │
 * │                                                                           │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

// Q1: Functional vs Class components?
console.log('Q1: Functional vs Class components?');
console.log('A1: Functional = plain function + hooks. Class = extends React.Component.');
console.log('    Functional is modern standard. Both can have state & lifecycle.\n');

// Q2: What are props?
console.log('Q2: What are props?');
console.log('A2: Read-only data passed parent -> child. Like function arguments.');
console.log('    Can be any type: string, number, object, function, JSX.\n');

// Q3: Can you modify props?
console.log('Q3: Can you modify props?');
console.log('A3: NO. Props are immutable. React freezes them in dev mode.');
function demo(props) {
  const frozen = Object.freeze({ name: 'test' });
  try { frozen.name = 'hacked'; } catch(e) { console.log('    Proof:', e.message); }
}
demo({});
console.log('');

// Q4: What is props.children?
console.log('Q4: What is props.children?');
console.log('A4: Content between <Component>HERE</Component> tags.');
console.log('    Enables composition pattern - wrappers that accept any content.\n');

// Q5: Composition vs Inheritance?
console.log('Q5: Why composition over inheritance?');
console.log('A5: React components compose - wrap and combine instead of extend.');
console.log('    No class hierarchies. Use children/render props for flexibility.\n');

// Q6: How does child communicate with parent?
console.log('Q6: Child -> Parent communication?');
console.log('A6: Parent passes callback function as prop. Child calls it.');
function Parent() {
  const onMessage = (msg) => console.log('    Parent got:', msg);
  Child({ onMessage });
}
function Child(props) { props.onMessage('hello from child'); }
Parent();
console.log('');

// Q7: Default props
console.log('Q7: How to set default props?');
console.log('A7: Destructuring defaults: function C({ name = "Guest" }) {}');
console.log('    Or: C.defaultProps = { name: "Guest" } (legacy)\n');

// Q8: Key prop
console.log('Q8: What is the key prop?');
console.log('A8: Special prop for lists that helps React identify items during');
console.log('    reconciliation. Must be unique among siblings. Never use index.\n');

// Q9: Render props
console.log('Q9: What is the render props pattern?');
console.log('A9: Passing a function as prop (or children) that returns JSX.');
console.log('    Enables sharing logic between components without HOCs.\n');

// Q10: Pure component
console.log('Q10: What is a pure component?');
console.log('A10: A component that renders same output for same props.');
console.log('     React.memo() wraps functional components for shallow comparison.');

/**
 * OUTPUT:
 *   Q1-Q10 with answers and demonstrations
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │ Key points interviewers expect:                                            │
 * │ 1. Props are immutable, flow parent -> child                               │
 * │ 2. Children enable composition (React's preferred pattern)                 │
 * │ 3. Callbacks enable child -> parent communication                          │
 * │ 4. Functional components + hooks are the modern standard                   │
 * │ 5. React.memo prevents unnecessary re-renders                              │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/01-components-props/04-interview-cheatsheet.js
 */
