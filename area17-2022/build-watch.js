const esbuild = require("esbuild");
const sassPlugin = require("esbuild-plugin-sass");

esbuild
  .build({
    entryPoints: ["src/main.js"],
    bundle: true,
    outfile: "public/bundle.js",
    watch: {
      onRebuild(error, result) {
        if (error) console.error("watch build failed:", error);
        else console.log("watch build succeeded:", result);
      },
    },
    plugins: [sassPlugin()],
  })
  .then(() => console.log("watching..."))
  .catch((e) => console.error(e.message));
