/**
 * ═══════════════════════════════════════════════════════════════════════════
 * JAVASCRIPT MODULE SYSTEMS - Dynamic Imports & Code Splitting
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Dynamic imports enable on-demand loading of modules, reducing initial
 * bundle size and improving application performance.
 */

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    DYNAMIC IMPORTS OVERVIEW                              │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   STATIC IMPORT:                    DYNAMIC IMPORT:                     │
 * │   ══════════════                    ═══════════════                      │
 * │   import { foo } from './mod';      const mod = await import('./mod');  │
 * │                                                                          │
 * │   • Evaluated at parse time         • Evaluated at runtime              │
 * │   • Must be at top level            • Can be anywhere                   │
 * │   • Always loads                    • Conditional loading               │
 * │   • String literal only             • Dynamic paths allowed             │
 * │                                                                          │
 * │   ┌─────────────────────────────────────────────────────────────────┐   │
 * │   │                LOADING COMPARISON                               │   │
 * │   └─────────────────────────────────────────────────────────────────┘   │
 * │                                                                          │
 * │   Static (all upfront):                                                 │
 * │   ████████████████████████████████████░░░░░░░░░░ Load → Render         │
 * │                                                                          │
 * │   Dynamic (on-demand):                                                  │
 * │   ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ Load → Render         │
 * │          ████░░░░ (feature A)                    Load A when needed    │
 * │               ████░░ (feature B)                 Load B when needed    │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("═══════════════════════════════════════════════════════════════");
