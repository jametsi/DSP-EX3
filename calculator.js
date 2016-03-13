"use strict";

exports.calculate = function(num1, num2, op) {
    switch (op) {
        case "+":
            return num1 + num2;
            break;
        case "-":
            return num1 - num2;
            break;
        case "*":
            return num1 * num2;
            break;
        case "/":
            return num1 / num2;
            break;
        case "**":
            return Math.pow(num1, num2);
            break;
        default:
            return "Error: Operation " + op + " not defined!"
    }
};
