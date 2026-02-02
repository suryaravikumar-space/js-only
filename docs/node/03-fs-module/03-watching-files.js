/**
 * TOPIC 03: Watching Files for Changes
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ fs.watch() uses OS-native file watching (inotify/FSEvents/kqueue).       ║
 * ║ fs.watchFile() uses polling (slower but more reliable cross-platform).   ║
 * ║ For production, use chokidar - it handles edge cases both miss.          ║
 * ║                                                                            ║
 * ║   fs.watch(path, callback)      → fast, OS-native, can be unreliable    ║
 * ║   fs.watchFile(path, callback)  → polling, reliable, higher CPU cost    ║
 * ║   chokidar.watch(path)          → best of both worlds (npm package)     ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  Think of a SECURITY CAMERA watching a door.                              │
 * │                                                                             │
 * │  fs.watch() = Motion-sensor camera:                                        │
 * │    - Reacts INSTANTLY when something moves (OS notifies Node)             │
 * │    - Very efficient, barely uses power                                     │
 * │    - But sometimes has blind spots (platform quirks)                      │
 * │    - Might fire twice for one event (duplicate events)                    │
 * │                                                                             │
 * │  fs.watchFile() = Guard checking the door every 5 seconds:                │
 * │    - Walks to the door, checks: "Any change?" (polling)                   │
 * │    - Reliable - never misses anything                                      │
 * │    - But wastes energy walking back and forth                              │
 * │    - Slight delay between change and detection                            │
 * │                                                                             │
 * │  chokidar = Professional security system:                                  │
 * │    - Uses motion sensors (fs.watch) as primary                            │
 * │    - Falls back to guard patrols (polling) when sensors fail              │
 * │    - Handles edge cases: rapid changes, renames, deletions                │
 * │                                                                             │
 * │  "fs.watch is fast but quirky. chokidar is what you ship."               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: FILE WATCHER EVENT FLOW                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  fs.watch() - OS-native notifications:                                     │
 * │                                                                             │
 * │  ┌────────────┐    OS Event     ┌────────────┐   callback   ┌──────────┐  │
 * │  │  File on   │ ──────────────► │  libuv     │ ──────────► │  Your    │  │
 * │  │  disk      │  inotify/       │  event     │  (eventType, │  handler │  │
 * │  │  changes!  │  FSEvents       │  loop      │   filename)  │  runs    │  │
 * │  └────────────┘                 └────────────┘              └──────────┘  │
 * │                                                                             │
 * │  fs.watchFile() - Polling:                                                 │
 * │                                                                             │
 * │  ┌────────────┐    stat()       ┌────────────┐  different?  ┌──────────┐  │
 * │  │  File on   │ ◄──────────── │  Timer      │ ──────────► │  Your    │  │
 * │  │  disk      │  every Nms     │  polls      │  yes → call  │  handler │  │
 * │  │            │ ──────────── ► │  fs.stat()  │  no  → skip  │  runs    │  │
 * │  └────────────┘                 └────────────┘              └──────────┘  │
 * │                                                                             │
 * │  Event types from fs.watch():                                              │
 * │    'rename'  → file created, deleted, or renamed                          │
 * │    'change'  → file content modified                                       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const fs = require('fs');
const path = require('path');

const SCRATCH = '/tmp/claude/-home-surya-js-only/9ed60efb-9031-4376-b20f-72de729939fa/scratchpad';

const watchFile = path.join(SCRATCH, 'watched-file.txt');
const watchDir = path.join(SCRATCH, 'watched-dir');

// Setup
fs.writeFileSync(watchFile, 'initial content\n', 'utf8');
fs.mkdirSync(watchDir, { recursive: true });

const events = [];

// ─── 1. fs.watch() on a file ─────────────────────────────────────────────────
console.log('A:', 'Setting up fs.watch() on a file...');

const fileWatcher = fs.watch(watchFile, (eventType, filename) => {
  const msg = `fs.watch → eventType: "${eventType}", filename: "${filename}"`;
  events.push(msg);
});

// ─── 2. fs.watch() on a directory ────────────────────────────────────────────
console.log('B:', 'Setting up fs.watch() on a directory...');

const dirWatcher = fs.watch(watchDir, (eventType, filename) => {
  const msg = `fs.watch(dir) → eventType: "${eventType}", filename: "${filename}"`;
  events.push(msg);
});

// ─── 3. fs.watchFile() - polling based ───────────────────────────────────────
console.log('C:', 'Setting up fs.watchFile() (polling)...');

fs.watchFile(watchFile, { interval: 100 }, (curr, prev) => {
  const msg = `fs.watchFile → size changed: ${prev.size} → ${curr.size}`;
  events.push(msg);
});

// ─── 4. Trigger changes after a short delay ─────────────────────────────────
setTimeout(() => {
  console.log('D:', 'Modifying watched file...');
  fs.writeFileSync(watchFile, 'modified content!\n', 'utf8');
}, 200);

setTimeout(() => {
  console.log('E:', 'Creating new file in watched directory...');
  fs.writeFileSync(path.join(watchDir, 'new-file.txt'), 'hello\n', 'utf8');
}, 400);

setTimeout(() => {
  console.log('F:', 'Appending to watched file...');
  fs.appendFileSync(watchFile, 'appended data\n', 'utf8');
}, 600);

// ─── 5. Collect and display results, then cleanup ────────────────────────────
setTimeout(() => {
  console.log('G:', `\nCaptured ${events.length} watcher events:`);
  events.forEach((e, i) => console.log(`   ${i + 1}. ${e}`));

  // ─── 6. Cleanup watchers (IMPORTANT: prevent memory leaks) ────────────────
  fileWatcher.close();
  dirWatcher.close();
  fs.unwatchFile(watchFile);
  console.log('\nH:', 'All watchers closed (prevents memory leaks!)');

  // ─── 7. Show chokidar usage (code example, not executed) ──────────────────
  console.log('\nI:', 'Chokidar example (npm install chokidar):');
  console.log(`
  // const chokidar = require('chokidar');
  //
  // const watcher = chokidar.watch('./src', {
  //   ignored: /node_modules/,
  //   persistent: true,
  //   ignoreInitial: true
  // });
  //
  // watcher
  //   .on('add',    path => console.log(\`Added: \${path}\`))
  //   .on('change', path => console.log(\`Changed: \${path}\`))
  //   .on('unlink', path => console.log(\`Deleted: \${path}\`))
  //   .on('error',  err  => console.error(\`Error: \${err}\`));
  //
  // // To stop watching:
  // // watcher.close();
  `);

  // Cleanup files
  fs.unlinkSync(watchFile);
  fs.rmSync(watchDir, { recursive: true });

  console.log('J:', 'Demo complete, temp files cleaned up');
}, 1200);

/**
 * OUTPUT:
 *   A: Setting up fs.watch() on a file...
 *   B: Setting up fs.watch() on a directory...
 *   C: Setting up fs.watchFile() (polling)...
 *   D: Modifying watched file...
 *   E: Creating new file in watched directory...
 *   F: Appending to watched file...
 *   G:
 *   Captured N watcher events:
 *      1. fs.watch → eventType: "change", filename: "watched-file.txt"
 *      2. fs.watch(dir) → eventType: "rename", filename: "new-file.txt"
 *      3. fs.watchFile → size changed: 16 → 18
 *      ...
 *
 *   H: All watchers closed (prevents memory leaks!)
 *   I: Chokidar example (npm install chokidar):
 *      (chokidar code shown)
 *   J: Demo complete, temp files cleaned up
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Node provides two built-in file watching mechanisms. fs.watch() uses     │
 * │  OS-native events (inotify on Linux, FSEvents on macOS) making it fast    │
 * │  and efficient, but it can be unreliable - it may fire duplicate events   │
 * │  or miss changes on some platforms. fs.watchFile() uses stat polling at   │
 * │  a configurable interval, which is reliable but uses more CPU. In         │
 * │  production, I'd use chokidar (npm package) which wraps fs.watch with    │
 * │  polling fallbacks, handles edge cases like atomic saves and rapid        │
 * │  changes, and provides a cleaner event API. Always close watchers when    │
 * │  done to prevent memory leaks."                                            │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/03-fs-module/03-watching-files.js
 */
