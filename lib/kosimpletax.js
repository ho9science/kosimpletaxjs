/**
 * Create a new instance of Kosimpletax
 */
function Kosimpletax(salary) {
  salary = salary;
  tax = simpletax;
}
var CHONWON = 1000;
var MANWON = 10000;
/**
 * salary lower limit :
 * year 12720000 (1272만원)
 * monthly 1060000 (백육만원)
 * 
 * salary upper limit : 
 * year 120000000 (1억2천만원) 
 * monthly 10000000 (1000만원)
 * 
 * family value have to more than minor value
 * 
 */
var simpletax = function (salary, family = 1, minor = 0, year = "year") {
  if(family <= minor){
    return new Error("family must be exceed a minor and 0")
  }
  var family_target = family+minor;
  if(family_target > 11){
    return exceed_family_eleven(salary, family_target, year);
  }
  if (year == "year") { //연봉, 월급 구분
    if (salary <= 12720000) {
      return 0;
    }else if(salary > 120000000){
      return execeed_thousand(salary, family, minor);
    }
    salary /= 12;
  } else {
    if (salary < 1060000) {
      return 0;
    }else if(salary > 10000000){
      return execeed_thousand(salary*12, family, minor);
    }
  }
  var monthly_salary = median_income_section(salary)
  salary = monthly_salary * 12
  var earned_income_deduction = calc_earned_income_deduction(salary);
  var earned_income_amount = calc_earned_income_amount(salary, earned_income_deduction);
  var personal_allowance = calc_personal_allowance(family, minor); // 가족, 20세미만
  var annuity_insurance = calc_annuity_insurance_deduction(salary); 
  var special_income_deduction = calc_special_income_deduction(salary, family); //부양가족수에 따라 다른 공제식
  var tax_base = calc_tax_base(earned_income_amount, personal_allowance, annuity_insurance, special_income_deduction);
  var tax_assessment = calc_tax_assessment(tax_base);
  var tax_credit = calc_earned_income_tax_credit(tax_assessment, salary);
  var finalized_tax_amount = calc_finalized_tax_amount(tax_assessment, tax_credit);
  var tax = calc_ease_tax_amount(finalized_tax_amount);
  return tax
}
var realsalary = function (salary, family = 1, minor = 0, year = "year", excemption = 100000) {
  var origin = salary;
  var salary = set_exemption(salary, year, excemption);
  var tax = simpletax(salary, family, minor, year);
  var local = localtax(tax);
  var monthly_salary = salary /12;
  var pension = national_pension(monthly_salary);
  var health = health_insurance(monthly_salary);
  var longterm = longterm_insurance(health);
  var employ = employment_insurance(monthly_salary);
  var deducted = tax + local + pension + health + longterm + employ;
  if(year == "year"){
    var real = origin - deducted*12;
    return real;
  }else{
    var real = origin - deducted;
    return real;
  }
}
var all = function(salary, family = 1, minor =0, year = "year"){
  var origin = salary;
  var salary = set_exemption(salary, year);
  var tax = simpletax(salary, family, minor, year);
  var local = localtax(tax);
  var monthly_salary = salary /12;
  var pension = national_pension(monthly_salary);
  var health = health_insurance(monthly_salary);
  var longterm = longterm_insurance(health);
  var employ = employment_insurance(monthly_salary);
  var deducted = tax + local + pension + health + longterm + employ;
  var real = origin - deducted
  if(year == "year"){
    tax = tax * 12;
    local = local *  12;
    pension = pension * 12;
    health = health * 12;
    longterm = longterm * 12;
    employ = employ * 12;
    deducted = tax + local + pension + health + longterm + employ;
    real = origin - deducted;
  }else{
    year = "monthly";
  }
  const targetSalary = {
    origin: origin,
    period: year,
    tax: tax,
    local: local,
    pension: pension,
    health: health,
    longterm: longterm,
    employ: employ,
    deducted: deducted,
    real: real
  }
  return targetSalary;
}
function median_income_section(pay) {
  var str_pay = pay / 1000;
  var median = 0
  if (pay < 1060 * CHONWON) {
    median = 0
  } else if (pay < 1500 * CHONWON) {
    if (str_pay - Math.floor(str_pay / 10) * 10 < 5) {
      median = Math.floor(str_pay / 10) * 10 + 2.5
    } else {
      median = Math.floor(str_pay / 10) * 10 + 7.5
    }
    median = median * 1000
  } else if (pay < 3000 * CHONWON) {
    median = Math.floor(str_pay / 10) * 10 + 5
    median = median * 1000
  } else if (pay < 10000 * CHONWON) {
    var point = str_pay - Math.floor(str_pay / 100) * 100;
    if (0 <= point && point < 20) {
      median = Math.floor(str_pay / 100) * 100 + 10
    } else if (20 <= point && point < 40) {
      median = Math.floor(str_pay / 100) * 100 + 30
    } else if (40 <= point && point < 60) {
      median = Math.floor(str_pay / 100) * 100 + 50
    } else if (60 <= point && point < 80) {
      median = Math.floor(str_pay / 100) * 100 + 70
    } else {
      median = Math.floor(str_pay / 100) * 100 + 90
    }
    median = median * CHONWON
  } else {
    median = pay
  }
  return median
}
function calc_earned_income_deduction(salary) { //근로소득공제
  var amount_deducted = 0;
  if (salary <= 500 * MANWON) {
    amount_deducted = salary * 0.7;
  } else if (salary <= 1500 * MANWON) {
    amount_deducted = (350 * MANWON) + ((salary - 500 * MANWON) * 0.40);
  } else if (salary <= 4500 * MANWON) {
    amount_deducted = 750 * MANWON + ((salary - 1500 * MANWON) * 0.15);
  } else if (salary <= 10000 * MANWON) {
    amount_deducted = 1200 * MANWON + ((salary - 4500 * MANWON) * 0.05);
  } else if (salary > 10000 * MANWON) {
    amount_deducted = 1475 * MANWON + ((salary - 10000 * MANWON) * 0.02);
  }
  return amount_deducted
}
function calc_earned_income_amount(salary, amount_deducted) { //근로소득금액
  var earned_income_amount = salary - amount_deducted;
  return earned_income_amount
}
function calc_personal_allowance(number_of_people = 1, number_of_less_than_twenty = 0) { //인적공제
  var number_of_family = number_of_people+number_of_less_than_twenty;
  if(number_of_family > 11){
    return number_of_family * 150 * MANWON;
  }
  return number_of_family * 150 * MANWON;
}
function calc_annuity_insurance_deduction(salary) { //연금보험료공제
  var monthly_salary = salary / 12;
  var annuity_insurance_amount = calc_national_pension(monthly_salary) * 12;
  if (monthly_salary <= 30 * MANWON) {
    annuity_insurance_amount = 15.66 * MANWON;
  } else if (monthly_salary >= 448 * MANWON) {
    annuity_insurance_amount = 242.46 * MANWON;
  }
  return annuity_insurance_amount
}
function special_exemption_one(salary) { //특별 소득 공제
  if (salary <= 3000 * MANWON) {
    return 310 * MANWON + salary * 0.04
  } else if (salary <= 4500 * MANWON) {
    return 310 * MANWON + (salary * 0.04) - ((salary - 3000 * MANWON) * 0.05)
  } else if (salary <= 7000 * MANWON) {
    return 310 * MANWON + (salary * 0.015)
  } else if (salary <= 12000 * MANWON) {
    return 310 * MANWON + (salary * 0.005)
  }
}
function special_exemption_two(salary) {
  if (salary <= 3000 * MANWON) {
    return 360 * MANWON + salary * 0.04
  } else if (salary <= 4500 * MANWON) {
    return 360 * MANWON + (salary * 0.04) - ((salary - 3000 * MANWON) * 0.05)
  } else if (salary <= 7000 * MANWON) {
    return 360 * MANWON + (salary * 0.02)
  } else if (salary <= 12000 * MANWON) {
    return 360 * MANWON + (salary * 0.01)
  }
}
function special_exemption_multiple(salary) {
  var additional_exemption = 0;
  if(salary<4000*MANWON){
    additional_exemption = 0;
  }else{
    additional_exemption = (salary - 4000 * MANWON) * 0.04;
  }
  if (salary <= 3000 * MANWON) {
    return 500 * MANWON + salary * 0.07 + additional_exemption
  } else if (salary <= 4500 * MANWON) {
    return 500 * MANWON + (salary * 0.07) - ((salary - 3000 * MANWON) * 0.05) + additional_exemption
  } else if (salary <= 7000 * MANWON) {
    return 500 * MANWON + (salary * 0.05) + additional_exemption
  } else if (salary <= 12000 * MANWON) {
    return 500 * MANWON + (salary * 0.03) + additional_exemption
  }
}
function calc_special_income_deduction(salary, number_of_people = 1) {
  if (number_of_people == 1) {
    return special_exemption_one(salary)
  } else if (number_of_people == 2) {
    return special_exemption_two(salary)
  } else if (number_of_people >= 3) {
    return special_exemption_multiple(salary)
  }
}
function calc_tax_base(earned_income, personal_allowance, annuity_insurance, special_exemption) { //과세표준
  var tax_base = earned_income - personal_allowance - annuity_insurance - special_exemption;
  if(tax_base<0){
    return 0;
  }
  return tax_base;
}
function calc_tax_assessment(tax_base) { //산출세액
  var temp_tax_base = 0
  if (tax_base <= 1200 * MANWON) {
    temp_tax_base = tax_base * 0.06
  } else if (tax_base <= 4600 * MANWON) {
    temp_tax_base = 72 * MANWON + (tax_base - 1200 * MANWON) * 0.15
  } else if (tax_base <= 8800 * MANWON) {
    temp_tax_base = 582 * MANWON + (tax_base - 4600 * MANWON) * 0.24
  } else if (tax_base <= 15000 * MANWON) {
    temp_tax_base = 1590 * MANWON + (tax_base - 8800 * MANWON) * 0.35
  } else if (tax_base <= 30000 * MANWON) {
    temp_tax_base = 3760 * MANWON + (tax_base - 15000 * MANWON) * 0.38
  } else if (tax_base <= 50000 * MANWON) {
    temp_tax_base = 9460 * MANWON + (tax_base - 30000 * MANWON) * 0.4
  } else if (tax_base > 50000 * MANWON) {
    temp_tax_base = 17460 * MANWON + (tax_base - 50000 * MANWON) * 0.42
  }
  return temp_tax_base - temp_tax_base % 10
}
function calc_earned_income_tax_credit(tax_assessment, salary) { //근로소득 세액공제
  var tax_credit = 0
  if (tax_assessment <= 50 * MANWON) {
    tax_credit = tax_assessment * 0.55;
  } else {
    tax_credit = 27.5 * MANWON + (tax_assessment - 50 * MANWON) * 0.3;
  }
  //간이세액표 상 근로소득공제 한도
  if (tax_credit > 66 * MANWON) {
    if (salary <= 5500 * MANWON) {
      tax_credit = 66 * MANWON;
    } else if (salary <= 7000 * MANWON) {
      tax_credit = 63 * MANWON;
    } else if (salary > 7000 * MANWON) {
      tax_credit = 50 * MANWON;
    }
  } else if (tax_credit > 63 * MANWON) {
    if (salary <= 7000 * MANWON) {
      tax_credit = 63 * MANWON;
    } else if (salary > 7000 * MANWON) {
      tax_credit = 50 * MANWON;
    }
  } else if (tax_credit > 50 * MANWON) {
    if (salary > 7000 * MANWON) {
      tax_credit = 50 * MANWON;
    }
  }
  return tax_credit - tax_credit % 10
}
function calc_finalized_tax_amount(tax_base, tax_credit) { //결정세액
  return tax_base - tax_credit
}
function calc_ease_tax_amount(finalized_tax_amount) { //간이세액
  var temp_amount = finalized_tax_amount / 12;
  return temp_amount - temp_amount % 10
}
function calc_national_pension(monthly_salary) { //국민연금
  // var trimmed_salary = monthly_salary - (monthly_salary % 1000); // apply or not 
  // var pension_share = trimmed_salary * 0.045;
  var pension_share = monthly_salary * 0.045;
  return pension_share - pension_share % 10
}
var national_pension = function(monthly_salary){
  if(monthly_salary<30*MANWON){
    monthly_salary = 30*MANWON;
  }else if(monthly_salary>468*MANWON){
    monthly_salary = 468*MANWON;
  }
  var trimmed_salary = monthly_salary - (monthly_salary % 1000); // 천원미만 절삭
  var pension_share = trimmed_salary * 0.045;
  return pension_share - pension_share % 10
}
var health_insurance = function(monthly_salary) { //건강보험
  var health_insurance = monthly_salary * 0.0646 * 0.5;
  return health_insurance - health_insurance % 10
}
var longterm_insurance = function(health_insurance) { //장기요양보험료
  var long_term_insurance = health_insurance * 0.0851;
  return long_term_insurance - long_term_insurance % 10
}
var employment_insurance = function(monthly_salary) { //고용보험
  var employment_insurance = monthly_salary * 0.0065;
  return employment_insurance - employment_insurance % 10
}
var localtax = function(tax) {
  var local_income_tax = tax * 0.1;
  return local_income_tax - local_income_tax % 10;
}
var simplelocaltax = function(salary, family=1, minor=0, year="year"){
  var tax = simpletax(salary, family, minor, year);
  return localtax(tax);
}
function set_exemption(salary, year = "year", exemption = 100000) {  
  if (year=="year") {
    if ((salary - exemption*12) >= 12720000) {
      salary = salary - exemption * 12;
    }else{
      return new Error("This function does not apply less than 12,720,000 of year");
    }
  } else {
    if ((salary - exemption) >= 1060000) {
      salary = salary - exemption;
    }else{
      return new Error("This function does not apply less than 1,060,000 of month");
    }
  }
  return salary
}
/**
 * salary lower limit 1200000000(1억2천만원)
 */
