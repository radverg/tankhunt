import { Room_SE } from "./Room_SE";
import { TankHunt_SE } from "./TankHunt_SE";

class MenuManager_SE extends Room_SE {
    
    private th: TankHunt_SE;
    
    constructor(th: TankHunt_SE) {
        super();

        this.th = th;
        
    } 
    
}

export { MenuManager_SE }