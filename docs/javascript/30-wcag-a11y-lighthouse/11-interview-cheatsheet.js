/**
 * TOPIC: WCAG/A11y/Lighthouse Interview Cheatsheet
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║                    THE GOLDEN RULE                               ║
 * ║  Accessibility is not optional. It's LEGAL, ETHICAL, and GOOD  ║
 * ║  BUSINESS. 15% of the world has a disability. Make it work.     ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────────┐
 * │ This is your interview cheat sheet. Memorize POUR, 4.5:1       │
 * │ contrast, LCP <2.5s, and the first rule of ARIA.              │
 * └───────────────────────────────────────────────────────────────┘
 */

console.log("=== WCAG/A11y/Lighthouse Interview Cheatsheet ===\n");

// ─── Q1: WCAG Basics ────────────────────────────────────────────
console.log("Q1: === WCAG Principles & Levels ===");
console.log("   POUR:");
console.log("     P - Perceivable: Users can perceive content (alt text, captions)");
console.log("     O - Operable: Users can operate interface (keyboard access)");
console.log("     U - Understandable: Users understand content & interface");
console.log("     R - Robust: Works with assistive technologies");
console.log("");
console.log("   Levels:");
console.log("     A   - Minimum (law rarely requires this alone)");
console.log("     AA  - Standard (ADA, EAA, Section 508 require AA)");
console.log("     AAA - Gold standard (nice to have, not always required)");
console.log("");
console.log("   Key AA criteria:");
console.log("     - Contrast 4.5:1 normal text, 3:1 large text");
console.log("     - Keyboard accessible");
console.log("     - Form labels");
console.log("     - Logical heading order");
console.log("     - Zoom to 200% without horizontal scroll");

// ─── Q2: ARIA Rules ─────────────────────────────────────────────
console.log("\nQ2: === 5 Rules of ARIA ===");
[
  "Don't use ARIA if native HTML works",
  "Don't change native semantics",
  "All interactive ARIA controls must be keyboard accessible",
  "Don't use role='presentation' or aria-hidden on focusable elements",
  "All interactive elements must have an accessible name",
].forEach((rule, i) => console.log(`   ${i + 1}. ${rule}`));

console.log("\n   Common ARIA attributes:");
console.log("     aria-label: Inline label (no visible text)");
console.log("     aria-labelledby: Reference another element's text");
console.log("     aria-describedby: Additional description");
console.log("     aria-expanded: true/false for collapsible content");
console.log("     aria-live: polite (status) / assertive (errors)");
console.log("     aria-hidden: true removes from accessibility tree");

// ─── Q3: Keyboard Accessibility ─────────────────────────────────
console.log("\nQ3: === Keyboard Accessibility ===");
console.log("   tabindex values:");
console.log("     0  → Natural tab order (USE THIS)");
console.log("     -1 → Focusable via JS only (skip links, modal first element)");
console.log("     1+ → Forces order (NEVER DO THIS — breaks natural flow)");
console.log("");
console.log("   Key bindings:");
console.log("     Tab/Shift+Tab → Navigate");
console.log("     Enter/Space   → Activate button");
console.log("     Escape        → Close dialog/dropdown");
console.log("     Arrow keys    → Navigate within widgets (tabs, menus)");
console.log("");
console.log("   Patterns:");
console.log("     Focus trap: Modal keeps focus inside, cycles with Tab");
console.log("     Roving tabindex: Only 1 item has tabindex=0, arrows move it");
console.log("     Skip link: <a href='#main' class='skip-link'>Skip to main</a>");

// ─── Q4: Color Contrast ─────────────────────────────────────────
console.log("\nQ4: === Color Contrast ===");
console.log("   WCAG AA:");
console.log("     Normal text (<18pt): 4.5:1");
console.log("     Large text (≥18pt or ≥14pt bold): 3:1");
console.log("     UI components & graphics: 3:1");
console.log("");
console.log("   WCAG AAA:");
console.log("     Normal text: 7:1");
console.log("     Large text: 4.5:1");
console.log("");
console.log("   Formula:");
console.log("     Contrast = (L_lighter + 0.05) / (L_darker + 0.05)");
console.log("     L = relative luminance (0=black, 1=white)");
console.log("");
console.log("   Never rely on color alone:");
console.log("     Use icons, patterns, or text labels as redundant cues");

// ─── Q5: Screen Readers ─────────────────────────────────────────
console.log("\nQ5: === Screen Readers ===");
console.log("   How they work:");
console.log("     - Read the ACCESSIBILITY TREE (not the DOM)");
console.log("     - A11y tree = DOM + ARIA - hidden elements");
console.log("     - Reading order = DOM order (not visual CSS order)");
console.log("");
console.log("   Popular screen readers:");
console.log("     JAWS (Windows) ~40%, NVDA (Windows) ~30%, VoiceOver (macOS/iOS) ~20%");
console.log("");
console.log("   Live regions:");
console.log("     aria-live='polite' → Announced after current speech");
console.log("     aria-live='assertive' → Interrupts immediately");
console.log("     role='alert' → Shorthand for assertive + atomic");

