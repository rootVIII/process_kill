const fs = require('fs');
const http = require('http');
const path = require('path');

const PSCmd = require('./list_processes');

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
            <div class="img-fluid">
                <img src="./title.png" class="rounded mt-2 mb-2">
            </div>
        </div>
        <div class="row mt-3">
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
            </div>
            <div class="col-3" id="rightCol">
                <div class="bg-info border border-dark rounded text-light" id="dropZone" ondragover="onRowDragover(event)" ondrop="onRowDrop(event)" style="height: 400px; font-size: 9px;">
                </div>
                <div class="text-center mt-2">
                    <button type="button" id='killButton' class="btn btn-dark btn-sm text-light btn-outline-danger mb-2">Kill Processes 💀</button>
                </div>
            </div>
        </div>
        <br>
        <br>
    </div>
</body>
`;

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
