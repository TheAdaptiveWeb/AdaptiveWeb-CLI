#!/usr/bin/env node

/**
 *  Copyright 2019 The Adaptive Web. All Rights Reserved.
 * 
 *  Licensed under the Mozilla Public License 2.0 (the "License"). 
 *  You may not use this file except in compliance with the License.
 *  A copy of the License is located at
 *  
 *      https://www.mozilla.org/en-US/MPL/2.0/
 *  
 *  or in the "license" file accompanying this file. This file is distributed 
 *  on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either 
 *  express or implied. See the License for the specific language governing 
 *  permissions and limitations under the License.
 */

import * as program from 'commander'

program
    .version('0.0.1')
    .arguments('<command> [args]')
    .description('awcli is the command line interface for creating and publishing adapters for the Adaptive Web platform.')
    .command('init', 'initiates a new adapter in the current directory')
    .command('build', 'build the adapter ready for deployment')
    .command('watch', 'test the adapter in browser').alias('run')
    .command('detach [id]', 'detach an adapter from the extension').alias('rm')
    .command('list', 'list the attached developer adapters').alias('l')
    // .command('test', 'run browser tests')
    // .command('publish', 'publishes an adapter to be downloadable from adaptiveweb.io')
    .parse(process.argv);