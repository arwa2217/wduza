const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const CopyPlugin = require("copy-webpack-plugin");
const miniCSSExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = merge(common, {
  mode: "production",
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
          enforce: true,
        },
      },
    },
    runtimeChunk: "single",
  },
  plugins: [
    new miniCSSExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
    new CopyPlugin({
      patterns: [{ from: path.join(__dirname, "public/") }],
    }),
  ],
  externals: {
    // global app server object
    server: JSON.stringify({
      apiUrl: "https://dep.monolydev.com",
      azureClientID: "9374d0ff-1657-4548-bc2a-c2c895e0b6a9",
      apiKey: "1234567890123456",
    }),
    features: JSON.stringify({
      disable_discussion_notification: true,
      disable_build_version_check: true,
      disable_i18njs_logs: true,
    }),
    configConstants: JSON.stringify({
      readTimeout : 60000
    }),
    core: JSON.stringify({
      signupUrl: "http://192.168.0.10/signup",
    }),
  },
});
