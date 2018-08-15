
class Level_CL {

    private squareSize: number;
    private tilesCountX: number;
    private tilesCountY: number;
    private wallThickness: number;

    fromJSON(jsonString: string, wallGroup: Phaser.Group) {
        let jsonLvl = null;

        wallGroup.removeAll(true);
       

         // Parse string representation of the level to the object
        try {
            jsonLvl = JSON.parse(jsonString);
        } catch(error) {
            console.log("Cannot parse JSON string! " + error.message);
        }

        // Import properties
        this.tilesCountX = jsonLvl.tilesCountX;
        this.tilesCountY = jsonLvl.tilesCountY;
        this.wallThickness = jsonLvl.wallThickness * TH.sizeCoeff;
        this.squareSize = jsonLvl.squareSize * TH.sizeCoeff;

        let lvlWidth = this.tilesCountX * this.squareSize;
        let lvlHeight = this.tilesCountY * this.squareSize;

        let wallWidth = this.squareSize + this.wallThickness * 2;
        let wallHeight = 18;
        let trim = 2;

        // Set world bounds
		var woffset = 200;
		TH.game.world.setBounds(-woffset, -woffset, (lvlWidth) + 2*woffset, 
            (lvlHeight) + 2*woffset);
            
        // Now add background
		let bcg = TH.game.make.tileSprite(0, 0, TH.game.world.width - woffset *2,  TH.game.world.height - woffset*2, "ground1",0) ;
        wallGroup.add(bcg);

        let WallShadGrp = new Phaser.Group(wallGroup.game, wallGroup);
        
        // Borders --------------------------------------------------------
        let targetSize = 600;
        let borderCount = Math.round(lvlWidth / targetSize);
        let realSize = lvlWidth / borderCount;
        let thickness = null;

        // Horizontals
        for (let i = 0; i < borderCount; i++) {
            // Top
            let spr1 = TH.game.make.sprite((realSize * i) + realSize / 2, 0, "wallSide1");
            spr1.anchor.setTo(0.5);
            spr1.width = realSize;
            spr1.scale.y = spr1.scale.x;
            thickness = spr1.height;
            spr1.y = -thickness / 2 + trim;
        
            // Bottom
            let spr2 = TH.game.make.sprite((realSize * i) + realSize / 2, 0, "wallSide1");
            spr2.anchor.setTo(0.5);
            spr2.width = realSize;
            spr2.scale.y = spr2.scale.x;
            spr2.y = lvlHeight + thickness / 2 - trim;

            wallGroup.add(spr1);
            wallGroup.add(spr2);
            
        }

        // Verticals
        borderCount = Math.round((lvlHeight + thickness * 2) / targetSize);
        realSize = (lvlHeight + (thickness * 2)) / borderCount; 
        let verThickness = null;

        for (let i = 0; i < borderCount; i++) {
            // Left
            let spr1 = TH.game.make.sprite(0, (realSize * i) + realSize / 2 - thickness, "wallSide1");
            spr1.anchor.setTo(0.5);
            spr1.width = realSize;
            spr1.rotation = Math.PI / 2;
            spr1.scale.y = spr1.scale.x;
            verThickness = spr1.height;
            spr1.x = -verThickness / 2 + trim;

            // Right
            let spr2 = TH.game.make.sprite(lvlWidth + verThickness / 2 - trim, (realSize * i) + realSize / 2 - thickness, "wallSide1");
            spr2.anchor.setTo(0.5);
            spr2.width = realSize;
            spr2.rotation = Math.PI / 2;
            spr2.scale.y = spr2.scale.x;

            wallGroup.add(spr1);
            wallGroup.add(spr2);
            
        }
        // -----------------------------------------------------

        // Walls ----------------------------------------------
        for (let i in jsonLvl.walls) {
            let splitted = jsonLvl.walls[i].split("|");

            let y = parseInt(splitted[1]) * this.squareSize;
            let x = parseInt(splitted[0]) * this.squareSize;
            let type = parseInt(splitted[2]);
            

            let wallSpr = TH.game.make.sprite(x, y, "wall1");
            wallSpr.width = wallWidth;
            wallSpr.height = wallHeight;
            wallSpr.anchor.setTo(0.5);

            if (type === 0) { // Horizontal
                wallSpr.x += this.squareSize / 2;
              
               
            } else { // Vertical
                wallSpr.y += this.squareSize / 2;
                wallSpr.rotation = Math.PI / 2;
               
            }
            
            wallGroup.add(wallSpr);
        }
        // -------------------------------------------------------

        console.log("Level parsed!");

    }
}