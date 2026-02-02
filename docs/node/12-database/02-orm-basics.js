// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║                           ORM BASICS                                       ║
// ║          Sequelize & Prisma - Talking to Databases in JavaScript           ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║  STORY TO REMEMBER: THE TRANSLATOR AT THE EMBASSY                         ║
// ║                                                                            ║
// ║  Imagine you're a JavaScript developer (English speaker) who needs to     ║
// ║  talk to a PostgreSQL database (French speaker). You COULD learn SQL      ║
// ║  (French) yourself, or you could hire a TRANSLATOR who speaks both.       ║
// ║                                                                            ║
// ║  The ORM is that translator:                                              ║
// ║    You say:  User.findAll({ where: { age: { gt: 25 } } })               ║
// ║    ORM says: SELECT * FROM users WHERE age > 25                           ║
// ║                                                                            ║
// ║  Sequelize = Traditional translator (you tell them what to say)           ║
// ║  Prisma    = Modern translator with a phrasebook (schema-first)           ║
// ║                                                                            ║
// ║  Both translate JS -> SQL, but they have different styles.                ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

// ============================================================================
//  VISUAL: ORM Layer Architecture
// ============================================================================
//
//   Your Code (JavaScript)
//   ┌──────────────────────────────────────────────┐
//   │  User.findAll({ where: { age: { gt: 25 }}}) │
//   └──────────────────────┬───────────────────────┘
//                          │
//                          ▼
//   ORM Layer (Sequelize / Prisma)
//   ┌──────────────────────────────────────────────┐
//   │  Translates JS objects --> SQL statements     │
//   │  Maps database rows  --> JS objects           │
//   │  Handles:                                     │
//   │    - Schema definition                        │
//   │    - Migrations                               │
//   │    - Relationships (1:1, 1:N, M:N)            │
//   │    - Validation                               │
//   │    - Connection pooling                       │
//   └──────────────────────┬───────────────────────┘
//                          │
//                          ▼
//   Database (PostgreSQL / MySQL / SQLite)
//   ┌──────────────────────────────────────────────┐
//   │  SELECT * FROM users WHERE age > 25           │
//   └──────────────────────────────────────────────┘
//
//   WITHOUT ORM:  Write raw SQL, manually map rows to objects
//   WITH ORM:     Write JS methods, ORM generates SQL + maps results

// ============================================================================
//  A: RAW SQL vs ORM - SIDE BY SIDE
// ============================================================================

console.log(`\n${'='.repeat(60)}`);
console.log(`  A: Raw SQL vs ORM Comparison`);
console.log(`${'='.repeat(60)}`);

const comparisons = [
  {
    operation: 'CREATE',
    rawSQL:    "INSERT INTO users (name, email) VALUES ('Alice', 'alice@test.com') RETURNING *",
    sequelize: "User.create({ name: 'Alice', email: 'alice@test.com' })",
    prisma:    "prisma.user.create({ data: { name: 'Alice', email: 'alice@test.com' } })"
  },
  {
    operation: 'READ ALL',
    rawSQL:    "SELECT * FROM users WHERE age > 25 ORDER BY name LIMIT 10",
    sequelize: "User.findAll({ where: { age: { [Op.gt]: 25 } }, order: [['name']], limit: 10 })",
    prisma:    "prisma.user.findMany({ where: { age: { gt: 25 } }, orderBy: { name: 'asc' }, take: 10 })"
  },
  {
    operation: 'READ ONE',
    rawSQL:    "SELECT * FROM users WHERE id = 1",
    sequelize: "User.findByPk(1)",
    prisma:    "prisma.user.findUnique({ where: { id: 1 } })"
  },
  {
    operation: 'UPDATE',
    rawSQL:    "UPDATE users SET name = 'Bob' WHERE id = 1 RETURNING *",
    sequelize: "User.update({ name: 'Bob' }, { where: { id: 1 } })",
    prisma:    "prisma.user.update({ where: { id: 1 }, data: { name: 'Bob' } })"
  },
  {
    operation: 'DELETE',
    rawSQL:    "DELETE FROM users WHERE id = 1",
    sequelize: "User.destroy({ where: { id: 1 } })",
    prisma:    "prisma.user.delete({ where: { id: 1 } })"
  }
];

