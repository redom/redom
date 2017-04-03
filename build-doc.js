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
    <link rel="stylesheet" href="../prism.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inconsolata|Work+Sans:400,600,700">
  </head>
  <body>
    <div id="doc">
      ${html.split('\n<').join('\n      <')}
    </div>
    <script src="main.js"></script>
    <script src="../prism.js"></script>
    <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

      ga('create', 'UA-54216829-7', 'auto');
      ga('send', 'pageview');

    </script>
  </body>
</html>`
);

console.log('Built documentation');
