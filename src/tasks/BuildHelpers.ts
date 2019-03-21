import * as webpack from 'webpack';
import * as fs from 'fs';

export function build(adapter: any, outputLocation: string) {
    let webpackConfig = require(adapter.webpackConfig);
    webpack(webpackConfig, ((err: Error, stats: webpack.Stats) => {
        if (err || stats.compilation.errors.length > 1) {
            // Errors
            console.error('Encountered build error(s):');
            stats.compilation.errors.forEach(error => {
                console.error(error.message);
            });

            return;
        }

        if (!fs.existsSync(outputLocation)) fs.mkdirSync(outputLocation, { recursive: true });
        writeAdapter(adapter, webpackConfig.output.path + '/main.js', outputLocation);
    }));
}

function writeAdapter(adapter: any, from: string, to: string) {
    let raw = fs.readFileSync(from, 'utf8');

    let about, aboutFile = adapter.aboutFile || 'about.md';
    if (fs.existsSync(aboutFile)) about = fs.readFileSync(aboutFile, 'utf8');

    let outAdapter = {
        id: adapter.id,
        name: adapter.name,
        description: adapter.description,
        about,
        version: adapter.version,
        tags: adapter.tags || [],
        script: raw,
        preferenceSchema: adapter.preferenceSchema,
    }

    fs.writeFileSync(to + '/' + adapter.id + '.json', JSON.stringify(outAdapter));
}