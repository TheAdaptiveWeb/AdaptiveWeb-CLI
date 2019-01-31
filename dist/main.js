#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program = require("commander");
program
    .version('0.0.1')
    .arguments('<command> [args]')
    .description('awcli is the command line interface for creating and publishing adapters for the Adaptive Web platform.')
    .command('init', 'initiates a new adapter in the current directory')
    .command('publish', 'publishes an adapter to be downloadable from adaptiveweb.io')
    .parse(process.argv);
