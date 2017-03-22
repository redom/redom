const fs = require('fs');
const marked = require('marked');

const md = fs.readFileSync('dist/doc.md', 'utf8');

const html = marked(md);

fs.writeFileSync('dist/documentation/index.html',
  `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>RE:DOM documentation</title>
    <link rel="stylesheet" href="main.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inconsolata|Work+Sans:400,500,600,700">
  </head>
  <body>
    <div id="doc">
      ${html.split('\n<').join('\n    <')}
    </div>
    <script src="main.js"></script>
  </body>
</html>`
);

console.log('Built documentation');
