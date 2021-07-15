class LoadingAnimation {
    constructor() {
        this.requestID = null;
        this.clock = 0;
        this.canvas = document.getElementById('psCanvas');
        this.canvas.width = 20;
        this.canvas.height = 10;
        this.ctx = this.canvas.getContext('2d');
    }

    showLoading() {
        if (this.clock % 10 < 1) {
            this.ctx.fillStyle = '#B40404';
        } else {
            this.ctx.fillStyle = '#B40444';
        }
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    stop() {
        window.cancelAnimationFrame(this.requestID);
    }

    start() {
        this.requestID = window.requestAnimationFrame(this.start.bind(this));
        this.showLoading();
        this.clock++;
    }
}

let load = new LoadingAnimation();

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

    let name = rowData.childNodes[0].innerHTML;
    let pid = rowData.childNodes[1].innerHTML;

    if (!(processExists(pid))) {
        let newNode = document.createElement('p');
        let newTextNode = document.createTextNode(`${name}: ${pid}`);
        newNode.appendChild(newTextNode);
        event.target.appendChild(newNode);
    }
}

async function fetchProcesses() {
    const resp = await fetch('/processes', { headers: { 'Content-Type': 'application/json' } });
    const response = await resp.json();
    return response;
}

function callFetch() {
    return fetchProcesses().then((resp) => resp).catch((err) => ({ ERROR: err.message }));
}

function writeTable(processResponse) {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    let tableRows = '';

    Object.entries(processResponse).forEach(([pName, foundPIDs], index) => {
        if (pName === 'ps') {
            return;
        }
        foundPIDs.forEach((pid) => {
            let tr = `<tr id="draggable${index}" draggable="true" ondragstart="onRowDragStart(event)">`;
            tr += `<th scope="row">${pName}</th><td>${pid[0]}</td><td>${pid[1]}</td><td>${pid[2]}</td></tr>`;
            tableRows += tr;
        });
    });
    tbody.innerHTML = tableRows;
}

function loadTable() {
    callFetch().then((procs) => {
        console.log('START ANIMATION');
        if (!('ERROR' in procs)) {
            writeTable(procs);
        } else {
            // TODO: display error message!!!
            console.log(procs);
        }
        console.log('STOP ANIMATION');
    });
}

document.getElementById('killButton').addEventListener('click', () => {
    console.log('click');
    console.log(getSelectedProcesses());
    // TODO: call kill processes
    // TODO: disable button
});

document.addEventListener('DOMContentLoaded', () => {
    load.start();
    loadTable();
});

setInterval(() => {
    loadTable();
}, 4000);
