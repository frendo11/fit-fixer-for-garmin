const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
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


module.exports = {
    entry: getEntryFiles(path.resolve(__dirname, 'src/entries')),
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        library: '[name]',
        libraryTarget: 'umd',
        umdNamedDefine: true,
    },
    plugins: [
        new CleanWebpackPlugin(),
    ],
};