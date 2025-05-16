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
    return {
        p1Start: 2,
        p2Start: 7
    }
}

function calcRes(data: ReturnType<typeof prepare>) {
    let pos1 = data.p1Start;
    let pos2 = data.p2Start;
    let cur = 0;
    let p1Score = 0;
    let p2Score = 0;
    let steps = 0;
    while (p1Score < 1000 && p2Score < 1000) {
        steps++;
        let r1 = roll(cur);
        cur = r1.cur;
        pos1 += r1.res;
        while (pos1 > 10) {
            pos1 -= 10;
        }
        p1Score += pos1;
        if (p1Score < 1000) {
            steps++;
            let r2 = roll(cur);
            cur = r2.cur;
            pos2 += r2.res;
            while (pos2 > 10) {
                pos2 -= 10;
            }
            p2Score += pos2;
        }
    }
    if (p1Score < 1000) {
        return p1Score * steps * 3;
    } else {
        return p2Score * steps * 3;
    }


function roll(cur: number) {
    let res = 0;
    for (let i = 0; i < 3; i++) {
        cur++;
        // if (cur > 6) cur = 1;
        res += cur;
    }
    return { res, cur }
}



function solve(input: string) {
    let data = prepare(input);
    let res = calcRes(data);

    console.log(res);
}
