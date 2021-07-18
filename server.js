const fs = require('fs');
const http = require('http');
const path = require('path');

const PSCmd = require('./list_processes');
const killProcesses = require('./kill_processes');

const host = 'localhost';
const port = 8181;
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.eot': 'application/vnd.ms-fontobject',
};

const page404 = `
<!DOCTYPE html><html lang="en" dir="ltr">
    <head>
        <title>Not Found</title>
        <meta charset="UTF-8">
    </head>
    <body>
        Not Found
    </body>
</html>`;

const indexPage = `
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <title>Process Kill</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel=stylesheet type=text/css href="./bootstrap.css">
    <script src="./ui.js" type="text/javascript" defer> </script>
</head>
<body class="bg-light">
    <br>
    <div class="container-sm bg-primary rounded">
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

const server = http.createServer((request, response) => {
    let filePath;
    if (request.url === '/') {
        filePath = path.join(__dirname, 'index.html');
    } else {
        filePath = path.join(__dirname, request.url);
    }

    const contentType = mimeTypes[String(path.extname(filePath)).toLowerCase()] || 'application/octet-stream';

    if (filePath.includes('processes')) {
        let ps = new PSCmd();
        ps.run();
        const processes = ps.getProcessDetails();
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(processes);
    } else if (filePath.includes('kill-process-list')) {
        let data = '';
        request.on('data', (chunk) => {
            data += chunk;
        });

        request.on('error', (err) => {
            response.writeHead(400, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify([err]), 'utf-8');
        });

        request.on('end', () => {
            const result = JSON.parse(data);

            const errors = killProcesses(result);
            if (errors.length) {
                response.writeHead(400, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify(errors), 'utf-8');
            } else {
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.end('[]', 'utf-8');
            }
        });
    } else if (filePath.includes('index.html')) {
        response.writeHead(200, { 'Content-Type': contentType });
        response.end(indexPage, 'utf-8');
    } else {
        fs.readFile(filePath, (error, content) => {
            if (error) {
                if (error.code === 'ENOENT') {
                    response.setHeader('Content-Type', 'text/html');
                    response.end(page404);
                } else {
                    response.writeHead(500);
                    response.end(`ERROR: ${error}`);
                }
            } else {
                response.writeHead(200, { 'Content-Type': contentType });
                response.end(content, 'utf-8');
            }
        });
    }
});

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
