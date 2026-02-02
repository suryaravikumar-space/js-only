/**
 * TOPIC: Data Table with Sort, Filter, Pagination — Machine Coding
 *
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  GOLDEN RULE: Table = Data + Sort Key + Filter + Page Slice ║
 * ║  Pipeline: filter -> sort -> paginate -> render              ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * ┌──────────────────────────────────────────────────────────────┐
 * │  STORY: A librarian has a catalogue (raw data). A visitor    │
 * │  asks "Show me fiction books (filter), sorted by year        │
 * │  (sort), page 2 of 5 per page (paginate)." The librarian    │
 * │  applies each step in order to hand over the right cards.    │
 * └──────────────────────────────────────────────────────────────┘
 *
 * ┌─────────────────────────────────────────────┐
 * │  VISUAL DIAGRAM                             │
 * │                                             │
 * │  Raw Data                                   │
 * │    │                                        │
 * │    ▼  filter(query)                         │
 * │  Filtered                                   │
 * │    │                                        │
 * │    ▼  sort(column, dir)                     │
 * │  Sorted                                     │
 * │    │                                        │
 * │    ▼  paginate(page, size)                  │
 * │  Page Slice ──> Render Table                │
 * │                                             │
 * │  Total pages = ceil(filtered.length / size) │
 * └─────────────────────────────────────────────┘
 *
 * RUN: node docs/react/15-machine-coding/07-data-table.js
 */

// ─── Sample data ─────────────────────────────────────────────
const DATA = [
  { id: 1, name: "Alice",   age: 30, dept: "Engineering", salary: 95000 },
  { id: 2, name: "Bob",     age: 25, dept: "Design",      salary: 72000 },
  { id: 3, name: "Charlie", age: 35, dept: "Engineering", salary: 110000 },
  { id: 4, name: "Diana",   age: 28, dept: "Marketing",   salary: 68000 },
  { id: 5, name: "Eve",     age: 32, dept: "Engineering", salary: 102000 },
  { id: 6, name: "Frank",   age: 40, dept: "Design",      salary: 88000 },
  { id: 7, name: "Grace",   age: 27, dept: "Marketing",   salary: 71000 },
  { id: 8, name: "Hank",    age: 33, dept: "Engineering", salary: 99000 },
  { id: 9, name: "Ivy",     age: 29, dept: "Design",      salary: 76000 },
  { id: 10, name: "Jack",   age: 45, dept: "Marketing",   salary: 93000 },
];

// ─── Filter ──────────────────────────────────────────────────
function filterRows(data, query) {
  if (!query) return data;
  const q = query.toLowerCase();
  return data.filter((row) =>
    Object.values(row).some((v) => String(v).toLowerCase().includes(q))
  );
}

// ─── Sort ────────────────────────────────────────────────────
function sortRows(data, column, direction = "asc") {
  if (!column) return data;
  return [...data].sort((a, b) => {
    const valA = a[column], valB = b[column];
    let cmp = 0;
    if (typeof valA === "number") cmp = valA - valB;
    else cmp = String(valA).localeCompare(String(valB));
    return direction === "desc" ? -cmp : cmp;
  });
}

// ─── Paginate ────────────────────────────────────────────────
function paginate(data, page, pageSize) {
  const totalPages = Math.ceil(data.length / pageSize) || 1;
  const clamped = Math.max(1, Math.min(page, totalPages));
  const start = (clamped - 1) * pageSize;
  return {
    rows: data.slice(start, start + pageSize),
    currentPage: clamped,
    totalPages,
    totalRows: data.length,
  };
}

// ─── Pipeline ────────────────────────────────────────────────
function queryTable(data, { filter, sortCol, sortDir, page, pageSize }) {
  const filtered = filterRows(data, filter);
  const sorted = sortRows(filtered, sortCol, sortDir);
  return paginate(sorted, page, pageSize);
}

// ─── Render ──────────────────────────────────────────────────
function renderTable(result) {
  const cols = ["id", "name", "age", "dept", "salary"];
  const header = cols.map((c) => c.padEnd(12)).join(" | ");
  const sep = "-".repeat(header.length);
  const rows = result.rows.map((r) =>
    cols.map((c) => String(r[c]).padEnd(12)).join(" | ")
  );
  return [header, sep, ...rows].join("\n");
}

// ─── Simulation ──────────────────────────────────────────────
console.log("=== DATA TABLE SIMULATION ===\n");

// A: Full data, page 1
console.log("A: All data, sorted by name, page 1 (size 4)");
let res = queryTable(DATA, { sortCol: "name", sortDir: "asc", page: 1, pageSize: 4 });
console.log(renderTable(res));
console.log(`   Page ${res.currentPage}/${res.totalPages} (${res.totalRows} rows)\n`);

// B: Page 2
console.log("B: Page 2");
res = queryTable(DATA, { sortCol: "name", sortDir: "asc", page: 2, pageSize: 4 });
console.log(renderTable(res));
console.log(`   Page ${res.currentPage}/${res.totalPages}\n`);

// C: Sort by salary desc
console.log("C: Sort by salary descending, page 1");
res = queryTable(DATA, { sortCol: "salary", sortDir: "desc", page: 1, pageSize: 5 });
console.log(renderTable(res));
console.log(`   Top earner: ${res.rows[0].name} ($${res.rows[0].salary})\n`);

// D: Filter by department
console.log("D: Filter 'engineering'");
res = queryTable(DATA, { filter: "engineering", sortCol: "salary", sortDir: "desc", page: 1, pageSize: 10 });
console.log(renderTable(res));
console.log(`   Engineering count: ${res.totalRows}\n`);

// E: Filter + paginate
console.log("E: Filter 'design', page size 2");
res = queryTable(DATA, { filter: "design", sortCol: "name", sortDir: "asc", page: 1, pageSize: 2 });
console.log(renderTable(res));
console.log(`   Page ${res.currentPage}/${res.totalPages}\n`);

// F: No results
console.log("F: Filter with no match");
res = queryTable(DATA, { filter: "zzz", page: 1, pageSize: 5 });
console.log(`   Rows found: ${res.totalRows}`);
console.log(`   Total pages: ${res.totalPages}\n`);

// G: Column resize concept
console.log("G: Column resize concept");
console.log("   Store column widths in state: { name: 150, age: 80, ... }");
console.log("   On drag: update width, re-render with new padding\n");

// ─── Follow-up Questions ─────────────────────────────────────
console.log("=== FOLLOW-UP QUESTIONS ===");
console.log("1. How to handle server-side pagination vs client-side?");
console.log("2. How to add multi-column sort?");
console.log("3. How to implement row selection (checkbox column)?");
console.log("4. How to virtualize rows for 10k+ records?");
console.log("5. How to add inline editing of cells?");

/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  INTERVIEW ANSWER                                           ║
 * ║                                                             ║
 * ║  Data table pipeline: filter -> sort -> paginate. Keep raw  ║
 * ║  data untouched; derive displayed rows. State holds:        ║
 * ║  filterQuery, sortColumn, sortDirection, currentPage,       ║
 * ║  pageSize. Total pages = ceil(filteredCount / pageSize).    ║
 * ║  For large data, move pipeline to server & send page only.  ║
 * ╚══════════════════════════════════════════════════════════════╝
 */
