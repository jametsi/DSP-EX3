'use strict';

var cache = {
    cache: [],
    size: 0,
    init: function (size) {
        this.size = size;
        var cache = JSON.parse(localStorage.getItem('cache'));
        if (cache !== null) {
            this.cache = cache;
        } else {
            this.cache = [];
        }
    },
    add: function (calculation) {
        if (this.size == 0) {
            return;
        }
        var parts = calculation.split(' ');
        var operation = parts[0] + parts[1] + parts[2] + parts[3];
        var result = parts[4];
        console.log(operation);

        var foundFromCache = false;
        for (var i = 0; i < this.cache.length; i++) {
            var item = this.cache[i];
            if (item.operation == operation) {
                foundFromCache = true;
                break;
            }
        }
        if (!foundFromCache) {
            this.cache.push({
                operation: operation,
                result: result
            });
            if (this.cache.length > this.size) {
                this.cache.shift();
            }
            this.save();
        }
    },
    get: function (operation) {
        if (this.size == 0) {
            return null;
        }
        var cacheItem = this.cache.find(function (item) {
            return item.operation == operation;
        });
        return cacheItem && cacheItem.result ? cacheItem.result : null;
    },
    save: function () {
        localStorage.setItem('history', JSON.stringify(this.history));
    },
    clear: function () {
        this.cache = [];
        localStorage.setItem('history', null);
    }
};