'use strict';

var client = {
    serverUrl: 'http://localhost:8080',
    calculatorInput: $('.calculator-input'),
    sineInput: $('.sine-input'),
    finalResultElement: $('.final-result'),
    sinePlotContainer: $('.sine-plot'),
    init: function () {
        cal_history.init($('.history'));
    },
    // submit form data and add solution to history on success
    submitOperation: function (arg1, op, arg2) {
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
            returnValue = data;
        });
        return returnValue;
    },
    processCalculation: function (operationString, addToHistory) {
        var operation = operationString.split(' ');
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
                console.log('adding to history!');
                cal_history.add(solution);
            }
            operation = operation.slice(3);
            operation.unshift(result);
        }
        return operation[0];
    },
    submit: function () {
        var operationString = this.calculatorInput.val();
        var value = this.processCalculation(operationString, true);
        this.finalResultElement.text(operationString + ' = ' + value);
    },
    plotSineOnServer: function () {
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
        this.sinePlotContainer.html("");
        $('<img/>')
            .attr('src', url)
            .appendTo(this.sinePlotContainer);
    },
    plotSineOnClient: function () {
        plot.init(this.sinePlotContainer);
        plot.plotSine(plot.generateData());
    },
    plotSineOnClientAndServer: function () {
        plot.init(this.sinePlotContainer);
        plot.plotSine(plot.getDataFromServer());
    }
};