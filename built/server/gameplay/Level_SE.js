"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Geometry_SE_1 = require("./utils/Geometry_SE");
var MyMath_SE_1 = require("./utils/MyMath_SE");
var Level_SE = (function () {
    function Level_SE(tilesCountX, tilesCountY, squareSize, wallThickness) {
        this.walls = [];
        this.borders = [];
        this.tilesCountX = tilesCountX || 10;
        this.tilesCountY = tilesCountY || 10;
        this.squareSize = squareSize || 3;
        this.wallThickness = wallThickness || 0.1;
        var width = this.tilesCountX * this.squareSize;
        var height = this.tilesCountY * this.squareSize;
        this.levelRect = new Geometry_SE_1.Rect(width / 2, height / 2, width, height);
        this.generateBorders();
        this.generateRandomLevel();
    }
    Level_SE.prototype.parseJSONLevel = function (jsonString) {
        var lvl = null;
        try {
            lvl = JSON.parse(jsonString);
        }
        catch (error) {
            console.log("Cannot parse JSON string! " + error.message);
        }
        this.tilesCountX = lvl.tilesCountX;
        this.tilesCountY = lvl.tilesCountY;
        this.wallThickness = lvl.wallThickness;
        this.squareSize = lvl.squareSize;
        var width = this.tilesCountX * this.squareSize;
        var height = this.tilesCountY * this.squareSize;
        this.levelRect = new Geometry_SE_1.Rect(width / 2, height / 2, width, height);
        this.emptyWalls();
        for (var i in lvl.walls) {
            var splitted = lvl.walls[i].split("|");
            var x = parseInt(splitted[0]);
            var y = parseInt(splitted[1]);
            var type = parseInt(splitted[2]);
            this.walls[x][y][type] = this.generateWall(x, y, type);
        }
        var spwns = ["spawns1", "spawns2", "spawnsItems"];
        this.spawns1 = [];
        this.spawns2 = [];
        this.spawnsItems = [];
        for (var sp in spwns) {
            if (!lvl["invert" + spwns[sp]]) {
                for (var block in lvl[spwns[sp]]) {
                    var splitted = lvl[spwns[sp]][block].split("|");
                    var x = parseInt(splitted[0]);
                    var y = parseInt(splitted[1]);
                    this[spwns[sp]].push(new Geometry_SE_1.Vec2(x, y));
                }
            }
            else {
                for (var x = 0; x < this.tilesCountX; x++) {
                    for (var y = 0; y < this.tilesCountY; y++) {
                        var index = lvl[spwns[sp]].indexOf(x + "|" + y);
                        if (index == -1) {
                            this[spwns[sp]].push(new Geometry_SE_1.Vec2(x, y));
                        }
                    }
                }
            }
        }
        this.generateBorders();
    };
    Level_SE.prototype.generateRandomLevel = function () {
        var wallSize = this.squareSize;
        for (var x = 0; x < this.tilesCountX; x++) {
            this.walls.push([]);
            for (var y = 0; y < this.tilesCountY; y++) {
                this.walls[x][y] = [null, null];
                if (y != 0) {
                    if (Math.random() > 0.5) {
                        var newWall = new Geometry_SE_1.Rect(x * this.squareSize + wallSize / 2, y * this.squareSize, wallSize + this.wallThickness, this.wallThickness);
                        this.walls[x][y][0] = newWall;
                    }
                }
                if (x != 0) {
                    if (Math.random() > 0.5) {
                        var newWall = new Geometry_SE_1.Rect(x * this.squareSize, y * this.squareSize + wallSize / 2, this.wallThickness, wallSize + this.wallThickness);
                        this.walls[x][y][1] = newWall;
                    }
                }
            }
        }
    };
    Level_SE.prototype.generateWall = function (squareX, squareY, type) {
        if (type == 0) {
            return new Geometry_SE_1.Rect(squareX * this.squareSize + this.squareSize / 2, squareY * this.squareSize, this.squareSize + this.wallThickness, this.wallThickness);
        }
        if (type == 1) {
            return new Geometry_SE_1.Rect(squareX * this.squareSize, squareY * this.squareSize + this.squareSize / 2, this.wallThickness, this.squareSize + this.wallThickness);
        }
        return null;
    };
    Level_SE.prototype.getSquareCentre = function (squareX, squareY) {
        return new Geometry_SE_1.Vec2(this.squareSize * squareX + this.squareSize / 2, this.squareSize * squareY + this.squareSize / 2);
    };
    Level_SE.prototype.generateBorders = function () {
        var borderOver = 3;
        this.borders[0] = new Geometry_SE_1.Rect(this.levelRect.hWidth, -borderOver / 2, this.levelRect.w + borderOver * 2, borderOver);
        this.borders[1] = new Geometry_SE_1.Rect(this.levelRect.w + borderOver / 2, this.levelRect.hHeight, borderOver, this.levelRect.w + borderOver * 2);
        this.borders[2] = new Geometry_SE_1.Rect(this.levelRect.hWidth, this.levelRect.h + borderOver / 2, this.levelRect.w + borderOver * 2, borderOver);
        this.borders[3] = new Geometry_SE_1.Rect(-borderOver / 2, this.levelRect.hHeight, borderOver, this.levelRect.w + borderOver * 2);
    };
    Level_SE.prototype.emptyWalls = function () {
        this.walls = [];
        for (var x = 0; x < this.tilesCountX; x++) {
            this.walls.push([]);
            for (var y = 0; y < this.tilesCountY; y++) {
                this.walls[x][y] = [null, null];
            }
        }
    };
    Level_SE.prototype.getSqrX = function (x) {
        return Math.floor(x / this.squareSize);
    };
    Level_SE.prototype.getSqrY = function (y) {
        return Math.floor(y / this.squareSize);
    };
    Level_SE.prototype.isSquareInBounds = function (sqrX, sqrY) {
        return sqrX >= 0 && sqrY >= 0 && sqrX < this.tilesCountX && sqrY < this.tilesCountY;
    };
    Level_SE.prototype.wallCheckLoop = function (startX, startY, dirX, dirY) {
        var points = [];
        var x1 = startX;
        var y1 = startY;
        while (points.length === 0) {
            var x2 = x1 + dirX * this.squareSize;
            var y2 = y1 + dirY * this.squareSize;
            var squareX = Math.floor(x1 / this.squareSize);
            var squareY = Math.floor(y1 / this.squareSize);
            var res1 = this.doubleWallPointCheck(squareX, squareY, dirX, dirY, x1, y1, x2, y2);
            if (res1.length > 0)
                points.push.apply(points, res1);
            if (!this.levelRect.contains(x2, y2)) {
                var point = this.levelRect.simpleLineIntPoints(x1, y1, x2, y2);
                if (point.length > 0)
                    points.push.apply(points, point);
                break;
            }
            else {
                squareX = Math.floor(x2 / this.squareSize);
                squareY = Math.floor(y2 / this.squareSize);
                var res2 = this.doubleWallPointCheck(squareX, squareY, -dirX, -dirY, x1, y1, x2, y2);
                if (res2.length > 0)
                    points.push.apply(points, res2);
            }
            x1 = x2;
            y1 = y2;
        }
        var closestPoint = points[0];
        for (var i = 1; i < points.length; i++) {
            if (MyMath_SE_1.dist(startX, startY, closestPoint.x, closestPoint.y) >
                MyMath_SE_1.dist(startX, startY, points[i].x, points[i].y)) {
                closestPoint = points[i];
            }
        }
        return closestPoint;
    };
    Level_SE.prototype.doubleWallPointCheck = function (squareX, squareY, dirX, dirY, x1, y1, x2, y2) {
        var points = [];
        if (dirX > 0)
            squareX++;
        if (squareX < this.tilesCountX && this.walls[squareX][squareY][1]) {
            var pts = this.walls[squareX][squareY][1].simpleLineIntPoints(x1, y1, x2, y2);
            if (pts.length > 0)
                points.push.apply(points, pts);
        }
        if (dirX > 0)
            squareX--;
        if (dirY > 0)
            squareY++;
        if (squareY < this.tilesCountY && this.walls[squareX][squareY][0]) {
            var pts = this.walls[squareX][squareY][0].simpleLineIntPoints(x1, y1, x2, y2);
            if (pts.length > 0)
                points.push.apply(points, pts);
        }
        return points;
    };
    Level_SE.prototype.squareLineWallColl = function (sqrX, sqrY, tank) {
        if (!this.isSquareInBounds(sqrX, sqrY))
            return;
        if (sqrY == 0 || this.walls[sqrX][sqrY][0]) {
            var x1 = sqrX * this.squareSize;
            var y1 = sqrY * this.squareSize;
            var x2 = (sqrX + 1) * this.squareSize;
            var y2 = y1;
            var pts = tank.body.lineIntPoints(x1, y1, x2, y2);
            if (pts.length > 0) {
                this.horizontalLineSeparation(tank, pts, sqrX, sqrY);
            }
        }
        if (sqrY == this.tilesCountY - 1 || this.walls[sqrX][sqrY + 1][0]) {
            var x1 = sqrX * this.squareSize;
            var y1 = (sqrY + 1) * this.squareSize;
            var x2 = (sqrX + 1) * this.squareSize;
            var y2 = y1;
            pts = tank.body.lineIntPoints(x1, y1, x2, y2);
            if (pts.length > 0) {
                this.horizontalLineSeparation(tank, pts, sqrX, sqrY);
            }
        }
        if (sqrX == 0 || this.walls[sqrX][sqrY][1]) {
            var x1 = sqrX * this.squareSize;
            var y1 = sqrY * this.squareSize;
            var x2 = x1;
            var y2 = (sqrY + 1) * this.squareSize;
            pts = tank.body.lineIntPoints(x1, y1, x2, y2);
            if (pts.length > 0) {
                this.verticalLineSeparation(tank, pts, sqrX, sqrY);
            }
        }
        if (sqrX == this.tilesCountX - 1 || this.walls[sqrX + 1][sqrY][1]) {
            var x1 = (sqrX + 1) * this.squareSize;
            var y1 = sqrY * this.squareSize;
            var x2 = x1;
            var y2 = (sqrY + 1) * this.squareSize;
            pts = tank.body.lineIntPoints(x1, y1, x2, y2);
            if (pts.length > 0) {
                this.verticalLineSeparation(tank, pts, sqrX, sqrY);
            }
        }
    };
    Level_SE.prototype.horizontalLineSeparation = function (tank, points, sqrX, sqrY) {
        if (points.length == 2) {
            var ctrX = (points[0].x + points[1].x) / 2;
            var ctrY = (points[0].y + points[1].y) / 2;
            var closestVert = tank.body.getClosestVertice(ctrX, ctrY);
            var dist = Math.abs(points[0].y - closestVert.y);
            var sign = (tank.y > points[0].y) ? 1 : -1;
            tank.body.cY += ((dist + 0.001) * sign);
        }
        else {
            var dx = (Math.abs(sqrX * this.squareSize - points[0].x) > Math.abs((sqrX + 1) * this.squareSize - points[0].x)) ?
                (sqrX + 1) * this.squareSize - points[0].x : sqrX * this.squareSize - points[0].x;
            tank.body.cX += (dx + 0.001);
        }
        tank.body.updateVertices();
    };
    Level_SE.prototype.verticalLineSeparation = function (tank, points, sqrX, sqrY) {
        if (points.length == 2) {
            var ctrX = (points[0].x + points[1].x) / 2;
            var ctrY = (points[0].y + points[1].y) / 2;
            var closestVert = tank.body.getClosestVertice(ctrX, ctrY);
            var dist = Math.abs(points[0].x - closestVert.x);
            var sign = (tank.x > points[0].x) ? 1 : -1;
            tank.body.cX += ((dist + 0.001) * sign);
        }
        else {
            var dy = (Math.abs(sqrY * this.squareSize - points[0].y) > Math.abs((sqrY + 1) * this.squareSize - points[0].y)) ?
                (sqrY + 1) * this.squareSize - points[0].y : sqrY * this.squareSize - points[0].y;
            tank.body.cY += (dy + 0.001);
        }
        tank.body.updateVertices();
    };
    Level_SE.prototype.getPointBounce = function (x, y) {
        var offset = this.wallThickness / 2;
        return (((x - offset) % this.squareSize) == 0) || (((x + offset) % this.squareSize) == 0) || x == 0 || x == this.levelRect.right;
    };
    Level_SE.prototype.getRandomSpawnPos = function (sqrX, sqrY, width, height) {
        var minX = sqrX * this.squareSize + width / 2;
        var maxX = (sqrX + 1) * this.squareSize - width / 2;
        var minY = sqrY * this.squareSize + height / 2;
        var maxY = (sqrY + 1) * this.squareSize - height / 2;
        return new Geometry_SE_1.Vec2(minX + Math.random() * (maxX - minX), minY + Math.random() * (maxY - minY));
    };
    Level_SE.prototype.getRandomSpawn1 = function (width, height) {
        var index = Math.floor(Math.random() * this.spawns1.length);
        return this.getRandomSpawnPos(this.spawns1[index].x, this.spawns1[index].y, width, height);
    };
    Level_SE.prototype.getRandomSpawn2 = function (width, height) {
        var index = Math.floor(Math.random() * this.spawns2.length);
        return this.getRandomSpawnPos(this.spawns2[index].x, this.spawns2[index].y, width, height);
    };
    Level_SE.prototype.getRandomSpawnItems = function (width, height) {
        var index = Math.floor(Math.random() * this.spawnsItems.length);
        return this.getRandomSpawnPos(this.spawnsItems[index].x, this.spawnsItems[index].y, width, height);
    };
    Level_SE.prototype.dirXBounce = function (x, dirX) {
        var offset = this.wallThickness / 2;
        x = parseFloat(x.toFixed(5));
        if (((x + offset) % this.squareSize) == 0 || x == this.levelRect.right) {
            return Math.abs(dirX) * (-1);
        }
        if (((x - offset) % this.squareSize) == 0 || x == 0) {
            return Math.abs(dirX);
        }
        return dirX;
    };
    Level_SE.prototype.dirYBounce = function (y, dirY) {
        var offset = this.wallThickness / 2;
        y = parseFloat(y.toFixed(5));
        if (((y + offset) % this.squareSize) == 0 || y == this.levelRect.bottom) {
            return Math.abs(dirY) * (-1);
        }
        if (((y - offset) % this.squareSize) == 0 || y == 0) {
            return Math.abs(dirY);
        }
        return dirY;
    };
    return Level_SE;
}());
exports.Level_SE = Level_SE;
