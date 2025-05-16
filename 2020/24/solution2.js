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
    let paths = input
        .split('\r\n')
        .map(line => line
        .split(''));
    return paths;
}
function splitPaths(spaths) {
    let paths = [];
    spaths.forEach(spath => {
        let path = [];
        let curSN = '';
        for (let i = 0; i < spath.length; i++) {
            let l = spath[i];
            if (curSN) {
                path.push(curSN + l);
                curSN = '';
            }
            else {
                if (l == 's' || l == 'n') {
                    curSN = l;
                }
                else {
                    path.push(l);
                }
            }
        }
        paths.push(path);
    });
    return paths;
}
function getBlackTiles(paths) {
    let blacks = {};
    paths
        .map(path => pathToXY(path))
        .forEach(({ x, y }) => {
        let index = x + ',' + y;
        blacks[index] = !blacks[index];
    });
    let blackAR = Object.keys(blacks)
        .filter(key => blacks[key]);
    let field = Array.from(Array(600), () => Array(600));
    blackAR
        .forEach(key => {
        let [x, y] = key.split(',').map(a => parseInt(a));
        field[y + 300][x + 300] = true;
    });
    return field;
}
function calcBlacks(field) {
    let res = 0;
    for (let i = 0; i < field.length; i++) {
        for (let j = 0; j < field[i].length; j++) {
            if (field[i][j]) {
                res++;
            }
        }
    }
    return res;
}
function pathToXY(path) {
    let x = 0;
    let y = 0;
    path.forEach(step => {
        let z = y % 2 == 0;
        switch (step) {
            case 'e':
                x++;
                break;
            case 'se':
                y++;
                x = z ? x : x + 1;
                break;
            case 'sw':
                y++;
                x = z ? x - 1 : x;
                break;
            case 'w':
                x--;
                break;
            case 'nw':
                y--;
                x = z ? x - 1 : x;
                break;
            case 'ne':
                y--;
                x = z ? x : x + 1;
                break;
        }
    });
    return { x, y };
}
function play(field, times) {
    for (let i = 0; i < times; i++) {
        field = getNextField(field);
    }
    return field;
}
function calcNeig(field, x, y) {
    let w = field[0].length;
    let h = field.length;
    let z = y % 2 == 0;
    let dirs = [
        [y, x + 1],
        [y + 1, z ? x : x + 1],
        [y + 1, z ? x - 1 : x],
        [y, x - 1],
        [y - 1, z ? x - 1 : x],
        [y - 1, z ? x : x + 1],
    ];
    let res = dirs.reduce((count, xy) => {
        let ny = xy[0];
        let nx = xy[1];
        if (nx >= 0 && nx < w &&
            ny >= 0 && ny < h &&
            field[ny][nx]) {
            return count + 1;
        }
        else {
            return count;
        }
    }, 0);
    return res;
}
function getNextField(field) {
    let nextField = Array.from(Array(600), () => Array(600));
    for (let y = 0; y < field.length; y++) {
        for (let x = 0; x < field[y].length; x++) {
            let neig = calcNeig(field, x, y);
            if (field[y][x]) { //black
                if (neig == 0 || neig > 2) {
                    nextField[y][x] = false;
                }
                else {
                    nextField[y][x] = true;
                }
            }
            else { //white
                if (neig == 2) {
                    nextField[y][x] = true;
                }
                else {
                    nextField[y][x] = false;
                }
            }
        }
    }
    return nextField;
}
function solve(input) {
    let spaths = prepare(input);
    let paths = splitPaths(spaths);
    let field = getBlackTiles(paths);
    let nextField = play(field, 100);
    let res = calcBlacks(nextField);
    console.log('yo');
}
//# sourceMappingURL=solution2.js.map