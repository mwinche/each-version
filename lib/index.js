const check = require('./eachJsonCheck');
const execute = require('./executeAgainstLibs');

module.exports = (command, config) => {
    try{
        check(config);
    }
    catch(err){
        return Promise.reject(err);
    }

    return config.reduce((promise, environment) => {
        return promise
            .then(
                (results) => execute(command, environment)
                    .then(result => results.concat(result))
            );
    }, Promise.resolve([]));
};
