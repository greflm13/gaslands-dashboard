const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    app: "./js/app.js",
  },
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
  ],
  output: {
    path: path.resolve(__dirname, "dist"),
    clean: true,
    filename: "./js/app.js",
    publicPath: "/",
  },
};
