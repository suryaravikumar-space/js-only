/**
 * TOPIC 01: Docker Basics for Node.js
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ Docker packages your app + ALL its dependencies into a CONTAINER that   ║
 * ║ runs identically everywhere: dev laptop, CI server, production cloud.   ║
 * ║                                                                          ║
 * ║   Image  = Blueprint (Dockerfile)                                       ║
 * ║   Container = Running instance of an image                              ║
 * ║   "Works on my machine" → "Works in the container"                      ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  Think of SHIPPING CONTAINERS. Before containers, moving goods was a     │
 * │  nightmare - different trucks, different loading docks, fragile items     │
 * │  mixed with heavy ones.                                                   │
 * │                                                                            │
 * │  Then someone invented the STANDARD SHIPPING CONTAINER:                  │
 * │    - Pack EVERYTHING your cargo needs inside it                          │
 * │    - Same size fits on any truck, train, or ship                         │
 * │    - What's inside doesn't matter - the container is the standard        │
 * │                                                                            │
 * │  Docker does the same for software:                                      │
 * │    - Pack your app + Node.js + dependencies in a container              │
 * │    - Runs the same on Mac, Linux, AWS, Azure, anywhere                  │
 * │    - No more "but it works on MY machine!"                              │
 * │                                                                            │
 * │  "Docker = Standard shipping container for software."                    │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM: Docker Layers & Build Process                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │   DOCKER IMAGE LAYERS (each instruction = new layer):                     │
 * │                                                                            │
 * │   ┌─────────────────────────────────────────┐                             │
 * │   │  Layer 5: CMD ["node", "server.js"]     │  ← Your start command      │
 * │   ├─────────────────────────────────────────┤                             │
 * │   │  Layer 4: COPY . .                      │  ← Your source code        │
 * │   ├─────────────────────────────────────────┤     (changes often)         │
 * │   │  Layer 3: RUN npm ci --only=production  │  ← Dependencies            │
 * │   ├─────────────────────────────────────────┤     (changes sometimes)     │
 * │   │  Layer 2: COPY package*.json ./         │  ← Package files           │
 * │   ├─────────────────────────────────────────┤                             │
 * │   │  Layer 1: FROM node:20-alpine           │  ← Base OS + Node.js       │
 * │   └─────────────────────────────────────────┘     (rarely changes)        │
 * │                                                                            │
 * │   WHY ORDER MATTERS (Layer Caching):                                      │
 * │                                                                            │
 * │   When you change source code (Layer 4):                                  │
 * │   Layer 1: CACHED  ✓  (base image unchanged)                             │
 * │   Layer 2: CACHED  ✓  (package.json unchanged)                           │
 * │   Layer 3: CACHED  ✓  (dependencies unchanged!)                          │
 * │   Layer 4: REBUILT ✗  (source code changed)                              │
 * │   Layer 5: REBUILT ✗  (must rebuild after Layer 4)                       │
 * │                                                                            │
 * │   If you did COPY . . BEFORE npm install, changing ANY file              │
 * │   would invalidate the npm install cache! Slow builds!                   │
 * │                                                                            │
 * │                                                                            │
 * │   MULTI-STAGE BUILD:                                                      │
 * │                                                                            │
 * │   Stage 1: BUILD                    Stage 2: PRODUCTION                   │
 * │   ┌─────────────────────┐          ┌────────────────────────┐             │
 * │   │ FROM node:20        │          │ FROM node:20-alpine    │             │
 * │   │ COPY package*.json  │          │ COPY --from=build      │             │
 * │   │ RUN npm ci          │   ───►   │   /app/node_modules    │             │
 * │   │ COPY . .            │          │ COPY --from=build      │             │
 * │   │ RUN npm run build   │          │   /app/dist            │             │
 * │   │ (has devDeps, tools)│          │ (lean, production only)│             │
 * │   │ Size: ~900MB        │          │ Size: ~150MB           │             │
 * │   └─────────────────────┘          └────────────────────────┘             │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// SECTION 1: Dockerfile Anatomy for Node.js
// ============================================================================

console.log('=== SECTION 1: Dockerfile for Node.js ===\n');

// Basic Dockerfile (as a string for reference)
const basicDockerfile = `
# ---- BAD Dockerfile (common mistakes) ----
FROM node:20                    # Full image (~900MB), includes build tools
COPY . .                        # Copies EVERYTHING (node_modules, .git, .env!)
RUN npm install                 # Installs devDependencies too!
CMD ["node", "server.js"]
# Problems: huge image, includes secrets, no layer caching for deps


# ---- GOOD Dockerfile (production-ready) ----
FROM node:20-alpine AS build    # Alpine = ~130MB vs ~900MB for full

WORKDIR /app                    # Set working directory

# Copy ONLY package files first (layer caching!)
COPY package.json package-lock.json ./

# npm ci = clean install from lockfile (deterministic, faster)
RUN npm ci --only=production

# Copy source code AFTER installing deps
COPY . .

# Run as non-root user (security!)
RUN addgroup -g 1001 -S nodejs && \\
    adduser -S nodeuser -u 1001
USER nodeuser

EXPOSE 3000

# Use array form (exec form) - proper signal handling!
CMD ["node", "server.js"]
`;

console.log('  Dockerfile explained:');
basicDockerfile.split('\n').forEach((line) => {
  if (line.trim()) console.log(`  ${line}`);
});
console.log('');


// ============================================================================
// SECTION 2: npm ci vs npm install (TRICKY interview question)
// ============================================================================

console.log('=== SECTION 2: npm ci vs npm install ===\n');

const npmComparison = [
  ['Aspect',              'npm install',                'npm ci'                    ],
  ['Reads from',          'package.json',               'package-lock.json'         ],
  ['Modifies lockfile?',  'YES (may update it)',         'NO (fails if mismatch)'   ],
  ['node_modules',        'Merges with existing',       'Deletes & clean install'   ],
  ['Speed',               'Slower (resolves deps)',     'Faster (uses lockfile)'    ],
  ['Deterministic?',      'NO (versions may vary)',     'YES (exact lockfile)'      ],
  ['Use in Docker?',      'NO!',                        'YES! Always!'              ],
  ['Use in CI/CD?',       'NO!',                        'YES! Always!'              ],
];

npmComparison.forEach((row, i) => {
  const formatted = row.map((col, j) => col.padEnd(j === 0 ? 20 : 30)).join('| ');
  console.log(`  ${formatted}`);
  if (i === 0) {
    console.log(`  ${'─'.repeat(20)}┼${'─'.repeat(30)}┼${'─'.repeat(30)}`);
  }
});
console.log('');

console.log('  TRICKY: "npm install" in Docker can produce DIFFERENT images');
console.log('  from the same code! npm ci guarantees reproducible builds.\n');


// ============================================================================
// SECTION 3: .dockerignore (Critical for security & performance)
// ============================================================================

console.log('=== SECTION 3: .dockerignore ===\n');

const dockerignore = `
# .dockerignore - MUST HAVE for Node.js projects
node_modules          # Never copy host node_modules (wrong platform!)
npm-debug.log
.git                  # Git history is huge and unnecessary
.gitignore
.env                  # NEVER include secrets in images!
.env.local
.env.*.local
Dockerfile            # Inception - don't need Dockerfile in the image
docker-compose.yml
.dockerignore
README.md
docs/
tests/                # No tests in production image
coverage/
.nyc_output
.vscode/
.idea/
*.md
`;

console.log('  .dockerignore contents:');
dockerignore.split('\n').forEach((line) => {
  if (line.trim()) console.log(`  ${line}`);
});
console.log('');

console.log('  TRICKY: Without .dockerignore:');
console.log('    1. Host node_modules copied in (may have wrong binaries for Linux!)');
console.log('    2. .env file with secrets baked into image');
console.log('    3. .git folder adds hundreds of MB');
console.log('    4. Layer cache invalidated by ANY file change\n');


// ============================================================================
// SECTION 4: COPY vs ADD (interview gotcha)
// ============================================================================

console.log('=== SECTION 4: COPY vs ADD ===\n');

console.log('  COPY:');
console.log('    - Simple file/directory copy');
console.log('    - COPY package.json ./');
console.log('    - Use this 99% of the time\n');

console.log('  ADD:');
console.log('    - Everything COPY does, PLUS:');
console.log('    - Auto-extracts tar archives: ADD app.tar.gz /app');
console.log('    - Can fetch URLs: ADD https://example.com/file.txt /app/');
console.log('    - But URL fetching has NO caching and NO checksum!\n');

console.log('  TRICKY INTERVIEW ANSWER:');
console.log('    "Always use COPY unless you specifically need tar extraction.');
console.log('     ADD has implicit behavior that can be surprising.');
console.log('     Docker best practices explicitly recommend COPY over ADD."\n');


// ============================================================================
// SECTION 5: Multi-Stage Build (production pattern)
// ============================================================================

console.log('=== SECTION 5: Multi-Stage Build ===\n');

const multiStageDockerfile = `
# Stage 1: Build (has devDependencies, build tools)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci                          # ALL deps (including devDependencies)
COPY . .
RUN npm run build                   # TypeScript compile, webpack, etc.

# Stage 2: Production (lean image)
FROM node:20-alpine AS production
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \\
    adduser -S nodeuser -u 1001

# Copy ONLY what's needed from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

USER nodeuser
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1) })"

CMD ["node", "dist/server.js"]
`;

console.log('  Multi-stage Dockerfile:');
multiStageDockerfile.split('\n').forEach((line) => {
  if (line.trim()) console.log(`  ${line}`);
});
console.log('');

console.log('  Size comparison:');
console.log('    Single stage (node:20):       ~950MB');
console.log('    Single stage (node:20-alpine): ~180MB');
console.log('    Multi-stage (alpine, prod):    ~80-150MB\n');


// ============================================================================
// SECTION 6: docker-compose for Node + Database
// ============================================================================

console.log('=== SECTION 6: docker-compose.yml ===\n');

const dockerCompose = `
version: "3.8"
services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
      target: production          # Use the production stage
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres          # Service name = hostname!
      - DB_PORT=5432
      - REDIS_HOST=redis
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/health', r => process.exit(r.statusCode === 200 ? 0 : 1))"]
      interval: 30s
      timeout: 3s
      retries: 3

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secret    # Use Docker secrets in real prod!
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U admin"]
      interval: 5s
      timeout: 3s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  pgdata:                          # Named volume persists data
`;

console.log('  docker-compose.yml:');
dockerCompose.split('\n').forEach((line) => {
  if (line.trim()) console.log(`  ${line}`);
});
console.log('');


// ============================================================================
// SECTION 7: Signal Handling in Docker (TRICKY)
// ============================================================================

console.log('=== SECTION 7: Signal Handling in Docker ===\n');

console.log('  PROBLEM: docker stop sends SIGTERM, but Node.js must handle it!\n');

console.log('  CMD ["node", "server.js"]     ← CORRECT (exec form)');
console.log('    Node.js is PID 1, receives SIGTERM directly\n');

console.log('  CMD node server.js             ← WRONG (shell form)');
console.log('    Runs as: /bin/sh -c "node server.js"');
console.log('    sh is PID 1, Node.js is a child');
console.log('    sh does NOT forward SIGTERM to Node.js!');
console.log('    docker stop waits 10s then SIGKILL (ungraceful!)\n');

// Demonstrate signal handling
console.log('  Proper signal handling for Docker:');

const signalHandlerCode = `
    // In your server.js:
    const server = http.createServer(app);

    const shutdown = (signal) => {
      console.log(\\\`Received \\\${signal}. Graceful shutdown...\\\`);
      server.close(() => {
        console.log('Server closed. Exiting.');
        process.exit(0);
      });
      // Force exit after 10s if connections won't close
      setTimeout(() => process.exit(1), 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
`;

signalHandlerCode.split('\n').forEach((line) => {
  console.log(`  ${line}`);
});
console.log('');


// ============================================================================
// SECTION 8: Node.js Base Image Comparison
// ============================================================================

console.log('=== SECTION 8: Base Image Comparison ===\n');

const images = [
  ['Image',              'Size',    'Use Case',                    'Notes'                 ],
  ['node:20',            '~950MB',  'Build stage only',            'Has gcc, make, python'  ],
  ['node:20-slim',       '~200MB',  'When you need Debian',        'No build tools'         ],
  ['node:20-alpine',     '~130MB',  'Production (most common)',    'Uses musl libc'         ],
  ['node:20-bookworm',   '~950MB',  'Need specific Debian ver',    'Debian 12'              ],
];

images.forEach((row, i) => {
  const formatted = row.map((col, j) => col.padEnd([20, 10, 32, 25][j])).join('| ');
  console.log(`  ${formatted}`);
  if (i === 0) {
    console.log(`  ${'─'.repeat(20)}┼${'─'.repeat(10)}┼${'─'.repeat(32)}┼${'─'.repeat(25)}`);
  }
});

console.log('\n  TRICKY: Alpine uses musl libc instead of glibc.');
console.log('  Some native modules (bcrypt, sharp) may need rebuilding.');
console.log('  If native deps fail on alpine, try node:20-slim instead.\n');


// ============================================================================
// SECTION 9: Running as Non-Root (Security)
// ============================================================================

console.log('=== SECTION 9: Running as Non-Root ===\n');

console.log('  WHY: If attacker exploits your app, they get ROOT access to container!');
console.log('  Container root can sometimes escape to host (container breakout).\n');

console.log('  SOLUTION in Dockerfile:');
console.log('    # Create non-root user');
console.log('    RUN addgroup -g 1001 -S nodejs');
console.log('    RUN adduser -S nodeuser -u 1001');
console.log('    ');
console.log('    # Change ownership of app files');
console.log('    COPY --chown=nodeuser:nodejs . .');
console.log('    ');
console.log('    # Switch to non-root user');
console.log('    USER nodeuser');
console.log('    ');
console.log('    # Node.js 20+ has a built-in user "node" (uid 1000)');
console.log('    # So you can simply do: USER node\n');

// Demonstrate checking current user
console.log(`  Current process user: uid=${process.getuid ? process.getuid() : 'N/A'}`);
console.log(`  Current process group: gid=${process.getgid ? process.getgid() : 'N/A'}\n`);


// ============================================================================
// SECTION 10: Essential Docker Commands
// ============================================================================

console.log('=== SECTION 10: Essential Docker Commands ===\n');

const dockerCommands = {
  build: {
    basic: 'docker build -t my-app .',
    noCache: 'docker build --no-cache -t my-app .',
    multiStage: 'docker build --target production -t my-app .',
  },
  run: {
    basic: 'docker run -p 3000:3000 my-app',
    detached: 'docker run -d --name my-app -p 3000:3000 my-app',
    withEnv: 'docker run -e NODE_ENV=production -p 3000:3000 my-app',
    withVolume: 'docker run -v $(pwd):/app -p 3000:3000 my-app',
  },
  manage: {
    ps: 'docker ps                    # running containers',
    psAll: 'docker ps -a                 # all containers',
    logs: 'docker logs my-app            # view logs',
    exec: 'docker exec -it my-app sh     # shell into container',
    stop: 'docker stop my-app            # graceful stop',
    rm: 'docker rm my-app              # remove container',
  },
  compose: {
    up: 'docker-compose up -d          # start all services',
    down: 'docker-compose down            # stop all services',
    logs: 'docker-compose logs -f api     # follow api logs',
    build: 'docker-compose build           # rebuild images',
  },
};

Object.entries(dockerCommands).forEach(([category, cmds]) => {
  console.log(`  ${category.toUpperCase()}:`);
  Object.entries(cmds).forEach(([key, cmd]) => {
    console.log(`    ${cmd}`);
  });
  console.log('');
});


/**
 * OUTPUT:
 *   === SECTION 1: Dockerfile for Node.js ===
 *   (Dockerfile contents with explanations)
 *
 *   === SECTION 2: npm ci vs npm install ===
 *   (Comparison table)
 *
 *   === SECTION 3: .dockerignore ===
 *   === SECTION 4: COPY vs ADD ===
 *   === SECTION 5: Multi-Stage Build ===
 *   === SECTION 6: docker-compose.yml ===
 *   === SECTION 7: Signal Handling in Docker ===
 *   === SECTION 8: Base Image Comparison ===
 *   === SECTION 9: Running as Non-Root ===
 *   === SECTION 10: Essential Docker Commands ===
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ INTERVIEW ANSWER                                                         ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ "I containerize Node.js apps using multi-stage Docker builds. The first ║
 * ║  stage installs all dependencies and builds (TypeScript, webpack), then  ║
 * ║  the production stage copies only the built artifacts and production     ║
 * ║  node_modules into a slim Alpine image. I always use npm ci for         ║
 * ║  deterministic builds, a .dockerignore to exclude node_modules and      ║
 * ║  secrets, exec-form CMD for proper signal handling, and run as a        ║
 * ║  non-root user for security. For local development with databases,      ║
 * ║  I use docker-compose with health checks and named volumes for          ║
 * ║  data persistence. The key optimization is ordering Dockerfile          ║
 * ║  instructions so package.json is copied before source code -            ║
 * ║  this caches the npm ci layer when only code changes."                  ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * RUN: node docs/node/11-deployment/01-docker-basics.js
 */