// ─── Q6: Forms ──────────────────────────────────────────────────
console.log("\nQ6: === Forms Accessibility ===");
console.log("   Every input MUST have a label:");
console.log("     <label for='email'>Email</label><input id='email'> (BEST)");
console.log("     <label>Email <input></label> (wrapping works)");
console.log("     <input aria-label='Email'> (no visible label)");
console.log("     Placeholder is NOT a label (disappears on type)");
console.log("");
console.log("   Validation:");
console.log("     aria-invalid='true' when error");
console.log("     aria-describedby='error-id' links to error message");
console.log("     role='alert' announces errors");
console.log("");
console.log("   Required fields:");
console.log("     <input required> (HTML5 validation + SR announces)");
console.log("     aria-required='true' (SR announces, no browser validation)");

// ─── Q7: Images & Media ─────────────────────────────────────────
console.log("\nQ7: === Images & Media ===");
console.log("   Alt text decision tree:");
console.log("     Decorative → alt='' (empty, not missing)");
console.log("     Informative → alt='describe content'");
console.log("     Complex → alt='summary' + longdesc or aria-describedby");
console.log("     Link image → alt='destination or purpose'");
console.log("");
console.log("   Video:");
console.log("     Captions (WCAG 1.2.2 A) for deaf users");
console.log("     Audio descriptions (WCAG 1.2.5 AA) for blind users");
console.log("     <track kind='captions' src='captions.vtt'>");

// ─── Q8: Responsive A11y ────────────────────────────────────────
console.log("\nQ8: === Responsive Accessibility ===");
console.log("   WCAG 1.4.4 (AA): Zoom to 200% without horizontal scroll");
console.log("   WCAG 1.4.10 (AA): Reflow to 320px (400% zoom)");
console.log("   WCAG 2.5.5 (AAA): Touch targets ≥44x44px");
console.log("   WCAG 2.5.8 (AA): Touch targets ≥24x24px (WCAG 2.2)");
console.log("   WCAG 1.3.4 (AA): Don't lock orientation");
console.log("   WCAG 1.4.12 (AA): Text spacing overridable without breaking");

// ─── Q9: Lighthouse ─────────────────────────────────────────────
console.log("\nQ9: === Lighthouse ===");
console.log("   5 categories:");
console.log("     Performance, Accessibility, Best Practices, SEO, PWA");
console.log("");
console.log("   Core Web Vitals:");
console.log("     LCP (Largest Contentful Paint) <2.5s");
console.log("     CLS (Cumulative Layout Shift) <0.1");
console.log("     INP (Interaction to Next Paint) <200ms");
console.log("");
console.log("   Common fixes:");
console.log("     Images: WebP, lazy load, set width/height");
console.log("     Render-blocking: async/defer JS, inline critical CSS");
console.log("     CLS: Set dimensions on images, font-display: swap");
console.log("     LCP: Preload hero image, optimize TTFB");
console.log("     Caching: Cache-Control headers, CDN");

// ─── Q10: Quick Fire ────────────────────────────────────────────
console.log("\nQ10: === Quick-Fire Answers ===");
const qa = [
  ["Semantic HTML vs div-soup?", "Semantic = free a11y (roles, keyboard). Div = manual ARIA work."],
  ["First rule of ARIA?", "Don't use ARIA if native HTML works. <button> > <div role='button'>"],
  ["How to hide decorative images?", "alt='' (empty) OR aria-hidden='true' on decorative SVG"],
  ["Focus visible requirement?", "WCAG 2.4.7 AA: focus indicator must be visible. Never outline:none without replacement."],
  ["Screen reader reading order?", "Follows DOM order, NOT visual CSS order. Mismatch = confusing."],
  ["aria-label vs aria-labelledby?", "aria-labelledby references another element (wins in priority). aria-label is inline."],
  ["When to use aria-live?", "Status updates (polite), errors (assertive). Not for initial content."],
  ["Contrast for UI components?", "3:1 minimum (WCAG 1.4.11 AA). Text is 4.5:1."],
  ["How to test a11y?", "axe DevTools, Lighthouse, WAVE, manual keyboard/SR testing, real users."],
  ["Legal requirement?", "ADA (USA), EAA (EU), AODA (Canada) all require WCAG 2.1 AA minimum."],
];

qa.forEach(([q, a]) => {
  console.log(`   Q: ${q}`);
  console.log(`   A: ${a}\n`);
});

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║ INTERVIEW ANSWER: "WCAG = POUR principles, AA level standard.  ║
 * ║ First rule of ARIA: don't use if native HTML works. Contrast:  ║
 * ║ 4.5:1 normal, 3:1 large. Keyboard: everything accessible via   ║
 * ║ Tab/Enter/Space/Escape. Screen readers read a11y tree in DOM   ║
 * ║ order. Lighthouse: LCP <2.5s, CLS <0.1, INP <200ms. Test with  ║
 * ║ axe, keyboard, and real screen readers."                       ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * RUN: node docs/javascript/30-wcag-a11y-lighthouse/11-interview-cheatsheet.js
 */
