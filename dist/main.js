#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program = require("commander");
program
    .version('0.1.0')
    .arguments('<command> [args]')
    .description('awcli is the command line interface for creating and publishing adapters for the Adaptive Web platform. For more info, visit the online documentation https://docs.adaptiveweb.io/developing')
    .command('init', 'initiates a new adapter in the current directory')
    .command('build', 'build the adapter ready for deployment')
    .command('watch', 'test the adapter in browser').alias('run')
    .command('detach [id]', 'detach an adapter from the extension').alias('rm')
    .command('list', 'list the attached developer adapters').alias('l')
    // .command('test', 'run browser tests')
    .command('publish', 'submit an adapter for approval and publishing')
    .parse(process.argv);
