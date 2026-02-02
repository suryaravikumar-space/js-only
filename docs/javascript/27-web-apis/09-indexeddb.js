/**
 * WEB APIS: 09 - IndexedDB
 *
 * ONE CONCEPT: Client-side database for large structured data
 */


// =============================================================================
// WHAT IS INDEXEDDB?
// =============================================================================

/**
 * IndexedDB = A real database in the browser.
 *
 *
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  INDEXEDDB vs LOCALSTORAGE                                           │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │                   │ localStorage      │ IndexedDB                    │
 *   │  ─────────────────┼───────────────────┼───────────────────────────── │
 *   │  Capacity         │ ~5-10 MB          │ 50+ MB (can request more)    │
 *   │  Data Types       │ Strings only      │ Objects, Blobs, Files        │
 *   │  API              │ Synchronous       │ Asynchronous                 │
 *   │  Queries          │ Key only          │ Indexes, ranges, cursors     │
 *   │  Transactions     │ No                │ Yes (ACID-like)              │
 *   │  Workers Access   │ No                │ Yes                          │
 *   │                                                                      │
 *   │  Use when:                                                           │
 *   │  • Storing 1000s of records                                          │
 *   │  • Need complex queries                                              │
 *   │  • Offline-first applications                                        │
 *   │  • Storing files/blobs                                               │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// INDEXEDDB STRUCTURE
// =============================================================================

console.log('=== IndexedDB Structure ===\n');

/**
 *
 *   ┌─────────────────────────────────────────────────────────────────────────┐
 *   │  DATABASE STRUCTURE                                                     │
 *   ├─────────────────────────────────────────────────────────────────────────┤
 *   │                                                                         │
 *   │  Database: "MyApp"                                                      │
 *   │  ┌────────────────────────────────────────────────────────────────────┐ │
 *   │  │                                                                    │ │
 *   │  │  Object Store: "users"          Object Store: "posts"              │ │
 *   │  │  ┌──────────────────────┐       ┌──────────────────────┐           │ │
 *   │  │  │ Key: 1               │       │ Key: 101             │           │ │
 *   │  │  │ { name: "John" }     │       │ { title: "Hello" }   │           │ │
 *   │  │  ├──────────────────────┤       ├──────────────────────┤           │ │
 *   │  │  │ Key: 2               │       │ Key: 102             │           │ │
 *   │  │  │ { name: "Jane" }     │       │ { title: "World" }   │           │ │
 *   │  │  └──────────────────────┘       └──────────────────────┘           │ │
 *   │  │                                                                    │ │
 *   │  │  Indexes:                       Indexes:                           │ │
 *   │  │  - "email" (unique)             - "userId"                         │ │
 *   │  │  - "age"                        - "createdAt"                      │ │
 *   │  │                                                                    │ │
 *   │  └────────────────────────────────────────────────────────────────────┘ │
 *   │                                                                         │
 *   │  Terminology:                                                           │
 *   │  • Database     = Container for all data                                │
 *   │  • Object Store = Like a table (collection of records)                  │
 *   │  • Index        = For fast queries on specific fields                   │
 *   │  • Transaction  = Group of operations (all succeed or all fail)         │
 *   │                                                                         │
 *   └─────────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Database → contains Object Stores → contain Records');
console.log('Indexes enable fast queries on specific fields');


// =============================================================================
// BASIC USAGE (with idb library - recommended)
// =============================================================================

console.log('\n=== Using idb Library (Recommended) ===\n');

/**
 *   The raw IndexedDB API is complex and callback-based.
 *   Use the 'idb' library for a Promise-based wrapper.
 *
 *   npm install idb
 */

const idbExample = `
import { openDB } from 'idb';

// ═══════════════════════════════════════════════════════════════════════
// OPENING/CREATING DATABASE
// ═══════════════════════════════════════════════════════════════════════

const db = await openDB('MyApp', 1, {
  upgrade(db, oldVersion, newVersion, transaction) {
    // Called when database is created or version changes

    // Create object stores
    if (!db.objectStoreNames.contains('users')) {
      const userStore = db.createObjectStore('users', {
        keyPath: 'id',           // Primary key field
        autoIncrement: true      // Auto-generate IDs
      });

      // Create indexes for queries
      userStore.createIndex('email', 'email', { unique: true });
      userStore.createIndex('age', 'age');
    }

    if (!db.objectStoreNames.contains('posts')) {
      const postStore = db.createObjectStore('posts', {
        keyPath: 'id',
        autoIncrement: true
      });

      postStore.createIndex('userId', 'userId');
      postStore.createIndex('createdAt', 'createdAt');
    }
  }
});


// ═══════════════════════════════════════════════════════════════════════
// CRUD OPERATIONS
// ═══════════════════════════════════════════════════════════════════════

// CREATE
const id = await db.add('users', {
  name: 'John Doe',
  email: 'john@example.com',
  age: 30
});
console.log('Created user with id:', id);

// READ by key
const user = await db.get('users', 1);
console.log('User:', user);

// READ all
const allUsers = await db.getAll('users');
console.log('All users:', allUsers);

// UPDATE (put replaces or inserts)
await db.put('users', {
  id: 1,
  name: 'John Updated',
  email: 'john.new@example.com',
  age: 31
});

// DELETE
await db.delete('users', 1);

// CLEAR all records
await db.clear('users');


// ═══════════════════════════════════════════════════════════════════════
// QUERYING WITH INDEXES
// ═══════════════════════════════════════════════════════════════════════

// Get by index value
const userByEmail = await db.getFromIndex('users', 'email', 'john@example.com');

// Get all by index value
const usersByAge = await db.getAllFromIndex('users', 'age', 30);

// Get range of values
const tx = db.transaction('users', 'readonly');
const index = tx.store.index('age');
const range = IDBKeyRange.bound(25, 35);  // age 25-35
const usersInRange = await index.getAll(range);
`;

