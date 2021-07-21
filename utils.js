const process = require('process');

function killProcesses(pids) {
    let errors = [];
    pids.forEach((pid) => {
        try {
            process.kill(pid);
        } catch (err) {
            errors.push(pid);
        }
    });
    return errors;
}

function getIndexPage() {
    return `
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <title>Process Kill</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel=stylesheet type=text/css href="./bootstrap.css">
    <script src="./ui.js" type="text/javascript" defer> </script>
</head>
<body class="bg-primary">
    <div class="container-sm bg-secondary rounded">
        <div class="row" style="background-image: linear-gradient(to right, #0d0c0c , #dbd1d0);">
            <div class="col-3">
                <div class="img-fluid">
                    <img src="./title.png" class="rounded mt-2 mb-2">
                </div>
            </div>
            <div class="col-7">
                <input type="text" class="form-control form-control-sm mt-2" style="width: 150px"
                    id="search" aria-describedby="search" placeholder="Search">
            </div>
            <div class="col-2">
                <p class="text-muted" style="font-size: 9px;">
                    Updated: <small id="lastUpdated">&emsp;</small>
                </p>
                <canvas id="psCanvas"></canvas>
            </div>
        </div>
        <div class="row mt-2">
            <div class="col-9" id="leftCol">
                <div class="table-wrapper-scroll-y custom-scrollbar">
                    <table class="table table-sm table-dark table-striped table-hover" id="processTable">
                        <thead class=thead-dark>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">PID</th>
                            <th scope="col">&#37;CPU</th>
                            <th scope="col">&#37;MEM</th>
                        </tr>
                        </thead>
                        <tbody id='tableBody'>
                        </tbody>
                    </table>
                </div>
                <small class="text-muted" id="status">&emsp;</small>
            </div>
            <div class="col-3" id="rightCol">
                <div class="bg-info border border-dark rounded text-light"
                    id="dropZone" ondragover="onRowDragover(event)"
                    ondrop="onRowDrop(event)" style="height: 400px; font-size: 9px;">
                </div>
                <div class="text-center mt-2">
                    <button type="button" id="clearButton" style="font-size: 10px;"
                        class="btn btn-dark btn-sm text-light btn-outline-primary mb-2">
                        Clear
                    </button>
                    <button type="button" id="killButton" style="font-size: 10px;"
                        class="btn btn-dark btn-sm text-light btn-outline-danger mb-2">
                        Kill Processes 💀
                    </button>
                </div>
            </div>
        </div>
    </div>
</body>`;
}

module.exports = {
    killProcesses,
    getIndexPage,
};
