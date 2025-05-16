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
    let paths = input
        .split('\n')
        .map(line => parseInt(line));
    return paths;
}

function findFirstTwice(freqChanges: number[]) {
    let freqs = {};
    freqs[0] = true;
    let freq = 0;
    let i = 0;
    while (true) {
        freq += freqChanges[i];
        if (freqs[freq]) return freq;
        freqs[freq] = true;
        i++;
        if (i >= freqChanges.length) i = 0;
    }
}

function solve(input: string) {
    let freqChanges = prepare(input);
    let res = findFirstTwice(freqChanges);

    console.log(res);
}
