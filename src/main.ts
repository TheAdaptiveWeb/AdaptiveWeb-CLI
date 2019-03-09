#!/usr/bin/env node
import * as program from 'commander'

program
    .version('0.0.1')
    .arguments('<command> [args]')
    .description('awcli is the command line interface for creating and publishing adapters for the Adaptive Web platform.')
    .command('init', 'initiates a new adapter in the current directory')
    .command('build', 'build the adapter ready for deployment')
    .command('watch', 'test the adapter in browser')
    .command('detach [id]', 'detach an adapter from the extension')
    .command('list', 'list the attached developer adapters')
    // .command('test', 'run browser tests')
    // .command('publish', 'publishes an adapter to be downloadable from adaptiveweb.io')
    .parse(process.argv);