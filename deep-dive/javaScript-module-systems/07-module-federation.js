/**
 * ═══════════════════════════════════════════════════════════════════════════
 * JAVASCRIPT MODULE SYSTEMS - Module Federation
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Module Federation enables sharing code between separately built applications
 * at runtime, enabling micro-frontend architectures.
 */

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    MODULE FEDERATION OVERVIEW                            │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   TRADITIONAL MONOLITH:            MODULE FEDERATION:                   │
 * │   ═══════════════════              ══════════════════                    │
 * │                                                                          │
 * │   ┌─────────────────────┐          ┌────────┐ ┌────────┐ ┌────────┐     │
 * │   │                     │          │ App A  │ │ App B  │ │ App C  │     │
 * │   │   Monolithic App    │          │ Host   │ │ Remote │ │ Remote │     │
 * │   │                     │          └────┬───┘ └───┬────┘ └───┬────┘     │
 * │   │  All code bundled   │               │         │          │          │
 * │   │     together        │               ▼         ▼          ▼          │
 * │   │                     │          ┌────────────────────────────┐       │
 * │   └─────────────────────┘          │   Shared at Runtime        │       │
 * │                                    │   (React, lodash, etc.)    │       │
 * │   Single deployment                └────────────────────────────┘       │
 * │   Single team                                                           │
 * │   Single build                     Multiple deployments                 │
 * │                                    Multiple teams                       │
 * │                                    Independent builds                   │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("═══════════════════════════════════════════════════════════════");
