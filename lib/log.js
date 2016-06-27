'use strict';

const symbols = require('./symbols');

require('colors');

const pattern = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'.split('').map(item => item.gray);
const backspace = '\b';
const rate = 30;

const enabled = !!require.main;

module.exports = (status, promise) => {
    if(!enabled){
        return () =>  promise;
    }

    let stop;

    return () => Promise.resolve()
        .then(() => {
            let i = 0;

            process.stdout.write(`${status}  `);

            return stop = setInterval(() => process.stdout.write(backspace + pattern[i++ % pattern.length]), rate);
        })
        .then(stop => {
            return Promise.all([ stop, promise ]);
        })
        .then(arr => {
            const stop = arr[0];
            const result = arr[1];

            clearInterval(stop);
            process.stdout.write(`${backspace}${symbols.ok}\n`);

            return result;
        })
        .catch(err => {
            clearInterval(stop);
            process.stdout.write(`${backspace}${symbols.err}\n`);

            throw err;
        });
};
