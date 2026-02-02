/**
 * TOPIC: Compound Components — Parent Provides Context, Children Consume
 *
 * ╔════════════════════════════════════════════════════════╗
 * ║           THE GOLDEN RULE                             ║
 * ║  Compound components share implicit state. Parent     ║
 * ║  manages state, children read it via context. Like    ║
 * ║  <select> + <option> — they work TOGETHER.            ║
 * ╚════════════════════════════════════════════════════════╝
 *
 * ┌─── STORY TO REMEMBER ───┐
 * │ A TV remote (parent) has│
 * │ buttons (children). Each│
 * │ button doesn't have its │
 * │ own battery — they all  │
 * │ share the remote's power│
 * │ (context). Press a      │
 * │ button, the remote      │
 * │ handles the action.     │
 * └─────────────────────────┘
 *
 * ┌─── VISUAL DIAGRAM ───┐
 * │                       │
 * │  <Tabs>  ← owns state (activeIndex) │
 * │    <Tab index={0}> ← reads context  │
 * │    <Tab index={1}> ← reads context  │
 * │    <Panel index={0}> ← reads context│
 * │    <Panel index={1}> ← reads context│
 * │  </Tabs>                            │
 * └─────────────────────────────────────┘
 *
 * React code:
 *   <Tabs>
 *     <TabList>
 *       <Tab>One</Tab>
 *       <Tab>Two</Tab>
 *     </TabList>
 *     <TabPanels>
 *       <TabPanel>Content 1</TabPanel>
 *       <TabPanel>Content 2</TabPanel>
 *     </TabPanels>
 *   </Tabs>
 */

// --- Simulate shared context ---
function createContext() {
  let value = null;
  return {
    provide(val) { value = val; },
    consume() { return value; },
  };
}

// --- Compound Tabs component ---
function Tabs(children) {
  const ctx = createContext();
  let activeIndex = 0;

  const api = {
    getActive: () => activeIndex,
    setActive: (i) => { activeIndex = i; },
    ctx,
  };
  ctx.provide(api);
  return { run: () => children(api) };
}

function Tab(api, index, label) {
  const isActive = api.getActive() === index;
  console.log(`  <Tab "${label}"> ${isActive ? "ACTIVE" : "inactive"}`);
  return { select: () => api.setActive(index) };
}

function TabPanel(api, index, content) {
  if (api.getActive() === index) {
    console.log(`  <TabPanel> ${content}`);
  }
}

// A: Initial render — first tab active
console.log("A: Initial render (index 0 active)");
const tabs = Tabs((api) => {
  const t0 = Tab(api, 0, "Home");
  const t1 = Tab(api, 1, "Settings");
  TabPanel(api, 0, "Welcome home!");
  TabPanel(api, 1, "Settings page");
  return { t0, t1 };
});
const { t0, t1 } = tabs.run();

// B: Click second tab
console.log("\nB: Click 'Settings' tab (index 1)");
t1.select();
tabs.run();

// C: Click first tab again
console.log("\nC: Click 'Home' tab (index 0)");
t0.select();
tabs.run();

// D: Compound Toggle component
console.log("\nD: Compound Toggle pattern");
function Toggle(children) {
  let on = false;
  const api = {
    isOn: () => on,
    toggle: () => { on = !on; },
  };
  return { render: () => children(api), api };
}

const toggle = Toggle((api) => {
  console.log(`  <ToggleButton> ${api.isOn() ? "ON" : "OFF"}`);
});
toggle.render();
toggle.api.toggle();
toggle.render();
toggle.api.toggle();
toggle.render();

/**
 * OUTPUT:
 * A: Initial render (index 0 active)
 *   <Tab "Home"> ACTIVE
 *   <Tab "Settings"> inactive
 *   <TabPanel> Welcome home!
 *
 * B: Click 'Settings' tab (index 1)
 *   <Tab "Home"> inactive
 *   <Tab "Settings"> ACTIVE
 *   <TabPanel> Settings page
 *
 * C: Click 'Home' tab (index 0)
 *   <Tab "Home"> ACTIVE
 *   <Tab "Settings"> inactive
 *   <TabPanel> Welcome home!
 *
 * D: Compound Toggle pattern
 *   <ToggleButton> OFF
 *   <ToggleButton> ON
 *   <ToggleButton> OFF
 *
 * ┌─── INTERVIEW ANSWER ───┐
 * │ Compound components let parent + children share state  │
 * │ implicitly via context. The parent owns the state,     │
 * │ children consume it. Examples: Tabs, Accordion, Menu.  │
 * │ Benefits: flexible composition, clean API, separation  │
 * │ of concerns. Like HTML <select>/<option>.              │
 * └────────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/10-patterns/00-compound-components.js
 */
