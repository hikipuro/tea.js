const path = require("path");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const settings = {
	mode: "development"
};

const nodeConfig = {
	mode: settings.mode,
	target: "electron-main",
	externals: [nodeExternals()],
	node: {
		__dirname: false
	},
	entry: {
		"dist/NodeMain": "./src/node/NodeMain.ts",
	},
	output: {
		path: path.join(__dirname, "/"),
		filename: "[name].js"
	},
	resolve: {
		extensions: [".ts", ".js"]
	},
	devServer: {
		contentBase: path.join(__dirname, "/html")
	},
	module: {
		rules: [
			{
				test: /\.ts$/, loader: "ts-loader"
			}
		]
	}
};

const teaConfig = {
	mode: settings.mode,
	target: "electron-renderer",
	node: {
		__dirname: false
	},
	externals: {
		fs: "commonjs fs",
		path: "commonjs path",
	},
	entry: {
		"html/main": "./src/Main.ts",
		"html/newProject": "./src/tea/editor/windows/NewProject.ts",
		"html/preferences": "./src/tea/editor/windows/Preferences.ts",
	},
	output: {
		path: path.join(__dirname, "/"),
		filename: "[name].js"
	},
	resolve: {
		alias: {
			"vue": "vue/dist/vue.common.js"
		},
		extensions: [".ts", ".js"]
	},
	devServer: {
		contentBase: path.join(__dirname, "/html")
	},
	module: {
		rules: [
			{
				test: /\.ts$/, loader: "ts-loader"
			}
		]
	}
};

const scssConfig = {
	mode: settings.mode,
	context: path.join(__dirname, "./src/tea/editor/css"),
	entry: {
		"html/css/editor": "./Editor.scss",
		"html/css/newProject": "../windows/css/NewProject.scss",
		"html/css/preferences": "../windows/css/Preferences.scss",
	},
	output: {
		path: path.join(__dirname, "/"),
		filename: "[name].css"
	},
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: ["css-loader", "sass-loader"]
				})
			}
		]
	},
	plugins: [
		new ExtractTextPlugin('[name].css')
	]
};

module.exports = [
	nodeConfig,
	teaConfig,
	scssConfig
];
