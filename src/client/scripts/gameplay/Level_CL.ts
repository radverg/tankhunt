
class Level_CL {

    private squareSize: number;
    private tilesCountX: number;
    private tilesCountY: number;
    private wallThickness: number;
    private wallGroup: Phaser.Group;

    getSqrSize() {
        return this.squareSize;
    }

    fromJSON(jsonString: string, wallGroup: Phaser.Group) {
        let jsonLvl = null;

        wallGroup.removeAll(true);
        this.wallGroup = wallGroup;
       

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

        let wallWidth = this.squareSize + this.wallThickness;
        let wallHeight = 18;

        // Set world bounds
        var woffsetX = TH.game.width / 2;
        var woffsetY = TH.game.height / 2;
		TH.game.world.setBounds(-woffsetX, -woffsetY, (lvlWidth) + woffsetX * 2, 
            (lvlHeight) + 2 * woffsetY);
            
        // Now add background
        let groundAsset = `ground${Math.floor(Math.random() * 7) + 1}`;
        let outBack = 1000; 
        
		let bcg = TH.game.make.tileSprite(-woffsetX, -woffsetY, TH.game.world.width + woffsetX * 2,  TH.game.world.height + woffsetY * 2, groundAsset, 0) ;
        wallGroup.add(bcg);
 
       
        // Walls ----------------------------------------------
        let wallFrame = Math.floor(Math.random() * 3);

        for (let i in jsonLvl.walls) {
            let splitted = jsonLvl.walls[i].split("|");

            let y = parseInt(splitted[1]) * this.squareSize;
            let x = parseInt(splitted[0]) * this.squareSize;
            let type = parseInt(splitted[2]);

            

            let wallSpr = TH.game.make.sprite(x, y, "wallTriple");
            // wallSpr.autoCull = true; // !!!!!!!!!!!!!
            wallSpr.frame = wallFrame;
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

        this.generateBorders();
       
        console.log("Level parsed!");

    }

    generateBorders() {
        // Borders --------------------------------------------------------
        let lvlWidth = this.tilesCountX * this.squareSize;
        let lvlHeight = this.tilesCountY * this.squareSize;
        let targetSize = 580;
        let borderCount = Math.ceil(lvlWidth / targetSize);
        let realSize = lvlWidth / borderCount;
        let thickness = null;
        let trim = 30;
        let borderAsset =  "wallTest"; // `wallSide${Math.floor(Math.random() * 3) + 1}`;
        let borderNum = Math.floor(Math.random() * 4);

        // Horizontals
        for (let i = 0; i < borderCount; i++) {
            // Top
            let spr1 = TH.game.make.sprite((realSize * i) + realSize / 2, 0, borderAsset);
            spr1.anchor.setTo(0.5);
            spr1.width = realSize;
            spr1.scale.y = spr1.scale.x;
            thickness = spr1.height;
            spr1.y = -thickness / 2 + trim;
            let frm = borderNum * 3 + (i % 3);
            spr1.frame = frm;
        
            // Bottom
            let spr2 = TH.game.make.sprite((realSize * i) + realSize / 2, 0, borderAsset);
            spr2.anchor.setTo(0.5);
            spr2.width = realSize;
            spr2.scale.y = spr2.scale.x;
            spr2.y = lvlHeight + thickness / 2 - trim;
            spr2.frame = frm;

            this.wallGroup.add(spr1);
            this.wallGroup.add(spr2);
            
        }

        // Verticals
        let thck = thickness - trim * 1.65;
        borderCount = Math.ceil((lvlHeight + thck * 2) / targetSize);
        realSize = (lvlHeight + (thck * 2)) / borderCount; 
        let verThickness = null;

        for (let i = 0; i < borderCount; i++) {
            // Left
            let spr1 = TH.game.make.sprite(0, (realSize * i) + realSize / 2 - thck, borderAsset);
            spr1.anchor.setTo(0.5);
            spr1.width = realSize;
            spr1.rotation = Math.PI / 2;
            spr1.scale.y = spr1.scale.x;
            verThickness = spr1.height;
            spr1.x = -verThickness / 2 + trim;
            let frm = borderNum * 3 + (i % 3);
            spr1.frame = frm;


            // Right
            let spr2 = TH.game.make.sprite(lvlWidth + verThickness / 2 - trim, (realSize * i) + realSize / 2 - thck, borderAsset);
            spr2.anchor.setTo(0.5);
            spr2.width = realSize;
            spr2.rotation = Math.PI / 2;
            spr2.scale.y = spr2.scale.x;
            spr2.frame = frm;


            this.wallGroup.add(spr1);
            this.wallGroup.add(spr2);
            
        }
        // -----------------------------------------------------
    }

}