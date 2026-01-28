/**
 * Questions 31-40: Type Coercion
 *
 * Predict the output for each code snippet.
 */

// Question 31: String + Number
console.log("Q31a:", "5" + 3);
console.log("Q31b:", 5 + "3");
console.log("Q31c:", "5" + 3 + 2);
console.log("Q31d:", 5 + 3 + "2");

// Question 32: String - Number
console.log("Q32a:", "5" - 3);
console.log("Q32b:", "5" - "3");
console.log("Q32c:", "five" - 3);

// Question 33: Comparisons with type coercion
console.log("Q33a:", "10" > 9);
console.log("Q33b:", "10" > "9");
console.log("Q33c:", "apple" > "banana");

// Question 34: Boolean in arithmetic
console.log("Q34a:", true + true);
console.log("Q34b:", true + false);
console.log("Q34c:", true + "1");
console.log("Q34d:", false + null);

// Question 35: null and undefined coercion
console.log("Q35a:", null + 1);
console.log("Q35b:", undefined + 1);
console.log("Q35c:", null + undefined);
console.log("Q35d:", null + "1");

// Question 36: Object to primitive
console.log("Q36a:", {} + []);
console.log("Q36b:", [] + {});
console.log("Q36c:", {} + {});
console.log("Q36d:", [] + []);

// Question 37: Array coercion
console.log("Q37a:", [1] + [2]);
console.log("Q37b:", [1, 2] + [3, 4]);
console.log("Q37c:", [1] - [1]);
console.log("Q37d:", [2] * [3]);

// Question 38: Falsy values
console.log("Q38a:", Boolean(""));
console.log("Q38b:", Boolean(0));
console.log("Q38c:", Boolean("0"));
console.log("Q38d:", Boolean([]));
console.log("Q38e:", Boolean({}));
console.log("Q38f:", Boolean(null));

// Question 39: NaN quirks
console.log("Q39a:", NaN === NaN);
console.log("Q39b:", isNaN("hello"));
console.log("Q39c:", Number.isNaN("hello"));
console.log("Q39d:", typeof NaN);

// Question 40: Unary plus and minus
console.log("Q40a:", +"42");
console.log("Q40b:", +true);
console.log("Q40c:", +"hello");
console.log("Q40d:", +[]);
console.log("Q40e:", +[1]);
console.log("Q40f:", +[1, 2]);
