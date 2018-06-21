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
var ItemGroup_CL = (function (_super) {
    __extends(ItemGroup_CL, _super);
    function ItemGroup_CL() {
        var _this = _super.call(this, TH.game) || this;
        _this.items = {};
        return _this;
    }
    ItemGroup_CL.prototype.getItem = function (itemID) {
        return this.items[itemID];
    };
    ItemGroup_CL.prototype.addItem = function (item, itemID) {
        this.add(item);
        this.items[itemID] = item;
    };
    return ItemGroup_CL;
}(Phaser.Group));
