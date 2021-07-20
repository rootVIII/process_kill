const fs = require('fs');
const http = require('http');
const path = require('path');

const PSCmd = require('./list_processes');
const utils = require('./utils');

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
<!DOCTYPE html><html lang="en" dir="ltr"><title>Not Found</title>
<meta charset="UTF-8"></head><body>Not Found</body></html>`;

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

            const errors = utils.killProcesses(result);
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
        response.end(utils.getIndexPage(), 'utf-8');
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
