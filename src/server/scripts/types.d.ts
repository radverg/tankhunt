import { Player_SE } from "./gameplay/Player_SE";

declare module "socket.io" {
    interface Socket {
        player?: Player_SE;
    }
} 