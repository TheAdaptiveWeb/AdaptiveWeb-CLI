"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const Builder = require("./tasks/BuildHelpers");
const LocateConfig_1 = require("./tasks/LocateConfig");
let { dir, config } = LocateConfig_1.getConfig();
let awconfig = JSON.parse(fs.readFileSync(config, 'utf8'));
awconfig.webpackConfig = dir + '/' + awconfig.webpackConfig;
Builder.build(awconfig, './');
