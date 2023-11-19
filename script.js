class Calculator { //Defines the calculator logic
  constructor(previousOperandTextElement, currentOperandTextElement) { //Initialize the cal to display current and previous operands
    this.previousOperandTextElement = previousOperandTextElement
    this.currentOperandTextElement = currentOperandTextElement
    this.clear()
  }

clear() { //Clears the current operand, previous operand, and operation.
    this.currentOperand = ''
    this.previousOperand = ''
    this.operation = undefined
  }

delete() { //Removes the last digit from the current operand.
    this.currentOperand = this.currentOperand.toString().slice(0, -1)
  }

appendNumber(number) { //Appends a number or a decimal point to the current operand, preventing multiple decimal points.
    if (number === '.' && this.currentOperand.includes('.')) return
    this.currentOperand = this.currentOperand.toString() + number.toString()
  }

chooseOperation(operation) { //sets the current based on the operation button onclick
   if (this.currentOperand === '') return //If there is a current operand, it computes the result if there is also a previous operand.
    if (this.previousOperand !== '') {
      this.compute()
    }
    this.operation = operation
    this.previousOperand = this.currentOperand
    this.currentOperand = ''
  }

compute() { //Performs operation using current and previous operands
    let computation
    const prev = parseFloat(this.previousOperand)
    const current = parseFloat(this.currentOperand)
    //Updates the current operand with the result.
    if (isNaN(prev) || isNaN(current)) return
    switch (this.operation) {
      case '+':
        computation = prev + current
        break
      case '-':
        computation = prev - current
        break
      case '*':
        computation = prev * current
        break
      case '÷':
        computation = prev / current
        break
      default:
        return
    }
    this.currentOperand = computation
    this.operation = undefined
    this.previousOperand = ''
  }

getDisplayNumber(number) { //Formats a number as a string for display, handling integer and decimal parts separately.
    const stringNumber = number.toString()
    const integerDigits = parseFloat(stringNumber.split('.')[0])
    const decimalDigits = stringNumber.split('.')[1]
    let integerDisplay
    if (isNaN(integerDigits)) {
      integerDisplay = ''
    } else {
      integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 })
    }
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`
    } else {
      return integerDisplay
    }
  }

updateDisplay() { //Display current and previous operands
    this.currentOperandTextElement.innerText =
      this.getDisplayNumber(this.currentOperand)
    if (this.operation != null) {
      this.previousOperandTextElement.innerText =
        `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
    } else {
      this.previousOperandTextElement.innerText = ''
    }
  }
}

//Reference to present the button on the calculator
//Selects HTML elements representing number buttons, operation buttons, equals button, delete button, clear button, and text elements for displaying operands.
const numberButtons = document.querySelectorAll('[data-number]') 
const operationButtons = document.querySelectorAll('[data-operation]')
const equalsButton = document.querySelector('[data-equals]')
const deleteButton = document.querySelector('[data-delete]')
const allClearButton = document.querySelector('[data-all-clear]')
const previousOperandTextElement = document.querySelector('[data-previous-operand]')
const currentOperandTextElement = document.querySelector('[data-current-operand]')

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)

//The acceptedKeys array is used to filter out valid number keys (0-9).
acceptedKeys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
window.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') { //The Enter key triggers the compute method to perform the calculation, and then the updateDisplay method is called to update the display.
    calculator.compute();
    calculator.updateDisplay();

  } else if (e.key === 'Backspace') { //The Backspace key triggers the delete method to remove the last digit.
    calculator.delete();
    calculator.updateDisplay();

  } else if (e.key === '*' || e.key === '/' || e.key === '+' || e.key === '-') {//The *, /, +, and - keys trigger the chooseOperation method to set the operation based on the pressed key.
    calculator.chooseOperation(e.key);
    calculator.updateDisplay();

  } else if (!acceptedKeys.includes(e.key) && e.key !== '.') {
    calculator.appendNumber(e.key);
    calculator.updateDisplay();
  }
});

//This loop iterates over each of the buttons and adds an event listener to handle the button click event.
numberButtons.forEach(button => { 
  button.addEventListener('click', () => {
    calculator.appendNumber(button.innerText)
    calculator.updateDisplay()
  })
})

operationButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.chooseOperation(button.innerText)
    calculator.updateDisplay()
  })
})

equalsButton.addEventListener('click', button => {
  calculator.compute()
  calculator.updateDisplay()
})

allClearButton.addEventListener('click', button => {
  calculator.clear()
  calculator.updateDisplay()
})

deleteButton.addEventListener('click', button => {
  calculator.delete()
  calculator.updateDisplay()
})