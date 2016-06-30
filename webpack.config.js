var path = require("path");

module.exports = {
  entry: {
    app: [
      'babel-polyfill',
      './src/index.js'
    ]
  },
  output: {
    path: path.resolve(__dirname + '/dist'),
    filename: '[name].js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: { 
          presets: ['es2015', 'stage-0'] 
        }
      }
    ]
  },
  resolve: {
      extensions: ['', '.js']
  },
  devtool: '#inline-source-map',
  devServer: {
    inline: true,
    stats: { colors: true },
  }
};