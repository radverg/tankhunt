var mymath = require("./MyMath");
var Geom = require("./Geometry");

module.exports = {

    // createRandomWalls: function (maxXTiles, minXTiles, maxYTiles, minYTiles) {
    //     var tiles = [];
    //     var tilesXCount = mymath.getRandomInt(minXTiles || 3, maxXTiles || 4);
    //     var tilesYCount = mymath.getRandomInt(minYTiles || 3, maxYTiles || 4);

    //     // Create borders --
    //     tiles[0] = []; tiles[tilesXCount - 1] = [];
    //     for (var x = 1; x < tilesXCount - 1; x++) {
    //         tiles[x] = [];
    //         tiles[x][0] = 3;
    //         tiles[x][tilesYCount - 1] = 1
    //     }

    //     for (var y = 1; y < tilesYCount - 1; y++) {
    //         tiles[0][y] = 2;
    //         tiles[tilesXCount - 1][y] = 4;
    //     }

    //     for (var x = 1; x < tilesXCount - 1; x++) {
    //         for (var y = 1; y < tilesYCount - 1; y++) {
    //             tiles[x][y] = mymath.getRandomInt(1, 4);
    //         }
    //     }

    //   //  console.log(tiles);
    //     return tiles;
    // },

    newDefaultLevel: function() {
        return new Level();
    }

}

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
                            wallSize, this.wallThickness);
                        this.walls[x][y][0] = newWall;
                    }
                }

                // Vertical wall random
                if (x != 0) {
                    if (Math.random() > 0.5) {
                        var newWall = new Geom.rect(x * this.squareSize, y * this.squareSize + wallSize / 2,
                            this.wallThickness, wallSize);
                        this.walls[x][y][1] = newWall;
                    }
                }
            }
        }
    }

    generateBorders() {
        var borderOver = 3;
        this.borders[0] = new Geom.rect(this.levelRect.hWidth, -borderOver / 2, this.levelRect.w + borderOver * 2, borderOver);
        this.borders[1] = new Geom.rect(this.levelRect.w + borderOver / 2, this.levelRect.hHeight, borderOver, this.levelRect.w + borderOver * 2);
        this.borders[2] = new Geom.rect(this.levelRect.hWidth,  this.levelRect.h + borderOver / 2, this.levelRect.w + borderOver * 2, borderOver);
        this.borders[3] = new Geom.rect(-borderOver / 2, this.levelRect.hHeight, borderOver, this.levelRect.w + borderOver * 2);
    }
}

