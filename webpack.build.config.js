const path = require("path");

const settings = {
	mode: "development"
};

const buildConfig = {
	mode: settings.mode,
	target: "web",
	node: {
		__dirname: false
	},
	externals: {
		fs: "null",
		path: "null",
		electron: "null",
	},
	entry: {
		"html/build": "./src/Build.ts",
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
	optimization: {
		minimize: true
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
	buildConfig
];
