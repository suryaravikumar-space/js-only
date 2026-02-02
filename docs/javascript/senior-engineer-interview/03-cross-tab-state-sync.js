/**
 * ================================================================
 * QUESTION: "A user logs out in one tab. All other tabs should
 *            also log out immediately. How do you implement this?"
 * ================================================================
 *
 * ASKED AT: Meta (E5 — "design auth state sync"), Amazon (SDE2 Frontend),
 *           Google (L5 — "design multi-tab coordination"), Shopify, Stripe
 * TYPE:     Frontend System Design + Browser API knowledge
 *
 * Real-world scenario: Gmail does this. Log out in one tab → all tabs redirect.
 * Slack does this for workspace switching. Trading platforms sync portfolio state.
 *
 * Sources:
 *   - BroadcastChannel spec: https://html.spec.whatwg.org/multipage/web-messaging.html
 *   - MDN BroadcastChannel: https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel
 *   - MDN SharedWorker: https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker
 *   - MDN Storage Event: https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event
 *   - "Scaling WebSocket Connections using Shared Workers" (DEV Community):
 *     https://dev.to/ayushgp/scaling-websocket-connections-using-shared-workers-14mj
 *   - MDN Blog on BroadcastChannel: https://developer.mozilla.org/en-US/blog/exploring-the-broadcast-channel-api-for-cross-tab-communication/
 *
 * ================================================================
 * YOUR STORY TO THE INTERVIEWER:
 * ================================================================
 *
 * "We had a fintech dashboard. Users would open 5-6 tabs —
 *  one for portfolio, one for trades, one for research.
 *
 *  Problem 1: User logs out in one tab, other tabs still show data.
 *  Security issue — someone could walk up and see the portfolio.
 *
 *  Problem 2: Each tab opened its own WebSocket connection.
 *  6 tabs = 6 connections = 6x server load per user.
 *
 *  We solved both with a combination of BroadcastChannel
 *  (for simple messaging) and localStorage events (as fallback
 *  for older Safari). For the WebSocket problem, we used
 *  leader election — one tab holds the connection, broadcasts
 *  data to others."
 *
 * ================================================================
 * VISUAL: 4 WAYS TABS CAN TALK
 * ================================================================
 *
 *   METHOD 1: BroadcastChannel (BEST — simple, built for this)
 *   ┌───────┐    BroadcastChannel     ┌───────┐
 *   │ Tab A │ ──── "auth-sync" ─────▶ │ Tab B │
 *   │       │                          │       │
 *   │ Tab C │ ◀──── same channel ──── │ Tab D │
 *   └───────┘                          └───────┘
 *   ✅ Simple API   ✅ Same-origin   ❌ Safari < 15.4
 *
 *
 *   METHOD 2: localStorage + storage event (FALLBACK)
 *   ┌───────┐  localStorage.setItem   ┌───────┐
 *   │ Tab A │ ───────────────────────▶ │ Tab B │
 *   │writes │    'storage' event fires │listens│
 *   └───────┘    in ALL OTHER tabs     └───────┘
 *   ✅ All browsers   ❌ Doesn't fire in writing tab   ❌ Synchronous/slow
 *
 *
 *   METHOD 3: SharedWorker (SHARED STATE + LOGIC)
 *   ┌───────┐         ┌──────────────┐         ┌───────┐
 *   │ Tab A │◀───────▶│ SharedWorker │◀───────▶│ Tab B │
 *   └───────┘  port   │ (single      │  port   └───────┘
 *              msg     │  instance)   │  msg
 *   └───────┘         └──────────────┘         └───────┘
 *   ✅ Holds state   ✅ Shared WebSocket   ❌ No Safari support
 *
 *
 *   METHOD 4: Service Worker (OFFLINE + BACKGROUND)
 *   ┌───────┐         ┌───────────────┐        ┌───────┐
 *   │ Tab A │────────▶│ Service Worker│───────▶│ Tab B │
 *   └───────┘ postMsg │ clients.matchAll()     └───────┘
 *                     └───────────────┘
 *   ✅ Offline support   ✅ Background sync   ⚠️ More complex
 *
 * ================================================================
 * METHOD 1: BroadcastChannel (show this first)
 * ================================================================
 */

