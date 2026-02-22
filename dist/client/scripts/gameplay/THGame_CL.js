var THGame_CL = (function () {
    function THGame_CL(socketManager) {
        this.game = TH.game;
        this.running = false;
        this.level = new Level_CL();
        this.remove = false;
        this.background = null;
        this.levelGroup = null;
        this.itemGroup = null;
        this.shotGroup = null;
        this.playerGroup = null;
        this.cameraArrowControl = false;
        this.cameraMoveSpeed = 4;
        this.camSpeed = 4;
        this.onItemSpawn = new Phaser.Signal();
        this.onPlayerRemove = new Phaser.Signal();
        this.onRespawn = new Phaser.Signal();
        this.onNewPlayer = new Phaser.Signal();
        this.onGameFinish = new Phaser.Signal();
        this.onGameInfo = new Phaser.Signal();
        this.onGameStart = new Phaser.Signal();
        this.onLeave = new Phaser.Signal();
        this.onMeItemUse = new Phaser.Signal();
        this.onChat = new Phaser.Signal();
        this.onItemCollect = new Phaser.Signal();
        this.onHit = new Phaser.Signal();
        this.onNewPlayerConnected = new Phaser.Signal();
        this.onHeal = new Phaser.Signal();
        this.socketManager = socketManager;
        TH.thGame = this;
        this.init();
        TH.effects.initPool();
    }
    THGame_CL.prototype.update = function () {
        this.playerGroup.updateTanks();
        if (!this.game.camera.target) {
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
                this.game.camera.y -= this.camSpeed;
            }
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
                this.game.camera.y += this.camSpeed;
            }
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                this.game.camera.x -= this.camSpeed;
            }
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                this.game.camera.x += this.camSpeed;
            }
        }
    };
    THGame_CL.prototype.debug = function () {
    };
    THGame_CL.prototype.processPlayerRemove = function (playerID) {
        var player = this.playerGroup.getPlayer(playerID);
        this.onPlayerRemove.dispatch(player);
        if (player.me) {
            this.destroy();
            this.game.state.start("menu");
        }
        else {
            this.shotGroup.tidyPlayerShots(player);
            this.playerGroup.removePlayer(playerID);
        }
    };
    THGame_CL.prototype.processItemUse = function (data) {
        this.onMeItemUse.dispatch();
    };
    ;
    THGame_CL.prototype.start = function () {
        this.running = true;
        console.log("Game is running!");
    };
    THGame_CL.prototype.processStateInfo = function (data) {
        if (!this.running)
            return;
        this.playerGroup.stateUpdate(data);
    };
    THGame_CL.prototype.processNewShot = function (data) {
        if (!this.running)
            return;
        data.ownerObj = this.playerGroup.getPlayer(data.ownerID);
        this.shotGroup.newShot(data);
    };
    ;
    THGame_CL.prototype.processNewItem = function (data) {
        var newItem = new Item_CL(data.x, data.y, data.typeIndex);
        this.itemGroup.addItem(newItem, data.id);
        this.onItemSpawn.dispatch(newItem);
    };
    THGame_CL.prototype.processItemCollect = function (data) {
        var item = this.itemGroup.getItem(data.id);
        if (!item)
            return;
        var collector = this.playerGroup.getPlayer(data.playerID);
        if (collector === this.playerGroup.me) {
            TH.effects.playAudio(SoundNames.RELOAD);
        }
        item.getCollected();
        this.onItemCollect.dispatch(item, collector);
    };
    THGame_CL.prototype.processGameInfo = function (data) {
        for (var pl in data.players) {
            if (!this.playerGroup.getPlayer(data.players[pl].id)) {
                this.newPlayerFromPacket(data.players[pl], false);
            }
        }
        for (var it in data.items) {
            if (!this.itemGroup.getItem(data.items[it].id))
                this.processNewItem(data.items[it]);
        }
        this.onGameInfo.dispatch();
    };
    THGame_CL.prototype.processNewPlayer = function (data) {
        if (this.playerGroup.getPlayer(data.id))
            return;
        this.newPlayerFromPacket(data);
    };
    THGame_CL.prototype.processHit = function (data) {
        var shot = this.shotGroup.getShot(data.shotID);
        var playerHit = this.playerGroup.getPlayer(data.plID);
        var playerAtt = this.playerGroup.getPlayer(data.plAttID);
        if (data.blast && shot) {
            shot.blast(data);
        }
        if (data.rm && shot) {
            shot.stop();
        }
        if (!playerHit)
            return;
        var tank = playerHit.tank;
        tank.health = data.healthAft;
        if (!tank.visible) {
            tank.positionServerUpdate(data.xTank, data.yTank);
            tank.jumpToRemote();
        }
        if (data.healthAft < data.healthBef) {
            TH.effects.shotDamageEffect(data.x * TH.sizeCoeff || tank.x, (data.y * TH.sizeCoeff) || tank.y);
            TH.effects.playAudio(SoundNames.SHOTSMALL, playerHit.tank);
        }
        else {
            TH.effects.shotDebrisEffect(data.x * TH.sizeCoeff || tank.x, (data.y * TH.sizeCoeff) || tank.y);
            TH.effects.playAudio(SoundNames.CINK, playerHit.tank);
        }
        if (tank.health == 0) {
            tank.kill();
            if (shot && playerHit !== this.playerGroup.me) {
                shot.killCount++;
                if (shot.killCount > 1 && shot.getOwner() === this.playerGroup.me) {
                    shot.killCount = -100;
                    TH.game.time.events.add(700, function () { TH.effects.playAudio(SoundNames.MULTIKILL); });
                }
            }
        }
        playerAtt.stats.countHit(playerAtt, playerHit, data.healthBef, data.healthAft);
        this.onHit.dispatch(data, playerHit);
    };
    THGame_CL.prototype.processChatMessage = function (data) {
        this.onChat.dispatch(data);
    };
    THGame_CL.prototype.processHeal = function (data) {
        var plr = this.playerGroup.getPlayer(data.plID);
        if (plr) {
            plr.tank.maxHealth = data.maxHealthAft;
            plr.tank.health = data.healthAft;
            this.onHeal.dispatch(plr, data);
        }
    };
    THGame_CL.prototype.processLevel = function (data) {
        if (!this.level) {
            this.level = new Level_CL();
        }
        if (data.json) {
            this.level.fromJSON(data.json, this.levelGroup);
        }
        else {
            this.level.fromJSON(Levels[data.name], this.levelGroup);
        }
        console.log("Level is here! Payload: ".concat(JSON.stringify(data).length, " characters | bytes"));
    };
    ;
    THGame_CL.prototype.processAppear = function (data) {
        var plr = this.playerGroup.getPlayer(data.plID);
        if (!plr)
            return;
        if (plr.isEnemyOf(this.playerGroup.me)) {
            plr.tank.show();
            plr.tank.positionServerUpdate(data.atX * TH.sizeCoeff, data.atY * TH.sizeCoeff);
            plr.tank.jumpToRemote();
        }
        else {
            plr.tank.alphaShow();
        }
    };
    THGame_CL.prototype.processDisappear = function (data) {
        var plr = this.playerGroup.getPlayer(data.plID);
        if (!plr)
            return;
        if (plr.isEnemyOf(this.playerGroup.me)) {
            plr.tank.hide();
        }
        else {
            plr.tank.alphaHide();
        }
    };
    THGame_CL.prototype.processRespawn = function (data) { };
    ;
    THGame_CL.prototype.processGameFinish = function (data) { };
    ;
    THGame_CL.prototype.processCapture = function (data) { };
    ;
    THGame_CL.prototype.setCameraFollow = function () {
        this.cameraArrowControl = false;
        TH.game.camera.follow(this.playerGroup.me.tank);
        TH.game.camera.lerp.setTo(0.1, 0.1);
    };
    THGame_CL.prototype.setCameraFree = function () {
        this.cameraArrowControl = true;
        this.game.camera.unfollow();
    };
    THGame_CL.prototype.newPlayerFromPacket = function (packet, dispatchConnected) {
        if (dispatchConnected === void 0) { dispatchConnected = true; }
        var tank = new DefaultTank_CL();
        var player = new Player_CL(packet.id, tank, packet.name);
        player.team = packet.team || null;
        player.stats.importPacket(packet.stats);
        if (packet.tank) {
            tank.applyStatePacket(packet.tank);
            tank.jumpToRemote();
        }
        tank.health = packet.health;
        tank.maxHealth = packet.maxHealth;
        this.playerGroup.addPlayer(player);
        if (packet.socketID == this.socketManager.getID()) {
            this.playerGroup.setMe(player);
            player.tank.initEngineSound();
            this.setCameraFollow();
        }
        else {
            this.playerGroup.setEnemy(player);
        }
        if (!packet.alive) {
            tank.hide();
        }
        if (dispatchConnected)
            this.onNewPlayerConnected.dispatch(player);
        this.onNewPlayer.dispatch(player);
        return player;
    };
    THGame_CL.prototype.tidy = function () {
        this.shotGroup.clear();
        this.itemGroup.clear();
    };
    THGame_CL.prototype.destroy = function () {
        TH.thGame = null;
        this.remove = true;
        this.running = false;
        this.tidy();
        this.shotGroup.destroy(true);
        this.playerGroup.players = null;
        this.playerGroup.destroy(true);
        this.itemGroup.destroy(true);
        this.levelGroup.destroy(true);
        this.onGameFinish.dispose();
        this.onGameInfo.dispose();
        this.onHeal.dispose();
        this.onGameStart.dispose();
        this.onHit.dispose();
        this.onItemCollect.dispose();
        this.onItemSpawn.dispose();
        this.onLeave.dispose();
        this.onNewPlayer.dispose();
        this.onNewPlayerConnected.dispose();
        this.onPlayerRemove.dispose();
        this.onRespawn.dispose();
        this.onChat.dispose();
        this.onMeItemUse.dispose();
    };
    THGame_CL.prototype.leaveToMenu = function () {
        this.onLeave.dispatch();
    };
    THGame_CL.prototype.init = function () {
        this.levelGroup = TH.game.add.group();
        this.itemGroup = new ItemGroup_CL();
        this.playerGroup = new PlayerGroup_CL();
        this.shotGroup = new ShotGroup_CL();
    };
    return THGame_CL;
}());
