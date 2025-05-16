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
            let ss = s.split(' ');
            let c = ss[1].split(',')
                .map(ss =>
                    ss.substring(2)
                        .split('..')
                        .map(sss => parseInt(sss))
                );
            return {
                on: ss[0] == 'on' ? true : false,
                cub: c
            }

        });
    return data;
}


function calcSize(cub1: number[][], extr: number[][][]) {
    if (extr.length <= 0) {
        return cub1.reduce((acc, c) => acc * (c[1] - c[0] + 1), 1);
    } else {
        let fExtr: number[][][] = [];
        for (let j = 0; j < extr.length; j++) {
            let sCube = subCube(cub1, extr[j])
            if (sCube) {
                fExtr.push(sCube);
            }
        }
        if (fExtr.length) {
            let eCub = fExtr[0];
            let sCubes = substract(cub1, eCub);
            let res = 0;
            let nextExtr = fExtr.slice(1);
            for (let i = 0; i < sCubes.length; i++) {
                res += calcSize(sCubes[i], nextExtr);
            }
            return res;
        } else {
            return calcSize(cub1, []);
        }
    }

}

function calcRes(data: ReturnType<typeof prepare>) {
    let res = 0;

    for (let i = 0; i < data.length; i++) {
        let step = data[i];
        if (step.on) {
            let cScount = 0;
            let extr: number[][][] = [];
            for (let j = i + 1; j < data.length; j++) {
                let nextStep = data[j];
                let sCube = subCube(step.cub, nextStep.cub);
                if (sCube) {
                    extr.push(sCube);
                    cScount++;
                }
            }

            res += calcSize(step.cub, extr);
        }
    }
    return res;
}

function subCube(cub1: number[][], cub2: number[][]) {
    if (!findOverlaping(cub1, cub2)) {
        let a = '';
    }
    let res: number[][] = [
        [0, 0],
        [0, 0],
        [0, 0],
    ];
    for (let c = 0; c < 3; c++) {
        res[c][0] = Math.max(cub1[c][0], cub2[c][0]);
        res[c][1] = Math.min(cub1[c][1], cub2[c][1]);
        if (res[c][0] > res[c][1]) {
            return null;
        }
    }
    return res;
}

function substract(cub1: number[][], cub2: number[][]) {
    let ol = findOverlaping(cub1, cub2);
    if (!ol) {
        return [cub1];
    }
    let res: number[][][] = [[
        [0, 0],
        [0, 0],
        [0, 0],
    ]];
    let xx = [
        [cub1[0][0], cub2[0][0] - 1],
        [cub2[0][0], cub2[0][1]],
        [cub2[0][1] + 1, cub1[0][1]],
    ];
    for (let c = 0; c < 3; c++) {
        let newRes: number[][][] = [];
        let divs = [
            [cub1[c][0], cub2[c][0] - 1],
            [cub2[c][0], cub2[c][1]],
            [cub2[c][1] + 1, cub1[c][1]],
        ];
        for (let i = 0; i < res.length; i++) {
            for (let j = 0; j < divs.length; j++) {
                let cube = [...res[i]];
                cube[c] = divs[j];
                newRes.push(cube);
            }
        }
        res = newRes;
    }
    res = res.filter(cube => {
        for (let c = 0; c < 3; c++) {
            if (cube[c][0] > cube[c][1]) {
                return false;
            }
        }
        let insideCub2 = true;
        for (let c = 0; c < 3; c++) {
            if (cube[c][0] < cub2[c][0] ||
                cube[c][0] > cub2[c][1]) {
                insideCub2 = false;
            }
        }
        if (insideCub2) return false;
        return true;
    });
    return res;
}

function findOverlaping(cub: number[][], cub2: number[][]) {
    if ((cub[0][0] <= cub2[0][1] || cub[0][1] >= cub2[0][0]) &&
        (cub[1][0] <= cub2[1][1] || cub[1][1] >= cub2[1][0]) &&
        (cub[2][0] <= cub2[2][1] || cub[2][1] >= cub2[2][0])
    ) {
        return true;
    }
    return false;
}

function solve(input: string) {
    let data = prepare(input);
    let res = calcRes(data);

    console.log(res);
}
