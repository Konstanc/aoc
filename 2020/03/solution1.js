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
    return lines
        .map(line => line
            .split('')
            .map(s => s == '#')
        );
}

function checkSlope(map, hSlope, vSlope) {
    let width = map[0].length;
    let height = map.length;
    let trees = 0;
    let x = 0, y = 0;
    while (y < height) {
        // console.log(y, x % width, x);
        if (map[y][x % width]) {
            trees++;
        }
        x += hSlope;
        y += vSlope;
    }
    return trees;
}

let slopes = [
    [1, 1],
    [3, 1],
    [5, 1],
    [7, 1],
    [1, 2],
];
function solve(input) {
    let map = prepare(input);
    let res = slopes
        .reduce(
            // ([hSlope, vSlope], res) => res * checkSlope(map, hSlope, vSlope),
            (res, slope) =>
                res * checkSlope(map, slope[0], slope[1]),
            1);
    console.log(res);
}
