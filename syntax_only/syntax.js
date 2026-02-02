// const x = 5
// x = 10

// console.log('x::: ', x);

// const person  = {
    // name: "jane", 
    // age : 25
// }
// 
// person.name = "Jane mery"
// person.age = 26
// person.city = 'HYD'
// 
// console.log('Modified person::: ',person);
// 
// person = {name:"Bod cow"}
// 
// console.log('Modified person::: ',person);
// 

// const numbers = [1,2,3]

// numbers[0] = 100
// console.log('numbers::: ', numbers);
// numbers.pop()
// // numbers.push(4)
// console.log("modified",numbers);

// numbers = [5,3,2]

// console.log('numbers::: ', numbers);


// const config = Object.freeze({
//     api:{
//         Url: "http://api.example.com",
//     },
//     timeout: 5000
// });


// config.api.Url = "htpps://hacker.com";
// config.newKey = "value";
// console.log('config after modification::: ', config);




// // Deep Freeze

// function deepFreeze(obj){
//     Object.freeze(obj);
//     Object.keys(obj).forEach(key =>{
//         if(typeof obj[key] === 'object' && obj[key] !== null){
//             deepFreeze(obj[key]);
//         }
//     });
//     return obj;
// }


// const x = 23 
// x = 34
// console.log('x::: ', x);




// function varExample(){
//     if(true){
//         var x = 20
//     }
    
//     // console.log('x::: ', x);
// }

// varExample()





// function varExample(){
//     if(true){
//         let x = 20
//     }
    
//     // console.log('x::: ', x);
// }

// varExample()





// if(true){
//     var leakedVar = "I esaped!" 
// }

// console.log('leakedVar::: ', leakedVar);



// setTimeout(() => {
//     for(let i = 0; i < 3; i++){
//         setTimeout(() => {
//            // console.log('let i::: ', i); 
//             // console.log('Inner::: ');
//         }, 200);

//     }
//     // console.log('outer ::: ');
// }, 150);


// function scopeDemo() {
//   // var is function-scoped
//   if (true) {
//     var funcScoped = "visible everywhere";
//   }
//   // console.log("funcScoped:", funcScoped); // ✅ Works

//   // let/const are block-scoped
//   if (true) {
//     let blockScoped = "only here";
//     const alsoBlockScoped = "me too";
//   }
//   // console.log(blockScoped); // ❌ ReferenceError
// }

// scopeDemo();


// let x = "global"
// function shadowDemo(){
//     let x = "function variable is shadowed the global variable"
//     // console.log('x::: ', x);

//     if(true){
//         let x = "block";
//         // console.log('x::: ', x);
//     }
    
//     // console.log('After block::: ', x);
    
// }

// shadowDemo()

// console.log('myvar::: ', myvar);
// let myvar;
// myvar = 20
// let myvar = 80
// console.log('myvar::: ', myvar);


// const value = 1
// switch(value){
//     case 1:{ 
//     let message = "hello"
//     }
//     case 2:
//     let message = "Note"
// }







// sayHi();
// const sayHi = function(){
//     // console.log("Hi");
    
// }

// const greet = () => // console.log('Hello::: ' )
// greet()

// var x = 20
// function guess(){
//     // console.log('x::: ', x);
//     var x = 20
// }

// guess()


// var a = 22
// function scope()
// {
//     // console.log('a::: ', a);
//     var a = 2;
//     // console.log('a::: ', a);
// }

// scope()

// try {
//   // console.log(myLet); // ReferenceError!
//   let myLet = 20;
// } catch(e) {
//   // console.log("Error:", e.message);
// }


// console.log('x::: ', x);
// let x;
// console.log('x::: ', x);


// const sayHi = function(){// console.log("Hi");}
// try {
    
//    sayHi(); 
// } catch (e) {
//     // console.log('e.message::: ', e.message);
// }

// const sayHi = function(){// console.log("Hi");}

/*
  var sayHi;
  sayHi(); is undefined
  sayHi = function (){} assignment stays here
*/

// console.log(NaN === NaN);
// console.log(NaN == NaN);


// // console.log(typeof NaN);// Test 1: + operator weirdness
// console.log(2 / "0");
// console.log("5" - 2);
// console.log('1est set::: ');
// // Test 2: typeof traps
// console.log(typeof null);
// console.log(typeof undefined);
// console.log(typeof []);
// console.log(':::2nd set' );
// // Test 3: Array checking
// console.log(Array.isArray([]));
// console.log(typeof []);
// console.log(':::3nd set' );

// // Test 4: Equality
// console.log(null == undefined);
// console.log(null === undefined);
// console.log('4th set::: ' );
// // Test 5: NaN
// console.log(typeof NaN);
// console.log(NaN === NaN);
// console.log(Number.isNaN(NaN));



// reduce


// function sum(...numbers){
//  return numbers.reduce((a, b) => a + b, 0)
// }

// const x = sum(2,3,4,5,6);
// console.log('a::: ', x);

let a  = []

if(a){
  console.log('Yes::: ' );
}else
  console.log('a::: ', a);