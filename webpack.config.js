const path = require('path');

module.exports = {
    entry: "./src/index.coffee",
    output: {
        libraryTarget: 'umd',
        path: path.resolve(__dirname, 'lib'),
        filename: "index.js"
    },
    module: {
        loaders: [
            { test: /\.coffee$/, loader: "coffee-loader" }
        ]
    },
    resolve: {
      root: path.resolve('./src'),
      extensions: ['', '.js', '.coffee']
    }
};