comparisons.forEach(({ operation, rawSQL, sequelize, prisma }) => {
  console.log(`\n  ${operation}:`);
  console.log(`    Raw SQL:    ${rawSQL}`);
  console.log(`    Sequelize:  ${sequelize}`);
  console.log(`    Prisma:     ${prisma}`);
});

// ============================================================================
//  B: SIMULATED SEQUELIZE PATTERNS
// ============================================================================

console.log(`\n${'='.repeat(60)}`);
console.log(`  B: Sequelize Patterns (Simulated)`);
console.log(`${'='.repeat(60)}`);

// Simulating Sequelize Model
class SimulatedModel {
  constructor(modelName, schema) {
    this.modelName = modelName;
    this.schema = schema;
    this.tableName = modelName.toLowerCase() + 's';
    this._data = [];
    this._idCounter = 0;
  }

  // Define associations
  hasMany(otherModel, options) {
    console.log(`    [Association] ${this.modelName} hasMany ${otherModel.modelName} (FK: ${options.foreignKey})`);
  }

  belongsTo(otherModel, options) {
    console.log(`    [Association] ${this.modelName} belongsTo ${otherModel.modelName} (FK: ${options.foreignKey})`);
  }

  // CRUD operations
  async create(data) {
    this._idCounter++;
    const record = {
      id: this._idCounter,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Validate
    for (const [field, rules] of Object.entries(this.schema)) {
      if (rules.allowNull === false && data[field] === undefined) {
        throw new Error(`Validation error: ${field} cannot be null`);
      }
      if (rules.unique && this._data.some(d => d[field] === data[field])) {
        throw new Error(`Validation error: ${field} must be unique`);
      }
    }

    this._data.push(record);
    const sql = `INSERT INTO ${this.tableName} (${Object.keys(data).join(', ')}) VALUES (${Object.values(data).map(v => `'${v}'`).join(', ')})`;
    console.log(`    [SQL] ${sql}`);
    return { ...record, toJSON: () => record };
  }

  async findAll(options = {}) {
    let results = [...this._data];
    let sql = `SELECT * FROM ${this.tableName}`;

    if (options.where) {
      const conditions = Object.entries(options.where).map(([k, v]) => {
        if (typeof v === 'object') {
          const [op, val] = Object.entries(v)[0];
          return `${k} ${op === 'gt' ? '>' : op === 'lt' ? '<' : '='} ${val}`;
        }
        return `${k} = '${v}'`;
      });
      sql += ` WHERE ${conditions.join(' AND ')}`;
      results = results.filter(r => {
        return Object.entries(options.where).every(([k, v]) => {
          if (typeof v === 'object') {
            const [op, val] = Object.entries(v)[0];
            if (op === 'gt') return r[k] > val;
            if (op === 'lt') return r[k] < val;
          }
          return r[k] === v;
        });
      });
    }

    if (options.order) {
      const [field, dir] = options.order[0];
      sql += ` ORDER BY ${field} ${dir}`;
    }

    if (options.limit) {
      sql += ` LIMIT ${options.limit}`;
      results = results.slice(0, options.limit);
    }

    console.log(`    [SQL] ${sql}`);
    return results;
  }

  async findByPk(id) {
    console.log(`    [SQL] SELECT * FROM ${this.tableName} WHERE id = ${id}`);
    return this._data.find(r => r.id === id) || null;
  }

  async update(data, options) {
    const setClauses = Object.entries(data).map(([k, v]) => `${k} = '${v}'`).join(', ');
    const whereClauses = Object.entries(options.where).map(([k, v]) => `${k} = '${v}'`).join(' AND ');
    console.log(`    [SQL] UPDATE ${this.tableName} SET ${setClauses} WHERE ${whereClauses}`);

    let count = 0;
    this._data.forEach(r => {
      if (Object.entries(options.where).every(([k, v]) => r[k] === v)) {
        Object.assign(r, data, { updatedAt: new Date().toISOString() });
        count++;
      }
    });
    return [count];
  }

  async destroy(options) {
    const whereClauses = Object.entries(options.where).map(([k, v]) => `${k} = '${v}'`).join(' AND ');
    console.log(`    [SQL] DELETE FROM ${this.tableName} WHERE ${whereClauses}`);

    const before = this._data.length;
    this._data = this._data.filter(r =>
      !Object.entries(options.where).every(([k, v]) => r[k] === v)
    );
    return before - this._data.length;
  }

  async count(options = {}) {
    console.log(`    [SQL] SELECT COUNT(*) FROM ${this.tableName}`);
    return this._data.length;
  }
}

// Define models (like Sequelize model definition)
console.log('\n--- Model Definition ---');
console.log(`
  // Real Sequelize syntax:
  const User = sequelize.define('User', {
    name:  { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false,
             validate: { isEmail: true } },
    age:   { type: DataTypes.INTEGER, validate: { min: 0, max: 150 } },
    role:  { type: DataTypes.ENUM('admin', 'user'), defaultValue: 'user' }
  }, {
    timestamps: true,    // adds createdAt, updatedAt
    tableName: 'users',  // explicit table name
    paranoid: true       // soft delete (adds deletedAt)
  });
`);

const User = new SimulatedModel('User', {
  name:  { allowNull: false },
  email: { allowNull: false, unique: true },
  age:   {},
  role:  { defaultValue: 'user' }
});

const Post = new SimulatedModel('Post', {
  title:   { allowNull: false },
  content: {},
  userId:  { allowNull: false }
});

// Associations
console.log('\n--- Associations ---');
User.hasMany(Post, { foreignKey: 'userId' });
Post.belongsTo(User, { foreignKey: 'userId' });

// CRUD Demo
console.log('\n--- CRUD Operations ---');
const sequelizeDemo = async () => {
  // Create
  const alice = await User.create({ name: 'Alice', email: 'alice@test.com', age: 30 });
  const bob = await User.create({ name: 'Bob', email: 'bob@test.com', age: 25 });
  await User.create({ name: 'Charlie', email: 'charlie@test.com', age: 35 });

  // Read
  console.log('\n  Find all users age > 25:');
  const olderUsers = await User.findAll({ where: { age: { gt: 25 } } });
  console.log(`    Found: ${olderUsers.map(u => u.name).join(', ')}`);

  // Find by PK
  console.log('\n  Find by primary key:');
  const user = await User.findByPk(1);
  console.log(`    Found: ${user ? user.name : 'not found'}`);

  // Update
  console.log('\n  Update Alice:');
  await User.update({ name: 'Alice Smith' }, { where: { id: 1 } });

  // Delete
  console.log('\n  Delete Bob:');
  await User.destroy({ where: { id: 2 } });

  // Count
  console.log('\n  Count remaining:');
  const count = await User.count();
  console.log(`    Count: ${count}`);
};

sequelizeDemo();

// ============================================================================
//  C: SIMULATED PRISMA PATTERNS
// ============================================================================

console.log(`\n${'='.repeat(60)}`);
console.log(`  C: Prisma Patterns (Schema-First)`);
console.log(`${'='.repeat(60)}`);

//  VISUAL: Prisma Workflow
//
//   1. Define Schema           2. Generate Client        3. Use Client
//   ┌────────────────────┐     ┌──────────────────┐      ┌──────────────────┐
//   │ schema.prisma      │     │ npx prisma       │      │ const { Prisma   │
//   │                    │ --> │ generate          │ -->  │ Client } =       │
//   │ model User {       │     │                  │      │ require(...)     │
//   │   id    Int @id    │     │ Creates typed    │      │                  │
//   │   name  String     │     │ client with      │      │ prisma.user      │
//   │   posts Post[]     │     │ autocomplete!    │      │ .findMany(...)   │
//   │ }                  │     └──────────────────┘      └──────────────────┘
//   └────────────────────┘

console.log(`
  // schema.prisma (Prisma's schema file)
  datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
  }

  generator client {
    provider = "prisma-client-js"
  }

  model User {
    id        Int      @id @default(autoincrement())
    name      String
    email     String   @unique
    age       Int?
    role      Role     @default(USER)
    posts     Post[]
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
  }

  model Post {
    id        Int      @id @default(autoincrement())
    title     String
    content   String?
    published Boolean  @default(false)
    author    User     @relation(fields: [authorId], references: [id])
    authorId  Int
  }

  enum Role {
    USER
    ADMIN
  }
`);

// Simulated Prisma Client
class SimulatedPrismaModel {
  constructor(name) {
    this.name = name;
    this._data = [];
    this._idCounter = 0;
  }

