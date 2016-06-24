const test = require('ava');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

const ngLatest = {
    name: 'ng latest',
    libs: {
        'angular': 'latest',
        'angular-resource': 'latest',
        'angular-cookies': 'latest',
        'angular-mocks': 'latest',
        'angular-sanitize': 'latest',
        'angular-animate': 'latest'
    }
};

const ng1_4_x = {
    name: 'ng 1.4.x',
    libs: {
        'angular': '1.4.x',
        'angular-resource': '1.4.x',
        'angular-cookies': '1.4.x',
        'angular-mocks': '1.4.x',
        'angular-sanitize': '1.4.x',
        'angular-animate': '1.4.x'
    }
};

const ng1_5_x = {
    name: 'ng 1.5.x',
    libs: {
        'angular': '1.5.x',
        'angular-resource': '1.5.x',
        'angular-cookies': '1.5.x',
        'angular-mocks': '1.5.x',
        'angular-sanitize': '1.5.x',
        'angular-animate': '1.5.x'
    }
};

test('should run through a valid config', t => {
    const execute = sinon.stub().returns(Promise.resolve({ pass: true }));
    const check = sinon.stub();

    const api = proxyquire('../lib', {
        './executeAgainstLibs': execute,
        './eachJsonCheck': check
    });

    const command = `echo du mah testz`;
    const config = [ ngLatest, ng1_4_x, ng1_5_x ];

    return api(command, config)
        .then(result => {
            t.true(execute.withArgs(command, ngLatest).calledOnce);
            t.true(execute.withArgs(command, ng1_4_x).calledOnce);
            t.true(execute.withArgs(command, ng1_5_x).calledOnce);

            t.true(check.withArgs(config).calledOnce);

            t.true(result[0].pass);
            t.true(result[1].pass);
            t.true(result[2].pass);
        })
        .catch(err => {
            t.fail('should not have failed');
        });
});

test('report results if one of the executions failed', t => {
    const execute = sinon.stub();
    const check = sinon.stub();

    const api = proxyquire('../lib', {
        './executeAgainstLibs': execute,
        './eachJsonCheck': check
    });

    const command = `echo du mah testz`;
    const config = [ ngLatest, ng1_4_x, ng1_5_x ];

    execute.withArgs(command, ngLatest).returns(Promise.resolve({ pass: false }));
    execute.returns(Promise.resolve({ pass: true }));

    return api(command, config)
        .then(result => {
            t.true(execute.withArgs(command, ngLatest).calledOnce);
            t.true(execute.withArgs(command, ng1_4_x).calledOnce);
            t.true(execute.withArgs(command, ng1_5_x).calledOnce);

            t.true(check.withArgs(config).calledOnce);

            t.false(result[0].pass);
            t.true(result[1].pass);
            t.true(result[2].pass);
        })
        .catch(err => {
            t.fail('should not have failed');
        });
});

test('bail when an execution promise rejects (bail setting)', t => {
    const execute = sinon.stub();
    const check = sinon.stub();

    const api = proxyquire('../lib', {
        './executeAgainstLibs': execute,
        './eachJsonCheck': check
    });

    const command = `echo du mah testz`;
    const config = [ ngLatest, ng1_4_x, ng1_5_x ];
    const message = `Dat thing broke...`;

    execute.withArgs(command, ng1_4_x).returns(Promise.reject({
        pass: false,
        error: message,
        command
    }));

    execute.returns(Promise.resolve({ pass: true }));

    return api(command, config)
        .then(result => {
            t.fail('should not have passed');
        })
        .catch(err => {
            t.false(err.pass);
            t.is(err.error, message);
            t.is(err.command, command);
        });
});

test(`should report failures that didn't reject the promise (fail setting)`, t => {
    const execute = sinon.stub();
    const check = sinon.stub();

    const api = proxyquire('../lib', {
        './executeAgainstLibs': execute,
        './eachJsonCheck': check
    });

    const command = `echo du mah testz`;
    const config = [ ngLatest, ng1_4_x, ng1_5_x ];
    const message = `Dat thing broke...`;

    execute.withArgs(command, ng1_4_x).returns(Promise.resolve({
        pass: false,
        error: message,
        command
    }));

    execute.returns(Promise.resolve({ pass: true }));

    return api(command, config)
        .then(result => {
            t.true(result[0].pass);
            t.false(result[1].pass);
            t.true(result[2].pass);
        })
        .catch(err => {
            t.fail('should not have failed');
        });
});

test(`should report passing status even if there is an error message (warn setting)`, t => {
    const execute = sinon.stub();
    const check = sinon.stub();

    const api = proxyquire('../lib', {
        './executeAgainstLibs': execute,
        './eachJsonCheck': check
    });

    const command = `echo du mah testz`;
    const config = [ ngLatest, ng1_4_x, ng1_5_x ];
    const message = `Dat thing broke...`;

    execute.withArgs(command, ng1_4_x).returns(Promise.resolve({
        pass: true,
        error: message,
        command
    }));

    execute.returns(Promise.resolve({ pass: true }));

    return api(command, config)
        .then(result => {
            t.true(result[0].pass);
            t.true(result[1].pass);
            t.true(result[2].pass);

            t.is(result[1].error, message);
            t.is(result[1].command, command);
        })
        .catch(err => {
            t.fail('should not have failed');
        });
});
