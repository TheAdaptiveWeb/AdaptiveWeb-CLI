import * as fs from 'fs';
import * as program from 'commander'
import { getConfig } from './tasks/LocateConfig';

const AWCLI_NI_ROOT = process.env.HOME + '/.adaptiveweb/developer';
const AWCLI_NI_WATCH_LOCATION = AWCLI_NI_ROOT + '/dev_adapters';

fs.readdir(AWCLI_NI_WATCH_LOCATION, (err, files) => {
    console.log(files.length + ' developer adapters attached:')
    let adapters = files.map(file => {
        if (file.endsWith('.json')) {
            let json = JSON.parse(fs.readFileSync(AWCLI_NI_WATCH_LOCATION + '/' + file, 'utf8'));
            console.log(`- ${json.uuid} (${json.version}): ${json.description || '[no description]'}`);
        }
    });
    console.log();
    console.log('Type `awcli detach [adapter ID]` to detach an adapter (or adapters).');
});