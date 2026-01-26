// CHALLENGE 00: What is a Closure?
//
// What prints for A and B?

// function outer() {
//   var secret = 'I am hidden';

//   function inner() {
//     return secret;
//   }

//   return inner;
// }

// var getSecret = outer();

// console.log('A:', getSecret());
// console.log('B:', typeof secret);





/**
 * 
 * What is a CLOSURE?
 * 
 * 
 * 
 */

function outerFunction(){
  var x = 10;
  function innerFunction(){
    return x;
  }
  return innerFunction;
}

let accessInner = outerFunction();
console.log(accessInner())