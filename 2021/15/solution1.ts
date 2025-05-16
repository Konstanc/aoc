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

function calcRes(data: ReturnType<typeof prepare>) {
    let riskIndex = {};
    let risks: number[][] = [];
    for (let i = 0; i < data.length; i++) {
        risks[i] = [];
        for (let j = 0; j < data[0].length; j++) {
            risks[i][j] = Number.MAX_VALUE
        }
    }
    risks[0][0] = 0;
    propRisks(0, 0, data, risks, 0)

    let res = risks[data.length - 1][data[0].length - 1];
    return res;
}

let maxDeep = 0;
function propRisks(x: number, y: number, data: number[][], risks: number[][], deep: number) {
    let dxy = [
        [1, 0],
        [0, 1],
        [-1, 0],
        [0, -1],
    ];
    let curRisk = risks[y][x];

    if (deep > maxDeep) {
        maxDeep = deep;
        // console.log(maxDeep);
    }
    let recdxy: number[][] = [];
    for (let i = 0; i < dxy.length; i++) {
        let xx = x + dxy[i][0];
        let yy = y + dxy[i][1];
        if (xx >= 0 && yy >= 0 &&
            xx < data[0].length && yy < data.length
        ) {
            let newRisk = curRisk + data[yy][xx];
            if (newRisk < risks[yy][xx]) {
                risks[yy][xx] = newRisk;
                recdxy.push(dxy[i]);
            }
        }
    }
    for (let i = 0; i < recdxy.length; i++) {
        let xx = x + recdxy[i][0];
        let yy = y + recdxy[i][1];
        if (xx >= 0 && yy >= 0 &&
            xx < data[0].length && yy < data.length
        ) {
            propRisks(xx, yy, data, risks, deep + 1);
        }
    }

}

function solve(input: string) {
    let data = prepare(input);
    let res = calcRes(data);

    console.log(res);

}
