const test = require('ava');
const CHECK = '../lib/eachJsonCheck';

test('should accept a valid format', t => {
    const check = require(CHECK);

    const goodFile = [
        {
            name: 'ng latest',
            libs: {
                'angular': 'latest',
                'angular-resource': 'latest',
                'angular-cookies': 'latest',
                'angular-mocks': 'latest',
                'angular-sanitize': 'latest',
                'angular-animate': 'latest'
            }
        },
        {
            name: 'ng 1.4.x',
            libs: {
                'angular': '1.4.x',
                'angular-resource': '1.4.x',
                'angular-cookies': '1.4.x',
                'angular-mocks': '1.4.x',
                'angular-sanitize': '1.4.x',
                'angular-animate': '1.4.x'
            }
        },
        {
            name: 'ng 1.5.x',
            libs: {
                'angular': '1.5.x',
                'angular-resource': '1.5.x',
                'angular-cookies': '1.5.x',
                'angular-mocks': '1.5.x',
                'angular-sanitize': '1.5.x',
                'angular-animate': '1.5.x'
            }
        }
    ];

    const actual = check(goodFile);
    const expected = true;

    t.is(actual, expected);
});

test('should reject falsy except empty arrays', t => {
    const check = require(CHECK);

    t.throws(() => check(undefined));
    t.throws(() => check(null));
    t.throws(() => check(false));
    t.throws(() => check(0));
    t.notThrows(() => check([]));
});

test('should reject objects', t => {
    const check = require(CHECK);

    const badFile = {};

    t.throws(() => check(badFile));
});

test('should reject strings', t => {
    const check = require(CHECK);

    const badFile = 'has length, but not an array';

    t.throws(() => check(badFile));
});

test('should require each entry to have a name', t => {
    const check = require(CHECK);

    const badFile = [
        {libs: {}}
    ];

    t.throws(() => check(badFile));
});

test('should require each entry to have a libs object', t => {
    const check = require(CHECK);

    const badFile = [
        {name: 'foo'}
    ];

    t.throws(() => check(badFile));
});

test('should require that all libs are present in all configs', t => {
    const check = require(CHECK);

    const badFile = [
        {
            name: 'ng latest',
            libs: {
                'angular': 'latest'
            }
        },
        {
            name: 'react latest',
            libs: {
                'react': 'latest'
            }
        }
    ];

    t.throws(() => check(badFile));
});
