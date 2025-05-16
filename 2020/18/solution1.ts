declare var require: any
const fs = require('fs')
let fileName = 'input.txt';
// let fileName = 'example.txt';
fs.readFile(fileName, 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    solve(data);
});

type ExItem = {
    type: 'symbol' | 'operand' | 'sub';
    val: string | number | ExItem[];
};
const breaks = [' ', '+', '*', '(', ')'];

function findNextBreak(line) {
    for (let i = 0; i < line.length; i++) {
        if (breaks.some(b => b == line[i])) {
            return i;
        }
    }
    return line.length();
}

function prepare(input: string) {
    let a = { type: 'symbol', val: 3 };
    let list = input
        .split('\r\n')
        .map(line => {
            let example: {
                type: 'symbol' | 'operand';
                val: string | number;
            }[] = [];
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
                            example.push({ type: 'symbol', val: line[pos] })
                        }
                    } else {
                        curS += line[pos];
                    }
                } else {
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
function opValue(op: ExItem) {
    if (op.type == 'sub') {
        return calcEx(op.val as ExItem[]);
    } else {
        return op.val as number;
    }
}

function findClosePair(example: ExItem[], start: number) {
    let count = 1;
    for (let i = start; i < example.length; i++) {
        if (example[i].val == '(') {
            count++;
        } else if (example[i].val == ')') {
            count--;
            if (count == 0) {
                return i;
            }
        }
    }
    return example.length;
}

function toAst(example: ExItem[]): ExItem[] {
    let openPos = example.findIndex(item => item.val == '(');
    if (openPos >= 0) {
        let closePos = findClosePair(example, openPos + 1);
        let res: ExItem[] = [];
        if (openPos > 0) {
            res.push(...example.slice(0, openPos));
        }
        res.push({ type: 'sub', val: toAst(example.slice(openPos + 1, closePos)) });
        if (closePos < example.length - 1) {
            res.push(...toAst(example.slice(closePos + 1)));
        }
        return res;
    } else {
        return example;
    }

}

function calcEx(example: ExItem[]) {
    if (example.length == 1) {
        return example[0].val as number
    }

    let operand1 = opValue(example[0]);
    let op = example[1].val;
    let operand2 = opValue(example[2]);
    let res: number
    if (op == '+') {
        res = operand1 + operand2;
    } else {
        res = operand1 * operand2;
    }
    return calcEx([{
        type: 'operand',
        val: res
    }, ...example.slice(3)])

}

function solve(input: string) {
    let list = prepare(input);

    let ar = list
        .map(ex => toAst(ex))
        .map(ex => calcEx(ex));
    let res = ar.reduce((res, val) => res + val, 0);

    console.log(res);
}
