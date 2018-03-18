#!/usr/bin/env node

const findDeps = require('../lib/findDeps');
const runlib = require('../lib/runlib');
const style = require('../lib/style');
const argv = require('minimist')(process.argv.slice(2), {
    boolean: ['parallel', 'no-prod', 'dev'],
    string: ['filter'],
    default: {
        p: false,
        np: false,
        d: false
    },
    alias: {
        parallel: 'p',
        'no-prod': 'np',
        dev: 'd',
        filter: 'f'
    }
});

const runS = runlib.runS;
const runP = runlib.runP;

let command = '';
if (argv._.length > 0) {
    command = argv._.join(' ');
}

const deps = findDeps(process.cwd(), argv.np, argv.d, argv.f);

if (deps.length !== 0) {
    console.log(style.info(`Dependencies ${argv.p ? 'for parallel execution' : 'in execution order'}...`));
    deps.forEach((dep) => console.log(style.path(dep)));

    if (command) {
        console.log(style.info(`Running: ${command}...`));

        if (argv.p) {
            runP(deps, command).catch((err) => { throw err; });
        } else {
            runS(deps, command);
        }
    }

} else {
    console.log(style.warn("No local dependencies found."));
}