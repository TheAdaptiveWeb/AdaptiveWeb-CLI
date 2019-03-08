#!/usr/bin/env node

import * as fs from 'fs';

const AWCLI_NI_ROOT = process.env.HOME + '/.adaptiveweb/developer';
const AWCLI_NI_WATCH_LOCATION = AWCLI_NI_ROOT + '/dev_adapters';

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = 13551;

let server = http.listen(port, () => { console.log('Development server listening on port ' + port); });
server.on('error', (err: any) => {
    console.error(err);
    process.exit(1);
});

process.stdin.resume();
process.stdin.on('end', () => {
    process.exit();
});

function createIfNonExistant(path: string) {
    if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
}

createIfNonExistant(AWCLI_NI_WATCH_LOCATION);

// Start watching

fs.watch(AWCLI_NI_WATCH_LOCATION, (event, filename) => {
    try {
        if (filename.endsWith('.json')) {
            // Load file
            let path = AWCLI_NI_WATCH_LOCATION + '/' + filename;
            if (!fs.existsSync(path)) return;
            let raw: string = fs.readFileSync(path, 'utf8');
            let json: any = JSON.parse(raw);
            io.local.emit('adapterUpdate', json);
        }
    } catch (ex) { console.error(ex); }
});