var Player = require("./Player");
var Game = require("./THGame");

var Manager = {
    games: [],
    players: [],
    queue: [],
    playersPerGame: 2,
    serverLoopInterval: null,
    lastTick: null,

    addNewPlayer: function (socket, name) {
        var newPl = new Player(socket, name);
        this.players.push(newPl);
        return newPl;
    },

    getPlayerToQueue: function(player) {
        // this.queue.push(player);
        // this.sendQueueInfo();
        // this.createNewGame(this.playersPerGame);
    },

    createNewGame: function (playerCount) {
        // if (this.queue.length < playerCount) return;
        // var newG = new Game();
        // for (var i = 0; i < playerCount; i++) {
        //     newG.addPlayer(this.queue[i]);
        // }
        // this.queue.splice(0, playerCount);
        // this.games.push(newG);
        // newG.manager = this;
        // newG.startGame();
        // console.log("A new game has been started!");
    },

    clientDisconnected: function(socket) {
        if (socket.player) {
            if (this.queue.indexOf(socket.player) !== -1) { // Player disconnected from the queue
                this.queue.splice(this.queue.indexOf(socket.player), 1);
                this.sendQueueInfo();
            } else { // Player disconnected from the game
                socket.player.game.playerDisconnected(socket.player);

            }

        }
    },

    sendQueueInfo: function () {
        var data = [];
        for (var pl = 0; pl < this.queue.length; pl++) {
             data.push({ name: this.queue[pl].name, address: this.queue[pl].socket.handshake.address });
        }
        this.sendTo(this.queue, "queueInfo", data);
    },

    sendTo: function(players, emName, data) {
        for (var i = 0; i < players.length; i++) {
            players[i].socket.emit(emName, data);
        }
    },

    onInput: function(socket, data) {
        if (socket.player && socket.player.game) {
            socket.player.game.handleInput(data, socket.player);
        }
    },

    startServerLoop: function () {
        var that = this;
        this.serverLoopInterval = setInterval(function() { that.serverLoop.call(that); }, 1000 / 60);
        this.lastTick = Date.now();
        console.log("Server loop has been started!");
    },
    
    serverLoop: function () {
        Date.serverTime = Date.now();
        var deltaSec = (Date.now() - this.lastTick) / 1000;

        // Iterate through the games and update them
        for (var g = 0; g < this.games.length; g++) {
            this.games[g].update(deltaSec);
        }


        this.lastTick += deltaSec * 1000;
    }


}

module.exports = Manager;