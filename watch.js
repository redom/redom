const cp = require('child_process');
const fs = require('fs');

fs.watch('src', run('build'));
fs.watch('dist/redom.js', () => run('uglify')); // don't do init run
fs.watch('dist/doc.md', run('build-doc'));
fs.watch('test/test.js', run('test'));

function run (script) {
  cp.spawn('npm', ['run', script], { stdio: 'inherit' });

  return () => run(script);
}
