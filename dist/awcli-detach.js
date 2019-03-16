"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const program = require("commander");
const LocateConfig_1 = require("./tasks/LocateConfig");
const AWCLI_NI_ROOT = process.env.HOME + '/.adaptiveweb/developer';
const AWCLI_NI_WATCH_LOCATION = AWCLI_NI_ROOT + '/dev_adapters';
program.parse(process.argv);
let args = program.args;
function detachAdapter(adapterId) {
    let path = AWCLI_NI_WATCH_LOCATION + '/' + adapterId + '.json';
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
        console.log('Detached adapter "' + adapterId + '".');
    }
    else {
        console.error('Could not detach package "' + adapterId + '"; package not attached.');
    }
}
if (args.length == 0) {
    let { config } = LocateConfig_1.getConfig();
    let json = JSON.parse(fs.readFileSync(config, 'utf8'));
    detachAdapter(json.id);
}
else {
    args.forEach(detachAdapter);
}
