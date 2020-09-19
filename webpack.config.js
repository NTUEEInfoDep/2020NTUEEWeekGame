const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const webpack = require("webpack");

module.exports = {
  entry: {
    bundle: "./src/client/js/index.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "bundle"),
  },
  resolve: {
    extensions: [".js"],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[path][name].[ext]",
          },
        },
      },
      {
        test: /\.(ogg|mp3|wav|mpe?g)$/i,
        use: {
          loader: "file-loader",
          options: {
            name: "[path][name].[ext]",
          },
        },
      },
    ],
  },
  //   devtool: "#eval-source-map", // for develop
  devServer: {
    stats: {
      children: false, // cleaner display on terminal
      maxModules: 0, // cleaner display on terminal
      colors: true,
      hot: true,
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "src/client/html/index.html",
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
};
