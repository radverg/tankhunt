var mymath = require("./utils/MyMath");
var Geom = require("./utils/Geometry");


class Level {

    constructor(tilesCountX, tilesCountY, squareSize, wallThickness) {
        this.walls = [];
        this.borders = [];

        this.tilesCountX = tilesCountX || 10;
        this.tilesCountY = tilesCountY || 10;

        this.squareSize = squareSize || 3;
        this.wallThickness = wallThickness || 0.1;

        var width = this.tilesCountX * this.squareSize;
        var height = this.tilesCountY * this.squareSize;
        this.levelRect = new Geom.rect(width / 2, height / 2, width, height);

        this.generateBorders();
        this.generateRandomLevel();
    }

    parseJSONLevel(jsonString) {

        var lvl = null;

        // Parse string representation of the level to the object
        try {
            lvl = JSON.parse(jsonString);
        } catch(error) {
            console.log("Cannot parse JSON string! " + error.message);
        }

        // Import properties
        this.tilesCountX = lvl.tilesCountX;
        this.tilesCountY = lvl.tilesCountY;
        this.wallThickness = lvl.wallThickness;
        this.squareSize = lvl.squareSize;

        // Create level rectangle
        var width = this.tilesCountX * this.squareSize;
        var height = this.tilesCountY * this.squareSize;
        this.levelRect = new Geom.rect(width / 2, height / 2, width, height);

        // Prepare wall array
        this.emptyWalls();
        
        for (var i in lvl.walls) {
            var splitted = lvl.walls[i].split("|");
            var x = parseInt(splitted[0]);
            var y = parseInt(splitted[1]);
            var type = parseInt(splitted[2]);
            this.walls[x][y][type] = this.generateWall(x, y, type);
        }

        // Prepare spawns
        var spwns = ["spawns1", "spawns2", "spawnsItems"];
        this.spawns1 = []; this.spawns2 = []; this.spawnsItems = [];

        for (var sp in spwns) {

            if (!lvl["invert" + spwns[sp]]) { // No inversion
                for (var block in lvl[spwns[sp]]) {
                    var splitted = lvl[spwns[sp]][block].split("|");
                    var x = parseInt(splitted[0]);
                    var y = parseInt(splitted[1]);
                    this[spwns[sp]].push(new Geom.vec2(x, y));
                }
            } else { // Inversion

                for (var x = 0; x < this.tilesCountX; x++) {
                    for (var y = 0; y < this.tilesCountY; y++) {
                        var index = lvl[spwns[sp]].indexOf(x + "|" + y);

                        if (index == -1) {
                            this[spwns[sp]].push(new Geom.vec2(x, y));
                        }
                    }
                }
            }
        }

        // Add borders
        this.generateBorders();
    }

    generateRandomLevel() {
        var wallSize = this.squareSize;
               
        for (var x = 0; x < this.tilesCountX; x++) {
            this.walls.push([]);
            for (var y = 0; y < this.tilesCountY; y++) {
                this.walls[x][y] = [null, null];

                // Horizontal wall random
                if (y != 0) {
                    if (Math.random() > 0.5) {
                        var newWall = new Geom.rect(x * this.squareSize + wallSize / 2, y * this.squareSize,
                            wallSize + this.wallThickness, this.wallThickness);
                        this.walls[x][y][0] = newWall;
                    }
                }

                // Vertical wall random
                if (x != 0) {
                    if (Math.random() > 0.5) {
                        var newWall = new Geom.rect(x * this.squareSize, y * this.squareSize + wallSize / 2,
                            this.wallThickness, wallSize + this.wallThickness);
                        this.walls[x][y][1] = newWall;
                    }
                }
            }
        }
    }

    generateWall(squareX, squareY, type) {

        // Horizontal?
        if (type == 0) {
            return new Geom.rect(squareX * this.squareSize + this.squareSize / 2, squareY * this.squareSize,
                            this.squareSize + this.wallThickness, this.wallThickness);
        }

        // Vertical?
        if (type == 1) {
            return new Geom.rect(squareX * this.squareSize, squareY * this.squareSize + this.squareSize / 2,
                            this.wallThickness, this.squareSize + this.wallThickness);
        }

        return null;
    }

    getSquareCentre(squareX, squareY) {
        return new Geom.vec2(squareSize * squareX + squareSize / 2, squareSize * squareY + squareSize / 2);
    }

