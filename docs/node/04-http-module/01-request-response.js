/**
 * TOPIC 01: Request and Response Objects
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ req = what the client SENDS (method, url, headers, body)                 ║
 * ║ res = what you SEND BACK (statusCode, headers, body)                     ║
 * ║                                                                            ║
 * ║   req.method, req.url, req.headers  → read incoming data                 ║
 * ║   res.writeHead(), res.write(), res.end()  → send response              ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  Think of a WAITER taking orders at a restaurant.                         │
 * │                                                                             │
 * │  The CUSTOMER speaks (REQUEST):                                            │
 * │    - "I'd like..."       → req.method (GET, POST, PUT, DELETE)           │
 * │    - "...the pasta"      → req.url (/menu/pasta)                         │
 * │    - "I'm allergic to.." → req.headers (metadata about the request)      │
 * │    - "Extra cheese"      → req body (data sent with POST/PUT)            │
 * │                                                                             │
 * │  The WAITER responds (RESPONSE):                                           │
 * │    - "Coming right up!"  → res.statusCode (200 = OK, 404 = not found)    │
 * │    - "It's gluten-free"  → res.setHeader() (metadata about response)     │
 * │    - *serves the dish*   → res.write() + res.end() (the actual data)     │
 * │                                                                             │
 * │  "req = customer's order, res = waiter's delivery."                       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM: HTTP Request Anatomy                                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌─── HTTP REQUEST ────────────────────────────────┐                     │
 * │   │  Method:  POST                                  │ → req.method       │
 * │   │  URL:     /api/users?role=admin                 │ → req.url          │
 * │   │  Headers:                                       │ → req.headers      │
 * │   │    Content-Type: application/json               │                     │
 * │   │    Authorization: Bearer xyz                    │                     │
 * │   │  Body:                                          │ → req on('data')   │
 * │   │    { "name": "Surya" }                          │                     │
 * │   └─────────────────────────────────────────────────┘                     │
 * │                                                                             │
 * │   ┌─── HTTP RESPONSE ───────────────────────────────┐                     │
 * │   │  Status:  201 Created                           │ → res.writeHead()  │
 * │   │  Headers:                                       │                     │
 * │   │    Content-Type: application/json               │                     │
 * │   │  Body:                                          │ → res.write()      │
 * │   │    { "id": 1, "name": "Surya" }                 │ → res.end()        │
 * │   └─────────────────────────────────────────────────┘                     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const http = require('http');

const server = http.createServer((req, res) => {
  // === 1. Reading the request ===
  console.log('A:', `Method: ${req.method}`);
  console.log('B:', `URL: ${req.url}`);
  console.log('C:', `Headers: ${JSON.stringify(req.headers['content-type'] || 'none')}`);

  // === 2. Reading request body (for POST/PUT) ===
  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', () => {
    if (body) {
      console.log('D:', `Body received: ${body}`);
    }

    // === 3. Sending the response ===
    // writeHead sets status code AND headers in one call
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'X-Custom-Header': 'HelloFromNode',
    });

    // write() sends a chunk of the response body
    const responseData = JSON.stringify({
      message: 'Request received!',
      yourMethod: req.method,
      yourUrl: req.url,
      yourBody: body || null,
    });

    res.write(responseData);

    // end() signals that the response is complete
    res.end();
    console.log('E:', 'Response sent with status 200');
  });
});

const PORT = 3098;

server.listen(PORT, () => {
  console.log('F:', `Server listening on port ${PORT}`);

  // === Test 1: Simple GET request ===
  http.get(`http://localhost:${PORT}/api/users?role=admin`, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      console.log('G:', `GET response: ${data}`);

      // === Test 2: POST request with body ===
      const postData = JSON.stringify({ name: 'Surya', role: 'developer' });
      const options = {
        hostname: 'localhost',
        port: PORT,
        path: '/api/users',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
      };

      const postReq = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          console.log('H:', `POST response: ${data}`);
          server.close(() => {
            console.log('I:', 'Server closed.');
          });
        });
      });

      postReq.write(postData);
      postReq.end();
    });
  });
});

/**
 * OUTPUT:
 *   F: Server listening on port 3098
 *   A: Method: GET
 *   B: URL: /api/users?role=admin
 *   C: Headers: "none"
 *   E: Response sent with status 200
 *   G: GET response: {"message":"Request received!","yourMethod":"GET","yourUrl":"/api/users?role=admin","yourBody":null}
 *   A: Method: POST
 *   B: URL: /api/users
 *   C: Headers: "application/json"
 *   D: Body received: {"name":"Surya","role":"developer"}
 *   E: Response sent with status 200
 *   H: POST response: {"message":"Request received!","yourMethod":"POST","yourUrl":"/api/users","yourBody":"{\"name\":\"Surya\",\"role\":\"developer\"}"}
 *   I: Server closed.
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ KEY DIFFERENCES                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ res.writeHead(200, headers)  → sets status + headers (can only call once)║
 * ║ res.setHeader('key', 'val')  → sets one header (can call multiple times) ║
 * ║ res.statusCode = 200         → sets status (can change before sending)   ║
 * ║ res.write(data)              → sends a chunk (can call multiple times)   ║
 * ║ res.end(data?)               → ends response (optionally with last data) ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "The req object (IncomingMessage) is a readable stream containing the      │
 * │  client's request data: req.method (GET/POST/etc), req.url (the path      │
 * │  and query string), req.headers (key-value pairs). For POST/PUT, the      │
 * │  body is streamed via 'data' and 'end' events. The res object             │
 * │  (ServerResponse) is a writable stream: you set statusCode, call          │
 * │  writeHead() or setHeader() for headers, write() for body chunks, and    │
 * │  end() to finish. You MUST call res.end() or the client hangs forever."   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/04-http-module/01-request-response.js
 */
