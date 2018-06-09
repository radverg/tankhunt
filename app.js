/* Tank hunt node.js server, basic start file */

var LC = require("./server/LevelCreator");
var THGame = require("./server/THGame");
var TG = require("./server/TestGame");
var Manager = require("./server/Manager");

//<editor-fold desc="Start up the server">
var port = 8080;

var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);

server.listen(port);
console.log("Server is successfully listening at port " + port);
//</editor-fold>

//<editor-fold desc="Set up the response">
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/client/index.html");
});
app.get("/editor", function(req, res) {
    res.sendFile(__dirname + "/client/editor/index.html");
});

app.use("/client", express.static(__dirname + "/client"));
app.use("/shared", express.static(__dirname + "/shared"));
//</editor-fold>
 
var allSockets = [];

var onConnection = function (socket) {
    allSockets.push(socket);
    console.log("New client has connected from " + socket.handshake.address+ " with id " + socket.id +  "! Total amount of clients: " + allSockets.length);


    // !!!!!!!!!!!!!!
    tg.addPlayer(Manager.addNewPlayer(socket, "hovno"));

    socket.on("disconnect", function () {
        allSockets.splice(allSockets.indexOf(socket), 1);
      //  Manager.clientDisconnected(socket);
      tg.playerDisconnected(socket.player);
        console.log("Client " + socket.handshake.address + " has disconnected!");
    });

    socket.on("nameEnter" , function (data) { // Player confirmed his name, get him to the queue

        Manager.getPlayerToQueue(Manager.addNewPlayer(socket, data));
        console.log("Player named " + data + " with id " + socket.id + " has been added to the queue!");
    });

    socket.on("input", function(data) {
        Manager.onInput(socket, data);
    })


};

io.sockets.on("connection", onConnection);

Date.serverTime = Date.now();
Math._currentID = 1;
Math.getNextID = function() {
    Math._currentID++;
    return "a" + Math._currentID;
}

//!!!!!!!!
var tg = new TG();
Manager.games.push(tg);
tg.manager = Manager;

Manager.startServerLoop();


