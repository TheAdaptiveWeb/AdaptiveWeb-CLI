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

import * as fs from 'fs';
import inquirer = require("inquirer");
import * as WebpackConfig from './tasks/WebpackConfigurations';
import { userInfo } from 'os';
import { getRepository } from './tasks/RepositoryInfo';
import { Package } from './tasks/PackageJson';
import { introduction, nextSteps, configWritten } from './tasks/Messages';
import defaultScripts from './tasks/DefaultScripts';

if (fs.existsSync('./awconfig.json')) {
    console.error('Could not initiate adapter: awconfig.json already exists!');
    process.exit(1);
}

console.log(introduction);

let folderName = process.cwd().replace(/.*\//g, '');

let repoUrl = getRepository();

let questions = (name: string) => [
    {
        name: 'id',
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
        type: 'input',
        default: 'Just another Adaptive Web adapter'
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
    id: string,
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
            id: answers.id,
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
    let wpConfig, deps, defaultScript;
    switch (template) {
        case 'ts-webpack':
        wpConfig = WebpackConfig.Typescript(config.script);
        deps = Package.typescriptDependencies;
        defaultScript = defaultScripts.typescript;
        fs.writeFileSync('./tsconfig.json', Package.tsconfig);
        break;
        case 'js-webpack':
        wpConfig = WebpackConfig.Default(config.script);
        deps = Package.sharedDependencies;
        defaultScript = defaultScripts.javascript;
    }
    fs.writeFileSync(config.webpackConfig, wpConfig);
    fs.writeFileSync('./package.json', Package.json(config, gitRepo));
    if (!fs.existsSync(config.script)) fs.writeFileSync(config.script, defaultScript);

    console.log('Installing dependencies');
    Package.installDependencies(deps, () => {
        console.log(configWritten);
        console.log(nextSteps);
    });
}