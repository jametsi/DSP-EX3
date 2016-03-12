var express = require("express");
var app = express();
var calculator = require("./calculator.js");
var plot = require('plotter').plot;
var crypto = require('crypto');
var port = 8080;

// Serve static files from client directory
app.use(express.static("client"));
app.use(express.static("output"));

app.get("/calculate", function(req, res) {
    if (!req.query.arg1 || !req.query.arg2 || !req.query.op) {
        res.send("Invalid request parameters. Expecting arg1, arg2 & op to be defined");
        return;
    }

    var arg1 = parseFloat(req.query.arg1);
    var arg2 = parseFloat(req.query.arg2);
    var op = req.query.op;
    var answer = String(calculator.calculate(arg1, arg2, op));

    res.send(arg1 + " " + op + " " + arg2 + " = " + answer);
});

app.get("/plot_sine", function(req, res) {
    // create hash from the plot function and use it as a filename
    var filename = crypto.createHash('md5').update(req.query.sineFunction).digest('hex');

    var data = {};
    for (var i = -Math.PI; i < Math.PI; i += .1) {
        data[i] = Math.sin(i);
    }

    plot({
        title: 'sin(x), -π < x < π',
        data:       { 'sin(x)': data },
        filename:   'output/' + filename + '.png',
        finish: function() {
            res.send('/' + filename + '.png');
        }
    });
});

app.listen(port, function () {
    console.log("App listening on port", port + "!");
});
