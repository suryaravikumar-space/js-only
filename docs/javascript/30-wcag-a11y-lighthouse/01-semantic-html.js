/**
 * TOPIC: Semantic HTML & Accessibility
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║                    THE GOLDEN RULE                               ║
 * ║  Use native HTML elements for their intended purpose.           ║
 * ║  A <button> IS a button. A <div onclick> is NOT.                ║
 * ║  Semantic HTML = free accessibility. Div-soup = manual work.    ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────────┐
 * │ Think of a building with signs vs no signs. Semantic HTML =    │
 * │ a building where every room has a sign (Kitchen, Bathroom).    │
 * │ Div-soup = a building where every door looks the same —        │
 * │ a blind person (screen reader) can't navigate.                 │
 * └───────────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────────────┐
 * │  <header>  → role="banner"       (site header)                │
 * │  <nav>     → role="navigation"   (navigation links)           │
 * │  <main>    → role="main"         (primary content)            │
 * │  <aside>   → role="complementary"(sidebar)                    │
 * │  <footer>  → role="contentinfo"  (site footer)                │
 * │  <section> → role="region"       (if has aria-label)          │
 * │  <article> → role="article"      (self-contained content)     │
 * └───────────────────────────────────────────────────────────────┘
 */

// ─── A: Semantic vs Div-Soup Comparison ─────────────────────────
console.log("A: Semantic HTML vs Div-Soup:");

const semanticPage = {
  tag: "body", children: [
    { tag: "header", role: "banner", children: [
      { tag: "nav", role: "navigation", children: [{ tag: "a", text: "Home" }, { tag: "a", text: "About" }] }
    ]},
    { tag: "main", role: "main", children: [
      { tag: "h1", text: "Page Title" },
      { tag: "article", role: "article", children: [
        { tag: "h2", text: "Article Title" },
        { tag: "p", text: "Content..." }
      ]}
    ]},
    { tag: "footer", role: "contentinfo", children: [{ tag: "p", text: "© 2024" }] }
  ]
};

const divSoupPage = {
  tag: "div", className: "body", children: [
    { tag: "div", className: "header", children: [
      { tag: "div", className: "nav", children: [{ tag: "span", text: "Home" }, { tag: "span", text: "About" }] }
    ]},
    { tag: "div", className: "main", children: [
      { tag: "div", className: "title", text: "Page Title" },
      { tag: "div", className: "article", children: [
        { tag: "div", className: "subtitle", text: "Article Title" },
        { tag: "div", text: "Content..." }
      ]}
    ]},
    { tag: "div", className: "footer", children: [{ tag: "div", text: "© 2024" }] }
  ]
};

const countRoles = (node) => {
  let count = node.role ? 1 : 0;
  (node.children || []).forEach(c => { count += countRoles(c); });
  return count;
};

console.log(`   Semantic page: ${countRoles(semanticPage)} implicit ARIA roles`);
console.log(`   Div-soup page: ${countRoles(divSoupPage)} implicit ARIA roles`);
console.log(`   Screen reader navigable: Semantic=YES, Div-soup=NO\n`);

// ─── B: Landmark Roles ──────────────────────────────────────────
console.log("B: HTML5 Landmarks → ARIA Roles:");
const landmarks = [
  { html: "<header>",  aria: "banner",        note: "Only when direct child of <body>" },
  { html: "<nav>",     aria: "navigation",    note: "Can have multiple with aria-label" },
  { html: "<main>",    aria: "main",          note: "Only ONE per page" },
  { html: "<aside>",   aria: "complementary", note: "Related but separate content" },
  { html: "<footer>",  aria: "contentinfo",   note: "Only when direct child of <body>" },
  { html: "<section>", aria: "region",        note: "Only if has accessible name" },
  { html: "<form>",    aria: "form",          note: "Only if has accessible name" },
];

landmarks.forEach(({ html, aria, note }) => {
  console.log(`   ${html.padEnd(12)} → role="${aria}" (${note})`);
});

// ─── C: Heading Hierarchy Validator ─────────────────────────────
console.log("\nC: Heading Hierarchy Validation:");

const validateHeadings = (headings) => {
  const errors = [];
  if (headings.length === 0) return { valid: true, errors };
  if (headings[0] !== 1) errors.push(`First heading should be h1, got h${headings[0]}`);
  for (let i = 1; i < headings.length; i++) {
    if (headings[i] > headings[i - 1] + 1) {
      errors.push(`Skipped level: h${headings[i - 1]} → h${headings[i]}`);
    }
  }
  return { valid: errors.length === 0, errors };
};

const good = [1, 2, 3, 3, 2, 3];
const bad = [2, 4, 1, 3];
console.log(`   Good [${good}]: ${JSON.stringify(validateHeadings(good))}`);
console.log(`   Bad  [${bad}]: ${JSON.stringify(validateHeadings(bad))}`);

// ─── D: Interactive Elements ────────────────────────────────────
console.log("\nD: Native vs DIY Interactive Elements:");
const comparisons = [
  { native: "<button>",   diy: '<div onclick>', freeFeatures: "focus, Enter/Space, role=button, disabled" },
  { native: "<a href>",   diy: '<span onclick>', freeFeatures: "focus, Enter, role=link, visited state" },
  { native: "<input>",    diy: '<div contenteditable>', freeFeatures: "focus, label, validation, autocomplete" },
  { native: "<select>",   diy: '<div> dropdown', freeFeatures: "keyboard nav, role=listbox, arrow keys" },
];

comparisons.forEach(({ native, diy, freeFeatures }) => {
  console.log(`   ${native.padEnd(12)} vs ${diy.padEnd(22)} → Free: ${freeFeatures}`);
});

// ─── E: Table Semantics ─────────────────────────────────────────
console.log("\nE: Accessible Table Structure:");
const table = {
  caption: "Sales Report Q4",
  headers: ["Product", "Units", "Revenue"],
  rows: [
    ["Widget A", 150, "$4,500"],
    ["Widget B", 89, "$2,670"],
  ]
};

console.log(`   <caption>: "${table.caption}" (screen readers announce this)`);
console.log(`   <th> scope="col": ${table.headers.join(", ")}`);
table.rows.forEach((row, i) => {
  console.log(`   Row ${i + 1}: ${row.map((cell, j) => `${table.headers[j]}="${cell}"`).join(", ")}`);
});

// ─── F: Form Semantics ─────────────────────────────────────────
console.log("\nF: Accessible Form Patterns:");
const formPatterns = [
  { pattern: '<label for="email">Email</label><input id="email">', result: "Explicit association" },
  { pattern: '<label>Email <input></label>', result: "Implicit wrapping" },
  { pattern: '<input aria-label="Email">', result: "ARIA label (no visible label)" },
  { pattern: '<fieldset><legend>Address</legend>...</fieldset>', result: "Group related fields" },
];

formPatterns.forEach(({ pattern, result }) => {
  console.log(`   ${result}`);
  console.log(`     ${pattern}`);
});

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║ INTERVIEW ANSWER: "Semantic HTML provides built-in             ║
 * ║ accessibility — landmark roles, keyboard interaction, and      ║
 * ║ screen reader support for free. <button> gives you focus,      ║
 * ║ Enter/Space activation, and role=button automatically. A div   ║
 * ║ with onclick gives you nothing. Always use native elements     ║
 * ║ first, ARIA only as a last resort."                            ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * RUN: node docs/javascript/30-wcag-a11y-lighthouse/01-semantic-html.js
 */
