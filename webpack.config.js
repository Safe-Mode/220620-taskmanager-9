const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/main.js',
  output: {
    filename: 'js/bundle.js',
    path: path.join(__dirname, 'public')
  },
  devtool: 'source-map',
  devServer: {
    compress: true,
    contentBase: path.join(__dirname, 'public'),
    open: true,
    openPage: 'webpack-dev-server/',
    watchContentBase: true
  }
};