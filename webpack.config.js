const path = require("path");
const {HashedModuleIdsPlugin} = require("webpack");
const {EnvironmentPlugin} = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const AssetsWebpackPlugin = require("assets-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const {BundleAnalyzerPlugin} = require("webpack-bundle-analyzer");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const WebpackVisualizerPlugin = require("webpack-visualizer-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {compact} = require("@unction/complete");

const BENCHMARK = process.env.BENCHMARK === "enabled";
const NODE_ENV = process.env.NODE_ENV || "development";

const PACKAGE_ASSETS = [];

module.exports = [
  {
    mode: NODE_ENV,
    entry: [
      "@babel/polyfill",
      "./client/index.js",
    ],
    target: "web",
    devtool: NODE_ENV === "production" ? "source-map" : "eval-source-map",
    output: {
      path: path.resolve(__dirname, "tmp", "client"),
      chunkFilename: "[name].[chunkhash].js",
      filename: "[name].[chunkhash].js",
    },
    optimization: {
      runtimeChunk: "single",
      splitChunks: {
        cacheGroups: {
          internal: {
            test: /[\\/]@internal[\\/]/,
            name: "internal",
            chunks: "initial",
          },
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendor",
            chunks: "all",
          },
        },
      },
    },
    module: {
      rules: [
        {
          test: /index\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
      ],
    },
    devServer: {
      contentBase: path.join(__dirname, "dist"),
      compress: true,
      port: 9000,
    },
    plugins: compact([
      new HtmlWebpackPlugin({
        title: "Trunk",
        template: "client/index.html",
      }),
      new EnvironmentPlugin(["NODE_ENV", "BENCHMARK"]),
      new HashedModuleIdsPlugin(),
      NODE_ENV === "production" ? new CleanWebpackPlugin({verbose: true}) : null,
      BENCHMARK ? new WebpackVisualizerPlugin() : null,
      BENCHMARK ? new FriendlyErrorsWebpackPlugin() : null,
      BENCHMARK ? new BundleAnalyzerPlugin({analyzerMode: "static"}) : null,
      new CopyWebpackPlugin([{
        from: path.resolve(__dirname, "assets"),
        to: path.resolve(__dirname, "tmp", "client"),
      }]),
      ...PACKAGE_ASSETS.map(([from, ...to]) => new CopyWebpackPlugin([{
        from,
        to: path.resolve(__dirname, "tmp", "client", ...to),
      }])),
      NODE_ENV === "production" ? new CompressionWebpackPlugin({
        test: /\.(js|css|txt|xml|json|png|svg|jpg|gif|woff|woff2|eot|ttf|otf)$/i,
      }) : null,
      new AssetsWebpackPlugin({
        path: path.join(__dirname, "tmp", "client"),
        integrity: true,
      }),
    ]),
  },
];
