const test = require('ava');
const proxyquire = require('proxyquire');

test('should uninstall all libs referenced ', t => {
    const spy = require('../mocks/childProcessPromise');
    const uninstall = proxyquire('../lib/uninstallDeps', {
        'child-process-promise': spy
    });

    const entry = {
        'angular': 'latest',
        'angular-resource': 'latest',
        'angular-cookies': 'latest',
        'angular-mocks': 'latest',
        'angular-sanitize': 'latest',
        'angular-animate': 'latest'
    };

    uninstall(entry);

    const expectedArgs = [
        'uninstall',
        'angular',
        'angular-resource',
        'angular-cookies',
        'angular-mocks',
        'angular-sanitize',
        'angular-animate'
    ];

    t.true(spy.spawn.withArgs('npm', expectedArgs).calledOnce);
});
