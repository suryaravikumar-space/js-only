/**
 * TOPIC: Lighthouse Optimization Techniques
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║                    THE GOLDEN RULE                               ║
 * ║  Optimize images (WebP, lazy load). Eliminate render-blocking.  ║
 * ║  Remove unused JS/CSS. Preload critical resources. Cache.       ║
 * ║  Fix CLS (set dimensions). Fix LCP (preload hero image).        ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────────┐
 * │ Lighthouse is like a restaurant health inspection. Failed      │
 * │ audits = health code violations. Image optimization = clean    │
 * │ kitchen. Render-blocking = customers waiting at the door.      │
 * │ CLS = tables moving while customers sit. Fix the violations.  │
 * └───────────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────────────┐
 * │  Common Lighthouse Issues → Fixes:                            │
 * │  ┌────────────────────────────────┬──────────────────────┐    │
 * │  │ Oversized images               │ WebP, srcset, lazy   │    │
 * │  │ Render-blocking CSS/JS         │ async/defer, critical│    │
 * │  │ Unused CSS/JS                  │ Code split, purge    │    │
 * │  │ CLS (layout shift)             │ Set width/height     │    │
 * │  │ LCP slow                       │ Preload, optimize    │    │
 * │  │ Missing caching                │ Cache-Control header │    │
 * │  └────────────────────────────────┴──────────────────────┘    │
 * └───────────────────────────────────────────────────────────────┘
 */

// ─── A: Image Optimization ──────────────────────────────────────
console.log("A: Image Optimization Fixes:");

const imageOptimizations = [
  { issue: "Large file size", fix: "Use WebP/AVIF instead of JPEG/PNG", savings: "~30-50% smaller" },
  { issue: "Wrong dimensions", fix: "Use <img srcset> for responsive images", savings: "Load correct size" },
  { issue: "Offscreen images", fix: "Lazy load with loading='lazy'", savings: "Faster initial load" },
  { issue: "No explicit size", fix: "Set width/height to prevent CLS", savings: "Zero layout shift" },
  { issue: "Unoptimized", fix: "Use CDN with automatic optimization (Cloudinary, Imgix)", savings: "Auto format/compress" },
];

imageOptimizations.forEach(({ issue, fix, savings }) => {
  console.log(`   Issue: ${issue}`);
  console.log(`   Fix: ${fix}`);
  console.log(`   Savings: ${savings}\n`);
});

console.log("   Example:");
console.log('   <img src="hero.jpg" alt="Hero" width="800" height="600" loading="lazy"');
console.log('        srcset="hero-400.webp 400w, hero-800.webp 800w"');
console.log('        sizes="(max-width: 600px) 400px, 800px">');

// ─── B: Render-Blocking Resources ───────────────────────────────
console.log("\n\nB: Eliminating Render-Blocking:");

const renderBlockingFixes = [
  { resource: "CSS in <head>", fix: "Inline critical CSS, async load rest", example: '<link rel="stylesheet" href="style.css" media="print" onload="this.media=\'all\'">' },
  { resource: "External JS in <head>", fix: "Add defer or async attribute", example: '<script src="app.js" defer></script>' },
  { resource: "Google Fonts", fix: "Preconnect or self-host", example: '<link rel="preconnect" href="https://fonts.googleapis.com">' },
  { resource: "Third-party scripts", fix: "Load after page interactive", example: 'window.addEventListener("load", () => loadAnalytics())' },
];

renderBlockingFixes.forEach(({ resource, fix, example }) => {
  console.log(`   ${resource}:`);
  console.log(`     Fix: ${fix}`);
  console.log(`     Example: ${example}\n`);
});

// ─── C: Unused CSS/JS ───────────────────────────────────────────
console.log("C: Remove Unused Code:");

console.log("   Problem: Shipping entire Bootstrap/Tailwind CSS when using 10%");
console.log("   Tools:");
console.log("     - PurgeCSS: Removes unused CSS");
console.log("     - Webpack tree shaking: Removes unused JS exports");
console.log("     - Chrome DevTools Coverage: Shows unused code %");
console.log("   Fix: Code-split by route, lazy load components");
console.log("   Example:");
console.log('     const Modal = lazy(() => import("./Modal"));');
console.log('     <Suspense fallback={<Spinner />}><Modal /></Suspense>');

// ─── D: Fixing CLS (Cumulative Layout Shift) ────────────────────
console.log("\n\nD: Fixing CLS (Cumulative Layout Shift):");

