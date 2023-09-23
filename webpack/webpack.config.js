const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
module.exports = {
   mode: "development",
   entry: {
   background: path.resolve(__dirname, "..", "src", "background.ts"),
	inject_iframe: path.resolve(__dirname, "..", "src", "inject_iframe.ts"),
   timer_toolbar_iframe: path.resolve(__dirname, "..", "src", "toptimer_toolbar_iframe.ts"),
   href_target_top: path.resolve(__dirname, "..", "src", "href_target_top.ts")
   },
   output: {
      path: path.join(__dirname, "../build/js"),
      filename: "[name].js",
	  clean: true,
   },
   resolve: {
      extensions: [".ts", ".js"],
   },
   module: {
      rules: [
         {
            test: /\.tsx?$/,
            loader: "ts-loader",
            exclude: /node_modules/,
         },
      ],
   },
   plugins: [
      new CopyPlugin({
         patterns: [
		 {from: "static", to: "../"}
		 ]
      }),
   ],
   devtool: 'cheap-module-source-map'
};