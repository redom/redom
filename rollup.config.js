import babel from "@rollup/plugin-babel";

export default {
  plugins: [babel({ babelHelpers: "bundled", presets: ["@babel/preset-env"] })],
};
