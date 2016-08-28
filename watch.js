const cp = require('child_process');

const exec = (cmd, args) => {
  var child = cp.spawn(cmd, args)

  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);
}

const watch = (path, cmd) => {
  exec('chokidar', [path, '-c', 'npm run ' + cmd]);
  exec('chokidar',  [path, '-c', 'npm run ' + cmd]);
}

exec('npm', ['run', 'build']);

watch('src/**/*.js', 'build');
watch('dist/redom.js', 'uglify');
