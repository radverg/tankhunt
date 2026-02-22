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
var ShotGroup_CL = (function (_super) {
    __extends(ShotGroup_CL, _super);
    function ShotGroup_CL() {
        var _this = _super.call(this, TH.game) || this;
        _this.shots = {};
        return _this;
    }
    ShotGroup_CL.prototype.newShot = function (data) {
        if (TH.suspended)
            return;
        var type = data.type;
        var sh = new Shots[type.toString()](data);
        sh.start();
        this.shots[data.id] = sh;
    };
    ShotGroup_CL.prototype.getShot = function (id) {
        return this.shots[id];
    };
    ShotGroup_CL.prototype.removeShot = function (shot) {
        var _this = this;
        var shts = Object.keys(this.shots).map(function (key) { return _this.shots[key]; });
        var index = shts.indexOf(shot);
        if (index != -1) {
            delete this.shots[Object.keys(this.shots)[index]];
        }
    };
    ShotGroup_CL.prototype.clear = function () {
        this.shots = {};
        this.removeAll(true);
    };
    ShotGroup_CL.prototype.tidyPlayerShots = function (player) {
        var _this = this;
        var shots = Object.keys(this.shots).map(function (key) { return _this.shots[key]; });
        for (var _i = 0, shots_1 = shots; _i < shots_1.length; _i++) {
            var sh = shots_1[_i];
            if (sh.getOwner() == player) {
                sh.stop();
            }
        }
    };
    return ShotGroup_CL;
}(Phaser.Group));
