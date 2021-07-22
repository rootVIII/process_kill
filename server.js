/*
    View, search, and/or kill processes on MacOS
    Copyright (C) 2021 rootVIII

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
*/
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
        response.end(utils.getIndex(), 'utf-8');
    } else {
        fs.readFile(filePath, (error, content) => {
            if (error) {
                if (error.code === 'ENOENT') {
                    response.setHeader('Content-Type', 'text/html');
                    response.end(utils.get404());
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
