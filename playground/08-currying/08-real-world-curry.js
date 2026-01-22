// CHALLENGE 08: Real-World Currying Examples
//
// What prints for A, B, C, D?

// API endpoint builder
var buildUrl = baseUrl => endpoint => params => {
  var query = Object.entries(params)
    .map(([k, v]) => `${k}=${v}`)
    .join('&');
  return `${baseUrl}${endpoint}?${query}`;
};

var apiUrl = buildUrl('https://api.example.com');
var usersEndpoint = apiUrl('/users');

console.log('A:', usersEndpoint({ page: 1, limit: 10 }));

// Event handler factory
var handleEvent = eventType => handler => element => {
  return { element, eventType, handler: handler.name || 'anonymous' };
};

var onClick = handleEvent('click');
var onClickLog = onClick(function logClick() {});

console.log('B:', onClickLog('button'));

// Validation builder
var validate = rules => value => {
  return rules.every(rule => rule(value));
};

var isRequired = v => v !== '' && v !== null && v !== undefined;
var minLength = min => v => v.length >= min;
var maxLength = max => v => v.length <= max;

var validateUsername = validate([isRequired, minLength(3), maxLength(20)]);

console.log('C:', validateUsername('john'));
console.log('D:', validateUsername('ab'));
