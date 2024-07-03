// arguments is an array in js and this array contains all values that are passed into a function
console.log(arguments);
console.log(require('module').wrapper);

//module.exports
const C = require('./b-cal.js')

//exports
// const {add ,divide} = require('./c-cal.js'); //obj destructing
const calc1 = require('./c-cal.js');
calc1.add(1,2);
calc1.divide(4,5);

//caching
require('./d-caching.js')()
require('./d-caching.js')()
require('./d-caching.js')()
//this module it only loaded once
  