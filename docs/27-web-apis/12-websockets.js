/**
 * WEB APIS: 12 - WebSockets
 *
 * ONE CONCEPT: Real-time bidirectional communication between client and server
 */


// =============================================================================
// WHAT ARE WEBSOCKETS?
// =============================================================================

/**
 *
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  HTTP vs WEBSOCKET                                                   │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  HTTP (Request/Response):                                            │
 *   │                                                                      │
 *   │  Client ──── Request ────► Server                                    │
 *   │         ◄─── Response ────                                           │
 *   │         (connection closes)                                          │
 *   │                                                                      │
 *   │  Client ──── Request ────► Server                                    │
 *   │         ◄─── Response ────                                           │
 *   │         (new connection every time!)                                 │
 *   │                                                                      │
 *   │                                                                      │
 *   │  WEBSOCKET (Persistent connection):                                  │
 *   │                                                                      │
 *   │  Client ═══════════════════════════════════════════► Server          │
 *   │         ◄═══════════════════════════════════════════                 │
 *   │                  (stays open - instant messages both ways)           │
 *   │                                                                      │
 *   │  Server can PUSH data anytime without client asking!                 │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// BASIC USAGE
// =============================================================================

console.log('=== WebSocket API ===\n');

const basicUsage = `
// ═══════════════════════════════════════════════════════════════════════
// CONNECTING
// ═══════════════════════════════════════════════════════════════════════

const socket = new WebSocket('wss://example.com/socket');
// wss:// = secure (like HTTPS)
// ws://  = insecure (like HTTP)


// ═══════════════════════════════════════════════════════════════════════
// EVENT HANDLERS
// ═══════════════════════════════════════════════════════════════════════

// Connection opened
socket.addEventListener('open', (event) => {
  console.log('Connected!');
  socket.send('Hello Server!');
});

// Message received from server
socket.addEventListener('message', (event) => {
  console.log('Message:', event.data);

  // If JSON
  const data = JSON.parse(event.data);
  handleMessage(data);
});

// Connection closed
socket.addEventListener('close', (event) => {
  console.log('Disconnected:', event.code, event.reason);
});

// Error occurred
socket.addEventListener('error', (event) => {
  console.error('WebSocket error:', event);
});


// ═══════════════════════════════════════════════════════════════════════
// SENDING DATA
// ═══════════════════════════════════════════════════════════════════════

// Send string
socket.send('Hello');

// Send JSON
socket.send(JSON.stringify({
  type: 'chat',
  message: 'Hello world'
}));

// Check if ready before sending
if (socket.readyState === WebSocket.OPEN) {
  socket.send(data);
}


// ═══════════════════════════════════════════════════════════════════════
// CLOSING CONNECTION
// ═══════════════════════════════════════════════════════════════════════

socket.close();
socket.close(1000, 'Normal closure');  // With code and reason
`;

console.log(basicUsage);


// =============================================================================
// REAL-WORLD EXAMPLE: CHAT APP
// =============================================================================

console.log('\n=== Real-World: Chat Application ===\n');

const chatExample = `
class ChatClient {
  constructor(url) {
    this.url = url;
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.listeners = new Map();
  }

  connect() {
    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      console.log('Connected to chat server');
      this.reconnectAttempts = 0;

      // Authenticate
      this.send('auth', { token: getAuthToken() });
    };

    this.socket.onmessage = (event) => {
      const { type, payload } = JSON.parse(event.data);

      // Call registered listeners
      const handlers = this.listeners.get(type) || [];
      handlers.forEach(handler => handler(payload));
    };

    this.socket.onclose = (event) => {
      if (event.code !== 1000) {
        this.attemptReconnect();
      }
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.pow(2, this.reconnectAttempts) * 1000;

      console.log(\`Reconnecting in \${delay}ms...\`);
      setTimeout(() => this.connect(), delay);
    }
  }

  send(type, payload) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, payload }));
    }
  }

  on(type, handler) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type).push(handler);
  }

  sendMessage(roomId, text) {
    this.send('message', { roomId, text });
  }

  joinRoom(roomId) {
    this.send('join', { roomId });
  }
}

// Usage
const chat = new ChatClient('wss://chat.example.com');
chat.connect();

chat.on('message', (data) => {
  displayMessage(data.sender, data.text);
});

chat.on('user-joined', (data) => {
  showNotification(\`\${data.username} joined the room\`);
});

chat.joinRoom('general');
chat.sendMessage('general', 'Hello everyone!');
`;

console.log(chatExample);


// =============================================================================
// WHEN TO USE WEBSOCKETS
// =============================================================================

console.log('\n=== When to Use WebSockets ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  USE WEBSOCKETS FOR:                                                │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  ✓ Chat applications                                                │
 *   │  ✓ Real-time notifications                                          │
 *   │  ✓ Live sports scores                                               │
 *   │  ✓ Stock/crypto tickers                                             │
 *   │  ✓ Collaborative editing (Google Docs)                              │
 *   │  ✓ Multiplayer games                                                │
 *   │  ✓ Live dashboards                                                  │
 *   │                                                                     │
 *   │  DON'T USE FOR:                                                     │
 *   │  ✗ Simple CRUD operations (use REST)                                │
 *   │  ✗ Data that rarely changes                                         │
 *   │  ✗ One-time requests                                                │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('WebSockets: Chat, notifications, live updates, games');
console.log('REST/Fetch: CRUD, static data, one-time requests');


// =============================================================================
// INTERVIEW: What to Say (1-2 minutes)
// =============================================================================

/**
 * QUESTION: "When would you use WebSockets?"
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * YOUR ANSWER:
 *
 * "WebSockets provide a persistent, bidirectional connection between client
 * and server. Unlike HTTP where the client must always initiate requests,
 * with WebSockets the server can push data to clients anytime.
 *
 * I use WebSockets for real-time features. Chat is the classic example -
 * when someone sends a message, the server instantly pushes it to all
 * other users without them having to poll. Also for live notifications,
 * stock tickers, multiplayer games, and collaborative editing.
 *
 * The API is simple. You create a WebSocket with the server URL, then
 * listen for open, message, close, and error events. You send data with
 * socket.send() - usually JSON stringified.
 *
 * In production, I implement reconnection logic. If the connection drops,
 * I retry with exponential backoff. I also structure messages with a type
 * and payload so I can route them to the right handler.
 *
 * I wouldn't use WebSockets for everything though. For simple CRUD
 * operations or data that doesn't change often, REST with fetch is simpler
 * and more appropriate. WebSockets have overhead - keeping connections
 * open on the server - so I only use them when I actually need real-time
 * bidirectional communication."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * KEY POINTS TO MENTION:
 * ✓ Persistent bidirectional connection
 * ✓ Server can push data without client requesting
 * ✓ Use for: chat, notifications, live updates, games
 * ✓ Implement reconnection with exponential backoff
 * ✓ Don't overuse - REST is better for simple CRUD
 *
 */


// RUN: node docs/27-web-apis/12-websockets.js
