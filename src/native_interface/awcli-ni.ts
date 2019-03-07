#!/usr/bin/env node

import * as fs from 'fs';

const AWCLI_NI_LOCATION = process.env.HOME + '/.adaptiveweb/dev_adapters';

// Create directory if it doesn't exist
if (!fs.existsSync(AWCLI_NI_LOCATION)) fs.mkdirSync(AWCLI_NI_LOCATION, { recursive: true });

// Start watching
try {
    fs.watch(AWCLI_NI_LOCATION, (event, filename) => {
        if (filename.endsWith('.json')) {
            // Load file
            let path = AWCLI_NI_LOCATION + '/' + filename;
            if (!fs.existsSync(path)) return;
            let raw: string = fs.readFileSync(path, 'utf8');
            let json: any = JSON.parse(raw);
            json.devmode = true;
            console.log(JSON.stringify(json));
        }
    });
} catch (ex) { console.error(ex); }