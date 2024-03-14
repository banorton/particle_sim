const path = require('path');

module.exports = {
    mode: 'development',
    entry: './lib/canvas.js',
    output: {
        filename: 'canvas.js',
        path: path.resolve(__dirname, 'dist'),
    },
};
