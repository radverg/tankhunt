class Room_SE {

    private sockets: SocketIO.Socket[] = [];

    addSocket(socket: SocketIO.Socket) {
         this.sockets.push(socket);
    }

    removeSocket(socket: SocketIO.Socket) {
        let index = this.sockets.indexOf(socket);
        if (index == -1) return;

        this.sockets.splice(index, 1);
    }

    broadcast(emName: string, content: any) {

        for (let s = 0; s < this.sockets.length; s++) {
            this.sockets[s].emit(emName, content);
        }
    }
}

export { Room_SE }