import { Room_SE } from "./Room_SE";
import { TankHunt_SE } from "./TankHunt_SE";

class MenuManager_SE extends Room_SE {
    
    private th: TankHunt_SE;
    
    constructor(th: TankHunt_SE) {
        super();

        this.th = th;
        
    } 

    emitMenuInfo() {
        let gm = this.th.gameManager;
        let menuPacket: PacketMenuInfo = {
            arenaG: this.th.gameManager.getArenaCount(),
            totalP: this.th.socketManager.socketCount,
            menuP: this.getSocketCount(),
            teamG: this.th.gameManager.getTeamFightCount(),
            teamQ: this.th.gameManager.getTeamQueueCount(),
            duelG: this.th.gameManager.getDuelCount(),

        }
        
        this.broadcast("menuInfo", menuPacket);
    }

    processMenuChat(data: PacketChatMessage) {   
        this.broadcast("menuChat", data);
    }
    
}

export { MenuManager_SE }