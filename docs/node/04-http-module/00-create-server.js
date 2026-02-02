/**
 * TOPIC 00: Creating an HTTP Server
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ http.createServer() creates a server instance.                            ║
 * ║ server.listen(port) binds it to a port and starts listening.             ║
 * ║ Every incoming request triggers the callback with (req, res).            ║
 * ║                                                                            ║
 * ║   const server = http.createServer((req, res) => { ... });              ║
 * ║   server.listen(port, () => console.log('Running'));                     ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  Think of opening a SHOP.                                                  │
 * │                                                                             │
 * │  1. Set up the counter  → http.createServer()                             │
 * │     You build the counter and decide how to handle each customer.         │
 * │                                                                             │
 * │  2. Pick an address     → server.listen(port)                             │
 * │     You pick a street address (port 3000) so people can find you.         │
 * │                                                                             │
 * │  3. Wait for customers  → the callback (req, res)                         │
 * │     A customer walks in (request), you serve them (response).             │
 * │                                                                             │
 * │  No address? Nobody can find your shop.                                   │
 * │  No counter? Nobody gets served.                                           │
 * │                                                                             │
 * │  "createServer = build the counter, listen = open the doors."             │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM: Request-Response Cycle                                     │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   CLIENT (Browser/curl)              SERVER (Node.js)                      │
 * │                                                                             │
 * │   ┌──────────┐   HTTP Request    ┌──────────────────┐                     │
 * │   │          │ ────────────────► │ createServer()   │                     │
 * │   │  Browser │   GET /hello      │                  │                     │
 * │   │          │                   │  callback(req,   │                     │
 * │   │          │   HTTP Response   │          res)    │                     │
 * │   │          │ ◄──────────────── │                  │                     │
 * │   └──────────┘   200 "Hello!"    │  res.end('Hi')   │                     │
 * │                                  └───────┬──────────┘                     │
 * │                                          │                                │
 * │                                   listen(3000)                            │
 * │                                   Bound to port                           │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const http = require('http');

// === 1. Creating a basic server ===
const server = http.createServer((req, res) => {
  console.log('A:', `Incoming request: ${req.method} ${req.url}`);

  // Set the status code and headers
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');

  // Send the response body and end
  res.end('Hello from Node.js server!\n');
});

// === 2. Listening on a port ===
const PORT = 3099;

server.listen(PORT, () => {
  console.log('B:', `Server running at http://localhost:${PORT}/`);

  // === 3. Make a test request to our own server ===
  http.get(`http://localhost:${PORT}/test-page`, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      console.log('C:', `Response received: "${data.trim()}"`);
      console.log('D:', `Status code: ${res.statusCode}`);

      // === 4. Close the server so the script exits ===
      server.close(() => {
        console.log('E:', 'Server closed. Script exiting.');
      });
    });
  });
});

/**
 * OUTPUT:
 *   B: Server running at http://localhost:3099/
 *   A: Incoming request: GET /test-page
 *   C: Response received: "Hello from Node.js server!"
 *   D: Status code: 200
 *   E: Server closed. Script exiting.
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ KEY CONCEPTS                                                               ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ http.createServer(callback)  → returns an http.Server instance            ║
 * ║ server.listen(port, cb)      → binds server to a port                     ║
 * ║ server.close(cb)             → stops accepting new connections            ║
 * ║ req (IncomingMessage)        → readable stream with request info          ║
 * ║ res (ServerResponse)         → writable stream to send data back          ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "To create an HTTP server in Node.js, you use http.createServer() which    │
 * │  takes a request handler callback receiving req and res objects. You then  │
 * │  call server.listen(port) to bind it to a port. The req object is a       │
 * │  readable stream with request details (method, url, headers), and res     │
 * │  is a writable stream where you set status codes, headers, and send the   │
 * │  response body. Node's HTTP server is event-driven - each request fires   │
 * │  the callback without blocking others."                                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/04-http-module/00-create-server.js
 */
