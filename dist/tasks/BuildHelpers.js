"use strict";
/**
 *  Copyright 2019 The Adaptive Web. All Rights Reserved.
 *
 *  Licensed under the Mozilla Public License 2.0 (the "License").
 *  You may not use this file except in compliance with the License.
 *  A copy of the License is located at
 *
 *      https://www.mozilla.org/en-US/MPL/2.0/
 *
 *  or in the "license" file accompanying this file. This file is distributed
 *  on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 *  express or implied. See the License for the specific language governing
 *  permissions and limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const webpack = require("webpack");
const fs = require("fs");
function build(adapter, outputLocation) {
    let webpackConfig = require(adapter.webpackConfig);
    webpack(webpackConfig, ((err, stats) => {
        if (err || stats.compilation.errors.length > 1) {
            // Errors
            console.error('Encountered build error(s):');
            stats.compilation.errors.forEach(error => {
                console.error(error.message);
            });
            return;
        }
        if (!fs.existsSync(outputLocation))
            fs.mkdirSync(outputLocation, { recursive: true });
        writeAdapter(adapter, webpackConfig.output.path + '/main.js', outputLocation);
    }));
}
exports.build = build;
function writeAdapter(adapter, from, to) {
    let raw = fs.readFileSync(from, 'utf8');
    let about, aboutFile = adapter.aboutFile || 'about.md';
    if (fs.existsSync(aboutFile))
        about = fs.readFileSync(aboutFile, 'utf8');
    let outAdapter = {
        id: adapter.id,
        name: adapter.name,
        description: adapter.description,
        about,
        version: adapter.version,
        tags: adapter.tags || [],
        script: raw,
        preferenceSchema: adapter.preferenceSchema,
    };
    fs.writeFileSync(to + '/' + adapter.id + '.json', JSON.stringify(outAdapter));
}
