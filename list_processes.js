const { execSync } = require('child_process');

class PSCmd {
    constructor() {
        this.cmd = 'ps -e -o pid -o %cpu -o %mem -o command';
    }

    * runPS() {
        for (const val of execSync(this.cmd).toString().split('\n')) {
            yield val.trimLeft();
        }
        // execSync(this.cmd).toString().split('\n').forEach((val) => {
        // console.log(val.trimLeft());
        // yield val.trimLeft();
        // });
    }
}

function main() {
    let ps = new PSCmd();
    for (let process of ps.runPS()) {
        console.log(process);
    }
}

main();
