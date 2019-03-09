import * as fs from 'fs';

export function getRepository(): string {
    try {
        let rawConf: string = fs.readFileSync('.git/config', 'utf8');

        let gconf: string[] = rawConf.split(/\r?\n/)
        let i = gconf.indexOf('[remote "origin"]'), u: string = '';
        if (i !== -1) {
        u = gconf[i + 1];
            if (!u.match(/^\s*url =/)) u = gconf[i + 2]
            if (!u.match(/^\s*url =/)) u = ''
            else u = u.replace(/^\s*url = /, '')
        }
        if (u !== '' && u.match(/^git@github.com:/))
        u = u.replace(/^git@github.com:/, 'https://github.com/')

        return u;
    } catch (ex) {
        return '';
    }
}