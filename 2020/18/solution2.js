const fs = require('fs');
let fileName = 'input.txt';
// let fileName = 'example.txt';
fs.readFile(fileName, 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    solve(data);
});
const breaks = [' ', '+', '*', '(', ')'];
function findNextBreak(line) {
    for (let i = 0; i < line.length; i++) {
        if (breaks.some(b => b == line[i])) {
            return i;
        }
    }
    return line.length();
}
function prepare(input) {
    let a = { type: 'symbol', val: 3 };
    let list = input
        .split('\r\n')
        .map(line => {
        let example = [];
        let pos = 0;
        let curS = '';
        do {
            let pushOp = false;
            if (pos < line.length) {
                if (breaks.some(b => b == line[pos])) {
                    if (curS.length > 0) {
                        example.push({ type: 'operand', val: parseInt(curS) });
                        curS = '';
                    }
                    if (line[pos] != ' ') {
                        example.push({ type: 'symbol', val: line[pos] });
                    }
                }
                else {
                    curS += line[pos];
                }
            }
            else {
                if (curS.length > 0) {
                    example.push({ type: 'operand', val: parseInt(curS) });
                    curS = '';
                }
            }
            pos++;
        } while (pos <= line.length);
        return example;
    });
    return list;
}
function opValue(op) {
    if (op.type == 'sub') {
        return calcEx(op.val);
    }
    else {
        return op.val;
    }
}
function findClosePair(example, start) {
    let count = 1;
    for (let i = start; i < example.length; i++) {
        if (example[i].val == '(') {
            count++;
        }
        else if (example[i].val == ')') {
            count--;
            if (count == 0) {
                return i;
            }
        }
    }
    return example.length;
}
function toAst(example) {
    let res = [];
    let openPos = example.findIndex(item => item.val == '(');
    if (openPos >= 0) {
        let closePos = findClosePair(example, openPos + 1);
        if (openPos > 0) {
            res.push(...example.slice(0, openPos));
        }
        res.push({ type: 'sub', val: toAst(example.slice(openPos + 1, closePos)) });
        if (closePos < example.length - 1) {
            res.push(...toAst(example.slice(closePos + 1)));
        }
    }
    else {
        res = example;
    }
    if (res.length > 3) {
        let plusPos = res.findIndex(item => item.val == '+');
        if (plusPos > 0) {
            let res2 = [];
            if (plusPos > 1) {
                res2.push(...res.slice(0, plusPos - 1));
            }
            res2.push({ type: 'sub', val: res.slice(plusPos - 1, plusPos + 2) });
            if (plusPos < res.length - 2) {
                res2.push(...res.slice(plusPos + 2));
            }
            res = toAst(res2);
        }
    }
    return res;
}
function calcEx(example) {
    if (example.length == 1) {
        return example[0].val;
    }
    let operand1 = opValue(example[0]);
    let op = example[1].val;
    let operand2 = opValue(example[2]);
    let res;
    if (op == '+') {
        res = operand1 + operand2;
    }
    else {
        res = operand1 * operand2;
    }
    return calcEx([{
            type: 'operand',
            val: res
        }, ...example.slice(3)]);
}
function solve(input) {
    let list = prepare(input);
    let ar = list
        .map(ex => toAst(ex))
        .map(ex => calcEx(ex));
    let res = ar.reduce((res, val) => res + val, 0);
    console.log(res);
}
//# sourceMappingURL=solution2.js.map