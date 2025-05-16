declare var require: any
const fs = require('fs')
let fileName = 'input.txt';
// let fileName = 'example.txt';
fs.readFile(fileName, 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    solve(data);
});

function prepare(input: string) {
    let depths = input
        .split('\n')
        .map(line => parseInt(line));
    return depths;
}

function windowAt(n: number, depths: number[]) {
    let res = 0;
    for (let i = Math.max(0, n); i < Math.min(depths.length, n + 3); i++) {
        res += depths[i];
    }
    return res;
}

function calcInc(depths: number[]) {
    let prev = windowAt(0, depths);
    let res = 0;
    for (let i = 1; i < depths.length; i++) {
        if (windowAt(i, depths) > prev) res++;
        prev = windowAt(i, depths);
    }
    return res;
}


function solve(input: string) {
    let depths = prepare(input);
    let res = calcInc(depths);

    console.log(res);
    // 1192
}
