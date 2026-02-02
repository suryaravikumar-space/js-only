/**
 * TOPIC: Functional Components
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ A React functional component is a PURE FUNCTION: it takes PROPS as      ║
 * ║ input and returns JSX (a UI description) as output. Same props =        ║
 * ║ same output. No side effects during render.                             ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────────────────────┐
 * │                                                                           │
 * │ A component is like a STAMP. You give it an INK COLOR (props), and       │
 * │ it always stamps the SAME SHAPE. Different ink = different output,       │
 * │ but the stamp itself never changes.                                      │
 * │                                                                           │
 * └───────────────────────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────────────────────────┐
 * │                                                                           │
 * │   Props (input)     Component (function)      UI (output)                 │
 * │   ┌───────────┐    ┌───────────────────┐    ┌──────────────┐             │
 * │   │ name:"Jo" │───►│ function Greet(p) │───►│ {type:'h1',  │             │
 * │   │ age: 25   │    │   return <h1>...  │    │  children:   │             │
 * │   └───────────┘    └───────────────────┘    │  'Hello Jo'} │             │
 * │                                              └──────────────┘             │
 * │                                                                           │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

// Simulating React components as pure functions returning objects

// A: Basic functional component
function Greeting(props) {
  return { type: 'h1', props: {}, children: ['Hello, ' + props.name + '!'] };
}

console.log('A: Greeting({ name: "Surya" }):');
console.log('  ', JSON.stringify(Greeting({ name: 'Surya' })));

// B: Pure function = same input, same output
console.log('\nB: Pure function test:');
const result1 = Greeting({ name: 'Surya' });
const result2 = Greeting({ name: 'Surya' });
console.log('   Same input, same output:', JSON.stringify(result1) === JSON.stringify(result2));

// C: Composing components
function Button(props) {
  return { type: 'button', props: { onClick: props.onClick }, children: [props.label] };
}

function Card(props) {
  return {
    type: 'div',
    props: { className: 'card' },
    children: [
      Greeting({ name: props.name }),
      Button({ label: 'Click me', onClick: 'handleClick' }),
    ]
  };
}

console.log('\nC: Composed Card component:');
console.log(JSON.stringify(Card({ name: 'Surya' }), null, 2));

// D: Class vs Functional (historical context)
console.log('\nD: Class vs Functional components:');
console.log('   Class:      class App extends React.Component { render() { return <h1>Hi</h1> } }');
console.log('   Functional: function App() { return <h1>Hi</h1> }');
console.log('   Modern React: Functional + Hooks is the standard');

// E: Component naming convention
console.log('\nE: Rules for components:');
const rules = [
  'Must start with UPPERCASE (MyComponent, not myComponent)',
  'Must return JSX (or null)',
  'Should be pure during render - no side effects',
  'Receive props as first argument',
  'Can use hooks (useState, useEffect, etc.)',
];
rules.forEach((r, i) => console.log(`   ${i+1}. ${r}`));

/**
 * OUTPUT:
 *   A: Greeting output object
 *   B: Pure function test: true
 *   C: Composed Card with nested Greeting and Button
 *   D: Class vs Functional syntax
 *   E: Component rules 1-5
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │ "A functional component is a JavaScript function that accepts props and    │
 * │  returns JSX. It should be pure - same props, same output. Since React    │
 * │  16.8 with Hooks, functional components can handle state, effects, and    │
 * │  context, making class components largely unnecessary. Components must    │
 * │  start with an uppercase letter so React can distinguish them from HTML." │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/01-components-props/00-functional-components.js
 */
