/**
 * TOPIC: Screen Readers & Accessibility Tree
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║                    THE GOLDEN RULE                               ║
 * ║  Screen readers read the ACCESSIBILITY TREE, not the DOM.       ║
 * ║  The a11y tree = DOM + ARIA - hidden elements.                  ║
 * ║  What you see visually ≠ what a screen reader announces.        ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────────┐
 * │ The DOM is the architect's blueprint. The accessibility tree   │
 * │ is the audio tour guide's script. The guide skips decorative   │
 * │ walls (aria-hidden), describes important art (alt text), and   │
 * │ announces room changes (live regions). If your blueprint has   │
 * │ no labels, the guide has nothing useful to say.                │
 * └───────────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────────────┐
 * │  DOM Tree ──→ Browser ──→ Accessibility Tree ──→ Screen Reader│
 * │                              │                                 │
 * │                   Includes:  │  Excludes:                      │
 * │                   - roles    │  - aria-hidden="true"           │
 * │                   - names    │  - display:none                 │
 * │                   - states   │  - visibility:hidden            │
 * │                   - values   │  - role="presentation"          │
 * └───────────────────────────────────────────────────────────────┘
 */

// ─── A: Building an Accessibility Tree ──────────────────────────
console.log("A: DOM → Accessibility Tree:");

const buildA11yTree = (domNode) => {
  if (domNode.ariaHidden === "true" || domNode.display === "none") return null;
  if (domNode.role === "presentation" || domNode.role === "none") return null;

  const roleMap = {
    button: "button", a: "link", input: "textbox", h1: "heading",
    nav: "navigation", main: "main", img: "img", ul: "list", li: "listitem",
  };

  const node = {
    role: domNode.role || roleMap[domNode.tag] || "generic",
    name: domNode.ariaLabel || domNode.alt || domNode.textContent || "",
  };

  if (domNode.ariaExpanded !== undefined) node.expanded = domNode.ariaExpanded;
  if (domNode.ariaChecked !== undefined) node.checked = domNode.ariaChecked;
  if (domNode.children) {
    node.children = domNode.children.map(buildA11yTree).filter(Boolean);
  }
  return node;
};

const dom = {
  tag: "main", children: [
    { tag: "h1", textContent: "Dashboard" },
    { tag: "nav", ariaLabel: "Main menu", children: [
      { tag: "a", textContent: "Home" },
      { tag: "a", textContent: "Settings" },
    ]},
    { tag: "img", alt: "Sales chart" },
    { tag: "img", alt: "", ariaHidden: "true" },
    { tag: "button", textContent: "Submit", ariaExpanded: false },
  ]
};

const a11yTree = buildA11yTree(dom);
console.log(JSON.stringify(a11yTree, null, 2));

// ─── B: Screen Reader Announcements ─────────────────────────────
console.log("\nB: What Screen Readers Announce:");

const announce = (node, depth = 0) => {
  const indent = "   ".repeat(depth);
  const parts = [];
  if (node.role && node.role !== "generic") parts.push(node.role);
  if (node.name) parts.push(`"${node.name}"`);
  if (node.expanded !== undefined) parts.push(node.expanded ? "expanded" : "collapsed");
  if (node.checked !== undefined) parts.push(node.checked ? "checked" : "not checked");
  if (parts.length > 0) console.log(`${indent}${parts.join(", ")}`);
  (node.children || []).forEach(child => announce(child, depth + 1));
};

announce(a11yTree);

// ─── C: Reading Order vs Visual Order ───────────────────────────
console.log("\nC: Reading Order (DOM order) vs Visual Order (CSS):");
const elements = [
  { dom: 1, visual: 3, text: "Sidebar (flex order: 3)" },
  { dom: 2, visual: 1, text: "Header (flex order: 1)" },
  { dom: 3, visual: 2, text: "Main Content (flex order: 2)" },
];
console.log("   DOM order (screen reader reads this):");
elements.sort((a, b) => a.dom - b.dom).forEach(el => console.log(`     ${el.dom}. ${el.text}`));
console.log("   Visual order (what sighted users see):");
elements.sort((a, b) => a.visual - b.visual).forEach(el => console.log(`     ${el.visual}. ${el.text}`));
console.log("   Mismatch = confusing for screen reader users!");

// ─── D: Alt Text Best Practices ─────────────────────────────────
console.log("\nD: Alt Text Decision Tree:");
const altTextDecision = (image) => {
  if (image.isDecorative) return { alt: '""', reason: "Decorative → empty alt" };
  if (image.isChart) return { alt: image.description, reason: "Complex → detailed description" };
  if (image.isLink) return { alt: image.linkPurpose, reason: "Link image → describe destination" };
  return { alt: image.description, reason: "Informative → describe content" };
};

const images = [
  { name: "Divider line", isDecorative: true },
  { name: "Sales chart", isChart: true, description: "Sales grew 25% in Q4 2024" },
  { name: "Logo linking home", isLink: true, linkPurpose: "Go to homepage" },
  { name: "Team photo", description: "Engineering team at offsite 2024" },
];

images.forEach(img => {
  const { alt, reason } = altTextDecision(img);
  console.log(`   ${img.name}: alt=${alt} (${reason})`);
});

// ─── E: Live Regions ────────────────────────────────────────────
console.log("\nE: Live Region Announcements:");

class LiveRegionSimulator {
  constructor() { this.announcements = []; }

  announce = (message, priority = "polite") => {
    this.announcements.push({ message, priority, time: Date.now() });
    const prefix = priority === "assertive" ? "[INTERRUPTS]" : "[WAITS]";
    console.log(`   ${prefix} "${message}"`);
  };

  status = (msg) => this.announce(msg, "polite");
  alert = (msg) => this.announce(msg, "assertive");
}

const sr = new LiveRegionSimulator();
sr.status("3 items added to cart");
sr.alert("Error: Invalid email address");
sr.status("Form saved successfully");
sr.alert("Session expiring in 1 minute");

// ─── F: Common Screen Readers ───────────────────────────────────
console.log("\nF: Screen Reader Market Share:");
[
  { name: "JAWS",       platform: "Windows", share: "40%" },
  { name: "NVDA",       platform: "Windows", share: "30%" },
  { name: "VoiceOver",  platform: "macOS/iOS", share: "20%" },
  { name: "TalkBack",   platform: "Android", share: "8%" },
  { name: "Narrator",   platform: "Windows", share: "2%" },
].forEach(({ name, platform, share }) => {
  console.log(`   ${name.padEnd(12)} (${platform.padEnd(10)}) ~${share}`);
});

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║ INTERVIEW ANSWER: "Screen readers read the accessibility tree, ║
 * ║ not the DOM. The a11y tree includes roles, names, states, and  ║
 * ║ excludes aria-hidden/display:none elements. Reading order       ║
 * ║ follows DOM order, not CSS visual order. Use aria-live='polite'║
 * ║ for status updates and 'assertive' for errors. Alt text should ║
 * ║ be empty for decorative images, descriptive for informative."   ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * RUN: node docs/javascript/30-wcag-a11y-lighthouse/05-screen-readers.js
 */
