/**
 * TOPIC 00: PM2 Process Manager
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ PM2 is a PRODUCTION process manager for Node.js that keeps your app     ║
 * ║ alive forever, reloads without downtime, and manages clustering.        ║
 * ║                                                                          ║
 * ║   Development  → nodemon (restarts on file change)                      ║
 * ║   Production   → PM2 (restarts on crash, clustering, logs, monitoring)  ║
 * ║   Legacy       → forever (simpler but fewer features)                   ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  You own a 24/7 convenience store. You HIRE A NIGHT GUARD (PM2).         │
 * │                                                                            │
 * │  What does the night guard do?                                            │
 * │    1. RESTARTS the store if it crashes (auto-restart on failure)          │
 * │    2. Manages SHIFTS - puts multiple clerks on duty (cluster mode)       │
 * │    3. Keeps a LOG BOOK of everything that happens (log management)       │
 * │    4. Calls you if something goes wrong (monitoring & alerts)            │
 * │    5. Swaps staff WITHOUT closing the store (zero-downtime reload)       │
 * │                                                                            │
 * │  Without the guard (running node server.js directly):                    │
 * │    - Store crashes at 3 AM? Nobody restarts it. Customers leave.        │
 * │    - Only ONE clerk handles ALL customers (single process).             │
 * │    - No record of what went wrong (stdout lost).                        │
 * │                                                                            │
 * │  "PM2 is the night guard that never sleeps."                             │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM: PM2 Process Management                                    │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │   ┌─────────────── PM2 DAEMON ──────────────────────┐                     │
 * │   │  (Runs in background, manages everything)       │                     │
 * │   │                                                  │                     │
 * │   │  ┌──────────────────────────────────────┐       │                     │
 * │   │  │         PROCESS TABLE                 │       │                     │
 * │   │  ├──────┬────────┬────────┬─────────────┤       │                     │
 * │   │  │ ID   │ Name   │ Mode   │ Status      │       │                     │
 * │   │  ├──────┼────────┼────────┼─────────────┤       │                     │
 * │   │  │ 0    │ app    │ fork   │ online      │       │                     │
 * │   │  │ 1    │ api    │ cluster│ online      │       │                     │
 * │   │  │ 2    │ api    │ cluster│ online      │       │                     │
 * │   │  │ 3    │ api    │ cluster│ online      │       │                     │
 * │   │  │ 4    │ api    │ cluster│ online      │       │                     │
 * │   │  │ 5    │ worker │ fork   │ stopped     │       │                     │
 * │   │  └──────┴────────┴────────┴─────────────┘       │                     │
 * │   │                                                  │                     │
 * │   │  ┌────────────┐  ┌────────────┐  ┌──────────┐  │                     │
 * │   │  │ Log Manager│  │ Monitoring │  │ Restarter│  │                     │
 * │   │  │ stdout.log │  │ CPU / Mem  │  │ On crash │  │                     │
 * │   │  │ stderr.log │  │ Loop delay │  │ On OOM   │  │                     │
 * │   │  └────────────┘  └────────────┘  └──────────┘  │                     │
 * │   └──────────────────────────────────────────────────┘                     │
 * │                                                                            │
 * │   FORK MODE vs CLUSTER MODE:                                              │
 * │                                                                            │
 * │   Fork Mode (default):          Cluster Mode (-i max):                    │
 * │   ┌──────────┐                  ┌──────────┐                              │
 * │   │ PM2      │                  │ PM2      │                              │
 * │   │  └─ app  │ (1 process)     │  ├─ app:0 │ (shares port 3000)         │
 * │   └──────────┘                  │  ├─ app:1 │ (shares port 3000)         │
 * │                                  │  ├─ app:2 │ (shares port 3000)         │
 * │                                  │  └─ app:3 │ (shares port 3000)         │
 * │                                  └──────────┘                              │
 * │   Use for: scripts,             Use for: HTTP servers,                    │
 * │   workers, cron jobs            APIs (CPU-bound scaling)                  │
 * │                                                                            │
 * │   ZERO-DOWNTIME RELOAD (pm2 reload):                                      │
 * │                                                                            │
 * │   Time ──────────────────────────────────────────►                         │
 * │   Worker 0: ████████████░░░░░░████████████████████                        │
 * │   Worker 1: ████████████████████████░░░░░░████████                        │
 * │   Worker 2: ████████████████████████████████░░░░░░                        │
 * │              old code    ▲ reload   new code                              │
 * │                          │ triggered                                      │
 * │   (░░░ = restarting, ███ = serving requests)                              │
 * │   At least one worker is ALWAYS serving!                                  │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// SECTION 1: Understanding PM2 Commands (conceptual - logged as reference)
// ============================================================================

console.log('=== SECTION 1: PM2 Essential Commands ===\n');

const pm2Commands = {
  // Starting apps
  start: {
    basic: 'pm2 start app.js',
    named: 'pm2 start app.js --name "my-api"',
    cluster: 'pm2 start app.js -i max',           // use all CPU cores
    clusterN: 'pm2 start app.js -i 4',             // use 4 instances
    withArgs: 'pm2 start app.js -- --port 3000',   // pass args to app
    watch: 'pm2 start app.js --watch',              // restart on file change
    maxMemory: 'pm2 start app.js --max-memory-restart 300M',
  },

  // Managing processes
  manage: {
    list: 'pm2 list',               // show all processes
    stop: 'pm2 stop app',           // stop by name
    restart: 'pm2 restart app',     // hard restart (brief downtime)
    reload: 'pm2 reload app',       // zero-downtime reload (cluster only!)
    delete: 'pm2 delete app',       // remove from PM2
    stopAll: 'pm2 stop all',
    deleteAll: 'pm2 delete all',
  },

  // Monitoring & Logs
  monitor: {
    monit: 'pm2 monit',             // real-time dashboard
    logs: 'pm2 logs',               // stream all logs
    logsApp: 'pm2 logs app --lines 100', // last 100 lines for app
    flush: 'pm2 flush',             // clear all logs
    describe: 'pm2 describe app',   // detailed info about process
  },

  // System
  system: {
    startup: 'pm2 startup',         // generate startup script (survives reboot)
    save: 'pm2 save',               // save current process list
    resurrect: 'pm2 resurrect',     // restore saved process list
    update: 'pm2 update',           // update PM2 in-memory daemon
  },
};

Object.entries(pm2Commands).forEach(([category, commands]) => {
  console.log(`  ${category.toUpperCase()}:`);
  Object.entries(commands).forEach(([key, cmd]) => {
    console.log(`    ${key.padEnd(15)} => ${cmd}`);
  });
  console.log('');
});


// ============================================================================
// SECTION 2: ecosystem.config.js - The PM2 Configuration File
// ============================================================================

console.log('=== SECTION 2: ecosystem.config.js ===\n');

// This is what an ecosystem.config.js looks like:
const ecosystemConfig = {
  apps: [
    {
      name: 'api-server',
      script: './src/server.js',
      instances: 'max',               // or a number like 4
      exec_mode: 'cluster',           // 'fork' or 'cluster'
      watch: false,                    // don't watch in production!
      max_memory_restart: '500M',      // restart if memory exceeds 500MB
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 8080,
      },
      // Log configuration
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      merge_logs: true,                // merge logs from all cluster instances
      // Restart behavior
      max_restarts: 10,                // max restarts within min_uptime window
      min_uptime: '10s',               // consider crash if restarts within 10s
      restart_delay: 4000,             // wait 4s before restarting
      autorestart: true,
      // Graceful shutdown
      kill_timeout: 5000,              // time to wait before force kill (SIGKILL)
      listen_timeout: 3000,            // time to wait for app to listen
    },
    {
      name: 'background-worker',
      script: './src/worker.js',
      instances: 1,
      exec_mode: 'fork',              // workers usually run in fork mode
      cron_restart: '0 0 * * *',      // restart daily at midnight
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};

console.log('  ecosystem.config.js structure:');
console.log(JSON.stringify(ecosystemConfig, null, 2).split('\n').slice(0, 20).join('\n'));
console.log('  ... (truncated)\n');

// TRICKY: How to use different environments
console.log('  TRICKY - Environment switching:');
console.log('    pm2 start ecosystem.config.js                  => uses env (development)');
console.log('    pm2 start ecosystem.config.js --env production  => uses env_production');
console.log('    The --env flag picks which env_* block to merge!\n');


// ============================================================================
// SECTION 3: Graceful Shutdown (CRITICAL for zero-downtime)
// ============================================================================

console.log('=== SECTION 3: Graceful Shutdown Pattern ===\n');

// Simulating a server with graceful shutdown
const simulateGracefulShutdown = () => {
  // In a real app, this would be your HTTP server
  const connections = new Set();
  let isShuttingDown = false;

  const server = {
    // Simulate tracking connections
    addConnection: (id) => connections.add(id),
    removeConnection: (id) => connections.delete(id),
    activeConnections: () => connections.size,
  };

  // Simulate some active connections
  server.addConnection('conn-1');
  server.addConnection('conn-2');
  server.addConnection('conn-3');

  console.log('  Active connections before shutdown:', server.activeConnections());

  // GRACEFUL SHUTDOWN HANDLER
  // PM2 sends SIGINT first, then SIGKILL after kill_timeout
  const gracefulShutdown = (signal) => {
    console.log(`  Received ${signal}. Starting graceful shutdown...`);
    isShuttingDown = true;

    // Step 1: Stop accepting new connections
    console.log('  Step 1: Stopped accepting new connections');

    // Step 2: Wait for existing connections to finish
    console.log(`  Step 2: Waiting for ${server.activeConnections()} connections to close...`);

    // Simulate connections closing over time
    let remaining = server.activeConnections();
    const closeInterval = setInterval(() => {
      remaining--;
      console.log(`  Connection closed. ${remaining} remaining.`);
      if (remaining <= 0) {
        clearInterval(closeInterval);
        // Step 3: Close database connections, flush logs, etc.
        console.log('  Step 3: Cleaned up resources');
        console.log('  Graceful shutdown complete!\n');
      }
    }, 100);
  };

  // Register signal handlers
  // process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  // process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

  // Simulate receiving SIGINT
  gracefulShutdown('SIGINT');

  // TRICKY: PM2 also supports 'ready' signal for cluster mode
  console.log('  TRICKY - PM2 ready signal:');
  console.log('    // In your app after server starts listening:');
  console.log('    process.send("ready");  // tells PM2 the app is ready');
  console.log('    // In ecosystem.config.js: wait_ready: true, listen_timeout: 3000\n');
};

simulateGracefulShutdown();


// ============================================================================
// SECTION 4: PM2 vs forever vs nodemon
// ============================================================================

setTimeout(() => {
  console.log('=== SECTION 4: PM2 vs forever vs nodemon ===\n');

  const comparison = [
    ['Feature',            'PM2',           'forever',       'nodemon'        ],
    ['Use case',           'Production',    'Simple prod',   'Development'    ],
    ['Cluster mode',       'Yes (built-in)','No',            'No'             ],
    ['Zero-downtime',      'Yes (reload)',  'No',            'No'             ],
    ['Load balancing',     'Yes (round-robin)','No',         'No'             ],
    ['Log management',     'Yes (rotation)','Basic',         'No'             ],
    ['Monitoring',         'Yes (monit)',   'No',            'No'             ],
    ['File watching',      'Yes',           'Yes',           'Yes (primary)'  ],
    ['Startup scripts',    'Yes',           'No',            'No'             ],
    ['Ecosystem config',   'Yes',           'No',            'nodemon.json'   ],
    ['Memory limit',       'Yes',           'No',            'No'             ],
    ['Deploy system',      'Yes',           'No',            'No'             ],
  ];

  comparison.forEach((row, i) => {
    const formatted = row.map((col, j) => col.padEnd(j === 0 ? 20 : 17)).join('| ');
    console.log(`  ${formatted}`);
    if (i === 0) {
      console.log(`  ${'─'.repeat(20)}${'┼'.repeat(1)}${'─'.repeat(17)}${'┼'.repeat(1)}${'─'.repeat(17)}${'┼'.repeat(1)}${'─'.repeat(17)}`);
    }
  });

  console.log('\n  TRICKY INTERVIEW GOTCHAS:');
  console.log('  1. nodemon is ONLY for development - never use in production');
  console.log('  2. forever is mostly deprecated - PM2 is the standard');
  console.log('  3. PM2 cluster mode uses Node.js cluster module internally');
  console.log('  4. PM2 reload only works in cluster mode (fork mode = restart)\n');


  // ============================================================================
  // SECTION 5: Cluster Mode vs Worker Threads
  // ============================================================================

  console.log('=== SECTION 5: Cluster Mode vs Worker Threads ===\n');

  console.log('  PM2 CLUSTER MODE (multiple processes):');
  console.log('  ┌──────────────────────────────────────────────────┐');
  console.log('  │  Master Process (PM2)                            │');
  console.log('  │    ├─ Worker Process 1 (separate V8, own memory) │');
  console.log('  │    ├─ Worker Process 2 (separate V8, own memory) │');
  console.log('  │    ├─ Worker Process 3 (separate V8, own memory) │');
  console.log('  │    └─ Worker Process 4 (separate V8, own memory) │');
  console.log('  │  All share the SAME PORT via OS round-robin      │');
  console.log('  └──────────────────────────────────────────────────┘');
  console.log('  Use when: Scaling HTTP servers across CPU cores\n');

  console.log('  WORKER THREADS (within a single process):');
  console.log('  ┌──────────────────────────────────────────────────┐');
  console.log('  │  Main Thread (1 process, 1 V8 instance)         │');
  console.log('  │    ├─ Worker Thread 1 (shares memory via SAB)   │');
  console.log('  │    ├─ Worker Thread 2 (shares memory via SAB)   │');
  console.log('  │    └─ Worker Thread 3 (shares memory via SAB)   │');
  console.log('  │  Lightweight, can share memory, same process    │');
  console.log('  └──────────────────────────────────────────────────┘');
  console.log('  Use when: CPU-heavy tasks (image processing, crypto)\n');

  console.log('  KEY DIFFERENCES:');
  console.log('  ┌──────────────────┬────────────────────┬─────────────────────┐');
  console.log('  │ Aspect           │ Cluster Mode       │ Worker Threads      │');
  console.log('  ├──────────────────┼────────────────────┼─────────────────────┤');
  console.log('  │ Isolation        │ Full (processes)   │ Partial (threads)   │');
  console.log('  │ Memory           │ Separate per proc  │ Can share (SAB)     │');
  console.log('  │ Communication    │ IPC (slow)         │ MessagePort (fast)  │');
  console.log('  │ Crash impact     │ Others survive     │ May crash process   │');
  console.log('  │ Port sharing     │ Yes (built-in)     │ No (manual)         │');
  console.log('  │ Overhead         │ High (full process)│ Low (thread)        │');
  console.log('  └──────────────────┴────────────────────┴─────────────────────┘\n');


  // ============================================================================
  // SECTION 6: Log Management
  // ============================================================================

  console.log('=== SECTION 6: PM2 Log Management ===\n');

  console.log('  Default log locations:');
  console.log('    ~/.pm2/logs/app-name-out.log   (stdout)');
  console.log('    ~/.pm2/logs/app-name-error.log (stderr)\n');

  // Simulating log rotation config
  const logRotateConfig = {
    module: 'pm2-logrotate',
    config: {
      max_size: '10M',          // rotate when file exceeds 10MB
      retain: 30,               // keep 30 rotated files
      compress: true,           // gzip old logs
      dateFormat: 'YYYY-MM-DD_HH-mm-ss',
      workerInterval: 30,       // check every 30 seconds
      rotateModule: true,       // rotate PM2 module logs too
    },
  };

  console.log('  Log rotation (pm2-logrotate module):');
  console.log('    pm2 install pm2-logrotate');
  console.log('    pm2 set pm2-logrotate:max_size 10M');
  console.log('    pm2 set pm2-logrotate:retain 30');
  console.log('    pm2 set pm2-logrotate:compress true\n');

  console.log('  TRICKY: In cluster mode, logs from all instances go to SAME file');
  console.log('  unless you set merge_logs: false in ecosystem.config.js');
  console.log('  Then each instance gets: app-name-0-out.log, app-name-1-out.log, etc.\n');


  // ============================================================================
  // SECTION 7: Common Mistakes & Gotchas
  // ============================================================================

  console.log('=== SECTION 7: Common Mistakes & Gotchas ===\n');

  const mistakes = [
    {
      mistake: 'Using pm2 restart for deploys',
      problem: 'Brief downtime as ALL processes restart simultaneously',
      fix: 'Use pm2 reload (cluster mode only) for zero-downtime',
    },
    {
      mistake: 'Not handling SIGINT/SIGTERM',
      problem: 'Connections dropped abruptly, data loss possible',
      fix: 'Implement graceful shutdown (close server, drain connections)',
    },
    {
      mistake: 'Using --watch in production',
      problem: 'Unnecessary restarts, performance overhead from file watching',
      fix: 'Only use --watch in development, use CI/CD for deploys',
    },
    {
      mistake: 'Not setting max_memory_restart',
      problem: 'Memory leaks crash the entire server',
      fix: 'Set max_memory_restart: "500M" to auto-restart leaky apps',
    },
    {
      mistake: 'Forgetting pm2 save after changes',
      problem: 'Rebooting server loses your PM2 process list',
      fix: 'Run pm2 save after starting/stopping apps, pm2 startup for boot',
    },
    {
      mistake: 'Using fork mode for HTTP servers',
      problem: 'Single process cannot utilize multiple CPU cores',
      fix: 'Use cluster mode (-i max) for HTTP servers to scale across cores',
    },
    {
      mistake: 'pm2 reload in fork mode',
      problem: 'reload falls back to restart in fork mode (causes downtime)',
      fix: 'reload only works with exec_mode: "cluster"',
    },
  ];

  mistakes.forEach((m, i) => {
    console.log(`  ${i + 1}. MISTAKE: ${m.mistake}`);
    console.log(`     PROBLEM: ${m.problem}`);
    console.log(`     FIX: ${m.fix}\n`);
  });

}, 500);


/**
 * OUTPUT:
 *   === SECTION 1: PM2 Essential Commands ===
 *
 *     START:
 *       basic           => pm2 start app.js
 *       named           => pm2 start app.js --name "my-api"
 *       cluster         => pm2 start app.js -i max
 *       ...
 *
 *     MANAGE:
 *       list            => pm2 list
 *       stop            => pm2 stop app
 *       ...
 *
 *   === SECTION 2: ecosystem.config.js ===
 *   === SECTION 3: Graceful Shutdown Pattern ===
 *   === SECTION 4: PM2 vs forever vs nodemon ===
 *   === SECTION 5: Cluster Mode vs Worker Threads ===
 *   === SECTION 6: PM2 Log Management ===
 *   === SECTION 7: Common Mistakes & Gotchas ===
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ INTERVIEW ANSWER                                                         ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ "PM2 is a production process manager for Node.js. It keeps your app     ║
 * ║  running 24/7 by auto-restarting on crashes, supports cluster mode for  ║
 * ║  multi-core scaling, and enables zero-downtime reloads. I configure it  ║
 * ║  via ecosystem.config.js which defines instances, environment variables,║
 * ║  memory limits, and log paths. For deploys, I use 'pm2 reload' in      ║
 * ║  cluster mode so at least one worker is always serving requests. I also ║
 * ║  implement graceful shutdown by handling SIGINT/SIGTERM to drain active ║
 * ║  connections before the process exits. PM2 replaced forever as the      ║
 * ║  standard - nodemon is only for development."                           ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * RUN: node docs/node/11-deployment/00-pm2-process-manager.js
 */
