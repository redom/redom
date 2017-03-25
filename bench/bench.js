
var test = require('tape');

var c = {
  'cyan': '36m',
  'magenta': '35m',
  'blue': '34m',
  'yellow': '33m',
  'green': '32m',
  'red': '31m',
  'gray': '90m',
}

function cc (text, code) {
  return ('\u001b[' + code + text + '\u001b[0m')
}

module.exports = function (redom) {
  var { el, html, mount, unmount } = redom;

  var nApexes = 25;
  var nLeaves = 20;
  var nBranches = 15;
  var nIterations = 10;

  test('   [latest version]   running simple benchmarks', function (t) {
    t.test('lifecycle performance output, 100% lifecycle bound', function (t) {
      t.plan(1);

      var count = 0;
      var onmounts = 0;
      var onunmounts = 0;

      function Base (name, content) {
        var el = html('', content);
        var base = { el };
        count++;

        base.onmount = function () {
          onmounts++;
        };

        base.onunmount = function () {
          onunmounts++;
        };

        return base;
      }

      function Apex () {
        return Base('Apex');
      }

      function Leaf () {
        var size = nApexes;
        var apexes = [];
        for (var i = 0; i < size; i++) {
          apexes.push(Apex());
        }
        return Base('Leaf', apexes);
      }

      function Branch () {
        var size = nLeaves;
        var leaves = [];
        for (var i = 0; i < size; i++) {
          leaves.push(Leaf());
        }
        return Base('Branch', leaves);
      }

      function Tree () {
        var size = nBranches;
        var branches = [];
        for (var i = 0; i < size; i++) {
          branches.push(Branch());
        }
        return Base('Tree', branches);
      }

      var times = {
        create: [],
        mount: [],
        unmount: [],
        count: [],
        onmounts: [],
        onunmounts: []
      };

      var time;

      function check () {
        // logs = []; // clear logs
        time = Date.now();
        count = 0; // clear count
        onmounts = 0;
        onunmounts = 0;
        var tree = Tree();
        times.create.push(Date.now() - time);

        time = Date.now();
        mount(document.body, tree);
        times.mount.push(Date.now() - time);

        time = Date.now();
        unmount(document.body, tree);
        times.unmount.push(Date.now() - time);

        times.count.push(count);
        times.onmounts.push(onmounts);
        times.onunmounts.push(onunmounts);
      }

      for (let i = 1; i < nIterations + 1; i++) {
        check();
      }

      var averages = {
        create: times.create.reduce(function (a, b) { return a + b; }) / times.create.length,
        mount: times.mount.reduce(function (a, b) { return a + b; }) / times.mount.length,
        unmount: times.unmount.reduce(function (a, b) { return a + b; }) / times.unmount.length,
        count: times.count.reduce(function (a, b) { return a + b; }) / times.count.length,
        onmounts: times.onmounts.reduce(function (a, b) { return a + b; }) / times.onmounts.length,
        onunmounts: times.onunmounts.reduce(function (a, b) { return a + b; }) / times.onunmounts.length
      };

      console.log('element count median: ' + averages.count);
      console.log('onmounts: ' + averages.onmounts);
      console.log('onunmounts: ' + averages.onunmounts);
      console.log('create median: ' + averages.create);
      console.log('mount median: ' + averages.mount);
      console.log('unmount median: ' + averages.unmount);
      console.log('create + mount + unmount: ' + cc(averages.create + averages.mount + averages.unmount, c['yellow']));

      t.pass();
    });
    t.test('lifecycle performance output, 1% lifecycle bound', function (t) {
      t.plan(1);

      var count = 0;
      var onmounts = 0;
      var onunmounts = 0;

      var percent = 1;
      function shouldUnbind () {
        return Math.random() > (percent / 100);
      }

      function Base (name, content) {
        var el = html('', content);
        var base = { el };
        count++;

        base.onmount = function () {
          onmounts++;
        };

        base.onunmount = function () {
          onunmounts++;
        };

        if (shouldUnbind()) {
          delete base.onmount;
        }
        if (shouldUnbind()) {
          delete base.onunmount;
        }

        return base;
      }

      function Apex () {
        return Base('Apex');
      }

      function Leaf () {
        var size = nApexes;
        var apexes = [];
        for (var i = 0; i < size; i++) {
          apexes.push(Apex());
        }
        return Base('Leaf', apexes);
      }

      function Branch () {
        var size = nLeaves;
        var leaves = [];
        for (var i = 0; i < size; i++) {
          leaves.push(Leaf());
        }
        return Base('Branch', leaves);
      }

      function Tree () {
        var size = nBranches;
        var branches = [];
        for (var i = 0; i < size; i++) {
          branches.push(Branch());
        }
        return Base('Tree', branches);
      }

      var times = {
        create: [],
        mount: [],
        unmount: [],
        count: [],
        onmounts: [],
        onunmounts: []
      };

      var time;

      function check () {
        time = Date.now();
        count = 0; // clear count
        onmounts = 0;
        onunmounts = 0;
        var tree = Tree();
        times.create.push(Date.now() - time);

        time = Date.now();
        mount(document.body, tree);
        times.mount.push(Date.now() - time);

        time = Date.now();
        unmount(document.body, tree);
        times.unmount.push(Date.now() - time);

        times.count.push(count);
        times.onmounts.push(onmounts);
        times.onunmounts.push(onunmounts);
      }

      for (let i = 1; i < nIterations + 1; i++) {
        check();
      }

      var averages = {
        create: times.create.reduce(function (a, b) { return a + b; }) / times.create.length,
        mount: times.mount.reduce(function (a, b) { return a + b; }) / times.mount.length,
        unmount: times.unmount.reduce(function (a, b) { return a + b; }) / times.unmount.length,
        count: times.count.reduce(function (a, b) { return a + b; }) / times.count.length,
        onmounts: times.onmounts.reduce(function (a, b) { return a + b; }) / times.onmounts.length,
        onunmounts: times.onunmounts.reduce(function (a, b) { return a + b; }) / times.onunmounts.length
      };

      console.log('element count median: ' + averages.count);
      console.log('onmounts median: ' + averages.onmounts);
      console.log('onunmounts median: ' + averages.onunmounts);
      console.log('create median: ' + averages.create);
      console.log('mount median: ' + averages.mount);
      console.log('unmount median: ' + averages.unmount);
      console.log('create + mount + unmount: ' + cc(averages.create + averages.mount + averages.unmount, c['yellow']));

      t.pass();
    });
    t.test('lifecycle performance output, 0.025% lifecycle bound', function (t) {
      t.plan(1);

      var count = 0;
      var onmounts = 0;
      var onunmounts = 0;

      var percent = 0.025;
      function shouldUnbind () {
        return Math.random() > (percent / 100);
      }

      function Base (name, content) {
        var el = html('', content);
        var base = { el };
        count++;

        base.onmount = function () {
          onmounts++;
        };

        base.onunmount = function () {
          onunmounts++;
        };

        if (shouldUnbind()) {
          delete base.onmount;
        }
        if (shouldUnbind()) {
          delete base.onunmount;
        }

        return base;
      }

      function Apex () {
        return Base('Apex');
      }

      function Leaf () {
        var size = nApexes;
        var apexes = [];
        for (var i = 0; i < size; i++) {
          apexes.push(Apex());
        }
        return Base('Leaf', apexes);
      }

      function Branch () {
        var size = nLeaves;
        var leaves = [];
        for (var i = 0; i < size; i++) {
          leaves.push(Leaf());
        }
        return Base('Branch', leaves);
      }

      function Tree () {
        var size = nBranches;
        var branches = [];
        for (var i = 0; i < size; i++) {
          branches.push(Branch());
        }
        return Base('Tree', branches);
      }

      var times = {
        create: [],
        mount: [],
        unmount: [],
        count: [],
        onmounts: [],
        onunmounts: []
      };

      var time;

      function check () {
        time = Date.now();
        count = 0; // clear count
        onmounts = 0;
        onunmounts = 0;
        var tree = Tree();
        times.create.push(Date.now() - time);

        time = Date.now();
        mount(document.body, tree);
        times.mount.push(Date.now() - time);

        time = Date.now();
        unmount(document.body, tree);
        times.unmount.push(Date.now() - time);

        times.count.push(count);
        times.onmounts.push(onmounts);
        times.onunmounts.push(onunmounts);
      }

      for (let i = 1; i < nIterations + 1; i++) {
        check();
      }

      var averages = {
        create: times.create.reduce(function (a, b) { return a + b; }) / times.create.length,
        mount: times.mount.reduce(function (a, b) { return a + b; }) / times.mount.length,
        unmount: times.unmount.reduce(function (a, b) { return a + b; }) / times.unmount.length,
        count: times.count.reduce(function (a, b) { return a + b; }) / times.count.length,
        onmounts: times.onmounts.reduce(function (a, b) { return a + b; }) / times.onmounts.length,
        onunmounts: times.onunmounts.reduce(function (a, b) { return a + b; }) / times.onunmounts.length
      };

      console.log('element count median: ' + averages.count);
      console.log('onmounts median: ' + averages.onmounts);
      console.log('onunmounts median: ' + averages.onunmounts);
      console.log('create median: ' + averages.create);
      console.log('mount median: ' + averages.mount);
      console.log('unmount median: ' + averages.unmount);
      console.log('create + mount: ' + cc(averages.create + averages.mount, c['cyan']));
      console.log('create + mount + unmount: ' + cc(averages.create + averages.mount + averages.unmount, c['magenta']));

      t.pass();
    });
    t.test('lifecycle performance output, 0% lifecycle bound', function (t) {
      t.plan(1);

      var count = 0;
      var onmounts = 0;
      var onunmounts = 0;

      function Base (name, content) {
        var el = html('', content);
        var base = { el };
        count++;

        return base;
      }

      function Apex () {
        return Base('Apex');
      }

      function Leaf () {
        var size = nApexes;
        var apexes = [];
        for (var i = 0; i < size; i++) {
          apexes.push(Apex());
        }
        return Base('Leaf', apexes);
      }

      function Branch () {
        var size = nLeaves;
        var leaves = [];
        for (var i = 0; i < size; i++) {
          leaves.push(Leaf());
        }
        return Base('Branch', leaves);
      }

      function Tree () {
        var size = nBranches;
        var branches = [];
        for (var i = 0; i < size; i++) {
          branches.push(Branch());
        }
        return Base('Tree', branches);
      }

      var times = {
        create: [],
        mount: [],
        unmount: [],
        count: [],
        onmounts: [],
        onunmounts: []
      };

      var time;

      function check () {
        time = Date.now();
        count = 0; // clear count
        onmounts = 0;
        onunmounts = 0;
        var tree = Tree();
        times.create.push(Date.now() - time);

        time = Date.now();
        mount(document.body, tree);
        times.mount.push(Date.now() - time);

        time = Date.now();
        unmount(document.body, tree);
        times.unmount.push(Date.now() - time);

        times.count.push(count);
        times.onmounts.push(onmounts);
        times.onunmounts.push(onunmounts);
      }

      for (let i = 1; i < nIterations + 1; i++) {
        check();
      }

      var averages = {
        create: times.create.reduce(function (a, b) { return a + b; }) / times.create.length,
        mount: times.mount.reduce(function (a, b) { return a + b; }) / times.mount.length,
        unmount: times.unmount.reduce(function (a, b) { return a + b; }) / times.unmount.length,
        count: times.count.reduce(function (a, b) { return a + b; }) / times.count.length,
        onmounts: times.onmounts.reduce(function (a, b) { return a + b; }) / times.onmounts.length,
        onunmounts: times.onunmounts.reduce(function (a, b) { return a + b; }) / times.onunmounts.length
      };

      console.log('element count median: ' + averages.count);
      console.log('onmounts median: ' + averages.onmounts);
      console.log('onunmounts median: ' + averages.onunmounts);
      console.log('create median: ' + averages.create);
      console.log('mount median: ' + averages.mount);
      console.log('unmount median: ' + averages.unmount);
      console.log('create + mount + unmount: ' + cc(averages.create + averages.mount + averages.unmount, c['yellow']));

      t.pass();
    });
  });
};
