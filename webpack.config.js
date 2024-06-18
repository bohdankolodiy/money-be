/* eslint-disable no-undef */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

module.exports = {
  entry: "./src/app.ts",
  output: {
    filename: "app.ts",
    path: path.resolve(__dirname, "dist"),
  },
};
