/**
 * TOPIC 04: HTTPS Setup and Concepts
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ HTTPS = HTTP + TLS/SSL encryption.                                        ║
 * ║ Data is encrypted in transit so nobody can read or tamper with it.        ║
 * ║                                                                            ║
 * ║   HTTP  → plain text, anyone on the network can read it                  ║
 * ║   HTTPS → encrypted, only sender and receiver can read it                ║
 * ║                                                                            ║
 * ║ You need a certificate (cert) and a private key to set up HTTPS.         ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  Think of sending a package:                                               │
 * │                                                                             │
 * │  HTTP = REGULAR MAIL (postcard)                                            │
 * │    - Anyone who handles it can READ the message                            │
 * │    - The mailman, neighbors, anyone can peek                              │
 * │    - Fast to send, but zero privacy                                        │
 * │                                                                             │
 * │  HTTPS = ARMORED TRUCK                                                     │
 * │    - Package is locked in a safe (encryption)                              │
 * │    - Only the recipient has the key (private key)                          │
 * │    - The truck has an ID badge (SSL certificate)                           │
 * │    - Even if intercepted, contents are unreadable                          │
 * │                                                                             │
 * │  The CERTIFICATE is like a government-issued ID:                           │
 * │    - Self-signed = you printed your own ID (dev only)                     │
 * │    - CA-signed   = government verified you (production)                   │
 * │      (Let's Encrypt = free government ID)                                 │
 * │                                                                             │
 * │  "HTTPS = armored truck with a verified ID badge."                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM: HTTP vs HTTPS                                              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ══════════ HTTP (Port 80) ══════════                                    │
 * │                                                                             │
 * │   Client ──── "password=1234" ────► Server                                │
 * │              ^                                                              │
 * │              │ Hacker can read!                                             │
 * │              └── "password=1234"                                            │
 * │                                                                             │
 * │   ══════════ HTTPS (Port 443) ═════════                                   │
 * │                                                                             │
 * │   Client ──── "x8#kQ!m@2$f" ────► Server                                 │
 * │              ^                      │ Decrypts to                          │
 * │              │ Hacker sees garbage   │ "password=1234"                     │
 * │              └── "x8#kQ!m@2$f" ???                                         │
 * │                                                                             │
 * │                                                                             │
 * │   ══════ TLS Handshake (simplified) ══════                                │
 * │                                                                             │
 * │   Client                              Server                              │
 * │     │  1. "Hello, I support TLS 1.3"    │                                 │
 * │     │ ────────────────────────────────►  │                                 │
 * │     │  2. Certificate + public key      │                                 │
 * │     │ ◄──────────────────────────────── │                                 │
 * │     │  3. Verify cert, create session   │                                 │
 * │     │     key, encrypt with public key  │                                 │
 * │     │ ────────────────────────────────►  │                                 │
 * │     │  4. Both use session key          │                                 │
 * │     │ ◄═══ encrypted traffic ═══════►  │                                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// === NOTE: We can't run actual HTTPS without real certificates ===
// === This file demonstrates the concepts and shows how you WOULD set it up ===

console.log('A:', '=== HTTP vs HTTPS Comparison ===');
console.log('');

// === 1. How HTTP sends data (plain text) ===
const httpRequest = {
  method: 'POST',
  url: '/login',
  headers: { 'Content-Type': 'application/json' },
  body: '{"username":"admin","password":"secret123"}',
};

console.log('B:', 'HTTP sends data as PLAIN TEXT:');
console.log('   ', `  ${httpRequest.method} ${httpRequest.url}`);
console.log('   ', `  Body: ${httpRequest.body}`);
console.log('   ', '  ^ Anyone on the network can read this!');
console.log('');

// === 2. How HTTPS sends data (encrypted) ===
const crypto = require('crypto');

const simulateEncryption = (plainText) => {
  const key = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

const encryptedBody = simulateEncryption(httpRequest.body);
console.log('C:', 'HTTPS sends data ENCRYPTED:');
console.log('   ', `  ${httpRequest.method} ${httpRequest.url}`);
console.log('   ', `  Body: ${encryptedBody.substring(0, 50)}...`);
console.log('   ', '  ^ Unreadable without the decryption key!');
console.log('');

// === 3. Certificate types ===
console.log('D:', '=== Certificate Types ===');
console.log('   ', 'Self-Signed: You create it yourself (dev/testing only)');
console.log('   ', '  openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365');
console.log('   ', 'CA-Signed:   Verified by Certificate Authority (production)');
console.log('   ', '  Free: Let\'s Encrypt (certbot)');
console.log('   ', '  Paid: DigiCert, Comodo, GlobalSign');
console.log('');

// === 4. How you WOULD create an HTTPS server ===
console.log('E:', '=== HTTPS Server Setup (code reference) ===');

const httpsServerCode = `
  const https = require('https');
  const fs = require('fs');

  const options = {
    key: fs.readFileSync('key.pem'),     // Private key
    cert: fs.readFileSync('cert.pem'),   // Certificate
  };

  const server = https.createServer(options, (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello over HTTPS!');
  });

  server.listen(443, () => {
    console.log('HTTPS server running on port 443');
  });
`;

console.log(httpsServerCode);

// === 5. HTTP to HTTPS redirect pattern ===
console.log('F:', '=== HTTP → HTTPS Redirect Pattern ===');

const redirectCode = `
  const http = require('http');

  // Redirect all HTTP traffic to HTTPS
  http.createServer((req, res) => {
    res.writeHead(301, {
      Location: \`https://\${req.headers.host}\${req.url}\`
    });
    res.end();
  }).listen(80);
`;

console.log(redirectCode);

// === 6. Key differences summary ===
console.log('G:', '=== Key Differences ===');
const differences = [
  { feature: 'Port', http: '80', https: '443' },
  { feature: 'URL Scheme', http: 'http://', https: 'https://' },
  { feature: 'Encryption', http: 'None', https: 'TLS/SSL' },
  { feature: 'Certificate', http: 'Not needed', https: 'Required' },
  { feature: 'Speed', http: 'Slightly faster', https: 'Tiny overhead (negligible)' },
  { feature: 'SEO', http: 'Penalized', https: 'Preferred by Google' },
];

differences.forEach(({ feature, http: h, https: hs }) => {
  console.log('   ', `  ${feature.padEnd(15)} HTTP: ${h.padEnd(20)} HTTPS: ${hs}`);
});

console.log('');
console.log('H:', 'HTTPS is required for: passwords, payments, cookies, APIs, and basically everything in 2024+.');

/**
 * OUTPUT:
 *   A: === HTTP vs HTTPS Comparison ===
 *
 *   B: HTTP sends data as PLAIN TEXT:
 *        POST /login
 *        Body: {"username":"admin","password":"secret123"}
 *        ^ Anyone on the network can read this!
 *
 *   C: HTTPS sends data ENCRYPTED:
 *        POST /login
 *        Body: a3f8c2e1d4b5...  (encrypted hex)
 *        ^ Unreadable without the decryption key!
 *
 *   D: === Certificate Types ===
 *        Self-Signed: You create it yourself (dev/testing only)
 *        CA-Signed:   Verified by Certificate Authority (production)
 *
 *   E: === HTTPS Server Setup (code reference) ===
 *        (HTTPS server code shown)
 *
 *   F: === HTTP → HTTPS Redirect Pattern ===
 *        (Redirect code shown)
 *
 *   G: === Key Differences ===
 *        Port/Encryption/Certificate/Speed/SEO comparison table
 *
 *   H: HTTPS is required for: passwords, payments, cookies, APIs...
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ HTTPS CHECKLIST FOR PRODUCTION                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ 1. Get a certificate (Let's Encrypt is free)                             ║
 * ║ 2. Use TLS 1.2+ (TLS 1.3 preferred)                                     ║
 * ║ 3. Redirect HTTP → HTTPS (301 redirect)                                 ║
 * ║ 4. Set HSTS header (Strict-Transport-Security)                           ║
 * ║ 5. Renew certs before expiry (certbot auto-renews)                       ║
 * ║ 6. In production, terminate TLS at nginx/load balancer                   ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "HTTPS is HTTP with TLS/SSL encryption. It encrypts data in transit so    │
 * │  attackers can't read or modify it (prevents MITM attacks). To set up     │
 * │  HTTPS in Node.js, you use the https module with a private key and        │
 * │  certificate: https.createServer({ key, cert }, handler). For production, │
 * │  use CA-signed certificates from Let's Encrypt (free) and terminate TLS  │
 * │  at a reverse proxy like nginx. Always redirect HTTP to HTTPS and set    │
 * │  the HSTS header. Self-signed certs are fine for development only."       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/04-http-module/04-https-setup.js
 */
