"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const inquirer = require("inquirer");
const WebpackConfig = require("./tasks/WebpackConfigurations");
console.log(`This utility will walk you through the creation of a awconfig.json file.

If you want to use preferences in your project, you will need to specify them
the awconfig.json file once you have completed this utility. See
[insert documentation link here] for details.

Press ^C at any time to quit.`);
let folderName = process.cwd().replace(/.*\//g, '');
let questions = (name) => [
    {
        name: 'uuid',
        message: 'package identifier',
        default: name.toLowerCase().replace(/ /g, '-'),
    },
    {
        name: 'version',
        message: 'version:',
        default: '1.0.0',
        type: 'input'
    },
    {
        name: 'description',
        message: 'description:',
        type: 'input'
    },
    // {
    //     name: 'template',
    //     message: 'initiate from template',
    //     type: 'list',
    //     choices: [
    //         { name: 'TypeScript + Webpack', value: 'ts-webpack' },
    //         new inquirer.Separator(),
    //         { name: 'JavaScript + Webpack', value: 'js-webpack' },
    //         { name: 'JavaScript Standalone', value: 'js' },
    //         new inquirer.Separator(),
    //         { name: 'No template', value: 'none' },
    //     ]
    // },
    {
        name: 'script',
        message: 'entry point:',
        type: 'input',
        default: 'index.js',
    },
];
let config;
inquirer.prompt({
    name: 'name',
    message: 'adapter name:',
    default: folderName,
    type: 'input'
}).then((name) => {
    inquirer.prompt(questions(name.name)).then((answers) => {
        config = {
            name: name.name,
            uuid: answers.uuid,
            version: answers.version,
            description: answers.description,
            script: answers.script,
            webpackConfig: './webpack.config.js'
        };
        complete();
    });
});
function complete() {
    fs.writeFileSync('./awconfig.json', JSON.stringify(config, null, 4));
    fs.writeFileSync(config.webpackConfig, WebpackConfig.Default(config.script));
    console.log('Config successfully written to awconfig.json');
}
