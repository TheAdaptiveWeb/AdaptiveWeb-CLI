import * as npm from 'npm';

const sharedDependencies: any = [ 
    'webpack',
    'adaptiveweb'
];

const typescriptDependencies: any = [
    ...sharedDependencies,
    'typescript',
    'ts-loader'
];

const tsconfig =
`{
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

export const Package = {

json: (adapter: any, git: string) =>
`{
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
    "homepage": "${git}#readme",`
    }
    "author": "${adapter.author}",
    "license": "MPL-2.0",
    "dependencies": {}
}`,

installDependencies: (deps: string[], callback: Function) => {
    npm.load(function(err: any) {
        if (err) { console.error(err); return callback(); }

        npm.commands.install(deps, function(_err: any, _data: any) {
            callback();
        });

        npm.on('log', function(message: string) {
            console.log(message);
        });
    });
},

sharedDependencies, typescriptDependencies, tsconfig

}