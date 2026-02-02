/**
 * TOPIC: Todo App — Machine Coding Interview
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  GOLDEN RULE: State is the single source of truth.             ║
 * ║  Every UI change = state change -> re-render.                  ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * ┌──────────────────────────────────────────────────────────────────┐
 * │  STORY: Think of a whiteboard todo list.                        │
 * │  You WRITE (add), ERASE (delete), CHECK OFF (toggle),           │
 * │  and FILTER by looking at checked vs unchecked items.            │
 * │  The board is photographed (localStorage) so it survives.        │
 * └──────────────────────────────────────────────────────────────────┘
 *
 * ┌─────────────────── VISUAL DIAGRAM ───────────────────┐
 * │                                                       │
 * │   State: { todos: [], filter: 'all', nextId: 1 }     │
 * │                                                       │
 * │   [input] [Add]                                       │
 * │   [All] [Active] [Completed]                          │
 * │   ┌─────────────────────────────┐                     │
 * │   │ [ ] Buy milk          [X]   │                     │
 * │   │ [x] Learn React       [X]   │                     │
 * │   └─────────────────────────────┘                     │
 * │                                                       │
 * │   addTodo ──> setState ──> render()                   │
 * │   toggle  ──> setState ──> render()                   │
 * │   delete  ──> setState ──> render()                   │
 * │   filter  ──> setState ──> render()                   │
 * └───────────────────────────────────────────────────────┘
 *
 * PROBLEM: Build a todo app with add, delete, toggle, filter, and persistence.
 *
 * REQUIREMENTS:
 *  - addTodo(text) adds a new todo
 *  - deleteTodo(id) removes a todo
 *  - toggleTodo(id) flips completed status
 *  - setFilter('all' | 'active' | 'completed') filters display
 *  - persist/load from localStorage (simulated)
 *
 * APPROACH:
 *  - State: { todos: [{id, text, completed}], filter, nextId }
 *  - Each action mutates state then calls render()
 *  - render() applies filter and logs the visible list
 *  - localStorage simulated with a plain object
 *
 * RUN: node docs/react/15-machine-coding/00-todo-app.js
 */

// --- Simulate localStorage ---
const fakeStorage = {};
const localStorage = {
  getItem(key) { return fakeStorage[key] || null; },
  setItem(key, val) { fakeStorage[key] = val; },
};

// --- State ---
let state = {
  todos: [],
  filter: 'all', // 'all' | 'active' | 'completed'
  nextId: 1,
};

// --- Persistence ---
function save() {
  localStorage.setItem('todos', JSON.stringify(state.todos));
  localStorage.setItem('nextId', String(state.nextId));
}

function load() {
  const raw = localStorage.getItem('todos');
  if (raw) {
    state.todos = JSON.parse(raw);
    state.nextId = Number(localStorage.getItem('nextId')) || 1;
  }
}

// --- Actions ---
function addTodo(text) {
  if (!text.trim()) return;
  state.todos.push({ id: state.nextId++, text: text.trim(), completed: false });
  save();
  render('addTodo');
}

function deleteTodo(id) {
  state.todos = state.todos.filter(t => t.id !== id);
  save();
  render('deleteTodo');
}

function toggleTodo(id) {
  const todo = state.todos.find(t => t.id === id);
  if (todo) todo.completed = !todo.completed;
  save();
  render('toggleTodo');
}

function setFilter(filter) {
  state.filter = filter;
  render('setFilter');
}

// --- Render ---
function getVisible() {
  if (state.filter === 'active') return state.todos.filter(t => !t.completed);
  if (state.filter === 'completed') return state.todos.filter(t => t.completed);
  return state.todos;
}

function render(action) {
  const visible = getVisible();
  console.log(`\n--- render() after ${action} | filter=${state.filter} ---`);
  if (visible.length === 0) {
    console.log('  (empty)');
  } else {
    visible.forEach(t => {
      const mark = t.completed ? 'x' : ' ';
      console.log(`  [${mark}] id=${t.id} "${t.text}"`);
    });
  }
  console.log(`  Total: ${state.todos.length} | Active: ${state.todos.filter(t => !t.completed).length} | Done: ${state.todos.filter(t => t.completed).length}`);
}

// --- Simulation ---
console.log('A: Initial state (empty)');
render('init');

console.log('\nB: Adding todos');
addTodo('Buy milk');
addTodo('Learn React');
addTodo('Build todo app');

console.log('\nC: Toggle "Learn React" (id=2)');
toggleTodo(2);

console.log('\nD: Filter = active');
setFilter('active');

console.log('\nE: Filter = completed');
setFilter('completed');

console.log('\nF: Filter = all');
setFilter('all');

console.log('\nG: Delete "Buy milk" (id=1)');
deleteTodo(1);

console.log('\nH: Simulate reload — load from localStorage');
const savedTodos = JSON.parse(localStorage.getItem('todos'));
const savedNextId = localStorage.getItem('nextId');
console.log('  Loaded todos:', savedTodos);
console.log('  Loaded nextId:', savedNextId);

console.log('\nI: Try adding empty todo (should be ignored)');
addTodo('   ');

/**
 * FOLLOW-UP QUESTIONS:
 * 1. How would you add drag-and-drop reorder?
 *    -> Store an "order" field or use array index; update on drop.
 * 2. How would you add undo?
 *    -> Keep a history stack of previous state snapshots.
 * 3. How would you debounce localStorage writes?
 *    -> Wrap save() in a debounce so rapid edits batch into one write.
 * 4. How would you handle large lists (10k+ items)?
 *    -> Virtualized list (react-window), paginate, or lazy render.
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  INTERVIEW ANSWER:                                             ║
 * ║  "I model the todo app as a state object with todos array,     ║
 * ║  a filter string, and a nextId counter. Each action (add,      ║
 * ║  delete, toggle, filter) updates state then triggers render(). ║
 * ║  render() applies the current filter and displays visible      ║
 * ║  todos. Persistence uses localStorage — save on every write,   ║
 * ║  load on mount. In React, state lives in useState/useReducer,  ║
 * ║  effects handle persistence, and the component re-renders      ║
 * ║  automatically on state change."                               ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */
