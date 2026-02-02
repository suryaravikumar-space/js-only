/**
 * TOPIC: Props Basics
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ Props are READ-ONLY. They flow ONE WAY: parent -> child.                ║
 * ║ A component must NEVER modify its own props.                            ║
 * ║ Think of props as function arguments - you use them, not change them.   ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────────────────────┐
 * │                                                                           │
 * │ Props are like a LETTER delivered to your door. You can READ it and       │
 * │ act on it, but you can't change what's written. If you need to send     │
 * │ a message back, you call a CALLBACK function (like a return letter).    │
 * │                                                                           │
 * └───────────────────────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────────────────────────┐
 * │                                                                           │
 * │   <Parent>                                                                │
 * │     │  props = { name: "Jo", age: 25, onClick: fn }                      │
 * │     ▼                                                                     │
 * │   <Child name="Jo" age={25} onClick={fn} />                              │
 * │     │                                                                     │
 * │     ├── props.name     --> "Jo"    (read only)                           │
 * │     ├── props.age      --> 25      (read only)                           │
 * │     └── props.onClick  --> fn()    (callback to parent)                  │
 * │                                                                           │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

// A: Basic props passing
function UserCard(props) {
  return `[UserCard: ${props.name}, age ${props.age}]`;
}

console.log('A: Basic props:');
console.log('  ', UserCard({ name: 'Surya', age: 25 }));

// B: Destructuring props
function UserCardDestructured({ name, age, role = 'User' }) {
  return `[${name}, ${age}, role: ${role}]`;
}

console.log('\nB: Destructured with default:');
console.log('  ', UserCardDestructured({ name: 'Surya', age: 25 }));
console.log('  ', UserCardDestructured({ name: 'Admin', age: 30, role: 'Admin' }));

// C: Props are read-only
console.log('\nC: Props are READ-ONLY:');
function BrokenComponent(props) {
  try {
    Object.freeze(props);  // React freezes props in dev mode
    props.name = 'hacked';
  } catch (e) {
    return 'Cannot modify props: ' + e.message;
  }
}
console.log('  ', BrokenComponent({ name: 'Surya' }));

// D: Passing different types as props
console.log('\nD: Props can be any type:');
const propTypes = {
  string:   'Hello',
  number:   42,
  boolean:  true,
  array:    [1, 2, 3],
  object:   { key: 'value' },
  function: function onClick() { return 'clicked'; },
  jsx:      { type: 'span', children: ['child element'] },
};
Object.entries(propTypes).forEach(([type, val]) => {
  console.log(`   ${type.padEnd(10)}: ${typeof val === 'function' ? 'fn()' : JSON.stringify(val)}`);
});

// E: Callback props (child -> parent communication)
console.log('\nE: Callback props for child -> parent:');
function Parent() {
  const handleClick = (msg) => console.log('   Parent received:', msg);
  // In React: <Child onClick={handleClick} />
  Child({ onClick: handleClick });
}
function Child(props) {
  props.onClick('Hello from child!');
}
Parent();

// F: Spread props
console.log('\nF: Spread props pattern:');
const userProps = { name: 'Surya', age: 25, role: 'Dev' };
// In React: <UserCard {...userProps} />
console.log('  ', UserCardDestructured({ ...userProps }));

/**
 * OUTPUT:
 *   A: [UserCard: Surya, age 25]
 *   B: Destructured with defaults
 *   C: Cannot modify props (frozen)
 *   D: Props types table
 *   E: Parent received: Hello from child!
 *   F: Spread props
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │ "Props are read-only data passed from parent to child. They can be any    │
 * │  JS type - strings, numbers, objects, functions, even other components.   │
 * │  Props are immutable within the child. To communicate back to the         │
 * │  parent, the parent passes callback functions as props. You can set       │
 * │  defaults via destructuring defaults or defaultProps."                     │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/01-components-props/01-props-basics.js
 */
