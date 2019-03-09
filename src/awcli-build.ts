import * as fs from 'fs';
import * as path from 'path';
import { src, dest } from 'gulp';
import * as Builder from './tasks/BuildHelpers';
import { getConfig } from './tasks/LocateConfig';

let { dir, config } = getConfig();

let awconfig = JSON.parse(fs.readFileSync(config, 'utf8'));
awconfig.webpackConfig = dir + '/' + awconfig.webpackConfig;

Builder.build(awconfig, './build');