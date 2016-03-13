'use strict';
// Jami Karvanen - 014023196

var cal_history = {
    history: [],
    container: null,
    init: function (containerElement) {
        this.container = containerElement;
    },
    add: function (calculation) {
        this.history.unshift(calculation);
        this.print();
    },
    // clear results element and then populate it with the history items
    print: function () {
        var self = this;
        this.container.html('');
        this.history.forEach(function (line) {
            $('<li/>')
                .addClass('history-line')
                .text(line)
                .appendTo(self.container);
        });
    },
    clear: function () {
        this.container.html('');
        this.history = [];
    }
};