import cp from "child_process";
import fs from "fs";

fs.watch("esm", run("build"));
fs.watch("dist/redom.js", () => run("minify")); // don't do init run
fs.watch("test/index.js", run("test"));

function run(script) {
  const child = cp.spawn("npm", ["run", script]);

  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);

  return () => run(script);
}
