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
    let sx = data[0].length;
    let sy = data.length;
    for (let i = 1; i < 5; i++) {
        for (let y = sy * i; y < sy * i + sy; y++) {
            data[y] = [];
            for (let x = 0; x < sx; x++) {
                data[y][x] = (data[y - sy][x] + 1);
                if (data[y][x] == 10) data[y][x] = 1;
            }
        }
    }
    for (let i = 1; i < 5; i++) {
        for (let x = sx * i; x < sx * i + sx; x++) {
            for (let y = 0; y < data.length; y++) {
                data[y][x] = (data[y][x - sx] + 1);
                if (data[y][x] == 10) data[y][x] = 1;
            }
        }
    }
    for (let i = 0; i < data.length; i++) {
        risks[i] = [];
        for (let j = 0; j < data[0].length; j++) {
            risks[i][j] = Number.MAX_VALUE;
        }
    }
    risks[0][0] = 0;
    propRisks(data, risks);

    let res = risks[data.length - 1][data[0].length - 1];
    return res;
}

let maxDeep = 0;
function propRisks(data: number[][], risks) {
    let dxy = [
        [1, 0],
        [0, 1],
        [-1, 0],
        [0, -1],
    ];
    let visited = {};
    let candidates = {};
    candidates[[0, 0].join(',')] = 0;
    while (Object.keys(candidates).length > 0) {
        let sorted = Object.keys(candidates)
            .sort((a, b) => candidates[a] - candidates[b]);
        let curKey = sorted[0];
        let xy = curKey.split(',').map(s => parseInt(s));
        let x = xy[0];
        let y = xy[1];
        for (let i = 0; i < dxy.length; i++) {
            let xx = x + dxy[i][0];
            let yy = y + dxy[i][1];
            let newKey = [xx, yy].join(',');
            if (xx >= 0 && yy >= 0 &&
                xx < data[0].length && yy < data.length &&
                !visited[newKey]
            ) {
                risks[yy][xx] = Math.min(risks[yy][xx], risks[y][x] + data[yy][xx]);
                candidates[newKey] = risks[yy][xx];
            }
        }
        delete candidates[curKey];
        visited[curKey] = true;
    }
}

function solve(input: string) {
    let data = prepare(input);
    let res = calcRes(data);

    console.log(res);
}
