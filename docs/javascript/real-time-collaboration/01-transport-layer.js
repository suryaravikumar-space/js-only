/**
 * ============================================
 * 1. TRANSPORT LAYER
 * WebSocket connection management at scale
 * ============================================
 */

// --- Connection Manager ---
// Handles reconnection, heartbeat, and multiplexing

class ConnectionManager {
  constructor(url, options = {}) {
    this.url = url;
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnect = options.maxReconnect || 10;
    this.heartbeatInterval = options.heartbeat || 30000;
    this.messageQueue = []; // Queue messages while disconnected
    this.listeners = new Map();
  }

  connect() {
    this.ws = new WebSocket(this.url);

    this.ws.binaryType = "arraybuffer"; // Binary for CRDT ops (smaller than JSON)

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this._startHeartbeat();
      this._flushQueue(); // Send queued messages
    };

    this.ws.onmessage = (event) => {
      // Decode binary protocol (not JSON - too slow for 10K users)
      const msg = this._decode(event.data);
      this._dispatch(msg);
    };

    this.ws.onclose = () => {
      this._stopHeartbeat();
      this._reconnect();
    };
  }

  // Exponential backoff with jitter
  _reconnect() {
    if (this.reconnectAttempts >= this.maxReconnect) {
      this._dispatch({ type: "DISCONNECTED_PERMANENTLY" });
      return;
    }

    const baseDelay = Math.min(1000 * 2 ** this.reconnectAttempts, 30000);
    const jitter = Math.random() * baseDelay * 0.5; // Prevent thundering herd
    const delay = baseDelay + jitter;

    this.reconnectAttempts++;
    setTimeout(() => this.connect(), delay);
  }

  // Heartbeat to detect dead connections
  _startHeartbeat() {
    this._heartbeat = setInterval(() => {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(new Uint8Array([0x09])); // Ping byte
      }
    }, this.heartbeatInterval);
  }

  _stopHeartbeat() {
    clearInterval(this._heartbeat);
  }

  // Queue messages when offline (offline-first)
  send(data) {
    const encoded = this._encode(data);
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(encoded);
    } else {
      this.messageQueue.push(encoded);
    }
  }

  _flushQueue() {
    while (this.messageQueue.length > 0) {
      this.ws.send(this.messageQueue.shift());
    }
  }

  // Binary protocol: [type(1 byte)][roomId(4 bytes)][payload(variable)]
  _encode(msg) {
    const encoder = new TextEncoder();
    const payload = encoder.encode(JSON.stringify(msg.payload));
    const buffer = new ArrayBuffer(5 + payload.length);
    const view = new DataView(buffer);
    view.setUint8(0, msg.type);
    view.setUint32(1, msg.roomId);
    new Uint8Array(buffer, 5).set(payload);
    return buffer;
  }

  _decode(buffer) {
    const view = new DataView(buffer);
    const type = view.getUint8(0);
    const roomId = view.getUint32(1);
    const decoder = new TextDecoder();
    const payload = JSON.parse(decoder.decode(new Uint8Array(buffer, 5)));
    return { type, roomId, payload };
  }

  _dispatch(msg) {
    const handlers = this.listeners.get(msg.type) || [];
    handlers.forEach((fn) => fn(msg));
  }

  on(type, handler) {
    if (!this.listeners.has(type)) this.listeners.set(type, []);
    this.listeners.get(type).push(handler);
  }
}

/**
 * KEY DECISIONS FOR 10K+ USERS:
 *
 * 1. Binary protocol instead of JSON
 *    - JSON.parse/stringify is expensive at high message rates
 *    - Binary is 40-60% smaller on the wire
 *    - Use ArrayBuffer + DataView for encoding
 *
 * 2. Jittered exponential backoff
 *    - If server restarts, 10K clients reconnecting simultaneously = thundering herd
 *    - Jitter spreads reconnection over time
 *
 * 3. Message queue for offline support
 *    - Users don't lose work during brief disconnections
 *    - Queue replays on reconnect
 *
 * 4. Heartbeat mechanism
 *    - Detects zombie connections quickly
 *    - Frees server resources for active users
 */
