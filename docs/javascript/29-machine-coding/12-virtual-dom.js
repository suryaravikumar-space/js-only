/**
 * MACHINE CODING: 12 - Virtual DOM (Diffing & Patching)
 *
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║  GOLDEN RULE: Build a lightweight JS tree (vDOM), diff two trees to    ║
 * ║  find minimal patches, then apply patches to the real DOM.             ║
 * ║  createElement -> diff -> patch is the core cycle.                     ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 *
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │  STORY TO REMEMBER: Two blueprints of a house (old & new vDOM).        │
 * │  A contractor (diff) compares them and writes a change list (patches). │
 * │  A builder (patch) applies only those changes to the real house.       │
 * └──────────────────────────────────────────────────────────────────────────┘
 *
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │  VISUAL DIAGRAM                                                        │
 * │                                                                        │
 * │   Old Tree          New Tree           Patches                         │
 * │   div               div                                                │
 * │   ├─ h1("Hi")       ├─ h1("Hello")     [REPLACE text in h1]           │
 * │   └─ p("world")     ├─ p("world")      [ADD span]                     │
 * │                      └─ span("!")                                      │
 * └──────────────────────────────────────────────────────────────────────────┘
 *
 * PROBLEM: Implement createElement(type, props, children), diff(oldTree, newTree),
 *          and patch(node, patches). Simulate VDOM diffing.
 *
 * RUN: node docs/javascript/29-machine-coding/12-virtual-dom.js
 */

// ═══════════════════════════════════════════════════════════════════════════
// IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════════

const PATCH_TYPES = {
  CREATE: "CREATE",
  REMOVE: "REMOVE",
  REPLACE: "REPLACE",
  UPDATE_PROPS: "UPDATE_PROPS",
  UPDATE_CHILDREN: "UPDATE_CHILDREN",
};

function createElement(type, props = {}, ...children) {
  return {
    type,
    props,
    children: children.flat(),
  };
}

// ─── Diff: compare old and new trees, return patches ─────────────────────

function diff(oldNode, newNode) {
  // Node added
  if (oldNode === undefined || oldNode === null) {
    return { type: PATCH_TYPES.CREATE, newNode };
  }
  // Node removed
  if (newNode === undefined || newNode === null) {
    return { type: PATCH_TYPES.REMOVE };
  }
  // Text node changed or type changed
  if (typeof oldNode !== typeof newNode ||
      typeof oldNode === "string" && oldNode !== newNode ||
      oldNode.type !== newNode.type) {
    return { type: PATCH_TYPES.REPLACE, newNode };
  }
  // Both are strings and equal
  if (typeof oldNode === "string") return null;

  // Same type element - check props and children
  const propPatches = diffProps(oldNode.props, newNode.props);
  const childPatches = diffChildren(oldNode.children, newNode.children);

  if (propPatches.length === 0 && childPatches.every((p) => p === null)) {
    return null; // No changes
  }

  return {
    type: PATCH_TYPES.UPDATE_CHILDREN,
    propPatches,
    childPatches,
  };
}

function diffProps(oldProps = {}, newProps = {}) {
  const patches = [];
  const allKeys = new Set([...Object.keys(oldProps), ...Object.keys(newProps)]);
  for (const key of allKeys) {
    if (oldProps[key] !== newProps[key]) {
      patches.push({ key, value: newProps[key] ?? null });
    }
  }
  return patches;
}

function diffChildren(oldChildren = [], newChildren = []) {
  const patches = [];
  const maxLen = Math.max(oldChildren.length, newChildren.length);
  for (let i = 0; i < maxLen; i++) {
    patches.push(diff(oldChildren[i], newChildren[i]));
  }
  return patches;
}

// ─── Patch: apply patches to a simulated DOM node ────────────────────────

function renderNode(vNode) {
  if (typeof vNode === "string") return { text: vNode };
  return {
    tag: vNode.type,
    props: { ...vNode.props },
    children: (vNode.children || []).map(renderNode),
  };
}

