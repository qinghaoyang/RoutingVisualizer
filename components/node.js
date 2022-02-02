class Node {
    constructor({id, x, y, edges=[], selected=false} = {}) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.selected = selected;
        this.edges = edges;
        this.packets = [];
        this.distance = {};
        this.path = {};
        this.distance[this.id] = 0;
        this.path[this.id] = [this.id];
    }

    initTable() {
        this.distance = {};
        this.path = {};
        this.distance[this.id] = 0;
        this.path[this.id] = [this.id];
    }

    setEdge(neighbor, length) {
        for (let edge of this.edges) {
            if (edge.neighborID == neighbor.id) {
                edge.length = length;
            }
        }
    }

    getEdgeLength(neighbor) {
        for (let edge of this.edges) {
            if (edge.neighborID == neighbor.id) {
                return edge.length;
            }
        }
    }

    deleteEdge(neighbor) {
        let indexInNeighbor = this.edges.findIndex(x => {
            return x.neighborID == neighbor.id;
        })
        this.edges.splice(indexInNeighbor, 1);
    }

    broadcastPacketPath(fromID, destID, distance, path) {
        for (const edge of this.edges) {
            if (fromID != edge.neighborID) {
                this.packets.push(new PacketPath({ x:this.x, y:this.y, 
                    fromID:this.id, toID:edge.neighborID, destID:destID, 
                    distance:distance, path:path }));
            }
        }
    }

    announceToNeighbors() {
        this.broadcastPacketPath(this.id, this.id, this.distance[this.id], this.path[this.id]);
    }

    receivePacketPath(packet) {
        let cycle = 0;
        for (const nodeID of packet.path) {
            if (nodeID == this.id) {
                cycle = 1;
                return;
            }
        }
        if (packet.distance == -1) {
            if (this.pathVector[packet.destID][1] == packet.fromID) {
                this.distance[packet.destID] = -1;
                this.broadcastPacketPath(packet.fromID, packet.destID, packet.distance, packet.path);
            }
            return;
        }
        for (const edge of this.edges) {
            if (packet.fromID == edge.neighborID) {
                var newDistance = packet.distance + edge.length;
                break;
            }
        }
        if ( !(packet.destID in this.distance) || newDistance < this.distance[packet.destID] ) 
        // || packet.path[0] == this.path[packet.destID][1]|| (newDistance == this.distance[packet.destID] && packet.path[0] < this.path[packet.destID][1])
        {
            this.distance[packet.destID] = newDistance;
            this.path[packet.destID] = [this.id].concat(packet.path);
            this.broadcastPacketPath(packet.fromID, packet.destID, this.distance[packet.destID], this.path[packet.destID]);
        }
    }
  }