"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Default = (entry) => `const path = require("path");

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
exports.Typescript = (entry) => `const path = require("path");

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
