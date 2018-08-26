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

    broadcast(emName: string, content: any, exception?: SocketIO.Socket) {

        for (let s = 0; s < this.sockets.length; s++) {
            if (this.sockets[s] == exception) 
                continue;

            this.sockets[s].emit(emName, content);
        }
    }

    getSocketCount() {
        return this.sockets.length;
    }
}

export { Room_SE }