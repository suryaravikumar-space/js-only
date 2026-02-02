/**
 * MACHINE CODING: 10 - PubSub (Publish-Subscribe) Pattern
 *
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║  GOLDEN RULE: Decouple publishers from subscribers using a message     ║
 * ║  broker. Publishers emit topics, subscribers listen. Token-based       ║
 * ║  unsubscribe for precise control.                                      ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 *
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │  STORY TO REMEMBER: A radio station (PubSub) broadcasts on channels    │
 * │  (topics). Listeners tune in (subscribe) and get a ticket (token).     │
 * │  They can tear up the ticket to stop listening (unsubscribe).          │
 * └──────────────────────────────────────────────────────────────────────────┘
 *
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │  VISUAL DIAGRAM                                                        │
 * │                                                                        │
 * │   Publisher ──publish("news", data)──►  PubSub Hub                     │
 * │                                          │                             │
 * │                          ┌───────────────┼───────────────┐             │
 * │                          ▼               ▼               ▼             │
 * │                     Subscriber A    Subscriber B    Subscriber C       │
 * │                     (token: 1)      (token: 2)      (token: 3)        │
 * │                                                                        │
 * │   unsubscribe(2) ──► removes Subscriber B from "news" topic           │
 * └──────────────────────────────────────────────────────────────────────────┘
 *
 * PROBLEM: Implement PubSub with subscribe(topic, cb), publish(topic, data),
 *          unsubscribe(token). subscribe returns a unique token.
 *
 * RUN: node docs/javascript/29-machine-coding/10-pub-sub.js
 */

// ═══════════════════════════════════════════════════════════════════════════
// IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════════

function createPubSub() {
  const topics = {};    // { topicName: [ { token, callback } ] }
  let tokenCounter = 0;

  function subscribe(topic, callback) {
    if (!topics[topic]) {
      topics[topic] = [];
    }
    const token = ++tokenCounter;
    topics[topic].push({ token, callback });
    return token;
  }

  function publish(topic, data) {
    if (!topics[topic]) return false;
    topics[topic].forEach((subscriber) => {
      subscriber.callback(data, topic);
    });
    return true;
  }

  function unsubscribe(token) {
    for (const topic in topics) {
      const idx = topics[topic].findIndex((s) => s.token === token);
      if (idx !== -1) {
        topics[topic].splice(idx, 1);
        if (topics[topic].length === 0) delete topics[topic];
        return true;
      }
    }
    return false;
  }

  function getSubscribers(topic) {
    return topics[topic] ? topics[topic].length : 0;
  }

  return { subscribe, publish, unsubscribe, getSubscribers };
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST CASES
// ═══════════════════════════════════════════════════════════════════════════

console.log("═══ TEST A: Basic subscribe and publish ═══");
const ps = createPubSub();

const token1 = ps.subscribe("news", (data) => {
  console.log("A: Subscriber 1 got news:", data);
});
const token2 = ps.subscribe("news", (data) => {
  console.log("A: Subscriber 2 got news:", data);
});

ps.publish("news", { headline: "JS is awesome" });
// A: Subscriber 1 got news: { headline: 'JS is awesome' }
// A: Subscriber 2 got news: { headline: 'JS is awesome' }

console.log("\n═══ TEST B: Multiple topics ═══");
ps.subscribe("sports", (data) => {
  console.log("B: Sports subscriber got:", data);
});

ps.publish("sports", "Goal scored!");
ps.publish("news", "Breaking update");
// B: Sports subscriber got: Goal scored!
// A: Subscriber 1 got news: Breaking update
// A: Subscriber 2 got news: Breaking update

console.log("\n═══ TEST C: Unsubscribe with token ═══");
console.log("C: Subscribers before unsubscribe:", ps.getSubscribers("news"));
const removed = ps.unsubscribe(token1);
console.log("C: Unsubscribe token1 success:", removed);
console.log("C: Subscribers after unsubscribe:", ps.getSubscribers("news"));

ps.publish("news", "After unsubscribe");
// Only subscriber 2 fires

console.log("\n═══ TEST D: Publish to non-existent topic ═══");
const result = ps.publish("weather", "Sunny");
console.log("D: Publish to unknown topic returned:", result);

console.log("\n═══ TEST E: Unsubscribe invalid token ═══");
const badRemove = ps.unsubscribe(9999);
console.log("E: Unsubscribe invalid token returned:", badRemove);

console.log("\n═══ TEST F: Topic callback receives topic name ═══");
const ps2 = createPubSub();
ps2.subscribe("alerts", (data, topic) => {
  console.log(`F: Received on [${topic}]:`, data);
});
ps2.publish("alerts", "Server down!");

console.log("\n═══ TEST G: Unsubscribe cleans up empty topic ═══");
const ps3 = createPubSub();
const t = ps3.subscribe("temp", () => {});
console.log("G: Before remove:", ps3.getSubscribers("temp"));
ps3.unsubscribe(t);
console.log("G: After remove:", ps3.getSubscribers("temp"));

// ═══════════════════════════════════════════════════════════════════════════
// FOLLOW-UP QUESTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * 1. How would you add a subscribeOnce(topic, cb) that auto-unsubscribes?
 * 2. How would you add wildcard topic matching (e.g., "news.*")?
 * 3. How would you make publish async (notify subscribers asynchronously)?
 * 4. How does this differ from the Observer pattern?
 * 5. How would you add error handling if a subscriber throws?
 */

// ═══════════════════════════════════════════════════════════════════════════
// INTERVIEW ANSWER
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║  "PubSub decouples event producers and consumers. I use a topics map   ║
 * ║  storing arrays of {token, callback}. subscribe() pushes and returns   ║
 * ║  an incrementing token. publish() iterates the topic's array and       ║
 * ║  calls each callback. unsubscribe() finds and removes by token.       ║
 * ║  Time: O(n) publish/unsubscribe, O(1) subscribe. Space: O(n)."        ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */
