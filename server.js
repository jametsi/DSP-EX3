var express = require("express");
var app = express();
var calculator = require("./calculator.js");

var port = 8080;

// Serve static files from client directory
app.use(express.static("client"));

app.get("/calculate", function(req, res) {
    console.log(req.query);
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

app.listen(port, function () {
    console.log("App listening on port", port + "!");
});
