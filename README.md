# kosimpletaxjs
kosimpletax for javascript

## Installing
Using npm:
```
npm install kosimpletax
```

## example
소득세:
```
var kosimpletax = require('kosimpletax');
var tax = kosimpletax.simpletax(25000000);

//22100
```

실수령액:
```
var real = kosimpletax.realsalary(25000000);

//22691320
```

모든 공제액 보기:
```
var all = kosimpletax.all(25000000);

//{ origin: 250000000,
  period: 'year',
  tax: 65182720.00000001,
  local: 6518160,
  pension: 2527200,
  health: 8036160,
  longterm: 683760,
  employ: 1617120,
  deducted: 84565120,
  real: 165434880 }
```

## License
```
MIT
```
