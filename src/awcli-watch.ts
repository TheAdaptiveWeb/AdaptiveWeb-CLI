import * as fs from 'fs';
import * as Builder from './tasks/BuildHelpers';
import { getConfig } from './tasks/LocateConfig';
import { startServer } from './native_interface/awcli-ni';
import { devModeWarning, watchingFileChanges } from './tasks/Messages';
import * as colors from 'colors';
const watch: any = require('node-watch');

const AWCLI_NI_ROOT = process.env.HOME + '/.adaptiveweb/developer';
const AWCLI_NI_WATCH_LOCATION = AWCLI_NI_ROOT + '/dev_adapters';

function log(message: string) {
    let formatTime = (x: any) => { if ((''+x).length < 2) x='0'+x; return x; }
    let dt = new Date();
    let time = colors.green(`${formatTime(dt.getHours())}:${formatTime(dt.getMinutes())}:${formatTime(dt.getSeconds())}`);
    let msg = `[${time}] ${message}`;
    console.log(msg);
}

console.clear();
console.log(devModeWarning);

let { dir, config } = getConfig();

let awconfig: any;
function loadConfig() {
    awconfig = JSON.parse(fs.readFileSync(config, 'utf8'));
    awconfig.webpackConfig = dir + '/' + awconfig.webpackConfig;
}
loadConfig();

log(watchingFileChanges);
Builder.build(awconfig, AWCLI_NI_WATCH_LOCATION);
log('Adapter ' + colors.bold(awconfig.id) + ' compilation successful!');

startServer(() => { log('Development server started on port 13551.'); });

watch(dir, { recursive: true }, (event: any, filename: string) => {
    try {
        if (filename.startsWith(dir + '/build')) return;
        if (filename.startsWith(dir + '/dist')) return;
        if (filename.startsWith(dir + '/node_modules')) return;

        if (filename.endsWith('awconfig.json')) loadConfig();
        
        log('File change detected: ' + filename + '; Rebuilding');
        Builder.build(awconfig, AWCLI_NI_WATCH_LOCATION);
        log('Adapter ' + colors.bold(awconfig.id) + ' compilation successful!');
    } catch (ex) { console.error(ex); }
});