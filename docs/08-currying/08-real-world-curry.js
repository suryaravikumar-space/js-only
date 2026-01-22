/**
 * CHALLENGE 08: Real-World Currying Examples
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Currying is used in real applications for:                                 ║
 * ║                                                                            ║
 * ║ • URL/API builders - configure base, then add endpoints                    ║
 * ║ • Event handlers - pre-configure with context                              ║
 * ║ • Validators - build validation rules                                      ║
 * ║ • Formatters - configure format, apply to data                             ║
 * ║ • Loggers - configure level, log messages                                  ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// API endpoint builder
var buildUrl = baseUrl => endpoint => params => {
  var query = Object.entries(params)
    .map(([k, v]) => `${k}=${v}`)
    .join('&');
  return `${baseUrl}${endpoint}?${query}`;
};

var apiUrl = buildUrl('https://api.example.com');
var usersEndpoint = apiUrl('/users');

console.log('A:', usersEndpoint({ page: 1, limit: 10 }));

// Event handler factory
var handleEvent = eventType => handler => element => {
  return { element, eventType, handler: handler.name || 'anonymous' };
};

var onClick = handleEvent('click');
var onClickLog = onClick(function logClick() {});

console.log('B:', onClickLog('button'));

// Validation builder
var validate = rules => value => {
  return rules.every(rule => rule(value));
};

var isRequired = v => v !== '' && v !== null && v !== undefined;
var minLength = min => v => v.length >= min;
var maxLength = max => v => v.length <= max;

var validateUsername = validate([isRequired, minLength(3), maxLength(20)]);

console.log('C:', validateUsername('john'));
console.log('D:', validateUsername('ab'));

/**
 * OUTPUT:
 *   A: https://api.example.com/users?page=1&limit=10
 *   B: { element: 'button', eventType: 'click', handler: 'logClick' }
 *   C: true
 *   D: false
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ USE CASE 1: API CLIENT                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║   var api = baseUrl => endpoint => method => data => {                     ║
 * ║     return fetch(`${baseUrl}${endpoint}`, {                                ║
 * ║       method,                                                              ║
 * ║       body: JSON.stringify(data)                                           ║
 * ║     });                                                                    ║
 * ║   };                                                                       ║
 * ║                                                                            ║
 * ║   var myApi = api('https://api.example.com');                              ║
 * ║   var usersApi = myApi('/users');                                          ║
 * ║   var getUsers = usersApi('GET');                                          ║
 * ║   var createUser = usersApi('POST');                                       ║
 * ║                                                                            ║
 * ║   getUsers({});                         // GET /users                      ║
 * ║   createUser({ name: 'John' });         // POST /users                     ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ USE CASE 2: FORM VALIDATION                                                 │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // Build reusable validators                                              │
 * │   var isRequired = v => v != null && v !== '';                              │
 * │   var minLength = min => v => v.length >= min;                              │
 * │   var maxLength = max => v => v.length <= max;                              │
 * │   var matches = regex => v => regex.test(v);                                │
 * │   var isEmail = matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);                      │
 * │                                                                             │
 * │   // Compose validators                                                     │
 * │   var validate = rules => value =>                                          │
 * │     rules.map(rule => rule(value)).every(Boolean);                          │
 * │                                                                             │
 * │   // Create field validators                                                │
 * │   var validateEmail = validate([isRequired, isEmail]);                      │
 * │   var validatePassword = validate([                                         │
 * │     isRequired,                                                             │
 * │     minLength(8),                                                           │
 * │     maxLength(100)                                                          │
 * │   ]);                                                                       │
 * │                                                                             │
 * │   validateEmail('test@example.com');  // true                               │
 * │   validatePassword('short');          // false                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ USE CASE 3: LOGGING                                                         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   var createLogger = module => level => message => {                        │
 * │     var timestamp = new Date().toISOString();                               │
 * │     console.log(`[${timestamp}] [${module}] [${level}] ${message}`);        │
 * │   };                                                                        │
 * │                                                                             │
 * │   // Configure for a module                                                 │
 * │   var authLogger = createLogger('AUTH');                                    │
 * │   var authInfo = authLogger('INFO');                                        │
 * │   var authError = authLogger('ERROR');                                      │
 * │                                                                             │
 * │   authInfo('User logged in');                                               │
 * │   // [2024-01-15T10:30:00.000Z] [AUTH] [INFO] User logged in                │
 * │                                                                             │
 * │   authError('Invalid credentials');                                         │
 * │   // [2024-01-15T10:30:01.000Z] [AUTH] [ERROR] Invalid credentials          │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ USE CASE 4: DATA TRANSFORMATION                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   var prop = key => obj => obj[key];                                        │
 * │   var map = fn => arr => arr.map(fn);                                       │
 * │   var filter = pred => arr => arr.filter(pred);                             │
 * │   var sort = compareFn => arr => [...arr].sort(compareFn);                  │
 * │                                                                             │
 * │   var users = [                                                             │
 * │     { name: 'Alice', age: 30 },                                             │
 * │     { name: 'Bob', age: 25 },                                               │
 * │     { name: 'Charlie', age: 35 }                                            │
 * │   ];                                                                        │
 * │                                                                             │
 * │   // Compose transformations                                                │
 * │   var pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);                │
 * │                                                                             │
 * │   var getNamesOfAdults = pipe(                                              │
 * │     filter(u => u.age >= 18),                                               │
 * │     sort((a, b) => a.name.localeCompare(b.name)),                           │
 * │     map(prop('name'))                                                       │
 * │   );                                                                        │
 * │                                                                             │
 * │   getNamesOfAdults(users);  // ['Alice', 'Bob', 'Charlie']                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/06-currying/08-real-world-curry.js
 */
