var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var DefaultTank_CL = (function (_super) {
    __extends(DefaultTank_CL, _super);
    function DefaultTank_CL() {
        var _this = _super.call(this, Data.DefaultTank.asset) || this;
        _this.anchor.setTo(Data.DefaultTank.anchorX, Data.DefaultTank.anchorY);
        _this.width = Data.DefaultTank.sizeX * TH.sizeCoeff;
        _this.height = Data.DefaultTank.sizeY * TH.sizeCoeff;
        _this.framesInRow = 1;
        _this.turret = new Sprite(TH.game, _this.x, _this.y, "defaultTurret");
        _this.turret.anchor.setTo(0.5, 0.8453);
        _this.turret.width = 0.625 * TH.sizeCoeff;
        _this.turret.height = 0.625 * 3.23 * TH.sizeCoeff;
        return _this;
    }
    return DefaultTank_CL;
}(Tank_CL));
