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
    // target area: x=111..161, y=-154..-101

    return {
        xArea: [111, 161],
        yArea: [-154, -101]
    };
}

function calcRes(data: ReturnType<typeof prepare>) {
    let res = 0;
    let cur = 0;
    let svX = 1;
    let found = false;
    let maxY = data.yArea[0] - 1;

    let reachedMaxVX = false;
    while (!reachedMaxVX) {
        let reachedMaxVY = false;
        let svY = data.yArea[0];
        let canReachX = false;
        let vXTest = svX;
        let xTest = 0;
        while (!canReachX && vXTest > 0) {
            xTest += vXTest;
            if (xTest >= data.xArea[0] && xTest <= data.xArea[1]) {
                canReachX = true;
            }
            if (vXTest > 0) { vXTest--; }
            if (vXTest < 0) { vXTest++; }
        }
        while (canReachX && !reachedMaxVY) {
            let vX = svX
            let vY = svY;
            let x = 0;
            let y = 0;
            let prevX = 0;
            let prevY = 0;
            let overShoot = false;
            let hit = false;
            let curMaxY = 0;
            while (!overShoot && !hit) {
                x = prevX + vX;
                y = prevY + vY;
                if (vX > 0) { vX--; }
                if (vX < 0) { vX++; }
                vY--;
                curMaxY = Math.max(curMaxY, y);

                if (x >= data.xArea[0] && x <= data.xArea[1] &&
                    y >= data.yArea[0] && y <= data.yArea[1]) {
                    hit = true;
                    maxY = Math.max(maxY, curMaxY);
                    // console.log(maxY);
                }

                if (vX == 0 &&
                    (x < data.xArea[0] || x > data.xArea[1])) {
                    overShoot = true;
                }
                if (y < data.yArea[0]) {
                    overShoot = true;
                }
                
                prevX = x;
                prevY = y;
            }
            svY++;
            if (svY > Math.abs(data.yArea[0])) {
                reachedMaxVY = true;
            }
        }
        svX++;
        if (svX > data.xArea[1]) {
            reachedMaxVX = true;
        }

    }
    return maxY;
}

function solve(input: string) {
    let data = prepare(input);
    let res = calcRes(data);

    console.log(res);
    // 11781
}
