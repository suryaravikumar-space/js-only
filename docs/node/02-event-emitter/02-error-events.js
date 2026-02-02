/**
 * TOPIC 02: Error Events
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ The 'error' event is SPECIAL in Node.js:                                 ║
 * ║                                                                          ║
 * ║   If you emit('error') with NO listener → Node CRASHES (throws)          ║
 * ║   If you emit('error') WITH a listener  → listener handles it safely     ║
 * ║                                                                          ║
 * ║ ALWAYS attach an 'error' listener to any EventEmitter.                   ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STORY TO REMEMBER: The Fire Alarm System                                 ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ Imagine a building's FIRE ALARM goes off (emit('error')).                ║
 * ║                                                                          ║
 * ║ Scenario 1: NOBODY is listening for the alarm.                           ║
 * ║   → The building BURNS DOWN (Node crashes with uncaught exception).      ║
 * ║                                                                          ║
 * ║ Scenario 2: Firefighters are ON DUTY (.on('error', handler)).            ║
 * ║   → They HANDLE the fire, building survives (error is caught).           ║
 * ║                                                                          ║
 * ║ Rule: ALWAYS have firefighters (error listeners) on duty!                ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 *   VISUAL: The 'error' Event - Special Behavior
 *
 *   emit('error')
 *       │
 *       ├── Has 'error' listener?
 *       │       │
 *       │    YES │                    NO
 *       │       ▼                     ▼
 *       │   ┌──────────┐      ┌──────────────┐
 *       │   │ Listener │      │   CRASH!     │
 *       │   │ handles  │      │ Uncaught     │
 *       │   │ it safely│      │ exception    │
 *       │   └──────────┘      │ Process dies │
 *       │       ✓             └──────────────┘
 *       │   App continues           ✗
 *
 *   This is the ONLY event with this special crash behavior!
 */

const EventEmitter = require('events');

// ─── Example 1: Error WITH a listener (safe) ────────────────────────────────

console.log('--- Safe Error Handling ---');

const building = new EventEmitter();

// Firefighters on duty
building.on('error', (err) => {
  console.log(`A: Fire alarm caught! Error: ${err.message}`);
  console.log('B: Firefighters handled it. Building is safe.');
});

// Fire breaks out - but we're safe
building.emit('error', new Error('Smoke detected on floor 3'));

console.log('C: App continues running normally\n');

// ─── Example 2: What happens WITHOUT a listener (dangerous) ─────────────────

console.log('--- Unhandled Error Demo (using try/catch) ---');

const unsafeBuilding = new EventEmitter();

// NO error listener attached!
// unsafeBuilding.emit('error', new Error('FIRE!'));
// ^^^ This would CRASH Node.js ^^^

// Let's prove it safely with try/catch
try {
  unsafeBuilding.emit('error', new Error('FIRE!'));
} catch (err) {
  console.log(`D: Caught the crash! Error: ${err.message}`);
  console.log('E: Without try/catch, Node would have exited here\n');
}

// ─── Example 3: Error event in a custom class ──────────────────────────────

console.log('--- Custom Class with Error Events ---');

class FireAlarmSystem extends EventEmitter {
  constructor(buildingName) {
    super();
    this.buildingName = buildingName;
  }

  detectSmoke(floor) {
    if (floor < 1 || floor > 10) {
      // Emit error for invalid floor
      this.emit('error', new Error(`Invalid floor: ${floor}`));
      return;
    }
    console.log(`F: Smoke detected on floor ${floor} of ${this.buildingName}`);
    this.emit('alarm', { floor, building: this.buildingName });
  }

  detectFalseAlarm(floor) {
    console.log(`G: False alarm on floor ${floor}`);
    this.emit('false-alarm', { floor });
  }
}

const system = new FireAlarmSystem('Tech Tower');

// ALWAYS attach error listener FIRST
system.on('error', (err) => {
  console.log(`H: SYSTEM ERROR: ${err.message}`);
});

system.on('alarm', ({ floor, building }) => {
  console.log(`I: EVACUATE floor ${floor} of ${building}!`);
});

system.on('false-alarm', ({ floor }) => {
  console.log(`J: Stand down - false alarm on floor ${floor}`);
});

system.detectSmoke(5);
system.detectSmoke(-1);    // triggers error
system.detectFalseAlarm(3);

// ─── Example 4: Error handling best practice ────────────────────────────────

console.log('\n--- Best Practice: Always Handle Errors ---');

const safeEmitter = new EventEmitter();

// Best practice: attach error listener immediately after creation
safeEmitter.on('error', (err) => {
  console.log(`K: Handled error: ${err.message}`);
});

safeEmitter.on('data', (msg) => {
  console.log(`L: Got data: ${msg}`);
});

safeEmitter.emit('data', 'Hello');
safeEmitter.emit('error', new Error('Something went wrong'));
safeEmitter.emit('data', 'Still running!');

/**
 * OUTPUT:
 *   --- Safe Error Handling ---
 *   A: Fire alarm caught! Error: Smoke detected on floor 3
 *   B: Firefighters handled it. Building is safe.
 *   C: App continues running normally
 *
 *   --- Unhandled Error Demo (using try/catch) ---
 *   D: Caught the crash! Error: FIRE!
 *   E: Without try/catch, Node would have exited here
 *
 *   --- Custom Class with Error Events ---
 *   F: Smoke detected on floor 5 of Tech Tower
 *   I: EVACUATE floor 5 of Tech Tower!
 *   H: SYSTEM ERROR: Invalid floor: -1
 *   J: Stand down - false alarm on floor 3
 *
 *   --- Best Practice: Always Handle Errors ---
 *   L: Got data: Hello
 *   K: Handled error: Something went wrong
 *   L: Got data: Still running!
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                           │
 * │ "The 'error' event is special in Node.js EventEmitter. If you emit an     │
 * │  'error' event and there's no listener for it, Node throws an uncaught    │
 * │  exception and the process crashes. This is a safety mechanism - errors   │
 * │  should never be silently ignored. The best practice is to ALWAYS attach  │
 * │  an 'error' listener to any EventEmitter instance immediately after       │
 * │  creating it. This is the only event name with this special crash         │
 * │  behavior."                                                               │
 * │                                                                           │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/02-event-emitter/02-error-events.js
 */
