class PacketPath {
    constructor({x, y, fromID, toID, destID, distance, path} = {}) {
        this.x = x;
        this.y = y;
        this.fromID = fromID;
        this.toID = toID;
        this.destID = destID;
        this.distance = distance;
        this.path = path;
    }
}