    generateBorders() {
        var borderOver = 3;
        this.borders[0] = new Geom.rect(this.levelRect.hWidth, -borderOver / 2, this.levelRect.w + borderOver * 2, borderOver);
        this.borders[1] = new Geom.rect(this.levelRect.w + borderOver / 2, this.levelRect.hHeight, borderOver, this.levelRect.w + borderOver * 2);
        this.borders[2] = new Geom.rect(this.levelRect.hWidth,  this.levelRect.h + borderOver / 2, this.levelRect.w + borderOver * 2, borderOver);
        this.borders[3] = new Geom.rect(-borderOver / 2, this.levelRect.hHeight, borderOver, this.levelRect.w + borderOver * 2);
    }

    emptyWalls() {
        this.walls = [];

        for (var x = 0; x < this.tilesCountX; x++) {
            this.walls.push([]);
            for (var y = 0; y < this.tilesCountY; y++) {
                   this.walls[x][y] = [null, null];
            }   
        }
    }

    getSqrX(x) {
        return Math.floor(x / this.squareSize);
    }

    getSqrY(y) {
        return Math.floor(y / this.squareSize);
    }

    isSquareInBounds(sqrX, sqrY) {
        return sqrX >= 0 && sqrY >= 0 && sqrX < this.tilesCountX && sqrY < this.tilesCountY;
    }

    wallCheckLoop(startX, startY, dirX, dirY) {

        var points = [];

        var x1 = startX;
        var y1 = startY;

        while (points.length === 0) {
            var x2 = x1 + dirX * this.squareSize;
            var y2 = y1 + dirY * this.squareSize;

            var squareX = Math.floor(x1 / this.squareSize);
            var squareY = Math.floor(y1 / this.squareSize);

            // Check the square of the first point
            var res1 = this.doubleWallPointCheck(squareX, squareY, dirX, dirY, x1, y1, x2, y2);
            if (res1.length > 0) points.push(...res1);
           
            // Is second point already out of bounds?
            if (!this.levelRect.contains(x2, y2)) {
                var point = this.levelRect.simpleLineIntPoints(x1, y1, x2, y2);
                if (point.length > 0)
                    points.push(...point);    
                break;
            } else { // No? Check the next square then
                squareX = Math.floor(x2 / this.squareSize);
                squareY = Math.floor(y2 / this.squareSize);
                var res2 = this.doubleWallPointCheck(squareX, squareY, -dirX, -dirY, x1, y1, x2, y2);
                if (res2.length > 0) points.push(...res2);
            }

            // Set for next step
            x1 = x2;
            y1 = y2;
        }

        // Now points are found, lets find the closest one
        var closestPoint = points[0];
        for (var i = 1; i < points.length; i++) {
            if (mymath.dist(startX, startY, closestPoint.x, closestPoint.y) > 
                mymath.dist(startX, startY, points[i].x, points[i].y)) {
                closestPoint = points[i];
            }
        }

        // Oh, finally, return the result, our desired and hardly acquired point
        return closestPoint;
    }

    doubleWallPointCheck(squareX, squareY, dirX, dirY, x1, y1, x2, y2) {
        var points = [];
        // Check vertical 1
        if (dirX > 0) squareX++; 
        if (squareX < this.tilesCountX && this.walls[squareX][squareY][1]) { // Is the square in level bounds and is there a wall?
            // Ok, check whether it intersects with our line
            var pts = this.walls[squareX][squareY][1].simpleLineIntPoints(x1, y1, x2, y2);
            if (pts.length > 0)
                points.push(...pts);
        }
        if (dirX > 0) squareX--;

        // Check horizontal 
        if (dirY > 0) squareY++;
        if (squareY < this.tilesCountY && this.walls[squareX][squareY][0]) { // Is the square in level bounds and is there a wall?
            // Ok, check whether it intersects with our line
            var pts = this.walls[squareX][squareY][0].simpleLineIntPoints(x1, y1, x2, y2);
            if (pts.length > 0)
                points.push(...pts);
        }

        return points;
    }

