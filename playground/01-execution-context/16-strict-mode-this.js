// CHALLENGE: Strict Mode and this
//
// What does each one print?

function normalFunction() {
  console.log(this);
}

function strictFunction() {
  'use strict';
  console.log(this);
}

normalFunction();
strictFunction();
