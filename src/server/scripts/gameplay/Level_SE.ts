import { Rect, Vec2 } from "./utils/Geometry_SE";
import { dist } from "./utils/MyMath_SE";
import { Tank_SE } from "./Tank_SE";

class Level_SE {

    walls: any[];
    borders: Rect[];
    tilesCountX: number;
    tilesCountY: number;
    squareSize: number;
    wallThickness: number;
    levelRect: Rect;
    spawns1: Vec2[];
    spawns2: Vec2[];
    spawnsItems: Vec2[];

    jsonString: string;
    [key: string] : any;

    constructor(tilesCountX?: number, tilesCountY?: number, squareSize?: number, wallThickness?: number) {
        this.walls = [];
        this.borders = [];

        this.tilesCountX = tilesCountX || 10;
        this.tilesCountY = tilesCountY || 10;

        this.squareSize = squareSize || 3;
        this.wallThickness = wallThickness || 0.1;

        var width = this.tilesCountX * this.squareSize;
        var height = this.tilesCountY * this.squareSize;
        this.levelRect = new Rect(width / 2, height / 2, width, height);

        this.generateBorders();
        this.generateRandomLevel();
    }

    parseJSONLevel(jsonString: string) {

        var lvl = null;

        // Parse string representation of the level to the object
        try {
            lvl = JSON.parse(jsonString);
        } catch(error) {
            console.log("Cannot parse JSON string! " + error.message);
        }
        this.jsonString = jsonString;

        // Import properties
        this.tilesCountX = lvl.tilesCountX;
        this.tilesCountY = lvl.tilesCountY;
        this.wallThickness = lvl.wallThickness;
        this.squareSize = lvl.squareSize;

        // Create level rectangle
        var width = this.tilesCountX * this.squareSize;
        var height = this.tilesCountY * this.squareSize;
        this.levelRect = new Rect(width / 2, height / 2, width, height);

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
                    this[spwns[sp]].push(new Vec2(x, y));
                }
            } else { // Inversion

                for (var x = 0; x < this.tilesCountX; x++) {
                    for (var y = 0; y < this.tilesCountY; y++) {
                        var index = lvl[spwns[sp]].indexOf(x + "|" + y);

                        if (index == -1) {
                            this[spwns[sp]].push(new Vec2(x, y));
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
                        var newWall = new Rect(x * this.squareSize + wallSize / 2, y * this.squareSize,
                            wallSize + this.wallThickness, this.wallThickness);
                        this.walls[x][y][0] = newWall;
                    }
                }

                // Vertical wall random
                if (x != 0) {
                    if (Math.random() > 0.5) {
                        var newWall = new Rect(x * this.squareSize, y * this.squareSize + wallSize / 2,
                            this.wallThickness, wallSize + this.wallThickness);
                        this.walls[x][y][1] = newWall;
                    }
                }
            }
        }
    }

    generateWall(squareX: number, squareY: number, type: number) {

        // Horizontal?
        if (type == 0) {
            return new Rect(squareX * this.squareSize + this.squareSize / 2, squareY * this.squareSize,
                            this.squareSize + this.wallThickness, this.wallThickness);
        }

        // Vertical?
        if (type == 1) {
            return new Rect(squareX * this.squareSize, squareY * this.squareSize + this.squareSize / 2,
                            this.wallThickness, this.squareSize + this.wallThickness);
        }

        return null;
    }

    getSquareCentre(squareX: number, squareY: number) {
        return new Vec2(this.squareSize * squareX + this.squareSize / 2, this.squareSize * squareY + this.squareSize / 2);
    }

    generateBorders() {
        var borderOver = 3;
        this.borders[0] = new Rect(this.levelRect.hWidth, -borderOver / 2, this.levelRect.w + borderOver * 2, borderOver);
        this.borders[1] = new Rect(this.levelRect.w + borderOver / 2, this.levelRect.hHeight, borderOver, this.levelRect.w + borderOver * 2);
        this.borders[2] = new Rect(this.levelRect.hWidth,  this.levelRect.h + borderOver / 2, this.levelRect.w + borderOver * 2, borderOver);
        this.borders[3] = new Rect(-borderOver / 2, this.levelRect.hHeight, borderOver, this.levelRect.w + borderOver * 2);
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

    getSqrX(x: number) {
        return Math.floor(x / this.squareSize);
    }

    getSqrY(y: number) {
        return Math.floor(y / this.squareSize);
    }

    isSquareInBounds(sqrX: number, sqrY: number) {
        return sqrX >= 0 && sqrY >= 0 && sqrX < this.tilesCountX && sqrY < this.tilesCountY;
    }

    wallCheckLoop(startX: number, startY: number, dirX: number, dirY: number) {

        var points = [];

        var x1 = startX;
        var y1 = startY;

        while (points.length === 0) {
            var x2 = x1 + dirX * this.squareSize;
            var y2 = y1 + dirY * this.squareSize;

            var squareX = Math.floor(x1 / this.squareSize);
            var squareY = Math.floor(y1 / this.squareSize);

            // Check the square of the first point
          //  var res1 = this.doubleWallPointCheck(squareX, squareY, dirX, dirY, x1, y1, x2, y2);
            var res1 = this.quadWallPointCheck(squareX, squareY, x1, y1, x2, y2);
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
               // var res2 = this.doubleWallPointCheck(squareX, squareY, -dirX, -dirY, x1, y1, x2, y2);
            var res2 = this.quadWallPointCheck(squareX, squareY, x1, y1, x2, y2);
                if (res2.length > 0) points.push(...res2);
            }

            // Set for next step
            x1 = x2;
            y1 = y2;
        }

        // Now points are found, lets find the closest one
        var closestPoint = points[0];
        for (var i = 1; i < points.length; i++) {
            if (dist(startX, startY, closestPoint.x, closestPoint.y) > 
                dist(startX, startY, points[i].x, points[i].y)) {
                closestPoint = points[i];
            }
        }

        // Oh, finally, return the result, our desired and hardly acquired point
        return closestPoint;
    }

    doubleWallPointCheck(squareX: number, squareY: number, dirX: number, dirY: number, x1: number, y1: number, x2: number, y2: number) {
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

    quadWallPointCheck(sqrX: number, sqrY: number, x1: number, y1: number, x2: number, y2: number) {
        let points = [];
        // Top
        if (this.walls[sqrX][sqrY][0]) {
            let pts = this.walls[sqrX][sqrY][0].simpleLineIntPoints(x1, y1, x2, y2);
            if (pts.length > 0) 
                points.push(...pts);
        }

        // Bottom
        if (sqrY + 1 < this.tilesCountY && this.walls[sqrX][sqrY + 1][0]) {
            let pts = this.walls[sqrX][sqrY + 1][0].simpleLineIntPoints(x1, y1, x2, y2);
            if (pts.length > 0) 
                points.push(...pts);
        }

        // Left 
        if (this.walls[sqrX][sqrY][1]) {
            let pts = this.walls[sqrX][sqrY][1].simpleLineIntPoints(x1, y1, x2, y2);
            if (pts.length > 0) 
                points.push(...pts);
        }

        // Right 
        if (sqrX + 1 < this.tilesCountX && this.walls[sqrX + 1][sqrY][1]) {
            let pts = this.walls[sqrX + 1][sqrY][1].simpleLineIntPoints(x1, y1, x2, y2);
            if (pts.length > 0) 
                points.push(...pts);
        }

        return points;

    }

    squareLineWallColl(sqrX: number, sqrY: number, tank: Tank_SE) {
        // Is square out of bounds?
        if (!this.isSquareInBounds(sqrX, sqrY))
            return;

        // Top horizontal wall
        if (sqrY == 0 || this.walls[sqrX][sqrY][0]) { // Is there a wall to collide with?
            var x1 = this.determineLeft(sqrX, sqrY, tank);
            var y1 = sqrY * this.squareSize;
            var x2 = this.determineRight(sqrX, sqrY, tank);
            var y2 = y1;

            var pts = tank.body.lineIntPoints(x1, y1, x2, y2);
            if (pts.length > 0) { // It collides
                this.horizontalLineSeparation(tank, pts, sqrX, sqrY);
            }
        }

        // Bottom horizontal wall
        if (sqrY == this.tilesCountY - 1 || this.walls[sqrX][sqrY + 1][0]) {
            var x1 = this.determineLeft(sqrX, sqrY + 1, tank);
            var y1 = (sqrY + 1) * this.squareSize;
            var x2 = this.determineRight(sqrX, sqrY + 1, tank);;
            var y2 = y1;

            pts = tank.body.lineIntPoints(x1, y1, x2, y2);
        
            if (pts.length > 0) { // It collides
                this.horizontalLineSeparation(tank, pts, sqrX, sqrY);
            }
        }

        // Left vertical wall
        if (sqrX == 0 || this.walls[sqrX][sqrY][1]) {
            var x1 = sqrX * this.squareSize;
            var y1 = this.determineTop(sqrX, sqrY, tank);
            var x2 = x1;
            var y2 = this.determineBottom(sqrY, sqrY, tank);

            pts = tank.body.lineIntPoints(x1, y1, x2, y2);
            if (pts.length > 0) { // It collides
                 this.verticalLineSeparation(tank, pts, sqrX, sqrY);
            }
        }

        // Right vertical wall
        if (sqrX == this.tilesCountX - 1 || this.walls[sqrX + 1][sqrY][1]) {
            var x1 = (sqrX + 1) * this.squareSize;
            var y1 = this.determineTop(sqrX + 1, sqrY, tank);
            var x2 = x1;
            var y2 = this.determineBottom(sqrX + 1, sqrY, tank);

            pts = tank.body.lineIntPoints(x1, y1, x2, y2);
            if (pts.length > 0) { // It collides
                this.verticalLineSeparation(tank, pts, sqrX, sqrY);
            }
        }

    }

    horizontalLineSeparation(tank: Tank_SE, points: Vec2[], sqrX: number, sqrY: number) {
       
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

    verticalLineSeparation(tank: Tank_SE, points: Vec2[], sqrX: number, sqrY: number) 
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

    determineLeft(sqrX: number, sqrY: number, tank: Tank_SE) {
        if (sqrY <= 0 || sqrY >= this.tilesCountY - 1 || this.walls[sqrX - 1][sqrY][0]) {
            return (sqrX - 1) * this.squareSize;
        } else {
            return (sqrX) * this.squareSize;
        }
    }

    determineRight(sqrX: number, sqrY: number, tank: Tank_SE) {
        if (sqrY <= 0 || sqrY >= this.tilesCountY - 1 || this.walls[sqrX + 1][sqrY][0]) {
            return (sqrX + 2) * this.squareSize;
        } else {
            return (sqrX + 1) * this.squareSize;
        }
    }
    determineTop(sqrX: number, sqrY: number, tank: Tank_SE) {
        if (sqrX <= 0 || sqrX >= this.tilesCountX - 1 || this.walls[sqrX][sqrY - 1][1]) {
            return (sqrY - 1) * this.squareSize;
        } else {
            return (sqrY) * this.squareSize;
        }
    }
    determineBottom(sqrX: number, sqrY: number, tank: Tank_SE) {
        if (sqrX <= 0 || sqrX >= this.tilesCountX - 1 || this.walls[sqrX][sqrY + 1][0]) {
            return (sqrY + 2) * this.squareSize;
        } else {
            return (sqrY + 1) * this.squareSize;
        }
    }
    
    /**
     * Figures out on which "wall axis" is this point, allowing to change direction correctly
     * True = horizontal
     * False = vertical
     * @param x 
     * @param y 
     */
    getPointBounce(x: number, y: number): boolean {
        let offset = this.wallThickness / 2;

        return (((x - offset) % this.squareSize) == 0) || (((x + offset) % this.squareSize) == 0) || x == 0 || x == this.levelRect.right;

        // let left = this.getSqrX(x) + offset;
        // let right = this.getSqrX(x) + this.squareSize - offset;

        // return x === left || x === right;
    }

    getRandomSpawnPos(sqrX: number, sqrY: number, width: number, height: number) {
        var minX = sqrX * this.squareSize + width / 2;
        var maxX = (sqrX + 1) * this.squareSize - width / 2;
        var minY = sqrY * this.squareSize + height / 2;
        var maxY = (sqrY + 1) * this.squareSize - height / 2;
        
        return new Vec2(minX + Math.random() * (maxX - minX), minY + Math.random() * (maxY - minY));
    }
    
    getRandomSpawn1(width: number, height: number) {
        var index = Math.floor(Math.random() * this.spawns1.length);
        return this.getRandomSpawnPos(this.spawns1[index].x, this.spawns1[index].y, width, height);
    }

    getRandomSpawn2(width: number, height: number) {
        var index = Math.floor(Math.random() * this.spawns2.length);
        return this.getRandomSpawnPos(this.spawns2[index].x, this.spawns2[index].y, width, height);
    }

    getRandomSpawnItems(width: number, height: number) {
        var index = Math.floor(Math.random() * this.spawnsItems.length);
        return this.getRandomSpawnPos(this.spawnsItems[index].x, this.spawnsItems[index].y, width, height);
    }

    dirXBounce(x: number, dirX: number) {
        let offset = this.wallThickness / 2;
        x = parseFloat(x.toFixed(5));

        if (((x + offset) % this.squareSize) == 0 || x == this.levelRect.right) {
            return Math.abs(dirX) * (-1);
    
        }

        if (((x - offset) % this.squareSize) == 0 || x == 0) {
            return Math.abs(dirX);
        }

        return dirX;
    }

    dirYBounce(y: number, dirY: number) {
        let offset = this.wallThickness / 2;
        y = parseFloat(y.toFixed(5));

        if (((y + offset) % this.squareSize) == 0 || y == this.levelRect.bottom) {
            return Math.abs(dirY) * (-1);
    
        }

        if (((y - offset) % this.squareSize) == 0 || y == 0) {
            return Math.abs(dirY);
        }

        return dirY;
    }
}

export { Level_SE };