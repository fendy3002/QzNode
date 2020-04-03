const path = require('path');
const sourceCodes = [{
    entry: {
        "index": path.resolve(__dirname, "react/index.tsx")
    }
}];
module.exports = [...sourceCodes.map(
    (sourceCode) => ({
        output: {
            path: path.resolve(__dirname, 'public/js/bin'),
            filename: "[name].js",
        },
        module: {
            rules: [
                {
                    test: /\.(tsx|ts)$/,
                    resolve: {
                        extensions: [".tsx", ".ts", ".js"]
                    },
                    exclude: /(node_modules|bower_components)/,
                    loader: 'babel-loader',
                    query: {
                        presets: [
                            "@babel/preset-react",
                            "@babel/preset-typescript",
                            ["@babel/preset-env", { "modules": false }]
                        ],
                        plugins: [
                            ["@babel/plugin-proposal-decorators", { "legacy": true }],
                            ["@babel/plugin-proposal-class-properties", { "loose": true }],
                            "@babel/proposal-object-rest-spread"
                        ]
                    }
                },
                {
                    test: /\.scss$/,
                    use: [
                        "style-loader", // creates style nodes from JS strings
                        "css-loader", // translates CSS into CommonJS
                        "sass-loader" // compiles Sass to CSS, using Node Sass by default
                    ]
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader'],
                },
                {
                    // Capture eot, ttf, woff, and woff2
                    test: /\.(eot|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                    loader: "url-loader"
                },
                {
                    test: /\.(jpg|gif|png|svg)(\?v=\d+\.\d+\.\d+)?$/,
                    loader: "url-loader"
                }
            ]
        },
        ...sourceCode,
    })
)];