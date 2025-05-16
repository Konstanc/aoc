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
        .split('\n\n').filter(line => line != '')
        .map(s => s.trim())
        .map(s => s.split('\n').slice(1)
            .map(s => s.split(',')
                .map(s => parseInt(s))
            ));
    return data;
}
const orients = getAllOrientations();

function calcRes(data: ReturnType<typeof prepare>) {
    let res = 0;

    let mIndex = [];
    for (let i = 0; i < data.length; i++) {
        let base = data[i];
        for (let j = 0; j < data.length; j++) {
            if (i != j) {
                let cand = data[j];
                let match = tryMatch(base, cand);
                if (match) {
                    if (!mIndex[i]) {
                        mIndex[i] = {};
                    }
                    if (!mIndex[j]) {
                        mIndex[j] = {};
                    }
                    mIndex[i][j] = { match, to: j, dir: 1 };
                    // mIndex[j][i] = { match, to: i, dir: -1 };
                    console.log('match', i, j);
                }
            }
        }
    }

    let alreadyMatched = {};
    let allCoords = mergeCoords(0, mIndex, alreadyMatched, data);
    
    for (let i = 0; i < allCoords.length; i++) {
        for (let j = i + 1; j < allCoords.length; j++) {
            let dist = 0;
            dist += Math.abs(allCoords[i][0] - allCoords[j][0]);
            dist += Math.abs(allCoords[i][1] - allCoords[j][1]);
            dist += Math.abs(allCoords[i][2] - allCoords[j][2]);
            res = Math.max(res, dist);
        }
    }

    return res;
}

function mergeCoords(i, mMindex, alreadyMatched, data) {
    alreadyMatched[i] = true;
    let base = [[0, 0, 0]];
    Object.values(mMindex[i]).forEach(({ match, to }) => {
        if (alreadyMatched[to]) return;
        let cand = mergeCoords(to, mMindex, alreadyMatched, data);
        let orient = match.orient;
        let cCoords = cand.map(c => {
            return [
                c[orient.r[0]] * orient.o[0],
                c[orient.r[1]] * orient.o[1],
                c[orient.r[2]] * orient.o[2],
            ];
        });
        cCoords = cCoords.map(c => {
            return [
                c[0] - match.d[0],
                c[1] - match.d[1],
                c[2] - match.d[2],
            ];
        });
        for (let i = 0; i < cCoords.length; i++) {
            base.push(cCoords[i]);
        }
    });
    return base;
}

function merge(base: number[][], cand: number[][]) {
    for (let i = 0; i < cand.length; i++) {
        let c = cand[i];
        if (!base.some(b => (
            b[0] == c[0] &&
            b[1] == c[1] &&
            b[2] == c[2]
        ))) {
            base.push(c);
        }
    }
    return base;
}

function tryMatch(base, cand) {
    for (let i = 0; i < orients.length; i++) {
        let orient = orients[i];
        let cCoords = cand.map(c => {
            return [
                c[orient.r[0]] * orient.o[0],
                c[orient.r[1]] * orient.o[1],
                c[orient.r[2]] * orient.o[2],
            ];
        });
        for (let j = 0; j < base.length; j++) {
            let d1 = base[j];
            for (let k = 0; k < cCoords.length; k++) {
                let d2 = cCoords[k];
                let sameCount = countSame(d1, d2, base, cCoords);
                if (sameCount >= 12) {
                    let d = [
                        d2[0] - d1[0],
                        d2[1] - d1[1],
                        d2[2] - d1[2],
                    ];
                    return { orient, d };
                    /* return cCoords.map(c => {
                        return [
                            c[0] - d2[0] + d1[0],
                            c[1] - d2[1] + d1[1],
                            c[2] - d2[2] + d1[2],
                        ];
                    });*/
                }
            }
        }
    }
    return null;
}

function countSame(d1: number[], d2: number[], c1: number[][], c2: number[][]) {
    let res = 0;
    for (let i = 0; i < c1.length; i++) {
        let coord1 = [
            c1[i][0] - d1[0],
            c1[i][1] - d1[1],
            c1[i][2] - d1[2],
        ];
        if (c2.some(val => {
            let coord2 = [
                val[0] - d2[0],
                val[1] - d2[1],
                val[2] - d2[2],
            ];
            return coord1[0] == coord2[0] &&
                coord1[1] == coord2[1] &&
                coord1[2] == coord2[2];
        })) {
            res++;
        }
    }
    return res;
}

function getAllOrientations() {
    let res = [];
    let rotations: number[][] = [];
    for (let i = 0; i <= 2; i++) {
        for (let j = 0; j <= 2; j++) {
            if (j != i) {
                for (let k = 0; k <= 2; k++) {
                    if (k != i && k != j) {
                        rotations.push([i, j, k]);
                    }
                }
            }
        }
    }
    for (let l = 0; l < rotations.length; l++) {
        let r = rotations[l];
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                for (let k = -1; k <= 1; k++) {
                    if (i != 0 && j != 0 && k != 0) {
                        res.push({
                            r: r,
                            o: [i, j, k]
                        }
                        );
                    }
                }
            }
        }
    }
    return res;
}

function solve(input: string) {
    let data = prepare(input);
    let res = calcRes(data);

    console.log(res);
}
