const esbuild = require("esbuild");
const sassPlugin = require("esbuild-plugin-sass");

esbuild.build({
  entryPoints: ["src/main.js"],
  bundle: true,
  outfile: "public/bundle.js",
  minify: true,
  plugins: [sassPlugin()],
});
