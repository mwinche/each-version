const exec = require('child-process-promise').exec;
const install = require('./installDeps');
const uninstall = require('./uninstallDeps');
const log = require('./log');

const CMD_REGEX = /^(.*( -c | \/s \/c ))?(.*$)/;
//                  ^ *nix ^|^Windows^

const QUOTE_REGEX = /^"?([^"]*)"?$/;

function getCommand(raw){
    return raw.match(CMD_REGEX)[3]
        .match(QUOTE_REGEX)[1];
}

function _throw(err, environment){
    throw {
        pass: false,
        error: err.stderr,
        command: getCommand(err.cmd),
        environment
    };
}

function handleError(environment){
    return err => (environment.strat === 'bail' ? _throw(err, environment.name) : {
        pass: environment.strat === 'warn',
        error: err.stderr,
        command: getCommand(err.cmd),
        environment: environment.name
    });
}

module.exports = (command, environment) => {
    return Promise.resolve()
        .then(() => Promise.resolve()
            .then(log(`[${environment.name}] npm uninstall`, uninstall(environment.libs)))
            .catch(handleError(environment))
        )
        .then(() => Promise.resolve()
            .then(log(`[${environment.name}] npm install`, install(environment.libs)))
            .catch(handleError(environment))
        )
        .then(() => Promise.resolve()
            .then(log(`[${environment.name}] ${command}`, exec(command)))
            .catch(handleError(environment))
        )
        .then(result => (Object.assign({ pass: true, environment: environment.name }, result)));
};
