const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

const sourceCodes = [{
    entry: {
        index: path.resolve(__dirname, "src/index.tsx"),
        ConfirmButton: path.resolve(__dirname, "src/ConfirmButton.tsx"),
        EditableLabel: path.resolve(__dirname, "src/EditableLabel.tsx"),
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "[name].js",
        libraryTarget: "commonjs2"
    }
}];
module.exports = sourceCodes.map(k => {
    return merge(common, {
        ...k,
        mode: 'development',
        devtool: 'inline-source-map',
    })
});