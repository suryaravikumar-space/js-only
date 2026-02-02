/**
 * PERFORMANCE: 11 - Font Optimization
 *
 * ONE CONCEPT: Load fonts without blocking render or causing layout shifts
 */


// =============================================================================
// FONT LOADING PROBLEMS
// =============================================================================

console.log('=== Font Optimization ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  FONT LOADING PROBLEMS                                              │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  FOIT (Flash of Invisible Text):                                    │
 *   │  Text invisible until font loads → blank page for 1-3s            │
 *   │  Default behavior in most browsers                                 │
 *   │                                                                      │
 *   │  FOUT (Flash of Unstyled Text):                                    │
 *   │  Shows fallback font first → swaps when font loads               │
 *   │  Better UX (content visible immediately)                           │
 *   │  Causes CLS (layout shift when font swaps)                        │
 *   │                                                                      │
 *   │  font-display property:                                             │
 *   │  ┌──────────┬──────────────────────────────────────────────┐       │
 *   │  │ Value    │ Behavior                                     │       │
 *   │  ├──────────┼──────────────────────────────────────────────┤       │
 *   │  │ auto     │ Browser decides (usually FOIT)               │       │
 *   │  │ swap     │ Show fallback immediately, swap when ready  │       │
 *   │  │ block    │ Hide text briefly (3s), then fallback       │       │
 *   │  │ fallback │ Very short block (100ms), short swap window │       │
 *   │  │ optional │ Very short block, may never swap (best perf)│       │
 *   │  └──────────┴──────────────────────────────────────────────┘       │
 *   │                                                                      │
 *   │  Recommended: font-display: swap (for body text)                  │
 *   │               font-display: optional (for non-critical fonts)     │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('FOIT: invisible text until font loads (bad)');
console.log('FOUT: fallback font then swap (better, causes CLS)');
console.log('font-display: swap → show text immediately');
console.log('font-display: optional → may skip font (best perf)');


// =============================================================================
// OPTIMIZATION TECHNIQUES
// =============================================================================

console.log('\n=== Font Optimization Checklist ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  FONT OPTIMIZATION CHECKLIST                                        │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  1. PRELOAD critical fonts                                          │
 *   │     <link rel="preload" href="/font.woff2"                        │
 *   │           as="font" type="font/woff2" crossorigin>                │
 *   │                                                                      │
 *   │  2. Use WOFF2 format (30% smaller than WOFF)                      │
 *   │     Modern browsers all support it                                 │
 *   │                                                                      │
 *   │  3. SUBSET fonts (only include needed characters)                  │
 *   │     Full font: 200KB → Latin subset: 20KB                         │
 *   │     unicode-range: U+0000-00FF; /* Latin only */                   │
 *   │                                                                      │
 *   │  4. Use font-display: swap                                         │
 *   │     @font-face {                                                    │
 *   │       font-family: 'MyFont';                                       │
 *   │       src: url('/font.woff2') format('woff2');                    │
 *   │       font-display: swap;                                           │
 *   │     }                                                               │
 *   │                                                                      │
 *   │  5. Match fallback font metrics (reduce CLS)                      │
 *   │     Use size-adjust, ascent-override, descent-override            │
 *   │     Tools: fontaine, next/font                                     │
 *   │                                                                      │
 *   │  6. Self-host instead of Google Fonts                              │
 *   │     Eliminates DNS lookup + connection to fonts.googleapis.com    │
 *   │                                                                      │
 *   │  7. Use system font stack when possible                           │
 *   │     font-family: system-ui, -apple-system, sans-serif;           │
 *   │     Zero font loading time!                                        │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

const checklist = [
  'Preload critical fonts',
  'Use WOFF2 format (30% smaller)',
  'Subset fonts (Latin only: 200KB → 20KB)',
  'font-display: swap',
  'Match fallback metrics (size-adjust)',
  'Self-host (skip Google Fonts DNS)',
  'Consider system font stack (zero load)',
];
checklist.forEach((item, i) => console.log(`  ${i + 1}. ${item}`));


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "Fonts are a hidden performance cost. Without optimization, text is
 * invisible until the font downloads (FOIT). I use font-display: swap
 * so text appears immediately in a fallback font, then swaps when the
 * custom font loads.
 *
 * I preload critical fonts with <link rel='preload'> to start the
 * download early. I use WOFF2 exclusively since it's 30% smaller than
 * WOFF with universal browser support. I subset fonts to include only
 * Latin characters, reducing a 200KB font file to 20KB.
 *
 * To minimize CLS from font swapping, I use CSS size-adjust and
 * ascent/descent-override to match the fallback font's metrics to the
 * custom font. Next.js does this automatically with next/font.
 *
 * For maximum performance, I prefer self-hosting fonts to eliminate
 * the extra DNS lookup and connection to Google Fonts. For internal
 * tools, I use the system font stack with zero loading time."
 */


// RUN: node docs/30-performance/11-font-optimization.js
