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
    let data = input.trim()
        .split('\n').filter(line => line != '')
        .map(s => s.trim())
        .map(s => {
            let ss = s.split('');
            return ss;

        });
    return data;
}

function calcRes(data: ReturnType<typeof prepare>) {
    let res = 0;

    let step = 0;
    let moved = true;
    while (moved) {
        moved = false;
        let r = doDtep(data);
        if (r.moved) {
            moved = true;
        }
        data = r.res;
        step++;
    }
    return step;
}

function doDtep(data: ReturnType<typeof prepare>) {
    let moved = false;
    let res = data.map(d => [...d]);
    for (let y = 0; y < data.length; y++) {
        const row = data[y];
        let nextY = y;

        for (let x = 0; x < row.length; x++) {
            let val = row[x];
            let nextX = x < row.length - 1 ? x + 1 : 0;
            if (val == '>' && data[nextY][nextX] == '.') {
                res[y][x] = '.';
                res[nextY][nextX] = '>';
                moved = true;
            }
        }
    }
    let prevRes = res;
    let res2 = res.map(d => [...d]);
    res = res2;
    for (let y = 0; y < prevRes.length; y++) {
        const row = prevRes[y];
        let nextY = y < prevRes.length - 1 ? y + 1 : 0;
        for (let x = 0; x < row.length; x++) {
            let val = row[x];
            let nextX = x;
            if (val == 'v'&& prevRes[nextY][nextX] == '.') {
                res[y][x] = '.';
                res[nextY][nextX] = 'v';
                moved = true;
            }
        }
    }

    return { moved, res }
}

function solve(input: string) {
    let data = prepare(input);
    let res = calcRes(data);

    console.log(res);

}
