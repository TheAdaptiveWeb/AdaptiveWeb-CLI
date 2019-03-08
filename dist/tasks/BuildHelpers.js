"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webpack = require("webpack");
const fs = require("fs");
function build(adapter, outputLocation) {
    let webpackConfig = require(adapter.webpackConfig);
    webpack(webpackConfig, ((err, stats) => {
        if (err || stats.compilation.errors.length > 1) {
            // Errors
            console.error('Encountered a build error:', err, stats.compilation.errors);
        }
        // Success
        console.log('Webpacking successfully; Compiling adapter.');
        writeAdapter(adapter, webpackConfig.output.path + '/main.js', outputLocation);
    }));
}
exports.build = build;
function writeAdapter(adapter, from, to) {
    let raw = fs.readFileSync(from, 'utf8');
    let outAdapter = {
        uuid: adapter.uuid,
        name: adapter.name,
        description: adapter.description,
        version: adapter.version,
        tags: adapter.tags || [],
        script: raw,
        preferenceSchema: adapter.preferenceSchema,
    };
    fs.writeFileSync(to + '/' + adapter.uuid + '.json', JSON.stringify(outAdapter));
    console.log('Adapter compilation successful!');
}
