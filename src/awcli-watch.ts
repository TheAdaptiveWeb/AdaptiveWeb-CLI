import * as fs from 'fs';
import * as Builder from './tasks/BuildHelpers';
import { getConfig } from './tasks/LocateConfig';
import { startServer } from './native_interface/awcli-ni';
import { devModeWarning, watchingFileChanges } from './tasks/Messages';
const watch: any = require('node-watch');

const AWCLI_NI_ROOT = process.env.HOME + '/.adaptiveweb/developer';
const AWCLI_NI_WATCH_LOCATION = AWCLI_NI_ROOT + '/dev_adapters';

console.log(devModeWarning);

let { dir, config } = getConfig();

let awconfig = JSON.parse(fs.readFileSync(config, 'utf8'));
awconfig.webpackConfig = dir + '/' + awconfig.webpackConfig;

process.stdout.write(watchingFileChanges);
Builder.build(awconfig, AWCLI_NI_WATCH_LOCATION);

startServer();

watch(dir, { recursive: true }, (event: any, filename: string) => {
    try {
        if (filename.startsWith(dir + '/build')) return;
        if (filename.startsWith(dir + '/dist')) return;
        if (filename.startsWith(dir + '/node_modules')) return;

        process.stdout.write(watchingFileChanges + '\nFile change detected: ' + filename + '; Rebuilding');
        Builder.build(awconfig, AWCLI_NI_WATCH_LOCATION);
    } catch (ex) { console.error(ex); }
});