  async create({ data }) {
    this._idCounter++;
    const record = { id: this._idCounter, ...data, createdAt: new Date().toISOString() };
    this._data.push(record);
    console.log(`    [Prisma] prisma.${this.name}.create({ data: ${JSON.stringify(data)} })`);
    return record;
  }

  async findMany({ where = {}, orderBy, take, include } = {}) {
    let query = `prisma.${this.name}.findMany({`;
    if (Object.keys(where).length) query += ` where: ${JSON.stringify(where)},`;
    if (orderBy) query += ` orderBy: ${JSON.stringify(orderBy)},`;
    if (take) query += ` take: ${take},`;
    if (include) query += ` include: ${JSON.stringify(include)},`;
    query += ' })';
    console.log(`    [Prisma] ${query}`);

    let results = [...this._data];
    for (const [key, val] of Object.entries(where)) {
      if (typeof val === 'object') {
        const [op, opVal] = Object.entries(val)[0];
        results = results.filter(r => {
          if (op === 'gt') return r[key] > opVal;
          if (op === 'lt') return r[key] < opVal;
          if (op === 'contains') return r[key].includes(opVal);
          return true;
        });
      } else {
        results = results.filter(r => r[key] === val);
      }
    }
    if (take) results = results.slice(0, take);
    return results;
  }

