/* Tank hunt node.js server, basic start file */
var port = 8080;

var express = require("express");
var app = express();
var server = require("http").createServer(app);

server.listen(port);

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/client/index.html");
});
app.get("/editor", function(req, res) {
    res.sendFile(__dirname + "/client/editor/index.html");
});

app.use("/client", express.static(__dirname + "/client"));
app.use("/shared", express.static(__dirname + "/shared"));

console.log("Node js server is now successfully listening at port " + port);
 
var TankHunt = require("./server/TankHunt");
var tankhunt = new TankHunt(server);