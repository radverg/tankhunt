import { Player_SE } from "./Player_SE";
import { THGame_SE } from "./gamemodes/THGame_SE";
import { Vec2 } from "./utils/Geometry_SE";

class Bot_SE extends Player_SE {

    private thGame: THGame_SE;
    private updateCounter: number = 0;

    private headingTo: Vec2 = null;

    constructor(game: THGame_SE) {
        super(null, "bot");

        this.thGame = game;
    }

    update() {
        this.updateCounter++;

        // Check whether this bot is in desired square
        if (this.headingTo.equals(new Vec2(this.thGame.level.getSqrX(this.tank.x), this.thGame.level.getSqrX(this.tank.x)))) {
            // Yes - start
        }

        
    }
}

export { Bot_SE };