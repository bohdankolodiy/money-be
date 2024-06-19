/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const isProduction = process.env.NODE_ENV == "production";

const config = {
  entry: "./src/app.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    open: true,
    host: "localhost",
    port: 3000,
  },
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /^pg-native$/,
    }),
    new HtmlWebpackPlugin(),
    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: "ts-loader",
        exclude: [
          /\/node_modules/,
          path.resolve(__dirname, "node_modules"),
          path.resolve(__dirname, "../node_modules"),
          /\.js$/,
          /\.html$/,
        ],
      },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", "..."],
  },
  target: "node", // Add this line to target a Node.js environment,
  externals: {
    // Add any Node.js core modules that you want to exclude
    util: "commonjs util",
    url: "commonjs url",
    "aws-sdk": "commonjs aws-sdk",
    nock: "commonjs nock",
    "mock-aws-s3": "commonjs mock-aws-s3",
    "node-gyp": "commonjs node-gyp",
    "node-pre-gyp": "commonjs node-pre-gyp",
    "mapbox": "commonjs @mapbox",
    "npm": "commonjs npm",

    // Add other modules as needed
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  return config;
};
