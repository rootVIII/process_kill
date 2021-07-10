const { execSync } = require('child_process');

class PSCmd {
    constructor() {
        this.cmd = 'ps -ec -o pid -o %cpu -o %mem -o command';
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
            console.log(process);
        }
    }
}

function main() {
    let ps = new PSCmd();
    ps.run();
}

main();
