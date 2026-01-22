/**
 * CHALLENGE 09: setInterval Behavior
 *
 * What is the output after 250ms?
 */

var count = 0;

var id = setInterval(function() {
  count++;
  console.log('Tick:', count);

  if (count >= 3) {
    clearInterval(id);
    console.log('Done');
  }
}, 50);

console.log('Started');

// OUTPUT (after ~250ms):
//   ?
//   ?
//   ?
//   ?
//   ?
