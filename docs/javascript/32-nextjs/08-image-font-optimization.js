/**
 * NEXT.JS: 08 - Image & Font Optimization
 *
 * ONE CONCEPT: Built-in components that optimize assets automatically
 */


// =============================================================================
// NEXT/IMAGE
// =============================================================================

console.log('=== next/image ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  NEXT.JS IMAGE COMPONENT                                            │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  import Image from 'next/image';                                   │
 *   │                                                                      │
 *   │  <Image                                                             │
 *   │    src="/hero.jpg"                                                  │
 *   │    width={1200}                                                     │
 *   │    height={600}                                                     │
 *   │    alt="Hero image"                                                 │
 *   │    priority         // ← LCP image: preload, no lazy             │
 *   │  />                                                                 │
 *   │                                                                      │
 *   │  AUTOMATIC OPTIMIZATIONS:                                           │
 *   │  ✓ Lazy loading (default for non-priority images)                 │
 *   │  ✓ Responsive srcset (multiple sizes generated)                   │
 *   │  ✓ WebP/AVIF conversion (modern formats)                          │
 *   │  ✓ Prevents CLS (width/height required)                           │
 *   │  ✓ Blur placeholder while loading                                  │
 *   │  ✓ On-demand optimization (not build-time)                        │
 *   │                                                                      │
 *   │  <Image                                                             │
 *   │    src="/photo.jpg"                                                 │
 *   │    fill                    // ← Fill parent container             │
 *   │    sizes="(max-width: 768px) 100vw, 50vw"                        │
 *   │    style={{ objectFit: 'cover' }}                                  │
 *   │    alt="Photo"                                                      │
 *   │    placeholder="blur"                                               │
 *   │    blurDataURL="data:image/..."                                   │
 *   │  />                                                                 │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('next/image: auto lazy load, WebP/AVIF, srcset, CLS prevention');
console.log('priority prop for LCP images (preloads, no lazy)');
console.log('fill + sizes for responsive container images');


// =============================================================================
// NEXT/FONT
// =============================================================================

console.log('\n=== next/font ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  NEXT.JS FONT OPTIMIZATION                                          │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  import { Inter } from 'next/font/google';                        │
 *   │  const inter = Inter({ subsets: ['latin'] });                     │
 *   │                                                                      │
 *   │  export default function Layout({ children }) {                    │
 *   │    return <html className={inter.className}>{children}</html>;    │
 *   │  }                                                                  │
 *   │                                                                      │
 *   │  AUTOMATIC OPTIMIZATIONS:                                           │
 *   │  ✓ Self-hosts fonts (no Google Fonts request)                     │
 *   │  ✓ Zero layout shift (CSS size-adjust applied)                    │
 *   │  ✓ Font files included in build (no external requests)           │
 *   │  ✓ Automatic subsetting                                            │
 *   │  ✓ font-display: swap by default                                  │
 *   │                                                                      │
 *   │  Local fonts:                                                       │
 *   │  import localFont from 'next/font/local';                         │
 *   │  const myFont = localFont({ src: './my-font.woff2' });           │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('next/font: self-hosted, zero CLS, auto-subset');
console.log('Google fonts downloaded at build time (no runtime request)');
console.log('CSS size-adjust eliminates layout shift');


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "Next.js Image component handles optimization automatically: it
 * generates responsive srcset, converts to WebP/AVIF, lazy loads by
 * default, and requires width/height to prevent CLS. I use the
 * priority prop on LCP images to preload them. For responsive layouts,
 * I use fill with sizes to let the browser choose the right resolution.
 *
 * next/font is equally impressive — it self-hosts Google Fonts at build
 * time (no external requests), applies CSS size-adjust to eliminate
 * layout shift during font swap, and auto-subsets to reduce file size.
 * It's zero-CLS font loading with no configuration."
 */


// RUN: node docs/32-nextjs/08-image-font-optimization.js
