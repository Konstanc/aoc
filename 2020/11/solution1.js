fs = require('fs')
let fileName = 'input.txt';
// let fileName = 'example.txt';
fs.readFile(fileName, 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    solve(data);
});

function prepare(input) {
    let map = [];
    let ar = input
        .split('\r\n')
        .map(s => s.split(''));
    return ar;
}

function calcNear(x, y, map) {
    let res = 0;
    for (let i = Math.max(y - 1, 0); i < Math.min(y + 2, map.length); i++) {
        for (let j = Math.max(x - 1, 0); j < Math.min(x + 2, map[0].length); j++) {
            if (!(i == y && j == x)) {
                if (map[i][j] == '#')
                    res++;
            }
        }
    }
    return res;
}

function sameMaps(map1, map2) {
    for (let i = 0; i < map1.length; i++) {
        for (let j = 0; j < map1[0].length; j++) {
            if (map1[i][j] != map2[i][j]) return false;
        }
    }
    return true;
}

function getNextMap(prevMap) {
    let nextMap = Array.from(prevMap, () => Array.from(prevMap[0], () => ''));
    for (let i = 0; i < prevMap.length; i++) {
        for (let j = 0; j < prevMap[0].length; j++) {
            if (i == 1 && j == 0) {
                let a = '';
            }
            if (prevMap[i][j] == '.') {
                nextMap[i][j] = '.';
            } else {
                let near = calcNear(j, i, prevMap);
                if (prevMap[i][j] == 'L' && near == 0) {
                    nextMap[i][j] = '#';
                } else if (prevMap[i][j] == '#' && near >= 4) {
                    nextMap[i][j] = 'L';
                } else {
                    nextMap[i][j] = prevMap[i][j];
                }
            }
        }
    }
    return nextMap;
}

function solve(input) {
    let map = prepare(input);
    let nextMap = getNextMap(map);
    while (!sameMaps(nextMap, map)) {
        map = nextMap;
        nextMap = getNextMap(map);
    }
    let res = 0;
    for (let i = 0; i < nextMap.length; i++) {
        for (let j = 0; j < nextMap[0].length; j++) {
            if (nextMap[i][j] == '#') {
                res++;
            }
        }
    }

    console.log(res);
}
