"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuManager_SE = void 0;
var Room_SE_1 = require("./Room_SE");
var MenuManager_SE = (function (_super) {
    __extends(MenuManager_SE, _super);
    function MenuManager_SE(th) {
        var _this = _super.call(this) || this;
        _this.th = th;
        return _this;
    }
    MenuManager_SE.prototype.emitMenuInfo = function () {
        var gm = this.th.gameManager;
        var menuPacket = {
            arenaG: this.th.gameManager.getArenaCount(),
            totalP: this.th.socketManager.socketCount,
            menuP: this.getSocketCount(),
            teamG: this.th.gameManager.getTeamFightCount(),
            teamQ: this.th.gameManager.getTeamQueueCount(),
            duelG: this.th.gameManager.getDuelCount()
        };
        this.broadcast("menuInfo", menuPacket);
    };
    MenuManager_SE.prototype.processMenuChat = function (data) {
        this.broadcast("menuChat", data);
    };
    return MenuManager_SE;
}(Room_SE_1.Room_SE));
exports.MenuManager_SE = MenuManager_SE;
