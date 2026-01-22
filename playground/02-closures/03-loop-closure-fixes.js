// CHALLENGE 03: Loop Closure Fixes
//
// What prints for A and B?

// Fix 1: IIFE
function createWithIIFE() {
  var result = [];
  for (var i = 0; i < 3; i++) {
    (function(j) {
      result.push(function() { return j; });
    })(i);
  }
  return result;
}

// Fix 2: let
function createWithLet() {
  var result = [];
  for (let i = 0; i < 3; i++) {
    result.push(function() { return i; });
  }
  return result;
}

var iifeFuncs = createWithIIFE();
var letFuncs = createWithLet();

console.log('A:', iifeFuncs[0](), iifeFuncs[1](), iifeFuncs[2]());
console.log('B:', letFuncs[0](), letFuncs[1](), letFuncs[2]());
