// CHALLENGE 01: Closure Scope Chain
//
// What prints for A and B?

var global = 'G';

function outer() {
  var outerVar = 'O';

  function middle() {
    var middleVar = 'M';

    function inner() {
      var innerVar = 'I';
      return global + outerVar + middleVar + innerVar;
    }

    return inner;
  }

  return middle;
}

var getMiddle = outer();
var getInner = getMiddle();

console.log('A:', getInner());

var outerVar = 'GLOBAL-O';
console.log('B:', getInner());
