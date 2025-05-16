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
    let bases = [];
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            let bas = calcBasin(i, j, data);
            if (bas != 0) {
                bases.push(bas)
            }
        }
    }
    return bases.sort((a, b) => b - a).slice(0,3)
        .reduce((acc, val) => acc * val, 1);
}

function calcBasin(x: number, y: number, data: ReturnType<typeof prepare>) {
    let h = data[x][y];
    if (x > 0 && data[x - 1][y] <= h) {
        return 0;
    }
    if (x < data.length - 1 && data[x + 1][y] <= h) {
        return 0;
    }
    if (y > 0 && data[x][y - 1] <= h) {
        return 0;
    }
    if (y < data.length - 1 && data[x][y + 1] <= h) {
        return 0;
    }
    return calcBasSize(x, y, {}, data);
}

function calcBasSize(x: number, y: number, ind, data: ReturnType<typeof prepare>) {
    let cur = 0;
    if (ind[x] && ind[x][y]) {
        return cur;
    } else {
        if (!ind[x]) {
            ind[x] = {};
        }
        ind[x][y] = true;
        if (x >= 0 && x < data[0].length &&
            y >= 0 && y < data.length && data[x][y] != 9) {
            cur += 1;
            cur += calcBasSize(x - 1, y, ind, data);
            cur += calcBasSize(x + 1, y, ind, data);
            cur += calcBasSize(x, y - 1, ind, data);
            cur += calcBasSize(x, y + 1, ind, data);
        } else {
            return cur;
        }
    }
    return cur;
}


function solve(input: string) {
    let data = prepare(input);
    let res = calcRes(data);

    console.log(res);
    // 7181
}
