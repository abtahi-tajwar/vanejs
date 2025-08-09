const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "vanjejs.min.js",
    // library: 'VaneJS',
    library: {
      type: "module",
    },
    // libraryTarget: 'umd',
    globalObject: "this",
    umdNamedDefine: true,
    libraryExport: "default", // 👈 IMPORTANT!
  },
  experiments: {
    outputModule: true, // <-- this must be true
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
