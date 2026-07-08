const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const { GenerateSW } = require("workbox-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
      meta: {
        description: {
          name: "description",
          content: "Create and print custom Gaslands dashboard cards.",
        },
        "og:title": {
          property: "og:title",
          content: "Gaslands Dashboard Creator",
        },
        "og:type": {
          property: "og:type",
          content: "website",
        },
        "og:url": {
          property: "og:url",
          content: "https://gaslands.sorogon.eu/",
        },
        "og:image": {
          property: "og:image",
          content: "https://gaslands.sorogon.eu/og-image.png",
        },
        "og:image:alt": {
          property: "og:image:alt",
          content: "Gaslands Dashboard Creator",
        },
      },
    }),
    new CopyPlugin({
      patterns: [
        {
          from: "img",
          to: "img",
          globOptions: {
            ignore: ["**/*.xcf", "**/.gitkeep"],
          },
        },
        { from: "css", to: "css" },
        { from: "font", to: "font" },
        { from: "icon.svg", to: "icon.svg" },
        { from: "robots.txt", to: "robots.txt" },
        { from: "404.html", to: "404.html" },
        { from: ".htaccess", to: ".htaccess", toType: "file" },
      ],
    }),
    new GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      cleanupOutdatedCaches: true,
      navigateFallback: "/index.html",
      exclude: [/\.htaccess$/],
    }),
    new FaviconsWebpackPlugin({
      logo: "./icon.png",
      cache: true,
      favicons: {
        appName: "Gaslands Dashboard Creator",
        appDescription: "Create and print custom Gaslands dashboards.",
        theme_color: "#eee",
        background: "#111",
        start_url: "/?utm_source=homescreen",
        display: "standalone",
      },
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
