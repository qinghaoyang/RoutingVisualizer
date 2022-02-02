const DOMURL = self.URL || self.webkitURL || self;

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const radius = 12;
const fillStyle = '#D6E5FA';
const selectedFillStyle = '#88aaaa';
const strokeStyle = '#009999';
const font = '12pt Calibri';
const textStyle = 'black';

const packetStyle = "#FF0000";
const packetWidth = 8;
const packetHeght = 6;
const speed = 1;
const sleepTime = 500;

const edge_div = document.createElement('div');
edge_div.innerHTML = `
    <a>Change the length of edge</a><br>
    <input type="text" id="edgeLength" value="1" />
    <input type="button" id="confirmChange" value="Confirm" />
    <input type="button" id="deleteEdge" value="Delete Edge" />
`;

function middle(node1, node2) {
    return [(node1.x + node2.x) / 2, (node1.y + node2.y) / 2];
}

function editEdge(node1, node2) {
    let absoluteX = middle(node1, node2)[0] + canvas.getBoundingClientRect().left;
    let absoluteY = middle(node1, node2)[1] + canvas.getBoundingClientRect().top;
    edge_div.style.position = "absolute";
    edge_div.style.left = absoluteX+'px';
    edge_div.style.top = absoluteY+'px';
    document.body.appendChild(edge_div);
    let confirmChange = document.getElementById('confirmChange');
    let deleteEdge = document.getElementById('deleteEdge');
    confirmChange.onclick = function () { changeLength(node1, node2); };
    deleteEdge.onclick = function () { deleteEdgeInNodes(node1, node2); };
}

function changeLength(node1, node2) {
    let length = document.getElementById('edgeLength').value;
    node1.setEdge(node2, length);
    node2.setEdge(node1, length);
    document.body.removeChild(edge_div);
    draw();
}

function deleteEdgeInNodes(node1, node2) {
    node1.deleteEdge(node2);
    node2.deleteEdge(node1);
    document.body.removeChild(edge_div);
    draw();
}

// edge_tb=document.createElement('INPUT');
// edge_tb.type='HIDDEN';
// edge_tb.name='hidden1';
// edge_tb.value='Values of edge hidden1';
// edge_form.appendChild(edge_tb);

var nodes = {};
var selection = undefined;
var nodeID = 0;
var edgeID = 0;

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.zIndex = -1;
    draw();
}

function drawNode(node) {
    context.beginPath();
    context.fillStyle = node.fillStyle;
    context.arc(node.x, node.y, node.radius, 0, Math.PI * 2, true);
    context.strokeStyle = node.strokeStyle;
    context.stroke();
    context.fill();
}

function click(canvas, e) {
    const rect = canvas.getBoundingClientRect()
    let node = {
        x: e.x - rect.left,
        y: e.y - rect.top,
        radius: 10,
        fillStyle: '#22cccc',
        strokeStyle: '#009999'
    };
    nodes.push(node);
    drawNode(node);
}

window.onresize = resize;
resize();
// canvas.addEventListener('mousedown', function(e) {
//     click(canvas, e)
// })

function withinNode(x, y) {
    // return nodes.findIndex(n => {
    //     return x > (n.x - radius) && 
    //         y > (n.y - radius) &&
    //         x < (n.x + radius) &&
    //         y < (n.y + radius);
    // });
    for (const [id, node] of Object.entries(nodes)) {
        if (x > (node.x - radius) && 
            y > (node.y - radius) &&
            x < (node.x + radius) &&
            y < (node.y + radius))
                return id;
      }
    return -1;
}

function withinEdge(x, y) {
    for (const [id, node] of Object.entries(nodes)) {
        for (edge of node.edges) {
            let neighbor = nodes[edge.neighborID];
            let midX = middle(node, neighbor)[0];
            let midY = middle(node, neighbor)[1];
            if (x > midX - radius && x < midX + radius &&
                y > midY - radius && y < midY + radius) {
                    return [node, neighbor];
                }
        }
    }
    return false;
}

