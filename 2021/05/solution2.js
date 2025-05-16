const fs = require('fs');
let fileName = 'input.txt';
// let fileName = 'example.txt';
fs.readFile(fileName, 'utf8', function (err, input) {
    if (err) {
        return console.log(err);
    }
    solve(input);
});
function prepare(input) {
    let data = input
        .split('\n').filter(line => line != '')
        .map(line => {
        let ss = line.split(' -> ');
        let xy = ss[0].split(',')
            .map(s => parseInt(s));
        let xy2 = ss[1].split(',')
            .map(s => parseInt(s));
        return {
            x1: xy[0],
            y1: xy[1],
            x2: xy2[0],
            y2: xy2[1],
        };
    });
    return data;
}
function calcRes(data) {
    let fData = data.filter(d => {
        return d.x1 == d.x2 ||
            d.y1 == d.y2 ||
            (Math.abs(d.x1 - d.x2) == Math.abs(d.y1 - d.y2));
    });
    let map = {};
    for (let i = 0; i < fData.length; i++) {
        let line = fData[i];
        if (line.x1 == line.x2) {
            for (let y = Math.min(line.y1, line.y2); y <= Math.max(line.y1, line.y2); y++) {
                addDot(line.x1, y, map);
            }
        }
        else if (line.y1 == line.y2) {
            for (let x = Math.min(line.x1, line.x2); x <= Math.max(line.x1, line.x2); x++) {
                addDot(x, line.y2, map);
            }
        }
        else {
            let a = '';
            for (let d = 0; d <= Math.abs(line.x1 - line.x2); d++) {
                let x = line.x1;
                let y = line.y1;
                if (line.x1 < line.x2) {
                    x += d;
                }
                else {
                    x -= d;
                }
                if (line.y1 < line.y2) {
                    y += d;
                }
                else {
                    y -= d;
                }
                addDot(x, y, map);
            }
        }
    }
    let res = 0;
    Object.keys(map).forEach(x => {
        Object.keys(map[x]).forEach(y => {
            if (map[x][y] > 1) {
                res++;
            }
        });
    });
    return res;
}
function addDot(x, y, map) {
    if (!map[x]) {
        map[x] = {};
    }
    if (!map[x][y]) {
        map[x][y] = 1;
    }
    else {
        map[x][y] = map[x][y] + 1;
    }
}
function solve(input) {
    let data = prepare(input);
    let res = calcRes(data);
    console.log(res);
}
//# sourceMappingURL=solution2.js.map