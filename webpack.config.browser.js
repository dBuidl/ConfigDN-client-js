//webpack.config.browser.js
const path = require('path');

module.exports = {
    mode: "production",
    target: ["web", "es5"],
    devtool: false,
    entry: {
        main: "./src/index.ts",
    },
    output: {
        path: path.resolve(__dirname, './dist.browser/src'),
        filename: "bundle.js" // <--- Will be compiled to this single file
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                options: {
                    configFile: "tsconfig.browser.json"
                }
            }
        ]
    }
};
