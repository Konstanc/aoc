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
    let data = input
        .split('\n').filter(line => line != '')
        .map(s => s.trim());
    return data;
}

const opens = '([{<';
const closes = ')]}>';
const scores = [3, 57, 1197, 25137];

function calcRes(data: ReturnType<typeof prepare>) {
    let res = 0;
    let scores: number[] = []
    for (let i = 0; i < data.length; i++) {
        let line = data[i]
        let auto = complete(line);        
        let score = scoreAuto(auto);
        if (score) {
            scores.push(score);
        }
    }
    scores.sort((a, b) => a - b);
    return scores[Math.floor(scores.length / 2)];
}

function complete(line: string) {
    let stack = [line[0]];
    for (let i = 1; i < line.length; i++) {
        let s = line.substr(i);
        let c = line[i];
        let inOp = opens.indexOf(c);
        if (inOp >= 0) {
            stack.push(c);
        } else {
            if (stack.length > 0 &&
                c != closes[opens.indexOf(stack[stack.length - 1])]) {
                return '';
            } else {
                stack.pop();
            }
        }
    }
    let res = ''
    while (stack.length > 0) {
        let c = stack.pop();
        res = res + closes[opens.indexOf(c)];;
    }
    return res;
}

function scoreAuto(s: string) {
    let res = 0;
    for (let i = 0; i < s.length; i++) {
        res *= 5;
        res += closes.indexOf(s[i]) + 1;
    }
    return res;
}

function solve(input: string) {
    let data = prepare(input);
    let res = calcRes(data);

    console.log(res);
}
