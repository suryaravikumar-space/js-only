/**
 * ============================================
 * 6. SERVER-SIDE ARCHITECTURE
 * Supporting 10K WebSocket connections
 * ============================================
 *
 * ┌─────────┐     ┌──────────────────┐     ┌────────────┐
 * │ Clients │────▶│  Load Balancer   │────▶│ Room Server│
 * │ (10K)   │     │  (sticky session)│     │ (Node.js)  │
 * └─────────┘     └──────────────────┘     └─────┬──────┘
 *                                                 │
 *                        ┌────────────────────────┼──────────┐
 *                        ▼                        ▼          ▼
 *                 ┌────────────┐          ┌────────────┐  ┌──────┐
 *                 │   Redis    │          │ PostgreSQL │  │ S3   │
 *                 │ (pub/sub)  │          │ (persist)  │  │(snap)│
 *                 └────────────┘          └────────────┘  └──────┘
 *
 * KEY SERVER DECISIONS:
 *
 * 1. Sticky sessions via load balancer
 *    - All users in same "room" connect to same server
 *    - Avoids cross-server CRDT merging (expensive)
 *    - If room server dies → users reconnect → new server loads from persistence
 *
 * 2. Redis pub/sub for cross-room communication
 *    - Room A on Server 1 can notify Room B on Server 2
 *    - Used for: presence aggregation, admin broadcasts
 *
 * 3. Snapshot + WAL persistence
 *    - Full CRDT snapshot saved every N minutes
 *    - Operations written to append-only log (WAL) in between
 *    - Recovery: load snapshot + replay WAL
 *
 * 4. Horizontal scaling
 *    - Each server handles ~2000-5000 WebSocket connections
 *    - 10K users = 2-5 servers behind load balancer
 *    - Add servers as user count grows
 *
 * 5. Rate limiting per connection
 *    - Max 100 ops/sec per user (prevents spam/abuse)
 *    - Server-side op validation before broadcast
 */

/**
 * COMPLETE ARCHITECTURE SUMMARY:
 *
 * CLIENT:
 * ├── Transport Layer (WebSocket + binary protocol + reconnection)
 * ├── CRDT Engine (conflict-free state + Yjs/Automerge)
 * ├── Web Worker (offload CRDT processing from main thread)
 * ├── Render Scheduler (rAF batching + viewport virtualization)
 * ├── Presence Manager (throttled cursors + spatial filtering)
 * └── Memory Manager (bounded buffers + tombstone GC + WeakRef)
 *
 * SERVER:
 * ├── Load Balancer (sticky sessions per room)
 * ├── Room Servers (WebSocket handlers, 2-5K connections each)
 * ├── Redis (pub/sub for cross-server coordination)
 * ├── PostgreSQL (document persistence)
 * └── S3 (periodic CRDT snapshots)
 *
 * INTERVIEW QUICK ANSWERS:
 *
 * Q: "How do you handle conflicts?"
 * A: CRDTs - operations are commutative, so order doesn't matter.
 *    Every client converges to the same state. No central lock needed.
 *
 * Q: "How do you maintain 60fps?"
 * A: Batch updates with rAF, CRDT processing in Web Worker,
 *    virtualized rendering, and Canvas for extreme cases.
 *
 * Q: "How do you scale to 10K users?"
 * A: Room sharding via sticky sessions, binary protocol to reduce
 *    bandwidth, presence throttling + spatial filtering, bounded buffers.
 *
 * Q: "What about offline support?"
 * A: CRDTs work offline natively. Queue ops locally, merge on reconnect.
 *    Guaranteed convergence regardless of when ops arrive.
 *
 * Q: "What libraries would you use in production?"
 * A: Yjs (CRDT) + y-websocket (transport) + y-indexeddb (offline persistence)
 *    OR Automerge + automerge-repo for a more batteries-included approach.
 */
