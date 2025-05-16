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

function prepareLine(line: string) {
    let curs = '';
    let list: any[];
    let stack = [];
    for (let pos = 0; pos < line.length; pos++) {
        let char = line.charAt(pos);
        switch (char) {
            case '[':
            case ']':
            case ',':
                if (curs != '') {
                    list.push(parseInt(curs));
                    curs = '';
                }
                break;
            default:
                curs += char;
                break;
        }
        switch (char) {
            case '[':
                let newList = [];
                if (list) {
                    list.push(newList);
                    stack.push(list);
                }
                list = newList;
                break;
            case ']':
                list = stack.pop() || list;
                break;
            case ',':
                break;
        }
    }
    return list;
}

function prepare(input: string) {
    let lines = input
        .split('\r\n');
    let res = [];
    for (let i = 0; i < lines.length; i += 3) {
        let left = prepareLine(lines[i]);
        let right = prepareLine(lines[i + 1]);
        res.push([left, right]);
    }
    return res;
}

function comparePair(left: any[] | number, right: any[] | number) {
    if (!Array.isArray(left) && !Array.isArray(right)) {
        return right - left;
    }
    if (!Array.isArray(left)) {
        left = [left];
    }
    if (!Array.isArray(right)) {
        right = [right];
    }
    for (let i = 0; i < left.length && i < right.length; i++) {
        let c = comparePair(left[i], right[i]);
        if (c != 0) return c;
    }
    return right.length - left.length;
}

function calcPairs(pairs: any[][]) {
    return pairs.reduce((acc, cur, index) => acc + (comparePair(cur[0], cur[1]) > 0 ? index + 1 : 0), 0)
}


function solve(input: string) {
    let pairs = prepare(input);
    let res = calcPairs(pairs);

    pairs.forEach((cur, index) => console.log(index+1, comparePair(cur[0], cur[1])))

    console.log(res);
}
