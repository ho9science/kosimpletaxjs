# kosimpletaxjs

kosimpletaxjs는 [근로소득 간이세액표](https://www.nts.go.kr/support/support_03_etc01.asp)의 내용을 바탕으로 javascript를 사용하여 개발하였습니다. 연말 정산을 위해 근로 소득 간이 세액을 계산하거나 근로자의 4대 보험 중 근로자가 부담하는 건강보험료, 국민연금료, 고용보험료, 장기요양보험료를 계산할 수 있는 자바스크립트 라아브러리입니다. 연봉, 월급에 대해 과세되는 금액을 계산할 수 있습니다. 

> * 원천징수의무자가 매월분의 근로소득을 지급하는 때에는 「소득세법」제134조 및 같은법 시행령 제194조에 따라 근로소득 간이세액표(시행령 별표2)에 의하여 원천징수하도록 규정하고 있습니다.
> * 근로소득 간이세액표는 연말정산시 추가납부 등에 따른 근로자의 부담을 분산하기 위해 월 급여수준과 공제대상 부양가족 수 별로 매월 원천징수해야하는 세액을 정한 표입니다

***계산된 금액은 실제 징수 금액과 차이가 있을 수 있습니다.***

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
