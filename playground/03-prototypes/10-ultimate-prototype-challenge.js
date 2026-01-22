// CHALLENGE 10: Ultimate Prototype Challenge
//
// What prints for A, B, C, D, E, F, G, H?

function Shape(color) {
  this.color = color;
}

Shape.prototype.getColor = function() {
  return this.color;
};

Shape.prototype.describe = function() {
  return 'A ' + this.color + ' shape';
};

function Rectangle(color, width, height) {
  Shape.call(this, color);
  this.width = width;
  this.height = height;
}

Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;

Rectangle.prototype.getArea = function() {
  return this.width * this.height;
};

Rectangle.prototype.describe = function() {
  return 'A ' + this.color + ' rectangle ' + this.width + 'x' + this.height;
};

var rect = new Rectangle('blue', 10, 5);

console.log('A:', rect.color);
console.log('B:', rect.getColor());
console.log('C:', rect.getArea());
console.log('D:', rect.describe());
console.log('E:', rect instanceof Rectangle);
console.log('F:', rect instanceof Shape);
console.log('G:', rect.hasOwnProperty('getArea'));
console.log('H:', Rectangle.prototype.hasOwnProperty('getArea'));
