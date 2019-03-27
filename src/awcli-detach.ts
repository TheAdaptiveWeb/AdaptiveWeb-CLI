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
import * as program from 'commander'
import { getConfig } from './tasks/LocateConfig';

const AWCLI_NI_ROOT = process.env.HOME + '/.adaptiveweb/developer';
const AWCLI_NI_WATCH_LOCATION = AWCLI_NI_ROOT + '/dev_adapters';

program.parse(process.argv);
let args = program.args;

function detachAdapter(adapterId: string) {
    let path = AWCLI_NI_WATCH_LOCATION + '/' + adapterId + '.json';
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
        console.log('Detached adapter "' + adapterId + '".');
    } else {
        console.error('Could not detach package "' + adapterId + '"; package not attached.');
    }
}

if (args.length == 0) {
    let { config } = getConfig();
    let json = JSON.parse(fs.readFileSync(config, 'utf8'));
    detachAdapter(json.id);
} else {
    args.forEach(id => {
        if (id == 'all') {
            fs.readdir(AWCLI_NI_WATCH_LOCATION, (err, files) => {
                files.forEach(file => {
                    fs.unlinkSync(AWCLI_NI_WATCH_LOCATION + '/' + file);
                });
            });
            console.log('Detached all adapters.')
        } else {
            detachAdapter(id);
        }
    });
}