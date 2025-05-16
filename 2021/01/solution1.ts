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

function calcInc(depths: number[]) {
    let prev = depths[0];
    let res = 0;
    for (let i = 1; i < depths.length; i++) {
        if (depths[i] > prev) res++;
        prev = depths[i];
    }
    return res;
}


function solve(input: string) {
    let depths = prepare(input);
    let res = calcInc(depths);

    console.log(res);
}
