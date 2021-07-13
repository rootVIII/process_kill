function processExists(pid) {
    let dzone = document.getElementById('dropZone');
    let pidExists = false;
    dzone.childNodes.forEach((node) => {
        if (node.innerHTML && node.innerHTML.includes(': ')) {
            if (node.innerHTML.split(': ')[1].trim() === pid) {
                pidExists = true;
            }
        }
    });
    return pidExists;
}

function getSelectedProcesses() {
    let dzone = document.getElementById('dropZone');
    let pids = [];
    dzone.childNodes.forEach((node) => {
        if (node.innerHTML && node.innerHTML.includes(': ')) {
            pids.push(node.innerHTML.split(': ')[1]);
        }
    });
    return pids;
}

/* eslint-disable no-unused-vars */
function onRowDragStart(event) {
    /* eslint-enable no-unused-vars */
    console.log(`target id: ${event.target.id}`);
    event.dataTransfer.setData('text/plain', event.target.id);
}

/* eslint-disable no-unused-vars */
function onRowDragover(event) {
    /* eslint-enable no-unused-vars */
    event.preventDefault();
}

/* eslint-disable no-unused-vars */
function onRowDrop(event) {
    /* eslint-enable no-unused-vars */

    event.preventDefault();
    let dropID = event.dataTransfer.getData('text/plain');
    let rowData = document.getElementById(dropID);

    let name = rowData.childNodes[1].innerHTML;
    let pid = rowData.childNodes[3].innerHTML;

    if (!(processExists(pid))) {
        let newNode = document.createElement('p');
        let newTextNode = document.createTextNode(`${name}: ${pid}`);
        newNode.appendChild(newTextNode);
        event.target.appendChild(newNode);
    }
}

/* eslint-disable no-unused-vars */
async function fetchProcesses() {
    /* eslint-enable no-unused-vars */

    const resp = await fetch('/processes', { headers: { 'Content-Type': 'application/json' } });
    const response = await resp.json();
    return response;
}

/* eslint-disable no-unused-vars */
function writeTable() {
    /* eslint-enable no-unused-vars */

}

document.getElementById('killButton').addEventListener('click', () => {
    console.log('click');
    console.log(getSelectedProcesses());
    // TODO: call kill processes
});
