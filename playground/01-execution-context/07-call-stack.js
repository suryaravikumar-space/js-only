function first() {
  console.log('first start');
  second();
  console.log('first end');
}

function second() {
  console.log('second start');
  third();
  console.log('second end');
}

function third() {
  console.log('third start');
  console.log('third end');
}

first();
