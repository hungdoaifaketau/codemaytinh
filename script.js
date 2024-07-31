const calculator = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
};

const colors = ['#FF5733', '#FFBD33', '#DBFF33', '#75FF33', '#33FF57', '#33FFBD', '#3380FF'];
let colorIndex = 0;

function updateDisplay() {
    const display = document.querySelector('.calculator-screen');
    display.value = calculator.displayValue;
}

function handleKeyPress(target) {
    if (target.classList.contains('operator')) {
        handleOperator(target.value);
        return;
    }

    if (target.classList.contains('decimal')) {
        inputDecimal(target.value);
        return;
    }

    if (target.classList.contains('all-clear')) {
        resetCalculator();
        return;
    }

    if (target.classList.contains('function')) {
        handleFunction(target.value);
        return;
    }

    inputDigit(target.value);
}

function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator } = calculator;
    const inputValue = parseFloat(displayValue);

    if (operator && calculator.waitingForSecondOperand) {
        calculator.operator = nextOperator;
        return;
    }

    if (firstOperand == null && !isNaN(inputValue)) {
        calculator.firstOperand = inputValue;
    } else if (operator) {
        const result = calculate(firstOperand, inputValue, operator);

        calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
        calculator.firstOperand = result;
    }

    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;
    updateDisplay();
}

function handleFunction(func) {
    const { displayValue } = calculator;
    const inputValue = parseFloat(displayValue);

    if (func === '%') {
        calculator.displayValue = `${inputValue / 100}`;
    } else if (func === 'sqrt') {
        calculator.displayValue = `${Math.sqrt(inputValue)}`;
    } else if (func === '^') {
        calculator.operator = '^';
        calculator.firstOperand = inputValue;
        calculator.waitingForSecondOperand = true;
    }

    updateDisplay();
}

function calculate(firstOperand, secondOperand, operator) {
    if (operator === '+') return firstOperand + secondOperand;
    if (operator === '-') return firstOperand - secondOperand;
    if (operator === '*') return firstOperand * secondOperand;
    if (operator === '/') return firstOperand / secondOperand;
    if (operator === '^') return Math.pow(firstOperand, secondOperand);

    return secondOperand;
}

function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = calculator;

    if (waitingForSecondOperand === true) {
        calculator.displayValue = digit;
        calculator.waitingForSecondOperand = false;
    } else {
        calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
    }

    updateDisplay();
}

function inputDecimal(dot) {
    if (calculator.waitingForSecondOperand === true) {
        calculator.displayValue = '0.';
        calculator.waitingForSecondOperand = false;
        return;
    }

    if (!calculator.displayValue.includes(dot)) {
        calculator.displayValue += dot;
    }

    updateDisplay();
}

function resetCalculator() {
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
    updateDisplay();
}

function updateBackgroundColor() {
    colorIndex = (colorIndex + 1) % colors.length;
    document.body.style.backgroundColor = colors[colorIndex];
}

setInterval(updateBackgroundColor, 1000);

const keys = document.querySelector('.calculator-keys');
keys.addEventListener('click', (event) => {
    const { target } = event;
    if (!target.matches('button')) return;

    handleKeyPress(target);
});

updateDisplay();
