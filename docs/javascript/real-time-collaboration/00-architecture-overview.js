/**
 * ============================================
 * REAL-TIME COLLABORATION ARCHITECTURE
 * 10,000+ Concurrent Users @ 60fps
 * ============================================
 *
 * CORE CHALLENGES:
 * 1. Network: Managing 10K+ WebSocket connections
 * 2. State: Conflict resolution when multiple users edit simultaneously
 * 3. Performance: Keeping UI at 60fps despite constant updates
 * 4. Memory: Not leaking with thousands of events/second
 *
 * HIGH-LEVEL ARCHITECTURE:
 *
 *  ┌──────────────────────────────────────────────────┐
 *  │                   CLIENT LAYER                    │
 *  │                                                  │
 *  │  ┌────────────┐  ┌───────────┐  ┌────────────┐  │
 *  │  │  UI Layer   │  │  CRDT     │  │  Transport │  │
 *  │  │  (Virtual   │◄─┤  Engine   │◄─┤  Layer     │  │
 *  │  │   DOM +     │  │  (Yjs/    │  │  (WebSocket│  │
 *  │  │   Canvas)   │  │  Automerge│  │   + HTTP)  │  │
 *  │  └────────────┘  └───────────┘  └────────────┘  │
 *  │        ▲               ▲              ▲          │
 *  │        │               │              │          │
 *  │  ┌─────┴──────┐  ┌────┴─────┐  ┌─────┴──────┐  │
 *  │  │  Worker     │  │  Op      │  │  Connection│  │
 *  │  │  Thread     │  │  Buffer  │  │  Manager   │  │
 *  │  │  (OffScreen)│  │  (Queue) │  │  (Reconnect│  │
 *  │  └────────────┘  └──────────┘  └────────────┘  │
 *  └──────────────────────────────────────────────────┘
 *              │              │              │
 *              ▼              ▼              ▼
 *  ┌──────────────────────────────────────────────────┐
 *  │                  SERVER LAYER                     │
 *  │  Load Balancer → Room Servers → Persistence      │
 *  └──────────────────────────────────────────────────┘
 */
