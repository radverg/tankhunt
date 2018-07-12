interface PacketGameObject {
    /**
     * Text id that gameobject acquired from the server
     */
    id: string,
    /**
     * X coordinate of the gameobject's position
     */
    x: number,
    /**
     * Y coordinate of the gameobject's position
     */
    y: number,
    /**
     * Rotation in RADIANS
     */
    rot: number

}

interface PacketTank extends PacketGameObject {
    /**
     * Turret rotation in RADIANS
     */
    turrRot: number,
    /**
     * String ID of the player that owns this tank, this id is generated
     * by socket.io
     */
    plID: string
}

interface PacketPlayerInfo {
    /**
     * Id of the player generated by socket.io
     */
    id: string,
    /**
     * Name of the player
     */
    name: string,
    /**
     * Object that contains information about current player's statistics
     */
    stats?: any,
    /**
     * Determine if player is currently alive on the server
     */
    alive: boolean
    /**
     * Information about player's tank
     */
    tank?: PacketTank
}

interface PacketShotStart extends PacketGameObject {
    /**
     * Type of the shot
     */
    type: string,
    /**
     * X coordinate of the start position
     */
    startX: number,
    /**
     * Y coordinate of the start position
     */
    startY: number,
    /**
     * The time indicating when the shot was created on the server
     */
    startTime: number,
    /**
     * socket.io ID of the player that shoot this shot
     */
    ownerID: string
    /**
     * X coordinate of the shot's endpoint
     */
    endX?: number,
    /**
     * Y coordinate of the shot's endpoint
     */
    endY?: number,
    /**
     * Speed of the shot
     */
    speed?: number,
    /**
     * Bounce points of the shot
     */
    pts?: {x:number, y: number, ang: number}[]
}

interface BouncePoint {
	x: number,
	y: number,
	ang: number
}

interface PacketBouncerShotStart extends PacketShotStart {
    pts: BouncePoint[]
}

interface PacketRespawn extends PacketTank {
    /**
     * Time when the respawn countdown starts
     */
    serverTime: number,
    /**
     * Time to the actual respawn
     */
    respawnDelay: number,
    /**
     * How long immunity is after tank is actually respawned
     */
    immunityTime: number
}

interface PacketItem extends PacketGameObject {
    /**
     * Type of the shot, proper object is generated according to this index
     */
    typeIndex: number
}

interface PacketGameInfo {
    players: PacketPlayerInfo[],
    items: PacketItem[]
}
interface PacketItemCollect {
    /**
     * Id of collected item
     */
    id: string;
    /**
     * Id of player that collected this item
     */
    playerID: string;
}

interface PacketGameStart extends PacketGameInfo {
    gameType: string,
    level: any
}

interface PacketGameRequest {
    gameType: string,
    playerName: string
}

interface PacketMovable {
    players: PacketTank[]
}

interface PacketKill {
    /**
     * Id of a player that was killing (not id of his tank!)
     */
    killerID: string,
    /**
     * Id of a player that was killed (not id of his tank!)
     */
    killedID: string,
    /**
     * Id of a shot that was killing
     */
    shotID: string
}
