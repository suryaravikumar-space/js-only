/**
 * TOPIC: React vs Angular vs Vue
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ React is a LIBRARY (UI only), Angular is a FRAMEWORK (full solution),   ║
 * ║ Vue is a PROGRESSIVE FRAMEWORK (adopt incrementally). Each has a        ║
 * ║ different philosophy on how to build web applications.                   ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────────────────────┐
 * │                                                                           │
 * │ React = LEGO SET (pick your own pieces to build anything)                 │
 * │ Angular = IKEA FURNITURE (complete kit, follow the instructions)          │
 * │ Vue = COOKING KIT (basics included, add your own spices)                 │
 * │                                                                           │
 * └───────────────────────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────────────────────────┐
 * │                                                                           │
 * │   Feature         React        Angular        Vue                         │
 * │   ─────────────   ─────────    ──────────     ─────────                   │
 * │   Type            Library      Framework      Framework                   │
 * │   Language         JS/JSX      TypeScript     JS/Template                 │
 * │   DOM             Virtual      Real (Ivy)     Virtual                     │
 * │   Data Flow       One-way      Two-way        Both                        │
 * │   Bundle Size     ~40KB        ~140KB         ~30KB                       │
 * │   Learning        Medium       Steep          Easy                        │
 * │   Company         Meta         Google         Independent                 │
 * │                                                                           │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

// A: Philosophy comparison
console.log('A: Philosophy Comparison');
const comparison = {
  React:   { type: 'Library',    opinion: 'Unopinionated', binding: 'One-way' },
  Angular: { type: 'Framework',  opinion: 'Opinionated',   binding: 'Two-way' },
  Vue:     { type: 'Progressive', opinion: 'Flexible',      binding: 'Both' },
};
Object.entries(comparison).forEach(([name, info]) => {
  console.log(`   ${name.padEnd(8)}: ${info.type.padEnd(12)} | ${info.opinion.padEnd(14)} | ${info.binding}`);
});

// B: Component syntax comparison (shown as strings)
console.log('\nB: Component Syntax:');
console.log('   React:   function App() { return <h1>Hello</h1> }');
console.log('   Angular: @Component({ template: "<h1>Hello</h1>" }) class App {}');
console.log('   Vue:     <template><h1>Hello</h1></template> <script>export default {}</script>');

// C: State management ecosystem
console.log('\nC: State Management:');
const stateTools = [
  ['React',   'useState, useReducer, Redux, Zustand, Jotai, Context API'],
  ['Angular', 'Services + RxJS, NgRx, Signals (v16+)'],
  ['Vue',     'ref/reactive, Vuex, Pinia'],
];
stateTools.forEach(([fw, tools]) => console.log(`   ${fw.padEnd(8)}: ${tools}`));

// D: When to choose what
console.log('\nD: When to Choose:');
const choices = [
  ['React',   'Large ecosystem, flexibility needed, mobile (React Native)'],
  ['Angular', 'Enterprise apps, team conventions, full solution out-of-box'],
  ['Vue',     'Quick prototyping, gentle learning curve, incrementally adoptable'],
];
choices.forEach(([fw, reason]) => console.log(`   ${fw.padEnd(8)}: ${reason}`));

// E: Bundle size simulation
console.log('\nE: Approximate Bundle Sizes (minified + gzipped):');
const sizes = [
  { name: 'React + ReactDOM', kb: 42 },
  { name: 'Angular',          kb: 143 },
  { name: 'Vue 3',            kb: 33 },
  { name: 'Svelte',           kb: 2 },
  { name: 'Preact',           kb: 4 },
];
sizes.forEach(s => {
  const bar = '='.repeat(Math.round(s.kb / 3));
  console.log(`   ${s.name.padEnd(18)} ${String(s.kb).padStart(3)}KB  ${bar}`);
});

/**
 * OUTPUT:
 *   A: Philosophy comparison table
 *   B: Component syntax examples
 *   C: State management tools per framework
 *   D: When to choose each
 *   E: Bundle sizes with bar chart
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │ "React is a UI library - it handles only the view layer, giving you       │
 * │  freedom to choose routing, state management, etc. Angular is a full      │
 * │  opinionated framework with built-in DI, routing, forms, and HTTP.        │
 * │  Vue is a progressive framework - easy to start small and scale up.       │
 * │  React uses one-way data flow and JSX, Angular uses two-way binding      │
 * │  and TypeScript, Vue supports both with its template syntax."             │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/00-react-basics/03-react-vs-alternatives.js
 */
