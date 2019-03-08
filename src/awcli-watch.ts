import * as fs from 'fs';
import * as Builder from './tasks/BuildHelpers';
import { getConfig } from './tasks/LocateConfig';
import { spawn } from 'child_process';
const watch: any = require('node-watch');

const AWCLI_NI_ROOT = process.env.HOME + '/.adaptiveweb/developer';
const AWCLI_NI_WATCH_LOCATION = AWCLI_NI_ROOT + '/dev_adapters';

console.log(
`NOTE: To use this utility, you must have developer mode enabled:
To enable developer mode, visit the configuration site ( https://adaptiveweb.io/configure ),
visit the settings menu (on the sidebar), and enable developer mode.`
);

let { dir, config } = getConfig();

let awconfig = JSON.parse(fs.readFileSync(config, 'utf8'));
awconfig.webpackConfig = dir + '/' + awconfig.webpackConfig;

Builder.build(awconfig, AWCLI_NI_WATCH_LOCATION);

require('./native_interface/awcli-ni');
  
watch(dir, { recursive: true }, (event: any, filename: string) => {
    try {
        if (filename.startsWith(dir + '/build')) return;
        if (filename.startsWith(dir + '/dist')) return;
        Builder.build(awconfig, AWCLI_NI_WATCH_LOCATION);
    } catch (ex) { console.error(ex); }
});