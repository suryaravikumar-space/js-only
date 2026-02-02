/**
 * DOM EVENTS: 03 - Event Delegation
 *
 * ONE CONCEPT: Attach ONE handler to parent instead of MANY handlers to children
 */


// =============================================================================
// WHAT IS EVENT DELEGATION?
// =============================================================================

/**
 * Event Delegation = A technique where you add a single event listener to
 *                    a parent element instead of individual listeners to
 *                    each child element.
 *
 * Uses event bubbling - clicks on children bubble up to parent.
 *
 *
 * ANALOGY:
 * ────────
 *
 *   Company receptionist:
 *   - One receptionist handles calls for ALL employees
 *   - Instead of each employee having their own phone line
 *   - Receptionist routes calls to the right person
 *
 */


// =============================================================================
// HOW THE ENGINE SEES IT
// =============================================================================

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  WITHOUT DELEGATION (Bad)                                            │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │   <ul>                                                               │
 *   │     <li onclick="handler1">Item 1</li>  ← Handler 1                  │
 *   │     <li onclick="handler2">Item 2</li>  ← Handler 2                  │
 *   │     <li onclick="handler3">Item 3</li>  ← Handler 3                  │
 *   │     ... 1000 items ...                                               │
 *   │     <li onclick="handler1000">Item 1000</li>  ← Handler 1000         │
 *   │   </ul>                                                              │
 *   │                                                                      │
 *   │   MEMORY: 1000 function references                                   │
 *   │   PROBLEM: New items need new handlers                               │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 *
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  WITH DELEGATION (Good)                                              │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │   <ul onclick="handler">  ◄─── ONE handler on parent                 │
 *   │     <li>Item 1</li>   ─────┐                                         │
 *   │     <li>Item 2</li>        │   Clicks bubble UP                      │
 *   │     <li>Item 3</li>        │   to parent handler                     │
 *   │     ... 1000 items ...     │                                         │
 *   │     <li>Item 1000</li> ────┘                                         │
 *   │   </ul>                                                              │
 *   │                                                                      │
 *   │   MEMORY: 1 function reference                                       │
 *   │   BONUS: Works for dynamically added items!                          │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// DEMONSTRATION
// =============================================================================

console.log('=== Event Delegation Demo ===\n');

// Simulating a list with delegation
class TodoList {
  constructor() {
    this.items = [];
    this.nextId = 1;
  }

  addItem(text) {
    const item = { id: this.nextId++, text, completed: false };
    this.items.push(item);
    console.log(`  Added: "${text}" (id: ${item.id})`);
    return item;
  }

  // ONE handler that manages ALL item clicks
  handleClick(targetId, action) {
    console.log(`\n  [Delegated Handler] Received click on item ${targetId}, action: ${action}`);

    if (action === 'toggle') {
      const item = this.items.find(i => i.id === targetId);
      if (item) {
        item.completed = !item.completed;
        console.log(`    → Toggled "${item.text}" to ${item.completed ? 'completed' : 'incomplete'}`);
      }
    } else if (action === 'delete') {
      this.items = this.items.filter(i => i.id !== targetId);
      console.log(`    → Deleted item ${targetId}`);
    }
  }

  // Simulate click on list - uses event.target to identify which item
  simulateClick(targetId, action) {
    // This is what the browser does - event bubbles to parent
    // Parent checks event.target to see what was clicked
    this.handleClick(targetId, action);
  }
}

const todo = new TodoList();

console.log('Adding items:');
todo.addItem('Buy groceries');
todo.addItem('Walk the dog');
todo.addItem('Learn JavaScript');

console.log('\nClicking items (using delegation):');
todo.simulateClick(1, 'toggle');
todo.simulateClick(2, 'delete');
todo.simulateClick(3, 'toggle');


// =============================================================================
// BROWSER IMPLEMENTATION
// =============================================================================

console.log('\n=== Browser Implementation ===\n');

const browserCode = `
// HTML:
// <ul id="todo-list">
//   <li data-id="1"><span>Buy milk</span> <button class="delete">×</button></li>
//   <li data-id="2"><span>Walk dog</span> <button class="delete">×</button></li>
// </ul>

const todoList = document.getElementById('todo-list');

// ONE event listener on the parent <ul>
todoList.addEventListener('click', function(e) {
  const target = e.target;
  const listItem = target.closest('li');  // Find parent <li>

  if (!listItem) return;  // Clicked outside an item

  const id = listItem.dataset.id;

  // Check what was clicked
  if (target.classList.contains('delete')) {
    // Delete button clicked
    listItem.remove();
    console.log('Deleted item', id);
  } else {
    // Item text clicked - toggle
    listItem.classList.toggle('completed');
    console.log('Toggled item', id);
  }
});

// BENEFITS:
// 1. Only ONE listener instead of one per item
// 2. Works for items added LATER (dynamic content!)
// 3. Better memory usage
// 4. Cleaner code
`;

console.log(browserCode);


// =============================================================================
// THE closest() METHOD
// =============================================================================

