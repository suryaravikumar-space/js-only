/**
 * PERFORMANCE: 06 - Image Optimization
 *
 * ONE CONCEPT: Images are usually the heaviest assets — optimize them
 */


// =============================================================================
// WHY IMAGES MATTER
// =============================================================================

console.log('=== Image Optimization ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  Images = ~50% of page weight on average                           │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  FORMAT COMPARISON (same quality photo):                            │
 *   │  ┌──────────┬────────────┬──────────────────────────┐              │
 *   │  │ Format   │ Size       │ Notes                    │              │
 *   │  ├──────────┼────────────┼──────────────────────────┤              │
 *   │  │ PNG      │ 1200 KB    │ Lossless, transparency   │              │
 *   │  │ JPEG     │  300 KB    │ Lossy, no transparency   │              │
 *   │  │ WebP     │  200 KB    │ Both lossy/lossless, alpha│             │
 *   │  │ AVIF     │  120 KB    │ Best compression, newer  │              │
 *   │  │ SVG      │  varies    │ Vector, scalable         │              │
 *   │  └──────────┴────────────┴──────────────────────────┘              │
 *   │                                                                      │
 *   │  WHEN TO USE WHAT:                                                  │
 *   │  Photo/complex    → AVIF > WebP > JPEG                             │
 *   │  Icons/logos      → SVG (scalable, tiny)                            │
 *   │  Screenshot/text  → WebP > PNG                                     │
 *   │  Animation        → WebP/AVIF > GIF (much smaller)                 │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('AVIF > WebP > JPEG for photos (compression)');
console.log('SVG for icons/logos (scalable, tiny)');
console.log('WebP > PNG for screenshots with text');


// =============================================================================
// RESPONSIVE IMAGES
// =============================================================================

console.log('\n=== Responsive Images ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  RESPONSIVE IMAGES: Serve right size for device                     │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  srcset + sizes (resolution switching):                             │
 *   │  <img                                                               │
 *   │    srcset="photo-400.jpg 400w,                                     │
 *   │           photo-800.jpg 800w,                                       │
 *   │           photo-1200.jpg 1200w"                                     │
 *   │    sizes="(max-width: 600px) 400px,                                │
 *   │           (max-width: 1000px) 800px,                                │
 *   │           1200px"                                                   │
 *   │    src="photo-800.jpg"                                              │
 *   │    alt="Photo">                                                     │
 *   │                                                                      │
 *   │  <picture> (format switching + art direction):                      │
 *   │  <picture>                                                          │
 *   │    <source type="image/avif" srcset="photo.avif">                  │
 *   │    <source type="image/webp" srcset="photo.webp">                  │
 *   │    <img src="photo.jpg" alt="Photo">  ← fallback                  │
 *   │  </picture>                                                         │
 *   │                                                                      │
 *   │  Mobile: downloads 400w (50KB)                                     │
 *   │  Desktop: downloads 1200w (150KB)                                  │
 *   │  Don't serve 4K images to mobile phones!                           │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('srcset + sizes: browser picks best resolution');
console.log('<picture>: format negotiation (AVIF → WebP → JPEG fallback)');
console.log('Mobile gets small image, desktop gets large');


// =============================================================================
// OPTIMIZATION CHECKLIST
// =============================================================================

console.log('\n=== Optimization Checklist ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  IMAGE OPTIMIZATION CHECKLIST                                       │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  ✓ Use modern formats (AVIF/WebP with JPEG fallback)              │
 *   │  ✓ Resize to actual display size (don't serve 4000px for 400px)   │
 *   │  ✓ Compress (80% quality is usually indistinguishable)            │
 *   │  ✓ Lazy load below-fold images (loading="lazy")                   │
 *   │  ✓ Set explicit width/height (prevent CLS)                        │
 *   │  ✓ Use srcset for responsive images                                │
 *   │  ✓ fetchpriority="high" on LCP image                              │
 *   │  ✓ Preload LCP image: <link rel="preload" as="image">           │
 *   │  ✓ Use CDN with image transforms (Cloudinary, Imgix)             │
 *   │  ✓ CSS aspect-ratio to reserve space                               │
 *   │  ✓ Use SVG for icons (not PNG)                                     │
 *   │  ✓ Consider CSS gradients/shapes over images                      │
 *   │                                                                      │
 *   │  Next.js <Image>: does most of this automatically!                │
 *   │  • Auto srcset, lazy loading, blur placeholder                    │
 *   │  • WebP/AVIF conversion                                            │
 *   │  • Prevents CLS (requires width/height)                           │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

const checklist = [
  'Modern formats (AVIF > WebP > JPEG)',
  'Resize to display size',
  'Compress (quality 80%)',
  'Lazy load below fold',
  'Set width + height (CLS)',
  'srcset for responsive',
  'fetchpriority="high" on LCP',
  'CDN with image transforms',
];
checklist.forEach((item, i) => console.log(`  ${i + 1}. ${item}`));


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "Images typically account for half the page weight, so optimizing them
 * has the biggest impact. I use AVIF as the primary format with WebP and
 * JPEG fallbacks via the <picture> element. I serve responsive images
 * with srcset and sizes so mobile devices get smaller files.
 *
 * For the LCP image (usually hero), I use fetchpriority='high' and
 * preload it. All other images get loading='lazy'. I always set explicit
 * width and height to prevent CLS.
 *
 * I use a CDN like Cloudinary or Next.js Image component which handles
 * format conversion, resizing, and compression automatically. The Image
 * component also generates srcset, enforces dimensions, and lazy loads
 * by default — it's an instant performance win.
 *
 * Compression at 80% quality is visually identical for photos. I use SVG
 * for icons instead of raster images since they scale perfectly and are
 * typically a few hundred bytes."
 */


// RUN: node docs/30-performance/06-image-optimization.js
