"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const Builder = require("./tasks/BuildHelpers");
const LocateConfig_1 = require("./tasks/LocateConfig");
const awcli_ni_1 = require("./native_interface/awcli-ni");
const Messages_1 = require("./tasks/Messages");
const watch = require('node-watch');
const AWCLI_NI_ROOT = process.env.HOME + '/.adaptiveweb/developer';
const AWCLI_NI_WATCH_LOCATION = AWCLI_NI_ROOT + '/dev_adapters';
console.log(Messages_1.devModeWarning);
let { dir, config } = LocateConfig_1.getConfig();
let awconfig = JSON.parse(fs.readFileSync(config, 'utf8'));
awconfig.webpackConfig = dir + '/' + awconfig.webpackConfig;
Builder.build(awconfig, AWCLI_NI_WATCH_LOCATION);
awcli_ni_1.startServer();
watch(dir, { recursive: true }, (event, filename) => {
    try {
        if (filename.startsWith(dir + '/build'))
            return;
        if (filename.startsWith(dir + '/dist'))
            return;
        if (filename.startsWith(dir + '/node_modules'))
            return;
        process.stdout.write(Messages_1.watchingFileChanges + '\nFile change detected: ' + filename + '; Rebuilding');
        Builder.build(awconfig, AWCLI_NI_WATCH_LOCATION);
    }
    catch (ex) {
        console.error(ex);
    }
});
