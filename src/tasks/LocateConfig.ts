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
import * as path from 'path';

export function getConfig() {
    let awConfigLocation = '';
    let dir = process.cwd();
    while (dir !== '/') {
        if (fs.existsSync(dir + '/awconfig.json')) {
            awConfigLocation = dir + '/awconfig.json';
            break;
        } else {
            dir = path.dirname(dir);
        }
    }

    if (awConfigLocation === '') {
        console.error('Could not locate a awconfig.json. Run `awcli init` to create one.');
        process.exit(1);
    }
    
    return {
        dir,
        config: awConfigLocation
    };
}