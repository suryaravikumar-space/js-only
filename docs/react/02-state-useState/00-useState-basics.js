/**
 * TOPIC: useState Basics - Simulated with Closures
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ useState returns [currentValue, setterFunction]. The setter triggers    ║
 * ║ a RE-RENDER. State is preserved between renders via closures.           ║
 * ║ Use FUNCTIONAL UPDATES when new state depends on previous state.        ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────────────────────┐
 * │                                                                           │
 * │ useState is like a WHITEBOARD in a meeting room. The room (component)    │
 * │ gets cleaned (re-rendered) each time, but the whiteboard (state)         │
 * │ REMEMBERS what was written. The marker (setter) is how you update it.   │
 * │                                                                           │
 * └───────────────────────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────────────────────────┐
 * │                                                                           │
 * │   const [count, setCount] = useState(0);                                  │
 * │                                                                           │
 * │   Render 1:  count = 0   ──► setCount(1) ──► triggers re-render          │
 * │   Render 2:  count = 1   ──► setCount(2) ──► triggers re-render          │
 * │   Render 3:  count = 2                                                    │
 * │                                                                           │
 * │   Closure keeps state alive between renders:                              │
 * │   ┌─────────────────────────────────────┐                                 │
 * │   │ Module scope: stateSlots = [0, 1, 2]│                                │
 * │   │ hookIndex points to current slot    │                                │
 * │   └─────────────────────────────────────┘                                 │
 * │                                                                           │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

// A: Building useState from scratch
const React = (function() {
  let hooks = [];
  let hookIndex = 0;

  function useState(initialValue) {
    const currentIndex = hookIndex;
    if (hooks[currentIndex] === undefined) {
      hooks[currentIndex] = initialValue;
    }
    const setState = (newValue) => {
      if (typeof newValue === 'function') {
        hooks[currentIndex] = newValue(hooks[currentIndex]);  // functional update
      } else {
        hooks[currentIndex] = newValue;
      }
    };
    hookIndex++;
    return [hooks[currentIndex], setState];
  }

  function render(component) {
    hookIndex = 0;  // reset for each render
    const output = component();
    return output;
  }

  return { useState, render };
})();

// B: Using our custom useState
function Counter() {
  const [count, setCount] = React.useState(0);
  const [name, setName] = React.useState('Surya');
  return { count, name, setCount, setName };
}

console.log('A: Initial render:');
let app = React.render(Counter);
console.log('   count:', app.count, '| name:', app.name);

// C: Setting state and re-rendering
console.log('\nB: After setCount(5):');
app.setCount(5);
app = React.render(Counter);
console.log('   count:', app.count, '| name:', app.name);

// D: Functional update (prev => prev + 1)
console.log('\nC: Functional update setCount(prev => prev + 1):');
app.setCount(prev => prev + 1);
app = React.render(Counter);
console.log('   count:', app.count);

app.setCount(prev => prev + 1);
app = React.render(Counter);
console.log('   count:', app.count);

// E: Why functional updates matter
console.log('\nD: Why functional updates matter:');
console.log('   setCount(count + 1)       --> uses STALE closure value');
console.log('   setCount(prev => prev + 1) --> uses LATEST state');
console.log('   Always use functional form when new state depends on old state');

// F: Rules of hooks
console.log('\nE: Rules of Hooks:');
const rules = [
  'Only call hooks at the TOP LEVEL (not in loops/conditions)',
  'Only call hooks from React FUNCTION components or custom hooks',
  'Hook order must be SAME every render (React tracks by index)',
  'Never call hooks conditionally: if(x) useState() is FORBIDDEN',
];
rules.forEach((r, i) => console.log(`   ${i+1}. ${r}`));

/**
 * OUTPUT:
 *   A: count: 0 | name: Surya
 *   B: count: 5 | name: Surya
 *   C: count: 6, then 7
 *   D: Why functional updates matter
 *   E: Rules of hooks 1-4
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │ "useState returns a [value, setter] pair. State persists across renders    │
 * │  via closures - React stores state in an internal array indexed by hook   │
 * │  call order. That's why hooks can't be called conditionally. Use          │
 * │  functional updates (prev => prev + 1) when new state depends on old     │
 * │  state to avoid stale closure issues."                                    │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/02-state-useState/00-useState-basics.js
 */
