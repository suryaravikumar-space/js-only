/**
 * ================================================================
 * QUESTION: "Your company has 5 teams using React, Vue, Angular,
 *            and Svelte. Design a shared component library
 *            that works across all of them."
 * ================================================================
 *
 * ASKED AT: Amazon (SDE2 Frontend System Design), Google (L5 UI Platform),
 *           Shopify, Atlassian, Salesforce
 * TYPE:     Frontend System Design
 *
 * Sources:
 *   - Web Components spec: https://html.spec.whatwg.org/multipage/custom-elements.html
 *   - Lit (Google): https://lit.dev
 *   - custom-elements-everywhere.com — framework compatibility scores
 *   - GitHub Elements: https://github.com/github/github-elements (real production use)
 *   - Shoelace (now Web Awesome): Web Component library used in production
 *   - Style Dictionary (Amazon): https://amzn.github.io/style-dictionary
 *   - GreatFrontEnd System Design: https://www.greatfrontend.com/front-end-system-design-playbook
 *
 * ================================================================
 * YOUR STORY TO THE INTERVIEWER:
 * ================================================================
 *
 * "At my previous company, we had this exact problem. Marketing used Vue,
 *  the main product was React, and the mobile team was evaluating Svelte.
 *  Every team had their own Button, Modal, and Input component.
 *  They all looked slightly different. Users noticed.
 *
 *  We evaluated 3 approaches:
 *
 *  APPROACH A: Rewrite everything in React, make other teams adapt.
 *  → Teams refused. Too much migration work. Political problem too.
 *
 *  APPROACH B: Build in Web Components, wrap for each framework.
 *  → This is what we chose. Here's why..."
 *
 * ================================================================
 * VISUAL: THE ARCHITECTURE
 * ================================================================
 *
 *                    ┌─────────────────────┐
 *                    │   DESIGN TOKENS     │  ← Single source of truth
 *                    │   (colors, spacing, │     JSON → CSS vars, JS, iOS
 *                    │    typography)       │     Tool: Style Dictionary
 *                    └────────┬────────────┘
 *                             │
 *                    ┌────────▼────────────┐
 *                    │   WEB COMPONENTS    │  ← Framework-agnostic
 *                    │   (Custom Elements  │     Uses design tokens
 *                    │    + Shadow DOM)    │     Built with Lit or Stencil
 *                    └────────┬────────────┘
 *                             │
 *            ┌────────────────┼────────────────┐
 *            │                │                │
 *   ┌────────▼──────┐ ┌──────▼───────┐ ┌──────▼───────┐
 *   │ React Wrapper  │ │ Vue works    │ │ Svelte works │
 *   │ (needed — React│ │ natively ✅  │ │ natively ✅  │
 *   │  has custom    │ │              │ │              │
 *   │  event issues) │ │              │ │              │
 *   └───────────────┘ └──────────────┘ └──────────────┘
 *
 *   WHY?
 *   Web Components = browser-native. Like <video> or <input>.
 *   Every framework can render a <video> tag. Same for <ds-button>.
 *
 * ================================================================
 * EXAMPLE: A REAL WEB COMPONENT
 * ================================================================
 */

// This runs in ANY framework or plain HTML. No build step needed.

