export const Default: Function = (entry: string) =>
`const path = require("path");

module.exports = {
    entry: {
        main: "./${entry}"
    },
    mode: 'production',
    module: {
        rules: []
    },
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "[name].js"
    }
};`;

export const Typescript: Function = (entry: string) =>
`const path = require("path");

module.exports = {
    entry: {
        main: "./${entry}"
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "[name].js"
    }
};`;