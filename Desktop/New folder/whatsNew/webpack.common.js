const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const chokidar = require("chokidar");
const watcher = chokidar.watch(["!./folder/node_modules/**"]);
const webpack = require("webpack");

module.exports = {
  entry: {
    app: "./src/index.jsx",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "public", "index.html"),
    }),
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: ["build"],
    }),
    new webpack.ProvidePlugin({
      "window.hljs": "highlight.js",
      "window.katex": "katex",
    }),
  ],
  output: {
    filename: "[name].[hash].js",
    path: path.resolve(__dirname, "build"),
    publicPath: "/",
  },
  resolve: {
    extensions: [".js", ".jsx"],
    alias: {
      "@utilities": path.resolve(__dirname, "src/utilities/"),
      "@icons": path.resolve(__dirname, "src/assets/icons/"),
      "@toolbar": path.resolve(__dirname, "src/assets/icons/toolbar/"),
      "@fileIcon": path.resolve(__dirname, "src/assets/icons/file-type/"),
      "@styles": path.resolve(__dirname, "src/components/shared/styles"),
      "@home": path.resolve(__dirname, "src/assets/icons/user-home/"),
      "redux-api-middleware": path.resolve(
        __dirname,
        "node_modules/redux-api-middleware/lib/index.umd"
      ),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        resolve: {
          extensions: [".js", ".jsx"],
        },
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(eot|ttf|woff2?|otf|svg|png|gif)$/,
        loader: "file-loader",
        options: {
          name: "[folder]/[name].[ext]",
          outputPath: "public/assets/",
          esModule: false,
          sourceMapFilename: "[name].[hash:8].[ext].map",
          chunkFilename: "[id].[hash:8].[ext]",
        },
      },
      {
        test: /\.(json)$/,
        type: "javascript/auto",
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[folder]/[name].[ext]",
              outputPath: "assets/i18n/languages/",
            },
          },
        ],
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "public/"),
    },
    historyApiFallback: true,
  },
};
