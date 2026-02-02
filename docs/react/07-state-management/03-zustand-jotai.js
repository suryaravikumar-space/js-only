/**
 * TOPIC: Modern State — Zustand (Simple Store) & Jotai (Atomic)
 *
 * ╔════════════════════════════════════════════════════════╗
 * ║           THE GOLDEN RULE                             ║
 * ║  Zustand = one store, direct access, no boilerplate.  ║
 * ║  Jotai = atoms (tiny independent state pieces) that   ║
 * ║  components subscribe to individually.                ║
 * ╚════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────┐
 * │ Zustand = a single whiteboard anyone can read/write.  │
 * │ Jotai = sticky notes — each component picks only the  │
 * │ notes it cares about, ignoring the rest.              │
 * └───────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────┐
 * │  ZUSTAND:                 JOTAI:                      │
 * │  ┌─────────────┐         atom(0) ← CompA             │
 * │  │ { count: 0, │         atom('') ← CompB            │
 * │  │   inc(),     │         derived = atom(get =>       │
 * │  │   name: '' } │           get(countAtom) * 2)       │
 * │  └─────────────┘                                     │
 * │  CompA: useStore(s=>s.count)                          │
 * │  CompB: useStore(s=>s.name)                           │
 * └───────────────────────────────────────────────────────┘
 */

// --- Zustand-like store (simplified) ---
console.log('A: ZUSTAND pattern — simple store with selectors:\n');

function createZustandStore(initializer) {
  let state;
  const listeners = new Set();

  const set = (partial) => {
    state = { ...state, ...(typeof partial === 'function' ? partial(state) : partial) };
    listeners.forEach(fn => fn(state));
  };
  const get = () => state;

  state = initializer(set, get);

  function useStore(selector) {
    return selector ? selector(state) : state;
  }
  useStore.subscribe = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };
  useStore.getState = get;

  return useStore;
}

const useCountStore = createZustandStore((set, get) => ({
  count: 0,
  name: 'Surya',
  inc: () => set({ count: get().count + 1 }),
  setName: (n) => set({ name: n }),
}));

console.log(`B: count = ${useCountStore(s => s.count)}`);
console.log(`C: name = ${useCountStore(s => s.name)}`);

useCountStore.subscribe((s) => console.log(`  [zustand] state:`, JSON.stringify(s)));
useCountStore.getState().inc();
useCountStore.getState().inc();
useCountStore.getState().setName('Raj');

// --- Jotai-like atoms (simplified) ---
console.log('\nD: JOTAI pattern — atomic state:\n');

function atom(initialValue) {
  let _value = initialValue;
  const _subs = new Set();
  return {
    get: () => _value,
    set: (v) => {
      _value = typeof v === 'function' ? v(_value) : v;
      _subs.forEach(fn => fn(_value));
    },
    subscribe: (fn) => { _subs.add(fn); return () => _subs.delete(fn); }
  };
}

// Derived atom (read-only, depends on other atoms)
function derivedAtom(deps, compute) {
  return { get: () => compute(...deps.map(d => d.get())) };
}

const countAtom = atom(0);
const nameAtom = atom('Surya');
const doubleAtom = derivedAtom([countAtom], (c) => c * 2);

console.log(`E: countAtom = ${countAtom.get()}`);
console.log(`F: doubleAtom = ${doubleAtom.get()}`);

countAtom.subscribe(v => console.log(`  [atom] count = ${v}, double = ${doubleAtom.get()}`));
countAtom.set(1);
countAtom.set(5);
console.log(`G: nameAtom = ${nameAtom.get()} (independent, no re-render)`);

// --- Comparison ---
console.log('\nH: Comparison:');
console.log('  Redux:   Actions→Reducer→Store. Boilerplate. Devtools.');
console.log('  Zustand: One store, no providers, selectors for perf.');
console.log('  Jotai:   Atoms (bottom-up), minimal re-renders, composable.');

/**
 * OUTPUT:
 * A: ZUSTAND pattern — simple store with selectors:
 * B: count = 0
 * C: name = Surya
 *   [zustand] state: {"count":1,"name":"Surya",...}
 *   [zustand] state: {"count":2,"name":"Surya",...}
 *   [zustand] state: {"count":2,"name":"Raj",...}
 *
 * D: JOTAI pattern — atomic state:
 * E: countAtom = 0
 * F: doubleAtom = 0
 *   [atom] count = 1, double = 2
 *   [atom] count = 5, double = 10
 * G: nameAtom = Surya (independent, no re-render)
 *
 * ┌── INTERVIEW ANSWER ───────────────────────────────────┐
 * │ Zustand: minimal API, one store, selector-based       │
 * │ subscriptions, no Provider needed. Jotai: atomic      │
 * │ model, each atom is independent, derived atoms for    │
 * │ computed values, bottom-up approach.                   │
 * └───────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/07-state-management/03-zustand-jotai.js
 */
