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

function calcRes(data: ReturnType<typeof prepare>) {
    let res = 0;
    let cubes: number[][][] = [];
    for (let i = 0; i < data.length; i++) {
        let step = data[i];
        if (step.on) {
            let newCubes: number[][][] = [];
            for (let j = 0; j < cubes.length; j++) {
                const oldCube = cubes[j];
                let sCubes = substract(oldCube, step.cub);
                newCubes.push(...sCubes);
            }
            newCubes.push(step.cub);
            cubes = newCubes;
        } else {    // off
            let newCubes: number[][][] = [];
            for (let j = 0; j < cubes.length; j++) {
                const oldCube = cubes[j];
                let sCubes = substract(oldCube, step.cub);
                newCubes.push(...sCubes);
            }
            cubes = newCubes;
        }

    }
    for (let i = 0; i < cubes.length; i++) {
        let cub = cubes[i];
        res += (cub[0][1] - cub[0][0] + 1) *
            (cub[1][1] - cub[1][0] + 1) *
            (cub[2][1] - cub[2][0] + 1);
    }

    return res;
}

function subCube(cub1: number[][], cub2: number[][]) {
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
	// missed this cast to success :(
	// had too much cubes as a result without this
    cub2 = subCube(cub1, cub2);
    if (!cub2) {
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
    if (cub1[0][0] >= cub2[0][0] && cub1[0][1] <= cub2[0][1] &&
        cub1[1][0] >= cub2[1][0] && cub1[1][1] <= cub2[1][1] &&
        cub1[2][0] >= cub2[2][0] && cub1[2][1] <= cub2[2][1]
    ) {
        if (res.length > 0) {
            console.log('alarm');
        }
    }
    return res;
}

function isOverlaping(cub: number[][], cub2: number[][]) {
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
