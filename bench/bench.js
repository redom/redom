
var queue = [];

function bench(name, iterator) {
  queue.push({
    name: name,
    iterator: iterator
  });
}

function startBench () {
  var task = queue.shift();

  var p = document.createElement('p');
  var b = document.createElement('b');
  p.appendChild(b);
  b.textContent = 'Benching ' + task.name;
  document.body.appendChild(p);

  setTimeout(function () {
    var result = iterate(task);
    var average = result.average;
    var iterPerSec = result.iterPerSec;

    setTimeout(function () {
      var p = document.createElement('p');
      p.textContent = Math.round(average) + 'ns per iteration (' + (iterPerSec | 0) + ' ops/sec)';
      document.body.appendChild(p);

      if (queue.length) {
        startBench();
      } else {
        var p = document.createElement('h1');
        var b = document.createElement('b');
        p.appendChild(b);
        b.textContent = 'Done!';
      }
    }, 1000);
  }, 1000);
}

function iterate (task) {
  var iterator = task.iterator;

  var maxIterations = 1000000;
  var iterations = maxIterations;

  var start = performance.now();

  while (iterations--) iterator();

  var totalNanos = (performance.now() - start) * 1e6;
  var average = totalNanos / maxIterations;
  var iterPerSec = 1e9 / average;

  return {
    average: average,
    iterPerSec: iterPerSec
  }
}