console.log('=== The closest() Method ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  element.closest(selector)                                          │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  Returns the closest ancestor (or self) that matches selector.      │
 *   │  Returns null if no match found.                                    │
 *   │                                                                     │
 *   │  <div class="card">                                                 │
 *   │    <div class="card-body">                                          │
 *   │      <button>Click</button>  ◄── e.target                           │
 *   │    </div>                                                           │
 *   │  </div>                                                             │
 *   │                                                                     │
 *   │  e.target.closest('.card')  → Returns <div class="card">            │
 *   │  e.target.closest('button') → Returns <button> (self)               │
 *   │  e.target.closest('.foo')   → Returns null                          │
 *   │                                                                     │
 *   │  ESSENTIAL for delegation - finds the meaningful parent!            │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

// Simulating closest()
function simulateClosest(element, path, selector) {
  console.log(`  closest('${selector}') starting from '${element}':`);

  const fullPath = [element, ...path];
  for (const el of fullPath) {
    if (el.includes(selector.replace('.', ''))) {
      console.log(`    Found: ${el}`);
      return el;
    }
  }
  console.log('    Not found: null');
  return null;
}

simulateClosest('button', ['div.card-body', 'div.card', 'body'], '.card');
simulateClosest('span.text', ['li.item', 'ul.list', 'body'], '.item');


// =============================================================================
// CHECKING WHAT WAS CLICKED
// =============================================================================

console.log('\n=== Checking What Was Clicked ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  METHODS TO IDENTIFY TARGET                                         │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  1. e.target.matches(selector)                                      │
 *   │     if (e.target.matches('.delete-btn')) { ... }                    │
 *   │                                                                     │
 *   │  2. e.target.closest(selector)                                      │
 *   │     const item = e.target.closest('.list-item');                    │
 *   │                                                                     │
 *   │  3. e.target.tagName                                                │
 *   │     if (e.target.tagName === 'BUTTON') { ... }                      │
 *   │                                                                     │
 *   │  4. e.target.classList.contains(class)                              │
 *   │     if (e.target.classList.contains('delete')) { ... }              │
 *   │                                                                     │
 *   │  5. e.target.dataset.action                                         │
 *   │     switch(e.target.dataset.action) {                               │
 *   │       case 'edit': ...                                              │
 *   │       case 'delete': ...                                            │
 *   │     }                                                               │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

const delegationPattern = `
// Clean delegation pattern using data attributes
container.addEventListener('click', function(e) {
  const action = e.target.dataset.action;
  const item = e.target.closest('[data-id]');

  if (!action || !item) return;

  const id = item.dataset.id;

  switch (action) {
    case 'edit':
      editItem(id);
      break;
    case 'delete':
      deleteItem(id);
      break;
    case 'complete':
      toggleComplete(id);
      break;
  }
});

// HTML:
// <div data-id="1">
//   <button data-action="edit">Edit</button>
//   <button data-action="delete">Delete</button>
//   <button data-action="complete">✓</button>
// </div>
`;

console.log('Clean Delegation Pattern:');
console.log(delegationPattern);


// =============================================================================
// WHEN TO USE DELEGATION
// =============================================================================

console.log('=== When to Use Delegation ===\n');

console.log('USE DELEGATION:');
console.log('  ✓ Many similar elements (lists, tables, grids)');
console.log('  ✓ Dynamic content (elements added/removed)');
console.log('  ✓ Performance-critical (1000+ elements)');
console.log('  ✓ Same action for multiple elements');

console.log('\nAVOID DELEGATION:');
console.log('  ✗ Few static elements');
console.log('  ✗ Complex per-element logic');
console.log('  ✗ Events that don\'t bubble (focus, blur)');


// =============================================================================
// INTERVIEW: What to Say (1-2 minutes)
// =============================================================================

/**
 * QUESTION: "What is event delegation?"
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * YOUR ANSWER:
 *
 * "Event delegation is a technique where instead of adding event listeners
 * to many individual elements, you add ONE listener to a common parent
 * element. It works because of event bubbling - when you click a child,
 * the event bubbles up to the parent where your handler catches it.
 *
 * For example, if I have a todo list with 100 items, instead of adding
 * 100 click handlers to each item, I add ONE handler to the parent ul.
 * When any li is clicked, the event bubbles up. In my handler, I check
 * event.target to see which item was actually clicked.
 *
 * There are three big benefits. First, memory efficiency - one function
 * in memory instead of hundreds. Second, it works for dynamic content.
 * If I add new items to the list, they automatically work because the
 * handler is on the parent, not the child. Third, cleaner code with
 * less setup and teardown.
 *
 * The key methods I use are event.target.closest() to find the relevant
 * ancestor element, and event.target.matches() or classList.contains()
 * to check what specifically was clicked.
 *
 * One caveat - it only works for events that bubble. Focus and blur
 * don't bubble, so you'd use focusin and focusout instead."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * KEY POINTS TO MENTION:
 * ✓ One handler on parent instead of many on children
 * ✓ Works because of event bubbling
 * ✓ Use event.target to see what was clicked
 * ✓ Use closest() to find parent element
 * ✓ Works for dynamic content automatically
 * ✓ Memory efficient
 *
 */


// RUN: node docs/26-dom-events/03-event-delegation.js
