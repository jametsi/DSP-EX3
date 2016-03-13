'use strict';

var client = {
    serverUrl: 'http://localhost:8080',
    calculatorInput: $('.calculator-input'),
    sineInput: $('.sine-input'),
    resultsElement: $('.results'),
    finalResultElement: $('.final-result'),
    sinePlotContainer: $('.sine-plot'),
    init: function () {
        cache.init();
        this.printHistory();
    },
    // clear results element and then populate it with the history items
    printHistory: function () {
        var self = this;
        this.resultsElement.html('');
        cache.history.forEach(function (line) {
            $('<li/>')
                .addClass('history-line')
                .text(line)
                .appendTo(self.resultsElement);
        });
    },
    // clear history
    clear: function () {
        cache.clear();
        this.resultsElement.html('');
    },
    // submit form data and add solution to cache on success
    submitOperation: function (arg1, op, arg2) {
        var self = this;
        $.ajax({
            async: false,
            url: this.serverUrl + '/calculate',
            data: {
                arg1: arg1,
                op: op,
                arg2: arg2
            }
        }).done(function (data) {
            cache.add(data);
            self.printHistory();
        });
    },
    processCalculation: function (operationString) {
        var operation = operationString.split(' ');
        while (operation.length > 1) {
            if (operation.length < 3) {
                alert('Invalid operation length. Remember to separate elements of the operation with space.')
            }
            var arg1 = operation[0];
            var op = operation[1];
            var arg2 = operation[2];
            this.submitOperation(arg1, op, arg2);
            operation = operation.slice(3);
            operation.unshift(cache.history[0].split(' ')[4]);
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