const path = require('path');
const configs = [{
    entry: {
        index: path.resolve(__dirname, "src/index.ts")
    },
    output: {
        path: path.resolve(__dirname, 'es2015'),
        libraryTarget: "window",
        library: "LogicalCompare",
        filename: "index.js",
    }
}];
module.exports = [...configs.map(
    (config) => ({
        ...config,
        module: {
            rules: [
                {
                    test: /\.(ts)$/,
                    resolve: {
                        extensions: ['.ts', '.js', '.json']
                    },
                    exclude: /(node_modules|bower_components)/,
                    loader: 'ts-loader',
                    options: {
                        configFile: "tsconfig.es2015.json"
                    }
                }
            ]
        }
    })
)];
