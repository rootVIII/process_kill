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
const { execSync } = require('child_process');

class PSCmd {
    constructor() {
        this.cmd = 'ps -ec -o pid -o %cpu -o %mem -o command';
        this.processes = {};
    }

    * execPS() {
        for (const psLine of execSync(this.cmd).toString().split('\n')) {
            if (psLine.length > 0) {
                yield psLine.trimLeft();
            }
        }
    }

    * filterStdout() {
        for (const trimmedLine of this.execPS()) {
            const ps = trimmedLine.split(/[ ]+/);
            yield ps.slice(0, 3).concat(ps.slice(3, ps.length).join(' '));
        }
    }

    run() {
        for (let process of this.filterStdout()) {
            let currentPS = process[process.length - 1];
            if (!(currentPS in this.processes)) {
                this.processes[currentPS] = [process.slice(0, 3)];
            } else {
                this.processes[currentPS].push(process.slice(0, 3));
            }
        }
    }

    getProcessDetails() {
        return JSON.stringify(
            Object.keys(this.processes).sort().reduce(
                (obj, key) => {
                    obj[key] = this.processes[key];
                    return obj;
                }, {},
            ),
        );
    }
}

module.exports = PSCmd;
