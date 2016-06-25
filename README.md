each-version
============

[![Build Status](https://travis-ci.org/mwinche/each-version.svg?branch=master)](https://travis-ci.org/mwinche/each-version)

## In Development, this header will be removed upon the initial release!

## Overview

`each-version` will take a given command and run it against all specified variations of your dependencies. An example usage
might be if you want to verify that your Angular directive library works against all your supported versions of Angular
(say 1.2.x, 1.3.x, 1.4.x, 1.5.x). You can also use this to verify that you are always working against the latest release of
a library, helping keep your dependencies green.

To accomplish this, `each-version` will uninstall all specificed dependencies and install the requested versions once for
each environment specified and then run the requested command. It then aggregates the results and reports them back.

## Installation

`each-version` is meant to be used as either a CLI or programatically. To install:

`npm install each-version`

All the usual rules for `npm install` in regards to CLIs apply. You can use it as a `dependency` or a `devDependency`.
You can install it globally. You can install locally and use it in npm run scripts. All the goodies.

## Configuration

CLI usage requires a `.each.json` file to be available. It must be an array of environments. All enviroment must contain
all the same dependencies. An environment has three properties:

```json
[
    {
        "name": "latest",
        "libs": {
            "lodash": "latest"
        },
        "strat": "fail"
    }
]
```

### `name`

Can be any name. Intended for humans when reporting the results of the requested command against that environment.

### `libs`

Key/value pairs of npm modules and valid version references. Should look like a `dependencies` section of a `package.json`.
Examples of valid version references:

* `latest`
* `*`
* `~4.1.0`
* `^4.1.0`
* `4.1.0`
* `4.1.x`
* `>= 4.1.0`
* any valid dist tag
* basically anything you can put in a `package.json`'s  `dependency` section

### `strat` (optional, default=`"fail"`)

Instructions on how to handle non zero exit codes. Options are:

* `"fail"` (default)
  * reports as a failure
  * outputs `stderr`
  * allows execution against other environments to continue
  * the CLI will return a non zero exit code
* `"bail"`
  * reports as a failure
  * outputs `stderr`
  * halts any further execution
  * the CLI will return a non zero exit code
* `"warn"`
  * reports as success
  * outputs `stderr`
  * allows execution against other environments to continue
  * the CLI will return a zero exit code (assuming no other environments fail)

## Usage

### CLI

`each command to run`, for example if I want to run my unit tests and they are using Karma:

`each karma start`

The command will return a zero/no zero exit code based on the results of the command and the configuration of your
`.each.json`. See "Configuration" → "strat" in this README.

### Programmatic

The library will return a promise with the results of the command against each environment. Example:

```javascript
const each = require('each-version');
const config = require('./.each.json');

each(`karma start`, config)
    .then(results => {
        const failures = results
            .filter(result => !result.pass)
            .map(result => `"${result.environment}"`);

        console.log(failures.length === 0 ? 'Success!' : `Failed in the following environments: ${failures.join(', ')}`);
    })
    .catch(err -> {
        console.error(`"${err.command}" failed under environment ${err.environment}.`, err.error);
    });
```

## Node version dependency

This library requires at a minimum, node.js version 4. 

## License

MIT License
