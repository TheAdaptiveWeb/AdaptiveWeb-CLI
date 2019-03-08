"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
function getConfig() {
    let awConfigLocation = '';
    let dir = process.cwd();
    while (dir !== '/') {
        if (fs.existsSync(dir + '/awconfig.json')) {
            awConfigLocation = dir + '/awconfig.json';
            break;
        }
        else {
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
exports.getConfig = getConfig;
