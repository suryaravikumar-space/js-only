/**
 * ============================================
 * 5. MEMORY MANAGEMENT & GARBAGE COLLECTION
 * Preventing memory leaks with 10K event streams
 * ============================================
 */

// --- Problem: CRDT tombstones grow forever ---

class GarbageCollector {
  constructor(crdtDoc, peerClocks) {
    this.doc = crdtDoc;
    this.peerClocks = peerClocks; // Track what each peer has seen
  }

  // Safe to GC tombstones that ALL peers have acknowledged
  collectTombstones() {
    const minClock = Math.min(...this.peerClocks.values());

    this.doc.chars = this.doc.chars.filter((char) => {
      // Keep if: not deleted, OR deleted but some peer hasn't seen it yet
      return !char.deleted || char.id.clock > minClock;
    });
  }
}

// --- Problem: Event listener leaks ---

class SafeEventManager {
  constructor() {
    this.abortControllers = new Map();
  }

  // Use AbortController for automatic cleanup
  listen(target, event, handler, key) {
    // Clean up previous listener for this key
    this.abortControllers.get(key)?.abort();

    const controller = new AbortController();
    this.abortControllers.set(key, controller);

    target.addEventListener(event, handler, { signal: controller.signal });
  }

  // Clean up everything on disconnect
  cleanup() {
    for (const controller of this.abortControllers.values()) {
      controller.abort();
    }
    this.abortControllers.clear();
  }
}

// --- Problem: Message buffer grows during high throughput ---

class BoundedBuffer {
  constructor(maxSize = 10000) {
    this.buffer = [];
    this.maxSize = maxSize;
  }

  push(item) {
    this.buffer.push(item);

    // Drop oldest if over limit (backpressure)
    if (this.buffer.length > this.maxSize) {
      // Keep latest ops, request full sync for dropped ones
      this.buffer = this.buffer.slice(-this.maxSize / 2);
      return { dropped: true }; // Signal: need resync
    }
    return { dropped: false };
  }
}

// --- Problem: WeakRef for peer cursors (auto GC when peer disconnects) ---

class PeerCursorCache {
  constructor() {
    this.cursors = new Map(); // userId -> WeakRef<CursorElement>
    this.registry = new FinalizationRegistry((userId) => {
      this.cursors.delete(userId);
    });
  }

  set(userId, cursorElement) {
    const ref = new WeakRef(cursorElement);
    this.cursors.set(userId, ref);
    this.registry.register(cursorElement, userId);
  }

  get(userId) {
    const ref = this.cursors.get(userId);
    return ref?.deref(); // Returns undefined if GC'd
  }
}

/**
 * MEMORY BUDGET FOR 10K USER SESSION:
 *
 * ┌────────────────────────────┬────────────┐
 * │ Component                  │ Memory     │
 * ├────────────────────────────┼────────────┤
 * │ CRDT document state        │ ~5-50 MB   │ ← Depends on doc size
 * │ Tombstones (before GC)     │ ~2-10 MB   │ ← GC periodically
 * │ Presence data (10K peers)  │ ~1-2 MB    │ ← Pruned aggressively
 * │ Message buffers            │ ~1-5 MB    │ ← Bounded
 * │ DOM / Canvas               │ ~10-20 MB  │ ← Virtualized
 * │ Web Worker overhead        │ ~5-10 MB   │
 * ├────────────────────────────┼────────────┤
 * │ TOTAL TARGET               │ < 100 MB   │
 * └────────────────────────────┴────────────┘
 */
