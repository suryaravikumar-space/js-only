/**
 * TOPIC: What is React?
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ React is a DECLARATIVE, COMPONENT-BASED JavaScript library for           ║
 * ║ building user interfaces. You describe WHAT you want, React figures      ║
 * ║ out HOW to render it efficiently using a Virtual DOM.                    ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 ┌── STORY TO REMEMBER ──────────────────────────────────────────────┐
 │                                                                   │
 │ React is like a RESTAURANT MENU. You (developer) write the menu   │
 │ (components). The customer (user) picks items. The kitchen (React)│
 │ decides HOW to cook and serve efficiently. You never go into the  │
 │ kitchen - you just declare what the dish should look like.        │
 │                                                                   │
 └───────────────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────────────────────────┐
 * │                                                                           │
 * │   Component Tree:          Virtual DOM:         Real DOM:                 │
 * │                                                                           │
 * │      <App>                { type: 'div',        <div>                     │
 * │      /    \                 children: [           <h1>Hello</h1>          │
 * │   <Header> <Main>           { type: 'h1' },      <p>World</p>            │
 * │              |               { type: 'p' }       </div>                   │
 * │           <Footer>         ]}                                             │
 * │                                                                           │
 * │   YOU WRITE ──────► REACT MANAGES ──────► BROWSER SHOWS                  │
 * │                                                                           │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

// A: React.createElement equivalent - what JSX compiles to
function createElement(type, props, ...children) {
  return { type, props: props || {}, children };
}

const element = createElement('div', { id: 'app' },
  createElement('h1', null, 'Hello React'),
  createElement('p', { className: 'text' }, 'React is a UI library')
);

console.log('A: createElement output:');
console.log(JSON.stringify(element, null, 2));

// B: Declarative vs Imperative
console.log('\nB: Imperative vs Declarative');

// Imperative (vanilla JS way):
console.log('   Imperative: document.createElement("div"), el.textContent = "Hi", parent.appendChild(el)');

// Declarative (React way):
console.log('   Declarative: <div>Hi</div> --> React handles the DOM ops');

// C: Component = function that returns UI description
function Greeting(props) {
  return createElement('h1', null, 'Hello, ' + props.name);
}

console.log('\nC: Component as function:');
console.log(JSON.stringify(Greeting({ name: 'Surya' }), null, 2));

// D: React's core pillars
console.log('\nD: React Core Pillars:');
const pillars = [
  '1. Declarative - describe WHAT, not HOW',
  '2. Component-Based - reusable UI pieces',
  '3. Virtual DOM - efficient diffing & updates',
  '4. Unidirectional Data Flow - data flows parent to child',
  '5. JSX - HTML-like syntax in JavaScript'
];
pillars.forEach(p => console.log('   ' + p));

// E: Simple render simulation
console.log('\nE: Simulating render:');
function render(vnode) {
  if (typeof vnode === 'string') return vnode;
  const children = vnode.children.map(render).join('');
  const attrs = Object.entries(vnode.props).map(([k,v]) => ` ${k}="${v}"`).join('');
  return `<${vnode.type}${attrs}>${children}</${vnode.type}>`;
}

console.log('   ' + render(element));

/**
 * OUTPUT:
 *   A: createElement output:
 *   { "type": "div", "props": { "id": "app" }, "children": [...] }
 *   B: Imperative vs Declarative
 *   C: Component as function: { "type": "h1", "props": {}, "children": ["Hello, Surya"] }
 *   D: React Core Pillars: 1-5
 *   E: Simulating render: <div id="app"><h1>Hello React</h1><p class...>...</p></div>
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │ "React is a declarative, component-based JavaScript library by Meta for    │
 * │  building UIs. It uses a Virtual DOM to efficiently update only the parts  │
 * │  of the real DOM that changed. Components are reusable functions that      │
 * │  take props and return a description of the UI. Data flows one way -      │
 * │  from parent to child via props."                                          │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/00-react-basics/00-what-is-react.js
 */
