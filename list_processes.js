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

    * run() {
        for (const trimmedLine of this.execPS()) {
            const ps = trimmedLine.split(/[ ]+/);
            yield ps.slice(0, 3).concat(ps.slice(3, ps.length).join(' '));
        }
    }
}

function main() {
    let ps = new PSCmd();
    for (let process of ps.run()) {
        console.log(process);
    }
}

main();
