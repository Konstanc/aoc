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
    let bags: number[][] = [];
    let curBag: number[] = [];
    bags.push(curBag);
    input
        .split('\n')
        .forEach(line => {
            let lineVal = parseInt(line);
            if (isNaN(lineVal)) {
                curBag = [];
                bags.push(curBag);
            } else {
                curBag.push(lineVal);
            }
        });
    return bags;
}

function calcTop3Elf(bags: number[][]) {
    let sorted = bags.map(cur => cur.reduce((sPrev, sCur) => sPrev + sCur, 0))
        .sort((a, b) => a - b);

    let res = sorted.slice(sorted.length - 3)
        .reduce((prev, cur) => prev + cur, 0);
    return res;
}


function solve(input: string) {
    let bags = prepare(input);
    let res = calcTop3Elf(bags);

    console.log(res);
}