console.log(idbExample);


// =============================================================================
// REAL-WORLD EXAMPLE: OFFLINE MESSAGING APP
// =============================================================================

console.log('\n=== Real-World: Offline Messages ===\n');

const offlineMessagesExample = `
// ═══════════════════════════════════════════════════════════════════════
// OFFLINE-FIRST CHAT APP
// ═══════════════════════════════════════════════════════════════════════

import { openDB } from 'idb';

class MessageStore {
  constructor() {
    this.dbPromise = openDB('ChatApp', 1, {
      upgrade(db) {
        const store = db.createObjectStore('messages', {
          keyPath: 'id'
        });
        store.createIndex('conversationId', 'conversationId');
        store.createIndex('timestamp', 'timestamp');
        store.createIndex('syncStatus', 'syncStatus');
      }
    });
  }

  async addMessage(message) {
    const db = await this.dbPromise;
    await db.add('messages', {
      id: crypto.randomUUID(),
      ...message,
      timestamp: Date.now(),
      syncStatus: 'pending'  // Track if synced to server
    });
  }

  async getConversation(conversationId) {
    const db = await this.dbPromise;
    const messages = await db.getAllFromIndex('messages', 'conversationId', conversationId);
    return messages.sort((a, b) => a.timestamp - b.timestamp);
  }

  async getUnsyncedMessages() {
    const db = await this.dbPromise;
    return db.getAllFromIndex('messages', 'syncStatus', 'pending');
  }

  async markAsSynced(messageId) {
    const db = await this.dbPromise;
    const message = await db.get('messages', messageId);
    if (message) {
      message.syncStatus = 'synced';
      await db.put('messages', message);
    }
  }

  async syncWithServer() {
    const pending = await this.getUnsyncedMessages();

    for (const message of pending) {
      try {
        await fetch('/api/messages', {
          method: 'POST',
          body: JSON.stringify(message)
        });
        await this.markAsSynced(message.id);
      } catch (error) {
        console.log('Will retry later:', message.id);
      }
    }
  }
}

// Usage
const store = new MessageStore();

// Works offline!
await store.addMessage({
  conversationId: 'conv-123',
  text: 'Hello!',
  sender: 'user-1'
});

// When online, sync to server
window.addEventListener('online', () => {
  store.syncWithServer();
});
`;

console.log(offlineMessagesExample);


// =============================================================================
// WHEN TO USE INDEXEDDB
// =============================================================================

console.log('\n=== When to Use IndexedDB ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  GOOD USE CASES                                                     │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  ✓ Offline-first applications                                       │
 *   │    - PWAs that work without network                                 │
 *   │    - Sync when connection returns                                   │
 *   │                                                                     │
 *   │  ✓ Large datasets                                                   │
 *   │    - Thousands of records                                           │
 *   │    - Would exceed localStorage limit                                │
 *   │                                                                     │
 *   │  ✓ Complex queries                                                  │
 *   │    - Filter by multiple fields                                      │
 *   │    - Range queries (dates, prices)                                  │
 *   │                                                                     │
 *   │  ✓ File/Blob storage                                                │
 *   │    - Images, documents for offline access                           │
 *   │                                                                     │
 *   │  ✓ Web Worker access needed                                         │
 *   │    - Background data processing                                     │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Use IndexedDB for: Offline apps, large data, complex queries, files');
console.log('Use localStorage for: Simple key-value, small data, preferences');


// =============================================================================
// INTERVIEW: What to Say (1-2 minutes)
// =============================================================================

/**
 * QUESTION: "What is IndexedDB and when would you use it?"
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * YOUR ANSWER:
 *
 * "IndexedDB is a client-side database built into browsers. Unlike
 * localStorage which only stores strings, IndexedDB can store structured
 * objects, files, and blobs. It has much higher capacity - 50MB or more
 * compared to localStorage's 5-10MB.
 *
 * It's a real database with object stores, which are like tables, and
 * indexes for fast queries. It supports transactions, so operations are
 * atomic - they all succeed or all fail together.
 *
 * I use IndexedDB for offline-first applications. For example, a messaging
 * app that works without network. Messages are saved to IndexedDB immediately,
 * so the UI responds instantly. Then when the network is available, I sync
 * with the server. I track sync status in the database so I know which
 * messages need to be sent.
 *
 * The raw API is callback-based and complex, so I use the 'idb' library
 * which provides a clean Promise-based wrapper.
 *
 * I'd use IndexedDB over localStorage when I have thousands of records,
 * need to query by different fields, store files, or need access from
 * Web Workers. For simple key-value storage like user preferences,
 * localStorage is simpler and sufficient."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * KEY POINTS TO MENTION:
 * ✓ Real database - stores objects, not just strings
 * ✓ Object stores (tables), indexes, transactions
 * ✓ Use for: offline apps, large data, complex queries
 * ✓ Use 'idb' library for cleaner API
 * ✓ Compare to localStorage for simple cases
 *
 */


// RUN: node docs/27-web-apis/09-indexeddb.js
