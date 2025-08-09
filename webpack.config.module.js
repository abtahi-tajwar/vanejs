// webpack.config.module.js
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "vanjejs.module.js", // <- Different filename
    library: {
      type: "module", // <- ES Module output
    },
  },
  experiments: {
    outputModule: true, // <- Required for module
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  mode: "production",
};
