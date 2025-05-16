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
    let lines = input.split('\r\n');
    let earliest = parseInt(lines[0]);
    let buses = lines[1]
        .split(',')
        .map(s => s == 'x' ? -1 : parseInt(s));
    return { earliest: earliest, buses };
}


function solve(input) {
    let { earliest, buses } = prepare(input);
    let waits = buses
        .filter(bus => bus >= 0)
        .map(bus => ({ bus, wait: Math.ceil(earliest / bus) * bus }))
        .sort((a, b) => a.wait - b.wait);
    let res = waits[0].wait - earliest;
    res *= waits[0].bus;
    console.log(res);
}
