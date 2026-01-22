// CHALLENGE: The Ultimate this Test
//
// What prints for A, B, and C?

var obj = {
  name: 'Object',

  regular: function() {
    console.log('A:', this.name);

    var inner = function() {
      console.log('B:', this.name);
    };
    inner();

    var arrow = () => {
      console.log('C:', this.name);
    };
    arrow();
  }
};

var name = 'Global';
obj.regular();
