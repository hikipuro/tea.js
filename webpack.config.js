const path = require("path");
const nodeExternals = require("webpack-node-externals");

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
		"dist/NodeMain": "./src/NodeMain.ts",
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
	target: "web",
	node: {
		__dirname: false
	},
	entry: {
		"html/main": "./src/Main.ts",
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

module.exports = [
	nodeConfig,
	teaConfig
];