const clsFixes = [
  { cause: "Images without dimensions", fix: "Set width & height attributes", example: '<img width="800" height="600" src="...">' },
  { cause: "Web fonts loading", fix: "Use font-display: swap + preload", example: "@font-face { font-display: swap; }" },
  { cause: "Ads/embeds injecting", fix: "Reserve space with min-height", example: ".ad-slot { min-height: 250px; }" },
  { cause: "Dynamic content", fix: "Use skeleton screens", example: "<div class='skeleton-loader'></div>" },
];

clsFixes.forEach(({ cause, fix, example }) => {
  console.log(`   Cause: ${cause}`);
  console.log(`   Fix: ${fix}`);
  console.log(`   Example: ${example}\n`);
});

// ─── E: Fixing LCP (Largest Contentful Paint) ───────────────────
console.log("E: Fixing LCP:");

const lcpFixes = [
  { strategy: "Preload hero image", code: '<link rel="preload" as="image" href="hero.jpg">' },
  { strategy: "Optimize server response (TTFB)", code: "Use CDN, edge caching, server-side rendering" },
  { strategy: "Remove render-blocking CSS", code: "Inline critical CSS in <head>" },
  { strategy: "Compress images", code: "Use WebP, optimize quality" },
  { strategy: "Use priority hints", code: '<img fetchpriority="high" src="hero.jpg">' },
];

lcpFixes.forEach(({ strategy, code }) => {
  console.log(`   Strategy: ${strategy}`);
  console.log(`   Code: ${code}\n`);
});

// ─── F: Caching Strategy ────────────────────────────────────────
console.log("F: Caching Headers:");

const cacheHeaders = [
  { resource: "Immutable assets (with hash)", header: "Cache-Control: public, max-age=31536000, immutable" },
  { resource: "HTML (frequently updated)", header: "Cache-Control: no-cache" },
  { resource: "API responses", header: "Cache-Control: private, max-age=300" },
  { resource: "Static assets (no hash)", header: "Cache-Control: public, max-age=86400, must-revalidate" },
];

cacheHeaders.forEach(({ resource, header }) => {
  console.log(`   ${resource}:`);
  console.log(`     ${header}\n`);
});

// ─── G: Optimization Checklist ──────────────────────────────────
console.log("G: Lighthouse Optimization Checklist:");

const checklist = [
  { category: "Images", tasks: ["Convert to WebP", "Add lazy loading", "Set width/height", "Use srcset"] },
  { category: "JS", tasks: ["Code split by route", "Tree shake unused", "Minify & compress", "Defer non-critical"] },
  { category: "CSS", tasks: ["Inline critical CSS", "Remove unused (PurgeCSS)", "Minify", "Async load non-critical"] },
  { category: "Fonts", tasks: ["Use font-display: swap", "Preload font files", "Subset fonts", "Self-host if possible"] },
  { category: "CWV", tasks: ["Fix CLS (set dimensions)", "Fix LCP (preload hero)", "Fix INP (debounce handlers)"] },
  { category: "Caching", tasks: ["Add Cache-Control headers", "Use service worker", "CDN for static assets"] },
];

checklist.forEach(({ category, tasks }) => {
  console.log(`   ${category}:`);
  tasks.forEach(task => console.log(`     ☐ ${task}`));
  console.log();
});

// ─── H: Performance Budget Example ──────────────────────────────
console.log("H: Performance Budget:");

const budget = {
  "Performance Score": { target: 90, current: 85, status: "FAIL" },
  "LCP": { target: "2.5s", current: "2.8s", status: "NEEDS IMPROVEMENT" },
  "CLS": { target: "0.1", current: "0.05", status: "PASS" },
  "Bundle Size (JS)": { target: "200KB", current: "180KB", status: "PASS" },
  "Total Page Weight": { target: "1MB", current: "1.2MB", status: "FAIL" },
};

Object.entries(budget).forEach(([metric, { target, current, status }]) => {
  console.log(`   ${metric.padEnd(22)} → Target: ${String(target).padEnd(8)} Current: ${String(current).padEnd(8)} [${status}]`);
});

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║ INTERVIEW ANSWER: "To optimize Lighthouse scores: convert      ║
 * ║ images to WebP with lazy loading and srcset, eliminate render- ║
 * ║ blocking CSS/JS with async/defer, remove unused code with       ║
 * ║ tree shaking, fix CLS by setting image dimensions, fix LCP by  ║
 * ║ preloading hero images, cache static assets with Cache-Control.║
 * ║ Use lighthouse-ci with budgets for CI/CD regression testing."  ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * RUN: node docs/javascript/30-wcag-a11y-lighthouse/10-lighthouse-optimization.js
 */
