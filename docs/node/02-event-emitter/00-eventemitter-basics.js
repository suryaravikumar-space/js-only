/**
 * TOPIC 00: EventEmitter Basics
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ EventEmitter is the BACKBONE of Node.js async architecture:              ║
 * ║                                                                          ║
 * ║   .on(event, fn)    → listen for an event                                ║
 * ║   .emit(event, data) → fire an event with data                           ║
 * ║                                                                          ║
 * ║ Many Node core modules (http, fs, streams) extend EventEmitter.          ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STORY TO REMEMBER: The Radio Station                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ Think of EventEmitter as a RADIO STATION (broadcaster).                  ║
 * ║                                                                          ║
 * ║ The station BROADCASTS on different channels (event names).              ║
 * ║ Listeners TUNE IN to specific channels with .on().                       ║
 * ║ When the station TRANSMITS with .emit(), all tuned-in listeners hear it. ║
 * ║                                                                          ║
 * ║ Multiple listeners can tune into the SAME channel.                       ║
 * ║ The station can pass DATA along with the broadcast.                      ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 *   VISUAL: How EventEmitter Works
 *
 *       ┌──────────────────────┐
 *       │    EventEmitter      │
 *       │   (Radio Station)    │
 *       └──────────┬───────────┘
 *                  │
 *         .emit('song', data)
 *                  │
 *        ┌─────────┼──────────┐
 *        │         │          │
 *        ▼         ▼          ▼
 *   ┌─────────┐ ┌─────────┐ ┌─────────┐
 *   │Listener1│ │Listener2│ │Listener3│
 *   │.on('song│ │.on('song│ │.on('song│
 *   │  , fn1) │ │  , fn2) │ │  , fn3) │
 *   └─────────┘ └─────────┘ └─────────┘
 *
 *   All listeners registered for 'song' fire IN ORDER of registration.
 */

// ─── Step 1: Import EventEmitter ────────────────────────────────────────────

const EventEmitter = require('events');

// ─── Step 2: Create an emitter instance ─────────────────────────────────────

const radio = new EventEmitter();

// ─── Step 3: Register listeners with .on() ──────────────────────────────────

radio.on('song', (songName) => {
  console.log(`A: Listener 1 heard: "${songName}"`);
});

radio.on('song', (songName) => {
  console.log(`B: Listener 2 heard: "${songName}"`);
});

// ─── Step 4: Emit the event with data ───────────────────────────────────────

radio.emit('song', 'Bohemian Rhapsody');

// ─── Passing multiple arguments ─────────────────────────────────────────────

const station = new EventEmitter();

station.on('broadcast', (channel, message, time) => {
  console.log(`C: [${channel}] "${message}" at ${time}`);
});

station.emit('broadcast', 'FM 101.5', 'Good morning!', '8:00 AM');

// ─── Emitting returns true/false (were there listeners?) ────────────────────

const emitter = new EventEmitter();

const hadListeners = emitter.emit('ghost-event');
console.log(`D: Had listeners for ghost-event? ${hadListeners}`);

emitter.on('real-event', () => {});
const hadListeners2 = emitter.emit('real-event');
console.log(`E: Had listeners for real-event? ${hadListeners2}`);

// ─── Extending EventEmitter (common pattern) ────────────────────────────────

class RadioStation extends EventEmitter {
  constructor(name) {
    super();
    this.name = name;
  }

  playSong(song) {
    console.log(`F: ${this.name} is now playing: "${song}"`);
    this.emit('song-played', song);
  }
}

const myStation = new RadioStation('Rock FM');

myStation.on('song-played', (song) => {
  console.log(`G: DJ logged: "${song}" was played`);
});

myStation.playSong('Stairway to Heaven');

// ─── Listeners are called synchronously ─────────────────────────────────────

const sync = new EventEmitter();

sync.on('test', () => {
  console.log('H: First - inside listener');
});

console.log('I: Before emit');
sync.emit('test');
console.log('J: After emit');

/**
 * OUTPUT:
 *   A: Listener 1 heard: "Bohemian Rhapsody"
 *   B: Listener 2 heard: "Bohemian Rhapsody"
 *   C: [FM 101.5] "Good morning!" at 8:00 AM
 *   D: Had listeners for ghost-event? false
 *   E: Had listeners for real-event? true
 *   F: Rock FM is now playing: "Stairway to Heaven"
 *   G: DJ logged: "Stairway to Heaven" was played
 *   I: Before emit
 *   H: First - inside listener
 *   J: After emit
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                           │
 * │ "EventEmitter is Node's implementation of the Observer/Pub-Sub pattern.   │
 * │  You register listeners with .on(eventName, callback) and trigger them    │
 * │  with .emit(eventName, ...args). Listeners fire synchronously in the      │
 * │  order they were registered. Many core Node modules like http, fs, and    │
 * │  streams inherit from EventEmitter. You can extend it to create your      │
 * │  own event-driven classes."                                               │
 * │                                                                           │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/02-event-emitter/00-eventemitter-basics.js
 */
