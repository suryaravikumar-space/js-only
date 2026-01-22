var a = 'global';

function outer() {
  var b = 'outer';

  function inner() {
    var c = 'inner';
    console.log(a, b, c);
  }

  inner();
  console.log(a, b, c);
}

outer();
