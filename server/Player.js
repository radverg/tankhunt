var GO = require("./GameObject");
var Prop = require("./AllProperties");
var Tk = require("./Tank");

class Player {

    constructor(socket, name) {
        this.socket = socket;
        this.id = socket.id;
        this.socket.player = this;
        this.name = name || "unnamed";


        this.tank = new Tk(this);
        this.game = null;

        this.alive = true;
        this.emitable = true;

        this.stats = {
           kills: 0,
           deaths: 0,
           wins: 0
       }
    }

    die() {
        this.stats.deaths++;
        this.alive = false;
        this.emitable = false;
    }
}

module.exports = Player;