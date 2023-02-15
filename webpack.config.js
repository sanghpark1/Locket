const path = require("path");
const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./Client/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  devtool: 'eval-source-map',
  devServer: {
    historyApiFallback: true,
    static: {
      directory: path.resolve(__dirname, 'dist'),
      publicPath: '/',
    },
    proxy: {
      '/user/**': {
        target: 'http://localhost:3000/',
        secure: false,
      },
      '/entry/**': {
        target: 'http://localhost:3000',
        secure: false,
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
        template: "./Client/index.html",
    })
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: ['ts-loader'],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /.(css|scss)$/,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
};
