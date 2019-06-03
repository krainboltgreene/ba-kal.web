// eslint-disable no-undef
const path = require("path");
const {HashedModuleIdsPlugin} = require("webpack");
const {IgnorePlugin} = require("webpack");
const {EnvironmentPlugin} = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const AssetsWebpackPlugin = require("assets-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const {BundleAnalyzerPlugin} = require("webpack-bundle-analyzer");
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
    devtool: NODE_ENV === "production" ? "source-map" : "inline-source-map",
    output: {
      path: path.resolve(__dirname, "tmp", "client"),
      filename: "[name].[chunkhash].js",
    },
    optimization: {
      runtimeChunk: "single",
      splitChunks: {
        minSize: 0,
        maxAsyncRequests: Infinity,
        maxInitialRequests: Infinity,
        cacheGroups: {
          internal: {
            test: /@internal[\\/]/u,
            chunks: "initial",
            priority: -30,
          },
          unction: {
            test: /[\\/]node_modules[\\/]@unction/u,
            chunks: "initial",
            priority: -20,
          },
          ramda: {
            test: /[\\/]node_modules[\\/]ramda/u,
            chunks: "initial",
            priority: -20,
          },
          moment: {
            test: /[\\/]node_modules[\\/]moment/u,
            chunks: "initial",
            priority: -20,
          },
          most: {
            test: /[\\/]node_modules[\\/]most/u,
            chunks: "initial",
            priority: -20,
          },
          elliptic: {
            test: /[\\/]node_modules[\\/]elliptic/u,
            chunks: "initial",
            priority: -20,
          },
          bn: {
            test: /[\\/]node_modules[\\/]bn/u,
            chunks: "initial",
            priority: -20,
          },
          redux: {
            test: /[\\/]node_modules[\\/]redux/u,
            chunks: "initial",
            priority: -20,
          },
          react: {
            test: /[\\/]node_modules[\\/]react(?:-dom|-router|-router-dom|-redux)?[\\/]/u,
            chunks: "initial",
            priority: -20,
          },
          babel: {
            test: /[\\/]node_modules[\\/]@babel/u,
            chunks: "initial",
            priority: -20,
          },
          pouchdb: {
            test: /[\\/]node_modules[\\/](pouchdb|lunr)/u,
            chunks: "initial",
            priority: -20,
          },
          vendors: {
            test: /[\\/]node_modules[\\/]/u,
            chunks: "initial",
            priority: -40,
          },
        },
      },
    },
    module: {
      rules: [
        {
          test: /index\.js$/u,
          exclude: /node_modules/u,
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
      new HtmlWebpackPlugin({template: "client/index.html"}),
      new EnvironmentPlugin([
        "NODE_ENV",
        "BENCHMARK",
        "COUCHDB_USERNAME",
        "COUCHDB_PASSWORD",
        "COUCHDB_URI",
      ]),
      new HashedModuleIdsPlugin(),
      NODE_ENV === "production" ? new CleanWebpackPlugin({verbose: true}) : null,
      NODE_ENV === "production" ? new IgnorePlugin(/^\.\/locale$/u, /moment$/u) : null,
      new CopyWebpackPlugin([{
        from: path.resolve(__dirname, "assets"),
        to: path.resolve(__dirname, "tmp", "client"),
      }]),
      ...PACKAGE_ASSETS.map(([from, ...to]) => new CopyWebpackPlugin([{
        from,
        to: path.resolve(__dirname, "tmp", "client", ...to),
      }])),
      NODE_ENV === "production" ? new CompressionWebpackPlugin({
        test: /\.(?:js|css|txt|xml|json|png|svg|jpg|gif|woff|woff2|eot|ttf|otf)$/iu,
      }) : null,
      new AssetsWebpackPlugin({
        path: path.join(__dirname, "tmp", "client"),
        integrity: true,
      }),
      BENCHMARK ? new BundleAnalyzerPlugin({analyzerMode: "static", openAnalyzer: false}) : null,
    ]),
  },
];
