const cp = require('child_process');
const fs = require('fs');

fs.watch('esm', run('build'));
fs.watch('dist/redom.js', () => run('minify')); // don't do init run
fs.watch('dist/doc.md', run('build-doc'));
fs.watch('test/test.js', run('test'));

function run (script) {
  const child = cp.spawn('npm', ['run', script]);

  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);

  return () => run(script);
}
