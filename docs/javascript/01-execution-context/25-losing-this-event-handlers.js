/**
 * CHALLENGE 25: Losing `this` in Event Handlers
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE CRITICAL LESSON                                                        ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ When you pass a method as a CALLBACK, you lose `this`!                     ║
 * ║                                                                            ║
 * ║   button.addEventListener('click', obj.method);  ← BROKEN!                 ║
 * ║                                                                            ║
 * ║ The method is passed as a standalone function reference.                   ║
 * ║ When the event fires, it's called WITHOUT the object context.              ║
 * ║                                                                            ║
 * ║ SOLUTIONS:                                                                 ║
 * ║   1. bind()           →  obj.method.bind(obj)                              ║
 * ║   2. Arrow wrapper    →  () => obj.method()                                ║
 * ║   3. Function wrapper →  function() { obj.method(); }                      ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

var button = {
  label: 'Submit',
  onClick: function() {
    return 'Clicked: ' + this.label;
  }
};

console.log('A:', button.onClick());

var handler = button.onClick;
console.log('B:', handler());

var boundHandler = button.onClick.bind(button);
console.log('C:', boundHandler());

function simulateClick(callback) {
  return callback();
}

console.log('D:', simulateClick(button.onClick));
console.log('E:', simulateClick(button.onClick.bind(button)));

/**
 * OUTPUT:
 *   A: Clicked: Submit
 *   B: Clicked: undefined
 *   C: Clicked: Submit
 *   D: Clicked: undefined
 *   E: Clicked: Submit
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: button.onClick()                                                        ║
 * ║ ───────────────────                                                        ║
 * ║   • Method call: object.method()                                           ║
 * ║   • this = button (object before the dot)                                  ║
 * ║   • this.label = 'Submit'                                                  ║
 * ║   • Result: 'Clicked: Submit'                                              ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ B: handler()  ← LOST this!                                                 ║
 * ║ ────────────                                                               ║
 * ║   • handler = button.onClick (just a function reference)                   ║
 * ║   • handler() is a STANDALONE call                                         ║
 * ║   • this = global object (non-strict mode)                                 ║
 * ║   • global.label = undefined                                               ║
 * ║   • Result: 'Clicked: undefined'                                           ║
 * ║                                                                            ║
 * ║   THIS IS THE BUG everyone encounters!                                     ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ C: boundHandler()                                                          ║
 * ║ ─────────────────                                                          ║
 * ║   • boundHandler = button.onClick.bind(button)                             ║
 * ║   • bind() PERMANENTLY locks this = button                                 ║
 * ║   • Even as standalone call, this = button                                 ║
 * ║   • Result: 'Clicked: Submit'                                              ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ D: simulateClick(button.onClick)  ← CALLBACK LOSES this!                   ║
 * ║ ────────────────────────────────                                           ║
 * ║   • button.onClick is passed as argument (just a reference)                ║
 * ║   • Inside simulateClick, it's called as callback()                        ║
 * ║   • callback() is a standalone call                                        ║
 * ║   • this = global                                                          ║
 * ║   • Result: 'Clicked: undefined'                                           ║
 * ║                                                                            ║
 * ║   THIS IS EXACTLY what happens with addEventListener!                      ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ E: simulateClick(button.onClick.bind(button))                              ║
 * ║ ─────────────────────────────────────────────                              ║
 * ║   • Passing a BOUND function                                               ║
 * ║   • Even when called as callback(), this = button                          ║
 * ║   • Result: 'Clicked: Submit'                                              ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHY THIS HAPPENS WITH EVENT HANDLERS                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ When you do this:                                                           │
 * │                                                                             │
 * │   element.addEventListener('click', button.onClick);                        │
 * │                                                                             │
 * │ You're NOT saying "call button's onClick method".                           │
 * │ You're saying "here's a function reference, call it later".                 │
 * │                                                                             │
 * │ Internally, it's like:                                                      │
 * │                                                                             │
 * │   var callback = button.onClick;  // Just the function, no object!         │
 * │   // ... later, when click happens ...                                      │
 * │   callback.call(element);  // this = DOM element, not button!              │
 * │                                                                             │
 * │                                                                             │
 * │ VISUAL:                                                                     │
 * │                                                                             │
 * │   ┌──────────────────────────────────────────────────────────────────┐      │
 * │   │ addEventListener('click', button.onClick)                        │      │
 * │   │                           ──────────────                         │      │
 * │   │                                 │                                │      │
 * │   │                                 ▼                                │      │
 * │   │   Extracts function:  function() { return '...' + this.label }  │      │
 * │   │                                                                  │      │
 * │   │   Stores it. Forgets about button object entirely.              │      │
 * │   │                                                                  │      │
 * │   │   When click fires:                                              │      │
 * │   │     callback();  ← Standalone call! this = window or element     │      │
 * │   └──────────────────────────────────────────────────────────────────┘      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ 6 SOLUTIONS TO FIX LOST `this`                                              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. bind() - Most common solution                                            │
 * │    element.addEventListener('click', button.onClick.bind(button));          │
 * │                                                                             │
 * │ 2. Arrow function wrapper                                                   │
 * │    element.addEventListener('click', () => button.onClick());               │
 * │                                                                             │
 * │ 3. Regular function wrapper                                                 │
 * │    element.addEventListener('click', function() {                           │
 * │      button.onClick();                                                      │
 * │    });                                                                      │
 * │                                                                             │
 * │ 4. Store reference to this (var self = this)                                │
 * │    var button = {                                                           │
 * │      label: 'Submit',                                                       │
 * │      init: function() {                                                     │
 * │        var self = this;                                                     │
 * │        element.addEventListener('click', function() {                       │
 * │          console.log(self.label);  // Use self, not this                    │
 * │        });                                                                  │
 * │      }                                                                      │
 * │    };                                                                       │
 * │                                                                             │
 * │ 5. Use arrow function as method (ES6)                                       │
 * │    class Button {                                                           │
 * │      label = 'Submit';                                                      │
 * │      onClick = () => {  // Arrow captures this from class                   │
 * │        console.log(this.label);                                             │
 * │      }                                                                      │
 * │    }                                                                        │
 * │                                                                             │
 * │ 6. Bind in constructor                                                      │
 * │    class Button {                                                           │
 * │      constructor() {                                                        │
 * │        this.onClick = this.onClick.bind(this);                              │
 * │      }                                                                      │
 * │    }                                                                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ COMPARISON: WHICH SOLUTION TO USE?                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ┌──────────────────┬─────────────────┬─────────────────┬──────────────────┐ │
 * │ │ Solution         │ Pros            │ Cons            │ Best For         │ │
 * │ ├──────────────────┼─────────────────┼─────────────────┼──────────────────┤ │
 * │ │ .bind()          │ Clean, explicit │ Creates new fn  │ One-off handlers │ │
 * │ │                  │                 │ each time       │                  │ │
 * │ ├──────────────────┼─────────────────┼─────────────────┼──────────────────┤ │
 * │ │ Arrow wrapper    │ Concise         │ Can't remove    │ Inline handlers  │ │
 * │ │                  │                 │ event listener  │                  │ │
 * │ ├──────────────────┼─────────────────┼─────────────────┼──────────────────┤ │
 * │ │ Bind in class    │ Once per        │ Slightly more   │ React classes    │ │
 * │ │ constructor      │ instance        │ code            │                  │ │
 * │ ├──────────────────┼─────────────────┼─────────────────┼──────────────────┤ │
 * │ │ Arrow as class   │ Cleanest for    │ Each instance   │ Modern React/    │ │
 * │ │ field            │ classes         │ gets own copy   │ TypeScript       │ │
 * │ └──────────────────┴─────────────────┴─────────────────┴──────────────────┘ │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ REAL WORLD EXAMPLE: React Class Component                                   │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ // BROKEN - loses this                                                      │
 * │ class Button extends React.Component {                                      │
 * │   handleClick() {                                                           │
 * │     console.log(this.props.label);  // ERROR: this is undefined!            │
 * │   }                                                                         │
 * │   render() {                                                                │
 * │     return <button onClick={this.handleClick}>Click</button>;               │
 * │   }                                                                         │
 * │ }                                                                           │
 * │                                                                             │
 * │ // FIXED - Solution 1: bind in constructor                                  │
 * │ class Button extends React.Component {                                      │
 * │   constructor(props) {                                                      │
 * │     super(props);                                                           │
 * │     this.handleClick = this.handleClick.bind(this);  // ← Fix              │
 * │   }                                                                         │
 * │   handleClick() {                                                           │
 * │     console.log(this.props.label);  // Works!                               │
 * │   }                                                                         │
 * │ }                                                                           │
 * │                                                                             │
 * │ // FIXED - Solution 2: arrow function class field                           │
 * │ class Button extends React.Component {                                      │
 * │   handleClick = () => {  // ← Arrow function captures this                  │
 * │     console.log(this.props.label);  // Works!                               │
 * │   }                                                                         │
 * │ }                                                                           │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "When you pass a method as a callback (like to addEventListener or          │
 * │  setTimeout), you're extracting just the function reference - the object    │
 * │  context is lost. When the callback is eventually invoked, it's called      │
 * │  as a standalone function, so `this` becomes the global object (or          │
 * │  undefined in strict mode).                                                 │
 * │                                                                             │
 * │  The most common solutions are:                                             │
 * │  1. Use bind() to permanently attach this:                                  │
 * │     element.addEventListener('click', obj.method.bind(obj))                 │
 * │                                                                             │
 * │  2. Use an arrow function wrapper:                                          │
 * │     element.addEventListener('click', () => obj.method())                   │
 * │                                                                             │
 * │  In React, this is why we either bind methods in the constructor or         │
 * │  use arrow functions as class fields - both ensure `this` refers to         │
 * │  the component instance when the handler is called."                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/01-execution-context/25-losing-this-event-handlers.js
 */
