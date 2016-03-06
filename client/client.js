'use strict';

var client = {
    serverUrl: 'http://localhost:8080/calculate',
    resultsElement: $('.results'),
    init: function() {
        cache.init();
        this.printHistory();
    },
    // clear results element and then populate it with the history items
    printHistory: function() {
        var self = this;
        this.resultsElement.html('');
        cache.history.forEach(function(line) {
            $('<li/>')
                .addClass('history-line')
                .text(line)
                .appendTo(self.resultsElement);
        });
    },
    // clear history
    clear: function() {
        cache.clear();
        this.resultsElement.html('');
    },
    // submit form data and add solution to cache on success
    submitOperation: function(arg1, op, arg2) {
        var self = this;
        $.ajax({
            async: false,
            url: this.serverUrl,
            data: {
                arg1: arg1,
                op: op,
                arg2: arg2
            }
        }).done(function(data) {
            cache.add(data);
            self.printHistory();
        });
    },
    submit: function() {
        var operation = $('.operation').val().split(' ');
        if (operation.length < 3) {
            alert('Invalid operation length. Separate the elements of the operation with space.')
        }
        var arg1 = operation[0];
        var op = operation[1];
        var arg2 = operation[2];

        while (operation.length > 1) {
            this.submitOperation(arg1, op, arg2);
            operation = operation.slice(3);
            operation.unshift(cache.history[0].split(' ')[4]);
            arg1 = operation[0];
            op = operation[1];
            arg2 = operation[2];
        }

    }
};