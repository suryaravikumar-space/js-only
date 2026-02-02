/**
 * TOPIC 03: Node.js Global Objects
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Node.js globals (available everywhere without require):                   ║
 * ║                                                                            ║
 * ║   process    - current process info, env vars, exit, stdin/stdout         ║
 * ║   Buffer     - handle binary data                                         ║
 * ║   __dirname  - directory of current file (CommonJS only)                  ║
 * ║   __filename - full path of current file (CommonJS only)                  ║
 * ║   console    - logging (log, error, warn, table, time)                    ║
 * ║   setTimeout, setInterval, setImmediate                                   ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  Global objects are like TOOLS ON YOUR DESK - always there, no need       │
 * │  to go get them from the shelf (require):                                  │
 * │                                                                             │
 * │  process  = Your ID BADGE                                                  │
 * │    - Shows who you are (PID), where you work (cwd), your secrets (env)    │
 * │    - Can clock out anytime (exit)                                          │
 * │                                                                             │
 * │  Buffer   = Your CLIPBOARD                                                 │
 * │    - Holds raw data (binary), can convert to readable text (toString)     │
 * │                                                                             │
 * │  __dirname / __filename = Your GPS LOCATION                                │
 * │    - Always knows exactly where this file is                               │
 * │                                                                             │
 * │  console  = Your WALKIE-TALKIE                                             │
 * │    - Talk (log), shout warnings (warn), report emergencies (error)        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM                                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌─────────────── ALWAYS AVAILABLE (no require) ──────────────┐          │
 * │   │                                                             │          │
 * │   │   process ─── .env, .argv, .cwd(), .exit(), .pid           │          │
 * │   │   Buffer  ─── .from(), .alloc(), .toString()               │          │
 * │   │   console ─── .log(), .error(), .table(), .time()          │          │
 * │   │   __dirname, __filename (CommonJS only)                    │          │
 * │   │   setTimeout, setInterval, setImmediate                    │          │
 * │   │   globalThis (cross-environment global)                    │          │
 * │   │                                                             │          │
 * │   └─────────────────────────────────────────────────────────────┘          │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// process object
console.log('A:', process.argv[0].split('/').pop()); // node
console.log('B:', process.cwd().split('/').pop());   // current working dir
console.log('C:', process.env.HOME || process.env.USERPROFILE); // home dir

// process.env - environment variables
process.env.MY_VAR = 'hello';
console.log('D:', process.env.MY_VAR);

// process.exit() - exit with code (0 = success, 1 = error)
// process.exit(0); // Don't actually call this here

// Buffer - binary data handling
const buf1 = Buffer.alloc(4);        // 4 bytes of zeros
const buf2 = Buffer.from([1, 2, 3]); // from array
const buf3 = Buffer.from('Node');    // from string

console.log('E:', buf1);
console.log('F:', buf2);
console.log('G:', buf3.toString());
console.log('H:', buf3.length); // bytes, not characters

// console methods
console.log('I:', 'Regular log');
console.error('J:', 'Error log (stderr)');
console.warn('K:', 'Warning log (stderr)');

// console.time / console.timeEnd
console.time('loop');
let sum = 0;
for (let i = 0; i < 1000000; i++) sum += i;
console.timeEnd('loop');

// console.table
console.table({ name: 'Node', type: 'Runtime' });

/**
 * OUTPUT (values vary):
 *   A: node
 *   B: js-only
 *   C: /home/surya
 *   D: hello
 *   E: <Buffer 00 00 00 00>
 *   F: <Buffer 01 02 03>
 *   G: Node
 *   H: 4
 *   I: Regular log
 *   J: Error log (stderr)
 *   K: Warning log (stderr)
 *   loop: 5.123ms
 *   ┌─────────┬───────────┐
 *   │ (index) │  Values   │
 *   ├─────────┼───────────┤
 *   │  name   │  'Node'   │
 *   │  type   │ 'Runtime' │
 *   └─────────┴───────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Node.js provides several global objects: process (for env vars, args,     │
 * │  exit codes, stdin/stdout), Buffer (for binary data), __dirname/__filename │
 * │  (file paths in CommonJS), and console. Unlike the browser's 'window',    │
 * │  Node uses 'global' or 'globalThis'. process.env is commonly used for     │
 * │  configuration, and Buffer is essential for working with streams and       │
 * │  binary data like file I/O."                                               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/00-node-basics/03-global-objects.js
 */
