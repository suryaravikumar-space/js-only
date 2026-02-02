/**
 * CHALLENGE 01: Object Destructuring
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Object destructuring extracts values based on PROPERTY NAMES, not         ║
 * ║ position. The variable name MUST match the property name (or use alias).  ║
 * ║                                                                            ║
 * ║   const { name, age } = { name: 'John', age: 30 };                        ║
 * ║   // name = 'John', age = 30                                              ║
 * ║                                                                            ║
 * ║   Order doesn't matter! Names are the keys.                                ║
 * ║   const { age, name } = { name: 'John', age: 30 };  // Same result        ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 1. Basic Object Destructuring
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 1. Basic Object Destructuring ═══\n");

const person = {
  name: 'Alice',
  age: 28,
  city: 'New York'
};

// Traditional way
const name1 = person.name;
const age1 = person.age;
console.log('A: Traditional:', name1, age1);

// Destructuring way
const { name, age, city } = person;
console.log('B: Destructured:', name, age, city);

// Order doesn't matter (unlike arrays!)
const { city: c, name: n, age: a } = person;
console.log('C: Different order:', n, a, c);

console.log('');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ ARRAY vs OBJECT DESTRUCTURING                                               │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ARRAY: Uses POSITION                                                      │
 * │   const [a, b] = [1, 2];    // a=1, b=2 (position 0, 1)                    │
 * │                                                                             │
 * │   OBJECT: Uses PROPERTY NAME                                                │
 * │   const {x, y} = {y:2, x:1};  // x=1, y=2 (matched by name)               │
 * │                                                                             │
 * │   ┌─────────────────────────────────────────────────────────────────────┐   │
 * │   │  Object destructuring:                                              │   │
 * │   │                                                                     │   │
 * │   │  { name, age } = { name: 'John', age: 30 }                         │   │
 * │   │     │     │              │          │                              │   │
 * │   │     │     │    ┌─────────┘          │                              │   │
 * │   │     │     │    │     ┌──────────────┘                              │   │
 * │   │     ▼     ▼    ▼     ▼                                              │   │
 * │   │   name   age  'John'  30                                            │   │
 * │   └─────────────────────────────────────────────────────────────────────┘   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 2. Renaming Variables (Aliases)
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 2. Aliases (Renaming) ═══\n");

const user = {
  id: 123,
  username: 'johndoe',
  email: 'john@example.com'
};

// Syntax: { propertyName: newVariableName }
const { username: userName, email: userEmail } = user;
console.log('D: Renamed:', userName, userEmail);

// Useful when property name conflicts with existing variable
const id = 999;  // Already exists
const { id: oderId } = { id: 456 };
console.log('E: Existing id:', id, 'Destructured:', oderId);

// Alias with default value
const { role: userRole = 'guest' } = user;
console.log('F: Alias with default:', userRole);

console.log('');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ ALIAS SYNTAX                                                                │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   { propertyName: variableName } = object                                   │
 * │                                                                             │
 * │   Think of it as: "take propertyName AS variableName"                      │
 * │                                                                             │
 * │   { name: n } = { name: 'John' }                                           │
 * │     │      │                                                               │
 * │     │      └── New variable name: n                                        │
 * │     └── Property to extract: name                                          │
 * │                                                                             │
 * │   Result: n = 'John' (not name!)                                           │
 * │                                                                             │
 * │   With default: { name: n = 'default' }                                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 3. Default Values
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 3. Default Values ═══\n");

const config = {
  host: 'localhost',
  port: 3000
};

// Without defaults
const { host, port, timeout } = config;
console.log('G: Without default:', host, port, timeout);  // timeout undefined

// With defaults
const { host: h, port: p, timeout: t = 5000 } = config;
console.log('H: With default:', h, p, t);

// Default only for undefined
const {
  a: val1 = 'default',  // undefined
  b: val2 = 'default',  // null
  c: val3 = 'default',  // 0
  d: val4 = 'default'   // ''
} = { a: undefined, b: null, c: 0, d: '' };

console.log('I: undefined:', val1);  // 'default'
console.log('J: null:', val2);        // null
console.log('K: 0:', val3);           // 0
console.log('L: empty:', val4);       // ''

console.log('');


// ═══════════════════════════════════════════════════════════════════════════════
// 4. Rest Pattern
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 4. Rest Pattern ═══\n");

const product = {
  id: 1,
  name: 'Laptop',
  price: 999,
  category: 'Electronics',
  stock: 50
};

// Extract some, collect rest
const { id: productId, name: productName, ...otherProps } = product;
console.log('M: Extracted:', productId, productName);
console.log('N: Rest:', otherProps);

// Useful for removing properties
const { password, ...safeUser } = {
  name: 'John',
  email: 'john@test.com',
  password: 'secret'
};
console.log('O: Safe user (no password):', safeUser);

console.log('');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ REST PATTERN FOR OBJECTS                                                    │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   const { a, b, ...rest } = { a: 1, b: 2, c: 3, d: 4 };                    │
 * │                                                                             │
 * │   Extracted: a = 1, b = 2                                                   │
 * │   Rest: { c: 3, d: 4 }                                                      │
 * │                                                                             │
 * │   COMMON USE CASES:                                                         │
 * │   • Remove sensitive fields before sending response                         │
 * │   • Separate known props from extra props (React)                           │
 * │   • Clone object without certain properties                                 │
 * │                                                                             │
 * │   const { password, ...safeData } = user;                                  │
 * │   res.json(safeData);  // No password exposed!                             │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 5. Nested Object Destructuring
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 5. Nested Destructuring ═══\n");

const company = {
  name: 'TechCorp',
  address: {
    street: '123 Main St',
    city: 'San Francisco',
    country: 'USA'
  },
  ceo: {
    name: 'Jane Doe',
    age: 45
  }
};

// Nested destructuring
const {
  name: companyName,
  address: { city: companyCity, country },
  ceo: { name: ceoName }
} = company;

console.log('P: Company:', companyName);
console.log('Q: City:', companyCity);
console.log('R: Country:', country);
console.log('S: CEO:', ceoName);

// With default for potentially missing nested
const {
  address: { zipCode = 'N/A' }
} = company;
console.log('T: Zip (default):', zipCode);

console.log('');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ NESTED DESTRUCTURING                                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   const { outer: { inner } } = { outer: { inner: 'value' } };              │
 * │                                                                             │
 * │   Object:  { outer: { inner: 'value' } }                                   │
 * │                │                                                           │
 * │                ▼                                                           │
 * │   Pattern:   outer: { inner }                                              │
 * │                        │                                                   │
 * │                        ▼                                                   │
 * │   Variable:         inner = 'value'                                        │
 * │                                                                             │
 * │   ⚠️ WARNING: outer is NOT a variable!                                      │
 * │   It's just a path to navigate the structure.                              │
 * │                                                                             │
 * │   To get both outer and inner:                                              │
 * │   const { outer, outer: { inner } } = obj;                                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 6. Computed Property Names
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 6. Computed Property Names ═══\n");

const key = 'dynamicKey';
const obj = {
  staticKey: 'static value',
  [key]: 'dynamic value',
  ['computed' + 'Key']: 'computed value'
};

// Destructure with computed key
const { [key]: dynamicValue } = obj;
console.log('U: Dynamic key value:', dynamicValue);

// Useful for dynamic access
function getProperty(object, propName) {
  const { [propName]: value } = object;
  return value;
}

console.log('V: Get "staticKey":', getProperty(obj, 'staticKey'));
console.log('W: Get dynamic:', getProperty(obj, key));

console.log('');


// ═══════════════════════════════════════════════════════════════════════════════
// 7. Destructuring in Loops
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 7. Destructuring in Loops ═══\n");

const users = [
  { id: 1, name: 'Alice', role: 'admin' },
  { id: 2, name: 'Bob', role: 'user' },
  { id: 3, name: 'Charlie', role: 'user' }
];

// Destructure in for...of
console.log('X: Admins:');
for (const { name, role } of users) {
  if (role === 'admin') {
    console.log('   -', name);
  }
}

// With map
const names = users.map(({ name }) => name);
console.log('Y: All names:', names);

// Object.entries destructuring
const scores = { alice: 95, bob: 87, charlie: 92 };
console.log('Z: Scores:');
for (const [name, score] of Object.entries(scores)) {
  console.log(`   ${name}: ${score}`);
}

console.log('');


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Object destructuring extracts values based on property names, not          │
 * │  position like arrays. Key features:                                        │
 * │                                                                             │
 * │  1. Basic: const { name, age } = person                                     │
 * │  2. Renaming: const { name: userName } = person                             │
 * │  3. Defaults: const { role = 'guest' } = person                             │
 * │  4. Rest: const { id, ...rest } = person                                    │
 * │  5. Nested: const { address: { city } } = person                            │
 * │  6. Computed: const { [key]: value } = obj                                  │
 * │                                                                             │
 * │  Common gotchas:                                                            │
 * │  - Property name must match (or use alias)                                  │
 * │  - When nested, intermediate names aren't variables                         │
 * │  - Default only applies to undefined, not null/0/''                         │
 * │                                                                             │
 * │  Great for React props: function Component({ name, onClick }) { }          │
 * │  Also for removing sensitive data: const { password, ...safe } = user"     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/14-destructuring-spread/01-object-destructuring.js
 */
