/**
 * --------------------------------------------------------
 * Webpack production config
 * --------------------------------------------------------
 */

var CleanPlugin = require('clean-webpack-plugin');

module.exports = {

  entry: "./src/bongloy.ts",

  output: {
    filename: "./dist/bongloy.js"
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
