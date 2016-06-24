const test = require('ava');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

test('should execute the command and return the pass status', t => {
    const install = sinon.stub().returns(Promise.resolve(0));
    const uninstall = sinon.stub().returns(Promise.resolve(0));
    
    const execute = proxyquire('../lib/executeAgainstLibs', {
        './installDeps': install,
        './uninstallDeps': uninstall
    });

    const environment = {
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

    const command = 'echo testing';

    return execute(command, environment)
        .then(result => {
            t.is(result.pass, true);
            t.true(install.withArgs(environment.libs).calledOnce);
            t.true(uninstall.withArgs(environment.libs).calledOnce);
        })
        .catch(err => t.fail('should not have failed'));
});

test('should warn about failure, but still resolve', t => {
    const install = sinon.stub().returns(Promise.resolve(0));
    const uninstall = sinon.stub().returns(Promise.resolve(0));
    
    const execute = proxyquire('../lib/executeAgainstLibs', {
        './installDeps': install,
        './uninstallDeps': uninstall
    });

    const environment = {
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

    const command = '(>&2 echo error) && exit 1';

    return execute(command, environment)
        .then(result => {
            t.is(result.pass, true);
            t.is(result.error, 'error\n');
            t.true(install.withArgs(environment.libs).calledOnce);
            t.true(uninstall.withArgs(environment.libs).calledOnce);
        })
        .catch(status => t.fail('should not have failed'));
});

test('should warn about failure, but still resolve and report as failed', t => {
    const install = sinon.stub().returns(Promise.resolve(0));
    const uninstall = sinon.stub().returns(Promise.resolve(0));
    
    const execute = proxyquire('../lib/executeAgainstLibs', {
        './installDeps': install,
        './uninstallDeps': uninstall
    });

    const environment = {
        name: 'ng latest',
        strat: 'fail',
        libs: {
            'angular': 'latest',
            'angular-resource': 'latest',
            'angular-cookies': 'latest',
            'angular-mocks': 'latest',
            'angular-sanitize': 'latest',
            'angular-animate': 'latest'
        }
    };

    const command = '(>&2 echo error) && exit 1';

    return execute(command, environment)
        .then(result => {
            t.is(result.pass, false);
            t.is(result.error, 'error\n');
            t.true(install.withArgs(environment.libs).calledOnce);
            t.true(uninstall.withArgs(environment.libs).calledOnce);
        })
        .catch(status => t.fail('should not have failed'));
});

test('should warn about failure, but still resolve and report as failed', t => {
    const install = sinon.stub().returns(Promise.resolve(0));
    const uninstall = sinon.stub().returns(Promise.resolve(0));
    
    const execute = proxyquire('../lib/executeAgainstLibs', {
        './installDeps': install,
        './uninstallDeps': uninstall
    });

    const environment = {
        name: 'ng latest',
        strat: 'bail',
        libs: {
            'angular': 'latest',
            'angular-resource': 'latest',
            'angular-cookies': 'latest',
            'angular-mocks': 'latest',
            'angular-sanitize': 'latest',
            'angular-animate': 'latest'
        }
    };

    const command = '(>&2 echo error) && exit 1';

    return execute(command, environment)
        .then(status => t.fail('should not have passed'))
        .catch(result => {
            t.pass('should have failed');
            t.true(install.withArgs(environment.libs).calledOnce);
            t.true(uninstall.withArgs(environment.libs).calledOnce);
        });
});

test('should handle a failed uninstall', t => {
    const install = sinon.stub().returns(Promise.resolve(0));
    const uninstall = sinon.stub().returns(Promise.reject(0));
    
    const execute = proxyquire('../lib/executeAgainstLibs', {
        './installDeps': install,
        './uninstallDeps': uninstall
    });

    const environment = {
        name: 'ng latest',
        strat: 'bail',
        libs: {
            'angular': 'latest',
            'angular-resource': 'latest',
            'angular-cookies': 'latest',
            'angular-mocks': 'latest',
            'angular-sanitize': 'latest',
            'angular-animate': 'latest'
        }
    };

    const command = 'echo will not run';

    return execute(command, environment)
        .then(status => t.fail('should not have passed'))
        .catch(result => {
            t.pass('should have failed');
            t.false(install.called);
            t.true(uninstall.withArgs(environment.libs).calledOnce);
        });
});

test('should handle a failed install', t => {
    const install = sinon.stub().returns(Promise.reject({cmd: '/bin/sh -c npm install'}));
    const uninstall = sinon.stub().returns(Promise.resolve(0));
    
    const execute = proxyquire('../lib/executeAgainstLibs', {
        './installDeps': install,
        './uninstallDeps': uninstall
    });

    const environment = {
        name: 'ng latest',
        strat: 'bail',
        libs: {
            'angular': 'latest',
            'angular-resource': 'latest',
            'angular-cookies': 'latest',
            'angular-mocks': 'latest',
            'angular-sanitize': 'latest',
            'angular-animate': 'latest'
        }
    };

    const command = 'echo will not run';

    return execute(command, environment)
        .then(status => t.fail('should not have passed'))
        .catch(result => {
            t.is(result.command, 'npm install');
            t.pass('should have failed');
            t.true(install.withArgs(environment.libs).calledOnce);
            t.true(uninstall.withArgs(environment.libs).calledOnce);
        });
});

test('should handle a failed install on Windows', t => {
    const install = sinon.stub().returns(Promise.reject({cmd: 'C:\\Windows\\system32\\cmd.exe /s /c npm install'}));
    const uninstall = sinon.stub().returns(Promise.resolve(0));
    
    const execute = proxyquire('../lib/executeAgainstLibs', {
        './installDeps': install,
        './uninstallDeps': uninstall
    });

    const environment = {
        name: 'ng latest',
        strat: 'bail',
        libs: {
            'angular': 'latest',
            'angular-resource': 'latest',
            'angular-cookies': 'latest',
            'angular-mocks': 'latest',
            'angular-sanitize': 'latest',
            'angular-animate': 'latest'
        }
    };

    const command = 'echo will not run';

    return execute(command, environment)
        .then(status => t.fail('should not have passed'))
        .catch(result => {
            t.is(result.command, 'npm install');
            t.pass('should have failed');
            t.true(install.withArgs(environment.libs).calledOnce);
            t.true(uninstall.withArgs(environment.libs).calledOnce);
        });
});

test('should handle a failed uninstall', t => {
    const install = sinon.stub().returns(Promise.resolve(0));
    const uninstall = sinon.stub().returns(Promise.reject({cmd: '/bin/sh -c npm uninstall'}));
    
    const execute = proxyquire('../lib/executeAgainstLibs', {
        './installDeps': install,
        './uninstallDeps': uninstall
    });

    const environment = {
        name: 'ng latest',
        strat: 'bail',
        libs: {
            'angular': 'latest',
            'angular-resource': 'latest',
            'angular-cookies': 'latest',
            'angular-mocks': 'latest',
            'angular-sanitize': 'latest',
            'angular-animate': 'latest'
        }
    };

    const command = 'echo will not run';

    return execute(command, environment)
        .then(status => t.fail('should not have passed'))
        .catch(result => {
            t.is(result.command, 'npm uninstall');
            t.pass('should have failed');
            t.false(install.called);
            t.true(uninstall.withArgs(environment.libs).calledOnce);
        });
});

test('should handle a failed uninstall on Windows', t => {
    const install = sinon.stub().returns(Promise.resolve(0));
    const uninstall = sinon.stub().returns(Promise.reject({cmd: 'C:\\Windows\\system32\\cmd.exe /s /c npm uninstall'}));
    
    const execute = proxyquire('../lib/executeAgainstLibs', {
        './installDeps': install,
        './uninstallDeps': uninstall
    });

    const environment = {
        name: 'ng latest',
        strat: 'bail',
        libs: {
            'angular': 'latest',
            'angular-resource': 'latest',
            'angular-cookies': 'latest',
            'angular-mocks': 'latest',
            'angular-sanitize': 'latest',
            'angular-animate': 'latest'
        }
    };

    const command = 'echo will not run';

    return execute(command, environment)
        .then(status => t.fail('should not have passed'))
        .catch(result => {
            t.is(result.command, 'npm uninstall');
            t.pass('should have failed');
            t.false(install.called);
            t.true(uninstall.withArgs(environment.libs).calledOnce);
        });
});
