"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer = require("inquirer");
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
    {
        name: 'template',
        message: 'initiate from template',
        type: 'list',
        choices: [
            { name: 'TypeScript + Webpack', value: 'ts-webpack' },
            new inquirer.Separator(),
            { name: 'JavaScript + Webpack', value: 'js-webpack' },
            { name: 'JavaScript Standalone', value: 'js' },
            new inquirer.Separator(),
            { name: 'No template', value: 'none' },
        ]
    },
    {
        name: 'script',
        message: 'script file',
        type: 'input',
        default: 'index.js',
        when: function (answers) {
            return answers.template == 'none';
        }
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
            script: answers.script
        };
        complete();
    });
});
function complete() {
    console.log(JSON.stringify(config, null, 4));
}
