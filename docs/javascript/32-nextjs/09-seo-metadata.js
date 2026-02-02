/**
 * NEXT.JS: 09 - SEO & Metadata
 *
 * ONE CONCEPT: Next.js makes SEO easy with built-in metadata APIs
 */


// =============================================================================
// METADATA API
// =============================================================================

console.log('=== SEO & Metadata ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  METADATA API (App Router)                                          │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  // Static metadata                                                 │
 *   │  // app/about/page.tsx                                              │
 *   │  export const metadata = {                                          │
 *   │    title: 'About Us',                                               │
 *   │    description: 'Learn about our company',                         │
 *   │    openGraph: {                                                     │
 *   │      title: 'About Us',                                            │
 *   │      images: ['/og-about.png'],                                   │
 *   │    },                                                               │
 *   │  };                                                                 │
 *   │                                                                      │
 *   │  // Dynamic metadata                                                │
 *   │  // app/blog/[slug]/page.tsx                                       │
 *   │  export async function generateMetadata({ params }) {              │
 *   │    const post = await getPost(params.slug);                        │
 *   │    return {                                                         │
 *   │      title: post.title,                                             │
 *   │      description: post.excerpt,                                    │
 *   │      openGraph: { images: [post.image] },                         │
 *   │    };                                                               │
 *   │  }                                                                  │
 *   │                                                                      │
 *   │  // Layout-level metadata (inherited by children)                  │
 *   │  // app/layout.tsx                                                  │
 *   │  export const metadata = {                                          │
 *   │    title: { template: '%s | MySite', default: 'MySite' },        │
 *   │    metadataBase: new URL('https://mysite.com'),                   │
 *   │  };                                                                 │
 *   │  // Child pages: title "About" → "About | MySite"                │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Static: export const metadata = { title, description }');
console.log('Dynamic: export async function generateMetadata({ params })');
console.log('Template: title.template = "%s | MySite"');


// =============================================================================
// WHY NEXT.JS IS GREAT FOR SEO
// =============================================================================

console.log('\n=== Why Next.js is Great for SEO ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  NEXT.JS SEO ADVANTAGES                                             │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  1. Server-rendered HTML (crawlers see full content)               │
 *   │  2. Metadata API (title, description, OG tags)                    │
 *   │  3. Automatic sitemap.xml generation                               │
 *   │  4. robots.txt configuration                                        │
 *   │  5. Structured data (JSON-LD)                                      │
 *   │  6. Fast Core Web Vitals (ranking signal)                          │
 *   │  7. Image optimization (alt text, lazy load)                      │
 *   │  8. Canonical URLs                                                  │
 *   │                                                                      │
 *   │  // app/sitemap.ts                                                  │
 *   │  export default async function sitemap() {                         │
 *   │    const posts = await getAllPosts();                               │
 *   │    return posts.map(post => ({                                     │
 *   │      url: `https://site.com/blog/${post.slug}`,                  │
 *   │      lastModified: post.updatedAt,                                 │
 *   │    }));                                                             │
 *   │  }                                                                  │
 *   │                                                                      │
 *   │  // app/robots.ts                                                   │
 *   │  export default function robots() {                                │
 *   │    return { rules: { userAgent: '*', allow: '/' } };             │
 *   │  }                                                                  │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('SSR/SSG → crawlers see full HTML');
console.log('Metadata API → title, OG tags, structured data');
console.log('sitemap.ts + robots.ts → auto-generated');
console.log('Fast Core Web Vitals → Google ranking boost');


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "Next.js is excellent for SEO because it serves fully rendered HTML
 * to crawlers instead of empty divs. The Metadata API lets me define
 * title, description, and Open Graph tags either statically or
 * dynamically per page. I use the title template pattern so child
 * pages inherit the site name suffix.
 *
 * I generate sitemaps and robots.txt dynamically using App Router
 * conventions (sitemap.ts, robots.ts). For structured data, I add
 * JSON-LD scripts to help search engines understand the content.
 *
 * Combined with Image optimization (alt text, performance), fast
 * Core Web Vitals, and automatic code splitting, Next.js covers
 * all the technical SEO requirements out of the box."
 */


// RUN: node docs/32-nextjs/09-seo-metadata.js
