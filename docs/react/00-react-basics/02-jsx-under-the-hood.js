/**
 * TOPIC: JSX Under the Hood
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ JSX is NOT HTML. It is syntactic sugar that Babel transforms into        ║
 * ║ React.createElement() calls. Each JSX tag becomes a function call       ║
 * ║ that returns a plain JavaScript object (a React element).               ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────────────────────┐
 * │                                                                           │
 * │ JSX is like SHORTHAND NOTES. You write "<div>Hi</div>" (shorthand),      │
 * │ and Babel the translator expands it to the full formal version:           │
 * │ React.createElement('div', null, 'Hi'). Same meaning, different form.   │
 * │                                                                           │
 * └───────────────────────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────────────────────────┐
 * │                                                                           │
 * │   JSX (you write)          Babel transforms         JS output             │
 * │   ─────────────────       ──────────────────       ──────────────         │
 * │   <h1 id="title">         React.createElement(     { type: 'h1',         │
 * │     Hello                   'h1',                    props: {id:'title'}, │
 * │   </h1>                    {id: 'title'},            children: ['Hello']} │
 * │                             'Hello'                                       │
 * │                            )                                              │
 * │                                                                           │
 * │   React 17+ NEW transform: jsx('h1', { id:'title', children:'Hello' })  │
 * │                                                                           │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

// A: Mini createElement - simulating React.createElement
function createElement(type, props, ...children) {
  return {
    type,
    props: { ...props, children: children.length === 1 ? children[0] : children },
  };
}

// B: What Babel does with JSX
// JSX:    <div className="app"><h1>Hello</h1><p>World</p></div>
// Babel output:
const jsxOutput = createElement('div', { className: 'app' },
  createElement('h1', null, 'Hello'),
  createElement('p', null, 'World')
);

console.log('A: createElement("div", {className:"app"}, ...):');
console.log(JSON.stringify(jsxOutput, null, 2));

// C: JSX expressions - curly braces become values
// JSX:    <p>{name} is {age} years old</p>
const name = 'Surya';
const age = 25;
const exprResult = createElement('p', null, name + ' is ' + age + ' years old');
console.log('\nB: JSX expression {name}:', JSON.stringify(exprResult));

// D: Component JSX vs HTML element JSX
// <MyComponent />  --> createElement(MyComponent, null)   (function reference)
// <div />          --> createElement('div', null)          (string)
function MyComponent(props) {
  return createElement('span', null, 'I am a component');
}

const componentEl = createElement(MyComponent, { color: 'red' });
const htmlEl = createElement('div', null);

console.log('\nC: Component type:', typeof componentEl.type);  // function
console.log('   HTML type:', typeof htmlEl.type);               // string

// E: JSX key transforms
console.log('\nD: Common JSX transforms:');
const transforms = [
  ['<div />', "createElement('div', null)"],
  ['<C foo={1} />', "createElement(C, { foo: 1 })"],
  ['<div>{x}</div>', "createElement('div', null, x)"],
  ['<>{a}{b}</>', "createElement(Fragment, null, a, b)"],
  ['<div key="k">', "createElement('div', { key: 'k' })"],
];
transforms.forEach(([jsx, js]) => console.log(`   ${jsx.padEnd(20)} --> ${js}`));

// F: React 17+ automatic JSX transform
console.log('\nE: React 17+ new transform:');
console.log('   Old: React.createElement("div", null, "Hi")');
console.log('   New: _jsx("div", { children: "Hi" })');
console.log('   Benefit: no need to import React in every file');

/**
 * OUTPUT:
 *   A: createElement output with nested structure
 *   B: JSX expression result
 *   C: Component type: function, HTML type: string
 *   D: Common JSX transforms table
 *   E: React 17+ new transform
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │ "JSX is syntactic sugar that Babel compiles to React.createElement()       │
 * │  calls. Each tag becomes a function call returning a plain object with     │
 * │  type, props, and children. HTML tags become strings ('div'), components   │
 * │  become function references. Since React 17, the new JSX transform uses   │
 * │  jsx() from react/jsx-runtime, so you no longer need to import React."    │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/00-react-basics/02-jsx-under-the-hood.js
 */
