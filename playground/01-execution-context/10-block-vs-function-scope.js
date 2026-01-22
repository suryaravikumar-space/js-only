// CHALLENGE: Block Scope vs Function Scope
//
// What prints? What throws error?

function test() {
  if (true) {
    var a = 1;
    let b = 2;
    const c = 3;
  }

  console.log(a);
  // console.log(b);  // Uncomment to see error
}

test();
