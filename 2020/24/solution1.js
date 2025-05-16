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
    return blackAR;
}
function pathToXY(path) {
    let x = 0;
    let y = 0;
    path.forEach(step => {
        let z = y % 2 == 0;
        ;
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
function solve(input) {
    let spaths = prepare(input);
    let paths = splitPaths(spaths);
    let res = getBlackTiles(paths);
    console.log(res.length);
}
//# sourceMappingURL=solution1.js.map