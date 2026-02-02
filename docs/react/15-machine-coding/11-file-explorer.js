/**
 * TOPIC: File Explorer Tree - Machine Coding
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  GOLDEN RULE: Recursive tree node. Each node has name, type    ║
 * ║  (file/folder), children[], and isExpanded boolean.            ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * ┌──────────────────────────────────────────────────────────────────┐
 * │  STORY: You open VS Code sidebar — folders expand/collapse,     │
 * │  files are leaves. You search "index" and only matching nodes   │
 * │  appear. You press arrow keys to navigate the tree.             │
 * └──────────────────────────────────────────────────────────────────┘
 *
 * ┌──────────────────────────────────────────────────────────────────┐
 * │  VISUAL DIAGRAM                                                 │
 * │                                                                 │
 * │  src/                    tree = { name, type, children[] }      │
 * │  ├── components/         toggle(path) -> flip isExpanded        │
 * │  │   ├── App.js          addFile(path, name) -> push child      │
 * │  │   └── Header.js       delete(path) -> splice from parent     │
 * │  ├── utils/              search(term) -> filter recursively     │
 * │  │   └── helpers.js                                             │
 * │  └── index.js                                                   │
 * └──────────────────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/15-machine-coding/11-file-explorer.js
 */

// ─── Tree Data Structure ─────────────────────────────────────────────

function createNode(name, type = 'file', children = []) {
  return { name, type, children, isExpanded: type === 'folder' };
}

function createFileExplorer(rootData) {
  let root = rootData;
  let focusIndex = 0;

  function render(node = root, depth = 0) {
    const indent = '  '.repeat(depth);
    const lines = [];
    if (node.type === 'folder') {
      const icon = node.isExpanded ? '📂' : '📁';
      lines.push(`${indent}${icon} ${node.name}/`);
      if (node.isExpanded) {
        for (const child of node.children) {
          lines.push(...render(child, depth + 1));
        }
      }
    } else {
      lines.push(`${indent}📄 ${node.name}`);
    }
    return lines;
  }

  function findNode(path, node = root) {
    const parts = path.split('/').filter(Boolean);
    let current = node;
    for (const part of parts) {
      if (!current.children) return null;
      current = current.children.find((c) => c.name === part);
      if (!current) return null;
    }
    return current;
  }

  function findParent(path) {
    const parts = path.split('/').filter(Boolean);
    if (parts.length <= 1) return root;
    return findNode(parts.slice(0, -1).join('/'));
  }

  function toggle(path) {
    const node = findNode(path);
    if (node && node.type === 'folder') {
      node.isExpanded = !node.isExpanded;
      return `Toggled ${node.name}: ${node.isExpanded ? 'expanded' : 'collapsed'}`;
    }
    return `Cannot toggle: not a folder`;
  }

  function addFile(parentPath, name, type = 'file') {
    const parent = findNode(parentPath);
    if (!parent || parent.type !== 'folder') return `Invalid parent folder`;
    if (parent.children.find((c) => c.name === name)) return `${name} already exists`;
    parent.children.push(createNode(name, type));
    parent.children.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    return `Added ${type}: ${name} to ${parent.name}/`;
  }

  function deleteFile(path) {
    const parts = path.split('/').filter(Boolean);
    const name = parts[parts.length - 1];
    const parent = findParent(path);
    if (!parent) return `Parent not found`;
    const idx = parent.children.findIndex((c) => c.name === name);
    if (idx === -1) return `${name} not found`;
    parent.children.splice(idx, 1);
    return `Deleted: ${name}`;
  }

  function search(term, node = root) {
    const results = [];
    if (node.name.toLowerCase().includes(term.toLowerCase())) {
      results.push(node.name);
    }
    if (node.children) {
      for (const child of node.children) {
        results.push(...search(term, child));
      }
    }
    return results;
  }

  function getVisibleList(node = root, list = []) {
    list.push(node.name);
    if (node.type === 'folder' && node.isExpanded && node.children) {
      for (const child of node.children) {
        getVisibleList(child, list);
      }
    }
    return list;
  }

  function keyNav(key) {
    const visible = getVisibleList();
    if (key === 'ArrowDown') focusIndex = Math.min(focusIndex + 1, visible.length - 1);
    if (key === 'ArrowUp') focusIndex = Math.max(focusIndex - 1, 0);
    return `Focus: ${visible[focusIndex]} (index ${focusIndex})`;
  }

  return { render, toggle, addFile, deleteFile, search, keyNav };
}

