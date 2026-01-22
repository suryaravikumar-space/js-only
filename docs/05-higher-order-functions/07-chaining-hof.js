/**
 * CHALLENGE 07: Chaining Higher-Order Functions
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Since map, filter, slice return arrays, you can CHAIN them!                ║
 * ║                                                                            ║
 * ║   array                                                                    ║
 * ║     .filter(...)  // returns array                                         ║
 * ║     .map(...)     // returns array                                         ║
 * ║     .reduce(...)  // returns value                                         ║
 * ║                                                                            ║
 * ║ Each method works on the result of the previous one.                       ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

var users = [
  { name: 'Alice', age: 25, salary: 50000 },
  { name: 'Bob', age: 30, salary: 70000 },
  { name: 'Charlie', age: 35, salary: 60000 },
  { name: 'Diana', age: 28, salary: 80000 },
  { name: 'Eve', age: 22, salary: 45000 }
];

// Chain: filter -> map -> reduce
var totalSalaryAbove25 = users
  .filter(user => user.age > 25)
  .map(user => user.salary)
  .reduce((sum, salary) => sum + salary, 0);

console.log('A:', totalSalaryAbove25);

// Chain: filter -> sort -> map
var namesOfTop3Earners = users
  .sort((a, b) => b.salary - a.salary)
  .slice(0, 3)
  .map(user => user.name);

console.log('B:', namesOfTop3Earners);

/**
 * OUTPUT:
 *   A: 210000
 *   B: [ 'Diana', 'Bob', 'Charlie' ]
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: Total salary of users above 25                                          ║
 * ║ ─────────────────────────────────                                          ║
 * ║                                                                            ║
 * ║   Step 1: filter(age > 25)                                                 ║
 * ║   [Alice(25), Bob(30), Charlie(35), Diana(28), Eve(22)]                    ║
 * ║                   ↓                                                        ║
 * ║   [Bob(30), Charlie(35), Diana(28)]  // 3 users pass                       ║
 * ║                                                                            ║
 * ║   Step 2: map(salary)                                                      ║
 * ║   [Bob(70k), Charlie(60k), Diana(80k)]                                     ║
 * ║                   ↓                                                        ║
 * ║   [70000, 60000, 80000]                                                    ║
 * ║                                                                            ║
 * ║   Step 3: reduce(sum)                                                      ║
 * ║   70000 + 60000 + 80000 = 210000                                           ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ B: Names of top 3 earners                                                  ║
 * ║ ─────────────────────────                                                  ║
 * ║                                                                            ║
 * ║   Step 1: sort by salary (descending)                                      ║
 * ║   [Diana(80k), Bob(70k), Charlie(60k), Alice(50k), Eve(45k)]               ║
 * ║                                                                            ║
 * ║   Step 2: slice(0, 3)                                                      ║
 * ║   [Diana, Bob, Charlie]                                                    ║
 * ║                                                                            ║
 * ║   Step 3: map(name)                                                        ║
 * ║   ['Diana', 'Bob', 'Charlie']                                              ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ DATA FLOW VISUALIZATION                                                     │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Original Data                                                             │
 * │        │                                                                    │
 * │        ▼                                                                    │
 * │   ┌─────────┐                                                               │
 * │   │ filter  │ → Select subset                                               │
 * │   └────┬────┘                                                               │
 * │        │  [subset of objects]                                               │
 * │        ▼                                                                    │
 * │   ┌─────────┐                                                               │
 * │   │  map    │ → Transform shape                                             │
 * │   └────┬────┘                                                               │
 * │        │  [transformed values]                                              │
 * │        ▼                                                                    │
 * │   ┌─────────┐                                                               │
 * │   │ reduce  │ → Aggregate to single value                                   │
 * │   └────┬────┘                                                               │
 * │        │                                                                    │
 * │        ▼                                                                    │
 * │   Final Result                                                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ COMMON CHAIN PATTERNS                                                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // 1. Filter → Map (most common)                                          │
 * │   var activeUserNames = users                                               │
 * │     .filter(u => u.active)                                                  │
 * │     .map(u => u.name);                                                      │
 * │                                                                             │
 * │   // 2. Map → Filter                                                        │
 * │   var validEmails = users                                                   │
 * │     .map(u => u.email)                                                      │
 * │     .filter(email => email.includes('@'));                                  │
 * │                                                                             │
 * │   // 3. Filter → Reduce                                                     │
 * │   var totalActiveSpend = orders                                             │
 * │     .filter(o => o.status === 'completed')                                  │
 * │     .reduce((sum, o) => sum + o.total, 0);                                  │
 * │                                                                             │
 * │   // 4. Sort → Slice → Map                                                  │
 * │   var topProducts = products                                                │
 * │     .sort((a, b) => b.sales - a.sales)                                      │
 * │     .slice(0, 5)                                                            │
 * │     .map(p => p.name);                                                      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ PERFORMANCE CONSIDERATION                                                   │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // Each method creates a new array - multiple iterations!                 │
 * │   var result = hugeArray                                                    │
 * │     .filter(...)   // 1st iteration, new array                              │
 * │     .map(...)      // 2nd iteration, new array                              │
 * │     .reduce(...);  // 3rd iteration                                         │
 * │                                                                             │
 * │   // For large arrays, consider single reduce:                              │
 * │   var result = hugeArray.reduce((acc, item) => {                            │
 * │     if (/* filter condition *\/) {                                          │
 * │       acc.push(/* map transformation *\/);                                  │
 * │     }                                                                       │
 * │     return acc;                                                             │
 * │   }, []);                                                                   │
 * │                                                                             │
 * │   // But: Chaining is more readable for most cases!                         │
 * │   // Only optimize when you have performance issues.                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/05-higher-order-functions/07-chaining-hof.js
 */
