declare var require: any
const fs = require('fs')
let fileName = 'input.txt';
// let fileName = 'example.txt';
fs.readFile(fileName, 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    solve(data);
});


function prepare(input: string) {
    let layer = input
        .split('\r\n')
        .map(line => line
            .split('')
            .map(c => c == '#'))
        ;

    let field: boolean[][][] = [];
    field.push(layer)
    return field;
}

function emptyField(lx: number, ly: number, lz: number, lw: number) {
    let field: boolean[][][][] = [];

    for (let w = 0; w < lw; w++) {
        field[w] = [];
        for (let z = 0; z < lz; z++) {
            field[w][z] = [];
            for (let y = 0; y < ly; y++) {
                field[w][z][y] = [];
                for (let x = 0; x < lx; x++) {
                    field[w][z][y][x] = false;
                }
            }
        }
    }
    return field;
}

function calcNeighbors(field: boolean[][][][], cx: number, cy: number, cz: number, cw: number) {
    let lw = field.length;
    let lz = field[0].length;
    let ly = field[0][0].length;
    let lx = field[0][0][0].length;

    let res = 0;
    for (let w = cw - 1; w < cw + 2; w++) {
        for (let z = cz - 1; z < cz + 2; z++) {
            for (let y = cy - 1; y < cy + 2; y++) {
                for (let x = cx - 1; x < cx + 2; x++) {
                    if (!(x == cx && y == cy && z == cz && w == cw) &&
                        x >= 0 && y >= 0 && z >= 0 && w >= 0 &&
                        x < lx && y < ly && z < lz && w < lw) {
                        if (field[w][z][y][x]) {
                            res++;
                        }
                    }
                }
            }
        }
    }
    return res;
}

function calcActive(field: boolean[][][][]) {
    let res = 0;
    let lw = field.length;
    let lz = field[0].length;
    let ly = field[0][0].length;
    let lx = field[0][0][0].length;
    for (let w = 0; w < lw; w++) {
        for (let z = 0; z < lz; z++) {
            for (let y = 0; y < ly; y++) {
                for (let x = 0; x < lx; x++) {
                    if (field[w][z][y][x]) {
                        res++;
                    }
                }
            }
        }
    }
    return res;
}

function isActive(field: boolean[][][][], x: number, y: number, z: number, w: number) {
    let lw = field.length;
    let lz = field[0].length;
    let ly = field[0][0].length;
    let lx = field[0][0][0].length;
    if (x < 0 || y < 0 || z < 0 || w < 0) return false;
    if (w >= lw) return false;
    if (z >= lz) return false;
    if (y >= ly) return false;
    if (x >= lx) return false;
    return field[w][z][y][x];
}

function solve(input: string) {
    let zfield = prepare(input);
    let field: boolean[][][][] = [];
    field.push(zfield);

    for (let i = 0; i < 6; i++) {
        let lw = field.length;
        let lz = field[0].length;
        let ly = field[0][0].length;
        let lx = field[0][0][0].length;

        let newField = emptyField(lx + 2, ly + 2, lz + 2, lw + 2);
        for (let w = 0; w < lw + 2; w++) {
            for (let z = 0; z < lz + 2; z++) {
                for (let y = 0; y < ly + 2; y++) {
                    for (let x = 0; x < lx + 2; x++) {
                        let near = calcNeighbors(field, x - 1, y - 1, z - 1, w - 1);
                        let curActive = isActive(field, x - 1, y - 1, z - 1, w - 1);
                        if (curActive) {
                            if (near >= 2 && near <= 3) {
                                newField[w][z][y][x] = true;
                            } else {
                                newField[w][z][y][x] = false;
                            }
                        } else {
                            if (near == 3) {
                                newField[w][z][y][x] = true;
                            } else {
                                newField[w][z][y][x] = false;
                            }
                        }
                    }
                }
            }
        }
        field = newField;
    }
    let res = calcActive(field);
    console.log(res);
    // 537 too high
}
