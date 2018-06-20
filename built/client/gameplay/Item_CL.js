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
var Item_CL = (function (_super) {
    __extends(Item_CL, _super);
    function Item_CL(x, y, typeIndex) {
        var _this = _super.call(this, TH.game, x * TH.sizeCoeff, y * TH.sizeCoeff, "blackRect") || this;
        _this.anchor.setTo(0.5);
        _this.width = Data.Items.size * TH.sizeCoeff;
        _this.height = Data.Items.size * TH.sizeCoeff;
        return _this;
    }
    Item_CL.prototype.getCollected = function () {
        this.destroy();
    };
    return Item_CL;
}(Sprite));