// ─── Simulation ──────────────────────────────────────────────────────

console.log('=== FILE EXPLORER SIMULATION ===\n');

const tree = createNode('src', 'folder', [
  createNode('components', 'folder', [
    createNode('App.js'),
    createNode('Header.js'),
    createNode('Footer.js'),
  ]),
  createNode('utils', 'folder', [
    createNode('helpers.js'),
    createNode('api.js'),
  ]),
  createNode('index.js'),
  createNode('styles.css'),
]);

const explorer = createFileExplorer(tree);

// A: Initial render
console.log('A: Initial tree view');
console.log(explorer.render().join('\n'));
console.log();

// B: Collapse a folder
console.log('B: Collapse components/');
console.log(`   ${explorer.toggle('components')}`);
console.log(explorer.render().join('\n'));
console.log();

// C: Expand it back
console.log('C: Expand components/');
console.log(`   ${explorer.toggle('components')}`);
console.log(explorer.render().join('\n'));
console.log();

// D: Add a new file
console.log('D: Add Sidebar.js to components/');
console.log(`   ${explorer.addFile('components', 'Sidebar.js')}`);
console.log(explorer.render().join('\n'));
console.log();

// E: Add a folder
console.log('E: Add hooks/ folder to src/');
console.log(`   ${explorer.addFile('', 'hooks', 'folder')}`);
console.log(`   ${explorer.addFile('hooks', 'useAuth.js')}`);
console.log(explorer.render().join('\n'));
console.log();

// F: Delete a file
console.log('F: Delete Footer.js from components/');
console.log(`   ${explorer.deleteFile('components/Footer.js')}`);
console.log(explorer.render().join('\n'));
console.log();

// G: Search
console.log('G: Search for "js"');
const results = explorer.search('js');
console.log(`   Found: ${results.join(', ')}\n`);

console.log('   Search for "help"');
console.log(`   Found: ${explorer.search('help').join(', ')}\n`);

// H: Keyboard navigation
console.log('H: Keyboard navigation');
console.log(`   ${explorer.keyNav('ArrowDown')}`);
console.log(`   ${explorer.keyNav('ArrowDown')}`);
console.log(`   ${explorer.keyNav('ArrowDown')}`);
console.log(`   ${explorer.keyNav('ArrowUp')}\n`);

// I: Duplicate prevention
console.log('I: Try adding duplicate file');
console.log(`   ${explorer.addFile('components', 'App.js')}\n`);

// ─── Follow-up Questions ─────────────────────────────────────────────

console.log('=== FOLLOW-UP QUESTIONS ===\n');
console.log('Q1: How to handle drag-drop reorder in tree?');
console.log('    -> Track dragSource/dropTarget paths, reparent node\n');
console.log('Q2: How to lazy-load folder contents?');
console.log('    -> On expand, fetch children from API if not loaded\n');
console.log('Q3: How to rename a file inline?');
console.log('    -> Set editingPath state, render input, onBlur saves\n');

// ─── Interview Answer ────────────────────────────────────────────────

console.log('╔══════════════════════════════════════════════════════════════╗');
console.log('║  INTERVIEW ANSWER                                          ║');
console.log('║  Data: recursive tree { name, type, children[], expanded } ║');
console.log('║  Render: recursion with depth-based indentation            ║');
console.log('║  Toggle: flip isExpanded, conditionally render children    ║');
console.log('║  CRUD: find parent by path, push/splice children array     ║');
console.log('║  Search: DFS traversal matching name substring             ║');
console.log('║  Hooks: useState(tree), useCallback, useMemo for filter    ║');
console.log('╚══════════════════════════════════════════════════════════════╝');
