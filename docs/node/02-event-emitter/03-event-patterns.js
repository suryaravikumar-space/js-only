/**
 * TOPIC 03: Event Patterns
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ EventEmitter provides powerful listener management:                      ║
 * ║                                                                          ║
 * ║   .once(event, fn)          → listen only ONE time, then auto-remove     ║
 * ║   .removeListener(event,fn) → unsubscribe a specific listener            ║
 * ║   .removeAllListeners()     → remove all listeners (nuclear option)      ║
 * ║   .listenerCount(event)     → how many listeners for this event?         ║
 * ║   .eventNames()             → which events have listeners?               ║
 * ║   .setMaxListeners(n)       → prevent memory leak warnings               ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STORY TO REMEMBER: Newsletter Subscription                               ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ Think of events like a NEWSLETTER service:                               ║
 * ║                                                                          ║
 * ║   .on('newsletter')     → Subscribe (receive every issue)                ║
 * ║   .once('welcome')      → One-time welcome email (then auto-unsub)       ║
 * ║   .removeListener()     → Unsubscribe from the newsletter                ║
 * ║   .removeAllListeners() → Unsubscribe ALL subscribers at once            ║
 * ║   .listenerCount()      → How many subscribers do we have?               ║
 * ║   maxListeners warning  → "Too many subscribers! Memory leak?"           ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 *   VISUAL: Listener Lifecycle
 *
 *   .on()                          .once()
 *   ┌────────────┐                ┌────────────┐
 *   │ Subscribe  │                │ Subscribe  │
 *   └─────┬──────┘                └─────┬──────┘
 *         │                             │
 *    emit ▼  fires                 emit ▼  fires
 *    emit ▼  fires                      ✗  auto-removed!
 *    emit ▼  fires
 *         │
 *   .removeListener()
 *         ✗  manually removed
 *
 *
 *   VISUAL: Memory Leak Warning
 *
 *   Default max: 10 listeners per event
 *
 *   Listeners: [1][2][3][4][5][6][7][8][9][10][11] ← WARNING!
 *                                              ▲
 *                                     "Possible memory leak detected"
 *
 *   Fix: emitter.setMaxListeners(20)  or  investigate the leak
 */

const EventEmitter = require('events');

// ─── .once() - Fire only ONE time ───────────────────────────────────────────

console.log('--- .once() - One-Time Listener ---');

const newsletter = new EventEmitter();

// Welcome email - only sent once
newsletter.once('subscribe', (name) => {
  console.log(`A: Welcome email sent to ${name}! (this won't fire again)`);
});

// Regular newsletter - fires every time
newsletter.on('new-issue', (issue) => {
  console.log(`B: Sending issue #${issue} to all subscribers`);
});

newsletter.emit('subscribe', 'Alice');
newsletter.emit('subscribe', 'Alice');  // once listener already removed
newsletter.emit('new-issue', 1);
newsletter.emit('new-issue', 2);

// ─── .removeListener() - Unsubscribe ───────────────────────────────────────

console.log('\n--- .removeListener() - Unsubscribe ---');

const channel = new EventEmitter();

const handler = (msg) => {
  console.log(`C: Received: ${msg}`);
};

channel.on('message', handler);

channel.emit('message', 'First message');     // fires
channel.removeListener('message', handler);
channel.emit('message', 'Second message');    // does NOT fire

console.log('D: Handler removed - second message was not received');

// NOTE: You must pass the SAME function reference to removeListener
// Anonymous arrow functions CANNOT be removed!

// ─── .off() is an alias for .removeListener() ──────────────────────────────

console.log('\n--- .off() - Alias for removeListener ---');

const chat = new EventEmitter();

const chatHandler = (msg) => console.log(`E: Chat: ${msg}`);

chat.on('msg', chatHandler);
chat.emit('msg', 'Hello');

chat.off('msg', chatHandler);  // same as removeListener
chat.emit('msg', 'Goodbye');   // won't fire

console.log('F: .off() works the same as .removeListener()');

// ─── .removeAllListeners() - Nuclear option ─────────────────────────────────

console.log('\n--- .removeAllListeners() ---');

const radio = new EventEmitter();

radio.on('song', () => console.log('Listener 1'));
radio.on('song', () => console.log('Listener 2'));
radio.on('news', () => console.log('News listener'));

console.log(`G: Before removal - song listeners: ${radio.listenerCount('song')}`);
console.log(`H: Before removal - news listeners: ${radio.listenerCount('news')}`);