console.log("           DYNAMIC IMPORTS & CODE SPLITTING");
console.log("═══════════════════════════════════════════════════════════════\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    DYNAMIC IMPORT SYNTAX                                 │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("─── Dynamic Import Syntax ───\n");

const dynamicImportExamples = `
// Basic dynamic import (returns Promise)
const module = await import('./module.js');
console.log(module.default);  // Default export
console.log(module.named);    // Named export

// With destructuring
const { default: Main, helper } = await import('./module.js');

// Promise-based (without async/await)
import('./module.js')
    .then(module => {
        module.init();
    })
    .catch(err => {
        console.error('Failed to load module:', err);
    });

// Dynamic path (bundlers create chunks for possible matches)
const locale = 'en';
const i18n = await import(\`./locales/\${locale}.js\`);

// Conditional loading
if (user.isAdmin) {
    const { AdminPanel } = await import('./admin.js');
    new AdminPanel();
}
`;

console.log(dynamicImportExamples);

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    CODE SPLITTING STRATEGIES                             │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   1. ROUTE-BASED SPLITTING                                              │
 * │      Load code for each route separately                                │
 * │                                                                          │
 * │   2. COMPONENT-BASED SPLITTING                                          │
 * │      Load heavy components on demand                                    │
 * │                                                                          │
 * │   3. VENDOR SPLITTING                                                    │
 * │      Separate node_modules into own chunk                               │
 * │                                                                          │
 * │   4. CONDITIONAL SPLITTING                                               │
 * │      Load based on user actions or conditions                           │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("─── Code Splitting Strategies ───\n");

// Route-based splitting
const routeBasedSplitting = `
// Route-based code splitting
const routes = {
    '/': () => import('./pages/Home.js'),
    '/about': () => import('./pages/About.js'),
    '/dashboard': () => import('./pages/Dashboard.js'),
    '/settings': () => import('./pages/Settings.js')
};

async function loadRoute(path) {
    const loader = routes[path] || routes['/'];
    const module = await loader();
    return module.default;
}

// React example with React.lazy
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));

function App() {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
            </Routes>
        </Suspense>
    );
}
`;

console.log("1. Route-Based Splitting:");
console.log(routeBasedSplitting);

// Component-based splitting
const componentBasedSplitting = `
// Heavy component loading
async function showModal() {
    const { Modal } = await import('./components/Modal.js');
    const modal = new Modal();
    modal.open();
}

// React component splitting
const HeavyChart = React.lazy(() => import('./components/Chart'));

function Dashboard() {
    const [showChart, setShowChart] = useState(false);

    return (
        <div>
            <button onClick={() => setShowChart(true)}>
                Show Chart
            </button>
            {showChart && (
                <Suspense fallback={<Spinner />}>
                    <HeavyChart />
                </Suspense>
            )}
        </div>
    );
}
`;

console.log("2. Component-Based Splitting:");
console.log(componentBasedSplitting);

// Vendor splitting
const vendorSplitting = `
// webpack.config.js
module.exports = {
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                // Separate React into its own chunk
                react: {
                    test: /[\\\\/]node_modules[\\\\/](react|react-dom)[\\\\/]/,
                    name: 'react',
                    chunks: 'all',
                    priority: 40
                },
                // Other vendors
                vendors: {
                    test: /[\\\\/]node_modules[\\\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                    priority: 20
                },
                // Common code between entry points
                common: {
                    minChunks: 2,
                    name: 'common',
                    chunks: 'all',
                    priority: 10,
                    reuseExistingChunk: true
                }
            }
        }
    }
};
`;

console.log("3. Vendor Splitting (Webpack):");
console.log(vendorSplitting);

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    WEBPACK MAGIC COMMENTS                                │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("─── Webpack Magic Comments ───\n");

const webpackMagicComments = `
// Name the chunk
import(/* webpackChunkName: "my-chunk" */ './module.js');

// Prefetch (load in idle time)
import(/* webpackPrefetch: true */ './future-feature.js');

// Preload (load immediately, high priority)
import(/* webpackPreload: true */ './critical-feature.js');

// Combine comments
import(
    /* webpackChunkName: "admin" */
    /* webpackPrefetch: true */
    './admin/AdminPanel.js'
);

// Disable chunk for small modules
import(/* webpackMode: "eager" */ './small-module.js');

// Include multiple possible paths
import(/* webpackInclude: /\\.json$/ */ \`./locales/\${lang}.json\`);
import(/* webpackExclude: /\\.test\\.js$/ */ \`./modules/\${name}.js\`);
`;

console.log("Webpack Magic Comments:");
console.log(webpackMagicComments);

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    PREFETCH vs PRELOAD                                   │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   PREFETCH:                         PRELOAD:                            │
 * │   ═════════                         ════════                             │
 * │   • Load during idle time           • Load immediately                  │
 * │   • Low priority                    • High priority                     │
 * │   • Future navigation               • Current navigation                │
 * │   • Won't block rendering           • Parallel to main bundle           │
 * │                                                                          │
 * │   Timeline:                                                              │
 * │   ─────────                                                              │
 * │   PRELOAD:   ████████ (with main bundle)                                │
 * │   PREFETCH:  ░░░░░░░░████ (after main, when idle)                       │
 * │                                                                          │
 * │   <link rel="prefetch" href="future.js">                                │
 * │   <link rel="preload" href="critical.js" as="script">                   │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("─── Prefetch vs Preload ───\n");

console.log("PREFETCH:");
console.log("  • Loads during browser idle time");
console.log("  • For resources needed in future navigations");
console.log("  • import(/* webpackPrefetch: true */ './next-page.js')\n");

console.log("PRELOAD:");
console.log("  • Loads immediately with high priority");
console.log("  • For resources needed in current page");
console.log("  • import(/* webpackPreload: true */ './critical.js')\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    ERROR HANDLING                                        │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("─── Error Handling ───\n");

const errorHandling = `
// Basic error handling
async function loadModule(path) {
    try {
        const module = await import(path);
        return module;
    } catch (error) {
        if (error.code === 'MODULE_NOT_FOUND') {
            console.error('Module not found:', path);
        } else if (error.name === 'ChunkLoadError') {
            // Network error, chunk failed to load
            console.error('Failed to load chunk:', error.request);
            // Optionally retry
            return retryLoad(path);
        }
        throw error;
    }
}

// Retry logic
async function retryLoad(path, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            await new Promise(r => setTimeout(r, 1000 * i));  // Backoff
            return await import(path);
        } catch (e) {
            if (i === retries - 1) throw e;
        }
    }
}

// React Error Boundary for lazy components
class ChunkErrorBoundary extends React.Component {
    state = { hasError: false };

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return <button onClick={() => window.location.reload()}>
                Failed to load. Click to retry.
            </button>;
        }
        return this.props.children;
    }
}
`;

console.log(errorHandling);

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    LOADING STATES                                        │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("─── Loading States Pattern ───\n");

const loadingPattern = `
// Custom loading component wrapper
function LazyLoad({ loader, fallback, errorFallback }) {
    const [Component, setComponent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loader()
            .then(mod => {
                setComponent(() => mod.default);
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    }, []);

    if (loading) return fallback;
    if (error) return errorFallback || <ErrorMessage error={error} />;
    return <Component />;
}

// Usage
<LazyLoad
    loader={() => import('./HeavyComponent')}
    fallback={<Skeleton />}
    errorFallback={<RetryButton />}
/>

// With minimum loading time (avoid flash)
async function loadWithMinTime(importFn, minMs = 200) {
    const start = Date.now();
    const module = await importFn();
    const elapsed = Date.now() - start;

    if (elapsed < minMs) {
        await new Promise(r => setTimeout(r, minMs - elapsed));
    }

    return module;
}
`;

console.log(loadingPattern);

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    FRAMEWORK-SPECIFIC PATTERNS                           │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("─── Framework Patterns ───\n");

// React
const reactPattern = `
// React.lazy + Suspense
const LazyComponent = React.lazy(() => import('./Component'));

function App() {
    return (
        <Suspense fallback={<Loading />}>
            <LazyComponent />
        </Suspense>
    );
}

// Named exports with React.lazy
const MyComponent = React.lazy(() =>
    import('./Component').then(module => ({
        default: module.MyComponent
    }))
);
`;

console.log("React:");
console.log(reactPattern);

// Vue
const vuePattern = `
// Vue async components
const AsyncComponent = defineAsyncComponent({
    loader: () => import('./Component.vue'),
    loadingComponent: LoadingSpinner,
    errorComponent: ErrorComponent,
    delay: 200,
    timeout: 3000
});

// Vue Router lazy loading
const routes = [
    {
        path: '/dashboard',
        component: () => import('./views/Dashboard.vue')
    }
];
`;

console.log("Vue:");
console.log(vuePattern);

// ============================================================================
// Code Splitting Cheat Sheet
// ============================================================================
console.log("╔══════════════════════════════════════════════════════════════════╗");
console.log("║           CODE SPLITTING CHEAT SHEET                            ║");
console.log("╠══════════════════════════════════════════════════════════════════╣");
console.log("║                                                                  ║");
console.log("║  DYNAMIC IMPORT:                                                 ║");
console.log("║  const mod = await import('./module.js');                       ║");
console.log("║  const { named } = await import('./module.js');                 ║");
console.log("║                                                                  ║");
console.log("║  STRATEGIES:                                                     ║");
console.log("║  • Route-based: Split by page/route                             ║");
console.log("║  • Component-based: Split heavy components                      ║");
console.log("║  • Vendor: Separate node_modules                                ║");
console.log("║  • Conditional: Load based on user/feature flags               ║");
console.log("║                                                                  ║");
console.log("║  WEBPACK MAGIC COMMENTS:                                         ║");
console.log("║  /* webpackChunkName: \"name\" */                                 ║");
console.log("║  /* webpackPrefetch: true */                                    ║");
console.log("║  /* webpackPreload: true */                                     ║");
console.log("║                                                                  ║");
console.log("║  BEST PRACTICES:                                                 ║");
console.log("║  • Handle loading and error states                              ║");
console.log("║  • Use prefetch for likely next pages                           ║");
console.log("║  • Name chunks for better debugging                             ║");
console.log("║  • Consider minimum loading time to avoid flash                 ║");
console.log("║                                                                  ║");
console.log("╚══════════════════════════════════════════════════════════════════╝\n");

module.exports = {
    info: "Dynamic imports and code splitting patterns"
};

console.log("═══ Next: Module Federation ═══");
console.log("Run: node deep-dive/javaScript-module-systems/07-module-federation.js");