  async findUnique({ where }) {
    console.log(`    [Prisma] prisma.${this.name}.findUnique({ where: ${JSON.stringify(where)} })`);
    return this._data.find(r => {
      return Object.entries(where).every(([k, v]) => r[k] === v);
    }) || null;
  }

  async update({ where, data }) {
    console.log(`    [Prisma] prisma.${this.name}.update({ where: ${JSON.stringify(where)}, data: ${JSON.stringify(data)} })`);
    const record = this._data.find(r => Object.entries(where).every(([k, v]) => r[k] === v));
    if (!record) throw new Error(`Record not found`);
    Object.assign(record, data);
    return record;
  }

  async delete({ where }) {
    console.log(`    [Prisma] prisma.${this.name}.delete({ where: ${JSON.stringify(where)} })`);
    const idx = this._data.findIndex(r => Object.entries(where).every(([k, v]) => r[k] === v));
    if (idx === -1) throw new Error('Record not found');
    return this._data.splice(idx, 1)[0];
  }

  async upsert({ where, update, create }) {
    console.log(`    [Prisma] prisma.${this.name}.upsert({ where, update, create })`);
    const existing = this._data.find(r => Object.entries(where).every(([k, v]) => r[k] === v));
    if (existing) {
      Object.assign(existing, update);
      return existing;
    }
    return this.create({ data: create });
  }
}

const prismaDemo = async () => {
  const prismaUser = new SimulatedPrismaModel('user');

  console.log('\n--- Prisma CRUD ---');

  // Create
  await prismaUser.create({ data: { name: 'Alice', email: 'alice@test.com', age: 30 } });
  await prismaUser.create({ data: { name: 'Bob', email: 'bob@test.com', age: 25 } });
  await prismaUser.create({ data: { name: 'Charlie', email: 'charlie@test.com', age: 35 } });

  // Read
  console.log('\n  Find users age > 25:');
  const users = await prismaUser.findMany({ where: { age: { gt: 25 } } });
  console.log(`    Results: ${users.map(u => u.name).join(', ')}`);

  // Find unique
  console.log('\n  Find unique by email:');
  const alice = await prismaUser.findUnique({ where: { email: 'alice@test.com' } });
  console.log(`    Found: ${alice ? alice.name : 'not found'}`);

  // Update
  console.log('\n  Update Alice:');
  await prismaUser.update({ where: { id: 1 }, data: { name: 'Alice Smith' } });

  // Upsert
  console.log('\n  Upsert (create or update):');
  await prismaUser.upsert({
    where: { email: 'diana@test.com' },
    update: { name: 'Diana Updated' },
    create: { name: 'Diana', email: 'diana@test.com', age: 28 }
  });
};

prismaDemo();

// ============================================================================
//  D: RELATIONSHIPS (1:1, 1:N, M:N)
// ============================================================================

console.log(`\n${'='.repeat(60)}`);
console.log(`  D: Relationships (1:1, 1:N, M:N)`);
console.log(`${'='.repeat(60)}`);

//  VISUAL: Relationship Types
//
//   1:1 (One-to-One)              1:N (One-to-Many)
//   ┌──────┐     ┌──────────┐     ┌──────┐     ┌──────────┐
//   │ User │────►│ Profile  │     │ User │────►│ Post 1   │
//   └──────┘     └──────────┘     │      │────►│ Post 2   │
//   One user has one profile      │      │────►│ Post 3   │
//                                 └──────┘     └──────────┘
//                                 One user has many posts
//
//   M:N (Many-to-Many) - needs JOIN TABLE
//   ┌──────┐     ┌────────────┐     ┌──────────┐
//   │User 1│────►│user_id: 1  │◄────│ Tag: JS  │
//   │      │────►│tag_id:  2  │     │          │
//   │User 2│────►│user_id: 2  │◄────│ Tag: Node│
//   │      │────►│tag_id:  1  │     │          │
//   └──────┘     └────────────┘     └──────────┘
//                 (join table)

const relationshipPatterns = {
  sequelize: `
  // Sequelize Relationships:
  // 1:1
  User.hasOne(Profile, { foreignKey: 'userId' });
  Profile.belongsTo(User, { foreignKey: 'userId' });

  // 1:N
  User.hasMany(Post, { foreignKey: 'authorId' });
  Post.belongsTo(User, { foreignKey: 'authorId' });

  // M:N
  User.belongsToMany(Tag, { through: 'UserTags' });
  Tag.belongsToMany(User, { through: 'UserTags' });

  // Eager loading (include related data):
  const user = await User.findByPk(1, {
    include: [
      { model: Profile },
      { model: Post, where: { published: true } },
      { model: Tag }
    ]
  });
  // Generates: SELECT ... FROM users
  //            LEFT JOIN profiles ON ...
  //            LEFT JOIN posts ON ... WHERE published = true
  //            LEFT JOIN user_tags ON ... LEFT JOIN tags ON ...
  `,
  prisma: `
  // Prisma Relationships (in schema.prisma):
  model User {
    id      Int      @id @default(autoincrement())
    profile Profile?               // 1:1
    posts   Post[]                 // 1:N
    tags    Tag[]    @relation(...)  // M:N (implicit join table)
  }

  // Eager loading:
  const user = await prisma.user.findUnique({
    where: { id: 1 },
    include: {
      profile: true,
      posts: { where: { published: true } },
      tags: true
    }
  });
  `
};

console.log('  Sequelize:', relationshipPatterns.sequelize);
console.log('  Prisma:', relationshipPatterns.prisma);

// ============================================================================
//  E: SEQUELIZE vs PRISMA COMPARISON
// ============================================================================

console.log(`${'='.repeat(60)}`);
console.log(`  E: Sequelize vs Prisma Comparison`);
console.log(`${'='.repeat(60)}`);

const ormComparison = [
  ['Feature',         'Sequelize',                   'Prisma'],
  ['Approach',        'Code-first (define in JS)',    'Schema-first (schema.prisma)'],
  ['TypeScript',      'Partial support',              'Full type safety (generated)'],
  ['Query Style',     'Method chaining / objects',    'Plain objects'],
  ['Raw SQL',         'sequelize.query(sql)',         'prisma.$queryRaw(sql)'],
  ['Migrations',      'sequelize-cli (JS files)',     'prisma migrate (SQL files)'],
  ['Databases',       'PostgreSQL, MySQL, SQLite, MSSQL', 'PostgreSQL, MySQL, SQLite, MongoDB'],
  ['Relations',       'hasOne, hasMany, belongsTo...','@relation in schema'],
  ['Learning Curve',  'Moderate (many options)',      'Lower (typed, autocomplete)'],
  ['Maturity',        'Since 2011 (battle-tested)',   'Since 2019 (modern)'],
  ['N+1 Prevention',  'include: [] (eager load)',     'include: {} (eager load)'],
];

ormComparison.forEach(([feature, seq, prisma], i) => {
  if (i === 0) {
    console.log(`  ${feature.padEnd(18)} | ${seq.padEnd(32)} | ${prisma}`);
    console.log(`  ${'─'.repeat(18)} | ${'─'.repeat(32)} | ${'─'.repeat(36)}`);
  } else {
    console.log(`  ${feature.padEnd(18)} | ${seq.padEnd(32)} | ${prisma}`);
  }
});

// ============================================================================
//  F: COMMON ORM GOTCHAS
// ============================================================================

console.log(`\n${'='.repeat(60)}`);
console.log(`  F: Common ORM Gotchas`);
console.log(`${'='.repeat(60)}`);

const gotchas = [
  {
    mistake: 'N+1 Query Problem (lazy loading)',
    example: 'users.forEach(u => u.getPosts()) // 1 query for users + N queries for posts',
    fix:     'Use eager loading: User.findAll({ include: Post }) // 1-2 queries total'
  },
  {
    mistake: 'SELECT * by default',
    example: 'User.findAll() fetches ALL columns even if you need 2',
    fix:     'Use attributes/select: User.findAll({ attributes: ["id", "name"] })'
  },
  {
    mistake: 'No indexes defined in ORM',
    example: 'ORM creates table without indexes on frequently queried columns',
    fix:     'Add indexes in model: { indexes: [{ fields: ["email"] }] } or @index in Prisma'
  },
  {
    mistake: 'Trusting ORM for complex queries',
    example: 'Complex aggregations generate horrible SQL',
    fix:     'Use raw SQL for complex queries: sequelize.query() or prisma.$queryRaw()'
  },
  {
    mistake: 'Not understanding generated SQL',
    example: 'ORM generates LEFT JOIN when you need INNER JOIN',
    fix:     'Enable query logging: { logging: console.log } / prisma.$on("query")'
  },
  {
    mistake: 'Mixing sync and async patterns',
    example: 'Forgetting await on ORM methods (they all return Promises)',
    fix:     'Always await: const user = await User.findByPk(1)'
  }
];

gotchas.forEach(({ mistake, example, fix }, i) => {
  console.log(`\n  ${i + 1}. MISTAKE: ${mistake}`);
  console.log(`     EXAMPLE: ${example}`);
  console.log(`     FIX: ${fix}`);
});

// ============================================================================
//  G: WHEN TO USE ORM vs RAW SQL
// ============================================================================

console.log(`\n${'='.repeat(60)}`);
console.log(`  G: When to Use ORM vs Raw SQL`);
console.log(`${'='.repeat(60)}`);

//  VISUAL: Decision Tree
//
//   Need to query DB?
//   ├── Simple CRUD (create, read, update, delete)?
//   │   └── YES: Use ORM  ✓
//   │
//   ├── Complex aggregation / reporting?
//   │   └── YES: Use Raw SQL  ✓
//   │
//   ├── Need database-specific features?
//   │   └── YES: Use Raw SQL  ✓
//   │
//   ├── Rapid prototyping / startup MVP?
//   │   └── YES: Use ORM  ✓
//   │
//   └── Performance-critical hot path?
//       └── YES: Use Raw SQL (or query builder like Knex)  ✓

const useWhen = {
  orm: [
    'CRUD operations (90% of web app queries)',
    'Rapid prototyping / MVPs',
    'Schema management and migrations',
    'Type safety (especially Prisma + TypeScript)',
    'Multi-database support needed',
    'Team with limited SQL knowledge'
  ],
  rawSQL: [
    'Complex joins across many tables',
    'Aggregation / reporting queries',
    'Database-specific features (window functions, CTEs)',
    'Performance-critical queries',
    'Bulk operations (insert 10K rows)',
    'When ORM-generated SQL is inefficient'
  ],
  queryBuilder: [
    'Middle ground: Knex.js',
    'SQL-like syntax in JavaScript',
    'More control than ORM, less boilerplate than raw SQL',
    'knex("users").where("age", ">", 25).select("name")'
  ]
};

Object.entries(useWhen).forEach(([approach, reasons]) => {
  console.log(`\n  ${approach.toUpperCase()}:`);
  reasons.forEach(r => console.log(`    - ${r}`));
});

// ============================================================================
//  H: QUERY BUILDER (KNEX.JS) - THE MIDDLE GROUND
// ============================================================================

console.log(`\n${'='.repeat(60)}`);
console.log(`  H: Query Builder (Knex.js) - Middle Ground`);
console.log(`${'='.repeat(60)}`);

// Simulated Knex-style query builder
class QueryBuilder {
  constructor(table) {
    this._table = table;
    this._select = '*';
    this._where = [];
    this._orderBy = null;
    this._limit = null;
    this._joins = [];
  }

