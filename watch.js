const cp = require('child_process');
const fs = require('fs');

const exec = (cmd, args) => {
  return () => {
    var child = cp.spawn(cmd, args, { shell: true });

    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
  };
};

const build = exec('npm', ['run', 'build']);
const buildDoc = exec('npm', ['run', 'build-doc']);
const uglify = exec('npm', ['run', 'uglify']);
const test = exec('npm', ['test']);

build();
buildDoc();
test();

fs.watch('src', build);
fs.watch('dist/redom.js', uglify);
fs.watch('dist/doc.md', buildDoc);
fs.watch('test/test.js', test);
