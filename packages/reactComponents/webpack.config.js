const path = require('path');
const configs = [{
    entry: {
        reactComponents: path.resolve(__dirname, "test/jsSrc/index.tsx")
    },
    output: {
        path: path.resolve(__dirname, 'test/public/js/bin'),
        filename: "index.js",
    }
}, {
    entry: {
        reactComponents: path.resolve(__dirname, "src/index.tsx")
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "index.js",
        libraryTarget: "commonjs2"
    }
}];
module.exports = [...configs.map(
    (config) => ({
        ...config,
        module: {
            rules: [
                {
                    test: /\.(tsx|ts)$/,
                    exclude: /(node_modules|bower_components)/,
                    loader: 'babel-loader', // 'babel-loader' is also a valid name to reference
                    query: {
                        presets: [
                            "@babel/preset-react", 
                            "@babel/preset-typescript",
                            ["@babel/preset-env", {"modules": false}]
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
        }
    })
)];