function execeed_thousand(salary, family=1, minor=0){
  if(salary < 120000000){
    return 0;
  }
  var a = simpletax(120000000, family, minor)
  var criteria = salary/MANWON/12;
  if(criteria <= 1400){
    criteria = criteria - 1000;
    var b = criteria*MANWON * 0.98 * 0.35;
    return a+b;
  }else if(criteria > 1400 && criteria <= 2800){
    var b = 400*MANWON * 0.98 * 0.35;
    criteria = criteria - 1400;
    var c = criteria*MANWON * 0.98 * 0.38;
    return a+b+c;
  }else if(criteria > 2800 && criteria <= 4500){
    var b = 400*MANWON * 0.98 * 0.35;
    var c = 1400*MANWON * 0.98 * 0.38;
    criteria = criteria - 2800;
    var d = criteria*MANWON * 0.98 * 0.40;
    return a+b+c+d;
  }else{
    var b = 400*MANWON * 0.98 * 0.35;
    var c = 1400*MANWON * 0.98 * 0.38;
    var d = 1700*MANWON * 0.98 * 0.40;
    criteria = criteria - 4500;
    var e = criteria*MANWON * 0.98 * 0.42;
    return a+b+c+d+e;
  }
}
/**
 * if family + minor more than 11, apply special formula
 */
function exceed_family_eleven(salary, family_target, year) {
  var add_family = family_target - 11;
  var eleven = simpletax(salary, 11, 0, year);
  if (eleven <= 0) {
    return 0;
  }
  var ten = simpletax(salary, 10, 0, year);
  return eleven - ((ten - eleven) * add_family);
}

module.exports.simpletax = simpletax;
module.exports.realsalary = realsalary;
module.exports.all = all;