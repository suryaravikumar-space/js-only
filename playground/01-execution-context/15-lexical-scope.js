// CHALLENGE: Lexical Scope vs Dynamic Scope
//
// What prints: 10 or 20?
// Think: WHERE is inner() DEFINED?

var x = 10;

function outer() {
  var x = 20;
  inner();       // called from here, but...
}

function inner() {
  console.log(x);  // where does inner look for x?
}

outer();
