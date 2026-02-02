// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║                        CONNECTING TO MONGODB                                ║
// ║              NoSQL Document Database - The Flexible Giant                   ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║  STORY TO REMEMBER: THE FILING CABINET WITH NO RULES                       ║
// ║                                                                            ║
// ║  Imagine a filing cabinet where each DRAWER is a "collection" and each     ║
// ║  FOLDER inside is a "document." Unlike a spreadsheet (SQL), each folder    ║
// ║  can have DIFFERENT contents. One employee folder might have 3 pages,      ║
// ║  another might have 10 pages with photos. The cabinet doesn't care -       ║
// ║  it stores whatever you put in. That's MongoDB.                            ║
// ║                                                                            ║
// ║  SQL = Spreadsheet (strict columns, every row same shape)                  ║
// ║  MongoDB = Filing cabinet (flexible, each document can differ)             ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

// ============================================================================
//  VISUAL: MongoDB Document Model
// ============================================================================
//
//   DATABASE: "myApp"
//   ┌──────────────────────────────────────────────────────────┐
//   │                                                          │
//   │  COLLECTION: "users"         COLLECTION: "orders"        │
//   │  ┌─────────────────────┐     ┌─────────────────────┐     │
//   │  │ DOCUMENT 1          │     │ DOCUMENT 1          │     │
//   │  │ {                   │     │ {                   │     │
//   │  │   _id: ObjectId()   │     │   _id: ObjectId()   │     │
//   │  │   name: "Alice"     │     │   userId: "..."     │     │
//   │  │   age: 30           │     │   items: [...]      │     │
//   │  │   hobbies: [...]    │     │   total: 99.99      │     │
//   │  │ }                   │     │ }                   │     │
//   │  ├─────────────────────┤     ├─────────────────────┤     │
//   │  │ DOCUMENT 2          │     │ DOCUMENT 2          │     │
//   │  │ {                   │     │ {                   │     │
//   │  │   _id: ObjectId()   │     │   _id: ObjectId()   │     │
//   │  │   name: "Bob"       │     │   userId: "..."     │     │
//   │  │   age: 25           │     │   items: [...]      │     │
//   │  │   address: {...}    │  <-- Bob has address,      │     │
//   │  │ }                        Alice doesn't!         │     │
//   │  └─────────────────────┘     └─────────────────────┘     │
//   └──────────────────────────────────────────────────────────┘
//
//  KEY TERMS:
//    Database    -> Database
//    Table       -> Collection
//    Row         -> Document (JSON/BSON)
//    Column      -> Field
//    Primary Key -> _id (auto-generated ObjectId)

// ============================================================================
//  1. WHAT IS BSON? (Binary JSON)
// ============================================================================

console.log(`\n${'='.repeat(60)}`);
console.log(`  1. BSON - Binary JSON`);
console.log(`${'='.repeat(60)}`);

// MongoDB stores data as BSON, not plain JSON
// BSON adds types that JSON doesn't have:

const bsonVsJson = {
  json: {
    supportsTypes: ['String', 'Number', 'Boolean', 'Array', 'Object', 'null'],
    maxSize: 'No limit (but slow for large)',
    binary: false
  },
  bson: {
    supportsTypes: [
      'String', 'Number (int32, int64, double, decimal128)',
      'Boolean', 'Array', 'Object', 'null',
      'Date', 'ObjectId', 'Binary', 'Regex', 'Timestamp'
    ],
    maxSize: '16 MB per document',
    binary: true
  }
};

console.log('JSON types:', bsonVsJson.json.supportsTypes.length);
console.log('BSON types:', bsonVsJson.bson.supportsTypes.length, '(richer!)');
console.log('Max document size: 16 MB (BSON limit)');

// ============================================================================
//  2. ObjectId STRUCTURE (TRICKY INTERVIEW TOPIC!)
// ============================================================================

console.log(`\n${'='.repeat(60)}`);
console.log(`  2. ObjectId Structure`);
console.log(`${'='.repeat(60)}`);

