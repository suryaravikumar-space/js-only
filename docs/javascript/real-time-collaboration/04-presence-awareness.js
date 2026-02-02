/**
 * ============================================
 * 4. PRESENCE & AWARENESS SYSTEM
 * Showing 10K user cursors, selections, and status
 * ============================================
 *
 * Problem: Broadcasting cursor position of 10K users to 10K users
 *          = 100 MILLION messages/second. Impossible.
 *
 * Solution: Spatial partitioning + throttling + relevance filtering
 */

// --- Presence Manager with smart throttling ---

class PresenceManager {
  constructor(connection, userId) {
    this.connection = connection;
    this.userId = userId;
    this.peers = new Map(); // userId -> presence data
    this.throttleMs = 50; // Max 20 updates/sec per user
    this.lastSent = 0;
    this.pendingUpdate = null;
  }

  // Throttled local cursor broadcast
  updateCursor(position) {
    const now = Date.now();

    if (now - this.lastSent >= this.throttleMs) {
      this._send({ type: "CURSOR", position, userId: this.userId });
      this.lastSent = now;
      this.pendingUpdate = null;
    } else {
      // Debounce: send latest position after throttle window
      clearTimeout(this.pendingUpdate);
      this.pendingUpdate = setTimeout(() => {
        this._send({ type: "CURSOR", position, userId: this.userId });
        this.lastSent = Date.now();
      }, this.throttleMs - (now - this.lastSent));
    }
  }

  // Receive remote presence
  handleRemotePresence(data) {
    this.peers.set(data.userId, {
      ...data,
      lastSeen: Date.now(),
    });
  }

  // Only return users visible in current viewport
  getVisiblePeers(viewportRange) {
    const visible = [];
    for (const [id, peer] of this.peers) {
      if (
        peer.position.line >= viewportRange.start &&
        peer.position.line <= viewportRange.end
      ) {
        visible.push(peer);
      }
    }
    return visible; // Render only these cursors
  }

  // Clean up stale peers
  pruneStale(maxAge = 30000) {
    const now = Date.now();
    for (const [id, peer] of this.peers) {
      if (now - peer.lastSeen > maxAge) {
        this.peers.delete(id);
      }
    }
  }

  _send(data) {
    this.connection.send(data);
  }
}

/**
 * SCALING PRESENCE TO 10K USERS:
 *
 * 1. Server-side room sharding
 *    - Users in same "viewport zone" get each other's cursors
 *    - Server filters presence by spatial proximity
 *    - User editing line 1-50 doesn't need cursor of user at line 5000
 *
 * 2. Throttle cursor updates to 20/sec (50ms)
 *    - Human eye can't distinguish faster cursor movement
 *    - Reduces bandwidth 10x vs sending on every mousemove
 *
 * 3. Aggregate presence on server
 *    - Server batches: "Users A,B,C are in lines 10-50"
 *    - Single message instead of 3 separate cursor updates
 *
 * 4. Show max ~50 cursors visually
 *    - Even if 10K users are present, show "48 others editing"
 *    - Render actual cursors only for nearby collaborators
 *
 * 5. Color assignment via hash
 *    - No server coordination needed for cursor colors
 */

function userColor(userId) {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = ((hash << 5) - hash + userId.charCodeAt(i)) | 0;
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 50%)`;
}
