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
const npm = require("npm");
const sharedDependencies = [
    'webpack',
    'adaptiveweb'
];
const typescriptDependencies = [
    ...sharedDependencies,
    'typescript',
    'ts-loader'
];
const tsconfig = `{
    "extends": "./node_modules/adaptiveweb/tsconfig.json",
    "compilerOptions": {
        "baseUrl": ".",
        "rootDir": ".",
        "outDir": "build",
        "declaration": false,
        "noImplicitReturns": false,
        "noUnusedLocals": false,
    },
    "compileOnSave": true
}`;
exports.Package = {
    json: (adapter, git) => `{
    "name": "@adaptiveweb/${adapter.id}",
    "version": "${adapter.version}",
    "description": "${adapter.description}",
    "main": "${adapter.script}",
    "scripts": {
        "start": "awcli watch",
        "build": "awcli build"
    },
    ${git &&
        `"repository": {
        "type": "git",
        "url": "git+${git}"
    },
    "bugs": {
        "url": "${git}/issues"
    },
    "homepage": "${git}#readme",`}
    "author": "${adapter.author}",
    "license": "MPL-2.0",
    "dependencies": {}
}`,
    installDependencies: (deps, callback) => {
        npm.load(function (err) {
            if (err) {
                console.error(err);
                return callback();
            }
            npm.commands.install(deps, function (_err, _data) {
                callback();
            });
            npm.on('log', function (message) {
                console.log(message);
            });
        });
    },
    sharedDependencies, typescriptDependencies, tsconfig
};
