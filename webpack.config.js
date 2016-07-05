var path = require('path'),
    nodeExternals = require('webpack-node-externals'),
    webpack = require('webpack');

module.exports = {
	target: "node",
	entry: [
		"babel-polyfill", 
		"./src/index"
	],
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "app.js",
		//This corrects the map files to be relative to the distrubution
		devtoolModuleFilenameTemplate: function (info) {
			return path.relative(path.resolve(__dirname, "dist"), info.absoluteResourcePath);
		}
	},
	externals: [nodeExternals()],
	resolve: {
		extensions: ["", ".js", ".json"]
	},
	module: {
		loaders: [
			{
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: { 
					presets: ['es2015', 'stage-0', 'stage-3'],
					plugins: ['transform-runtime']
                }
            },
			{ test: /\.json$/, loader: 'json', exclude: "node_modules" }
		]
	},
	plugins: [
		new webpack.ProvidePlugin({
			'fetch': 'imports?this=>global!exports?global.fetch!node-fetch'
		}),
	],
	devtool: "source-map"
};