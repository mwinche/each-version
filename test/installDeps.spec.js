const test = require('ava');
const proxyquire = require('proxyquire');

test('should install all libs referenced ', t => {
    const spy = require('../mocks/childProcessPromise');
    const install = proxyquire('../lib/installDeps', {
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

    install(entry);

    const expectedArgs = [
        'install',
        'angular@latest',
        'angular-resource@latest',
        'angular-cookies@latest',
        'angular-mocks@latest',
        'angular-sanitize@latest',
        'angular-animate@latest'
    ];

    t.true(spy.spawn.withArgs('npm', expectedArgs).calledOnce);
});
