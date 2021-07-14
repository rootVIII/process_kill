const process = require('process');

function killProcesses(pids) {
    pids.forEach((pid) => {
        try {
            process.kill(pid);
        } catch (err) {
            console.error(err.message);
        }
    });
}

module.exports = killProcesses;
