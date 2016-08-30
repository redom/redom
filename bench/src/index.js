
import { bench } from './bench.js';
import { el } from '../../src/index.js';

var div = el.extend('div');
var redomH1 = el.extend('h1.redom');
var b = el.extend('b');
var p = el.extend('p');

bench('REDOM <div> with multiple child nodes', function() {
    div(
        redomH1('Hello ', b('RE:DOM'), '!'),
        p(
            'Bacon ipsum dolor amet meatloaf meatball shank porchetta \
             picanha bresaola short loin short ribs capicola fatback beef \
             ribs corned beef ham hock.'
        )
    )
});

console.log('REDOM',
    div(
        redomH1('Hello ', b('RE:DOM'), '!'),
        p(
            'Bacon ipsum dolor amet meatloaf meatball shank porchetta \
             picanha bresaola short loin short ribs capicola fatback beef \
             ribs corned beef ham hock.'
        )
    )
);
