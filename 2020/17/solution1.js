const fs = require('fs');
let fileName = 'input.txt';
// let fileName = 'example.txt';
fs.readFile(fileName, 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    solve(data);
});
function prepare(input) {
    let layer = input
        .split('\r\n')
        .map(line => line
        .split('')
        .map(c => c == '#'));
    let field = [];
    field.push(layer);
    return field;
}
function emptyField(lx, ly, lz) {
    let field = [];
    for (let z = 0; z < lz; z++) {
        field[z] = [];
        for (let y = 0; y < ly; y++) {
            field[z][y] = [];
            for (let x = 0; x < lx; x++) {
                field[z][y][x] = false;
            }
        }
    }
    return field;
}
function calcNeighbors(field, cx, cy, cz) {
    let lz = field.length;
    let ly = field[0].length;
    let lx = field[0][0].length;
    let res = 0;
    for (let z = cz - 1; z < cz + 2; z++) {
        for (let y = cy - 1; y < cy + 2; y++) {
            for (let x = cx - 1; x < cx + 2; x++) {
                if (!(x == cx && y == cy && z == cz) &&
                    x >= 0 && y >= 0 && z >= 0 &&
                    x < lx && y < ly && z < lz) {
                    if (field[z][y][x]) {
                        res++;
                    }
                }
            }
        }
    }
    return res;
}
function calcActive(field) {
    let res = 0;
    let lz = field.length;
    let ly = field[0].length;
    let lx = field[0][0].length;
    for (let z = 0; z < lz; z++) {
        for (let y = 0; y < ly; y++) {
            for (let x = 0; x < lx; x++) {
                if (field[z][y][x]) {
                    res++;
                }
            }
        }
    }
    return res;
}
function isActive(field, x, y, z) {
    let lz = field.length;
    let ly = field[0].length;
    let lx = field[0][0].length;
    if (x < 0 || y < 0 || z < 0)
        return false;
    if (z >= lz)
        return false;
    if (y >= ly)
        return false;
    if (x >= lx)
        return false;
    return field[z][y][x];
}
function solve(input) {
    let field = prepare(input);
    for (let i = 0; i < 6; i++) {
        let lz = field.length;
        let ly = field[0].length;
        let lx = field[0][0].length;
        let newField = emptyField(lx + 2, ly + 2, lz + 2);
        for (let z = 0; z < lz + 2; z++) {
            for (let y = 0; y < ly + 2; y++) {
                for (let x = 0; x < lx + 2; x++) {
                    let near = calcNeighbors(field, x - 1, y - 1, z - 1);
                    let curActive = isActive(field, x - 1, y - 1, z - 1);
                    if (curActive) {
                        if (near >= 2 && near <= 3) {
                            newField[z][y][x] = true;
                        }
                        else {
                            newField[z][y][x] = false;
                        }
                    }
                    else {
                        if (near == 3) {
                            newField[z][y][x] = true;
                        }
                        else {
                            newField[z][y][x] = false;
                        }
                    }
                }
            }
        }
        field = newField;
    }
    let res = calcActive(field);
    console.log(res);
}
//# sourceMappingURL=solution1.js.map