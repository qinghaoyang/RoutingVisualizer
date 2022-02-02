var packets = [];
var time = 0;
var frameID = 0;

function distance2D(x1, y1, x2, y2) {
    return Math.sqrt( Math.pow((x1-x2), 2) + Math.pow((y1-y2), 2) );
}
function drawPackets() {
    for (let packet of packets) {
        context.beginPath();
        context.fillStyle = "#FF0000";
        context.rect(packet.x, packet.y, packetWidth, packetHeght);
        context.fill();
        context.closePath();
    }
}
// function drawTables(destID) {
//     for (const [id, node] of Object.entries(nodes)) {
//         pathTable(destID, node.distance[destID], node.path[destID], node.x, node.y);
//     }
// }

function drawFlow() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    draw();
    drawPackets();
    let oldPackets = [...packets];
    // console.log(oldPackets);
    // for (const [id, node] of Object.entries(nodes)) {
    //     if (node.selected) {
    //         drawTables(node.id);
    //         break;
    //     }
    // }


    packets = [];
    if (time == 0) {
        for (const [id, node] of Object.entries(nodes)) {
            if (node.selected) {
                node.announceToNeighbors();
            }
        }
    }
    for (let packet of oldPackets) {
        const fromX = nodes[packet.fromID].x;
        const fromY = nodes[packet.fromID].y;
        const toX = nodes[packet.toID].x;
        const toY = nodes[packet.toID].y;
        const edgeLength = nodes[packet.fromID].getEdgeLength(nodes[packet.toID]);
        let distance = distance2D(fromX, fromY, toX, toY);
        packet.x += (toX - fromX) * speed / distance / edgeLength;
        packet.y += (toY - fromY) * speed / distance / edgeLength;
        if (distance2D(fromX, fromY, packet.x, packet.y) < distance) {
            packets.push(packet);
        }
        else {
            nodes[packet.toID].receivePacketPath(packet);
            updateTable(nodes[packet.toID], packet.destID);
        }
    }
    for (const [id, node] of Object.entries(nodes)) {
        for (const packet of node.packets) {
            packets.push(packet);
        }
        node.packets = [];
    }
    time = (time + 1) % sleepTime;
    frameID = requestAnimationFrame(drawFlow);
}

function advertiseOne() {
    for (const [id, node] of Object.entries(nodes)) {
        if (node.selected) {
            console.log(node.id);
            drawTables(node.id);
            drawFlow();
            break;
        }
    }
}

function advertiseAll() {
    for (const [id, node] of Object.entries(nodes))
        node.selected = true;
    drawFlow();
}

function stopFlow() {
    cancelAnimationFrame(frameID);
    for (const [id, node] of Object.entries(nodes)) {
        node.selected = false;
        node.initTable();
    }
    let tables = document.getElementsByClassName("pathTable");
    while(tables[0]) {
        tables[0].parentNode.removeChild(tables[0]);
    }
    packets = []; 
    context.clearRect(0, 0, canvas.width, canvas.height);
    draw();
}