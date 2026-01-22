// CHALLENGE 04: Callback Hell / Pyramid of Doom
//
// What prints for A, B, C, D, E?

// Simulating async operations
function getUser(id, callback) {
  setTimeout(function() {
    callback(null, { id: id, name: 'Alice' });
  }, 10);
}

function getOrders(userId, callback) {
  setTimeout(function() {
    callback(null, [{ orderId: 1, item: 'Book' }]);
  }, 10);
}

function getOrderDetails(orderId, callback) {
  setTimeout(function() {
    callback(null, { orderId: orderId, price: 29.99 });
  }, 10);
}

console.log('A:', 'Start');

// Callback Hell - nested callbacks
getUser(1, function(err, user) {
  console.log('B:', user.name);

  getOrders(user.id, function(err, orders) {
    console.log('C:', orders[0].item);

    getOrderDetails(orders[0].orderId, function(err, details) {
      console.log('D:', details.price);

      // Imagine more nesting here...
      console.log('E:', 'All done');
    });
  });
});

// This demonstrates the "pyramid of doom"
// Each level depends on the previous result
