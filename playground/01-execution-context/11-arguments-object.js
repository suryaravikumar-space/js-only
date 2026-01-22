// CHALLENGE: The arguments Object
//
// Questions:
// 1. What is arguments? (type, contents)
// 2. What will each console.log print?
// 3. Where does arguments come from?

function sum() {
  console.log(arguments);
  console.log(arguments.length);
  console.log(arguments[0] + arguments[1]);
}

sum(3, 5, 7, 9);
