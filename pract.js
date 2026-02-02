// /home/surya/js-only/pract.js

var numbers= [1,2,3,4,5]

// Map

// var doubled = numbers.map(
//     function(num){
//         return num * 2
//     }
// )

// console.log(doubled)

// var evens = numbers.filter(function(num){
//     return num % 2 == 0;
// })

// console.log(evens);


/*
FOR EACH
*/
// var sum = 0;
// var foreach = numbers.forEach(function(num){
//     return sum+=num;
// })

// console.log(sum);


/*
Reduce
*/

// const product = numbers.reduce((acc, num)=>acc * num, 1)
// console.log(product);


// [1,2].forEach(function(element) {
//     console.log(element)
// });



// console.log("AA");
// setTimeout(() => {
//     console.log("BB");
    
// }, 100);


// setTimeout(()=>{
// console.log("CC");

// },0)


const divide = (a, b, callback) =>{
    if(b==0){
        callback(new Error("Cannot divided by zero"), null)
    }else{
        callback(null, a/b)
    }
}

divide(20, 0, (err, result)=>{
    if(err){
        console.log("A:", err.message)
    }else{
        console.log("A: ", result);
        
    }
})
