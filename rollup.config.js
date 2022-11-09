const ts = require("rollup-plugin-ts");

const pkg = require("./package.json");
const config = require("./tsconfig.json");

export default {
  input: "./index.ts",
  output: [
    {
      file: pkg.main,
      format: "umd",
      name: "Enqueu",
      sourcemap: true,
    },
  ],
  plugins: [ts(config)],
};
