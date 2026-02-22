var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var MenuManager_CL = (function (_super) {
    __extends(MenuManager_CL, _super);
    function MenuManager_CL(tankhunt) {
        var _this = _super.call(this) || this;
        _this.debugJump = false;
        _this.first = true;
        _this.th = tankhunt;
        return _this;
    }
    MenuManager_CL.prototype.create = function () {
        var _this = this;
        if (this.debugJump) {
            this.state.start("play");
            return;
        }
        $(this.game.canvas).hide();
        $("#menuCont").fadeIn();
        $("#logoCont").fadeIn();
        $("#statsCont").hide();
        TH.effects.stopAudio();
        TH.effects.playAudioLooping(SoundNames.MENUSONG);
        if (this.first) {
            this.first = false;
            $("#arenaMode").on("click", function () { _this.arenaJoinClick(); });
            $("#duelMode").on("click", function () { _this.duelJoinClick(); });
            $("#btnChatSubmit").on("click", function () { _this.submitChat(); });
            $("#teamMode").on("click", function () { _this.teamJoinClick(); });
            $("#chatInp").on("keydown", function (e) { if (e.keyCode == 13)
                _this.submitChat(); });
        }
        $("#coverDuel").css("display", "none");
        $("#coverTeam").css("display", "none");
        this.game.state.start("play");
    };
    MenuManager_CL.prototype.processMenuInfo = function (packet) {
        $("#totalPlayers").text(packet.totalP);
        $("#menuPlayers").text(packet.menuP);
        $("#gamePlayers").text(packet.totalP - packet.menuP);
        $("#arenaGames").text(packet.arenaG);
        $("#duelGames").text(packet.duelG);
        $("#teamGames").text(packet.teamG);
        $("#teamQueue").text(packet.teamQ);
    };
    MenuManager_CL.prototype.submitChat = function () {
        var mess = $("#chatInp").val().toString();
        if (mess == "") {
            return;
        }
        $("#chatInp").val("");
        var packet = {
            name: $("#inpName").val().toString(),
            mess: mess
        };
        this.th.socketManager.emit("menuChat", packet);
    };
    MenuManager_CL.prototype.processChat = function (packet) {
        var $messCont = $("#messCont");
        var date = new Date();
        var $newMess = $("<div class='mess'><div>").text("".concat(date.toLocaleTimeString(), " [").concat(packet.name || "unnamed", "] - ").concat(packet.mess));
        $messCont.prepend($newMess);
    };
    MenuManager_CL.prototype.arenaJoinClick = function () {
        var name = this.getName();
        if (name === false)
            return;
        this.th.socketManager.emitGameRequest({ playerName: name, gameType: "Arena" });
    };
    MenuManager_CL.prototype.duelJoinClick = function () {
        $("#coverTeam").hide();
        var name = this.getName();
        if (name === false)
            return;
        if ($("#coverDuel").css("display") != "none") {
            this.th.socketManager.emitGameRequest({ playerName: name, gameType: "nogame" });
            $("#coverDuel").hide();
            return;
        }
        this.th.socketManager.emitGameRequest({ playerName: name, gameType: "Duel" });
        $("#coverDuel").css("display", "flex");
    };
    MenuManager_CL.prototype.teamJoinClick = function () {
        $("#coverDuel").hide();
        var name = this.getName();
        if (name === false)
            return;
        if ($("#coverTeam").css("display") != "none") {
            this.th.socketManager.emitGameRequest({ playerName: name, gameType: "nogame" });
            $("#coverTeam").hide();
            return;
        }
        this.th.socketManager.emitGameRequest({ playerName: name, gameType: "TeamFight" });
        $("#coverTeam").css("display", "flex");
    };
    MenuManager_CL.prototype.getName = function () {
        var name = this.validateName($("#inpName").val().toString());
        if (name === false) {
            $("#inpName").addClass("wrongInput");
            return false;
        }
        else {
            $("#inpName").removeClass("wrongInput");
        }
        return name;
    };
    MenuManager_CL.prototype.validateName = function (name) {
        var trimmed = name.trim();
        if (trimmed.length < 2)
            return false;
        return trimmed;
    };
    return MenuManager_CL;
}(Phaser.State));
