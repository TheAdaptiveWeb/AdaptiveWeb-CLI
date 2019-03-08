#!/usr/bin/env node

import * as fs from 'fs';

const AWCLI_NI_ROOT = process.env.HOME + '/.adaptiveweb/developer';
const AWCLI_NI_WATCH_LOCATION = AWCLI_NI_ROOT + '/dev_adapters';

function createIfNonExistant(path: string) {
    if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
}

createIfNonExistant(AWCLI_NI_WATCH_LOCATION);

// Start watching
try {
    fs.watch(AWCLI_NI_WATCH_LOCATION, (event, filename) => {
        if (filename.endsWith('.json')) {
            // Load file
            let path = AWCLI_NI_WATCH_LOCATION + '/' + filename;
            if (!fs.existsSync(path)) return;
            let raw: string = fs.readFileSync(path, 'utf8');
            console.log(raw);
        }
    });
} catch (ex) { console.error(ex); }