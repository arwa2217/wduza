const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");
//Uncomment when you need to check bundle sizes
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(common, {
  //Uncomment when you need to check bundle sizes
  /*plugins:[
    new BundleAnalyzerPlugin()
  ],*/
  mode: "development",
  devtool: "source-map",
  optimization: {
    runtimeChunk: "single",
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
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "public/"),
    },
    historyApiFallback: true,
  },
  externals: {
    server: JSON.stringify({
      // apiUrl: "https://dep.monolydev.com",
      apiUrl: "https://suku.monolydev.com:8443",
      // apiUrl: "https://wudzahq.monoly.net",
      // apiUrl: "https://dhs.monolydev.com:8443",
      // apiUrl: "https://sat.monolydev.com:8443",
      // apiUrl: "https://ksr.monolydev.com:8443",
      // apiUrl: "https://nis.monolydev.com:9443",
      // apiUrl: "https://ask.monolydev.com:8443",
      apiKey: "To Be Updated",
      azureClientID: "216ecd78-5c83-4b4c-8e4d-7eaeb2f3a02f",
    }),
    features: JSON.stringify({
      disable_discussion_notification: true,
      disable_build_version_check: true,
      disable_i18njs_logs: true,
    }),
    configConstants: JSON.stringify({
      readTimeout: 60000,
    }),
    core: JSON.stringify({
      signupUrl: "https://dep.monolydev.com:3002/signup/",
    }),
  },
});