radio.removeAllListeners('song');  // remove only 'song' listeners

console.log(`I: After removal - song listeners: ${radio.listenerCount('song')}`);
console.log(`J: After removal - news listeners: ${radio.listenerCount('news')}`);

// radio.removeAllListeners();  // no argument = remove ALL listeners for ALL events

// ─── .listenerCount() and .eventNames() ─────────────────────────────────────

console.log('\n--- Introspection Methods ---');

const server = new EventEmitter();

server.on('request', () => {});
server.on('request', () => {});
server.on('error', () => {});
server.on('close', () => {});

console.log(`K: Event names: ${server.eventNames().join(', ')}`);
console.log(`L: 'request' listeners: ${server.listenerCount('request')}`);
console.log(`M: 'error' listeners: ${server.listenerCount('error')}`);
console.log(`N: 'close' listeners: ${server.listenerCount('close')}`);

// ─── maxListeners and Memory Leak Warning ───────────────────────────────────

console.log('\n--- maxListeners ---');

const leaky = new EventEmitter();

console.log(`O: Default maxListeners: ${leaky.getMaxListeners()}`);

// Adding 11+ listeners would trigger a warning
// To suppress it (when you KNOW it's intentional):
leaky.setMaxListeners(15);
console.log(`P: Updated maxListeners: ${leaky.getMaxListeners()}`);

// Set to 0 or Infinity to disable the warning entirely
leaky.setMaxListeners(0);
console.log(`Q: Unlimited maxListeners: ${leaky.getMaxListeners()} (0 = unlimited)`);

// ─── Practical Pattern: Self-Cleaning Listener ──────────────────────────────

console.log('\n--- Practical: Auto-Cleanup Pattern ---');

const app = new EventEmitter();
let requestCount = 0;

const limitedHandler = () => {
  requestCount += 1;
  console.log(`R: Request #${requestCount} handled`);
  if (requestCount >= 3) {
    app.removeListener('request', limitedHandler);
    console.log('S: Max requests reached - listener removed');
  }
};

app.on('request', limitedHandler);

app.emit('request');  // #1
app.emit('request');  // #2
app.emit('request');  // #3 - removes itself
app.emit('request');  // does nothing

console.log(`T: Final listener count: ${app.listenerCount('request')}`);

/**
 * OUTPUT:
 *   --- .once() - One-Time Listener ---
 *   A: Welcome email sent to Alice! (this won't fire again)
 *   B: Sending issue #1 to all subscribers
 *   B: Sending issue #2 to all subscribers
 *
 *   --- .removeListener() - Unsubscribe ---
 *   C: Received: First message
 *   D: Handler removed - second message was not received
 *
 *   --- .off() - Alias for removeListener ---
 *   E: Chat: Hello
 *   F: .off() works the same as .removeListener()
 *
 *   --- .removeAllListeners() ---
 *   G: Before removal - song listeners: 2
 *   H: Before removal - news listeners: 1
 *   I: After removal - song listeners: 0
 *   J: After removal - news listeners: 1
 *
 *   --- Introspection Methods ---
 *   K: Event names: request, error, close
 *   L: 'request' listeners: 2
 *   M: 'error' listeners: 1
 *   N: 'close' listeners: 1
 *
 *   --- maxListeners ---
 *   O: Default maxListeners: 10
 *   P: Updated maxListeners: 15
 *   Q: Unlimited maxListeners: 0 (0 = unlimited)
 *
 *   --- Practical: Auto-Cleanup Pattern ---
 *   R: Request #1 handled
 *   R: Request #2 handled
 *   R: Request #3 handled
 *   S: Max requests reached - listener removed
 *   T: Final listener count: 0
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                           │
 * │ "EventEmitter has .once() for one-time listeners that auto-remove after   │
 * │  firing. Use .removeListener() or .off() to manually unsubscribe - but    │
 * │  you need the original function reference (can't remove anonymous fns).   │
 * │  .removeAllListeners() clears all listeners for an event or all events.   │
 * │  Node warns when you exceed 10 listeners per event (possible memory       │
 * │  leak). Use .setMaxListeners() to adjust the threshold when you know      │
 * │  it's intentional. Use .listenerCount() and .eventNames() to inspect      │
 * │  the emitter's current state."                                            │
 * │                                                                           │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/02-event-emitter/03-event-patterns.js
 */
