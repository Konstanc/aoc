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
        .split('\n').filter(line => line != '')
        .map(s => s.split('').map(ss => parseInt(ss))
        );
    return data;
}

function calcRes(data: ReturnType<typeof prepare>) {
    let res = 0;
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            res += calcRisk(i, j, data);
        }
    }
    return res;
}

function calcRisk(x: number, y: number, data: ReturnType<typeof prepare>) {
    let h = data[x][y];
    if (x > 0 && data[x-1][y] <= h) {
        return 0;
    }
    if (x < data.length-1 && data[x+1][y] <= h) {
        return 0;
    }
    if (y > 0 && data[x][y-1] <= h) {
        return 0;
    }
    if (y < data.length-1 && data[x][y+1] <= h) {
        return 0;
    }
    return h + 1;
}


function solve(input: string) {
    let data = prepare(input);
    let res = calcRes(data);

    console.log(res);
}
