const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const { GenerateSW } = require("workbox-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),
    new CopyPlugin({
      patterns: [
        {
          from: "img",
          to: "img",
          globOptions: {
            ignore: ["**/*.xcf"],
          },
        },
        { from: "css", to: "css" },
        { from: "js/vendor", to: "js/vendor" },
        { from: "icon.svg", to: "icon.svg" },
        { from: "favicon.ico", to: "favicon.ico" },
        { from: "robots.txt", to: "robots.txt" },
        { from: "icon.png", to: "icon.png" },
        { from: "404.html", to: "404.html" },
        { from: "site.webmanifest", to: "site.webmanifest" },
      ],
    }),
    new GenerateSW({
      clientsClaim: true,
      skipWaiting: true,

      runtimeCaching: [
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/i,
          handler: "CacheFirst",
        },
        {
          urlPattern: /\.(?:js|css|html)$/i,
          handler: "StaleWhileRevalidate",
        },
      ],
    }),
  ],
  optimization: {
    minimizer: [
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.sharpMinify,
          options: {
            encodeOptions: {
              png: {
                quality: 80,
              },
            },
          },
        },
      }),
    ],
  },
});
