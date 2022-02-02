function pathTable(destID, distance, path) {
    return `
        <div style='font-size:12px'> 
            <table border='1'>
                <tr>
                    <td>Destination</td>
                    <td>${destID}</td>
                </tr>
                <tr>
                    <td>Distance</td>
                    <td>${distance}</td>
                </tr>
                <tr>
                    <td>Path</td>
                    <td>${path}</td>
                </tr>
            </table>
        </div>
    `;
}

function drawTables(destID) {
    let tables = document.getElementsByClassName("pathTable");
    while(tables[0]) {
        tables[0].parentNode.removeChild(tables[0]);
    }
    for (const [id, node] of Object.entries(nodes)) {
        let table = document.createElement('table');
        table.className = "pathTable";
        table.id = `table${id}`
        let absoluteX = node.x + canvas.getBoundingClientRect().left;
        let absoluteY = node.y + canvas.getBoundingClientRect().top;
        table.style.position = "absolute";
        table.style.left = absoluteX+'px';
        table.style.top = absoluteY+'px';
        table.innerHTML = pathTable(destID, node.distance[destID], node.path[destID]);
        document.body.appendChild(table);
    }
}

function updateTable(node, destID) {
    let table = document.getElementById(`table${node.id}`);
    if (table)
        table.innerHTML = pathTable(destID, node.distance[destID], node.path[destID]);
}

// function pathTable(destID, distance, path, x, y) {
//     var data = `
//     <svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>
//         <foreignObject width='100%' height='100%'>
//             <div xmlns='http://www.w3.org/1999/xhtml' style='font-size:12px'> 
//                 <table border='1'>
//                     <tr>
//                         <td>Destination</td>
//                         <td>${destID}</td>
//                     </tr>
//                     <tr>
//                         <td>Distance</td>
//                         <td>${distance}</td>
//                     </tr>
//                     <tr>
//                         <td>Path</td>
//                         <td>${path}</td>
//                     </tr>
//                 </table>
//             </div>
//         </foreignObject>
//     </svg>
//     `;
//     var img = new Image();
//     var svg = new Blob([data], {type: "image/svg+xml;charset=utf-8"});
//     var url = DOMURL.createObjectURL(svg);
//     console.log(url);
//     img.onload = function() {
//         context.drawImage(img, x, y);
//         DOMURL.revokeObjectURL(url);
//     };
//     img.src = url;
// }