// This is 15 lines. Dead simple. Show this first in the interview.

const channel = new BroadcastChannel("app-sync");

// TAB A — user clicks "Logout"
function logout() {
  // Clear local session
  sessionStorage.clear();
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  // Tell all other tabs
  channel.postMessage({ type: "LOGOUT" });

  // Redirect this tab
  window.location.href = "/login";
}

// TAB B, C, D — listening
channel.onmessage = (event) => {
  if (event.data.type === "LOGOUT") {
    sessionStorage.clear();
    window.location.href = "/login"; // all tabs redirect
  }

  if (event.data.type === "THEME_CHANGED") {
    document.documentElement.setAttribute("data-theme", event.data.theme);
  }

  if (event.data.type === "CART_UPDATED") {
    renderCart(event.data.cart);
  }
};

// Clean up when tab closes
window.addEventListener("beforeunload", () => {
  channel.close();
});

/**
 * ================================================================
 * METHOD 2: localStorage fallback (for old Safari)
 * ================================================================
 *
 * KEY FACT: The 'storage' event fires in EVERY tab EXCEPT
 *           the one that called setItem. This is by spec.
 */

// TAB A — writes
function logoutWithFallback() {
  localStorage.setItem("auth-event", JSON.stringify({
    type: "LOGOUT",
    timestamp: Date.now(), // needed to trigger event even if same value
  }));
  window.location.href = "/login";
}

// TAB B — listens
window.addEventListener("storage", (event) => {
  if (event.key === "auth-event") {
    const data = JSON.parse(event.newValue);
    if (data.type === "LOGOUT") {
      sessionStorage.clear();
      window.location.href = "/login";
    }
  }
});

/**
 * GOTCHA: If you set the SAME value twice, the storage event
 * won't fire (old value === new value). That's why we include
 * a timestamp — guarantees the value changes every time.
 */

/**
 * ================================================================
 * METHOD 3: LEADER ELECTION (the "wow" answer)
 * ================================================================
 *
 * Problem: User has 10 tabs open. Each tab opens a WebSocket.
 *          10 tabs = 10 connections = 10x server load per user.
 *
 * Solution: Elect ONE tab as "leader". Only the leader opens
 *           the WebSocket. Leader broadcasts data to other tabs.
 *
 *   ┌─────────┐                           ┌─────────┐
 *   │ Tab A   │                           │ Tab B   │
 *   │ LEADER  │── BroadcastChannel ──────▶│FOLLOWER │
 *   │ (has WS)│                           │(no WS)  │
 *   └────┬────┘                           └─────────┘
 *        │                                 ┌─────────┐
 *        │ WebSocket ◀──── Server          │ Tab C   │
 *        │                                 │FOLLOWER │
 *        └── BroadcastChannel ────────────▶│(no WS)  │
 *                                          └─────────┘
 *
 *   If Tab A closes → Tab B detects (no heartbeat) → becomes new leader
 *   Result: Always exactly 1 WebSocket connection per user
 */

