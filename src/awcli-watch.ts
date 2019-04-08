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

import * as fs from 'fs';
import * as Builder from './tasks/BuildHelpers';
import { getConfig } from './tasks/LocateConfig';
import { sendMessage, addOnAdapterRemove } from './native_interface/awcli-ni';
import { devModeWarning, watchingFileChanges } from './tasks/Messages';
import * as colors from 'colors';
const watch: any = require('node-watch');

const AWCLI_NI_ROOT = process.env.HOME + '/.adaptiveweb/developer';
const AWCLI_NI_WATCH_LOCATION = AWCLI_NI_ROOT + '/dev_adapters';

function log(message: string) {
    let formatTime = (x: any) => { if ((''+x).length < 2) x='0'+x; return x; }
    let dt = new Date();
    let time = colors.green(`${formatTime(dt.getHours())}:${formatTime(dt.getMinutes())}:${formatTime(dt.getSeconds())}`);
    let msg = `[${time}] ${message}`;
    console.log(msg);
}

console.clear();
console.log(devModeWarning);

let { dir, config } = getConfig();

let awconfig: any;
function loadConfig() {
    awconfig = JSON.parse(fs.readFileSync(config, 'utf8'));
    awconfig.webpackConfig = dir + '/' + awconfig.webpackConfig;
}
loadConfig();

log(watchingFileChanges);
Builder.build(awconfig, AWCLI_NI_WATCH_LOCATION);
log('Adapter ' + colors.bold(awconfig.id) + ' compilation successful!');

let removedFromPlugin = false;

addOnAdapterRemove(awconfig.id, () => {
    log('Adapter removed from plugin. Exiting.');
    removedFromPlugin = true;
    process.exit();
});

process.on('beforeExit', () => {
    if (!removedFromPlugin) {
        log('Removing adapter');
        sendMessage('removeAdapter', awconfig.id);
        fs.unlinkSync(AWCLI_NI_WATCH_LOCATION + '/' + awconfig.id + '.json');
        log('Exiting');
    }
});

watch(dir, { recursive: true }, (event: any, filename: string) => {
    try {
        if (filename.startsWith(dir + '/build')) return;
        if (filename.startsWith(dir + '/dist')) return;
        if (filename.startsWith(dir + '/node_modules')) return;
        if (filename.startsWith(dir + '/.git')) return;
        if (filename.startsWith(dir + '/.vscode')) return;

        if (filename.endsWith('awconfig.json')) loadConfig();
        
        log('File change detected: ' + filename + '; Rebuilding');
        Builder.build(awconfig, AWCLI_NI_WATCH_LOCATION);
        log('Adapter ' + colors.bold(awconfig.id) + ' compilation successful!');
    } catch (ex) { console.error(ex); }
});