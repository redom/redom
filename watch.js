const cp = require('child_process');
const chokidar = require('chokidar');

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

chokidar.watch('src/**/*.js')
  .on('change', build)
  .on('unlink', build);

chokidar.watch('dist/redom.js')
  .on('change', uglify);

chokidar.watch('dist/doc.md')
  .on('change', buildDoc);

chokidar.watch('test/test.js')
  .on('change', test);
