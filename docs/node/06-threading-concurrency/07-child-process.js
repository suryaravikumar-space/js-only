/**
 * TOPIC 07: Child Process Module
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ Node has 4 ways to spawn child processes:                               ║
 * ║  exec     → runs a SHELL command, buffers output (small output)         ║
 * ║  execFile → runs a FILE directly, no shell (safer, faster)              ║
 * ║  spawn    → streams output, no buffer limit (large output)              ║
 * ║  fork     → spawns a NEW NODE process with IPC channel built-in         ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  You're a MANAGER (Node main process) delegating tasks:                   │
 * │                                                                            │
 * │  exec     = "Call the office phone, give a short verbal answer"           │
 * │             (shell command, small buffered result)                         │
 * │  execFile = "Run this specific program directly, skip the receptionist"   │
 * │             (no shell overhead, safer)                                     │
 * │  spawn    = "Start a live video call, stream updates in real-time"        │
 * │             (streaming output, no buffer limit)                            │
 * │  fork     = "Hire another Node manager with a direct walkie-talkie"       │
 * │             (new Node process + IPC channel for messaging)                │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM: Child Process Methods Comparison                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  METHOD      SHELL?   OUTPUT     USE CASE          IPC?                   │
 * │  ──────────  ──────   ────────   ────────────────  ─────                  │
 * │  exec        YES      buffered   small commands    NO                     │
 * │  execFile    NO       buffered   run executables   NO                     │
 * │  spawn       NO       streamed   large output      NO*                    │
 * │  fork        NO       streamed   Node scripts      YES (built-in)        │
 * │                                                                            │
 * │  * spawn CAN have IPC with { stdio: ['pipe','pipe','pipe','ipc'] }       │
 * │                                                                            │
 * │  ┌──────────┐   exec('ls -la')    ┌───────────┐                          │
 * │  │  Parent  │──────────────────────│  /bin/sh  │──→ ls -la               │
 * │  │  Process │                      │  (shell)  │                          │
 * │  └──────────┘                      └───────────┘                          │
 * │                                                                            │
 * │  ┌──────────┐   spawn('ls',['-la']) ┌──────────┐                          │
 * │  │  Parent  │───────────────────────│  ls -la  │  (no shell)             │
 * │  │  Process │◀══streams═══════════  │ (direct) │                          │
 * │  └──────────┘                       └──────────┘                          │
 * │                                                                            │
 * │  ┌──────────┐   fork('worker.js')   ┌──────────┐                          │
 * │  │  Parent  │◀═══IPC channel═══════▶│  Node.js │                          │
 * │  │  Process │   send()/on('message')│  Process │                          │
 * │  └──────────┘                       └──────────┘                          │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const { exec, execFile, spawn, fork } = require('child_process');
const path = require('path');

// ─── 1. exec: Runs shell command, buffers entire output ───
console.log('A:', '=== exec Demo ===');
exec('echo "Hello from shell" && echo "Node version:" && node --version', (err, stdout, stderr) => {
  if (err) {
    console.log('B:', `exec error: ${err.message}`);
    return;
  }
  console.log('B:', `exec stdout: ${stdout.trim()}`);
  if (stderr) console.log('C:', `exec stderr: ${stderr.trim()}`);
});

// ─── 2. execFile: Runs file directly without shell (safer) ───
console.log('D:', '=== execFile Demo ===');
execFile('node', ['--version'], (err, stdout, stderr) => {
  if (err) {
    console.log('E:', `execFile error: ${err.message}`);
    return;
  }
  console.log('E:', `execFile result: ${stdout.trim()}`);
});

// ─── 3. spawn: Streams output (no buffer limit) ───
console.log('F:', '=== spawn Demo ===');
const ls = spawn('node', ['-e', 'console.log("Line 1"); console.log("Line 2"); console.log("Line 3");']);

ls.stdout.on('data', (data) => {
  console.log('G:', `spawn stdout chunk: ${data.toString().trim()}`);
});

ls.stderr.on('data', (data) => {
  console.log('H:', `spawn stderr: ${data.toString().trim()}`);
});

ls.on('close', (code) => {
  console.log('I:', `spawn process exited with code ${code}`);
});

// ─── 4. fork: Spawns Node process with IPC ───
console.log('J:', '=== fork Demo (inline with eval) ===');

// Since fork needs a separate file, we use spawn with -e for demo
const forkedLike = spawn('node', ['-e', `
  process.on('message', (msg) => {
    process.send({ reply: 'Got: ' + msg.text, pid: process.pid });
  });
  process.send({ status: 'ready', pid: process.pid });
`], { stdio: ['pipe', 'pipe', 'pipe', 'ipc'] });

forkedLike.on('message', (msg) => {
  if (msg.status === 'ready') {
    console.log('K:', `Forked child ready, PID: ${msg.pid}`);
    forkedLike.send({ text: 'Hello child!' });
  } else {
    console.log('L:', `Child replied: ${msg.reply}`);
    forkedLike.kill();
  }
});

// ─── 5. Key differences demo ───
console.log('M:', '=== Key Differences Summary ===');
console.log('N:', 'exec: shell=YES, buffered, good for simple commands');
console.log('O:', 'execFile: shell=NO, buffered, safer (no shell injection)');
console.log('P:', 'spawn: shell=NO, streamed, handles large output');
console.log('Q:', 'fork: shell=NO, streamed+IPC, Node-to-Node communication');

// ─── 6. Shell injection risk with exec ───
console.log('R:', '=== Security: Why execFile > exec ===');
const userInput = 'safe_value'; // imagine this comes from user
exec(`echo ${userInput}`, (err, stdout) => {
  console.log('S:', `exec with user input: ${stdout.trim()}`);
  console.log('T:', 'WARNING: If userInput was "x; rm -rf /", exec would run it!');
});

/**
 * OUTPUT:
 *   A: === exec Demo ===
 *   D: === execFile Demo ===
 *   F: === spawn Demo ===
 *   J: === fork Demo (inline with eval) ===
 *   M: === Key Differences Summary ===
 *   N: exec: shell=YES, buffered, good for simple commands
 *   O: execFile: shell=NO, buffered, safer (no shell injection)
 *   P: spawn: shell=NO, streamed, handles large output
 *   Q: fork: shell=NO, streamed+IPC, Node-to-Node communication
 *   R: === Security: Why execFile > exec ===
 *   B: exec stdout: Hello from shell\nNode version:\nvXX.X.X
 *   E: execFile result: vXX.X.X
 *   G: spawn stdout chunk: Line 1\nLine 2\nLine 3
 *   I: spawn process exited with code 0
 *   K: Forked child ready, PID: XXXXX
 *   L: Child replied: Got: Hello child!
 *   S: exec with user input: safe_value
 *   T: WARNING: If userInput was "x; rm -rf /", exec would run it!
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │ "Node provides four ways to create child processes. exec() runs a shell  │
 * │  command and buffers the output - good for short commands but risky with  │
 * │  user input due to shell injection. execFile() runs an executable         │
 * │  directly without a shell - safer and slightly faster. spawn() streams   │
 * │  output in real-time with no buffer limit - ideal for large outputs.     │
 * │  fork() is specifically for spawning new Node processes with a built-in  │
 * │  IPC channel for parent-child messaging via send()/on('message'). Use   │
 * │  fork when you need Node-to-Node communication, spawn for general       │
 * │  processes, and exec only for quick trusted shell commands."             │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/06-threading-concurrency/07-child-process.js
 */
