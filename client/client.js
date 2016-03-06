'use strict';

var client = {
    history: [],
    serverUrl: 'http://localhost:8080/calculate',
    resultsElement: $('.results'),
    init: function() {
        this.printHistory();
    },
    // clear results element and then populate it with the history items
    printHistory: function() {
        var self = this;
        this.resultsElement.html('');
        this.history.forEach(function(line) {
            $('<li/>')
                .addClass('history_line')
                .text(line)
                .appendTo(self.resultsElement);
        });
    },
    // clear history
    clear: function() {
        this.history = [];
        this.resultsElement.html('');
    },
    // submit form data and add solution to the head of history on success
    submit: function() {
        var self = this;
        var arg1 = $('.arg1').val();
        var arg2 = $('.arg2').val();
        var op = $('.op').val();

        $.ajax({
            url: this.serverUrl,
            data: {
                arg1: arg1,
                arg2: arg2,
                op: op
            }
        }).done(function(data) {
            self.history.unshift(data);
            self.printHistory();
        });
    }
};