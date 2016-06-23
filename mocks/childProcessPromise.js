const sinon = require('sinon');

const mock = sinon.spy();

mock.spawn = sinon.spy();

module.exports = mock;