  select(...fields) {
    this._select = fields.join(', ');
    return this;
  }

  where(field, op, value) {
    this._where.push(`${field} ${op} '${value}'`);
    return this;
  }

  orderBy(field, direction = 'asc') {
    this._orderBy = `${field} ${direction}`;
    return this;
  }

  limit(n) {
    this._limit = n;
    return this;
  }

  join(table, col1, op, col2) {
    this._joins.push(`JOIN ${table} ON ${col1} ${op} ${col2}`);
    return this;
  }

  toSQL() {
    let sql = `SELECT ${this._select} FROM ${this._table}`;
    if (this._joins.length) sql += ' ' + this._joins.join(' ');
    if (this._where.length) sql += ' WHERE ' + this._where.join(' AND ');
    if (this._orderBy) sql += ' ORDER BY ' + this._orderBy;
    if (this._limit) sql += ' LIMIT ' + this._limit;
    return sql;
  }

  toString() { return this.toSQL(); }
}

const knex = (table) => new QueryBuilder(table);

// Examples
const queries = [
  knex('users').select('id', 'name', 'email').where('age', '>', 25).orderBy('name').limit(10),
  knex('users').select('u.name', 'COUNT(o.id) as order_count')
    .join('orders o', 'u.id', '=', 'o.user_id')
    .where('u.active', '=', 'true'),
  knex('posts').select('*').where('published', '=', 'true').orderBy('created_at', 'desc').limit(20)
];

queries.forEach((q, i) => {
  console.log(`\n  Query ${i + 1}:`);
  console.log(`    Builder: [chained methods]`);
  console.log(`    SQL:     ${q.toSQL()}`);
});

// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║  INTERVIEW ANSWER                                                          ║
// ║                                                                            ║
// ║  "An ORM (Object-Relational Mapper) translates between JavaScript         ║
// ║  objects and SQL database tables. The two most popular ORMs in Node.js    ║
// ║  are Sequelize (code-first, mature) and Prisma (schema-first, modern).   ║
// ║                                                                            ║
// ║  Sequelize defines models in JavaScript with hasMany/belongsTo for        ║
// ║  relationships. Prisma uses a schema.prisma file and generates a fully    ║
// ║  typed client with autocomplete.                                          ║
// ║                                                                            ║
// ║  Key gotchas: the N+1 problem (solve with eager loading / include),      ║
// ║  SELECT * by default (use attributes/select to limit fields), and        ║
// ║  complex queries generating poor SQL (fall back to raw SQL).             ║
// ║                                                                            ║
// ║  For simple CRUD, use an ORM. For complex aggregations or performance-   ║
// ║  critical queries, use raw SQL or a query builder like Knex.js.          ║
// ║  Understanding the SQL that your ORM generates is critical."              ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

// ============================================================================
//  OUTPUT:
// ============================================================================
//
//   A: Raw SQL vs ORM side-by-side for all CRUD operations
//   B: Simulated Sequelize model definition, associations, CRUD
//   C: Simulated Prisma schema, client, CRUD, and upsert
//   D: Relationship types (1:1, 1:N, M:N) with Sequelize and Prisma syntax
//   E: Sequelize vs Prisma feature comparison table
//   F: 6 Common ORM gotchas with fixes
//   G: Decision guide: ORM vs Raw SQL vs Query Builder
//   H: Knex.js query builder with generated SQL examples
// ============================================================================

// RUN: node docs/node/12-database/02-orm-basics.js
