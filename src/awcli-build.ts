import * as fs from 'fs';
import * as path from 'path';
import { src, dest } from 'gulp';

console.log('Locating awconfig.json');

let awConfigLocation: string = '';

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

console.log('Located awconfig.json');

let awconfig = JSON.stringify(fs.readFileSync(awConfigLocation));

// Todo, minify, webpack etc.