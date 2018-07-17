/* Tank hunt node.js server, basic start file */
var port = 8080;

var express = require("express");
var app = express();
var server = require("http").createServer(app);

var path = require("path");

server.listen(port);

app.get("/", function(req, res) {
    res.sendFile(path.resolve(__dirname + "/../../built/client/index.html"));
});
app.get("/editor", function(req, res) {
    res.sendFile(path.resolve(__dirname + "/../../built/client/editor/index.html"));
});

app.use("/client", express.static(path.resolve(__dirname + "/../../built/client")));
app.use("/shared", express.static(path.resolve(__dirname + "/../../built/shared")));

console.log("Node js server is now successfully listening at port " + port);
 
// Create game
var th = require("./scripts/TankHunt_SE");
var tankhunt = new th.TankHunt_SE(server);
