'use strict';

var cache = {
    history: [],
    init: function() {
        var history = JSON.parse(localStorage.getItem('history'));
        if (history !== null) {
            this.history = history;
        } else {
            this.history = [];
        }
    },
    add: function(calculation) {
        this.history.unshift(calculation);
        this.save();
    },
    save: function() {
        localStorage.setItem('history', JSON.stringify(this.history));
    },
    clear: function() {
        this.history = [];
        localStorage.setItem('history', null);
    }
};