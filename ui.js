class LoadingAnimation {
    constructor() {
        this.requestID = null;
        this.clock = 0;
        this.canvas = document.getElementById('psCanvas');
        this.canvas.width = 60;
        this.canvas.height = 8;
        this.ctx = this.canvas.getContext('2d');
        this.x1 = 0;
        this.x2 = 10;
    }

    showLoading() {
        if (this.x2 < this.canvas.width) {
            this.x1 += 1;
            this.x2 += 1;
        } else {
            this.x1 = 0;
            this.x2 = 10;
        }

        this.ctx.beginPath();
        this.ctx.fillStyle = '#00FF00';
        this.ctx.fillRect(this.x1, 0, this.x2, 10);
        this.ctx.stroke();
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    stop() {
        this.clear();
        window.cancelAnimationFrame(this.requestID);
    }

    start() {
        this.clear();
        this.requestID = window.requestAnimationFrame(this.start.bind(this));
        this.showLoading();
        this.clock++;
    }
}

function processExists(pid) {
    let pidExists = false;
    document.getElementById('dropZone').childNodes.forEach((node) => {
        if (node.innerHTML && node.innerHTML.includes(': ')) {
            if (node.innerHTML.split(': ')[1].trim() === pid) {
                pidExists = true;
            }
        }
    });
    return pidExists;
}

function getSelectedProcesses() {
    let pids = [];
    document.getElementById('dropZone').childNodes.forEach((node) => {
        if (node.innerHTML && node.innerHTML.includes(': ')) {
            pids.push(node.innerHTML.split(': ')[1]);
        }
    });
    return pids;
}

/* eslint-disable no-unused-vars */
function onRowDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
}

function onRowDragover(event) {
    event.preventDefault();
}

function onRowDrop(event) {
    /* eslint-enable no-unused-vars */

    event.preventDefault();
    let dropID = event.dataTransfer.getData('text/plain');
    let rowData = document.getElementById(dropID);

    let name = rowData.childNodes[0].innerHTML;
    let pid = rowData.childNodes[1].innerHTML;

    if (!(processExists(pid)) && getSelectedProcesses().length < 12) {
        let newNode = document.createElement('p');
        let newTextNode = document.createTextNode(`${name}: ${pid}`);
        newNode.appendChild(newTextNode);
        event.target.appendChild(newNode);
    }
}

async function killProcessList(procs) {
    const resp = await fetch('/kill-process-list', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(procs),
    });

    const response = await resp.json();
    let status = document.getElementById('status');

    if (response.length) {
        status.innerHTML = `Unable to kill processes: ${procs.join(', ')}`;
    } else {
        status.innerHTML = 'Processes killed...';
    }
    setTimeout(() => { status.innerHTML = '&thinsp;'; }, 5000);
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
        if (['ps', 'COMMAND'].includes(pName)) {
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
    let load = new LoadingAnimation();
    load.start();
    callFetch().then((procs) => {
        if (!('ERROR' in procs)) {
            writeTable(procs);
        } else {
            document.getElementById('status').innerHTML = procs.ERROR;
            setTimeout(() => {
                document.getElementById('status').innerHTML = '&ensp;';
            }, 4000);
        }

        setTimeout(() => {
            let now = new Date();
            load.stop();
            document.getElementById('lastUpdated').innerHTML = now.toTimeString().slice(0, 8);
        }, 100);
    });
}

document.getElementById('killButton').addEventListener('click', () => {
    let killBtn = document.getElementById('killButton');
    killBtn.disabled = true;

    const processList = getSelectedProcesses();
    if (processList.length < 1) {
        const status = document.getElementById('status');
        status.innerHTML = 'No processes selected to kill';
        setTimeout(() => {
            status.innerHTML = '&ensp;';
            killBtn.disabled = false;
        }, 4000);
    } else {
        killProcessList(processList).then(() => {
            loadTable();
            killBtn.disabled = false;
            document.getElementById('dropZone').innerHTML = '';

            
        });
    }
});

// E V E N T   L I S T E N E R S:

document.getElementById('clearButton').addEventListener('click', () => {
    let clrBtn = document.getElementById('clearButton')
    clrBtn.disabled = true;
    document.getElementById('dropZone').innerHTML = '';
    clrBtn.disabled = false;
});

document.addEventListener('DOMContentLoaded', () => {
    loadTable();
});

document.getElementById('search').addEventListener('keyup', () => {
    const rows = document.getElementById('tableBody').childNodes;
    let rowID = 'draggable0';

    for (let index = 0; index < rows.length; index++) {
        let rowTags = rows[index].childNodes;
        let rowText = '';
        for (let tag = 0; tag < 4; tag++) {
            rowText += `${rowTags[tag].innerHTML} `;
        }
        if (rowText.includes(document.getElementById('search').value)) {
            rowID = rows[index].id;
            break;
        }
    }

    document.getElementById(rowID).scrollIntoView();
});

setInterval(() => {
    loadTable();
}, 15000);
