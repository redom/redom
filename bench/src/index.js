
import { bench } from './bench.js';
import { el } from '../../src/index.js';

bench('REDOM <div> with el()', function() {
    el('div',
        el('h1.redom', 'Hello ', el('b', 'RE:DOM'), '!'),
        el('p',
            'Bacon ipsum dolor amet meatloaf meatball shank porchetta \
             picanha bresaola short loin short ribs capicola fatback beef \
             ribs corned beef ham hock.'
        )
    )
});

var div = el.extend('div');
var header = el.extend('h1.redom');
var b = el.extend('b');
var p = el.extend('p');

bench('REDOM <div> with precached elements', function() {
    div(
        header('Hello ', b('RE:DOM'), '!'),
        p(
            'Bacon ipsum dolor amet meatloaf meatball shank porchetta \
             picanha bresaola short loin short ribs capicola fatback beef \
             ribs corned beef ham hock.'
        )
    )
});

console.log('REDOM',
    div(
        header('Hello ', b('RE:DOM'), '!'),
        p(
            'Bacon ipsum dolor amet meatloaf meatball shank porchetta \
             picanha bresaola short loin short ribs capicola fatback beef \
             ribs corned beef ham hock.'
        )
    )
);
