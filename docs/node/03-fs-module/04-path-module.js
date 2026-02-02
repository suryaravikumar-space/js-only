/**
 * TOPIC 04: The Path Module
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ NEVER build file paths with string concatenation. Use path.join().       ║
 * ║ It handles OS differences (/ vs \) and edge cases automatically.         ║
 * ║                                                                            ║
 * ║   path.join()     → combine path segments safely                         ║
 * ║   path.resolve()  → get absolute path from relative                      ║
 * ║   path.parse()    → break a path into its components                     ║
 * ║   __dirname       → directory of the current file                        ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  Think of the path module as a GPS giving directions.                     │
 * │                                                                             │
 * │  path.join() = "Combine these road segments":                              │
 * │    - GPS: "Take Main St" + "turn onto Oak Ave" + "stop at #42"           │
 * │    - path.join('/users', 'surya', 'docs') → '/users/surya/docs'          │
 * │    - It cleans up: '/users/' + '//surya' → '/users/surya' (no mess)      │
 * │                                                                             │
 * │  path.resolve() = "Where am I RIGHT NOW in absolute terms?":              │
 * │    - GPS: "You are at 40.7128 N, 74.0060 W" (absolute coordinates)       │
 * │    - Always returns a full absolute path from the current directory       │
 * │                                                                             │
 * │  path.parse() = "Break down this address":                                 │
 * │    - "123 Oak Ave, Springfield, IL" → {street, city, state}               │
 * │    - '/home/surya/app.js' → {root, dir, base, name, ext}                 │
 * │                                                                             │
 * │  __dirname = "Your home address" (always the same, never changes)         │
 * │                                                                             │
 * │  "path.join = GPS directions. path.resolve = GPS coordinates."            │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: PATH ANATOMY                                                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  Given: '/home/surya/projects/app.config.js'                              │
 * │                                                                             │
 * │  ┌─────┬──────────────────────┬─────────────────┐                         │
 * │  │root │       dir            │      base        │                         │
 * │  │  /  │ /home/surya/projects │ app.config.js    │                         │
 * │  └─────┴──────────────────────┴─────────────────┘                         │
 * │                                 ┌──────────┬────┐                         │
 * │                                 │   name   │ext │                         │
 * │                                 │app.config│.js │                         │
 * │                                 └──────────┴────┘                         │
 * │                                                                             │
 * │  path.parse() returns:                                                     │
 * │    {                                                                       │
 * │      root: '/',                                                            │
 * │      dir:  '/home/surya/projects',                                        │
 * │      base: 'app.config.js',                                               │
 * │      name: 'app.config',                                                  │
 * │      ext:  '.js'                                                           │
 * │    }                                                                       │
 * │                                                                             │
 * │  path.join() vs path.resolve():                                            │
 * │                                                                             │
 * │  join('src', 'utils', 'helper.js')                                        │
 * │    → 'src/utils/helper.js'          (relative - just joins)               │
 * │                                                                             │
 * │  resolve('src', 'utils', 'helper.js')                                     │
 * │    → '/home/surya/src/utils/helper.js'  (absolute - from cwd)            │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const path = require('path');

// ─── 1. path.join() - safely combine path segments ───────────────────────────
console.log('A:', path.join('/users', 'surya', 'docs', 'file.txt'));
console.log('B:', path.join('/users', '//surya/', '/docs/')); // cleans slashes
console.log('C:', path.join('/users', 'surya', '..', 'other')); // resolves ..

// ─── 2. path.resolve() - get absolute path ──────────────────────────────────
console.log('D:', path.resolve('src', 'index.js')); // from cwd
console.log('E:', path.resolve('/tmp', 'test', 'file.js')); // already absolute
console.log('F:', path.resolve('/a', '/b', 'c')); // /b resets (it's absolute)

// ─── 3. path.basename() - get filename ──────────────────────────────────────
console.log('G:', path.basename('/home/surya/app.js')); // app.js
console.log('H:', path.basename('/home/surya/app.js', '.js')); // app (strip ext)

// ─── 4. path.dirname() - get directory ──────────────────────────────────────
console.log('I:', path.dirname('/home/surya/projects/app.js'));

// ─── 5. path.extname() - get extension ──────────────────────────────────────
console.log('J:', path.extname('app.js')); // .js
console.log('K:', path.extname('app.config.js')); // .js (last ext only)
console.log('L:', path.extname('Makefile')); // '' (no extension)

// ─── 6. path.parse() - break path into components ───────────────────────────
const parsed = path.parse('/home/surya/projects/app.config.js');
console.log('M:', JSON.stringify(parsed, null, 2));

// ─── 7. path.format() - build path from components ─────────────────────────
const formatted = path.format({
  dir: '/home/surya',
  name: 'config',
  ext: '.json'
});
console.log('N:', formatted);

// ─── 8. __dirname and __filename ─────────────────────────────────────────────
console.log('O:', `__dirname  = ${__dirname}`);
console.log('P:', `__filename = ${__filename}`);

// ─── 9. Common pattern: build paths relative to current file ────────────────
const configPath = path.join(__dirname, '..', 'config', 'settings.json');
console.log('Q:', `Config path: ${configPath}`);

// ─── 10. path.isAbsolute() ──────────────────────────────────────────────────
console.log('R:', `'/usr/bin' is absolute: ${path.isAbsolute('/usr/bin')}`);
console.log('S:', `'./src' is absolute: ${path.isAbsolute('./src')}`);

// ─── 11. path.relative() - relative path between two paths ──────────────────
const from = '/home/surya/projects/app';
const to = '/home/surya/projects/lib/utils.js';
console.log('T:', `Relative: ${path.relative(from, to)}`);

// ─── 12. path.sep and path.delimiter ─────────────────────────────────────────
console.log('U:', `Path separator: "${path.sep}" (Linux: /, Windows: \\)`);
console.log('V:', `PATH delimiter: "${path.delimiter}" (Linux: :, Windows: ;)`);

/**
 * OUTPUT:
 *   A: /users/surya/docs/file.txt
 *   B: /users/surya/docs
 *   C: /users/other
 *   D: /home/surya/js-only/src/index.js       (varies by cwd)
 *   E: /tmp/test/file.js
 *   F: /b/c
 *   G: app.js
 *   H: app
 *   I: /home/surya/projects
 *   J: .js
 *   K: .js
 *   L:
 *   M: {
 *     "root": "/",
 *     "dir": "/home/surya/projects",
 *     "base": "app.config.js",
 *     "ext": ".js",
 *     "name": "app.config"
 *   }
 *   N: /home/surya/config.json
 *   O: __dirname  = /home/surya/js-only/docs/node/03-fs-module
 *   P: __filename = /home/surya/js-only/docs/node/03-fs-module/04-path-module.js
 *   Q: Config path: /home/surya/js-only/docs/node/config/settings.json
 *   R: '/usr/bin' is absolute: true
 *   S: './src' is absolute: false
 *   T: Relative: ../lib/utils.js
 *   U: Path separator: "/" (Linux: /, Windows: \)
 *   V: PATH delimiter: ":" (Linux: :, Windows: ;)
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "The path module provides utilities for working with file paths in a      │
 * │  cross-platform way. path.join() combines segments using the correct OS   │
 * │  separator and normalizes slashes. path.resolve() returns an absolute     │
 * │  path, resolving from right to left until it hits an absolute segment.    │
 * │  path.parse() breaks a path into root, dir, base, name, and ext.         │
 * │  __dirname gives the directory of the current file - I use it with        │
 * │  path.join(__dirname, '..', 'config') to build reliable paths relative    │
 * │  to the source file, not the working directory. Never concatenate paths   │
 * │  with + because it breaks across operating systems."                       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/03-fs-module/04-path-module.js
 */
