"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
console.log('Locating awconfig.json');
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
console.log('Located awconfig.json');
let awconfig = JSON.stringify(fs.readFileSync(awConfigLocation));
// Todo, minify, webpack etc.
