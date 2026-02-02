/**
 * TOPIC: Drag & Drop List Reorder - Machine Coding
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  GOLDEN RULE: Track dragIndex & dropIndex. On drop, splice     ║
 * ║  item from source position and insert at target position.      ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * ┌──────────────────────────────────────────────────────────────────┐
 * │  STORY: A Trello board — you grab a card, drag it over others,  │
 * │  a placeholder line shows where it will land. Release, and the  │
 * │  array reorders. Drag across columns for Kanban.                │
 * └──────────────────────────────────────────────────────────────────┘
 *
 * ┌──────────────────────────────────────────────────────────────────┐
 * │  VISUAL DIAGRAM                                                 │
 * │                                                                 │
 * │  dragStart(1)    dragOver(3)        drop()                      │
 * │  ┌─────────┐    ┌─────────┐       ┌──────────────────┐          │
 * │  │ save    │    │ show    │       │ splice(1,1)      │          │
 * │  │ src=1   │    │ preview │       │ splice(2,0,item) │          │
 * │  └─────────┘    │ at 3    │       │ rerender         │          │
 * │                 └─────────┘       └──────────────────┘          │
 * │                                                                 │
 * │  [A] [B] [C] [D]  →  drag B to after C  →  [A] [C] [B] [D]    │
 * └──────────────────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/15-machine-coding/13-drag-and-drop.js
 */

// ─── Single List DnD ─────────────────────────────────────────────────

function createDragDropList(initialItems) {
  let items = [...initialItems];
  let dragIndex = -1;
  let dropIndex = -1;

  function render(label = '') {
    const display = items.map((item, i) => {
      let marker = '';
      if (i === dragIndex) marker = ' [DRAGGING]';
      if (i === dropIndex && dropIndex !== dragIndex) marker = ' ← drop here';
      return `${item}${marker}`;
    });
    return `${label}[ ${display.join(' | ')} ]`;
  }

  function dragStart(index) {
    dragIndex = index;
    return `DragStart: picked up "${items[index]}" at index ${index}`;
  }

  function dragOver(index) {
    dropIndex = index;
    return `DragOver: hovering at index ${index}`;
  }

  function drop() {
    if (dragIndex === -1 || dropIndex === -1) return 'No active drag';
    if (dragIndex === dropIndex) {
      dragIndex = -1;
      dropIndex = -1;
      return 'Dropped in same position (no change)';
    }
    const [item] = items.splice(dragIndex, 1);
    const insertAt = dropIndex > dragIndex ? dropIndex - 1 : dropIndex;
    // Actually simpler: remove then insert at dropIndex adjusted
    items.splice(dropIndex > dragIndex ? dropIndex - 1 : dropIndex, 0, item);
    const msg = `Dropped "${item}": index ${dragIndex} -> ${dropIndex}`;
    dragIndex = -1;
    dropIndex = -1;
    return msg;
  }

  function reorder(fromIndex, toIndex) {
    const [item] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, item);
    return `Reordered: "${item}" from ${fromIndex} to ${toIndex}`;
  }

  function getItems() {
    return [...items];
  }

  return { render, dragStart, dragOver, drop, reorder, getItems };
}

// ─── Kanban Board (multiple lists) ───────────────────────────────────

function createKanban(columns) {
  const board = {};
  for (const [name, items] of Object.entries(columns)) {
    board[name] = [...items];
  }

  function render() {
    const lines = [];
    for (const [name, items] of Object.entries(board)) {
      lines.push(`  ${name}: [ ${items.join(', ')} ]`);
    }
    return lines.join('\n');
  }

  function moveWithinColumn(colName, fromIdx, toIdx) {
    const col = board[colName];
    if (!col) return `Column "${colName}" not found`;
    const [item] = col.splice(fromIdx, 1);
    col.splice(toIdx, 0, item);
    return `Moved "${item}" within ${colName}: ${fromIdx} -> ${toIdx}`;
  }

  function moveBetweenColumns(srcCol, srcIdx, destCol, destIdx) {
    if (!board[srcCol] || !board[destCol]) return 'Invalid column';
    const [item] = board[srcCol].splice(srcIdx, 1);
    board[destCol].splice(destIdx, 0, item);
    return `Moved "${item}": ${srcCol}[${srcIdx}] -> ${destCol}[${destIdx}]`;
  }

  return { render, moveWithinColumn, moveBetweenColumns };
}

