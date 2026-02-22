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
var Pool_CL = (function (_super) {
    __extends(Pool_CL, _super);
    function Pool_CL(pgame, container) {
        return _super.call(this, pgame, container || pgame.world) || this;
    }
    Pool_CL.prototype.createMultiple = function (quantity, key) {
        var objects = _super.prototype.createMultiple.call(this, quantity || 1, key, 0, false);
        for (var _i = 0, objects_1 = objects; _i < objects_1.length; _i++) {
            var sprite = objects_1[_i];
            var anim = sprite.animations.add("allFrames", null);
        }
        return objects;
    };
    Pool_CL.prototype.getAllFreeByKey = function (key) {
        return this.filter(function (child) {
            return !child.exists && child.key.substr(0, key.length) === key;
        }).list;
    };
    return Pool_CL;
}(Phaser.Group));
