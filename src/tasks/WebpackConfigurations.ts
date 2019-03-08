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