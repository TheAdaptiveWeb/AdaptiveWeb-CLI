"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const inquirer = require("inquirer");
const WebpackConfig = require("./tasks/WebpackConfigurations");
const os_1 = require("os");
const RepositoryInfo_1 = require("./tasks/RepositoryInfo");
const PackageJson_1 = require("./tasks/PackageJson");
if (fs.existsSync('./awconfig.json')) {
    console.error('Could not initiate adapter: awconfig.json already exists!');
    process.exit(1);
}
console.log(`This utility will walk you through the creation of a awconfig.json file.

If you want to use preferences in your project, you will need to specify them
the awconfig.json file once you have completed this utility. See
[insert documentation link here] for details.

Press ^C at any time to quit.`);
let folderName = process.cwd().replace(/.*\//g, '');
let repoUrl = RepositoryInfo_1.getRepository();
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
            { name: 'JavaScript + Webpack', value: 'js-webpack' }
        ]
    },
    {
        name: 'script',
        message: 'entry point:',
        type: 'input',
        default: 'index.ts',
        when: function (answers) {
            return answers.template == 'ts-webpack';
        }
    },
    {
        name: 'script',
        message: 'entry point:',
        type: 'input',
        default: 'index.js',
        when: function (answers) {
            return answers.template == 'js-webpack';
        }
    },
    {
        name: 'repo',
        message: 'git repository:',
        type: 'input',
        default: repoUrl
    },
    {
        name: 'author',
        message: 'author:',
        type: 'input',
        default: os_1.userInfo().username,
    }
];
let config;
let template;
let gitRepo;
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
            webpackConfig: './webpack.config.js',
            author: answers.author
        };
        template = answers.template;
        gitRepo = answers.repo;
        complete();
    });
});
function complete() {
    fs.writeFileSync('./awconfig.json', JSON.stringify(config, null, 4));
    let wpConfig, deps;
    switch (template) {
        case 'ts-webpack':
            wpConfig = WebpackConfig.Typescript(config.script);
            deps = PackageJson_1.Package.typescriptDependencies;
            break;
        case 'js-webpack':
            wpConfig = WebpackConfig.Default(config.script);
            deps = PackageJson_1.Package.sharedDependencies;
    }
    fs.writeFileSync(config.webpackConfig, wpConfig);
    fs.writeFileSync('./package.json', PackageJson_1.Package.json(config, gitRepo));
    console.log('Installing dependencies');
    PackageJson_1.Package.installDependencies(deps, () => {
        console.log('Config successfully written to awconfig.json');
    });
}
