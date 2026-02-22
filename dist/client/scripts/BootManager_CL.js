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
var BootManager_CL = (function (_super) {
    __extends(BootManager_CL, _super);
    function BootManager_CL() {
        return _super.call(this) || this;
    }
    BootManager_CL.prototype.preload = function () {
        this.load.path = "assets/";
        this.load.image("loadBar", "images/panel_loading.png");
        this.load.image("logoSmall", "images/logo_small.png");
        TH.game.onPause.add(function () { TH.suspended = true; });
        TH.game.onResume.add(function () { TH.suspended = false; TH.game.camera.flash(0x000000, 1500); });
    };
    BootManager_CL.prototype.create = function () {
        this.state.start("load");
    };
    return BootManager_CL;
}(Phaser.State));