// ─── Simulation ──────────────────────────────────────────────────────

console.log('=== DRAG & DROP LIST REORDER SIMULATION ===\n');

// A: Basic list render
console.log('A: Initial list');
const list = createDragDropList(['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry']);
console.log(`   ${list.render()}\n`);

// B: Drag Banana (1) to after Cherry (2)
console.log('B: Drag "Banana" to position of "Cherry"');
console.log(`   ${list.dragStart(1)}`);
console.log(`   ${list.render('   ')}`);
console.log(`   ${list.dragOver(2)}`);
console.log(`   ${list.render('   ')}`);
console.log(`   ${list.drop()}`);
console.log(`   ${list.render('   ')}\n`);

// C: Drag first to last
console.log('C: Drag "Apple" (0) to end (index 4)');
console.log(`   ${list.dragStart(0)}`);
console.log(`   ${list.dragOver(4)}`);
console.log(`   ${list.drop()}`);
console.log(`   ${list.render('   ')}\n`);

// D: Drag to same position
console.log('D: Drag to same position (no-op)');
console.log(`   ${list.dragStart(2)}`);
console.log(`   ${list.dragOver(2)}`);
console.log(`   ${list.drop()}`);
console.log(`   ${list.render('   ')}\n`);

// E: Direct reorder helper
console.log('E: Direct reorder: index 3 -> index 0');
console.log(`   Before: ${list.render()}`);
console.log(`   ${list.reorder(3, 0)}`);
console.log(`   After:  ${list.render()}\n`);

// F: Kanban board
console.log('F: Kanban board setup');
const kanban = createKanban({
  'TODO     ': ['Design UI', 'Write tests', 'Code review'],
  'IN PROGRESS': ['Build API', 'Setup CI'],
  'DONE     ': ['Init repo'],
});
console.log(kanban.render());
console.log();

// G: Move within column
console.log('G: Move within TODO column');
console.log(`   ${kanban.moveWithinColumn('TODO     ', 2, 0)}`);
console.log(kanban.render());
console.log();

// H: Move between columns
console.log('H: Move "Build API" from IN PROGRESS to DONE');
console.log(`   ${kanban.moveBetweenColumns('IN PROGRESS', 0, 'DONE     ', 0)}`);
console.log(kanban.render());
console.log();

// I: Move from TODO to IN PROGRESS
console.log('I: Move "Design UI" from TODO to IN PROGRESS');
console.log(`   ${kanban.moveBetweenColumns('TODO     ', 1, 'IN PROGRESS', 0)}`);
console.log(kanban.render());
console.log();

// ─── Follow-up Questions ─────────────────────────────────────────────

console.log('=== FOLLOW-UP QUESTIONS ===\n');
console.log('Q1: How to show a visual placeholder during drag?');
console.log('    -> Insert a "placeholder" element at dropIndex, CSS dashed border\n');
console.log('Q2: How to handle drag between different component trees?');
console.log('    -> Use React DnD library or shared context with source/dest IDs\n');
console.log('Q3: How to support touch devices?');
console.log('    -> Use onTouchStart/Move/End or pointer events as fallback\n');
console.log('Q4: How to persist reorder?');
console.log('    -> onDrop callback sends new order array to backend\n');

// ─── Interview Answer ────────────────────────────────────────────────

console.log('╔══════════════════════════════════════════════════════════════╗');
console.log('║  INTERVIEW ANSWER                                          ║');
console.log('║  State: items[], dragIndex, dropIndex                      ║');
console.log('║  Events: onDragStart(save src), onDragOver(set target),    ║');
console.log('║          onDrop(splice + insert), e.preventDefault()       ║');
console.log('║  Kanban: { columnId: items[] }, move within or between     ║');
console.log('║  Visual: conditional className at dropIndex for placeholder║');
console.log('║  Hooks: useState, useRef(dragItem), useCallback            ║');
console.log('╚══════════════════════════════════════════════════════════════╝');
