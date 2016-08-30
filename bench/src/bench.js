
export function bench(name, iter) {
    console.log(`Benching ${name}`);

    var maxIterations = 1000000;
    var iterations = maxIterations;

    var start = performance.now();

    while (iterations--) iter();

    var totalNanos = (performance.now() - start) * 1e6;
    var average = totalNanos / maxIterations;
    var iterPerSec = 1e9 / average;


    console.log(`- ${Math.round(average)}ns per iteration (${iterPerSec | 0} ops/sec)`);
    console.log('');
}
