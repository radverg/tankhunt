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
var Item_CL = (function (_super) {
    __extends(Item_CL, _super);
    function Item_CL(x, y, typeIndex) {
        var _this = _super.call(this, TH.game, x * TH.sizeCoeff, y * TH.sizeCoeff, "shadow") || this;
        _this.itemSize = 0.9;
        _this.width = _this.itemSize * TH.sizeCoeff;
        _this.height = _this.itemSize * TH.sizeCoeff;
        _this.anchor.setTo(0.5);
        var itemSpr = _this.game.make.sprite(0, 0, "items");
        itemSpr.anchor.setTo(0.5);
        itemSpr.scale.setTo(3);
        itemSpr.frame = typeIndex;
        _this.itemSpr = itemSpr;
        _this.addChild(itemSpr);
        _this.rotation = Math.random() * Math.PI * 2;
        _this.rotTween = _this.game.add.tween(_this).to({ rotation: Math.PI * 2 + _this.rotation }, 4500, Phaser.Easing.Default, true, 0, -1);
        return _this;
    }
    Item_CL.prototype.getCollected = function (noeffect) {
        if (noeffect === void 0) { noeffect = false; }
        this.rotTween.stop();
        if (noeffect) {
            this.destroy(true);
            return;
        }
        var twn = TH.game.add.tween(this);
        twn.to({ "width": 0, "height": 0 }, 300, Phaser.Easing.Back.In);
        twn.onComplete.add(function () { this.destroy(true); }, this);
        twn.start();
    };
    Item_CL.prototype.getSprFrame = function () {
        return this.itemSpr.frame;
    };
    return Item_CL;
}(Sprite));
