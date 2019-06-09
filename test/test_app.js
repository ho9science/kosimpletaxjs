var kosimpletax = require('../index');


// var result = kosimpletax.simpletax(30060000);
// var result = kosimpletax.simpletax(48120000, 4, 2);
// var result = kosimpletax.simpletax(1497500, 2, 0, "monthly");
// var result = kosimpletax.simpletax(5010000, 5, 3, "monthly")
// var result = kosimpletax.simpletax(12000000, 6, 4, "monthly")
// var result = kosimpletax.simpletax(30000000, 6, 4, "monthly")
// var result = kosimpletax.simpletax(50000000, 6, 4, "monthly")
// var result = kosimpletax.simpletax(1340000, 3, 0, "monthly")
var result = kosimpletax.simpletax(1060000, 1, 0, "monthly")
// var result = kosimpletax.simpletax(3980000, 12, 0, "monthly")
//problem
// var result = kosimpletax.simpletax(3980000, 2, 2, "monthly")
console.log("세금", result)

var real = kosimpletax.realsalary(30500000);
console.log(real)

var all = kosimpletax.all(30500000);
console.log(all);

var all_monthly = kosimpletax.all(2500000, 1, 0, year="monthly");
console.log(all_monthly)