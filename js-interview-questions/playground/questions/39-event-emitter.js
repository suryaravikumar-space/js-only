/**
 * Question 39: Implement an Event Emitter
 *
 * An Event Emitter is a pattern that allows objects to subscribe to events
 * and be notified when those events occur.
 *
 * Methods to implement:
 * - on(event, listener): Subscribe to an event
 * - off(event, listener): Unsubscribe from an event
 * - emit(event, ...args): Trigger an event
 * - once(event, listener): Subscribe for only one trigger
 *
 * Task: Implement an EventEmitter class.
 */

class EventEmitter {
    // Your solution here
}

// Test cases
const emitter = new EventEmitter();
emitter.on('greet', (name) => console.log(`Hello, ${name}!`));
emitter.emit('greet', 'John'); // "Hello, John!"
emitter.emit('greet', 'Jane'); // "Hello, Jane!"
