#!/usr/bin/env node

'use strict';

const each = require('./index');
const check = require('./eachJsonCheck');
const path = require('path');
const symbols = require('./symbols');

require('colors');

const stringifyResult = result => `${result.environment}: ${symbols[result.pass ? 'ok': 'err']}`;
const stringifyError = result => `[${result.environment.bold}] ${result.error}`.red;

let config;

try{
    config = require(path.join(process.cwd(), '.each.json'));
}
catch(e){
    console.error(`Unable to find ./.each.json.`);
    process.exit(1);
}

try{
    check(config);
}
catch(e){
    console.error(`Invalid .each.json.`, e);
    process.exit(2);
}

const command = process.argv.slice(2).join(' ');

each(command, config)
    .then(results => {
        const stderr = results
            .filter(result => result.error)
            .map(stringifyError)
            .join('\n');
        
        if(stderr){
            console.error(stderr);
        }

        console.log(results.map(stringifyResult).join('\n'));

        const pass = results
            .map(result => result.pass)
            .reduce((prev, curr) => prev && curr, true);
        
        if(!pass){
            process.exit(3);
        }
    })
    .catch(err => {
        console.error(`"${err.command}" failed under environment ${err.environment}.`, stringifyError(err));
        process.exit(4);
    });
