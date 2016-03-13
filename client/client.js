'use strict';

var client = {
    serverUrl: 'http://localhost:8080',
    calculatorInput: $('.calculator-input'),
    sineInput: $('.sine-input'),
    finalResultElement: $('.final-result'),
    sinePlotContainer: $('.sine-plot'),
    requestCounter: 0,
    init: function () {
        cal_history.init($('.history'));
        cache.init(parseInt($('.cache-size').val()));
    },
    // submit form data and add solution to history on success
    submitOperation: function (arg1, op, arg2) {
        var self = this;
        var returnValue = null;
        $.ajax({
            async: false,
            url: this.serverUrl + '/calculate',
            data: {
                arg1: arg1,
                op: op,
                arg2: arg2
            }
        }).done(function (data) {
            self.requestCounter++;
            returnValue = data;
        });
        return returnValue;
    },
    processCalculation: function (operationString, addToHistory) {
        var simplifiedString = this.simplifyInLoop(operationString);
        var operation = simplifiedString.split(' ');

        // if we didn't get the result yet, we must calculate the remaining operations serverside
        while (operation.length > 1) {
            if (operation.length < 3) {
                alert('Invalid operation length. Remember to separate elements of the operation with space.')
            }
            var arg1 = operation[0];
            var op = operation[1];
            var arg2 = operation[2];

            var solution = this.submitOperation(arg1, op, arg2);
            var result = solution.split(' ')[4];
            if (addToHistory) {
                cal_history.add(solution);
            }
            if (cache.size > 0) {
                cache.add(solution);
            }

            operation = operation.slice(3);
            operation.unshift(result);

            simplifiedString = this.simplifyInLoop(operation.join(' '));
            operation = simplifiedString.split(' ');
        }
        return operation[0];
    },
    submit: function () {
        var operationString = this.calculatorInput.val();
        var value = this.processCalculation(operationString, true);
        this.finalResultElement.text(operationString + ' = ' + value);
    },
    simplify: function (operationString) {
        var parts = operationString.split(' ');
        while (true) {
            if (parts.length < 3) {
                break;
            }
            var cacheKey = parts[0] + parts[1] + parts[2];
            var value = cache.get(cacheKey);
            if (value !== null) {
                parts.splice(0, 3, value);
            } else {
                break;
            }
        }
        return parts.join(' ');
    },
    simplifyCalcInput: function () {
        this.calculatorInput.val(this.simplify(this.calculatorInput.val()));
    },
    simplifyInLoop: function (operationString) {
        while (true) {
            var tempString = this.simplify(operationString);
            if (tempString.length === operationString.length) {
                break;
            }
            operationString = tempString;
        }
        return operationString;
    },
    plotSineOnServer: function () {
        var plotContainer = $('.sine-plot');
        plotContainer.html("");
        var self = this;
        $.ajax({
            url: this.serverUrl + '/plot_sine',
            data: {
                sineFunction: self.sineInput.val()
            }
        }).done(function (data) {
            self.showServerPlot(data);
        });
    },
    showServerPlot: function (url) {
        $('<img/>')
            .attr('src', url)
            .appendTo(this.sinePlotContainer);
    },
    plotSineOnClient: function () {
        var plotContainer = $('.sine-plot');
        plotContainer.html("");
        plot.init(plotContainer);
        plot.plotSine(plot.generateData());
    },
    plotSineOnClientAndServer: function () {
        this.requestCounter = 0;
        var plotContainer = $('.sine-plot');
        plotContainer.html("");
        plot.init(plotContainer);
        plot.plotSine(plot.getDataFromServer());
        console.log('Requests made during plotting: ' + this.requestCounter);
    }
};