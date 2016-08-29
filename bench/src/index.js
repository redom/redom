
import { bench } from './bench.js';
import { el, extend, mount, text, children, className } from '../../src/index.js';

var b = el('b');
var div = el('div');
var h1 = el('h1');
var p = el('p');

bench('REDOM <div> with multiple child nodes', function() {
    div(
        children([
            h1(className('redom'), text('Hello '), children([
                b(children([
                    text('RE:DOM')
                ]))

            ]), text('!')),
            p(
                text('Bacon ipsum dolor amet meatloaf meatball shank porchetta \
                    picanha bresaola short loin short ribs capicola fatback beef \
                    ribs corned beef ham hock.')
            )
        ])
    )
});


console.log('REDOM', div(
    children([
        h1(className('redom'), text('Hello '), children([
            b(children([
                text('RE:DOM')
            ]))

        ]), text('!')),
        p(
            text('Bacon ipsum dolor amet meatloaf meatball shank porchetta \
                picanha bresaola short loin short ribs capicola fatback beef \
                ribs corned beef ham hock.')
        )
    ])
));
