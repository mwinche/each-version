const spawn = require('child-process-promise').spawn;

function toInstallList(libs){
    return Object.keys(libs)
        .map(lib => `${lib}@${libs[lib]}`);
}

module.exports = libs => spawn('npm', ['install'].concat(toInstallList(libs)));