class DsButton extends HTMLElement {
  static get observedAttributes() {
    return ["variant", "size", "disabled"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  // Like componentDidMount in React
  connectedCallback() {
    this._render();
  }

  // Like componentDidUpdate — runs when attributes change
  attributeChangedCallback() {
    this._render();
  }

  _render() {
    const variant = this.getAttribute("variant") || "primary";
    const size = this.getAttribute("size") || "md";
    const disabled = this.hasAttribute("disabled");

    // Shadow DOM = styles are ENCAPSULATED
    // Page CSS cannot break this component. This component cannot break page CSS.
    this.shadowRoot.innerHTML = `
      <style>
        /* Design tokens as CSS custom properties — set once at :root level */
        button {
          font-family: var(--ds-font-family, system-ui);
          border: none;
          border-radius: var(--ds-radius-md, 6px);
          cursor: ${disabled ? "not-allowed" : "pointer"};
          opacity: ${disabled ? "0.5" : "1"};
          font-weight: 600;
        }

        /* Sizes */
        .sm  { padding: 6px 12px;  font-size: var(--ds-font-sm, 13px); }
        .md  { padding: 8px 16px;  font-size: var(--ds-font-md, 14px); }
        .lg  { padding: 12px 24px; font-size: var(--ds-font-lg, 16px); }

        /* Variants */
        .primary   { background: var(--ds-primary, #2563eb); color: white; }
        .secondary { background: var(--ds-secondary, #e2e8f0); color: #1e293b; }
        .danger    { background: var(--ds-danger, #dc2626); color: white; }
      </style>
      <button class="${variant} ${size}" ${disabled ? "disabled" : ""}>
        <slot></slot>
      </button>
    `;
  }
}

customElements.define("ds-button", DsButton);

/**
 * ================================================================
 * HOW EACH FRAMEWORK USES IT
 * ================================================================
 *
 * ┌─────────────┬──────────────────────────────────────────────────┐
 * │ FRAMEWORK   │ USAGE                                           │
 * ├─────────────┼──────────────────────────────────────────────────┤
 * │ Plain HTML  │ <ds-button variant="primary">Save</ds-button>   │
 * │             │                                                  │
 * │ Vue         │ <ds-button variant="primary"                    │
 * │             │   @ds-click="save">Save</ds-button>             │
 * │             │ Works natively. Vue score: 100%                  │
 * │             │                                                  │
 * │ Svelte      │ <ds-button variant="primary"                    │
 * │             │   on:ds-click={save}>Save</ds-button>           │
 * │             │ Works natively. Svelte score: 100%               │
 * │             │                                                  │
 * │ Angular     │ <ds-button variant="primary"                    │
 * │             │   (ds-click)="save()">Save</ds-button>          │
 * │             │ Add CUSTOM_ELEMENTS_SCHEMA to module. Score: 100%│
 * │             │                                                  │
 * │ React       │ ⚠️ Needs a wrapper (React < 19 doesn't pass    │
 * │             │ event listeners to custom elements properly)     │
 * │             │ Score: ~71% without wrapper, 100% with wrapper   │
 * └─────────────┴──────────────────────────────────────────────────┘
 *
 * Source: https://custom-elements-everywhere.com
 */

// ================================================================
// REACT WRAPPER (why it's needed and how to auto-generate)
// ================================================================

// React problem: <ds-button onDs-click={fn}> does NOT work.
// React sets attributes as properties, not event listeners for custom events.

// Solution: Use @lit/react to auto-generate wrappers:
/*
import React from 'react';
import { createComponent } from '@lit/react';
import { DsButton } from './ds-button';

export const Button = createComponent({
  tagName: 'ds-button',
  elementClass: DsButton,
  react: React,
  events: {
    onClick: 'ds-click',   // maps React onClick → custom ds-click event
  },
});

// React team uses it like normal React:
// <Button variant="primary" onClick={handleSave}>Save</Button>
*/

// ================================================================
// DESIGN TOKENS — THE REAL FOUNDATION
// ================================================================

/**
 * Tokens = the design decisions (colors, spacing, fonts) stored as data.
 * NOT code. Data. Then compiled to whatever platform needs them.
 *
 * Tool: Style Dictionary (by Amazon) — industry standard
 * Used by: Salesforce Lightning, Adobe Spectrum, IBM Carbon
 *
 * tokens.json (you write THIS):
 * {
 *   "color": {
 *     "primary": { "value": "#2563eb" },
 *     "danger":  { "value": "#dc2626" }
 *   },
 *   "spacing": {
 *     "sm": { "value": "8px" },
 *     "md": { "value": "16px" }
 *   }
 * }
 *
 * Style Dictionary outputs:
 *
 *   CSS:    :root { --ds-primary: #2563eb; --ds-spacing-sm: 8px; }
 *   JS:     export const COLOR_PRIMARY = '#2563eb';
 *   SCSS:   $ds-primary: #2563eb;
 *   iOS:    static let primary = UIColor(hex: "#2563eb")
 *   Android: <color name="ds_primary">#2563eb</color>
 *
 * One JSON file → 5 platforms. Change once, updates everywhere.
 */

// ================================================================
// WHO ACTUALLY DOES THIS IN PRODUCTION?
// ================================================================

/**
 * ┌────────────────┬─────────────────────┬───────────────────────┐
 * │ COMPANY        │ APPROACH            │ PROOF                 │
 * ├────────────────┼─────────────────────┼───────────────────────┤
 * │ GitHub         │ Web Components      │ github/github-elements│
 * │                │ (Custom Elements)   │ on GitHub (open src)  │
 * ├────────────────┼─────────────────────┼───────────────────────┤
 * │ Salesforce     │ Lightning Web       │ lwc.dev               │
 * │                │ Components (LWC)    │ (their own WC engine) │
 * ├────────────────┼─────────────────────┼───────────────────────┤
 * │ Google         │ Lit (Material Web)  │ lit.dev               │
 * │                │ Web Components      │ material-web on npm   │
 * ├────────────────┼─────────────────────┼───────────────────────┤
 * │ Ionic          │ Stencil → WC        │ stenciljs.com         │
 * │                │ (compiles to native)│ ionic.io              │
 * ├────────────────┼─────────────────────┼───────────────────────┤
 * │ Adobe          │ Spectrum WC         │ opensource.adobe.com  │
 * │                │ + Design Tokens     │                       │
 * └────────────────┴─────────────────────┴───────────────────────┘
 *
 * These are not experiments. These are production systems serving
 * millions of users. You can cite them in interviews.
 */

// ================================================================
// TRADE-OFFS TO MENTION (shows maturity)
// ================================================================

/**
 * INTERVIEWER FOLLOW-UP: "What are the downsides?"
 *
 * YOU SAY:
 *
 * 1. Shadow DOM makes styling harder
 *    "Teams can't override component styles with global CSS.
 *     We solved this with CSS custom properties (design tokens)
 *     and the ::part() selector for targeted overrides."
 *
 * 2. React needs wrappers
 *    "React < 19 doesn't handle custom element events properly.
 *     We auto-generated React wrappers using @lit/react.
 *     React 19 improved this significantly."
 *
 * 3. SSR is limited
 *    "Web Components rely on browser APIs (customElements.define).
 *     For SSR, we used Declarative Shadow DOM (Chrome 90+, Firefox 123+)
 *     or rendered a fallback and hydrated on client."
 *
 * 4. Testing across frameworks
 *    "We tested the core Web Component once with @open-wc/testing.
 *     Framework wrappers got thin integration tests.
 *     Design tokens validated with visual regression (Chromatic)."
 *
 * AVOID SAYING: "Web Components are perfect."
 * Interviewers want to hear trade-offs. It shows real experience.
 */

// ================================================================
// CHEAT SHEET
// ================================================================

/**
 * When interviewer says...             │  You say...
 * ─────────────────────────────────────┼──────────────────────────────
 * "How would you share components?"    │  Web Components + Design Tokens
 * "Why not just use React?"            │  Not every team uses React.
 *                                      │  WC is browser-native.
 * "What about styling?"                │  Shadow DOM + CSS custom props
 *                                      │  + ::part() for overrides
 * "What about React compatibility?"    │  @lit/react auto-generates wrappers.
 *                                      │  React 19 has better native support.
 * "What about complex components?"     │  Headless pattern — share logic,
 *                                      │  each framework renders its own UI.
 *                                      │  Examples: TanStack Table, Radix.
 * "Who does this in production?"       │  GitHub, Salesforce, Google,
 *                                      │  Adobe, Ionic. All open source.
 */
