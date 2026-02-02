/**
 * CHALLENGE 07: Event Listener Callbacks
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ The Observer/EventEmitter pattern uses callbacks for event handling.       ║
 * ║                                                                            ║
 * ║   emitter.on('event', callback)   - Register listener                      ║
 * ║   emitter.emit('event', data)     - Trigger all listeners                  ║
 * ║   emitter.once('event', callback) - Listen only once                       ║
 * ║   emitter.off('event', callback)  - Remove listener                        ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// Simple EventEmitter implementation using ES6 class
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  emit(event, data) {
    const callbacks = this.events[event];
    if (callbacks) {
      callbacks.forEach((cb) => cb(data));
    }
  }

  once(event, callback) {
    const wrapper = (data) => {
      callback(data);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }

  off(event, callback) {
    const callbacks = this.events[event];
    if (callbacks) {
      this.events[event] = callbacks.filter((cb) => cb !== callback);
    }
  }
}

// Usage
const emitter = new EventEmitter();

emitter.on('data', (value) => {
  console.log('A:', value);
});

emitter.on('data', (value) => {
  console.log('B:', value * 2);
});

emitter.once('special', (value) => {
  console.log('C:', `Once: ${value}`);
});

emitter.emit('data', 5);
emitter.emit('special', 'First');
emitter.emit('special', 'Second');  // Won't trigger - once only
console.log('D:', 'Done');

/**
 * OUTPUT:
 *   A: 5
 *   B: 10
 *   C: Once: First
 *   D: Done
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ EVENTEMITTER METHODS                                                       ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║   on(event, callback)                                                      ║
 * ║   ─────────────────────                                                    ║
 * ║   Register a callback to be called every time the event fires              ║
 * ║                                                                            ║
 * ║   once(event, callback)                                                    ║
 * ║   ──────────────────────                                                   ║
 * ║   Register a callback to be called only the first time                     ║
 * ║   Automatically removes itself after first call                            ║
 * ║                                                                            ║
 * ║   emit(event, data)                                                        ║
 * ║   ─────────────────                                                        ║
 * ║   Trigger all callbacks registered for this event                          ║
 * ║   Callbacks are called synchronously in order of registration              ║
 * ║                                                                            ║
 * ║   off(event, callback) / removeListener                                    ║
 * ║   ───────────────────────────────────────                                  ║
 * ║   Remove a specific callback from an event                                 ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "The EventEmitter pattern allows multiple listeners to subscribe to        │
 * │  events. When an event is emitted, all registered callbacks fire.          │
 * │                                                                             │
 * │  Key methods: on(), once(), emit(), off()                                   │
 * │                                                                             │
 * │  Used in: Node.js streams, DOM events, React event handling,               │
 * │  WebSocket connections, and pub/sub architectures."                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/07-callbacks/07-event-callbacks.js
 */
