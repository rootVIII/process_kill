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

// function main() {
//     let ps = new PSCmd();
//     ps.run();
//     console.log(ps.getProcessDetails());
// }

// main();

module.exports = PSCmd;
