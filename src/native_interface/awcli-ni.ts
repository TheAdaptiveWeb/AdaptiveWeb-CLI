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

import * as fs from 'fs';

const AWCLI_NI_ROOT = process.env.HOME + '/.adaptiveweb/developer';
const AWCLI_NI_WATCH_LOCATION = AWCLI_NI_ROOT + '/dev_adapters';

export function startServer(callback = () => {}) {
    const app = require('express')();
    const http = require('http').Server(app);
    const io = require('socket.io')(http);

    const port = 13551;

    let server = http.listen(port, callback);
    server.on('error', (err: any) => {
        server.close();
    });

    function createIfNonExistant(path: string) {
        if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
    }

    createIfNonExistant(AWCLI_NI_WATCH_LOCATION);

    function loadAdapter(filename: string): any {
        let path = AWCLI_NI_WATCH_LOCATION + '/' + filename;
        if (!fs.existsSync(path)) return;
        let raw: string = fs.readFileSync(path, 'utf8');
        let json: any = JSON.parse(raw);
        return json;
    }

    // Start watching

    io.on('connection', (socket: any) => {
        socket.on('requestAdapters', (callback: Function) => {
            fs.readdir(AWCLI_NI_WATCH_LOCATION, (err, files) => {
                let adapters = files.map(file => loadAdapter(file));
                callback(adapters);
            });
        });
    });

    fs.watch(AWCLI_NI_WATCH_LOCATION, (_, filename) => {
        try {
            if (filename.endsWith('.json')) {
                // Load file
                let json = loadAdapter(filename);
                io.local.emit('adapterUpdate', json);
            }
        } catch (ex) { console.error(ex); }
    });
}