function applyPatch(domNode, patch) {
  if (!patch) return domNode;

  switch (patch.type) {
    case PATCH_TYPES.CREATE:
      return renderNode(patch.newNode);
    case PATCH_TYPES.REMOVE:
      return null;
    case PATCH_TYPES.REPLACE:
      return renderNode(patch.newNode);
    case PATCH_TYPES.UPDATE_CHILDREN: {
      // Apply prop patches
      if (patch.propPatches) {
        for (const pp of patch.propPatches) {
          if (pp.value === null) delete domNode.props[pp.key];
          else domNode.props[pp.key] = pp.value;
        }
      }
      // Apply child patches
      if (patch.childPatches) {
        const newChildren = [];
        const maxLen = Math.max(
          domNode.children.length,
          patch.childPatches.length
        );
        for (let i = 0; i < maxLen; i++) {
          const child = domNode.children[i];
          const cp = patch.childPatches[i];
          const result = applyPatch(child, cp);
          if (result !== null) newChildren.push(result);
        }
        domNode.children = newChildren;
      }
      return domNode;
    }
    default:
      return domNode;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST CASES
// ═══════════════════════════════════════════════════════════════════════════

const h = createElement; // alias

console.log("═══ TEST A: createElement ═══");
const tree1 = h("div", { id: "app" }, h("h1", {}, "Hello"), h("p", {}, "World"));
console.log("A: vDOM tree:", JSON.stringify(tree1, null, 2));

console.log("\n═══ TEST B: Diff - text change ═══");
const oldTree = h("div", {}, h("h1", {}, "Hi"));
const newTree = h("div", {}, h("h1", {}, "Hello"));
const patches = diff(oldTree, newTree);
console.log("B: Patches:", JSON.stringify(patches, null, 2));

console.log("\n═══ TEST C: Diff - added child ═══");
const old2 = h("div", {}, "one");
const new2 = h("div", {}, "one", "two");
console.log("C: Patches:", JSON.stringify(diff(old2, new2), null, 2));

console.log("\n═══ TEST D: Diff - removed child ═══");
const old3 = h("div", {}, "a", "b", "c");
const new3 = h("div", {}, "a", "b");
console.log("D: Patches:", JSON.stringify(diff(old3, new3), null, 2));

console.log("\n═══ TEST E: Diff - type change ═══");
const old4 = h("div", {}, h("span", {}, "text"));
const new4 = h("div", {}, h("p", {}, "text"));
console.log("E: Patches:", JSON.stringify(diff(old4, new4), null, 2));

console.log("\n═══ TEST F: Render and patch cycle ═══");
const vOld = h("div", { class: "app" }, h("h1", {}, "Old Title"), h("p", {}, "Body"));
const vNew = h("div", { class: "app" }, h("h1", {}, "New Title"), h("p", {}, "Body"));
let dom = renderNode(vOld);
console.log("F: Before:", JSON.stringify(dom));
const ps = diff(vOld, vNew);
dom = applyPatch(dom, ps);
console.log("F: After:", JSON.stringify(dom));

console.log("\n═══ TEST G: Prop change ═══");
const vOld2 = h("div", { class: "old", id: "x" });
const vNew2 = h("div", { class: "new" });
console.log("G: Prop diff:", JSON.stringify(diff(vOld2, vNew2), null, 2));

// ═══════════════════════════════════════════════════════════════════════════
// FOLLOW-UP QUESTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * 1. How would you handle keyed children for list reordering?
 * 2. How does React Fiber improve on this naive approach?
 * 3. What is the time complexity of the diff algorithm?
 * 4. How would you batch DOM updates for performance?
 * 5. How would you handle event listeners in props?
 */

// ═══════════════════════════════════════════════════════════════════════════
// INTERVIEW ANSWER
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║  "Virtual DOM uses plain JS objects to represent the UI tree.          ║
 * ║  createElement builds vNodes. diff recursively compares old/new trees  ║
 * ║  producing a minimal patch list. patch applies changes to real DOM.    ║
 * ║  This avoids expensive full re-renders. Time: O(n) for n nodes.       ║
 * ║  React further optimizes with keys and fiber for async rendering."     ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */
