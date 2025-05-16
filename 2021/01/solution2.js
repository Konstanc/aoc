const fs = require('fs');
let fileName = 'input.txt';
// let fileName = 'example.txt';
fs.readFile(fileName, 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    solve(data);
});
function prepare(input) {
    let depths = input
        .split('\n')
        .map(line => parseInt(line));
    return depths;
}
function windowAt(n, depths) {
    let res = 0;
    for (let i = Math.max(0, n); i < Math.min(depths.length, n + 3); i++) {
        res += depths[i];
    }
    return res;
}
function calcInc(depths) {
    let prev = windowAt(0, depths);
    let res = 0;
    for (let i = 1; i < depths.length; i++) {
        if (windowAt(i, depths) > prev)
            res++;
        prev = windowAt(i, depths);
    }
    return res;
}
function solve(input) {
    let depths = prepare(input);
    let res = calcInc(depths);
    console.log(res);
    // 1192
}
//# sourceMappingURL=solution2.js.map