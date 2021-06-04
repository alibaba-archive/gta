const path = require('path')
const webpack = require('webpack')

const pkg = require('./package.json')

module.exports = {
  mode: 'production',
  devtool: false,
  entry: "./src/index.ts",
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    extensions: ['.js', '.ts'],
  },
  output: {
    library: 'Gta',
    libraryTarget: 'umd',
    libraryExport: 'default',
    umdNamedDefine: true,
    path: path.resolve(__dirname, 'lib'),
    filename: "index.js",
    environment: {
      arrowFunction: false,
      bigIntLiteral: false,
      const: false,
      destructuring: false,
      dynamicImport: false,
      forOf: false,
      module: false,
    },
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader' }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      __MACRO_VERSION__: `'${pkg.version}'`
    }),
    new webpack.ProvidePlugin({
      'DEBUG': [path.resolve(__dirname, 'src', 'utils'), 'DBGCALL']
    }),
  ]
}
