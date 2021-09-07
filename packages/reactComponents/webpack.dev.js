const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

const sourceCodes = [{
    entry: {
        ConfirmButton: path.resolve(__dirname, "src/ConfirmButton.tsx"),
        EditableLabel: path.resolve(__dirname, "src/EditableLabel.tsx"),
        NumericInput: path.resolve(__dirname, "src/NumericInput.tsx"),
        PageLimit: path.resolve(__dirname, "src/PageLimit.tsx"),
        Pagination: path.resolve(__dirname, "src/Pagination.tsx"),
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "[name].js",
        libraryTarget: "commonjs2"
    }
},
{
    entry: {
        reactComponents: path.resolve(__dirname, "test/jsSrc/index.tsx")
    },
    output: {
        path: path.resolve(__dirname, 'test/public/js/bin'),
        filename: "index.js",
    }
}];
module.exports = sourceCodes.map(k => {
    return merge(common, {
        ...k,
        mode: 'development',
        devtool: 'inline-source-map',
    })
});