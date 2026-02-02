/**
 * TOPIC 03: Load Testing in Node.js
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ Load testing measures how your app behaves under stress. You simulate    ║
 * ║ concurrent users/requests to find: max throughput, response time under   ║
 * ║ load, breaking point, and memory/CPU behavior. Test BEFORE production.   ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  Imagine a BRIDGE. The engineer builds it and says "it holds 10 cars."   │
 * │  But how do you KNOW? You TEST it.                                       │
 * │                                                                            │
 * │    1 car   → Works fine                  (smoke test)                    │
 * │    5 cars  → Still fine                  (load test)                     │
 * │    10 cars → Slight wobble, still holds  (stress test)                   │
 * │    20 cars → Bridge cracks!              (breaking point)                │
 * │    50 cars → Bridge collapses            (chaos test)                    │
 * │                                                                            │
 * │  Tools like autocannon and artillery ARE those test cars.                │
 * │  They send thousands of requests to find where your server "cracks."    │
 * │                                                                            │
 * │  Key metrics (like bridge sensors):                                      │
 * │    Latency     → How long each car takes to cross                        │
 * │    Throughput  → How many cars cross per minute                          │
 * │    Error rate  → How many cars fall off                                  │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM: Load Testing Flow                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │   Load Test Tool (autocannon/artillery)                                   │
 * │   ┌────────────────────────┐                                              │
 * │   │ Config:                │                                              │
 * │   │  - connections: 100   │     ┌─────────────┐    ┌──────────────┐      │
 * │   │  - duration: 30s      │────▶│ Your Server │───▶│ Metrics:     │      │
 * │   │  - pipelining: 10     │     │ :3000       │    │ latency p99  │      │
 * │   │  - method: GET/POST   │     └─────────────┘    │ throughput   │      │
 * │   └────────────────────────┘                        │ errors       │      │
 * │                                                     │ timeouts     │      │
 * │   Result:                                           └──────────────┘      │
 * │   ┌─────────────────────────────────────────────┐                        │
 * │   │ Stat    │ 2.5%  │  50%  │ 97.5% │  99%    │                        │
 * │   │ Latency │  2ms  │  5ms  │ 45ms  │ 120ms   │                        │
 * │   │ Req/Sec │ 8000  │ 12000 │ 15000 │ 15500   │                        │
 * │   └─────────────────────────────────────────────┘                        │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const http = require('http');
const { performance } = require('perf_hooks');

// ─── 1. Create a test server ───
console.log('A:', '=== Creating Test Server ===');

const server = http.createServer((req, res) => {
  if (req.url === '/fast') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', path: '/fast' }));
  } else if (req.url === '/slow') {
    // Simulate slow response
    setTimeout(() => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', path: '/slow', delay: '100ms' }));
    }, 100);
  } else if (req.url === '/cpu-heavy') {
    // Simulate CPU-intensive work
    let sum = 0;
    for (let i = 0; i < 1_000_000; i++) sum += Math.sqrt(i);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', sum }));
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

// ─── 2. Simple load tester (DIY autocannon-like) ───
const loadTest = async (url, options = {}) => {
  const { connections = 10, duration = 2000 } = options;
  const results = { total: 0, success: 0, errors: 0, latencies: [] };
  const endTime = Date.now() + duration;

  const makeRequest = () => {
    return new Promise((resolve) => {
      const start = performance.now();
      const req = http.get(url, (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          results.total++;
          results.success++;
          results.latencies.push(performance.now() - start);
          resolve();
        });
      });
      req.on('error', () => {
        results.total++;
        results.errors++;
        resolve();
      });
      req.setTimeout(5000, () => {
        results.total++;
        results.errors++;
        req.destroy();
        resolve();
      });
    });
  };

  // Fire concurrent requests until duration expires
  const workers = Array.from({ length: connections }, async () => {
    while (Date.now() < endTime) {
      await makeRequest();
    }
  });

  await Promise.all(workers);
  return results;
};

// ─── 3. Calculate statistics ───
const calcStats = (latencies) => {
  if (latencies.length === 0) return null;
  const sorted = [...latencies].sort((a, b) => a - b);
  const percentile = (p) => sorted[Math.floor(sorted.length * p / 100)];
  const avg = sorted.reduce((s, v) => s + v, 0) / sorted.length;
  return {
    min: sorted[0].toFixed(2),
    avg: avg.toFixed(2),
    p50: percentile(50).toFixed(2),
    p95: percentile(95).toFixed(2),
    p99: percentile(99).toFixed(2),
    max: sorted[sorted.length - 1].toFixed(2),
  };
};

// ─── 4. Run the load tests ───
const PORT = 0; // random available port

server.listen(PORT, async () => {
  const addr = server.address();
  const baseUrl = `http://127.0.0.1:${addr.port}`;
  console.log('B:', `Server running on port ${addr.port}`);

  // Test /fast endpoint
  console.log('C:', '--- Load testing /fast (2s, 10 connections) ---');
  const fastResults = await loadTest(`${baseUrl}/fast`, {
    connections: 10,
    duration: 2000,
  });
  const fastStats = calcStats(fastResults.latencies);
  console.log('D:', `Total requests: ${fastResults.total}`);
  console.log('E:', `Success: ${fastResults.success}, Errors: ${fastResults.errors}`);
  console.log('F:', `Req/sec: ${(fastResults.total / 2).toFixed(0)}`);
  console.log('G:', `Latency - avg: ${fastStats.avg}ms, p50: ${fastStats.p50}ms, p99: ${fastStats.p99}ms`);

  // Test /slow endpoint
  console.log('H:', '--- Load testing /slow (2s, 10 connections) ---');
  const slowResults = await loadTest(`${baseUrl}/slow`, {
    connections: 10,
    duration: 2000,
  });
  const slowStats = calcStats(slowResults.latencies);
  console.log('I:', `Total requests: ${slowResults.total}`);
  console.log('J:', `Req/sec: ${(slowResults.total / 2).toFixed(0)}`);
  console.log('K:', `Latency - avg: ${slowStats.avg}ms, p99: ${slowStats.p99}ms`);

  // Test /cpu-heavy endpoint
  console.log('L:', '--- Load testing /cpu-heavy (2s, 5 connections) ---');
  const cpuResults = await loadTest(`${baseUrl}/cpu-heavy`, {
    connections: 5,
    duration: 2000,
  });
  const cpuStats = calcStats(cpuResults.latencies);
  console.log('M:', `Total requests: ${cpuResults.total}`);
  console.log('N:', `Req/sec: ${(cpuResults.total / 2).toFixed(0)}`);
  console.log('O:', `Latency - avg: ${cpuStats.avg}ms, p99: ${cpuStats.p99}ms`);

  // ─── 5. Autocannon CLI reference ───
  console.log('P:', '=== Autocannon CLI Usage (reference) ===');
  console.log('Q:', 'Install: npm install -g autocannon');
  console.log('R:', 'Basic:   autocannon -c 100 -d 30 http://localhost:3000/api');
  console.log('S:', 'Options: -c connections, -d duration(s), -p pipelining');
  console.log('T:', 'POST:    autocannon -c 50 -d 10 -m POST -b \'{"key":"val"}\' -H "Content-Type=application/json" http://localhost:3000/api');

  // ─── 6. Artillery YAML config reference ───
  console.log('U:', '=== Artillery Config (reference) ===');
  console.log('V:', 'Install: npm install -g artillery');
  console.log('W:', 'Config file (artillery.yml):');
  console.log('X:', '  config: { target: "http://localhost:3000", phases: [{ duration: 60, arrivalRate: 50 }] }');
  console.log('Y:', '  scenarios: [{ flow: [{ get: { url: "/api" } }] }]');
  console.log('Z:', 'Run: artillery run artillery.yml');

  server.close(() => {
    console.log('AA:', 'Server closed. Load tests complete.');
  });
});

/**
 * OUTPUT:
 *   A: === Creating Test Server ===
 *   B: Server running on port XXXXX
 *   C: --- Load testing /fast (2s, 10 connections) ---
 *   D: Total requests: XXXXX
 *   E: Success: XXXXX, Errors: 0
 *   F: Req/sec: XXXX
 *   G: Latency - avg: X.XXms, p50: X.XXms, p99: X.XXms
 *   H: --- Load testing /slow (2s, 10 connections) ---
 *   I: Total requests: XXX
 *   J: Req/sec: XXX
 *   K: Latency - avg: 10X.XXms, p99: 10X.XXms
 *   L: --- Load testing /cpu-heavy (2s, 5 connections) ---
 *   M: Total requests: XXX
 *   N: Req/sec: XXX
 *   O: Latency - avg: XX.XXms, p99: XX.XXms
 *   P: === Autocannon CLI Usage (reference) ===
 *   Q-T: (autocannon commands)
 *   U: === Artillery Config (reference) ===
 *   V-Z: (artillery commands)
 *   AA: Server closed. Load tests complete.
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │ "Load testing validates that a server handles expected traffic. I use     │
 * │  autocannon for quick HTTP benchmarks - it shows requests/sec, latency   │
 * │  percentiles (p50, p95, p99), and error rates. For complex scenarios     │
 * │  with multi-step user flows, I use artillery with YAML configs that      │
 * │  define arrival rates and scenario steps. Key metrics I watch: p99       │
 * │  latency (worst-case user experience), throughput (req/sec), error rate  │
 * │  under load, and memory/CPU usage during the test. I test three ways:    │
 * │  load test (expected traffic), stress test (2-3x expected), and soak     │
 * │  test (sustained load over hours to catch memory leaks). The goal is     │
 * │  to find the breaking point BEFORE users do."                            │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/13-performance/03-load-testing.js
 */