//  ObjectId is a 12-byte (24 hex char) unique identifier
//
//   ┌──────────┬──────────┬────────┬──────────┐
//   │ 4 bytes  │ 5 bytes  │ 3 bytes│          │
//   │Timestamp │ Random   │Counter │          │
//   │(seconds) │ (machine │(incr)  │          │
//   │          │  +proc)  │        │          │
//   └──────────┴──────────┴────────┴──────────┘
//    e.g. "507f1f77bcf86cd799439011"

const simulateObjectId = () => {
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
  const random = Array.from({ length: 10 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
  const counter = Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0');
  return timestamp + random + counter;
};

const id1 = simulateObjectId();
const id2 = simulateObjectId();
console.log(`ObjectId 1: ${id1} (${id1.length} hex chars = 12 bytes)`);
console.log(`ObjectId 2: ${id2}`);

// TRICKY: You can extract the timestamp from an ObjectId!
const extractTimestamp = (objectIdHex) => {
  const timestampHex = objectIdHex.substring(0, 8);
  return new Date(parseInt(timestampHex, 16) * 1000);
};

console.log(`Timestamp from id1: ${extractTimestamp(id1)}`);
console.log('(ObjectIds are roughly sortable by creation time!)');

// ============================================================================
//  3. CONNECTION STRING ANATOMY
// ============================================================================

console.log(`\n${'='.repeat(60)}`);
console.log(`  3. Connection String Anatomy`);
console.log(`${'='.repeat(60)}`);

//  VISUAL: MongoDB Connection String
//
//   mongodb+srv://username:password@cluster0.abc123.mongodb.net/mydb?retryWrites=true&w=majority
//   ├─────────┤ ├──────┤ ├──────┤ ├───────────────────────────┤├──┤├──────────────────────────┤
//   │Protocol │ │ User │ │ Pass │ │         Host/Cluster      ││DB││       Options            │
//
//   mongodb://     -> Standard protocol (single server)
//   mongodb+srv:// -> SRV protocol (auto-discovers replica set members via DNS)

const connectionExamples = {
  local: 'mongodb://localhost:27017/mydb',
  withAuth: 'mongodb://admin:secret@localhost:27017/mydb?authSource=admin',
  replicaSet: 'mongodb://host1:27017,host2:27017,host3:27017/mydb?replicaSet=rs0',
  atlas: 'mongodb+srv://user:pass@cluster0.abc123.mongodb.net/mydb?retryWrites=true'
};

Object.entries(connectionExamples).forEach(([name, uri]) => {
  console.log(`  ${name.padEnd(12)}: ${uri}`);
});

// ============================================================================
//  4. CRUD OPERATIONS (Simulated)
// ============================================================================

console.log(`\n${'='.repeat(60)}`);
console.log(`  4. CRUD Operations (Simulated)`);
console.log(`${'='.repeat(60)}`);

// Simulating a MongoDB collection in pure JS
class SimulatedCollection {
  constructor(name) {
    this.name = name;
    this.documents = [];
    this.counter = 0;
  }

  _generateId() {
    this.counter++;
    return `ObjectId_${this.counter.toString().padStart(3, '0')}`;
  }

  // CREATE
  insertOne(doc) {
    const newDoc = { _id: this._generateId(), ...doc };
    this.documents.push(newDoc);
    return { acknowledged: true, insertedId: newDoc._id };
  }

  insertMany(docs) {
    const ids = docs.map(doc => {
      const newDoc = { _id: this._generateId(), ...doc };
      this.documents.push(newDoc);
      return newDoc._id;
    });
    return { acknowledged: true, insertedIds: ids };
  }

  // READ
  find(filter = {}) {
    return this.documents.filter(doc =>
      Object.entries(filter).every(([key, val]) => {
        if (typeof val === 'object' && val !== null) {
          // Support basic operators
          if ('$gt' in val) return doc[key] > val.$gt;
          if ('$gte' in val) return doc[key] >= val.$gte;
          if ('$lt' in val) return doc[key] < val.$lt;
          if ('$lte' in val) return doc[key] <= val.$lte;
          if ('$ne' in val) return doc[key] !== val.$ne;
          if ('$in' in val) return val.$in.includes(doc[key]);
          if ('$regex' in val) return new RegExp(val.$regex).test(doc[key]);
        }
        return doc[key] === val;
      })
    );
  }

  findOne(filter = {}) {
    return this.find(filter)[0] || null;
  }

  // UPDATE
  updateOne(filter, update) {
    const doc = this.findOne(filter);
    if (!doc) return { matchedCount: 0, modifiedCount: 0 };
    if (update.$set) Object.assign(doc, update.$set);
    if (update.$inc) {
      Object.entries(update.$inc).forEach(([k, v]) => {
        doc[k] = (doc[k] || 0) + v;
      });
    }
    if (update.$push) {
      Object.entries(update.$push).forEach(([k, v]) => {
        if (!Array.isArray(doc[k])) doc[k] = [];
        doc[k].push(v);
      });
    }
    if (update.$unset) {
      Object.entries(update.$unset).forEach(([k]) => delete doc[k]);
    }
    return { matchedCount: 1, modifiedCount: 1 };
  }

  updateMany(filter, update) {
    const docs = this.find(filter);
    docs.forEach(doc => {
      if (update.$set) Object.assign(doc, update.$set);
      if (update.$inc) {
        Object.entries(update.$inc).forEach(([k, v]) => {
          doc[k] = (doc[k] || 0) + v;
        });
      }
    });
    return { matchedCount: docs.length, modifiedCount: docs.length };
  }

  // DELETE
  deleteOne(filter) {
    const idx = this.documents.findIndex(doc =>
      Object.entries(filter).every(([k, v]) => doc[k] === v)
    );
    if (idx === -1) return { deletedCount: 0 };
    this.documents.splice(idx, 1);
    return { deletedCount: 1 };
  }

  deleteMany(filter) {
    const before = this.documents.length;
    this.documents = this.documents.filter(doc =>
      !Object.entries(filter).every(([k, v]) => doc[k] === v)
    );
    return { deletedCount: before - this.documents.length };
  }

  countDocuments(filter = {}) {
    return this.find(filter).length;
  }
}

const users = new SimulatedCollection('users');

// INSERT
console.log('\n--- INSERT ---');
const r1 = users.insertOne({ name: 'Alice', age: 30, city: 'NYC' });
console.log('insertOne:', r1);

const r2 = users.insertMany([
  { name: 'Bob', age: 25, city: 'LA' },
  { name: 'Charlie', age: 35, city: 'NYC' },
  { name: 'Diana', age: 28, city: 'Chicago' },
  { name: 'Eve', age: 22, city: 'LA' }
]);
console.log('insertMany:', r2);

// FIND
console.log('\n--- FIND ---');
console.log('All NYC users:', users.find({ city: 'NYC' }).map(u => u.name));
console.log('Age > 25:', users.find({ age: { $gt: 25 } }).map(u => `${u.name}(${u.age})`));
console.log('City in [LA, Chicago]:', users.find({ city: { $in: ['LA', 'Chicago'] } }).map(u => u.name));

// UPDATE
console.log('\n--- UPDATE ---');
const r3 = users.updateOne({ name: 'Alice' }, { $set: { age: 31 }, $push: { hobbies: 'coding' } });
console.log('updateOne result:', r3);
console.log('Alice after update:', users.findOne({ name: 'Alice' }));

const r4 = users.updateMany({ city: 'LA' }, { $inc: { age: 1 } });
console.log('updateMany (LA +1 age):', r4);

// DELETE
console.log('\n--- DELETE ---');
const r5 = users.deleteOne({ name: 'Eve' });
console.log('deleteOne Eve:', r5);
console.log('Remaining count:', users.countDocuments());

// ============================================================================
//  5. QUERY OPERATORS CHEAT SHEET
// ============================================================================

console.log(`\n${'='.repeat(60)}`);
console.log(`  5. Query Operators Cheat Sheet`);
console.log(`${'='.repeat(60)}`);

const operators = `
  COMPARISON          LOGICAL             ELEMENT
  ──────────          ───────             ───────
  $eq   (equals)     $and                $exists
  $ne   (not equal)  $or                 $type
  $gt   (greater)    $not
  $gte  (>=)         $nor                ARRAY
  $lt   (less)                           ─────
  $lte  (<=)         UPDATE              $all
  $in   (in array)   ──────              $elemMatch
  $nin  (not in)     $set                $size
                     $unset
                     $inc                TEXT
                     $push               ────
                     $pull               $text
                     $addToSet           $regex
                     $rename
`;
console.log(operators);

// ============================================================================
//  6. INDEXES (Performance Critical!)
// ============================================================================

console.log(`\n${'='.repeat(60)}`);
console.log(`  6. Indexes`);
console.log(`${'='.repeat(60)}`);

//  WITHOUT INDEX:              WITH INDEX:
//  ┌─────────────────┐         ┌─────────────────┐
//  │ Scan ALL docs   │         │ B-Tree Lookup    │
//  │ O(n) - SLOW!    │         │ O(log n) - FAST! │
//  │                 │         │                  │
//  │ Doc 1 -> check  │         │     [M]          │
//  │ Doc 2 -> check  │         │    /   \         │
//  │ Doc 3 -> check  │         │  [D]   [T]       │
//  │ ...             │         │  / \   / \       │
//  │ Doc N -> check  │         │[A][G][P] [Z]     │
//  └─────────────────┘         └─────────────────┘

const indexTypes = [
  { type: 'Single Field',    example: '{ email: 1 }',            use: 'Query on one field' },
  { type: 'Compound',        example: '{ city: 1, age: -1 }',    use: 'Query on multiple fields' },
  { type: 'Text',            example: '{ content: "text" }',     use: 'Full-text search' },
  { type: 'Geospatial',      example: '{ location: "2dsphere" }', use: 'Location queries' },
  { type: 'Unique',          example: '{ email: 1 }, unique: true', use: 'Prevent duplicates' },
  { type: 'TTL',             example: '{ createdAt: 1 }, expireAfterSeconds: 3600', use: 'Auto-delete old docs' },
  { type: 'Partial',         example: '{ age: 1 }, partialFilterExpression: { age: { $gt: 18 } }', use: 'Index subset of docs' },
];

console.log('Index Types:');
indexTypes.forEach(({ type, example, use }) => {
  console.log(`  ${type.padEnd(16)} | ${example.padEnd(50)} | ${use}`);
});

// TRICKY: Index direction matters for compound indexes!
console.log('\n  GOTCHA: { city: 1, age: -1 }');
console.log('  1 = ascending, -1 = descending');
console.log('  Supports: sort({ city: 1, age: -1 }) OR sort({ city: -1, age: 1 })');
console.log('  Does NOT support: sort({ city: 1, age: 1 }) efficiently!');

// ============================================================================
//  7. AGGREGATION PIPELINE
// ============================================================================

console.log(`\n${'='.repeat(60)}`);
console.log(`  7. Aggregation Pipeline`);
console.log(`${'='.repeat(60)}`);

//  VISUAL: Pipeline Stages
//
//   Documents -> $match -> $group -> $sort -> $project -> Results
//                  │         │         │          │
//                Filter   Group by   Sort     Select
//                docs     + calc     results  fields

// Simulated aggregation
class AggregationPipeline {
  constructor(documents) {
    this.documents = [...documents];
  }

  $match(filter) {
    this.documents = this.documents.filter(doc =>
      Object.entries(filter).every(([k, v]) => {
        if (typeof v === 'object' && v.$gte !== undefined) return doc[k] >= v.$gte;
        return doc[k] === v;
      })
    );
    return this;
  }

  $group(spec) {
    const groups = new Map();
    this.documents.forEach(doc => {
      const key = typeof spec._id === 'string' && spec._id.startsWith('$')
        ? doc[spec._id.slice(1)]
        : spec._id;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(doc);
    });

    this.documents = [...groups.entries()].map(([key, docs]) => {
      const result = { _id: key };
      Object.entries(spec).forEach(([field, op]) => {
        if (field === '_id') return;
        if (op.$sum === 1) result[field] = docs.length;
        else if (typeof op.$sum === 'string' && op.$sum.startsWith('$')) {
          result[field] = docs.reduce((s, d) => s + (d[op.$sum.slice(1)] || 0), 0);
        }
        else if (typeof op.$avg === 'string' && op.$avg.startsWith('$')) {
          const vals = docs.map(d => d[op.$avg.slice(1)] || 0);
          result[field] = vals.reduce((a, b) => a + b, 0) / vals.length;
        }
      });
      return result;
    });
    return this;
  }

  $sort(spec) {
    const [field, dir] = Object.entries(spec)[0];
    this.documents.sort((a, b) => (a[field] > b[field] ? dir : -dir));
    return this;
  }

  $project(spec) {
    this.documents = this.documents.map(doc => {
      const result = {};
      Object.entries(spec).forEach(([k, v]) => {
        if (v === 1) result[k] = doc[k];
        else if (v === 0) return;
      });
      return result;
    });
    return this;
  }

  $limit(n) {
    this.documents = this.documents.slice(0, n);
    return this;
  }

  result() {
    return this.documents;
  }
}

// Sample data for aggregation
const orders = [
  { customer: 'Alice', product: 'Laptop', amount: 1200, city: 'NYC' },
  { customer: 'Bob', product: 'Phone', amount: 800, city: 'LA' },
  { customer: 'Alice', product: 'Tablet', amount: 500, city: 'NYC' },
  { customer: 'Charlie', product: 'Laptop', amount: 1200, city: 'NYC' },
  { customer: 'Bob', product: 'Laptop', amount: 1200, city: 'LA' },
  { customer: 'Diana', product: 'Phone', amount: 800, city: 'Chicago' },
];

console.log('\nAggregation: Total spending per city, sorted descending');
const pipeline = new AggregationPipeline(orders);
const result = pipeline
  .$group({
    _id: '$city',
    totalSpent: { $sum: '$amount' },
    orderCount: { $sum: 1 },
    avgOrder: { $avg: '$amount' }
  })
  .$sort({ totalSpent: -1 })
  .result();

result.forEach(r => {
  console.log(`  ${r._id}: $${r.totalSpent} (${r.orderCount} orders, avg: $${r.avgOrder.toFixed(0)})`);
});

// ============================================================================
//  8. SCHEMA DESIGN: EMBEDDED vs REFERENCED
// ============================================================================

console.log(`\n${'='.repeat(60)}`);
console.log(`  8. Embedded vs Referenced Documents`);
console.log(`${'='.repeat(60)}`);

//  EMBEDDED (Denormalized)              REFERENCED (Normalized)
//  ┌─────────────────────┐              ┌──────────────────┐
//  │ {                   │              │ {                │
//  │   _id: 1,           │              │   _id: 1,        │
//  │   name: "Alice",    │              │   name: "Alice", │
//  │   address: {     <──┼── embedded   │   addressId: 99  │──┐
//  │     street: "...",  │              │ }                │  │
//  │     city: "NYC"     │              └──────────────────┘  │
//  │   }                 │                                     │
//  │ }                   │              ┌──────────────────┐  │
//  └─────────────────────┘              │ {                │  │
//                                       │   _id: 99,    <──┼──┘
//  USE WHEN:                            │   street: "...", │
//  - Data read together                 │   city: "NYC"   │
//  - 1:1 or 1:few                       │ }                │
//  - Data doesn't change often          └──────────────────┘
//                                       USE WHEN:
//                                       - Data changes often
//                                       - Many-to-many
//                                       - Document would exceed 16MB

const embeddedExample = {
  _id: 'user_001',
  name: 'Alice',
  address: {              // <-- Embedded: read in one query
    street: '123 Main St',
    city: 'NYC',
    zip: '10001'
  },
  orders: [               // <-- Embedded array (careful: can grow!)
    { product: 'Laptop', amount: 1200, date: '2024-01-15' },
    { product: 'Mouse', amount: 25, date: '2024-01-20' }
  ]
};

const referencedExample = {
  user: { _id: 'user_001', name: 'Alice', addressId: 'addr_001' },
  address: { _id: 'addr_001', street: '123 Main St', city: 'NYC' },
  orders: [
    { _id: 'ord_001', userId: 'user_001', product: 'Laptop', amount: 1200 },
    { _id: 'ord_002', userId: 'user_001', product: 'Mouse', amount: 25 }
  ]
};

console.log('Embedded (1 query):', JSON.stringify(embeddedExample, null, 2).split('\n').length, 'lines');
console.log('Referenced (N+1 queries!):', Object.keys(referencedExample).length, 'separate collections');

// ============================================================================
//  9. N+1 QUERY PROBLEM (TRICKY!)
// ============================================================================

console.log(`\n${'='.repeat(60)}`);
console.log(`  9. N+1 Query Problem`);
console.log(`${'='.repeat(60)}`);

//  BAD: N+1 Pattern
//  ┌──────────────────────────────────┐
//  │ Query 1: Get all 100 users       │  <- 1 query
//  │ Query 2: Get orders for user 1   │  <- +1
//  │ Query 3: Get orders for user 2   │  <- +1
//  │ ...                              │
//  │ Query 101: Get orders for user 100│ <- +1
//  │                                  │
//  │ TOTAL: 101 queries!              │  = N+1 problem
//  └──────────────────────────────────┘
//
//  GOOD: Use $lookup (MongoDB JOIN) or embed
//  ┌──────────────────────────────────┐
//  │ Query 1: Aggregate with $lookup  │  <- 1 query!
//  │ (or use embedded documents)      │
//  └──────────────────────────────────┘

// Simulating N+1 problem
const simulateN1 = (userCount) => {
  let queryCount = 0;
  queryCount++; // 1: get all users
  for (let i = 0; i < userCount; i++) {
    queryCount++; // N: get each user's orders
  }
  return queryCount;
};

console.log(`100 users -> ${simulateN1(100)} queries (N+1 problem!)`);
console.log(`1000 users -> ${simulateN1(1000)} queries (DISASTER!)`);
console.log('\nFIX: Use $lookup (aggregation) or embed related data');

// $lookup is MongoDB's "JOIN"
console.log(`
  // $lookup example (MongoDB JOIN)
  db.users.aggregate([
    { $lookup: {
        from: "orders",
        localField: "_id",
        foreignField: "userId",
        as: "userOrders"
    }}
  ]);
  // Result: 1 query instead of N+1!
`);

// ============================================================================
//  10. CONNECTION POOLING (TRICKY!)
// ============================================================================

console.log(`\n${'='.repeat(60)}`);
console.log(`  10. Connection Pooling`);
console.log(`${'='.repeat(60)}`);

//  WITHOUT POOL:                    WITH POOL:
//  ┌─────────────────────┐          ┌─────────────────────┐
//  │ Request 1 -> Open   │          │ Request 1 ──┐       │
//  │ Request 2 -> Open   │          │ Request 2 ──┼─ Pool │
//  │ Request 3 -> Open   │          │ Request 3 ──┘  (5)  │
//  │ Each opens new conn │          │ Reuse connections!   │
//  │ EXPENSIVE!          │          │ Fast + efficient     │
//  └─────────────────────┘          └─────────────────────┘

console.log(`
  // MongoDB Node.js driver default pool size: 5 per host
  // You can configure it:

  const options = {
    maxPoolSize: 10,       // Max connections in pool
    minPoolSize: 2,        // Keep minimum connections warm
    maxIdleTimeMS: 30000,  // Close idle connections after 30s
    waitQueueTimeoutMS: 5000, // Timeout waiting for connection
    connectTimeoutMS: 10000   // Timeout establishing connection
  };

  // TRICKY: In serverless (Lambda), use maxPoolSize: 1
  // because each invocation may be a new process!
`);

// ============================================================================
//  11. REPLICA SETS
// ============================================================================

console.log(`\n${'='.repeat(60)}`);
console.log(`  11. Replica Sets`);
console.log(`${'='.repeat(60)}`);

//  ┌─────────────────────────────────────────────────┐
//  │              REPLICA SET                         │
//  │                                                 │
//  │  ┌──────────┐                                   │
//  │  │ PRIMARY  │ <── All writes go here            │
//  │  │ (Node 1) │                                   │
//  │  └────┬─────┘                                   │
//  │       │ replicates                              │
//  │  ┌────┴─────────────┐                           │
//  │  │                  │                           │
//  │  ▼                  ▼                           │
//  │  ┌──────────┐  ┌──────────┐                     │
//  │  │SECONDARY │  │SECONDARY │ <── Reads can go    │
//  │  │(Node 2)  │  │(Node 3)  │     here too        │
//  │  └──────────┘  └──────────┘                     │
//  │                                                 │
//  │  If PRIMARY fails -> automatic election!        │
//  │  A SECONDARY becomes the new PRIMARY            │
//  └─────────────────────────────────────────────────┘

console.log('Replica Set = group of MongoDB servers maintaining same data');
console.log('- PRIMARY: handles all writes');
console.log('- SECONDARY: copies of primary data, can handle reads');
console.log('- Automatic failover if primary goes down');
console.log('- Minimum 3 members recommended (for majority voting)');

console.log(`
  Read Preferences:
  - primary         : Always read from primary (default, strongest consistency)
  - primaryPreferred : Primary if available, else secondary
  - secondary       : Always read from secondary (may read stale data!)
  - secondaryPreferred : Secondary if available, else primary
  - nearest         : Lowest latency member
`);

// ============================================================================
//  12. COMMON MISTAKES & GOTCHAS
// ============================================================================

console.log(`\n${'='.repeat(60)}`);
console.log(`  12. Common Mistakes & Gotchas`);
console.log(`${'='.repeat(60)}`);

const gotchas = [
  {
    mistake: 'Not creating indexes',
    why: 'MongoDB does COLLECTION SCAN (checks every doc) without indexes',
    fix: 'Create indexes on fields you query/sort by'
  },
  {
    mistake: 'Unbounded array growth in embedded docs',
    why: 'Document max size is 16MB. Arrays can grow forever.',
    fix: 'Use references for unbounded arrays (e.g., comments on a post)'
  },
  {
    mistake: 'Using findAndModify for everything',
    why: 'Locks the document during operation',
    fix: 'Use updateOne with atomic operators ($set, $inc) when possible'
  },
  {
    mistake: 'Not handling connection errors',
    why: 'Network issues happen. Connections drop.',
    fix: 'Use try/catch, implement retry logic, listen to connection events'
  },
  {
    mistake: 'Storing large files in documents',
    why: '16MB limit. Bad performance.',
    fix: 'Use GridFS for files > 16MB, or external storage (S3)'
  },
  {
    mistake: 'Not using projection',
    why: 'Fetching entire documents when you need 2 fields',
    fix: 'db.users.find({}, { name: 1, email: 1 }) - fetch only needed fields'
  }
];

gotchas.forEach(({ mistake, why, fix }, i) => {
  console.log(`\n  ${i + 1}. MISTAKE: ${mistake}`);
  console.log(`     WHY BAD: ${why}`);
  console.log(`     FIX: ${fix}`);
});

// ============================================================================
//  13. REAL WORLD: Mongoose-style Schema Validation
// ============================================================================

console.log(`\n${'='.repeat(60)}`);
console.log(`  13. Schema Validation (Mongoose-style concept)`);
console.log(`${'='.repeat(60)}`);

// MongoDB is "schemaless" but Mongoose adds schemas in Node.js
// MongoDB itself also supports JSON Schema validation

const validateDocument = (schema, doc) => {
  const errors = [];
  Object.entries(schema).forEach(([field, rules]) => {
    const value = doc[field];
    if (rules.required && (value === undefined || value === null)) {
      errors.push(`${field} is required`);
      return;
    }
    if (value === undefined) return;
    if (rules.type && typeof value !== rules.type) {
      errors.push(`${field} must be type ${rules.type}, got ${typeof value}`);
    }
    if (rules.min !== undefined && value < rules.min) {
      errors.push(`${field} must be >= ${rules.min}`);
    }
    if (rules.max !== undefined && value > rules.max) {
      errors.push(`${field} must be <= ${rules.max}`);
    }
    if (rules.enum && !rules.enum.includes(value)) {
      errors.push(`${field} must be one of: ${rules.enum.join(', ')}`);
    }
    if (rules.match && !rules.match.test(value)) {
      errors.push(`${field} failed regex validation`);
    }
  });
  return errors.length ? { valid: false, errors } : { valid: true, errors: [] };
};

const userSchema = {
  name:  { type: 'string', required: true },
  email: { type: 'string', required: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  age:   { type: 'number', min: 0, max: 150 },
  role:  { type: 'string', enum: ['admin', 'user', 'moderator'] }
};

const testDocs = [
  { name: 'Alice', email: 'alice@test.com', age: 30, role: 'admin' },
  { name: 'Bob', email: 'not-an-email', age: 200, role: 'superadmin' },
  { email: 'no-name@test.com' },
];

testDocs.forEach((doc, i) => {
  const result = validateDocument(userSchema, doc);
  console.log(`\n  Doc ${i + 1}:`, JSON.stringify(doc));
  console.log(`  Valid: ${result.valid}${result.errors.length ? ', Errors: ' + result.errors.join('; ') : ''}`);
});

// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║  INTERVIEW ANSWER                                                          ║
// ║                                                                            ║
// ║  "MongoDB is a NoSQL document database that stores data as flexible        ║
// ║  BSON documents in collections. Unlike SQL databases, documents in the     ║
// ║  same collection can have different fields. Key concepts include:          ║
// ║                                                                            ║
// ║  - ObjectId: 12-byte unique ID with embedded timestamp                     ║
// ║  - Embedded vs Referenced: embed for 1:few read-together data,            ║
// ║    reference for many-to-many or frequently-changing data                  ║
// ║  - Indexes: critical for performance, B-tree based                        ║
// ║  - Aggregation Pipeline: chain of stages ($match, $group, $sort, etc.)    ║
// ║  - Replica Sets: provide high availability via automatic failover          ║
// ║  - Connection Pooling: reuse connections (default pool size: 5)            ║
// ║                                                                            ║
// ║  The N+1 problem occurs when fetching related data one-by-one instead     ║
// ║  of using $lookup or embedding. Schema design is the most important       ║
// ║  decision - model data based on how it will be queried, not how it        ║
// ║  relates logically."                                                       ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

// ============================================================================
//  OUTPUT:
// ============================================================================
//
//   1. BSON - Binary JSON
//   JSON types: 6 / BSON types: 11 (richer!)
//   Max document size: 16 MB
//
//   2. ObjectId Structure (24 hex chars)
//   3. Connection String anatomy examples
//   4. Full CRUD operations with simulated collection
//   5. Query operators cheat sheet
//   6. Index types table
//   7. Aggregation pipeline with spending-per-city results
//   8. Embedded vs Referenced comparison
//   9. N+1 problem: 100 users -> 101 queries!
//  10. Connection pooling config
//  11. Replica set architecture
//  12. 6 Common gotchas with fixes
//  13. Schema validation examples
// ============================================================================

// RUN: node docs/node/12-database/00-connecting-mongodb.js
