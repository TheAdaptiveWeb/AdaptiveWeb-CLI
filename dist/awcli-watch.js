"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const Builder = require("./tasks/BuildHelpers");
const LocateConfig_1 = require("./tasks/LocateConfig");
const awcli_ni_1 = require("./native_interface/awcli-ni");
const Messages_1 = require("./tasks/Messages");
const colors = require("colors");
const watch = require('node-watch');
const AWCLI_NI_ROOT = process.env.HOME + '/.adaptiveweb/developer';
const AWCLI_NI_WATCH_LOCATION = AWCLI_NI_ROOT + '/dev_adapters';
function log(message) {
    let formatTime = (x) => { if (('' + x).length < 2)
        x = '0' + x; return x; };
    let dt = new Date();
    let time = colors.green(`${formatTime(dt.getHours())}:${formatTime(dt.getMinutes())}:${formatTime(dt.getSeconds())}`);
    let msg = `[${time}] ${message}`;
    console.log(msg);
}
console.clear();
console.log(Messages_1.devModeWarning);
let { dir, config } = LocateConfig_1.getConfig();
let awconfig;
function loadConfig() {
    awconfig = JSON.parse(fs.readFileSync(config, 'utf8'));
    awconfig.webpackConfig = dir + '/' + awconfig.webpackConfig;
}
loadConfig();
function createIfNonExistant(path) {
    if (!fs.existsSync(path))
        fs.mkdirSync(path, { recursive: true });
}
createIfNonExistant(AWCLI_NI_WATCH_LOCATION);
log(Messages_1.watchingFileChanges);
Builder.build(awconfig, AWCLI_NI_WATCH_LOCATION);
log('Adapter ' + colors.bold(awconfig.id) + ' compilation successful!');
let removedFromPlugin = false;
awcli_ni_1.addOnAdapterRemove(awconfig.id, () => {
    log('Adapter removed from plugin. Exiting.');
    removedFromPlugin = true;
    process.exit();
});
process.on('beforeExit', () => {
    if (!removedFromPlugin) {
        log('Removing adapter');
        awcli_ni_1.sendMessage('removeAdapter', awconfig.id);
        fs.unlinkSync(AWCLI_NI_WATCH_LOCATION + '/' + awconfig.id + '.json');
        log('Exiting');
    }
});
watch(dir, { recursive: true }, (event, filename) => {
    try {
        if (filename.startsWith(dir + '/build'))
            return;
        if (filename.startsWith(dir + '/dist'))
            return;
        if (filename.startsWith(dir + '/node_modules'))
            return;
        if (filename.startsWith(dir + '/.git'))
            return;
        if (filename.startsWith(dir + '/.vscode'))
            return;
        if (filename.endsWith('awconfig.json'))
            loadConfig();
        log('File change detected: ' + filename + '; Rebuilding');
        Builder.build(awconfig, AWCLI_NI_WATCH_LOCATION);
        log('Adapter ' + colors.bold(awconfig.id) + ' compilation successful!');
    }
    catch (ex) {
        console.error(ex);
    }
});
