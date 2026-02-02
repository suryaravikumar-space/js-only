/**
 * TOPIC 04: Monitoring Node.js Applications
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ Logging tells you WHAT happened. Monitoring tells you HOW your app      ║
 * ║ is doing RIGHT NOW. You need both.                                      ║
 * ║                                                                          ║
 * ║   Logging  → "Order #789 failed at 14:30:01" (event)                   ║
 * ║   Monitoring → "Error rate jumped from 0.1% to 5%" (trend)             ║
 * ║   Alerting → "CPU > 90% for 5 minutes - paging on-call" (action)      ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  A HOSPITAL PATIENT MONITOR:                                              │
 * │                                                                            │
 * │  Doctors don't just read patient charts (logs). They also have a          │
 * │  real-time monitor showing heart rate, blood pressure, oxygen, and        │
 * │  temperature continuously.                                                │
 * │                                                                            │
 * │  If heart rate spikes above 120 → alarm sounds (ALERT!)                  │
 * │  If blood pressure drops below 90 → nurse gets paged                     │
 * │                                                                            │
 * │  Your Node.js app is the patient:                                         │
 * │    - Heart rate    = Event loop latency (is Node responsive?)             │
 * │    - Blood pressure = Memory usage (is it leaking?)                       │
 * │    - Oxygen         = CPU usage (is it starved?)                          │
 * │    - Temperature    = Error rate (is something going wrong?)              │
 * │                                                                            │
 * │  The monitor (Prometheus/Datadog/Grafana) watches these vitals            │
 * │  24/7 and pages you when something looks wrong.                           │
 * │                                                                            │
 * │  "You wouldn't leave a patient in ICU without a heart monitor.            │
 * │   Don't leave your production app without monitoring."                    │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM: Monitoring Architecture                                    │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │   NODE.JS APP                                                             │
 * │   ┌─────────────────────────────────────────────────┐                     │
 * │   │  Collect metrics:                               │                     │
 * │   │  - CPU, Memory, Event Loop Lag                  │                     │
 * │   │  - HTTP request count, latency, errors          │                     │
 * │   │  - Business metrics (orders/sec, signups)       │                     │
 * │   └────────────────────┬────────────────────────────┘                     │
 * │                        │  /metrics endpoint (pull)                        │
 * │                        │  OR push to collector                            │
 * │                        ▼                                                  │
 * │   METRICS COLLECTOR                                                       │
 * │   ┌─────────────────────────────────────────────────┐                     │
 * │   │  Prometheus / Datadog Agent / CloudWatch Agent  │                     │
 * │   │  - Scrapes /metrics every 15s                   │                     │
 * │   │  - Stores time-series data                      │                     │
 * │   └────────────────────┬────────────────────────────┘                     │
 * │                        │                                                  │
 * │              ┌─────────▼──────────┐                                       │
 * │              │  VISUALIZATION     │                                       │
 * │              │  Grafana / Datadog │                                       │
 * │              │  - Dashboards      │                                       │
 * │              │  - Graphs          │                                       │
 * │              └─────────┬──────────┘                                       │
 * │                        │                                                  │
 * │              ┌─────────▼──────────┐                                       │
 * │              │  ALERTING          │                                       │
 * │              │  - PagerDuty       │                                       │
 * │              │  - Slack           │                                       │
 * │              │  - Email           │                                       │
 * │              │  "CPU > 90% for    │                                       │
 * │              │   5 min → page"    │                                       │
 * │              └────────────────────┘                                       │
 * │                                                                            │
 * │   THE 4 GOLDEN SIGNALS (Google SRE):                                      │
 * │                                                                            │
 * │   Signal     │ What it measures         │ Node.js example                 │
 * │   ───────────┼──────────────────────────┼────────────────────────         │
 * │   Latency    │ Time to serve a request  │ p50, p95, p99 response time    │
 * │   Traffic    │ Requests per second      │ HTTP req/sec per endpoint      │
 * │   Errors     │ Rate of failed requests  │ 5xx responses / total          │
 * │   Saturation │ How "full" the service   │ Event loop lag, memory usage   │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// SECTION 1: Collecting Node.js Process Metrics
// ============================================================================

console.log('=== SECTION 1: Node.js Process Metrics ===\n');

// These are built-in - no dependencies needed!
const collectProcessMetrics = () => {
  const memUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();

  return {
    memory: {
      rss: (memUsage.rss / 1024 / 1024).toFixed(2) + ' MB',          // Total memory allocated
      heapTotal: (memUsage.heapTotal / 1024 / 1024).toFixed(2) + ' MB', // V8 heap allocated
      heapUsed: (memUsage.heapUsed / 1024 / 1024).toFixed(2) + ' MB',   // V8 heap actually used
      external: (memUsage.external / 1024 / 1024).toFixed(2) + ' MB',   // C++ objects bound to JS
    },
    cpu: {
      user: (cpuUsage.user / 1000).toFixed(2) + ' ms',    // CPU time in user code
      system: (cpuUsage.system / 1000).toFixed(2) + ' ms', // CPU time in system calls
    },
    uptime: process.uptime().toFixed(2) + ' seconds',
    pid: process.pid,
    nodeVersion: process.version,
    platform: process.platform,
  };
};

console.log('A: Current process metrics:');
const metrics = collectProcessMetrics();
console.log('   Memory RSS:', metrics.memory.rss);
console.log('   Heap Total:', metrics.memory.heapTotal);
console.log('   Heap Used:', metrics.memory.heapUsed);
console.log('   External:', metrics.memory.external);
console.log('   CPU User:', metrics.cpu.user);
console.log('   CPU System:', metrics.cpu.system);
console.log('   Uptime:', metrics.uptime);
console.log('   PID:', metrics.pid);
console.log('   Node Version:', metrics.nodeVersion);
console.log('');


// ============================================================================
// SECTION 2: Event Loop Monitoring
// ============================================================================

console.log('=== SECTION 2: Event Loop Monitoring ===\n');

console.log('B: Event loop lag measurement:');

// Measure event loop lag - how long until a timer actually fires
const measureEventLoopLag = () => {
  return new Promise((resolve) => {
    const start = process.hrtime.bigint();
    setImmediate(() => {
      const lag = Number(process.hrtime.bigint() - start) / 1e6; // ms
      resolve(lag);
    });
  });
};

// Simulate event loop lag by blocking
const blockEventLoop = (ms) => {
  const start = Date.now();
  while (Date.now() - start < ms) {
    // Intentionally blocking!
  }
};

(async () => {
  // Measure normal lag
  const normalLag = await measureEventLoopLag();
  console.log(`   Normal event loop lag: ${normalLag.toFixed(3)} ms`);

  // Block the event loop, then measure
  blockEventLoop(50); // Block for 50ms
  const blockedLag = await measureEventLoopLag();
  console.log(`   After 50ms block lag: ${blockedLag.toFixed(3)} ms`);
  console.log('');

  console.log('   TRICKY: What is "healthy" event loop lag?');
  console.log('     < 10ms  = Healthy');
  console.log('     10-50ms = Warning - something is blocking');
  console.log('     > 100ms = Critical - users will notice lag');
  console.log('     > 1s    = Emergency - app is essentially frozen');
  console.log('');

  // Continue with remaining sections after async work
  printRemainingOutput();
})();


// ============================================================================
// SECTION 3: Health Check Endpoint Pattern
// ============================================================================

const printRemainingOutput = () => {

  console.log('=== SECTION 3: Health Check Endpoint ===\n');

  // Health check - the most basic monitoring endpoint
  const createHealthCheck = (dependencies = {}) => {
    return () => {
      const health = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        checks: {},
      };

      // Check each dependency
      for (const [name, checkFn] of Object.entries(dependencies)) {
        try {
          health.checks[name] = checkFn();
        } catch (err) {
          health.status = 'degraded';
          health.checks[name] = { status: 'error', message: err.message };
        }
      }

      return health;
    };
  };

  // Simulate dependencies
  const healthCheck = createHealthCheck({
    database: () => ({ status: 'ok', latency: '2ms' }),
    redis: () => ({ status: 'ok', latency: '1ms' }),
    externalApi: () => { throw new Error('Connection timeout'); },
  });

  console.log('C: Health check response:');
  const healthResult = healthCheck();
  console.log('   Status:', healthResult.status);
  console.log('   Checks:');
  Object.entries(healthResult.checks).forEach(([name, result]) => {
    console.log(`     ${name}:`, JSON.stringify(result));
  });
  console.log('');

  console.log('  Health check types:');
  console.log('    /health/live  → "Is the process running?" (K8s liveness)');
  console.log('    /health/ready → "Can it serve traffic?" (K8s readiness)');
  console.log('    /health/deep  → "Are all dependencies healthy?" (full check)');
  console.log('');


  // ============================================================================
  // SECTION 4: Custom Metrics Collector
  // ============================================================================

  console.log('=== SECTION 4: Custom Metrics Collector ===\n');

  // Simple metrics collector (what Prometheus client libraries do)
  const createMetricsCollector = () => {
    const counters = {};  // Monotonically increasing values
    const gauges = {};    // Values that go up AND down
    const histograms = {}; // Distribution of values

    return {
      // Counter - only goes up (requests_total, errors_total)
      incCounter(name, labels = {}, value = 1) {
        const key = `${name}${JSON.stringify(labels)}`;
        counters[key] = (counters[key] || 0) + value;
      },

      // Gauge - goes up and down (active_connections, memory_usage)
      setGauge(name, value, labels = {}) {
        const key = `${name}${JSON.stringify(labels)}`;
        gauges[key] = value;
      },

      // Histogram - track distribution (request_duration_seconds)
      observeHistogram(name, value, labels = {}) {
        const key = `${name}${JSON.stringify(labels)}`;
        if (!histograms[key]) histograms[key] = [];
        histograms[key].push(value);
      },

      // Get percentile from histogram
      getPercentile(name, percentile, labels = {}) {
        const key = `${name}${JSON.stringify(labels)}`;
        const values = (histograms[key] || []).sort((a, b) => a - b);
        if (values.length === 0) return 0;
        const idx = Math.ceil((percentile / 100) * values.length) - 1;
        return values[idx];
      },

      // Prometheus-style output
      toPrometheus() {
        let output = '';
        for (const [key, val] of Object.entries(counters)) {
          output += `counter ${key} = ${val}\n`;
        }
        for (const [key, val] of Object.entries(gauges)) {
          output += `gauge ${key} = ${val}\n`;
        }
        for (const [key, vals] of Object.entries(histograms)) {
          output += `histogram ${key} count=${vals.length} sum=${vals.reduce((a, b) => a + b, 0).toFixed(2)}\n`;
        }
        return output;
      },

      getSummary() {
        return { counters, gauges, histogramKeys: Object.keys(histograms) };
      },
    };
  };

  const collector = createMetricsCollector();

  // Simulate HTTP requests
  const endpoints = ['/api/users', '/api/orders', '/api/products'];
  const methods = ['GET', 'POST'];
  const statuses = [200, 200, 200, 200, 201, 400, 500]; // Weighted toward success

  for (let i = 0; i < 50; i++) {
    const endpoint = endpoints[i % endpoints.length];
    const method = methods[i % methods.length];
    const status = statuses[i % statuses.length];
    const duration = Math.random() * 200 + 5; // 5-205ms

    collector.incCounter('http_requests_total', { method, endpoint, status });
    collector.observeHistogram('http_request_duration_ms', duration, { endpoint });
  }

  // System metrics
  const mem = process.memoryUsage();
  collector.setGauge('nodejs_heap_used_bytes', mem.heapUsed);
  collector.setGauge('nodejs_active_connections', 42);
  collector.setGauge('nodejs_event_loop_lag_ms', 3.2);

  console.log('D: Metrics collected after 50 simulated requests:');
  console.log('   Prometheus-style output:');
  console.log(collector.toPrometheus().split('\n').map((l) => '     ' + l).join('\n'));
  console.log('');

  console.log('E: Percentile latencies (p50, p95, p99):');
  endpoints.forEach((ep) => {
    const p50 = collector.getPercentile('http_request_duration_ms', 50, { endpoint: ep });
    const p95 = collector.getPercentile('http_request_duration_ms', 95, { endpoint: ep });
    const p99 = collector.getPercentile('http_request_duration_ms', 99, { endpoint: ep });
    console.log(`   ${ep}: p50=${p50.toFixed(1)}ms  p95=${p95.toFixed(1)}ms  p99=${p99.toFixed(1)}ms`);
  });
  console.log('');

  console.log('  TRICKY: Why percentiles matter more than averages');
  console.log('    Average response time = 50ms (looks fine!)');
  console.log('    But p99 = 2000ms → 1% of users wait 2+ seconds');
  console.log('    At 10,000 req/sec, 100 users/second are unhappy!');
  console.log('    Always monitor p50, p95, p99 - not just average.\n');


  // ============================================================================
  // SECTION 5: Memory Leak Detection
  // ============================================================================

  console.log('=== SECTION 5: Memory Leak Detection ===\n');

  console.log('F: Simulating memory monitoring:');

  // Simulate memory readings over time
  const memoryReadings = [];
  const baseMemory = 50; // MB

  // Normal app: memory fluctuates but stays stable
  for (let i = 0; i < 10; i++) {
    memoryReadings.push({
      time: `T+${i * 10}min`,
      heapMB: baseMemory + Math.random() * 10 - 5, // 45-55 MB (stable)
      type: 'normal',
    });
  }

  // Leaking app: memory grows monotonically
  const leakReadings = [];
  for (let i = 0; i < 10; i++) {
    leakReadings.push({
      time: `T+${i * 10}min`,
      heapMB: baseMemory + i * 8 + Math.random() * 3, // Grows 8MB every 10min
      type: 'leaking',
    });
  }

  console.log('   Normal app memory over time:');
  memoryReadings.forEach((r) => {
    const bar = '#'.repeat(Math.round(r.heapMB / 2));
    console.log(`     ${r.time.padEnd(8)} ${r.heapMB.toFixed(1).padStart(6)} MB ${bar}`);
  });
  console.log('');

  console.log('   LEAKING app memory over time:');
  leakReadings.forEach((r) => {
    const bar = '#'.repeat(Math.round(r.heapMB / 2));
    console.log(`     ${r.time.padEnd(8)} ${r.heapMB.toFixed(1).padStart(6)} MB ${bar}`);
  });
  console.log('');

  console.log('  Common memory leak causes in Node.js:');
  console.log('    1. Growing arrays/maps that are never cleaned up');
  console.log('    2. Event listeners added but never removed');
  console.log('    3. Closures holding references to large objects');
  console.log('    4. Global caches without TTL or size limits');
  console.log('    5. Unreferenced timers (setInterval without clearInterval)');
  console.log('');


  // ============================================================================
  // SECTION 6: Alerting Rules
  // ============================================================================

  console.log('=== SECTION 6: Alerting Rules ===\n');

  const alertRules = [
    {
      name: 'HighErrorRate',
      condition: 'error_rate > 5% for 5 minutes',
      severity: 'critical',
      action: 'Page on-call engineer',
    },
    {
      name: 'HighLatency',
      condition: 'p99_latency > 2000ms for 10 minutes',
      severity: 'warning',
      action: 'Slack notification to #alerts',
    },
    {
      name: 'HighMemory',
      condition: 'heap_used > 80% of heap_total for 15 minutes',
      severity: 'warning',
      action: 'Slack + auto-restart if > 95%',
    },
    {
      name: 'EventLoopBlocked',
      condition: 'event_loop_lag > 100ms for 1 minute',
      severity: 'critical',
      action: 'Page on-call + capture heap dump',
    },
    {
      name: 'HighCPU',
      condition: 'cpu_usage > 90% for 5 minutes',
      severity: 'warning',
      action: 'Slack + auto-scale if in K8s',
    },
    {
      name: 'DependencyDown',
      condition: 'health_check fails 3 consecutive times',
      severity: 'critical',
      action: 'Page on-call + circuit breaker opens',
    },
  ];

  console.log('G: Production alerting rules:');
  alertRules.forEach((rule) => {
    console.log(`   [${rule.severity.toUpperCase()}] ${rule.name}`);
    console.log(`     Condition: ${rule.condition}`);
    console.log(`     Action: ${rule.action}`);
    console.log('');
  });


  // ============================================================================
  // SECTION 7: Monitoring Tools Comparison
  // ============================================================================

  console.log('=== SECTION 7: Monitoring Tools Comparison ===\n');

  const tools = [
    ['Tool',           'Type',        'Cost',         'Best For'                   ],
    ['Prometheus',     'Metrics',     'Free (OSS)',   'K8s, time-series metrics'   ],
    ['Grafana',        'Dashboards',  'Free (OSS)',   'Visualizing Prometheus data'],
    ['Datadog',        'All-in-one',  'Paid',         'Full observability suite'   ],
    ['New Relic',      'APM',         'Free tier',    'App performance monitoring' ],
    ['AWS CloudWatch', 'Cloud',       'Pay per use',  'AWS-native monitoring'      ],
    ['ELK Stack',      'Logs',        'Free (OSS)',   'Log search & analysis'      ],
    ['Sentry',         'Errors',      'Free tier',    'Error tracking & grouping'  ],
  ];

  console.log('H: Monitoring tools landscape:');
  tools.forEach((row, i) => {
    const formatted = row.map((col, j) => col.padEnd([17, 13, 14, 30][j])).join('| ');
    console.log(`   ${formatted}`);
    if (i === 0) {
      console.log(`   ${'─'.repeat(17)}┼${'─'.repeat(13)}┼${'─'.repeat(14)}┼${'─'.repeat(30)}`);
    }
  });
  console.log('');


  // ============================================================================
  // SECTION 8: Graceful Shutdown with Monitoring
  // ============================================================================

  console.log('=== SECTION 8: Graceful Shutdown Pattern ===\n');

  console.log('I: Graceful shutdown with metric flushing:');

  const createGracefulShutdown = (dependencies = {}) => {
    let isShuttingDown = false;

    const shutdown = async (signal) => {
      if (isShuttingDown) return;
      isShuttingDown = true;

      console.log(`   [SHUTDOWN] Received ${signal}. Starting graceful shutdown...`);

      // Step 1: Stop accepting new requests
      console.log('   [SHUTDOWN] 1. Stop accepting new connections');

      // Step 2: Wait for in-flight requests to complete
      console.log('   [SHUTDOWN] 2. Waiting for in-flight requests (timeout: 30s)');

      // Step 3: Flush metrics buffer
      console.log('   [SHUTDOWN] 3. Flushing metrics to collector');

      // Step 4: Close database connections
      console.log('   [SHUTDOWN] 4. Closing database connections');

      // Step 5: Exit
      console.log('   [SHUTDOWN] 5. Clean exit with code 0');
      console.log('');

      return 0; // exit code
    };

    return { shutdown, isShuttingDown: () => isShuttingDown };
  };

  const graceful = createGracefulShutdown();
  graceful.shutdown('SIGTERM');

  console.log('  WHY graceful shutdown matters for monitoring:');
  console.log('    - Metrics buffer may have unsent data');
  console.log('    - In-flight requests should complete (not 502)');
  console.log('    - Health check should return "unhealthy" immediately');
  console.log('    - K8s uses readiness probe to stop sending traffic');
  console.log('');


  // ============================================================================
  // SECTION 9: The Three Pillars of Observability
  // ============================================================================

  console.log('=== SECTION 9: Three Pillars of Observability ===\n');

  console.log('J: The three pillars:');
  console.log('');
  console.log('   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐');
  console.log('   │    LOGS      │  │   METRICS    │  │   TRACES     │');
  console.log('   ├──────────────┤  ├──────────────┤  ├──────────────┤');
  console.log('   │ What         │  │ How much /   │  │ How a request│');
  console.log('   │ happened     │  │ How fast     │  │ flows through│');
  console.log('   │ (events)     │  │ (numbers)    │  │ services     │');
  console.log('   ├──────────────┤  ├──────────────┤  ├──────────────┤');
  console.log('   │ "User 123    │  │ req/sec: 500 │  │ API → Auth → │');
  console.log('   │  login fail" │  │ p99: 200ms   │  │ DB → Cache → │');
  console.log('   │              │  │ errors: 0.1% │  │ Response     │');
  console.log('   ├──────────────┤  ├──────────────┤  ├──────────────┤');
  console.log('   │ Tools:       │  │ Tools:       │  │ Tools:       │');
  console.log('   │ ELK, Loki   │  │ Prometheus   │  │ Jaeger       │');
  console.log('   │ CloudWatch   │  │ Datadog      │  │ Zipkin       │');
  console.log('   └──────────────┘  └──────────────┘  └──────────────┘');
  console.log('');
  console.log('   Together they answer:');
  console.log('     Metrics: "SOMETHING is wrong" (alerts fire)');
  console.log('     Logs: "THIS is what went wrong" (search events)');
  console.log('     Traces: "HERE is where it went wrong" (follow the request)');
  console.log('');
};


/**
 * OUTPUT:
 *   === SECTION 1: Node.js Process Metrics ===
 *   A: Current process metrics:
 *      Memory RSS: ~30 MB
 *      Heap Total: ~6 MB
 *      Heap Used: ~5 MB
 *      ...
 *
 *   === SECTION 2: Event Loop Monitoring ===
 *   B: Event loop lag measurement:
 *      Normal event loop lag: ~0.1 ms
 *      After 50ms block lag: ~0.5 ms
 *
 *   === SECTION 3: Health Check Endpoint ===
 *   C: Health check response (status: degraded)
 *
 *   === SECTION 4: Custom Metrics Collector ===
 *   D: Metrics collected after 50 simulated requests
 *   E: Percentile latencies (p50, p95, p99)
 *
 *   (Sections 5-9 continue...)
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ INTERVIEW ANSWER                                                         ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ "For production Node.js monitoring, I focus on the Four Golden Signals  ║
 * ║  from Google SRE: latency (p50/p95/p99), traffic (req/sec), errors     ║
 * ║  (5xx rate), and saturation (event loop lag, memory, CPU). I expose a   ║
 * ║  /metrics endpoint in Prometheus format using prom-client, with custom  ║
 * ║  histograms for request duration and counters for errors. I set up      ║
 * ║  health check endpoints (/health/live and /health/ready) for K8s       ║
 * ║  probes. For alerting, I define rules like 'error rate > 5% for 5min   ║
 * ║  pages on-call' and 'p99 > 2s sends Slack warning'. I always monitor   ║
 * ║  event loop lag since it's the best indicator of Node.js health -       ║
 * ║  anything above 100ms means something is blocking. Combined with        ║
 * ║  structured logging and distributed tracing, this gives full            ║
 * ║  observability into production behavior."                               ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * RUN: node docs/node/11-deployment/04-monitoring.js
 */