    squareLineWallColl(sqrX, sqrY, tank) {
        // Is square out of bounds?
        if (!this.isSquareInBounds(sqrX, sqrY))
            return;

        // Top horizontal wall
        if (sqrY == 0 || this.walls[sqrX][sqrY][0]) { // Is there a wall to collide with?
            var x1 = sqrX * this.squareSize;
            var y1 = sqrY * this.squareSize;
            var x2 = (sqrX + 1) * this.squareSize;
            var y2 = y1;

            var pts = tank.body.lineIntPoints(x1, y1, x2, y2);
            if (pts.length > 0) { // It collides
                this.horizontalLineSeparation(tank, pts, sqrX, sqrY);
            }
        }

        // Bottom horizontal wall
        if (sqrY == this.tilesCountY - 1 || this.walls[sqrX][sqrY + 1][0]) {
            var x1 = sqrX * this.squareSize;
            var y1 = (sqrY + 1) * this.squareSize;
            var x2 = (sqrX + 1) * this.squareSize;
            var y2 = y1;

            pts = tank.body.lineIntPoints(x1, y1, x2, y2);
            if (pts.length > 0) { // It collides
                this.horizontalLineSeparation(tank, pts, sqrX, sqrY);
            }
        }

        // Left vertical wall
        if (sqrX == 0 || this.walls[sqrX][sqrY][1]) {
            var x1 = sqrX * this.squareSize;
            var y1 = sqrY * this.squareSize;
            var x2 = x1;
            var y2 = (sqrY + 1) * this.squareSize;

            pts = tank.body.lineIntPoints(x1, y1, x2, y2);
            if (pts.length > 0) { // It collides
                 this.verticalLineSeparation(tank, pts, sqrX, sqrY);
            }
        }

        // Right vertical wall
        if (sqrX == this.tilesCountX - 1 || this.walls[sqrX + 1][sqrY][1]) {
            var x1 = (sqrX + 1) * this.squareSize;
            var y1 = sqrY * this.squareSize;
            var x2 = x1;
            var y2 = (sqrY + 1) * this.squareSize;

            pts = tank.body.lineIntPoints(x1, y1, x2, y2);
            if (pts.length > 0) { // It collides
                this.verticalLineSeparation(tank, pts, sqrX, sqrY);
            }
        }

    }

    horizontalLineSeparation(tank, points, sqrX, sqrY) {
       
        if (points.length == 2) {
            
            var ctrX = (points[0].x + points[1].x) / 2;
            var ctrY = (points[0].y + points[1].y) / 2;

            // Find the closest vertice
            var closestVert = tank.body.getClosestVertice(ctrX, ctrY); 

            var dist = Math.abs(points[0].y - closestVert.y);
            var sign = (tank.y > points[0].y) ? 1 : -1;

            // Final move
            tank.body.cY += ((dist + 0.001) * sign);


        } else {
            
            var dx = (Math.abs(sqrX * this.squareSize - points[0].x) > Math.abs((sqrX + 1) * this.squareSize - points[0].x)) ?
                (sqrX + 1) * this.squareSize - points[0].x : sqrX * this.squareSize - points[0].x;

            // Final move
            tank.body.cX += (dx + 0.001);
        }

        tank.body.updateVertices();
    }

    verticalLineSeparation(tank, points, sqrX, sqrY) 
    {
        if (points.length == 2) {

            var ctrX = (points[0].x + points[1].x) / 2;
            var ctrY = (points[0].y + points[1].y) / 2;

            // Find the closest vertice
            var closestVert = tank.body.getClosestVertice(ctrX, ctrY); 

            var dist = Math.abs(points[0].x - closestVert.x);
            var sign = (tank.x > points[0].x) ? 1 : -1;

            // Final move
            tank.body.cX += ((dist + 0.001) * sign);

        } else {

            var dy = (Math.abs(sqrY * this.squareSize - points[0].y) > Math.abs((sqrY + 1) * this.squareSize - points[0].y)) ?
                (sqrY + 1) * this.squareSize - points[0].y : sqrY * this.squareSize - points[0].y;

            // Final move
            tank.body.cY += (dy + 0.001);
        }

        tank.body.updateVertices();

    }

    getRandomSpawnPos(sqrX, sqrY, width, height) {
        var minX = sqrX * this.squareSize + width / 2;
        var maxX = (sqrX + 1) * this.squareSize - width / 2;
        var minY = sqrY * this.squareSize + height / 2;
        var maxY = (sqrY + 1) * this.squareSize - height / 2;
        
        return new Geom.vec2(minX + Math.random() * (maxX - minX), minY + Math.random() * (maxY - minY));
    }
    
    getRandomSpawn1(width, height) {
        var index = Math.floor(Math.random() * this.spawns1.length);
        return this.getRandomSpawnPos(this.spawns1[index].x, this.spawns1[index].y, width, height);
    }

    getRandomSpawn2(width, height) {
        var index = Math.floor(Math.random() * this.spawns2.length);
        return this.getRandomSpawnPos(this.spawns2[index].x, this.spawns2[index].y, width, height);
    }

    getRandomSpawnItems(width, height) {
        var index = Math.floor(Math.random() * this.spawnsItems.length);
        return this.getRandomSpawnPos(this.spawnsItems[index].x, this.spawnsItems[index].y, width, height);
    }
}

module.exports = Level;

