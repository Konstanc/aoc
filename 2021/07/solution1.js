const fs = require('fs');
let fileName = 'input.txt';
// let fileName = 'example.txt';
fs.readFile(fileName, 'utf8', function (err, input) {
    if (err) {
        return console.log(err);
    }
    solve(input);
});
function prepare(input) {
    let data = input
        .split(',').filter(line => line != '')
        .map(s => parseInt(s));
    return data;
}
function calcRes(data) {
    data = data.sort();
    let minFuel = Number.MAX_VALUE;
    for (let i = 0; i < data.length; i++) {
        let fuel = 0;
        for (let j = 0; j < data.length; j++) {
            fuel += Math.abs(data[i] - data[j]);
        }
        minFuel = Math.min(minFuel, fuel);
    }
    return minFuel;
}
function solve(input) {
    let data = prepare(input);
    let res = calcRes(data);
    console.log(res);
}
//# sourceMappingURL=solution1.js.map