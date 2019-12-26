// app.js
var express = require("express");
var expressWs = require("express-ws");
var module1 = require("./module1");
var port=3000

var app = express();
expressWs(app);
app.use("/ifc", module1);

app.listen(port);
console.log("websocket server listen port is" + port)