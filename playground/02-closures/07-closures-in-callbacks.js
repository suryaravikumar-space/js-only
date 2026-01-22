// CHALLENGE 07: Closures in Callbacks
//
// What are the 6 outputs in order?

function setupDelayedLogs() {
  for (var i = 1; i <= 3; i++) {
    setTimeout(function() {
      console.log('var:', i);
    }, i * 100);
  }

  for (let j = 1; j <= 3; j++) {
    setTimeout(function() {
      console.log('let:', j);
    }, j * 100 + 500);
  }
}

setupDelayedLogs();

// Run this file and observe the output order!
