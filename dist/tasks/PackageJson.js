"use strict";
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
        "noImplicitReturns": false
    },
    "compileOnSave": true
}`;
exports.Package = {
    json: (adapter, git) => `{
    "name": "@adaptiveweb/${adapter.uuid}",
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
