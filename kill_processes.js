const process = require('process');

function killProcesses(pids) {
    let errors = [];
    pids.forEach((pid) => {
        try {
            process.kill(pid);
        } catch (err) {
            console.error(err.message);
            errors.push(pid);
        }
    });
    return errors;
}

module.exports = killProcesses;
