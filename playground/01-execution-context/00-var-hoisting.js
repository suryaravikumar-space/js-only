var a = 1;

function outer() {
  console.log(a);
  var a = 2;
  console.log(a);
}

outer();
