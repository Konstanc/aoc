fs = require('fs')
let fileName = 'input.txt';
// let fileName = 'example.txt';
fs.readFile(fileName, 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    solve(data);
});

function prepare(input) {
    let numbers = [];
    let ar = input
        .split('\r\n')
        .map(s => parseInt(s));
    return ar;
}

function solve(input) {
    let numbers = prepare(input);
    numbers.sort((a, b) => a - b);
    numbers.unshift(0);
    let ways = Array.from(numbers, el => 0);
    ways[0] = 1;

    for (let i = 1; i < numbers.length; i++){
        let curWays = 0;
        for (let j = Math.max(0, i - 3); j < numbers.length; j++){
            if ((numbers[i] - numbers[j]) <= 3) {
                curWays += ways[j];
            }
        }
        ways[i] = curWays;
    }
    console.log('res', ways[numbers.length - 1]);
}
