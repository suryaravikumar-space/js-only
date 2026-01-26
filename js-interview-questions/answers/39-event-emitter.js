/**
 * Answer 39: Implement an Event Emitter
 *
 * Complete implementation with various features:
 */

class EventEmitter {
    constructor() {
        this.events = new Map();
    }

    // Subscribe to an event
    on(event, listener) {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        this.events.get(event).push(listener);
        return this; // Allow chaining
    }

    // Unsubscribe from an event
    off(event, listener) {
        if (!this.events.has(event)) return this;

        const listeners = this.events.get(event);
        const index = listeners.indexOf(listener);

        if (index !== -1) {
            listeners.splice(index, 1);
        }

        return this;
    }

    // Trigger an event
    emit(event, ...args) {
        if (!this.events.has(event)) return false;

        const listeners = this.events.get(event).slice(); // Copy to avoid mutation issues

        listeners.forEach(listener => {
            listener.apply(this, args);
        });

        return true;
    }

    // Subscribe for only one trigger
    once(event, listener) {
        const onceWrapper = (...args) => {
            listener.apply(this, args);
            this.off(event, onceWrapper);
        };
        return this.on(event, onceWrapper);
    }

    // Remove all listeners for an event
    removeAllListeners(event) {
        if (event) {
            this.events.delete(event);
        } else {
            this.events.clear();
        }
        return this;
    }

    // Get all listeners for an event
    listeners(event) {
        return this.events.get(event) || [];
    }

    // Get listener count
    listenerCount(event) {
        return this.listeners(event).length;
    }

    // Get all event names
    eventNames() {
        return [...this.events.keys()];
    }
}

// Advanced: EventEmitter with async support
class AsyncEventEmitter extends EventEmitter {
    async emitAsync(event, ...args) {
        if (!this.events.has(event)) return false;

        const listeners = this.events.get(event).slice();

        for (const listener of listeners) {
            await listener.apply(this, args);
        }

        return true;
    }

    emitParallel(event, ...args) {
        if (!this.events.has(event)) return Promise.resolve(false);

        const listeners = this.events.get(event).slice();
        return Promise.all(listeners.map(l => l.apply(this, args)));
    }
}

// Test cases
console.log("=== Basic Usage ===");
const emitter = new EventEmitter();

const greetListener = (name) => console.log(`Hello, ${name}!`);
emitter.on('greet', greetListener);
emitter.emit('greet', 'John'); // "Hello, John!"
emitter.emit('greet', 'Jane'); // "Hello, Jane!"

console.log("\n=== Once ===");
emitter.once('welcome', (name) => console.log(`Welcome, ${name}!`));
emitter.emit('welcome', 'Alice'); // "Welcome, Alice!"
emitter.emit('welcome', 'Bob'); // Nothing (already triggered once)

console.log("\n=== Off (Unsubscribe) ===");
emitter.off('greet', greetListener);
emitter.emit('greet', 'Sam'); // Nothing

console.log("\n=== Multiple Listeners ===");
const emitter2 = new EventEmitter();
emitter2.on('click', () => console.log('Handler 1'));
emitter2.on('click', () => console.log('Handler 2'));
emitter2.emit('click');
// "Handler 1"
// "Handler 2"

console.log("\n=== Chaining ===");
new EventEmitter()
    .on('event', () => console.log('A'))
    .on('event', () => console.log('B'))
    .emit('event');

console.log("\n=== Listener Count ===");
const emitter3 = new EventEmitter();
emitter3.on('test', () => { });
emitter3.on('test', () => { });
console.log(`Listener count: ${emitter3.listenerCount('test')}`); // 2
console.log(`Event names: ${emitter3.eventNames()}`); // ['test']

/**
 * Common Use Cases:
 * - DOM events
 * - Node.js streams
 * - State management
 * - Pub/Sub patterns
 *
 * Time Complexity:
 * - on/off: O(1) average, O(n) for off
 * - emit: O(n) where n is listener count
 *
 * Space Complexity: O(n) for storing listeners
 */
