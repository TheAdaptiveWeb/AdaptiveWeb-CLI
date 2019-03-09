import * as fs from 'fs';
import inquirer = require("inquirer");
import * as WebpackConfig from './tasks/WebpackConfigurations';
import { userInfo } from 'os';
import { getRepository } from './tasks/RepositoryInfo';
import { Package } from './tasks/PackageJson';

console.log(
`This utility will walk you through the creation of a awconfig.json file.

If you want to use preferences in your project, you will need to specify them
the awconfig.json file once you have completed this utility. See
[insert documentation link here] for details.

Press ^C at any time to quit.`
);

let folderName = process.cwd().replace(/.*\//g, '');

let repoUrl = getRepository();

let questions = (name: string) => [
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
        when: function(answers: any) {
            return answers.template == 'ts-webpack';
        }
    },
    {
        name: 'script',
        message: 'entry point:',
        type: 'input',
        default: 'index.js',
        when: function(answers: any) {
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
        default: userInfo().username,
    }
];

let config: {
    name: string,
    uuid: string,
    version: string,
    description: string,
    script: string,
    webpackConfig: string,
    author: string
};
let template: string;
let gitRepo: string;

inquirer.prompt({
    name: 'name',
    message: 'adapter name:',
    default: folderName,
    type: 'input'
}).then((name: any) => {
    inquirer.prompt(questions(name.name)).then((answers: any) => {
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
        deps = Package.typescriptDependencies;
        break;
        case 'js-webpack':
        wpConfig = WebpackConfig.Default(config.script);
        deps = Package.sharedDependencies;
    }
    fs.writeFileSync(config.webpackConfig, wpConfig);
    fs.writeFileSync('./package.json', Package.json(config, gitRepo));

    console.log('Installing dependencies');
    Package.installDependencies(deps, () => {
        console.log('Config successfully written to awconfig.json');
    });
}