console.log("           MODULE FEDERATION");
console.log("═══════════════════════════════════════════════════════════════\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    KEY CONCEPTS                                          │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   HOST: Application that consumes remote modules                        │
 * │   REMOTE: Application that exposes modules for consumption              │
 * │   SHARED: Dependencies shared between host and remotes                  │
 * │   EXPOSES: Modules a remote makes available                             │
 * │   REMOTES: Remote applications a host can load from                     │
 * │                                                                          │
 * │   ┌─────────────────────────────────────────────────────────────────┐   │
 * │   │                  ARCHITECTURE                                   │   │
 * │   └─────────────────────────────────────────────────────────────────┘   │
 * │                                                                          │
 * │   ┌─────────────┐     Runtime Load     ┌─────────────┐                  │
 * │   │    HOST     │◄────────────────────►│   REMOTE    │                  │
 * │   │   (Shell)   │                      │   (MFE 1)   │                  │
 * │   ├─────────────┤                      ├─────────────┤                  │
 * │   │ remotes: [  │                      │ exposes: {  │                  │
 * │   │   mfe1,     │                      │   Button,   │                  │
 * │   │   mfe2      │                      │   Card      │                  │
 * │   │ ]           │                      │ }           │                  │
 * │   └─────────────┘                      └─────────────┘                  │
 * │          │                                    │                          │
 * │          └────────────┬───────────────────────┘                          │
 * │                       ▼                                                  │
 * │              ┌─────────────────┐                                        │
 * │              │     SHARED      │                                        │
 * │              │  react, lodash  │                                        │
 * │              └─────────────────┘                                        │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("─── Key Concepts ───\n");

console.log("HOST (Shell Application):");
console.log("  • Main container application");
console.log("  • Consumes remote modules");
console.log("  • Coordinates routing and layout\n");

console.log("REMOTE (Micro-Frontend):");
console.log("  • Independently deployed application");
console.log("  • Exposes components/modules");
console.log("  • Can also be a host\n");

console.log("SHARED:");
console.log("  • Dependencies used by multiple apps");
console.log("  • Loaded once, shared at runtime");
console.log("  • Version negotiation\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    WEBPACK 5 CONFIGURATION                               │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("─── Webpack Module Federation ───\n");

// Host (Shell) Configuration
const hostConfig = `
// host/webpack.config.js
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
    name: 'host',
    plugins: [
        new ModuleFederationPlugin({
            name: 'host',

            // Remote applications to load from
            remotes: {
                mfe1: 'mfe1@http://localhost:3001/remoteEntry.js',
                mfe2: 'mfe2@http://localhost:3002/remoteEntry.js'
            },

            // Shared dependencies
            shared: {
                react: {
                    singleton: true,      // Only one version
                    requiredVersion: '^18.0.0',
                    eager: true           // Load immediately
                },
                'react-dom': {
                    singleton: true,
                    requiredVersion: '^18.0.0',
                    eager: true
                },
                lodash: {
                    singleton: true
                }
            }
        })
    ]
};
`;

console.log("Host (Shell) Configuration:");
console.log(hostConfig);

// Remote Configuration
const remoteConfig = `
// mfe1/webpack.config.js
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
    name: 'mfe1',
    plugins: [
        new ModuleFederationPlugin({
            name: 'mfe1',
            filename: 'remoteEntry.js',

            // Modules to expose
            exposes: {
                './Button': './src/components/Button',
                './Card': './src/components/Card',
                './utils': './src/utils/index'
            },

            // Shared dependencies
            shared: {
                react: {
                    singleton: true,
                    requiredVersion: '^18.0.0'
                },
                'react-dom': {
                    singleton: true,
                    requiredVersion: '^18.0.0'
                }
            }
        })
    ]
};
`;

console.log("\nRemote (MFE) Configuration:");
console.log(remoteConfig);

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    CONSUMING REMOTE MODULES                              │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("─── Consuming Remote Modules ───\n");

const consumingRemotes = `
// In host application

// Static import (requires entry point changes)
import Button from 'mfe1/Button';
import { formatDate } from 'mfe1/utils';

// Dynamic import (recommended)
const Button = React.lazy(() => import('mfe1/Button'));
const Card = React.lazy(() => import('mfe1/Card'));

// Usage with error boundary
function App() {
    return (
        <ErrorBoundary fallback={<FallbackButton />}>
            <Suspense fallback={<Spinner />}>
                <Button onClick={handleClick}>
                    Click Me
                </Button>
            </Suspense>
        </ErrorBoundary>
    );
}

// Bootstrap pattern for async loading
// bootstrap.js
import('./App').then(({ default: App }) => {
    ReactDOM.render(<App />, document.getElementById('root'));
});

// index.js
import('./bootstrap');
`;

console.log(consumingRemotes);

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    SHARED DEPENDENCY STRATEGIES                          │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   SINGLETON:     Only one version loaded globally                       │
 * │   VERSION RANGE: Semver-compatible versions can coexist                 │
 * │   EAGER:         Load immediately (not lazy)                            │
 * │   STRICT:        Exact version match required                           │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("─── Shared Configuration Options ───\n");

const sharedConfig = `
shared: {
    // Singleton - only one version
    react: {
        singleton: true,
        strictVersion: true,
        requiredVersion: '^18.0.0'
    },

    // Eager loading - not lazy loaded
    'react-dom': {
        singleton: true,
        eager: true
    },

    // Allow version range
    lodash: {
        requiredVersion: '^4.17.0'
        // Multiple compatible versions can load
    },

    // Share but don't require specific version
    axios: {
        eager: false,
        singleton: false
        // Each app can use its own version
    },

    // From package.json
    ...deps  // Spread all dependencies
}

// Helper to share all dependencies
function shareAll(packageJson) {
    const deps = packageJson.dependencies || {};
    const shared = {};

    for (const [name, version] of Object.entries(deps)) {
        shared[name] = {
            requiredVersion: version,
            singleton: ['react', 'react-dom'].includes(name)
        };
    }

    return shared;
}
`;

console.log(sharedConfig);

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    VITE MODULE FEDERATION                                │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("─── Vite Module Federation ───\n");

const viteConfig = `
// vite.config.js (using @originjs/vite-plugin-federation)
import federation from '@originjs/vite-plugin-federation';

export default {
    plugins: [
        federation({
            name: 'host',
            remotes: {
                mfe1: 'http://localhost:5001/assets/remoteEntry.js'
            },
            shared: ['react', 'react-dom']
        })
    ]
};

// Remote vite.config.js
export default {
    plugins: [
        federation({
            name: 'mfe1',
            filename: 'remoteEntry.js',
            exposes: {
                './Button': './src/components/Button.jsx'
            },
            shared: ['react', 'react-dom']
        })
    ]
};
`;

console.log(viteConfig);

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    ERROR HANDLING & FALLBACKS                            │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("─── Error Handling ───\n");

const errorHandling = `
// Wrapper for loading remote modules
async function loadRemoteModule(remoteName, moduleName) {
    try {
        const container = window[remoteName];

        if (!container) {
            throw new Error(\`Remote \${remoteName} not loaded\`);
        }

        // Initialize shared scope
        await __webpack_init_sharing__('default');
        await container.init(__webpack_share_scopes__.default);

        // Get the module
        const factory = await container.get(moduleName);
        return factory();
    } catch (error) {
        console.error(\`Failed to load \${remoteName}/\${moduleName}:\`, error);
        return null;
    }
}

// React component with fallback
function RemoteComponent({ remote, module, fallback: Fallback, ...props }) {
    const [Component, setComponent] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadRemoteModule(remote, module)
            .then(mod => setComponent(() => mod.default))
            .catch(err => setError(err));
    }, [remote, module]);

    if (error) return <Fallback error={error} />;
    if (!Component) return <Loading />;
    return <Component {...props} />;
}

// Retry logic
async function loadWithRetry(loader, retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            return await loader();
        } catch (e) {
            if (i === retries - 1) throw e;
            await new Promise(r => setTimeout(r, delay * (i + 1)));
        }
    }
}
`;

console.log(errorHandling);

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    BEST PRACTICES                                        │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("─── Best Practices ───\n");

const bestPractices = `
1. VERSIONING
   • Use semantic versioning for shared dependencies
   • Test version compatibility between apps
   • Consider version pinning for critical deps

2. DEPLOYMENT
   • Deploy remotes independently
   • Use CDN for remote entry files
   • Implement blue/green deployments
   • Cache remote entries with proper headers

3. ERROR HANDLING
   • Always provide fallback components
   • Implement retry logic
   • Monitor remote loading failures
   • Graceful degradation when remote unavailable

4. PERFORMANCE
   • Lazy load remotes when possible
   • Prefetch critical remotes
   • Minimize shared dependency size
   • Use caching effectively

5. DEVELOPMENT
   • Support standalone mode for remotes
   • Use consistent coding standards
   • Share types with TypeScript
   • Integration testing between apps

6. SECURITY
   • Validate remote origins
   • Use CSP headers
   • Sign remote entry files
   • Audit shared dependency versions
`;

console.log(bestPractices);

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    USE CASES                                             │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("─── When to Use Module Federation ───\n");

console.log("✅ GOOD USE CASES:");
console.log("  • Large applications with multiple teams");
console.log("  • Need independent deployments");
console.log("  • Migrating from monolith incrementally");
console.log("  • Sharing components across applications");
console.log("  • A/B testing different implementations\n");

console.log("❌ AVOID WHEN:");
console.log("  • Small applications");
console.log("  • Single team");
console.log("  • Strong coupling between features");
console.log("  • Simplicity is priority\n");

// ============================================================================
// Module Federation Cheat Sheet
// ============================================================================
console.log("╔══════════════════════════════════════════════════════════════════╗");
console.log("║           MODULE FEDERATION CHEAT SHEET                         ║");
console.log("╠══════════════════════════════════════════════════════════════════╣");
console.log("║                                                                  ║");
console.log("║  TERMINOLOGY:                                                    ║");
console.log("║  • Host: Consumes remote modules                                ║");
console.log("║  • Remote: Exposes modules                                      ║");
console.log("║  • Shared: Dependencies loaded once                             ║");
console.log("║                                                                  ║");
console.log("║  KEY CONFIG:                                                     ║");
console.log("║  remotes: { app: 'app@url/remoteEntry.js' }                     ║");
console.log("║  exposes: { './Component': './src/Component' }                  ║");
console.log("║  shared: { react: { singleton: true } }                         ║");
console.log("║                                                                  ║");
console.log("║  IMPORTING:                                                      ║");
console.log("║  const Comp = React.lazy(() => import('remote/Component'));     ║");
console.log("║                                                                  ║");
console.log("║  BEST PRACTICES:                                                 ║");
console.log("║  • Use singleton for React                                      ║");
console.log("║  • Provide fallbacks                                            ║");
console.log("║  • Test version compatibility                                   ║");
console.log("║  • Deploy remotes independently                                 ║");
console.log("║                                                                  ║");
console.log("╚══════════════════════════════════════════════════════════════════╝\n");

module.exports = {
    info: "Module Federation concepts and patterns"
};

console.log("═══ Next: Module Systems Interview Q&A ═══");
console.log("Run: node deep-dive/javaScript-module-systems/08-interview-qa.js");
