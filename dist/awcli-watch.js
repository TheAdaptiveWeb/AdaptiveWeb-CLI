"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const Builder = require("./tasks/BuildHelpers");
const LocateConfig_1 = require("./tasks/LocateConfig");
const awcli_ni_1 = require("./native_interface/awcli-ni");
const watch = require('node-watch');
const AWCLI_NI_ROOT = process.env.HOME + '/.adaptiveweb/developer';
const AWCLI_NI_WATCH_LOCATION = AWCLI_NI_ROOT + '/dev_adapters';
console.log(`NOTE: To use this utility, you must have developer mode enabled:
To enable developer mode, visit the configuration site ( https://adaptiveweb.io/configure ),
visit the settings menu (on the sidebar), and enable developer mode.`);
let { dir, config } = LocateConfig_1.getConfig();
let awconfig = JSON.parse(fs.readFileSync(config, 'utf8'));
awconfig.webpackConfig = dir + '/' + awconfig.webpackConfig;
Builder.build(awconfig, AWCLI_NI_WATCH_LOCATION);
awcli_ni_1.startServer();
console.log('Watching for file changes.');
watch(dir, { recursive: true }, (event, filename) => {
    console.log('File change detected: ' + filename + '; Rebuilding');
    try {
        if (filename.startsWith(dir + '/build'))
            return;
        if (filename.startsWith(dir + '/dist'))
            return;
        Builder.build(awconfig, AWCLI_NI_WATCH_LOCATION);
    }
    catch (ex) {
        console.error(ex);
    }
});
