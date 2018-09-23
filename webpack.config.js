const path = require("path");
const nodeExternals = require("webpack-node-externals");
module.exports = {
	mode: "development",
	target: "node",
	externals: [nodeExternals()],
	node: {
		__dirname: false
	},
	entry: {
		"html/main": "./src/Main.ts",
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
}
