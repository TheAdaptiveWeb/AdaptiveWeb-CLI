import * as webpack from 'webpack';
import * as fs from 'fs';

export function build(adapter: any, outputLocation: string) {
    let webpackConfig = require(adapter.webpackConfig);
    webpack(webpackConfig, ((err: Error, stats: webpack.Stats) => {
        if (err || stats.compilation.errors.length > 1) {
            // Errors
            console.error('Encountered a build error (webpack):', err, stats.compilation.errors);
        }
        // Success
        console.log('Webpacking successfully; Compiling adapter.');

        if (!fs.existsSync(outputLocation)) fs.mkdirSync(outputLocation, { recursive: true });
        writeAdapter(adapter, webpackConfig.output.path + '/main.js', outputLocation);
    }));
}

function writeAdapter(adapter: any, from: string, to: string) {
    let raw = fs.readFileSync(from, 'utf8');

    let outAdapter = {
        uuid: adapter.uuid,
        name: adapter.name,
        description: adapter.description,
        version: adapter.version,
        tags: adapter.tags || [],
        script: raw,
        preferenceSchema: adapter.preferenceSchema,
    }

    fs.writeFileSync(to + '/' + adapter.uuid + '.json', JSON.stringify(outAdapter));

    console.log('Adapter compilation successful!');
}