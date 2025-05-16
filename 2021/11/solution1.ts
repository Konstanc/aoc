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
        .map(s => s.trim())
        .map(s => s.split('')
            .map(s => parseInt(s))
        );
    return data;
}

const opens = '([{<';
const closes = ')]}>';
const scores = [3, 57, 1197, 25137];

function calcRes(data: ReturnType<typeof prepare>) {
    let res = 0;
    for (let i = 0; i < 100; i++) {
        let line = data[i];
        res += step(data);
    }
    return res;
}

function step(data) {
    let res = 0;
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[0].length; j++) {
            data[i][j] = data[i][j] + 1;
        }
    }
    let wasFlash = true;
    let flashIndex = {};
    while (wasFlash) {
        wasFlash = false;
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[0].length; j++) {
                if (data[i][j] > 9) {
                    wasFlash = true;
                    res++;
                    data[i][j] = 0;
                    if (!flashIndex[i]) {
                        flashIndex[i] = {};
                    }
                    flashIndex[i][j] = true;

                    for (let ii = Math.max(i - 1, 0); ii < Math.min(i + 2, data.length); ii++) {
                        for (let jj = Math.max(j - 1, 0); jj < Math.min(j + 2, data[0].length); jj++) {
                            if (!(ii == i && jj == j)) {
                                data[ii][jj] = data[ii][jj] + 1;
                            }
                        }
                    }

                }
            }
        }
    }
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[0].length; j++) {
            if (flashIndex[i] && flashIndex[i][j]) {
                data[i][j] = 0;
            }
        }
    }
    return res;
}

function solve(input: string) {
    let data = prepare(input);
    let res = calcRes(data);

    console.log(res);
    // 1746
    // 1705
}
