// CHALLENGE: The Classic Loop Problem
//
// What gets printed and why?

// PROBLEM: var (prints 3, 3, 3)
for (var i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i);
  }, 100);
}

// FIX: let (prints 0, 1, 2) — uncomment to test
// for (let i = 0; i < 3; i++) {
//   setTimeout(function() {
//     console.log(i);
//   }, 100);
// }
