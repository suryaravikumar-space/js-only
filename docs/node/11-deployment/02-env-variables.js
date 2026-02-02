/**
 * TOPIC 02: Environment Variables & Configuration
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ Configuration that changes between environments (dev/staging/prod)      ║
 * ║ should be stored in ENVIRONMENT VARIABLES, never hardcoded in code.     ║
 * ║                                                                          ║
 * ║   Secrets (API keys, DB passwords)  → env vars, NEVER in code/git      ║
 * ║   Config (port, log level)          → env vars with sensible defaults   ║
 * ║   Constants (app name, version)     → hardcoded or package.json         ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  You are a SECRET AGENT. For each MISSION (environment), you get a       │
 * │  different BRIEFCASE (env vars) with different intel:                     │
 * │                                                                            │
 * │  Mission: DEVELOPMENT (local)                                             │
 * │    Briefcase: { DB: "localhost", DEBUG: true, API_KEY: "test-key" }       │
 * │                                                                            │
 * │  Mission: STAGING                                                         │
 * │    Briefcase: { DB: "staging-db.internal", DEBUG: false, API_KEY: "stg" } │
 * │                                                                            │
 * │  Mission: PRODUCTION                                                      │
 * │    Briefcase: { DB: "prod-db.internal", DEBUG: false, API_KEY: "real!" }  │
 * │                                                                            │
 * │  The SPY (your code) behaves the SAME on every mission -                 │
 * │  only the BRIEFCASE contents change.                                     │
 * │                                                                            │
 * │  RULE: Never write the secrets on your body (hardcode in source).        │
 * │  If captured (code leaked to GitHub), secrets stay safe in the briefcase.│
 * │                                                                            │
 * │  "Same code, different config. The 12-Factor Way."                       │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM: Environment Variable Flow                                 │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │   WHERE DO ENV VARS COME FROM?                                            │
 * │                                                                            │
 * │   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                   │
 * │   │ .env file    │  │ Shell/OS     │  │ Docker/K8s   │                   │
 * │   │ (dev only!)  │  │ export X=Y   │  │ -e X=Y       │                   │
 * │   └──────┬───────┘  └──────┬───────┘  └──────┬───────┘                   │
 * │          │                  │                  │                           │
 * │          ▼                  ▼                  ▼                           │
 * │   ┌────────────────────────────────────────────────────┐                  │
 * │   │              process.env                           │                  │
 * │   │  {                                                 │                  │
 * │   │    NODE_ENV: "production",   // string!           │                  │
 * │   │    PORT: "3000",             // string! not 3000  │                  │
 * │   │    DB_HOST: "localhost",                           │                  │
 * │   │    API_KEY: "sk-abc123...",                        │                  │
 * │   │    DEBUG: "true",            // string! not bool  │                  │
 * │   │  }                                                 │                  │
 * │   └────────────────────────────────────────────────────┘                  │
 * │                           │                                               │
 * │                           ▼                                               │
 * │   ┌────────────────────────────────────────────────────┐                  │
 * │   │         Config Module (validates & parses)         │                  │
 * │   │  {                                                 │                  │
 * │   │    nodeEnv: "production",                          │                  │
 * │   │    port: 3000,              // parsed to number   │                  │
 * │   │    dbHost: "localhost",                            │                  │
 * │   │    apiKey: "sk-abc123...",                         │                  │
 * │   │    debug: false,            // parsed to boolean  │                  │
 * │   │  }                                                 │                  │
 * │   └────────────────────────────────────────────────────┘                  │
 * │                                                                            │
 * │   PRIORITY (highest to lowest):                                           │
 * │   1. Shell/system env vars      (override everything)                    │
 * │   2. .env.local                 (local overrides)                        │
 * │   3. .env.{NODE_ENV}            (.env.production, .env.development)      │
 * │   4. .env                       (shared defaults)                        │
 * │   5. Hardcoded defaults in code (fallback)                               │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// SECTION 1: process.env Basics
// ============================================================================

console.log('=== SECTION 1: process.env Basics ===\n');

// process.env contains ALL environment variables from the OS/shell
console.log('A:', `NODE_ENV = "${process.env.NODE_ENV || '(not set)'}"`);
console.log('B:', `HOME = "${process.env.HOME || process.env.USERPROFILE}"`);
console.log('C:', `PATH exists = ${!!process.env.PATH}`);

// You can SET env vars at runtime (but this is unusual)
process.env.MY_CUSTOM_VAR = 'hello';
console.log('D:', `MY_CUSTOM_VAR = "${process.env.MY_CUSTOM_VAR}"`);

// TRICKY: ALL process.env values are STRINGS!
process.env.PORT = 3000;          // Set as number...
console.log('E:', `typeof PORT = "${typeof process.env.PORT}"`);  // "string"!
console.log('F:', `PORT value = "${process.env.PORT}"`);          // "3000" (string)
console.log('G:', `PORT === 3000? ${process.env.PORT === 3000}`);   // false!
console.log('H:', `PORT === "3000"? ${process.env.PORT === '3000'}`); // true!

// TRICKY: Setting to undefined/null doesn't work as expected
process.env.TEST_VAR = undefined;
console.log('I:', `undefined becomes: "${process.env.TEST_VAR}"`);   // "undefined" (string!)
process.env.TEST_VAR = null;
console.log('J:', `null becomes: "${process.env.TEST_VAR}"`);        // "null" (string!)

// To actually remove an env var:
delete process.env.TEST_VAR;
console.log('K:', `After delete: ${process.env.TEST_VAR}`);          // undefined (real)
console.log('');


// ============================================================================
// SECTION 2: Parsing env vars correctly
// ============================================================================

console.log('=== SECTION 2: Parsing Environment Variables ===\n');

// Since env vars are ALWAYS strings, you must parse them!
const parseEnvVar = (name, defaultVal, parser = String) => {
  const val = process.env[name];
  if (val === undefined || val === '') return defaultVal;
  try {
    return parser(val);
  } catch {
    return defaultVal;
  }
};

// Common parsers
const parsers = {
  // Number
  toNumber: (val) => {
    const n = Number(val);
    if (isNaN(n)) throw new Error(`"${val}" is not a number`);
    return n;
  },

  // Boolean - "true", "1", "yes" → true; everything else → false
  toBoolean: (val) => ['true', '1', 'yes', 'on'].includes(val.toLowerCase()),

  // Array (comma-separated)
  toArray: (val) => val.split(',').map((s) => s.trim()),

  // JSON
  toJSON: (val) => JSON.parse(val),
};

// Demonstrate parsing
process.env.PORT = '8080';
process.env.DEBUG = 'true';
process.env.ALLOWED_ORIGINS = 'http://localhost:3000,https://myapp.com';
process.env.DB_CONFIG = '{"host":"localhost","port":5432}';

console.log('L:', 'PORT as number:', parseEnvVar('PORT', 3000, parsers.toNumber));
console.log('M:', 'DEBUG as boolean:', parseEnvVar('DEBUG', false, parsers.toBoolean));
console.log('N:', 'ORIGINS as array:', parseEnvVar('ALLOWED_ORIGINS', [], parsers.toArray));
console.log('O:', 'DB_CONFIG as JSON:', parseEnvVar('DB_CONFIG', {}, parsers.toJSON));
console.log('P:', 'MISSING with default:', parseEnvVar('MISSING_VAR', 'fallback'));
console.log('');


// ============================================================================
// SECTION 3: Config Module Pattern (production approach)
// ============================================================================

console.log('=== SECTION 3: Config Module Pattern ===\n');

// Instead of using process.env everywhere, create a centralized config
const createConfig = () => {
  const env = process.env.NODE_ENV || 'development';

  const config = {
    env,
    isDev: env === 'development',
    isProd: env === 'production',
    isTest: env === 'test',

    server: {
      port: parseInt(process.env.PORT, 10) || 3000,
      host: process.env.HOST || '0.0.0.0',
    },

    database: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      name: process.env.DB_NAME || `myapp_${env}`,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,  // No default for secrets!
      ssl: process.env.DB_SSL === 'true',
      poolSize: parseInt(process.env.DB_POOL_SIZE, 10) || 10,
    },

    redis: {
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    },

    logging: {
      level: process.env.LOG_LEVEL || (env === 'production' ? 'info' : 'debug'),
    },

    cors: {
      origins: process.env.CORS_ORIGINS
        ? process.env.CORS_ORIGINS.split(',')
        : ['http://localhost:3000'],
    },
  };

  return Object.freeze(config);  // Freeze to prevent accidental mutation
};

const config = createConfig();
console.log('Q:', 'Config object:');
console.log(JSON.stringify(config, null, 2).split('\n').map((l) => `     ${l}`).join('\n'));
console.log('');


// ============================================================================
// SECTION 4: Config Validation (catch missing vars EARLY)
// ============================================================================

console.log('=== SECTION 4: Config Validation ===\n');

const validateConfig = (requiredVars) => {
  const missing = [];
  const warnings = [];

  requiredVars.forEach(({ name, required, warn }) => {
    if (required && !process.env[name]) {
      missing.push(name);
    } else if (warn && !process.env[name]) {
      warnings.push(name);
    }
  });

  if (warnings.length > 0) {
    console.log(`  WARNING: Optional env vars not set: ${warnings.join(', ')}`);
  }

  if (missing.length > 0) {
    const msg = `Missing required env vars: ${missing.join(', ')}`;
    console.log(`  FATAL: ${msg}`);
    // In real app: throw new Error(msg);
    // App should FAIL FAST if critical config is missing!
    return false;
  }

  console.log('  All required environment variables are present.');
  return true;
};

// Set some vars for demo
process.env.DATABASE_URL = 'postgres://localhost/mydb';
process.env.JWT_SECRET = 'my-secret-key';

const envSchema = [
  { name: 'DATABASE_URL', required: true },
  { name: 'JWT_SECRET', required: true },
  { name: 'REDIS_URL', required: false, warn: true },
  { name: 'STRIPE_KEY', required: false, warn: true },
  { name: 'SMTP_HOST', required: false, warn: true },
];

console.log('R:', 'Validation result:', validateConfig(envSchema));
console.log('');


// ============================================================================
// SECTION 5: .env File Pattern (dotenv)
// ============================================================================

console.log('=== SECTION 5: .env File Pattern ===\n');

// Simulating what the 'dotenv' package does internally
const parseDotEnv = (content) => {
  const vars = {};
  const lines = content.split('\n');

  lines.forEach((line) => {
    // Skip empty lines and comments
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    // Parse KEY=VALUE
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) return;

    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();

    // Remove surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    vars[key] = value;
  });

  return vars;
};

const sampleEnvFile = `
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp_dev

# App settings
PORT=3000
NODE_ENV=development
LOG_LEVEL=debug

# Secrets (NEVER commit this file!)
JWT_SECRET="super-secret-key-12345"
API_KEY='sk-test-abc123'

# Multiword values need quotes
APP_NAME="My Awesome App"
`;

const parsed = parseDotEnv(sampleEnvFile);
console.log('S:', 'Parsed .env file:');
Object.entries(parsed).forEach(([key, value]) => {
  console.log(`     ${key}=${value}`);
});
console.log('');

console.log('  .env FILE RULES:');
console.log('    1. Add .env to .gitignore (NEVER commit secrets!)');
console.log('    2. Create .env.example with placeholder values (commit this)');
console.log('    3. Load .env ONLY in development, not production');
console.log('    4. System env vars should override .env values');
console.log('    5. dotenv should be loaded FIRST thing in your app:');
console.log('       require("dotenv").config();  // Before any other imports!\n');


// ============================================================================
// SECTION 6: NODE_ENV - The Most Important Env Var
// ============================================================================

console.log('=== SECTION 6: NODE_ENV Deep Dive ===\n');

console.log('  TRICKY: NODE_ENV affects PERFORMANCE!\n');

console.log('  When NODE_ENV === "production":');
console.log('    - Express: enables view template caching');
console.log('    - Express: caches compiled CSS');
console.log('    - Express: generates less verbose error messages');
console.log('    - npm install: skips devDependencies');
console.log('    - Many libraries: disable debug output, enable optimizations');
console.log('    - Pino logger: uses faster serialization\n');

console.log('  When NODE_ENV === "development":');
console.log('    - Express: recompiles templates on every request');
console.log('    - More detailed error pages');
console.log('    - npm install: includes devDependencies\n');

// Common pattern: conditional behavior based on NODE_ENV
const currentEnv = process.env.NODE_ENV || 'development';
const envBehavior = {
  development: {
    logLevel: 'debug',
    showStackTrace: true,
    enableCORS: true,
    corsOrigin: '*',
  },
  production: {
    logLevel: 'info',
    showStackTrace: false,
    enableCORS: true,
    corsOrigin: 'https://myapp.com',
  },
  test: {
    logLevel: 'warn',
    showStackTrace: true,
    enableCORS: false,
    corsOrigin: '',
  },
};

console.log('T:', `Current env: ${currentEnv}`);
console.log('U:', `Behavior:`, envBehavior[currentEnv] || envBehavior.development);
console.log('');

console.log('  TRICKY GOTCHAS:');
console.log('    1. NODE_ENV is NOT set automatically - you must set it!');
console.log('    2. Never create more than 3 NODE_ENVs (dev/staging/prod)');
console.log('       Use other env vars for feature flags instead');
console.log('    3. Some frameworks check for exact string "production"');
console.log('       Not "Production", not "prod" - exactly "production"\n');


// ============================================================================
// SECTION 7: 12-Factor App Config Principles
// ============================================================================

console.log('=== SECTION 7: 12-Factor App Principles (Config) ===\n');

const twelveFactorConfig = [
  {
    principle: 'Store config in the environment',
    explanation: 'Not in code, not in config files checked into git',
    example: 'process.env.DATABASE_URL instead of hardcoded connection string',
  },
  {
    principle: 'Strict separation of config from code',
    explanation: 'Same code deploys to dev/staging/prod, only config changes',
    example: 'docker run -e NODE_ENV=production my-app',
  },
  {
    principle: 'Config varies between deploys; code does not',
    explanation: 'No if(env === "staging") in your app logic',
    example: 'Feature flags via env vars, not environment checks',
  },
  {
    principle: 'Fail fast on missing config',
    explanation: 'App should crash at startup if required config is missing',
    example: 'Validate all required env vars before starting the server',
  },
];

twelveFactorConfig.forEach((item, i) => {
  console.log(`  ${i + 1}. ${item.principle}`);
  console.log(`     Why: ${item.explanation}`);
  console.log(`     How: ${item.example}\n`);
});


// ============================================================================
// SECTION 8: Secrets vs Config
// ============================================================================

console.log('=== SECTION 8: Secrets vs Regular Config ===\n');

console.log('  ┌──────────────────────┬──────────────────────────────────────┐');
console.log('  │ Config (non-secret)  │ Secrets                             │');
console.log('  ├──────────────────────┼──────────────────────────────────────┤');
console.log('  │ PORT=3000            │ DATABASE_URL=postgres://user:pass@..│');
console.log('  │ NODE_ENV=production  │ JWT_SECRET=s3cr3t-k3y               │');
console.log('  │ LOG_LEVEL=info       │ STRIPE_SECRET_KEY=sk_live_...       │');
console.log('  │ MAX_UPLOAD_SIZE=5MB  │ AWS_SECRET_ACCESS_KEY=...           │');
console.log('  │ CORS_ORIGIN=https:// │ SMTP_PASSWORD=...                   │');
console.log('  ├──────────────────────┼──────────────────────────────────────┤');
console.log('  │ Can commit defaults  │ NEVER commit, NEVER log             │');
console.log('  │ .env.example has them│ Use secret managers in production   │');
console.log('  └──────────────────────┴──────────────────────────────────────┘');
console.log('');

// Secret management approaches
console.log('  SECRET MANAGEMENT (production):');
console.log('    Development:  .env file (gitignored)');
console.log('    CI/CD:        GitHub Secrets, GitLab CI Variables');
console.log('    Cloud:        AWS Secrets Manager, GCP Secret Manager');
console.log('    Kubernetes:   K8s Secrets (mounted as env vars or files)');
console.log('    Docker:       Docker Secrets (Swarm mode)');
console.log('    General:      HashiCorp Vault\n');


// ============================================================================
// SECTION 9: Common Mistakes
// ============================================================================

console.log('=== SECTION 9: Common Mistakes ===\n');

// Mistake 1: Hardcoding values
console.log('  MISTAKE 1: Hardcoding connection strings');
console.log('    BAD:  const db = connect("postgres://admin:pass@prod-db:5432")');
console.log('    GOOD: const db = connect(process.env.DATABASE_URL)\n');

// Mistake 2: Not handling missing vars
console.log('  MISTAKE 2: Not handling missing env vars');
console.log('    BAD:  const port = process.env.PORT;  // could be undefined');
console.log('    GOOD: const port = process.env.PORT || 3000;\n');

// Mistake 3: Treating env vars as their actual types
console.log('  MISTAKE 3: Type coercion bugs');
process.env.MAX_RETRIES = '0';
const badCheck = process.env.MAX_RETRIES || 5;  // Gets 5 because "0" is falsy!
const goodCheck = process.env.MAX_RETRIES !== undefined
  ? parseInt(process.env.MAX_RETRIES, 10)
  : 5;
console.log(`    BAD:  process.env.MAX_RETRIES || 5  => ${badCheck} (wanted 0!)`);
console.log(`    GOOD: explicit parse => ${goodCheck}`);
console.log('    "0", "", and "false" are all truthy strings but falsy-looking!\n');

// Mistake 4: Logging secrets
console.log('  MISTAKE 4: Logging env vars');
console.log('    BAD:  console.log("Config:", process.env)  // logs ALL secrets!');
console.log('    GOOD: console.log("Config:", { port: config.port, env: config.env })\n');

// Mistake 5: Committing .env
console.log('  MISTAKE 5: Committing .env to git');
console.log('    Even if you delete it later, it is in git history FOREVER');
console.log('    If this happens: rotate ALL secrets immediately!\n');


/**
 * OUTPUT:
 *   === SECTION 1: process.env Basics ===
 *   A: NODE_ENV = "(not set)"
 *   B: HOME = "/home/user"
 *   C: PATH exists = true
 *   D: MY_CUSTOM_VAR = "hello"
 *   E: typeof PORT = "string"
 *   F: PORT value = "3000"
 *   G: PORT === 3000? false
 *   H: PORT === "3000"? true
 *   I: undefined becomes: "undefined"
 *   J: null becomes: "null"
 *   K: After delete: undefined
 *
 *   === SECTION 2: Parsing Environment Variables ===
 *   L: PORT as number: 8080
 *   M: DEBUG as boolean: true
 *   N: ORIGINS as array: ['http://localhost:3000', 'https://myapp.com']
 *   O: DB_CONFIG as JSON: { host: 'localhost', port: 5432 }
 *   ...
 *
 *   (Sections 3-9 continue...)
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ INTERVIEW ANSWER                                                         ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ "I follow the 12-Factor App methodology for configuration. All config   ║
 * ║  lives in environment variables - never hardcoded. I create a central   ║
 * ║  config module that reads process.env, parses values (since they are    ║
 * ║  always strings), validates required vars at startup, and freezes the   ║
 * ║  config object. For development, I use .env files (always gitignored).  ║
 * ║  In production, I use the platform's secret manager (AWS Secrets        ║
 * ║  Manager, K8s Secrets). NODE_ENV is critical - setting it to            ║
 * ║  'production' enables performance optimizations in Express and other    ║
 * ║  libraries. The key gotcha is that process.env values are always        ║
 * ║  strings - '0' and 'false' are truthy, so you must parse carefully."   ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * RUN: node docs/node/11-deployment/02-env-variables.js
 */
