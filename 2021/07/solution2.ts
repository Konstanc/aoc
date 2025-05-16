declare var require: any
const fs = require('fs')
let fileName = 'input.txt';
// let fileName = 'example.txt';

fs.readFile(fileName, 'utf8', function (err, input) {
    if (err) {
        return console.log(err);
    }
    solve(input);
});

function prepare(input: string) {
    let data = input
        .split(',').filter(line => line != '')
        .map(s => parseInt(s));
    return data;
}

function calcRes(data: ReturnType<typeof prepare>) {
    data.sort((a, b) => a - b);
    let minFuel = Number.MAX_VALUE;
    for (let i = data[0]; i <= data[data.length - 1]; i++) {
        let fuel = 0;
        for (let j = 0; j < data.length; j++) {
            let dist = Math.abs(i - data[j]);
            fuel += dist * (dist + 1) / 2;
        }
        minFuel = Math.min(minFuel, fuel);
    }
    return minFuel;
}


function solve(input: string) {
    let data = prepare(input);
    let res = calcRes(data);

    console.log(res);
}
