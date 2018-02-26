/**
 * --------------------------------------------------------
 * Webpack development config
 * --------------------------------------------------------
 */

var CleanPlugin = require('clean-webpack-plugin');

module.exports = {

  entry: "./src/bongloy.ts",

  output: {
    filename: "./dist/bongloy.js"
  },

  devtool: '#inline-source-map',

  devServer: {
    inline: true,
    host: '0.0.0.0',
    port: 9950,
    historyApiFallback: true,
    contentBase: './'
  },

  resolve: {
    extensions: ["", ".webpack.js", ".web.js", ".ts", ".js"]
  },

  module: {
    loaders: [
      { test: /\.ts$/, loader: "ts-loader" }
    ]
  },

  plugins: [
    new CleanPlugin('dist')
  ]
}
