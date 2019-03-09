"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
function getRepository() {
    try {
        let rawConf = fs.readFileSync('.git/config', 'utf8');
        let gconf = rawConf.split(/\r?\n/);
        let i = gconf.indexOf('[remote "origin"]'), u = '';
        if (i !== -1) {
            u = gconf[i + 1];
            if (!u.match(/^\s*url =/))
                u = gconf[i + 2];
            if (!u.match(/^\s*url =/))
                u = '';
            else
                u = u.replace(/^\s*url = /, '');
        }
        if (u !== '' && u.match(/^git@github.com:/))
            u = u.replace(/^git@github.com:/, 'https://github.com/');
        return u;
    }
    catch (ex) {
        return '';
    }
}
exports.getRepository = getRepository;
