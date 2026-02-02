/**
 * TOPIC: The Children Prop & Composition
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ props.children is whatever you put BETWEEN opening and closing tags.     ║
 * ║ It enables COMPOSITION - building complex UI by nesting components.     ║
 * ║ React favors COMPOSITION over INHERITANCE.                              ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────────────────────┐
 * │                                                                           │
 * │ props.children is like a PICTURE FRAME. The frame (wrapper component)    │
 * │ doesn't know what picture (children) will go inside. It just provides    │
 * │ the border. You can put ANY picture in ANY frame.                        │
 * │                                                                           │
 * └───────────────────────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────────────────────────┐
 * │                                                                           │
 * │   <Card>                     Card receives:                               │
 * │     <h1>Title</h1>          props.children = [<h1>, <p>]                 │
 * │     <p>Content</p>                                                        │
 * │   </Card>                   Card renders:                                 │
 * │                              <div class="card">                          │
 * │                                {props.children}  <-- inserted here       │
 * │                              </div>                                       │
 * │                                                                           │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

// A: Basic children pattern
function Card(props) {
  return {
    type: 'div',
    props: { className: 'card' },
    children: Array.isArray(props.children) ? props.children : [props.children]
  };
}

const card = Card({
  children: [
    { type: 'h1', children: ['Title'] },
    { type: 'p', children: ['Content'] }
  ]
});

console.log('A: Card with children:');
console.log(JSON.stringify(card, null, 2));

// B: Composition over inheritance
console.log('\nB: Composition over Inheritance:');
function Layout(props) {
  return { type: 'div', className: 'layout', header: props.header, body: props.children };
}

function Page() {
  return Layout({
    header: { type: 'nav', children: ['Navigation'] },
    children: { type: 'main', children: ['Page content'] }
  });
}
console.log('   Layout wraps any content:', JSON.stringify(Page()));

// C: Slot pattern (named children)
console.log('\nC: Slot pattern (named slots via props):');
// React: <Modal header={<h1>Title</h1>} footer={<Button />}>Body</Modal>
function Modal(props) {
  return {
    type: 'div',
    className: 'modal',
    slots: { header: props.header, body: props.children, footer: props.footer }
  };
}

const modal = Modal({
  header: 'My Title',
  children: 'Modal body content',
  footer: 'OK | Cancel'
});
console.log('   Modal slots:', JSON.stringify(modal.slots));

// D: Render props pattern (function as children)
console.log('\nD: Render props (function as children):');
function DataProvider(props) {
  const data = { user: 'Surya', loggedIn: true };  // simulated fetch
  return props.children(data);  // call children as a function
}

const result = DataProvider({
  children: (data) => `Logged in as: ${data.user}`
});
console.log('  ', result);

// E: Children can be anything
console.log('\nE: Children types:');
const childTypes = [
  ['String',    '"Hello"'],
  ['Number',    '{42}'],
  ['Element',   '<Component />'],
  ['Array',     '{items.map(i => <Item />)}'],
  ['Function',  '{(data) => <View data={data} />}'],
  ['null',      '{condition && <Component />}'],
];
childTypes.forEach(([t, ex]) => console.log(`   ${t.padEnd(12)}: ${ex}`));

/**
 * OUTPUT:
 *   A: Card with nested children objects
 *   B: Layout composition
 *   C: Modal slot pattern
 *   D: Render props: Logged in as: Surya
 *   E: Children types table
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │ "props.children contains whatever is placed between a component's         │
 * │  opening and closing tags. It enables composition - wrapper components    │
 * │  like layouts, modals, and cards that don't know their content ahead of   │
 * │  time. React favors composition over inheritance. For multiple slots,     │
 * │  you can pass named props (header, footer). The render props pattern      │
 * │  passes a function as children for dynamic content."                      │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/01-components-props/02-children-prop.js
 */
