// CHALLENGE: Combined Tricky Question
//
// How many console.logs actually execute?
// What does each one print?

var a = 10;

function outer() {
  console.log(a);   // What prints?
  console.log(b);   // What prints?

  var a = 20;
  let b = 30;

  function inner() {
    console.log(a);  // What prints?
  }

  inner();
}

outer();