class LeaderElection {
  constructor(onBecomeLeader, onBecomeFollower) {
    this.channel = new BroadcastChannel("leader-election");
    this.id = crypto.randomUUID();
    this.isLeader = false;
    this.lastHeartbeat = Date.now();
    this.onBecomeLeader = onBecomeLeader;
    this.onBecomeFollower = onBecomeFollower;

    this.channel.onmessage = (e) => {
      if (e.data.type === "HEARTBEAT") {
        this.lastHeartbeat = Date.now();
        if (this.isLeader && e.data.id !== this.id) {
          // Another leader exists (maybe we rejoined after sleep)
          this.isLeader = false;
          this.onBecomeFollower();
        }
      }
      if (e.data.type === "LEADER_GONE") {
        this._tryBecomeLeader();
      }
    };

    // Check if a leader already exists
    // Wait 1 second — if no heartbeat received, become leader
    setTimeout(() => {
      if (Date.now() - this.lastHeartbeat > 1500) {
        this._tryBecomeLeader();
      }
    }, 1000);

    // Notify others when this tab closes
    window.addEventListener("beforeunload", () => {
      if (this.isLeader) {
        this.channel.postMessage({ type: "LEADER_GONE" });
      }
    });
  }

  _tryBecomeLeader() {
    this.isLeader = true;
    this.onBecomeLeader();

    // Send heartbeat so other tabs know a leader exists
    this._heartbeat = setInterval(() => {
      this.channel.postMessage({ type: "HEARTBEAT", id: this.id });
    }, 1000);
  }
}

// Usage:
/*
const election = new LeaderElection(
  // I'm the leader — open WebSocket, poll server
  () => {
    const ws = new WebSocket('/ws');
    ws.onmessage = (e) => {
      // Broadcast data to all follower tabs
      channel.postMessage({ type: 'DATA', payload: JSON.parse(e.data) });
    };
  },
  // I'm a follower — just listen for broadcasts
  () => {
    console.log('Following leader tab');
  }
);
*/

/**
 * ================================================================
 * COMPARISON TABLE (show this to interviewer)
 * ================================================================
 *
 * ┌───────────────────┬──────────┬───────────┬───────────┬───────────────┐
 * │ Method            │ Safari?  │ Holds     │ Shared    │ Use Case      │
 * │                   │          │ State?    │ Workers?  │               │
 * ├───────────────────┼──────────┼───────────┼───────────┼───────────────┤
 * │ BroadcastChannel  │ 15.4+   │ No        │ No        │ Auth, theme,  │
 * │                   │          │           │           │ cart sync     │
 * ├───────────────────┼──────────┼───────────┼───────────┼───────────────┤
 * │ localStorage      │ All ✅   │ On disk   │ No        │ Fallback for  │
 * │ (storage event)   │          │ (slow)    │           │ old browsers  │
 * ├───────────────────┼──────────┼───────────┼───────────┼───────────────┤
 * │ SharedWorker      │ No ❌    │ In RAM    │ Yes       │ Shared WS,    │
 * │                   │          │ (fast)    │           │ shared state  │
 * ├───────────────────┼──────────┼───────────┼───────────┼───────────────┤
 * │ Service Worker    │ Yes ✅   │ Limited   │ No        │ Offline sync, │
 * │                   │          │           │           │ push notif    │
 * └───────────────────┴──────────┴───────────┴───────────┴───────────────┘
 *
 * ================================================================
 * CHEAT SHEET
 * ================================================================
 *
 * Interviewer says...                  │  You say...
 * ─────────────────────────────────────┼──────────────────────────────
 * "How do you sync logout?"            │  BroadcastChannel + localStorage
 *                                      │  fallback. Show both (15 lines).
 * "What about Safari?"                 │  localStorage storage event works
 *                                      │  everywhere. Use as fallback.
 * "What about 10 tabs, 10 WebSockets?" │  Leader election. One tab holds
 *                                      │  WS, broadcasts to others.
 * "What about offline?"                │  Service Worker + Background Sync API
 * "What if leader tab crashes?"        │  Heartbeat detection. If no heartbeat
 *                                      │  for 2s, another tab becomes leader.
 * "Can tabs from different origins     │  No. Same-origin policy. For cross-
 *  communicate?"                       │  origin: window.postMessage (iframes).
 * "What does Gmail actually use?"      │  Likely BroadcastChannel + localStorage
 *                                      │  (they need all-browser support).
 */
