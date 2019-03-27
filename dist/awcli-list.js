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
const AWCLI_NI_ROOT = process.env.HOME + '/.adaptiveweb/developer';
const AWCLI_NI_WATCH_LOCATION = AWCLI_NI_ROOT + '/dev_adapters';
fs.readdir(AWCLI_NI_WATCH_LOCATION, (err, files) => {
    console.log(files.length + ' developer adapters attached:');
    let adapters = files.map(file => {
        if (file.endsWith('.json')) {
            let json = JSON.parse(fs.readFileSync(AWCLI_NI_WATCH_LOCATION + '/' + file, 'utf8'));
            console.log(`- ${json.id} (${json.version}): ${json.description || '[no description]'}`);
        }
    });
    console.log();
    console.log('Type `awcli detach [adapter ID]` to detach an adapter (or adapters).');
});