function move(e) {
    if (selection && e.buttons) {
        selection.x = e.x - canvas.getBoundingClientRect().left;
        selection.y = e.y - canvas.getBoundingClientRect().top;
        draw();
    }
}

function up(e) {
    let nodesOfEdge = withinEdge(e.x - canvas.getBoundingClientRect().left, e.y - canvas.getBoundingClientRect().top);
    if (nodesOfEdge) {
        editEdge(nodesOfEdge[0], nodesOfEdge[1]);
        draw();
        return;
    }


    if (!selection) {
        let x = e.x - canvas.getBoundingClientRect().left;
        let y = e.y - canvas.getBoundingClientRect().top;
        nodeID++;
        nodes[nodeID] = new Node({id: nodeID, x: x, y: y, selected: false});
        // console.log(nodes[0])
        draw();
    }
    if (selection && !selection.selected) {
        selection = undefined;
    }
    draw();
}

function down(e) {
    let nodeID = withinNode(e.x - canvas.getBoundingClientRect().left, e.y - canvas.getBoundingClientRect().top);

    if (selection && selection.selected) {
        selection.selected = false;
    }
    if (nodeID > -1) {
        let target = nodes[nodeID];
        if (selection && selection !== target) {
            selection.edges.push({"neighborID":target.id, "length": 1});
            target.edges.push({"neighborID":selection.id, "length": 1});
            // edges.push(new Edge({id: edgeID, from: selection, to: target, length}));
        }
        selection = target;
        selection.selected = true;
        draw();
    }
}

function doubleClick(e) {
    let nodeID = withinNode(e.x - canvas.getBoundingClientRect().left, e.y - canvas.getBoundingClientRect().top);
    if (nodeID > -1) {
        deletedNode = nodes[nodeID];
        for (edge of deletedNode.edges) {
            let neighbor = nodes[edge.neighborID];
            neighbor.deleteEdge(deletedNode);
        }
        delete nodes[nodeID];
        draw();
        selection = undefined;
    }
}

function draw() {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // for (let i = 0; i < edges.length; i++) {
    //     let fromNode = edges[i].from;
    //     let toNode = edges[i].to;
    //     context.beginPath();
    //     context.strokeStyle = strokeStyle;
    //     context.moveTo(fromNode.x, fromNode.y);
    //     context.lineTo(toNode.x, toNode.y);
    //     context.stroke();
    // }

    for (const [id, node] of Object.entries(nodes)) {
        context.beginPath();
        context.fillStyle = node.selected ? selectedFillStyle : fillStyle;
        context.arc(node.x, node.y, radius, 0, Math.PI * 2, true);
        // console.log(node.selected)
        context.strokeStyle = strokeStyle;
        context.fill();
        context.stroke();
        context.font = font;
        context.fillStyle = textStyle;
        context.textAlign = 'center';
        context.fillText(node.id, node.x, node.y+3);
        for (edge of node.edges) {
            let neighbor = nodes[edge.neighborID];
            if (neighbor.id > node.id) {
                context.beginPath();
                context.strokeStyle = strokeStyle;
                context.moveTo(node.x, node.y);
                context.lineTo(neighbor.x, neighbor.y);
                context.stroke();
                context.font = font;
                context.fillStyle = textStyle;
                context.textAlign = 'center';
                context.fillText(node.getEdgeLength(neighbor), middle(node, neighbor)[0], middle(node, neighbor)[1]+3);
            }
        }
    }
}

window.onresize = resize;
resize();
canvas.addEventListener('mousemove', function(e) {
    move(e)
})
canvas.addEventListener('mousedown', function(e) {
    down(e)
})
canvas.addEventListener('mouseup', function(e) {
    up(e)
})
canvas.addEventListener('dblclick', function(e) {
    doubleClick(e)
})