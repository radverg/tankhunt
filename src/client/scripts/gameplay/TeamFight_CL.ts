
class TeamFight_CL extends THGame_CL {

    private uiTeamFight: UITeamFight_CL;
    private capTime: number;

    onCapture: Phaser.Signal = new Phaser.Signal();

    private caps: { [key: string]: Capture_CL } = { };

    allyCapturedCount: number = 0;
    enemyCapturedCount: number = 0;

    constructor(sm: SocketManager_CL, packet: PacketTeamGameStart) {
        super(sm);

        this.uiTeamFight = new UITeamFight_CL(this.game, this);

        this.processGameInfo(packet);

        // Set colors
        let me = this.playerGroup.me;
        for (const key in this.playerGroup.players) {
            const plr = this.playerGroup.players[key];
                
            if (!plr.isEnemyOf(me) && plr !== me) {
                // Set green color
                this.playerGroup.setFriend(plr);
            }
        }

        this.processLevel(packet.level);

        

        this.running = true;
        this.capTime = packet.capTime;

        // Generate caps
        for (const cap of packet.caps) {
            let splID = cap.id.split("|");
            let sqrX = parseInt(splID[0].substr(1));
            let sqrY = parseInt(splID[1]);

            let capSpr = new Capture_CL(sqrX, sqrY, this.level.getSqrSize(), cap.tm, me.team, this.capTime, this.game);
            this.levelGroup.add(capSpr);
            this.caps[capSpr.id] = capSpr;
        }

        // Wind effect
		TH.effects.playAudioLooping(SoundNames.WIND);


        this.onGameStart.dispatch(packet);

    }

    processRespawn(data: PacketRespawn) {
        let player: Player_CL = this.playerGroup.getPlayer(data.plID);
		if (!player) return;
		
		player.tank.maxHealth = data.health;
		player.tank.health = data.health;
		
		player.tank.applyStatePacket(data);
        player.tank.jumpToRemote();
        player.tank.revive();

        if (player.me) {
            TH.effects.playAudio(SoundNames.RESPAWN);
        }
        
        this.onRespawn.dispatch(player);
    }

    processCapture(data: PacketCapture) {

        let cap = this.caps[data.id];
        if (!cap) return;

        if (data.rs || data.st) {
            cap.startCapturing();
        }

        if (data.cn) {
            cap.cancelCapturing();
        }

        if (data.fin) {
            delete this.caps[cap.id];
            cap.fadeOut();

            let plr = this.playerGroup.getPlayer(data.plID);
            if (plr) {
                plr.stats.caps++;
            }

            if (cap.team == this.playerGroup.me.team) {
                this.allyCapturedCount++;
            } else {
                this.enemyCapturedCount++;
            }
            
            console.log("Captured!");
        }

        this.onCapture.dispatch(data);
    }

    processGameFinish(data: PacketGameFinish) {
        
        this.onGameFinish.dispatch(data);
    }

    processHeal(data: PacketHeal) {

        let plrs = this.playerGroup.players;

        for (const id in plrs) {
            let plr = plrs[id];
            if (plr.team !== data.tm) continue;

            plr.tank.health = Math.min(plr.tank.health + data.amount, plr.tank.maxHealth);
            this.onHeal.dispatch(plr, data);
        }
        
    }

    destroy() {
        super.destroy();
        this.onCapture.dispose();
    }
}