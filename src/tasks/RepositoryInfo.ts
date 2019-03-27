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

export function getRepository(): string {
    try {
        let rawConf: string = fs.readFileSync('.git/config', 'utf8');

        let gconf: string[] = rawConf.split(/\r?\n/)
        let i = gconf.indexOf('[remote "origin"]'), u: string = '';
        if (i !== -1) {
        u = gconf[i + 1];
            if (!u.match(/^\s*url =/)) u = gconf[i + 2]
            if (!u.match(/^\s*url =/)) u = ''
            else u = u.replace(/^\s*url = /, '')
        }
        if (u !== '' && u.match(/^git@github.com:/))
        u = u.replace(/^git@github.com:/, 'https://github.com/')

        return u;
    } catch (ex) {
        return '';
    }
}