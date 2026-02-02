/**
 * TOPIC: Virtual DOM - How It Works
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ The Virtual DOM is a lightweight JS OBJECT representation of the real    ║
 * ║ DOM. React creates a new VDOM on every render, DIFFS it with the old    ║
 * ║ one, and applies only the MINIMAL changes to the real DOM.              ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────────────────────┐
 * │                                                                           │
 * │ Think of VDOM as a BLUEPRINT. Before renovating a house (real DOM),       │
 * │ the architect (React) compares the OLD blueprint with the NEW one.        │
 * │ Only the DIFFERENCES get built - you don't demolish the whole house.     │
 * │                                                                           │
 * └───────────────────────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────────────────────────┐
 * │                                                                           │
 * │   Old VDOM          New VDOM           Diff Result                        │
 * │   ┌──────┐         ┌──────┐          ┌──────────────┐                    │
 * │   │ div  │         │ div  │          │ Update <p>   │                    │
 * │   │ ├─h1 │   vs    │ ├─h1 │   ───►  │ text content │                    │
 * │   │ └─p  │         │ └─p* │          └──────┬───────┘                    │
 * │   │ "Hi" │         │"Bye" │                 │                            │
 * │   └──────┘         └──────┘                 ▼ Patch Real DOM             │
 * │                                                                           │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

// A: Creating virtual nodes (what React does internally)
function h(type, props, ...children) {
  return { type, props: props || {}, children: children.flat() };
}

const oldTree = h('div', null,
  h('h1', null, 'Hello'),
  h('p', { id: 'text' }, 'Old content')
);

const newTree = h('div', null,
  h('h1', null, 'Hello'),
  h('p', { id: 'text' }, 'New content')
);

console.log('A: Old VDOM:', JSON.stringify(oldTree));
console.log('   New VDOM:', JSON.stringify(newTree));

// B: Simple diff algorithm
function diff(oldNode, newNode, path = 'root') {
  const patches = [];
  if (typeof oldNode === 'string' && typeof newNode === 'string') {
    if (oldNode !== newNode) patches.push({ path, type: 'TEXT', old: oldNode, new: newNode });
  } else if (oldNode.type !== newNode.type) {
    patches.push({ path, type: 'REPLACE', old: oldNode.type, new: newNode.type });
  } else {
    // Diff children
    const len = Math.max(oldNode.children.length, newNode.children.length);
    for (let i = 0; i < len; i++) {
      if (!oldNode.children[i]) patches.push({ path: `${path}/${i}`, type: 'ADD' });
      else if (!newNode.children[i]) patches.push({ path: `${path}/${i}`, type: 'REMOVE' });
      else patches.push(...diff(oldNode.children[i], newNode.children[i], `${path}/${newNode.type || 'text'}[${i}]`));
    }
  }
  return patches;
}

console.log('\nB: Diff result:');
const patches = diff(oldTree, newTree);
patches.forEach(p => console.log('   ', p));

// C: Reconciliation - apply only the diffs
console.log('\nC: Reconciliation - only 1 patch needed (text change)');
console.log('   Patches to apply:', patches.length);
console.log('   Real DOM operations saved:', oldTree.children.length * 2 - patches.length);

// D: Fiber Architecture overview
console.log('\nD: Fiber Architecture (React 16+):');
const fiberConcepts = [
  'Unit of work - each node becomes a "fiber"',
  'Work can be PAUSED, ABORTED, or RESTARTED',
  'Priority-based rendering (urgent vs non-urgent)',
  'Enables concurrent features like Suspense & Transitions',
];
fiberConcepts.forEach((c, i) => console.log(`   ${i+1}. ${c}`));

// E: Why not just replace everything?
console.log('\nE: Why VDOM over full replacement?');
console.log('   DOM operation:    ~10ms (expensive - reflow, repaint)');
console.log('   JS object diff:   ~0.1ms (cheap - just comparing objects)');
console.log('   Strategy: diff in JS, then make MINIMAL DOM changes');

/**
 * OUTPUT:
 *   A: Old VDOM / New VDOM JSON
 *   B: Diff result: [{ path, type: 'TEXT', old: 'Old content', new: 'New content' }]
 *   C: Reconciliation - only 1 patch needed
 *   D: Fiber Architecture: 1-4
 *   E: Why VDOM over full replacement
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │ "The Virtual DOM is a lightweight JS object tree that mirrors the real     │
 * │  DOM. On state change, React creates a new VDOM, diffs it against the     │
 * │  previous one using a heuristic O(n) algorithm, and batches only the      │
 * │  minimal updates to the real DOM. Since React 16, the Fiber architecture  │
 * │  allows this work to be split into chunks and prioritized, enabling       │
 * │  features like concurrent rendering and Suspense."                        │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/00-react-basics/01-virtual-dom.js
 */
