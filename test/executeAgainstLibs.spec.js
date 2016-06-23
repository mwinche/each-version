const test = require('ava');
const proxyquire = require('proxyquire');

test.skip('should install all libs referenced ', t => {
    const spy = require('../mocks/childProcessPromise');
    const execute = proxyquire('../lib/executeAgainstLibs', {
        './installDeps': libs => Promise.resolve(0),
        './uninstallDeps': libs => Promise.resolve(0),
        'child-process-promise': spy
    });

    const entry = {
        name: 'ng latest',
        strat: 'warn',
        libs: {
            'angular': 'latest',
            'angular-resource': 'latest',
            'angular-cookies': 'latest',
            'angular-mocks': 'latest',
            'angular-sanitize': 'latest',
            'angular-animate': 'latest'
        }
    };

    const command = 'mocha';

    return execute(command, entry)
        .then(code => t.is(code, 0))
        .catch(err => t.fail('should not have failed'));
});
