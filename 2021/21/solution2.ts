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
    let res = 0;
    let pos1 = data.p1Start;
    let pos2 = data.p2Start;
    let cur = 0;
    let p1Score = 0;
    let p2Score = 0;
    let steps = 0;

    let board = {
        pos: [data.p1Start, data.p2Start],
        curPlayer: 0,
        score: [0, 0]
    }
    let wins = getWins(board.pos, board.curPlayer, board.score);    
    return Math.max(...wins);
}

let wIndex = {};
function getWins(
    pos: number[],
    curPlayer: number,
    score: number[],
) {
    let res = [0, 0];
    for (let j = 0; j < 2; j++) {
        if (score[j] >= 21) {
            res[j]++;
            return res;
        }
    }
    let ind = [pos.join(','), curPlayer, score.join(',')].join('_');
    if (wIndex[ind]) {
        return wIndex[ind];
    }

    for (let roll = 3; roll <= 9; roll++) {
        let prob = dices[roll];
        let nextPos = pos[curPlayer] + roll;
        while (nextPos > 10) {
            nextPos -= 10;
        }
        let newScore = [...score];
        newScore[curPlayer] += nextPos;
        let newPos = [...pos];
        newPos[curPlayer] = nextPos;
        let newCurPlayer = curPlayer == 0 ? 1 : 0;
        let wins = getWins(newPos, newCurPlayer, newScore);
        for (let j = 0; j < 2; j++) {
            res[j] = res[j] + prob * wins[j];
        }
    }
    wIndex[ind] = res;
    return res;
}

const dices: number[] = prepareDices();

function prepareDices() {
    let res: number[] = [];
    for (let i = 1; i <= 3; i++) {
        for (let j = 1; j <= 3; j++) {
            for (let k = 1; k <= 3; k++) {
                let r = i + j + k;
                if (!res[r]) {
                    res[r] = 1;
                } else {
                    res[r] += 1;
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
