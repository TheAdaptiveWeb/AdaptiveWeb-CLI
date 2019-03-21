#!/usr/bin/env node

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