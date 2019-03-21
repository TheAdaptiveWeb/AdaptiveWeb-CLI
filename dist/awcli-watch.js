"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const Builder = require("./tasks/BuildHelpers");
const LocateConfig_1 = require("./tasks/LocateConfig");
const awcli_ni_1 = require("./native_interface/awcli-ni");
const Messages_1 = require("./tasks/Messages");
const colors = require("colors");
const watch = require('node-watch');
const AWCLI_NI_ROOT = process.env.HOME + '/.adaptiveweb/developer';
const AWCLI_NI_WATCH_LOCATION = AWCLI_NI_ROOT + '/dev_adapters';
function log(message) {
    let formatTime = (x) => { if (('' + x).length < 2)
        x = '0' + x; return x; };
    let dt = new Date();
    let time = colors.green(`${formatTime(dt.getHours())}:${formatTime(dt.getMinutes())}:${formatTime(dt.getSeconds())}`);
    let msg = `[${time}] ${message}`;
    console.log(msg);
}
console.clear();
console.log(Messages_1.devModeWarning);
let { dir, config } = LocateConfig_1.getConfig();
let awconfig;
function loadConfig() {
    awconfig = JSON.parse(fs.readFileSync(config, 'utf8'));
    awconfig.webpackConfig = dir + '/' + awconfig.webpackConfig;
}
loadConfig();
log(Messages_1.watchingFileChanges);
Builder.build(awconfig, AWCLI_NI_WATCH_LOCATION);
log('Adapter ' + colors.bold(awconfig.id) + ' compilation successful!');
awcli_ni_1.startServer(() => { log('Development server started on port 13551.'); });
watch(dir, { recursive: true }, (event, filename) => {
    try {
        if (filename.startsWith(dir + '/build'))
            return;
        if (filename.startsWith(dir + '/dist'))
            return;
        if (filename.startsWith(dir + '/node_modules'))
            return;
        if (filename.endsWith('awconfig.json'))
            loadConfig();
        log('File change detected: ' + filename + '; Rebuilding');
        Builder.build(awconfig, AWCLI_NI_WATCH_LOCATION);
        log('Adapter ' + colors.bold(awconfig.id) + ' compilation successful!');
    }
    catch (ex) {
        console.error(ex);
    }
});
