const { merge } = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require("fs");

const getEntryFiles = (dir) => {
    const files = fs.readdirSync(dir);
    const entries = {};
    files.forEach(file => {
        if (file.endsWith('.js')) {
            const entryName = file.replace('.js', '');
            entries[entryName] = path.resolve(dir, file);
        }
    });
    return entries;
};

module.exports = merge(common, {
    mode: 'development',
    entry: getEntryFiles(path.resolve(__dirname, 'src/dev')),
    devtool: 'inline-source-map',
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 9000,
        open: true,
    },
    plugins: [
        new HtmlWebpackPlugin(),
    ],
});
