const spawn = require('child-process-promise').spawn;

module.exports = libs => spawn('npm', ['uninstall'].concat(Object.keys(libs)));