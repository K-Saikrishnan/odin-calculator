'use strict';

const operations = Object.freeze({
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b,
  }),
  specialNumbers = Object.freeze({
    Infinity: '∞',
    '-Infinity': '-∞',
    NaN: 'NaN',
  });

let firstOperand, secondOperand, operator;

const previous = document.getElementById('previous');
const current = document.getElementById('current');
const clearBtn = document.getElementById('clear');
const equalsBtn = document.getElementById('equals');
const deleteBtn = document.getElementById('delete');
const decimalBtn = document.getElementById('decimal');
const numberBtns = document.querySelectorAll('.number');
const operatorBtns = document.querySelectorAll('.operator');

window.addEventListener('load', () => clear());
clearBtn.addEventListener('click', () => clear());
numberBtns.forEach((btn) => btn.addEventListener('click', () => appendNumber(btn.innerText)));
operatorBtns.forEach((btn) => btn.addEventListener('click', () => setOperator(btn.innerText)));
decimalBtn.addEventListener('click', () => appendDecimalPoint());
deleteBtn.addEventListener('click', () => removeDigit());
equalsBtn.addEventListener('click', () => calculateResult());

function clear() {
  firstOperand = '0';
  secondOperand = operator = '';
  setCurrent();
  setPrevious();
}

function appendNumber(number) {
  if (!operator) {
    if (firstOperand === '0') firstOperand = '';
    firstOperand += number;
    setCurrent(firstOperand);
  } else {
    if (secondOperand === '0') secondOperand = '';
    secondOperand += number;
    setCurrent(secondOperand);
  }
}

function setOperator(op) {
  if (getCurrentValue() === '') setCurrent('0');
  if (!firstOperand) return;
  if (operator && secondOperand) calculateResult();
  operator = op;
  setCurrent('');
  setPrevious(firstOperand, operator);
}

function appendDecimalPoint() {
  const currentValue = getCurrentValue(),
    DECIMAL = '.';

  if (currentValue.includes(DECIMAL)) return;
  else if (!currentValue) {
    setCurrent('0.');
    return;
  }
  if (!operator) {
    firstOperand += DECIMAL;
    setCurrent(firstOperand);
  } else {
    secondOperand += DECIMAL;
    setCurrent(secondOperand);
  }
}

function removeDigit() {
  const currentValue = getCurrentValue();
  if (!currentValue) return;

  if (!operator) {
    firstOperand = firstOperand.slice(0, -1);
    setCurrent(firstOperand);
  } else {
    secondOperand = secondOperand.slice(0, -1);
    setCurrent(secondOperand);
  }
}

function calculateResult() {
  if (!operator || !firstOperand || !secondOperand) return;
  const result = calculate(operator, firstOperand, secondOperand);
  firstOperand = result;
  secondOperand = operator = '';
  setCurrent(result);
  setPrevious();
}

function calculate(operator, a, b) {
  const result = operations[operator](Number(a), Number(b));
  const rounded = Math.round(result * 1e10) / 1e10;
  return rounded.toString();
}

function getCurrentValue() {
  return current.innerText;
}

function setCurrent(value = '') {
  current.innerText = formatValue(value);
}

function setPrevious(value = '', operator = '') {
  previous.innerText = `${formatValue(value)} ${operator}`;
}

function formatValue(value) {
  if (specialNumbers[value]) return specialNumbers[value];

  // Limit the number of digits inside the display
  if (value.length > 13) value = Number(value).toExponential(5);
  return value;
}